# Beats Playground

Demo: https://andrewkroh.github.io/beats-playground/

It's a web UI to play with Elastic Beats processor configurations.

![screenshot](screenshot.png)

## How it works

I reused the processors code Elastic Beats and compiled it into a WebAssembly
binary that is loaded by the browser. All processing happens in the browser so
none of your sample/test logs ever leave the browser.

## Self-hosting

Download a release binary and run it yourself. By default the binary listens
for connections at http://localhost:8084/.

## Building

Run `make` and it will produce the `beats-playground` self-contained binary.
Building have several requirements like Go and `yarn`.

## Releasing

Pushes to master automatically update the demo page host by Github Pages. The
commit ID can be verified by looking at the browser's console.

Git tags automatically trigger uploads of binaries to the Github release page.
