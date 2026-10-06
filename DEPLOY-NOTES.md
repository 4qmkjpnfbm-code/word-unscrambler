# Deploy notes — lettersunscrambler.com (6 Oct 2026)

Deploy both pieces. The Worker allow-list and image types live in `worker.js`. Page HTML, CSS, JS and the new hero files live in the `SITE` KV namespace. KV is checked first; a hit longer than 20 bytes is served and the GitHub copy is ignored.

Namespace: binding `SITE`, id `3a8db125fded4e80873b31240dd5f0e8` (see `wrangler.toml`).

## Worker bundle

Deploy with Wrangler from this repo. Do not upload `worker.js` to KV.

- `worker.js` — `npx wrangler deploy`

What that deploy changes: AVIF/WebP content types, `stage.avif` and `stage.webp` on the allow-list, hero preload points at `/stage.avif` when the page does not already, and `profit-v1.js` is injected on `window.load` instead of as a parser-deferred script.

## KV keys

Key name is the filename, exactly as `pull()` calls `env.SITE.get(name)`. Upload the file bytes at that key. Paths below are repo paths and key names.

- `10-letter-words.html`
- `2-letter-words.html`
- `3-letter-words.html`
- `404.html`
- `4-letter-words.html`
- `5-letter-words.html`
- `5-letter-words-starting-with.html`
- `6-letter-words.html`
- `7-letter-words.html`
- `8-letter-words.html`
- `9-letter-words.html`
- `about.html`
- `anagram-solver.html`
- `app.js`
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
- `index.html`
- `is-it-a-word.html`
- `jqxz-words.html`
- `jumble-solver.html`
- `letter-boxed.html`
- `modern-v41.css`
- `multiple-word-unscrambler.html`
- `privacy.html`
- `profit-v1.js`
- `q-without-u.html`
- `scrabble-word-finder.html`
- `sitemap.xml`
- `spelling-bee.html`
- `stage.avif`
- `stage.webp`
- `terms.html`
- `text-twist-solver.html`
- `unscramble-aeinrst.html`
- `unscramble-airbag.html`
- `unscramble-eagle.html`
- `unscramble.html`
- `unscramble-listen.html`
- `unscramble-pallet.html`
- `unscramble-scrabble.html`
- `word-checker.html`
- `word-generator.html`
- `wordle-helper.html`
- `word-lists.html`
- `words-containing.html`
- `word-scrambler.html`
- `words-ending-with.html`
- `words-starting-with.html`
- `words-with-friends.html`

58 keys, plus the worker bundle.

## Suggested commands

```bash
npx wrangler deploy
NS=3a8db125fded4e80873b31240dd5f0e8
npx wrangler kv key put --namespace-id "$NS" "10-letter-words.html" --path "10-letter-words.html"
npx wrangler kv key put --namespace-id "$NS" "2-letter-words.html" --path "2-letter-words.html"
npx wrangler kv key put --namespace-id "$NS" "3-letter-words.html" --path "3-letter-words.html"
npx wrangler kv key put --namespace-id "$NS" "404.html" --path "404.html"
npx wrangler kv key put --namespace-id "$NS" "4-letter-words.html" --path "4-letter-words.html"
npx wrangler kv key put --namespace-id "$NS" "5-letter-words.html" --path "5-letter-words.html"
npx wrangler kv key put --namespace-id "$NS" "5-letter-words-starting-with.html" --path "5-letter-words-starting-with.html"
npx wrangler kv key put --namespace-id "$NS" "6-letter-words.html" --path "6-letter-words.html"
npx wrangler kv key put --namespace-id "$NS" "7-letter-words.html" --path "7-letter-words.html"
npx wrangler kv key put --namespace-id "$NS" "8-letter-words.html" --path "8-letter-words.html"
npx wrangler kv key put --namespace-id "$NS" "9-letter-words.html" --path "9-letter-words.html"
npx wrangler kv key put --namespace-id "$NS" "about.html" --path "about.html"
npx wrangler kv key put --namespace-id "$NS" "anagram-solver.html" --path "anagram-solver.html"
npx wrangler kv key put --namespace-id "$NS" "app.js" --path "app.js"
npx wrangler kv key put --namespace-id "$NS" "bingo-stems.html" --path "bingo-stems.html"
npx wrangler kv key put --namespace-id "$NS" "contact.html" --path "contact.html"
npx wrangler kv key put --namespace-id "$NS" "crossword-solver.html" --path "crossword-solver.html"
npx wrangler kv key put --namespace-id "$NS" "feedback.html" --path "feedback.html"
npx wrangler kv key put --namespace-id "$NS" "guide-blank-tiles.html" --path "guide-blank-tiles.html"
npx wrangler kv key put --namespace-id "$NS" "guide-how-to-unscramble.html" --path "guide-how-to-unscramble.html"
npx wrangler kv key put --namespace-id "$NS" "guide-pattern-solver.html" --path "guide-pattern-solver.html"
npx wrangler kv key put --namespace-id "$NS" "guide-scrabble-vs-wwf.html" --path "guide-scrabble-vs-wwf.html"
npx wrangler kv key put --namespace-id "$NS" "guide-wordle-starters.html" --path "guide-wordle-starters.html"
npx wrangler kv key put --namespace-id "$NS" "hangman-solver.html" --path "hangman-solver.html"
npx wrangler kv key put --namespace-id "$NS" "how-it-works.html" --path "how-it-works.html"
npx wrangler kv key put --namespace-id "$NS" "index.html" --path "index.html"
npx wrangler kv key put --namespace-id "$NS" "is-it-a-word.html" --path "is-it-a-word.html"
npx wrangler kv key put --namespace-id "$NS" "jqxz-words.html" --path "jqxz-words.html"
npx wrangler kv key put --namespace-id "$NS" "jumble-solver.html" --path "jumble-solver.html"
npx wrangler kv key put --namespace-id "$NS" "letter-boxed.html" --path "letter-boxed.html"
npx wrangler kv key put --namespace-id "$NS" "modern-v41.css" --path "modern-v41.css"
npx wrangler kv key put --namespace-id "$NS" "multiple-word-unscrambler.html" --path "multiple-word-unscrambler.html"
npx wrangler kv key put --namespace-id "$NS" "privacy.html" --path "privacy.html"
npx wrangler kv key put --namespace-id "$NS" "profit-v1.js" --path "profit-v1.js"
npx wrangler kv key put --namespace-id "$NS" "q-without-u.html" --path "q-without-u.html"
npx wrangler kv key put --namespace-id "$NS" "scrabble-word-finder.html" --path "scrabble-word-finder.html"
npx wrangler kv key put --namespace-id "$NS" "sitemap.xml" --path "sitemap.xml"
npx wrangler kv key put --namespace-id "$NS" "spelling-bee.html" --path "spelling-bee.html"
npx wrangler kv key put --namespace-id "$NS" "stage.avif" --path "stage.avif"
npx wrangler kv key put --namespace-id "$NS" "stage.webp" --path "stage.webp"
npx wrangler kv key put --namespace-id "$NS" "terms.html" --path "terms.html"
npx wrangler kv key put --namespace-id "$NS" "text-twist-solver.html" --path "text-twist-solver.html"
npx wrangler kv key put --namespace-id "$NS" "unscramble-aeinrst.html" --path "unscramble-aeinrst.html"
npx wrangler kv key put --namespace-id "$NS" "unscramble-airbag.html" --path "unscramble-airbag.html"
npx wrangler kv key put --namespace-id "$NS" "unscramble-eagle.html" --path "unscramble-eagle.html"
npx wrangler kv key put --namespace-id "$NS" "unscramble.html" --path "unscramble.html"
npx wrangler kv key put --namespace-id "$NS" "unscramble-listen.html" --path "unscramble-listen.html"
npx wrangler kv key put --namespace-id "$NS" "unscramble-pallet.html" --path "unscramble-pallet.html"
npx wrangler kv key put --namespace-id "$NS" "unscramble-scrabble.html" --path "unscramble-scrabble.html"
npx wrangler kv key put --namespace-id "$NS" "word-checker.html" --path "word-checker.html"
npx wrangler kv key put --namespace-id "$NS" "word-generator.html" --path "word-generator.html"
npx wrangler kv key put --namespace-id "$NS" "wordle-helper.html" --path "wordle-helper.html"
npx wrangler kv key put --namespace-id "$NS" "word-lists.html" --path "word-lists.html"
npx wrangler kv key put --namespace-id "$NS" "words-containing.html" --path "words-containing.html"
npx wrangler kv key put --namespace-id "$NS" "word-scrambler.html" --path "word-scrambler.html"
npx wrangler kv key put --namespace-id "$NS" "words-ending-with.html" --path "words-ending-with.html"
npx wrangler kv key put --namespace-id "$NS" "words-starting-with.html" --path "words-starting-with.html"
npx wrangler kv key put --namespace-id "$NS" "words-with-friends.html" --path "words-with-friends.html"
```

`app.js`, `profit-v1.js`, `modern-v41.css`, `sitemap.xml` and HTML are cached for 60 seconds. `stage.avif` and `stage.webp` are new URLs (long cache). `stage.jpg` is unchanged and remains the fallback inside `<picture>`.

## Verify

1. `curl -sI https://lettersunscrambler.com/stage.avif` returns `content-type: image/avif` and 200.
2. `curl -s https://lettersunscrambler.com/ | grep -E 'stage.avif|role="tab"|id="keypad"'` shows the hero source, a tab, and the keypad.
3. `curl -s https://lettersunscrambler.com/about | grep -E 'twitter:card|og:description|og:image:height'` shows the completed cards. Same check for `/contact`, `/feedback`, `/guides/how-to-unscramble`, `/guides/blank-tiles`, `/guides/scrabble-vs-wwf`, `/guides/wordle-starters`, `/guides/pattern-solver`.
4. `curl -s https://lettersunscrambler.com/wordle-helper | grep -E 'id="keypad"|id="nextPlay"'` shows both in the HTML. An empty visit should not list thousands of words; type a yellow or a green before the list appears.
5. On the homepage, type LISTEN. SILENT, LISTEN, ENLIST and TINSEL should appear without a reload. The keypad works before the dictionary finishes.
6. After the 60 second HTML cache, a mobile Lighthouse run should land near CLS under 0.05 and home performance above 80. AdSense, GA4 (`G-VR1EE3K51N`) and the consent bar should still be present.

Archive `lus-deploy.tar.gz` contains `worker.js` and every file in the KV list, with these same paths.

