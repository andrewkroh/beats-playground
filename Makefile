.PHONY: build
build: ui-assets
	go build

.PHONY: start
start:
	@echo Starting Go web service with embedded static assets...
	go run .

.PHONY: ui
ui:
	cd web; yarn build

.PHONY: ui-assets
ui-assets: ui
	cd web/build; go-bindata-assetfs -pkg main -o ../../ui_assets.go ./...
	goimports -l -w ui_assets.go
