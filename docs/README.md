# Beats Playground

Demo: https://andrewkroh.github.io/beats-playground/

It's a web UI to play with Elastic Beats processor configurations.

![screenshot](screenshot.png)

## How it works

I reused the processors code Elastic Beats and compiled it into a WebAssembly
binary that is loaded by the browser. All processing happens in the browser so
none of your sample/test logs ever leave the browser.

Because of browser limitations, processors that require OS resources
(filesystem, sockets) are not included (e.g. `dns`, `translate_sid`,
`rate_limit`, `add_docker_metdata`).

It will load configurations and sample logs from URLs if you set the appropriate
query parameters in the URL fragment (aka hash). It reads `load_processors`
and `load_logs` then loads the content from those URLs. This can be used to share
examples. The format is:

`http://localhost:8084/#?load_processors=PROCESSORS_URL&load_logs=LOGS_URL`

## Self-hosting

Download a release binary and run it yourself. By default the binary listens
for connections at http://localhost:8084/.

## Building

Run `make` and it will produce the `beats-playground` self-contained binary.
Building has several requirements like Go and `yarn`.

## Releasing

Pushes to master automatically update the demo page host by Github Pages. The
commit ID can be verified by looking at the browser's console.

Git tags automatically trigger uploads of binaries to the Github release page.
