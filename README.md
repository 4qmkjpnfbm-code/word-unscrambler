# Word Unscrambler

Free, private word unscrambler for Scrabble, Wordle, anagrams, jumbles and crosswords.

- Dictionary: ENABLE (~168,580 words) plus common tournament two-letter words (QI, ZA, OK)
- Hosting: Cloudflare Worker (self-contained — no GitHub fetch for HTML)
- Staging: https://word-unscrambler.hdkdistributionltd.workers.dev/

## Buy this domain (do this first)

Exact-match `.com` names are taken. These were **available** on Cloudflare Registrar on 21 Aug 2026:

| Domain | Why | Price / year |
| --- | --- | --- |
| **thewordunscrambler.co.uk** | Closest to the main keyword. Best SEO pick. | ~$5.30 |
| **wordfromletters.co.uk** | Matches “words from letters” searches | ~$5.30 |
| **lettersolver.co.uk** | Brandable + keyword | ~$5.30 |
| **ukwordfinder.com** | If you want a `.com` | ~$10.46 |

Buy **thewordunscrambler.co.uk** (or both that and `wordfromletters.co.uk` and redirect). Register it on the same Cloudflare account that owns this Worker (`hdkdistributionltd`), then attach it as a custom domain on the `word-unscrambler` Worker. After DNS is live, change `ORIGIN` in `scripts/build-word-site.mjs` and rebuild so canonical URLs, sitemap and Open Graph point at the new host.

Do not leave a brand-new SEO domain canonicalised to `workers.dev`.

## Go live checklist

1. Buy the domain on Cloudflare Registrar.
2. Workers → word-unscrambler → Settings → Domains → add the hostname.
3. Rebuild with the new `ORIGIN`, redeploy the Worker.
4. Google Search Console: add the domain property, submit `/sitemap.xml`.
5. Optional: Google AdSense once indexed (privacy page already covers this).

## Local

`sh /workspace/startup.sh` serves the static site for preview.
