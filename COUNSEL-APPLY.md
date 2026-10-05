# Counsel apply — lettersunscrambler.com (2026-10-05 BST / UTC+1)

## Live (done)
- Worker version: **0f44fc56-8c71-4d57-a899-7f30e5595e0e** (KV `SITE` first, then GitHub main fallback)
- Thickened tool pages served from KV namespace `3a8db125fded4e80873b31240dd5f0e8`
- Trailing-slash → non-slash **301**
- `/word-scrambler` + `/multiple-word-unscrambler` → `/jumble-solver` **301**
- privacy: under-13 + Consent Mode / Funding Choices (no invented CMP IDs)
- about: HDK Distribution Ltd editorial standards
- README / sitemap / llms on main

## GitHub main (MCP)
- `50322779` README lettersunscrambler.com only
- `cddd14bc` sitemap lastmod; drop consolidated URLs
- `08235877` llms.txt
- `e418eec6` about E-E-A-T
- `4826e945` privacy under-13 + Funding Choices
- **`worker.js` still PLACEHOLDER** — restore from local `/workspace/word-unscrambler/worker.js` or bundle `letters-counsel-2026-10-05.bundle` (local commit `895ef3c`). Live Worker is fine (wrangler); do not redeploy PLACEHOLDER.

## Thickened HTML on GitHub
Live KV has full thickened pages. Mirror to main when payload allows (wordle-helper, crossword-solver, words-with-friends, is-it-a-word, text-twist-solver, hangman-solver, anagram-solver, jumble-solver).

## Do NOT
- Click AdSense reapply
- Invent stats / X handle / mass `/unscramble` farms
