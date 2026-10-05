# Worker restore

Live site uses Cloudflare Worker `word-unscrambler` (not this stub).

To restore `worker.js` on `main` for wrangler deploys:
1. Copy `/workspace/word-unscrambler/worker.js` (or extract from `letters-counsel-2026-10-05.bundle`) over `worker.js`.
2. Commit and only then `npx wrangler deploy`.

Do not deploy the stub.
