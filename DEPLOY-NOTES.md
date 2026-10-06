# Deploy dark mode

Draft branch `dark-mode`. Do not merge until Harry says so. Preview deploy, from a checkout of this branch:

```bash
npx wrangler deploy -c wrangler.preview.toml
```

That publishes `lus-redesign-preview` only. No routes and no production KV binding.

## Worker

`worker.js` did not change for this pass. The cutout reuses the existing names `img/listen-hero.avif` and `img/listen-hero.webp`, which are already on the allow-list. A production `wrangler deploy -c wrangler.toml` is not required.

## KV keys to re-upload

The live Worker prefers KV `SITE` when the value is longer than 20 bytes. Keys are paths with no leading slash.

Changed images (same keys, new transparent bytes):

- `img/listen-hero.avif`
- `img/listen-hero.webp`

Changed brand files:

- `favicon.svg`
- `modern-v42.css`

`manifest.webmanifest` already points at `/favicon.svg`, so the manifest file itself did not change.

Every HTML file (theme script, and the home hero size):

- `index.html`
- `404.html`
- `about.html`
- `anagram-solver.html`
- `bingo-stems.html`
- `contact.html`
- `crossword-solver.html`
- `feedback.html`
- `guide-blank-tiles.html`
- `guide-how-to-unscramble.html`
- `guide-pattern-solver.html`
- `guide-scrabble-vs-wwf.html`
- `guide-wordle-starters.html`
- `hangman-solver.html`
- `how-it-works.html`
- `is-it-a-word.html`
- `jqxz-words.html`
- `jumble-solver.html`
- `letter-boxed.html`
- `multiple-word-unscrambler.html`
- `privacy.html`
- `q-without-u.html`
- `scrabble-word-finder.html`
- `spelling-bee.html`
- `terms.html`
- `text-twist-solver.html`
- `unscramble-aeinrst.html`
- `unscramble-airbag.html`
- `unscramble-eagle.html`
- `unscramble-listen.html`
- `unscramble-pallet.html`
- `unscramble-scrabble.html`
- `unscramble.html`
- `word-checker.html`
- `word-generator.html`
- `word-lists.html`
- `word-scrambler.html`
- `wordle-helper.html`
- `words-containing.html`
- `words-ending-with.html`
- `words-starting-with.html`
- `words-with-friends.html`
- `2-letter-words.html`
- `3-letter-words.html`
- `4-letter-words.html`
- `5-letter-words-starting-with.html`
- `5-letter-words.html`
- `6-letter-words.html`
- `7-letter-words.html`
- `8-letter-words.html`
- `9-letter-words.html`
- `10-letter-words.html`

`stage.jpg`, `stage.avif` and `stage.webp` are not used by these pages (the home hero is the cutout). `og.jpg` is unchanged and was left out on purpose. No new filenames, so nothing new to add to the Worker allow-list.
