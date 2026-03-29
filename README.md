# Mobil-O-Mat OB-Wahl Freiburg 2026

## Requirements

Make these tools avaialbe in path:

- NodeJS (see version in [package.json](package.json))
- [Hugo](https://github.com/gohugoio/hugo)
- [Go](https://go.dev/dl/)
- [yamlfmt](https://github.com/google/yamlfmt) ( needed for installation)
  ```
  go install github.com/google/yamlfmt/cmd/yamlfmt@latest
  ```

### Dependencies

```
npm install
```

## Run

```
make serve
```

## Show QR-Code for local network

```
qrtool encode -t unicode -s 3 "http://$(ipconfig getifaddr en0):1313"
```