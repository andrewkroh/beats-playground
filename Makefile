VERSION ?= dev
LICENSE := ASL2-Short

.PHONY: build
build: fmt ui
	go build -ldflags "-X main.version=${VERSION}"

.PHONY: start
start:
	@echo Starting Go web service with embedded static assets...
	go run .

.PHONY: ui
ui: wasm
	cd ui; yarn install && yarn build

.PHONY: wasm
wasm:
	GOOS=js GOARCH=wasm go build -o ui/public/processors.wasm -ldflags "-X main.version=${VERSION}" ./internal/wasm
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

.PHONY: gh-pages
gh-pages: wasm
	cd ui; yarn install && yarn run deploy
