package api

import (
	"testing"

	"github.com/stretchr/testify/require"

	// Register a processor for testing.
	_ "github.com/elastic/beats/v7/libbeat/processors/convert"
)

func TestExecute(t *testing.T) {
	const yamlObject = `
---

processors:
  - convert:
      fields:
        - {from: message, to: source.ip, type: ip}
`

	t.Run("yaml list", func(t *testing.T) {
		req := ExecuteRequest{
			Processors: `
---

- convert:
    fields:
      - {from: message, to: source.ip, type: ip}
`,
			Events: "foo",
		}

		resp, err := Execute(req)
		require.NoError(t, err)
		require.NotNil(t, resp)
	})
	t.Run("yaml object", func(t *testing.T) {
		req := ExecuteRequest{
			Processors: yamlObject,
			Events:     "foo",
		}

		resp, err := Execute(req)
		require.NoError(t, err)
		require.NotNil(t, resp)
	})

	t.Run("invalid yaml", func(t *testing.T) {
		req := ExecuteRequest{
			Processors: `
---

foo
`,
		}

		resp, err := Execute(req)
		require.Error(t, err)
		require.Nil(t, resp)
	})

	t.Run("no messages", func(t *testing.T) {
		req := ExecuteRequest{
			Processors: yamlObject,
		}

		resp, err := Execute(req)
		require.NoError(t, err)
		require.NotNil(t, resp)
		require.Len(t, resp.Events, 0)
	})

	t.Run("single message", func(t *testing.T) {
		req := ExecuteRequest{
			Processors: yamlObject,
			Events:     "hello world",
		}

		resp, err := Execute(req)
		require.NoError(t, err)
		require.NotNil(t, resp)
		require.Len(t, resp.Events, 1)
	})

	t.Run("multiple messages", func(t *testing.T) {
		req := ExecuteRequest{
			Processors: yamlObject,
			Events: `hello world 1
hello world 2`,
		}

		resp, err := Execute(req)
		require.NoError(t, err)
		require.NotNil(t, resp)
		require.Len(t, resp.Events, 2)
	})
}
