# Deploy features-v1

Draft branch `features-v1`. Do not merge until Harry says so. This environment does not deploy. Fetch the branch via codeload and deploy the preview yourself:

```bash
npx wrangler deploy -c wrangler.preview.toml
```

Use only `wrangler.preview.toml`. It publishes `lus-redesign-preview`, with `workers_dev` on, no routes, and no production KV binding. `preview-worker.js` serves this branch and still strips AdSense, GA4 and the consent bar.

## Worker

`worker.js` changed. The new page is not reachable on the live Worker until you deploy production after a merge:

```bash
npx wrangler deploy -c wrangler.toml
```

The change allow-lists `/word-ladder-solver` (file `word-ladder-solver.html`) plus `word-ladder.js` and `daily-share.js`. Without that deploy those URLs 404 even if the bytes are in KV.

Do the KV upload first, then the Worker deploy, so the new allow-list and the new files go live together.

## KV keys to re-upload

Keys are paths with no leading slash. The live Worker uses KV `SITE` when the value is longer than 20 bytes, so changed files must be uploaded again.

New:

- `word-ladder-solver.html`
- `word-ladder.js`
- `daily-share.js`

Changed:

- `index.html`
- `app.js`
- `modern-v42.css`
- `sitemap.xml`
- `llms.txt`

Ads stay after the results on the home page and on the ladder page. No new font or hero image.
