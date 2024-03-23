// Licensed to Elasticsearch B.V. under one or more agreements.
// Elasticsearch B.V. licenses this file to you under the Apache 2.0 License.
// See the LICENSE file in the project root for more information.

package main

import (
	"encoding/json"
	"syscall/js"

	"github.com/andrewkroh/beats-playground/internal/api"

	// Register processors.
	_ "github.com/elastic/beats/v7/libbeat/processors/actions"
	_ "github.com/elastic/beats/v7/libbeat/processors/add_cloud_metadata"
	_ "github.com/elastic/beats/v7/libbeat/processors/add_formatted_index"
	_ "github.com/elastic/beats/v7/libbeat/processors/add_host_metadata"
	_ "github.com/elastic/beats/v7/libbeat/processors/add_id"
	_ "github.com/elastic/beats/v7/libbeat/processors/add_locale"
	_ "github.com/elastic/beats/v7/libbeat/processors/add_observer_metadata"
	_ "github.com/elastic/beats/v7/libbeat/processors/add_process_metadata"
	_ "github.com/elastic/beats/v7/libbeat/processors/cache"
	_ "github.com/elastic/beats/v7/libbeat/processors/communityid"
	_ "github.com/elastic/beats/v7/libbeat/processors/convert"
	_ "github.com/elastic/beats/v7/libbeat/processors/decode_csv_fields"
	_ "github.com/elastic/beats/v7/libbeat/processors/decode_duration"
	_ "github.com/elastic/beats/v7/libbeat/processors/decode_xml"
	_ "github.com/elastic/beats/v7/libbeat/processors/decode_xml_wineventlog"
	_ "github.com/elastic/beats/v7/libbeat/processors/dissect"
	_ "github.com/elastic/beats/v7/libbeat/processors/extract_array"
	_ "github.com/elastic/beats/v7/libbeat/processors/fingerprint"
	_ "github.com/elastic/beats/v7/libbeat/processors/move_fields"
	_ "github.com/elastic/beats/v7/libbeat/processors/registered_domain"
	_ "github.com/elastic/beats/v7/libbeat/processors/script"
	_ "github.com/elastic/beats/v7/libbeat/processors/syslog"
	_ "github.com/elastic/beats/v7/libbeat/processors/timestamp"
	_ "github.com/elastic/beats/v7/libbeat/processors/urldecode"
	_ "github.com/elastic/beats/v7/x-pack/filebeat/processors/aws_vpcflow"
	_ "github.com/elastic/beats/v7/x-pack/filebeat/processors/decode_cef"
)

var version string

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
	println("Beats Processor Playground WASM loaded. Version " + version)
	registerCallbacks()
	<-make(chan bool)
}
