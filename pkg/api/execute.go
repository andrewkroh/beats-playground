// Licensed to Elasticsearch B.V. under one or more agreements.
// Elasticsearch B.V. licenses this file to you under the Apache 2.0 License.
// See the LICENSE file in the project root for more information.

package api

import (
	"bufio"
	"bytes"
	"fmt"
	"io"
	"strings"
	"time"

	"gopkg.in/yaml.v3"

	"github.com/elastic/beats/v7/libbeat/beat"
	"github.com/elastic/beats/v7/libbeat/common"
	"github.com/elastic/beats/v7/libbeat/common/match"
	"github.com/elastic/beats/v7/libbeat/processors"
	"github.com/elastic/beats/v7/libbeat/reader"
	"github.com/elastic/beats/v7/libbeat/reader/multiline"
	"github.com/elastic/elastic-agent-libs/config"
	"github.com/elastic/elastic-agent-libs/mapstr"
)

type ExecuteRequest struct {
	Processors interface{}       `json:"processors"`          // YAML block with processors config.
	Events     string            `json:"events"`              // Newline delimited list of messages.
	Multiline  *MultilineOptions `json:"multiline,omitempty"` // Multiline configuration (optional).
}

type MultilineOptions struct {
	Type         string `json:"type"`              // Type: pattern (default), count, or while_pattern.
	Negate       bool   `json:"negate"`            // Invert match result.
	Match        string `json:"match,omitempty"`   // Match 'before' or 'after'.
	Pattern      string `json:"pattern,omitempty"` // Regular expression pattern.
	FlushPattern string `json:"flush_pattern,omitempty"`
	LinesCount   int    `json:"count_lines,omitempty"`
	SkipNewLine  bool   `config:"skip_newline,omitempty"`
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

	var r reader.Reader = newBufferReader(bytes.NewBufferString(req.Events))

	if req.Multiline != nil {
		var pattern, flushPattern *match.Matcher
		if req.Multiline.Pattern != "" {
			p, err := match.Compile(req.Multiline.Pattern)
			if err != nil {
				return nil, err
			}
			pattern = &p
		}
		if req.Multiline.FlushPattern != "" {
			p, err := match.Compile(req.Multiline.FlushPattern)
			if err != nil {
				return nil, err
			}
			flushPattern = &p
		}

		r, err = multiline.New(r, "\n", 4096, &multiline.Config{
			Type:         0, // TODO: Convert to unexported multilineType.
			Negate:       req.Multiline.Negate,
			Match:        req.Multiline.Match,
			Pattern:      pattern,
			FlushPattern: flushPattern,
			LinesCount:   req.Multiline.LinesCount,
			SkipNewLine:  req.Multiline.SkipNewLine,
		})
		if err != nil {
			return nil, err
		}
	}

	var resp ExecuteResponse
	for {
		m, err := r.Next()
		if err != nil {
			break
		}

		message := string(m.Content)
		item := ExecuteResponseEvent{
			Original: message,
		}

		event := &beat.Event{
			Timestamp: m.Ts,
			Fields: mapstr.M{
				"message": string(m.Content),
			},
		}

		event, err = procs.Run(event)
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

type bufferReader struct {
	scanner *bufio.Scanner
}

var _ reader.Reader = (*bufferReader)(nil)

func newBufferReader(r io.Reader) *bufferReader {
	return &bufferReader{scanner: bufio.NewScanner(r)}
}

func (b *bufferReader) Close() error {
	return nil
}

// Next reads from the buffer line by line.
func (b *bufferReader) Next() (reader.Message, error) {
	if b.scanner.Scan() {
		return reader.Message{
			Ts:      time.Now().UTC(),
			Content: b.scanner.Bytes(),
			Bytes:   len(b.scanner.Bytes()),
		}, nil
	} else if b.scanner.Err() != nil {
		return reader.Message{}, b.scanner.Err()
	}

	return reader.Message{}, io.EOF
}
