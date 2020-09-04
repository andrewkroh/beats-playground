package main

import (
	"bufio"
	"bytes"
	"encoding/json"
	"flag"
	"fmt"
	"log"
	"net/http"
	"time"

	assetfs "github.com/elazarl/go-bindata-assetfs"
	"github.com/rs/cors"
	"gopkg.in/yaml.v2"

	"github.com/elastic/beats/v7/libbeat/beat"
	"github.com/elastic/beats/v7/libbeat/common"
	"github.com/elastic/beats/v7/libbeat/processors"

	_ "github.com/elastic/beats/v7/libbeat/processors/actions"
	_ "github.com/elastic/beats/v7/libbeat/processors/add_cloud_metadata"
	_ "github.com/elastic/beats/v7/libbeat/processors/add_docker_metadata"
	_ "github.com/elastic/beats/v7/libbeat/processors/add_formatted_index"
	_ "github.com/elastic/beats/v7/libbeat/processors/add_host_metadata"
	_ "github.com/elastic/beats/v7/libbeat/processors/add_id"
	_ "github.com/elastic/beats/v7/libbeat/processors/add_kubernetes_metadata"
	_ "github.com/elastic/beats/v7/libbeat/processors/add_locale"
	_ "github.com/elastic/beats/v7/libbeat/processors/add_observer_metadata"
	_ "github.com/elastic/beats/v7/libbeat/processors/add_process_metadata"
	_ "github.com/elastic/beats/v7/libbeat/processors/communityid"
	_ "github.com/elastic/beats/v7/libbeat/processors/convert"
	_ "github.com/elastic/beats/v7/libbeat/processors/decode_csv_fields"
	_ "github.com/elastic/beats/v7/libbeat/processors/dissect"
	_ "github.com/elastic/beats/v7/libbeat/processors/dns"
	_ "github.com/elastic/beats/v7/libbeat/processors/extract_array"
	_ "github.com/elastic/beats/v7/libbeat/processors/fingerprint"
	_ "github.com/elastic/beats/v7/libbeat/processors/registered_domain"
	_ "github.com/elastic/beats/v7/libbeat/processors/script"
	_ "github.com/elastic/beats/v7/libbeat/processors/timeseries"
	_ "github.com/elastic/beats/v7/libbeat/processors/timestamp"
	_ "github.com/elastic/beats/v7/libbeat/processors/translate_sid"
	_ "github.com/elastic/beats/v7/x-pack/filebeat/processors/decode_cef"
)

var (
	bindAddress string

	version = "UNSET"
)

func init() {
	flag.StringVar(&bindAddress, "http", "localhost:8084", "HTTP bind address")
}

func main() {
	log.SetFlags(0)
	flag.Parse()

	mux := http.NewServeMux()

	// Serve the REST API:
	mux.Handle("/api/execute", cors.Default().Handler(executeHandler{}))

	// Serve embedded assets.
	mux.Handle("/", http.FileServer(&assetfs.AssetFS{Asset: Asset, AssetDir: AssetDir, Prefix: ""}))

	log.Println("beats-playground version", version)
	log.Println("Listening at:", bindAddress)
	log.Fatal(http.ListenAndServe(bindAddress, LoggingHandler(mux)))
}

func LoggingHandler(next http.Handler) http.Handler {
	fn := func(w http.ResponseWriter, r *http.Request) {
		// call the original http.Handler we're wrapping
		next.ServeHTTP(w, r)

		log.Println("Request from", r.RemoteAddr, r.Method, r.URL)
	}

	return http.HandlerFunc(fn)
}

type ExecuteRequest struct {
	Processors interface{} `json:"processors"`
	Events     string      `json:"events"`
}

type ExecuteResponse struct {
	Events []ResponseEvent `json:"events"`
}

type ResponseEvent struct {
	Original string                 `json:"original"`
	Error    string                 `json:"error"`
	Event    map[string]interface{} `json:"event"`
}

type executeHandler struct{}

func (executeHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	var execRequest ExecuteRequest

	dec := json.NewDecoder(r.Body)
	dec.DisallowUnknownFields()

	if err := dec.Decode(&execRequest); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte(err.Error()))
		return
	}

	log.Printf("%#v", execRequest)

	var processorsList []interface{}
	switch v := execRequest.Processors.(type) {
	case []interface{}:
		processorsList = v
	case string:
		err := yaml.NewDecoder(bytes.NewBufferString(v)).Decode(&processorsList)
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			w.Write([]byte(err.Error()))
			return
		}
	default:
		w.WriteHeader(http.StatusBadRequest)
		fmt.Fprintf(w, "Invalid type for processors: %T", v)
		return
	}

	log.Printf("Raw processors: %#v", processorsList)

	c, err := common.NewConfigFrom(processorsList)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte(err.Error()))
		return
	}

	var pc processors.PluginConfig
	if err = c.Unpack(&pc); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte(err.Error()))
		return
	}

	p, err := processors.New(pc)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte(err.Error()))
		return
	}

	log.Printf("Processors: %#v", p)

	var response ExecuteResponse

	s := bufio.NewScanner(bytes.NewBufferString(execRequest.Events))
	for s.Scan() {
		message := s.Text()
		if message == "" {
			continue
		}

		item := ResponseEvent{
			Original: message,
		}

		event := &beat.Event{
			Timestamp: time.Now().UTC(),
			Fields: common.MapStr{
				"message": s.Text(),
			},
		}

		event, err := p.Run(event)
		if err != nil {
			if event != nil {
				event.Fields.Put("@timestamp", common.Time(event.Timestamp))
				item.Event = event.Fields
			}
			item.Error = err.Error()
			response.Events = append(response.Events, item)
			continue
		}

		// Drop event processors can return null.
		if event != nil {
			event.Fields.Put("@timestamp", common.Time(event.Timestamp))
			if len(event.Meta) > 0 {
				event.Fields.DeepUpdate(common.MapStr{"@metadata": event.Meta})
			}
			item.Event = event.Fields
		}

		response.Events = append(response.Events, item)
	}
	if err = s.Err(); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte(err.Error()))
		return
	}

	data, err := json.Marshal(response)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte(err.Error()))
		return
	}

	w.Write(data)
}
