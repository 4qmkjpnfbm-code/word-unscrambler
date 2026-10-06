# Deploy dark mode

This branch adds a light/dark toggle. It is a draft. Do not merge until Harry says so. Fetch this branch via codeload and deploy the preview yourself with:

```bash
npx wrangler deploy -c wrangler.preview.toml
```

That publishes `lus-redesign-preview` only. `wrangler.preview.toml` has `workers_dev = true`, no routes, and no production KV binding. `preview-worker.js` serves this branch's files and still strips ads, GA4 and the consent bar.

## Worker

`worker.js` did not change. A production `wrangler deploy -c wrangler.toml` is not required for dark mode.

## KV keys to re-upload for production

The live Worker still prefers KV `SITE` over GitHub when the value is longer than 20 bytes. After a future merge, re-upload these keys (path with no leading slash):

- `modern-v42.css`

Every HTML file, because the header script and theme button changed:

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

No new font or image files. Ads, GA4 and the consent bar stay in the HTML. The preview Worker removes them only on `lus-redesign-preview`.
