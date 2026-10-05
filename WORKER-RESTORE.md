# Worker restore

**Live site is fine.** Cloudflare Worker `word-unscrambler` (deployment family `0f44fc56…`) serves [lettersunscrambler.com](https://lettersunscrambler.com) from KV + the deployed Worker. Do **not** `wrangler deploy` from the stub `worker.js` on this branch (it returns 503 on purpose).

## Where the real Worker source is

- Grok Bot box: `/workspace/word-unscrambler/worker.js` (readable) and `worker.min.js` (same behaviour)
- Backup tarball on the box: `/workspace/letters-counsel-2026-10-05.bundle`

## To put a deployable `worker.js` back on `main`

Copy the box file over this stub, commit, review, then deploy:

```bash
# from a machine that has the box file or the bundle
cp /path/to/worker.js ./worker.js
git add worker.js && git commit -m "Restore production worker.js"
npx wrangler deploy
```

MCP push of the full ~19KB file from this agent hit size/activity limits; the stub + this note are intentional so nobody ships a blank PLACEHOLDER again.
