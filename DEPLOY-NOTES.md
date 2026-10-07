# Deploy seo-v2

Draft branch `seo-v2` from `main`. Do not merge until Harry says so. This environment does not deploy.

## Worker

`worker.js` changed. It now imports `seo-redirect.mjs`, so deploy the Worker from this branch with Wrangler. Pasting `worker.js` into the dashboard on its own will not include the redirect helper.

```bash
npx wrangler deploy -c wrangler.toml
```

Do the KV upload first, then the Worker deploy.

What the Worker change does:

- `http`, `www`, a trailing slash, a `.html` copy, and a retired path all 301 once to the final URL (`https://lettersunscrambler.com/about`, not `/about.html` or `/about/`).
- `/404.html` and unknown URLs return HTTP 404 with `noindex`.
- `/author-bio.html` stays available for the About page and sends `noindex`.

Preview still uses `wrangler.preview.toml` only. It does not touch production KV.

## KV keys to re-upload

Keys are paths with no leading slash. Upload these changed files:

- `sitemap.xml`
- `404.html`
- `2-letter-words.html`
- `about.html`
- `contact.html`
- `how-it-works.html`
- `index.html`
- `modern-v42.css`
- `feedback.html`
- `guide-blank-tiles.html`
- `guide-how-to-unscramble.html`
- `guide-pattern-solver.html`
- `guide-scrabble-vs-wwf.html`
- `guide-wordle-starters.html`
- `letter-boxed.html`
- `multiple-word-unscrambler.html`
- `scrabble-word-finder.html`
- `spelling-bee.html`
- `unscramble.html`
- `unscramble-listen.html`
- `word-scrambler.html`

`seo-redirect.mjs` is part of the Worker bundle, not a KV key. `robots.txt` is unchanged and already points at the sitemap.
