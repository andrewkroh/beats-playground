package main

import (
	"flag"
	"log"
	"net/http"
	"os"

	assetfs "github.com/elazarl/go-bindata-assetfs"
	"github.com/gorilla/handlers"
)

var (
	bindAddress string

	version string
)

func init() {
	flag.StringVar(&bindAddress, "http", "localhost:8084", "HTTP bind address")
}

func main() {
	log.SetFlags(0)
	flag.Parse()

	log.Println("Starting beats-playground...")
	if version != "" {
		log.Println("Version:", version)
	}
	log.Printf("Listening at: http://%s/", bindAddress)

	mux := http.NewServeMux()
	mux.Handle("/", http.FileServer(&assetfs.AssetFS{Asset: Asset, AssetDir: AssetDir, Prefix: ""}))

	h := handlers.CompressHandler(mux)
	h = handlers.CombinedLoggingHandler(os.Stdout, h)
	log.Fatal(http.ListenAndServe(bindAddress, h))
}
