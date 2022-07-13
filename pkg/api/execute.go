// Licensed to Elasticsearch B.V. under one or more agreements.
// Elasticsearch B.V. licenses this file to you under the Apache 2.0 License.
// See the LICENSE file in the project root for more information.

package api

import (
	"bufio"
	"bytes"
	"fmt"
	"strings"
	"time"

	"gopkg.in/yaml.v3"

	"github.com/elastic/beats/v7/libbeat/beat"
	"github.com/elastic/beats/v7/libbeat/common"
	"github.com/elastic/beats/v7/libbeat/processors"
	"github.com/elastic/elastic-agent-libs/config"
	"github.com/elastic/elastic-agent-libs/mapstr"
)

type ExecuteRequest struct {
	Processors interface{} `json:"processors"` // YAML block with processors config.
	Events     string      `json:"events"`     // Newline delimited list of messages.
}

type ExecuteResponse struct {
	Events []ExecuteResponseEvent `json:"events"`
}

type ExecuteResponseEvent struct {
	Original string                 `json:"original"`
	Error    string                 `json:"error"`
	Event    map[string]interface{} `json:"event"`
}

func Execute(req ExecuteRequest) (*ExecuteResponse, error) {
	procs, err := req.buildProcessors()
	if err != nil {
		return nil, err
	}

	var resp ExecuteResponse
	s := bufio.NewScanner(bytes.NewBufferString(req.Events))
	for s.Scan() {
		message := s.Text()
		if message == "" {
			continue
		}

		item := ExecuteResponseEvent{
			Original: message,
		}

		event := &beat.Event{
			Timestamp: time.Now().UTC(),
			Fields: mapstr.M{
				"message": s.Text(),
			},
		}

		event, err := procs.Run(event)
		if err != nil {
			if event != nil {
				event.Fields.Put("@timestamp", common.Time(event.Timestamp))
				item.Event = event.Fields
			}
			item.Error = err.Error()
			resp.Events = append(resp.Events, item)
			continue
		}

		// Drop event processors can return null.
		if event != nil {
			event.Fields.Put("@timestamp", common.Time(event.Timestamp))
			if len(event.Meta) > 0 {
				event.Fields.DeepUpdate(mapstr.M{"@metadata": event.Meta})
			}
			item.Event = event.Fields
		}

		resp.Events = append(resp.Events, item)
	}
	if err = s.Err(); err != nil {
		return nil, err
	}

	return &resp, nil
}

func (req ExecuteRequest) processors() ([]interface{}, error) {
	switch v := req.Processors.(type) {
	case []interface{}:
		return v, nil
	case string:
		return processorsFromString(v)
	default:
		return nil, fmt.Errorf("unexpected data type in processors field: %T", req.Processors)
	}
}

func processorsFromString(in string) ([]interface{}, error) {
	var processors interface{}
	if err := yaml.NewDecoder(strings.NewReader(in)).Decode(&processors); err != nil {
		return nil, fmt.Errorf("yaml decoding of processors failed: %w", err)
	}

	switch v := processors.(type) {
	case []interface{}:
		return v, nil
	case map[string]interface{}:
		list, ok := v["processors"].([]interface{})
		if !ok {
			return nil, fmt.Errorf("processors list was not found in YAML")
		}
		return list, nil
	default:
		return nil, fmt.Errorf("unexpected data type in YAML: %T", processors)
	}
}

func (req ExecuteRequest) buildProcessors() (*processors.Processors, error) {
	processorsIfcList, err := req.processors()
	if err != nil {
		return nil, err
	}

	c, err := config.NewConfigFrom(processorsIfcList)
	if err != nil {
		return nil, err
	}

	var pluginConfig processors.PluginConfig
	if err = c.Unpack(&pluginConfig); err != nil {
		return nil, err
	}

	procs, err := processors.New(pluginConfig)
	if err != nil {
		return nil, err
	}

	return procs, nil
}
