VERSION ?= 0.1.0-SNAPSHOT

.PHONY: build
build: fmt wasm ui-assets
	go build -ldflags "-X main.version=${VERSION}"

.PHONY: start
start:
	@echo Starting Go web service with embedded static assets...
	go run .

.PHONY: ui
ui:
	cd ui; yarn build

.PHONY: ui-assets
ui-assets: ui
	cd ui/build; go-bindata-assetfs -pkg main -o ../../ui_assets.go ./...
	goimports -l -w ui_assets.go

.PHONY: wasm
wasm:
	mkdir -p build
	GOOS=js GOARCH=wasm go build -o ui/public/processors.wasm -ldflags "-X main.version=${VERSION}" ./pkg/wasm
	cp "$(shell go env GOROOT)/misc/wasm/wasm_exec.js" ui/public/

.PHONY: fmt
fmt:
	GO111MODULE=off go get golang.org/x/tools/cmd/goimports
	goimports -w -local github.com/andrewkroh/ .
