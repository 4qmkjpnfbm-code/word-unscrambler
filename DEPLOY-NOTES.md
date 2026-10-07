# Deploy improvements-v1

Draft branch `improvements-v1`, based on `features-v1` (PR #5). Do not merge until Harry says so. This environment does not deploy.

Preview, from a checkout of this branch:

```bash
npx wrangler deploy -c wrangler.preview.toml
```

Use only `wrangler.preview.toml`. It publishes `lus-redesign-preview`, with `workers_dev` on, no routes, and no production KV binding. `preview-worker.js` serves this branch and still strips AdSense, GA4 and the consent bar.

## Worker

`worker.js` changed. New pages 404 on the live Worker until you deploy production after a merge:

```bash
npx wrangler deploy -c wrangler.toml
```

Do the KV upload first, then the Worker deploy, so the new allow-list and the new files go live together.

Routes added on top of `features-v1`:

- `/about` already routed; `author-bio.html` must be allow-listed or the author slot 404s after you fill it
- `/scrabble-score-calculator`
- `/boggle-solver`
- `/daily`

`/apple-touch-icon.png` now serves `icon-180.png`.

## KV keys

Keys are paths with no leading slash. The live Worker uses KV `SITE` when the value is longer than 20 bytes, so every changed file must be uploaded again. This list is everything on `improvements-v1` that production `main` does not already have, including the `features-v1` files, because that branch is not merged.

New:

- `author-bio.html`
- `scrabble-score-calculator.html`
- `scrabble-score.js`
- `boggle-solver.html`
- `boggle.js`
- `daily.html`
- `daily.js`
- `help.js`
- `icon-180.png`
- `icon-192.png`
- `icon-512.png`
- `icon-512-maskable.png`
- `word-ladder-solver.html`
- `word-ladder.js`
- `daily-share.js`

Changed:

- `index.html`
- `app.js`
- `modern-v42.css`
- `sitemap.xml`
- `llms.txt`
- `llms-full.txt`
- `manifest.webmanifest`
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
- `unscramble.html`
- `unscramble-aeinrst.html`
- `unscramble-airbag.html`
- `unscramble-eagle.html`
- `unscramble-listen.html`
- `unscramble-pallet.html`
- `unscramble-scrabble.html`
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
- `5-letter-words.html`
- `5-letter-words-starting-with.html`
- `6-letter-words.html`
- `7-letter-words.html`
- `8-letter-words.html`
- `9-letter-words.html`
- `10-letter-words.html`
- `404.html`

Ads and GA4 stay in the HTML. The help prompt calls `gtag` only when that function exists, so the preview strip still removes Analytics. No new font or hero image.
