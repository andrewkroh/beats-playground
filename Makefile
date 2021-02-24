.PHONY: build
build: wasm ui-assets
	go build

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

wasm:
	mkdir -p build
	GOOS=js GOARCH=wasm go build -o ui/public/processors.wasm ./pkg/wasm
	cp "$(shell go env GOROOT)/misc/wasm/wasm_exec.js" ui/public/
