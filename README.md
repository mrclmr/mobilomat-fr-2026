# Mobil-O-Mat OB-Wahl Freiburg 2026

## Requirements

Make these tools avaialbe in path:

- NodeJS (see version in [package.json](package.json))
- [Hugo](https://github.com/gohugoio/hugo)
- [qrtool](https://sorairolake.github.io/qrtool/book/index.html)
  - for macOS: `brew install qrtool`
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

## Todo

- [ ] Disclaimer updaten, Erwatungsmanagement
- [ ] Percent numbers in results should have a gradient, between the predefined used colors red, yellow and green
- [ ] Directly jump to next page after answer. Remove "Zurück" and "Weiter"
- [ ] Don't preselect "Überspringen". Allow only "Weiter" if answer is selected
- [ ] Link in results to return to question
- [ ] In results use same vote badges for candidates as your vote badge
- [ ] Title "Mobil-O-Mat" can span over the full width without covering the girl. Increase the gap to the subtitle
- [ ] Below the progress bar show dots with the height of the progress bar. These dots will get the color of the answers
- [ ] The progress bar above questions show has thin separators to represent each space for an answer. The filled color of the progress bar represents the answer. The progress bar height should be increased

- [x] Add left and right empty areas to the page to limit the height of title image when a wide browser window is used. In a wider browser the image takes a lot of space
- [x] "Ihre Antwort" -> "Deine Antwort"
- [x] Datenschutz Hinweise, es wird eine veränderte Versin von https://chormunity-freiburg.de/datenschutzerklaerung/ geben
