# Worker restore

Live site uses the Cloudflare Worker `word-unscrambler` (not the stub `worker.js` on this branch).

## Rebuild production Worker source on main

```bash
bash scripts/restore-worker-from-parts.sh
# writes worker.js from worker.min.part0.js + part1 + part2 (minified equivalent of live)
npx wrangler deploy   # only after reviewing worker.js
```

Readable source also lives on the Grok Bot box at `/workspace/word-unscrambler/worker.js` and in the counsel backup bundle.

Do not deploy the stub `worker.js` that returns 503.
