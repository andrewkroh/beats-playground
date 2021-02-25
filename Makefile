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
ui:
	cd ui; yarn install && yarn build

.PHONY: ui-assets
ui-assets: ui go-bindata-assetfs goimports
	cd ui/build; go-bindata-assetfs -pkg main -o ../../ui_assets.go ./...
	goimports -l -w ui_assets.go

.PHONY: wasm
wasm:
	mkdir -p build
	GOOS=js GOARCH=wasm go build -o ui/public/processors.wasm -ldflags "-X main.version=${VERSION}" ./pkg/wasm
	cp "$(shell go env GOROOT)/misc/wasm/wasm_exec.js" ui/public/

.PHONY: fmt
fmt: go-licenser goimports
	go-licenser -license ${LICENSE}
	goimports -w -local github.com/andrewkroh/ .

.PHONY: goimports
goimports:
	GO111MODULE=off go get golang.org/x/tools/cmd/goimports

.PHONY: go-licenser
go-licenser:
	GO111MODULE=off go get github.com/elastic/go-licenser

.PHONY: go-bindata-assetfs
go-bindata-assetfs:
	GO111MODULE=off go get github.com/elazarl/go-bindata-assetfs/go-bindata-assetfs

.PHONY: gh-pages
gh-pages: wasm
	cd ui; yarn install && yarn run deploy
