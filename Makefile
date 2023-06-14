VERSION ?= master
LICENSE := ASL2-Short

.PHONY: build
build: fmt wasm ui-assets
	go build -ldflags "-X main.version=${VERSION}"

.PHONY: start
start:
	@echo Starting Go web service with embedded static assets...
	go run .

.PHONY: ui
ui: wasm
	cd ui; yarn install && yarn build

.PHONY: ui-assets
ui-assets: ui go-bindata-assetfs goimports
	cd ui/build; go-bindata-assetfs -pkg main -o ../../ui_assets.go ./...
	goimports -l -w ui_assets.go

.PHONY: wasm
wasm:
	GOOS=js GOARCH=wasm go build -o ui/public/processors.wasm -ldflags "-X main.version=${VERSION}" ./pkg/wasm
	cp "$(shell go env GOROOT)/misc/wasm/wasm_exec.js" ui/public/

.PHONY: fmt
fmt: go-licenser goimports
	go-licenser -license ${LICENSE}
	goimports -w -local github.com/andrewkroh/ .

.PHONY: goimports
goimports:
	go install golang.org/x/tools/cmd/goimports@latest

.PHONY: go-licenser
go-licenser:
	go install github.com/elastic/go-licenser@latest

.PHONY: go-bindata-assetfs
go-bindata-assetfs: go-bindata
	go install github.com/elazarl/go-bindata-assetfs/go-bindata-assetfs@latest

.PHONY: go-bindata
go-bindata:
	go install github.com/go-bindata/go-bindata/go-bindata@latest

.PHONY: gh-pages
gh-pages: wasm
	cd ui; yarn install && yarn run deploy
