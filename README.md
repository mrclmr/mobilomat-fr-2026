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

- [x] Add in Überblick the questions from the Kandidierende tab. Remove Kandidierende Tab. Rename Überblick to Kandidierende.
      Make the › symbol that opens the questions better visible and show that is clickable.
      Add to the › symbol in the new Kandidierende tab "Antworten d. Kandidierenden". Add this centered below the progress bar.
      Add to the › symbol in the Fragen tab "Antworten der Kandidierenden"
      › should rotate 90 degrees if content is expanded. No JS, just Tailwind. Bonus: Can you animate the appearing and disappearing content
- [x] Make Ergebnis and Übereinstimmung mit Deinen Antworten bigger in wider than sm
- [x] Rename inter.css to font.css
- [x] The progress bar above questions show has thin separators to represent each space for an answer. The filled color of the progress bar represents the answer. The progress bar height should be increased
- [x] Title "Mobil-O-Mat" can span over the full width without covering the girl. Increase the gap to the subtitle
- [x] Disclaimer updaten, Erwatungsmanagement
- [x] Remove "Weiter" und "Zurück" Buttons. If an answer is selected go to next page
- [x] Directly jump to next page after answer. Remove "Zurück" and "Weiter"
- [x] Add left and right empty areas to the page to limit the height of title image when a wide browser window is used. In a wider browser the image takes a lot of space
- [x] "Ihre Antwort" -> "Deine Antwort"
- [x] Datenschutz Hinweise, es wird eine veränderte Versin von https://chormunity-freiburg.de/datenschutzerklaerung/ geben

- [ ] ~~Link in results to return to question?~~
- [ ] ~~Percent numbers in results should have a gradient, between the predefined used colors red, yellow and green~~
- [ ] ~~In results use same vote badges for candidates as your vote badge~~
- [ ] ~~Below the progress bar show dots with the height of the progress bar. These dots will get the color of the answers~~
