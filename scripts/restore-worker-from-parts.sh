#!/usr/bin/env bash
# Rebuild production worker.js from base64-split parts.
set -euo pipefail
cd "$(dirname "$0")/.."
if [[ -f worker.min.part0.js.b64 ]]; then
  base64 -d worker.min.part0.js.b64 worker.min.part1.js.b64 worker.min.part2.js.b64 2>/dev/null || true
  cat worker.min.part0.js.b64 worker.min.part1.js.b64 worker.min.part2.js.b64 | tr -d '\n' | base64 -d > worker.js
else
  cat worker.min.part0.js worker.min.part1.js worker.min.part2.js > worker.js
fi
wc -c worker.js
echo "Rebuilt worker.js — review, then wrangler deploy"
