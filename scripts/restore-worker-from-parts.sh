#!/usr/bin/env bash
# Rebuild production worker.js from split parts (minified equivalent).
set -euo pipefail
cd "$(dirname "$0")/.."
cat worker.min.part0.js worker.min.part1.js worker.min.part2.js > worker.js
wc -c worker.js
echo "Rebuilt worker.js — review, then wrangler deploy"
