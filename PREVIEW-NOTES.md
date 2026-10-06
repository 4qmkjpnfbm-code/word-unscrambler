# LUS Material 3 preview

Do not merge this branch. The live Worker reads files from KV and falls back to `main`. Merging would change production.

## Deploy

From this branch, after `npm install`:

```bash
npx wrangler deploy -c wrangler.preview.toml
```

That publishes Worker `lus-redesign-preview` with `workers_dev = true`, no routes, and no production KV binding. The preview serves this branch through Workers static assets.

Local check (port 8787 is often taken):

```bash
npx wrangler dev -c wrangler.preview.toml --port 8912 --ip 127.0.0.1 --local --persist-to /tmp/lus-wrangler
```

`--persist-to` keeps Miniflare's state outside the repo so the file watcher does not reload in a loop.

## Lighthouse

Single runs against `wrangler dev` on 127.0.0.1:8912, 6 October 2026. Chrome headless, mobile and desktop. The preview Worker had already stripped AdSense, GA4 and the consent bar.

| Page | Perf | FCP ms | LCP ms | TBT ms | CLS | Weight KB |
|---|---:|---:|---:|---:|---:|---:|
| / mobile | 100 | 1374 | 1524 | 0 | 0.000 | 678 |
| / desktop | 100 | 388 | 457 | 0 | 0.000 | 687 |
| /wordle-helper mobile | 100 | 1222 | 1372 | 0 | 0.000 | 666 |
| /wordle-helper desktop | 100 | 338 | 338 | 0 | 0.000 | 666 |
| /anagram-solver mobile | 100 | 1222 | 1372 | 0 | 0.007 | 665 |
| /anagram-solver desktop | 100 | 342 | 361 | 0 | 0.000 | 665 |

Home mobile LCP is the headline (`h1.split-title`), painted from the first frame. CLS is under 0.05 on every page.

Typing LISTEN on the home tool returns 92 ENABLE words, including LISTEN, SILENT, ENLIST and TINSEL. No console errors.

## What the preview changes

- Shared stylesheet `modern-v42.css`: white `#ffffff` / `#f8f9fa` surfaces, borders `#dadce0`, text `#202124` / `#5f6368`, Google Blue `#1a73e8` (hover `#1765cc`), violet `#a142f4` only on the kicker gradient, brand mark and bingo chips.
- Roboto self-hosted subset, three weights, 50,412 bytes total, `font-display: swap`. Only the 500 weight is preloaded.
- Desktop hero is `/img/listen-hero.avif` (8,038 bytes, 1200×428) with a WebP fallback (16,362 bytes). The `<source media="(min-width: 960px)">` means phones do not download it. The letters field stays under the headline.
- Every HTML page links the new stylesheet and drops the Google Fonts CDN. Dark theme is forced off and the theme button is hidden.
- Results are white chips. Tool cards, tips and the existing FAQ use the same card style.
- Preview responses send `X-Robots-Tag: noindex, nofollow`. `/robots.txt` is `Disallow: /`. Ad and GA scripts are removed and each ad slot is a grey box. The HTML source still contains AdSense, GA4 and the consent bar for a later production pass.

## Unresolved

- This environment has no Cloudflare credentials, so the Worker was not deployed.
- Do not merge, and do not deploy `wrangler.toml` (that config still points at the live KV namespace).
