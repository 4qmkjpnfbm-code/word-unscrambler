# Deploy the Material 3 redesign

Harry approved this for production on 6 October 2026. Merge is into `main`. Do the KV upload and the Worker deploy yourself. The repo is public; fetch `main` via codeload after the merge.

The live Worker is `word-unscrambler`. It reads KV namespace `SITE` (`3a8db125fded4e80873b31240dd5f0e8`). The key is the path relative to the repo root, with no leading slash (the same string `pull()` passes to `env.SITE.get`). If that key exists and is longer than 20 bytes, KV wins and GitHub is not used. Re-upload every changed file below or the old KV copy stays live.

## Worker

`worker.js` changed. It needs a deploy with the production config, not the preview config:

```bash
npx wrangler deploy -c wrangler.toml
```

Do not deploy `wrangler.preview.toml` for this. That file is only the `lus-redesign-preview` Worker.

What the Worker change does:

- Allows `modern-v42.css`, `fonts/roboto-400.woff2`, `fonts/roboto-500.woff2`, `fonts/roboto-700.woff2`, `img/listen-hero.avif` and `img/listen-hero.webp`. Without this deploy those URLs 404 even if the bytes are in KV.
- Serves `.woff2` as `font/woff2`.
- Leaves HTML that already links `modern-v42.css` alone. Pages without that link still get the old `modern-v39/40/41` injection.

Upload the KV files first, then deploy the Worker, so the new allow-list and the new bytes go live together.

## New KV keys

- `fonts/roboto-400.woff2`
- `fonts/roboto-500.woff2`
- `fonts/roboto-700.woff2`
- `img/listen-hero.avif`
- `img/listen-hero.webp`
- `modern-v42.css`

## Changed KV keys

Re-upload these. They already exist in KV or are served by filename from this repo.

- `app.js`
- `profit-v1.js`
- `favicon.svg`
- `manifest.webmanifest`
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

## Not KV keys

These changed on `main` and should not be uploaded to `SITE`:

- `worker.js` (deploy with the command above)
- `wrangler.toml` (unchanged; still the production Worker and the live KV id)
- `wrangler.preview.toml`, `preview-worker.js` (preview only)
- `PREVIEW-NOTES.md`, `DEPLOY-NOTES.md`
- `package.json`, `package-lock.json`
- `shots/*.png`
- `.assetsignore`, `.gitignore`

## Production HTML

Indexable pages keep `robots` `index,follow`. AdSense (`ca-pub-2666058844257008`), GA4 (`G-VR1EE3K51N`) and the `wu_consent` bar are still in the HTML. The preview Worker strips those only when serving `lus-redesign-preview`. `404.html` is the only page with `noindex`, and that was already true on the previous `main`.
