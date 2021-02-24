package main

import (
	"encoding/json"
	"syscall/js"

	"github.com/andrewkroh/beats-playground/pkg/api"

	// Register processors.
	_ "github.com/elastic/beats/v7/libbeat/processors/actions"
	_ "github.com/elastic/beats/v7/libbeat/processors/add_cloud_metadata"
	_ "github.com/elastic/beats/v7/libbeat/processors/add_host_metadata"
	_ "github.com/elastic/beats/v7/libbeat/processors/add_id"
	_ "github.com/elastic/beats/v7/libbeat/processors/add_locale"
	_ "github.com/elastic/beats/v7/libbeat/processors/add_observer_metadata"
	_ "github.com/elastic/beats/v7/libbeat/processors/add_process_metadata"
	_ "github.com/elastic/beats/v7/libbeat/processors/communityid"
	_ "github.com/elastic/beats/v7/libbeat/processors/convert"
	_ "github.com/elastic/beats/v7/libbeat/processors/decode_csv_fields"
	_ "github.com/elastic/beats/v7/libbeat/processors/decode_xml"
	_ "github.com/elastic/beats/v7/libbeat/processors/dissect"
	_ "github.com/elastic/beats/v7/libbeat/processors/dns"
	_ "github.com/elastic/beats/v7/libbeat/processors/extract_array"
	_ "github.com/elastic/beats/v7/libbeat/processors/fingerprint"
	_ "github.com/elastic/beats/v7/libbeat/processors/registered_domain"
	_ "github.com/elastic/beats/v7/libbeat/processors/script"
	_ "github.com/elastic/beats/v7/libbeat/processors/timestamp"
	_ "github.com/elastic/beats/v7/libbeat/processors/translate_sid"
	_ "github.com/elastic/beats/v7/libbeat/processors/urldecode"
)

func execute(this js.Value, args []js.Value) interface{} {
	if len(args) != 2 {
		return "execute requires two args"
	}

	req := api.ExecuteRequest{
		Processors: args[0].String(),
		Events:     args[1].String(),
	}

	resp, err := api.Execute(req)
	if err != nil {
		return err.Error()
	}

	return toObject(resp)
}

// toObject converts a struct to a map[string]interface{} using JSON
// marshal/unmarshal.
func toObject(v interface{}) map[string]interface{} {
	data, err := json.Marshal(v)
	if err != nil {
		panic(err)
	}

	var out map[string]interface{}
	if err = json.Unmarshal(data, &out); err != nil {
		panic(err)
	}

	return out
}

func registerCallbacks() {
	js.Global().Set("processors_execute", js.FuncOf(execute))
}

func main() {
	println("Beats Processor Playground WASM loaded.")
	registerCallbacks()
	<-make(chan bool)
}
