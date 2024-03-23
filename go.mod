module github.com/andrewkroh/beats-playground

go 1.22

require (
	github.com/elastic/beats/v7 v7.0.0-alpha2.0.20200805104247-2ee3f8392417
	github.com/gorilla/handlers v1.5.2
	github.com/stretchr/testify v1.9.0
	gopkg.in/yaml.v3 v3.0.1
)

require (
	github.com/Microsoft/go-winio v0.6.1 // indirect
	github.com/armon/go-radix v1.0.0 // indirect
	github.com/aws/aws-sdk-go-v2 v1.18.0 // indirect
	github.com/aws/aws-sdk-go-v2/config v1.15.12 // indirect
	github.com/aws/aws-sdk-go-v2/credentials v1.12.7 // indirect
	github.com/aws/aws-sdk-go-v2/feature/ec2/imds v1.12.7 // indirect
	github.com/aws/aws-sdk-go-v2/internal/configsources v1.1.33 // indirect
	github.com/aws/aws-sdk-go-v2/internal/endpoints/v2 v2.4.27 // indirect
	github.com/aws/aws-sdk-go-v2/internal/ini v1.3.14 // indirect
	github.com/aws/aws-sdk-go-v2/service/ec2 v1.36.1 // indirect
	github.com/aws/aws-sdk-go-v2/service/internal/presigned-url v1.9.7 // indirect
	github.com/aws/aws-sdk-go-v2/service/sso v1.11.10 // indirect
	github.com/aws/aws-sdk-go-v2/service/sts v1.16.8 // indirect
	github.com/aws/smithy-go v1.13.5 // indirect
	github.com/cespare/xxhash/v2 v2.2.0 // indirect
	github.com/davecgh/go-spew v1.1.1 // indirect
	github.com/dlclark/regexp2 v1.4.0 // indirect
	github.com/dop251/goja v0.0.0-20200831102558-9af81ddcf0e1 // indirect
	github.com/dop251/goja_nodejs v0.0.0-20200706082813-b2775b86b9e0 // indirect
	github.com/dustin/go-humanize v1.0.1 // indirect
	github.com/elastic/elastic-agent-client/v7 v7.1.2 // indirect
	github.com/elastic/elastic-agent-libs v0.3.9
	github.com/elastic/elastic-agent-system-metrics v0.6.1 // indirect
	github.com/elastic/go-licenser v0.4.1 // indirect
	github.com/elastic/go-structform v0.0.10 // indirect
	github.com/elastic/go-sysinfo v1.11.0 // indirect
	github.com/elastic/go-ucfg v0.8.6 // indirect
	github.com/elastic/go-windows v1.0.1 // indirect
	github.com/elastic/gosigar v0.14.2 // indirect
	github.com/fatih/color v1.13.0 // indirect
	github.com/felixge/httpsnoop v1.0.3 // indirect
	github.com/go-sourcemap/sourcemap v2.1.3+incompatible // indirect
	github.com/gofrs/uuid v4.2.0+incompatible // indirect
	github.com/golang/protobuf v1.5.3 // indirect
	github.com/h2non/filetype v1.1.1 // indirect
	github.com/hashicorp/errwrap v1.1.0 // indirect
	github.com/hashicorp/go-multierror v1.1.1 // indirect
	github.com/jcchavezs/porto v0.1.0 // indirect
	github.com/jmespath/go-jmespath v0.4.0 // indirect
	github.com/joeshaw/multierror v0.0.0-20140124173710-69b34d4ec901 // indirect
	github.com/kr/pretty v0.2.1 // indirect
	github.com/magefile/mage v1.14.0 // indirect
	github.com/mattn/go-colorable v0.1.12 // indirect
	github.com/mattn/go-isatty v0.0.17 // indirect
	github.com/pkg/errors v0.9.1 // indirect
	github.com/pmezard/go-difflib v1.0.0 // indirect
	github.com/prometheus/procfs v0.9.0 // indirect
	github.com/rcrowley/go-metrics v0.0.0-20201227073835-cf1acfcdf475 // indirect
	github.com/santhosh-tekuri/jsonschema v1.2.4 // indirect
	go.elastic.co/apm/v2 v2.0.0 // indirect
	go.elastic.co/ecszap v1.0.1 // indirect
	go.elastic.co/fastjson v1.1.0 // indirect
	go.uber.org/atomic v1.10.0 // indirect
	go.uber.org/goleak v1.1.12 // indirect
	go.uber.org/multierr v1.10.0 // indirect
	go.uber.org/zap v1.24.0 // indirect
	golang.org/x/crypto v0.17.0 // indirect
	golang.org/x/mod v0.9.0 // indirect
	golang.org/x/net v0.17.0 // indirect
	golang.org/x/sys v0.15.0 // indirect
	golang.org/x/text v0.14.0 // indirect
	golang.org/x/tools v0.6.0 // indirect
	google.golang.org/genproto v0.0.0-20230410155749-daa745c078e1 // indirect
	google.golang.org/grpc v1.56.3 // indirect
	google.golang.org/protobuf v1.33.0 // indirect
	gopkg.in/yaml.v2 v2.4.0 // indirect
	howett.net/plist v1.0.0 // indirect
)

replace (
	github.com/dop251/goja => github.com/andrewkroh/goja v0.0.0-20190128172624-dd2ac4456e20
	github.com/elastic/beats/v7 => github.com/andrewkroh/beats/v7 v7.0.0-20230614153157-e2d5e0b5107f
	github.com/elastic/elastic-agent-libs => github.com/andrewkroh/elastic-agent-libs v0.0.0-20220713130552-0fef594e5ae3
	github.com/tonistiigi/fifo => github.com/containerd/fifo v0.0.0-20190816180239-bda0ff6ed73c
)
