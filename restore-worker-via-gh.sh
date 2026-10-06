#!/bin/bash
# Apply Counsel worker restore when you have gh auth
set -euo pipefail
cd "$(dirname "$0")"
gh api --method PUT /repos/4qmkjpnfbm-code/word-unscrambler/contents/worker.js \
  -f message='Counsel: restore Worker — trailing-slash 301, consolidate GONE, KV-first pull' \
  -f branch=main \
  -f sha=311c8dd0658759f372c9be9a2065c327fdb1a203 \
  -f content="$(base64 -w0 worker.js)"
