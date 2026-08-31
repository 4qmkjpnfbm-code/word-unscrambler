# CURSOR HANDOVER — lettersunscrambler.com

Drop this file in the repo root. Read it before any edit.
Last updated: 2026-08-31.

## What this is
Free in-browser English word unscrambler at https://lettersunscrambler.com
Job: type letters → find words. Modes: subset unscrambler, anagrams/jumble, Wordle, crossword pattern, Scrabble scores.
Dictionary: public-domain ENABLE (~168k). NOT NASPA TWL or Collins CSW.
Solver: app.js + words.txt.gz in the browser. Letters do not leave the device.
Legal: HDK Distribution Ltd, UK. hdkdistributionltd@gmail.com
This handover is ONLY for this property.

## IDs
- Origin: https://lettersunscrambler.com
- Legacy: https://word-unscrambler.hdkdistributionltd.workers.dev
- GitHub: 4qmkjpnfbm-code/word-unscrambler  branch main
- Last good full-site commit before eagle break: e1d81f1e2b80f598d70a7b07713228b2bb8e45a6
- CF account: c9fe7d6bb86eb2dbc6752bf8f453e877 (Hdkdistributionltd@gmail.com)
- Worker: word-unscrambler  compatibility_date 2024-09-23  ES module worker.js
- KV SITE: 3a8db125fded4e80873b31240dd5f0e8
- AdSense: ca-pub-2666058844257008  review requested 2026-08-29 WAIT
- GA4: G-VR1EE3K51N  consent localStorage.wu_consent
- Theme: localStorage.wu_theme
- IndexNow key file: /8d7c4a91b2e05f63c1a47d90e8b6f352.txt
- GSC: sc-domain:lettersunscrambler.com  sitemap Success 75 URLs last read 2026-08-30

Never publish twitter:site or any X handle.
README.md is STALE (still sells thewordunscrambler.co.uk). Canonical is lettersunscrambler.com.

## How it is served
Browser → CF Worker word-unscrambler → ROUTES path→html → GitHub raw and/or KV SITE.
Pushing HTML to main goes live after short cache (HTML max-age ~60s).
Pushing Worker requires wrangler or dashboard multipart PUT. GitHub Action is workflow_dispatch only.
NEVER PUT a stub worker. Verify worker.js has export default, ROUTES, letter-boxed before PUT.

## Design
Read DESIGN.md. en-GB. Wood/felt in both themes. Fraunces + Source Sans 3. Felt #1f4a38.
No Inter/Roboto/Poppins. No doorway farms. No TWL/CSW clone. Ads never cover letter box or Best play.
Unique 150–300 word intros. Mobile 720px, 44px targets.

## Current state 2026-08-31
WORKING: core tool routes 200; unique copy on home, 2-letter, q-without-u, jumble, most tools; GSC sitemap Success; 5 URL inspections requested; AdSense in review.
BROKEN: /unscramble/eagle is a slim page without site-header (commits 382de613 then 0a9db345). Restore from e1d81f1e.
```
git checkout e1d81f1e2b80f598d70a7b07713228b2bb8e45a6 -- unscramble-eagle.html
git commit -m "Restore full unscramble-eagle.html from e1d81f1"
git push origin main
```
Do not request indexing on eagle until chrome is back.
Airbag and pallet were not overwritten.
Parked: bank ****59; extra GA product links; mass /unscramble/* racks.

## Profit path
Default 90 days: restore eagle → wait AdSense → let the 75 sitemap URLs + 5 inspected pages index → thicken existing money pages only → measure GSC queries.
Do NOT generate thousands of rack pages. Do not buy links. Do not add above-the-fold ads.
Expect weeks-months of pennies after approval. If no impressions after 90 days post-approval, more pages are not the fix.

## Cursor first tasks
1. Restore eagle. Verify live header.
2. Fix README to lettersunscrambler.com.
3. Optional unique paragraphs on eagle/airbag/pallet AFTER restore.
4. Leave GSC/AdSense alone.
5. Refuse thin SEO farms.

## Hard rules
No stubs. No PLACEHOLDER. No mass racks. No TWL/CSW. No X identity. No React rewrite unless asked. Cache-bust css/js query strings when those files change. If you change ROUTES, deploy the Worker.
