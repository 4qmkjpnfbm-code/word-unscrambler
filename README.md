# lettersunscrambler.com

Free, private English word unscrambler for Scrabble-style racks, Wordle filters, anagrams, jumbles and crossword patterns.

- **Live:** https://lettersunscrambler.com
- **Dictionary:** ENABLE (~168k public-domain words) plus a few common short plays (QI, ZA, OK, …)
- **Solver:** runs in the browser (`app.js` + ENABLE). Letters are not sent to our backend as search queries.
- **Hosting:** Cloudflare Worker `word-unscrambler` serving HTML from this GitHub repo (`main`)
- **Operator:** HDK Distribution Ltd, United Kingdom — hdkdistributionltd@gmail.com
- **AdSense publisher:** ca-pub-2666058844257008 (ads after the tool panel only)

## Repo map

| Path | Role |
| --- | --- |
| `worker.js` | Edge routing, trailing-slash 301s, legacy 301s, HTML injection |
| `wrangler.toml` | Worker name + KV binding `SITE` |
| `app.js` / `styles.css` / `modern-v*.css` | Client solver + wood/felt UI |
| `sitemap.xml` / `robots.txt` / `ads.txt` | Crawlers and ads.txt |
| Tool `*.html` pages | Unique intros + shared panel chrome |

## Deploy

1. Push HTML/content to `main` (Worker fetches GitHub raw for HTML with a short cache).
2. If `worker.js` or `wrangler.toml` changed, deploy the Worker:

```bash
npx wrangler deploy
# account c9fe7d6bb86eb2dbc6752bf8f453e877
```

GitHub Action `Deploy Worker` is `workflow_dispatch` only.

## Hard rules

- Canonical host is **lettersunscrambler.com** (not workers.dev, not any older `.co.uk` plan).
- No mass `/unscramble/*` doorway farms.
- No above-the-fold ads over the letter box.
- No public X / Twitter handle in meta or schema.
- No invented stats. ENABLE only — not TWL/CSW clones.

## Local preview

Serve the static files from this directory with any static server, or use Wrangler to run `worker.js` against the same routes.
