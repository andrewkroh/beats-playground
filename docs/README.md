**Proof of Concept**

It's a web UI to play with Elastic Beats processor configurations.

![screenshot](screenshot.png)

## Give it a try

Run it in Docker

```
docker run -it --rm -p 8084:8084 golang:1.13.8
go get github.com/andrewkroh/beats-playground
beats-playground -http=":8084"
```

or run it locally if you have Go installed:

```$xslt
go get github.com/andrewkroh/beats-playground
$(go env GOPATH)/bin/beats-playground
```

Then open the browser to http://localhost:8084.
