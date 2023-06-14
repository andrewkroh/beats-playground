// Licensed to Elasticsearch B.V. under one or more agreements.
// Elasticsearch B.V. licenses this file to you under the Apache 2.0 License.
// See the LICENSE file in the project root for more information.

package main

import (
	"embed"
	"flag"
	"io/fs"
	"log"
	"net/http"
	"os"

	"github.com/gorilla/handlers"
)

//go:embed ui/build/*
var uiAssets embed.FS

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

	// Trim ui/build prefix from the FS.
	uiAssetsRoot, err := fs.Sub(uiAssets, "ui/build")
	if err != nil {
		log.Fatal(err)
	}

	mux := http.NewServeMux()
	mux.Handle("/", http.FileServer(http.FS(uiAssetsRoot)))

	h := handlers.CompressHandler(mux)
	h = handlers.CombinedLoggingHandler(os.Stdout, h)
	log.Fatal(http.ListenAndServe(bindAddress, h))
}
