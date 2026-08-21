# Word Unscrambler

Free, private word unscrambler for Scrabble, Wordle, anagrams, jumbles and crosswords.

- Dictionary: ENABLE (~168,580 words) plus common tournament two-letter words (QI, ZA, OK)
- Hosting: Cloudflare Worker + KV (fills from this GitHub repo on cache miss)
- Live now: https://word-unscrambler.hdkdistributionltd.workers.dev/
- Operator: HDK Distribution Ltd, United Kingdom

## Buy this domain first (required for SEO)

Exact-match `.com` names are taken. Checked on Cloudflare Registrar **21 Aug 2026**:

| Domain | Why | Price / year | Status |
| --- | --- | --- | --- |
| **thewordunscrambler.co.uk** | Closest to the main keyword. Best SEO pick. | $5.30 | **Buy this** |
| wordfromletters.co.uk | Matches “words from letters” searches | $5.30 | Optional redirect |
| lettersolver.co.uk | Brandable + keyword | $5.30 | Optional |
| theunscrambler.co.uk | Short brand | $5.30 | Backup |
| ukwordfinder.com | If you want a `.com` | $10.46 | Optional |

**Buy `thewordunscrambler.co.uk` on the same Cloudflare account that owns this Worker** (`hdkdistributionltd` / Hdkdistributionltd@gmail.com).

Do not leave a brand-new SEO domain canonicalised to `workers.dev`.

### After you buy it — 5 minutes

1. Cloudflare Dashboard → Registrar → the new domain (DNS is automatic).
2. Workers → **word-unscrambler** → Settings → Domains → add `thewordunscrambler.co.uk` and `www.thewordunscrambler.co.uk`.
3. Tell me the domain is attached. I will rebuild with `ORIGIN=https://thewordunscrambler.co.uk` so canonicals, sitemap, Open Graph and robots all point at the real host, then purge KV.
4. Google Search Console → add the **domain** property → submit `https://thewordunscrambler.co.uk/sitemap.xml`.
5. Optional later: Google AdSense (privacy page already covers this). Email routing: `privacy@thewordunscrambler.co.uk` → your Gmail.

## What is already live

Every public page, the solver, the ENABLE dictionary, Open Graph card, robots and sitemap.

Try: https://word-unscrambler.hdkdistributionltd.workers.dev/?q=LISTEN

## Local preview

`sh /workspace/startup.sh` serves the static site.
