# Mobil-O-Mat OB-Wahl Freiburg 2026

## Requirements

Make these tools available in path:

- [GNU Make 4.x.x](https://www.gnu.org/software/make/)
- NodeJS, see version in [package.json](package.json)
- [Hugo](https://github.com/gohugoio/hugo)
- [qrtool](https://sorairolake.github.io/qrtool/book/index.html), only needed for `make qr-macos`
  - for macOS Homebrew: `brew install qrtool`

### Dependencies

```
npm install
```

## Commands

- Run local dev server
  ```
  make serve
  ```
- **macOS** Create qr code to scan with device in local network
  ```
  make qr-macos
  ```
  Combine it with `serve`
  ```
  make qr-macos serve
  ```

## SVG Icons

Icons found here: https://leungwensen.github.io/svg-icon/#ionic
