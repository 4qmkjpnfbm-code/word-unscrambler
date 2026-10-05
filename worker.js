/**
 * DO NOT deploy this file with wrangler.
 * Live Worker is Cloudflare word-unscrambler (deployment 0f44fc56…).
 * Full source on the Grok Bot box: /workspace/word-unscrambler/worker.js
 * Backup: /workspace/letters-counsel-2026-10-05.bundle
 * Minified twin: worker.min.js in this repo (push separately).
 * This stub replaces an accidental PLACEHOLDER so nobody ships a blank Worker.
 */
export default {
  async fetch() {
    return new Response(
      "lettersunscrambler worker.js on GitHub is a stub. Use the live Cloudflare Worker or restore from the box backup.",
      { status: 503, headers: { "content-type": "text/plain;charset=UTF-8" } }
    );
  }
};
