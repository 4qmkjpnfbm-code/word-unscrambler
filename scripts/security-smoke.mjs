// Security smoke test for LUS worker.js (local, no network): serves pages from the local files as the SITE KV.
import fs from "node:fs";
import assert from "node:assert/strict";
const src = fs.readFileSync("/workspace/word-unscrambler/worker.js", "utf8");
fs.writeFileSync("/tmp/lus-worker-under-test.mjs", src);
const { default: worker } = await import("/tmp/lus-worker-under-test.mjs?" + Date.now());
const root = "/workspace/word-unscrambler/";
const env = { SITE: { async get(k) { try { const b = fs.readFileSync(root + k); return b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength); } catch { return null; } } } };
let fetched = [];
globalThis.fetch = async (u, init) => { fetched.push(String(u)); return new Response(JSON.stringify({ success: true }), { status: 200 }); };
const H = "https://lettersunscrambler.com";
async function get(path, init) { return worker.fetch(new Request(H + path, init), env); }
let n = 0; const ok = (c, m) => { assert.ok(c, m); n++; };

// 1. Reflected XSS via search params: nothing but A-Z/? may reach the HTML.
const payloads = ['"><script>alert(1)</script>', "<img src=x onerror=alert(1)>", "'\"--></title><svg/onload=alert(1)>", "%3Cscript%3E", "javascript:alert(1)"];
for (const p of payloads) {
  for (const path of ["/", "/anagram-solver", "/spelling-bee", "/word-checker", "/crossword-solver"]) {
    for (const param of ["q", "mode", "center", "starts", "ends", "contains", "len"]) {
      const r = await get(path + "?" + param + "=" + encodeURIComponent(p) + "&q=AB" );
      const html = await r.text();
      ok(!/<script>alert|onerror=alert|onload=alert|<svg\/onload|javascript:alert/i.test(html), `XSS leak ${path} ${param} ${p}`);
    }
  }
}
// 2. Prototype keys must not become a mode.
for (const m of ["__proto__", "constructor", "toString", "hasOwnProperty"]) {
  const html = await (await get("/?q=LISTEN&mode=" + m)).text();
  ok(!html.includes('name="mode" value="' + m), "proto mode " + m);
}
// 3. Length caps.
const long = await (await get("/?q=" + "A".repeat(5000))).text();
ok(long.includes('id="letters" value="' + "A".repeat(16) + '"') && !long.includes("A".repeat(17)), "q capped at 16");
// 4. Open redirect / path tricks stay on our host.
for (const p of ["//evil.com/", "/%2F%2Fevil.com/", "/unscramble/train?q=x%0d%0aSet-Cookie:a=b", "/\\evil.com/"]) {
  const r = await get(p);
  const loc = r.headers.get("location") || "";
  ok(!loc || loc.startsWith(H + "/"), "redirect stays on host: " + p + " -> " + loc);
  ok(!/[\r\n]/.test(loc), "no CRLF in location");
}
// 5. Path traversal into KV: only allow-listed names are read.
const seen = []; const env2 = { SITE: { async get(k) { seen.push(k); return null; } } };
for (const p of ["/../wrangler.toml", "/worker.js", "/.git/config", "/%2e%2e/worker.js", "/wrangler.toml", "/CURSOR-HANDOVER.md"]) {
  const r = await worker.fetch(new Request(H + p), env2);
  ok(r.status === 404 || r.status === 301, "blocked " + p + " " + r.status);
}
ok(seen.every((k) => k === "404.html"), "KV only asked for 404.html: " + seen.join(","));
// 6. Security headers on HTML, 404, JSON.
const home = await get("/");
for (const h of ["content-security-policy-report-only", "cross-origin-opener-policy", "x-frame-options", "x-content-type-options", "strict-transport-security", "referrer-policy", "permissions-policy"]) ok(home.headers.get(h), "home header " + h);
const nf = await get("/nope-" + Date.now());
ok(nf.status === 404 && nf.headers.get("x-content-type-options") === "nosniff" && nf.headers.get("content-security-policy-report-only"), "404 headers");
const css = await get("/styles.css");
ok(!css.headers.get("content-security-policy-report-only") && css.headers.get("content-type").startsWith("text/css"), "css no CSP, right mime");
// 7. Feedback relay: cross-site browser posts refused, same-origin accepted.
fetched = [];
const body = JSON.stringify({ message: "hello there friend", kind: "bug" });
let r = await get("/feedback", { method: "POST", headers: { "content-type": "application/json", origin: "https://evil.example" }, body });
ok(r.status === 403 && fetched.length === 0, "cross-site feedback refused");
r = await get("/feedback", { method: "POST", headers: { "content-type": "application/json", origin: H }, body });
ok(r.status === 200 && fetched.length === 1 && r.headers.get("strict-transport-security"), "same-origin feedback ok");
r = await get("/feedback", { method: "POST", headers: { "content-type": "application/json" }, body });
ok(r.status === 200, "no-origin (non-browser) feedback still ok");
// 8. Wrong host -> canonical.
r = await worker.fetch(new Request("https://www.lettersunscrambler.com/x?q=1"), env);
ok(r.status === 301 && r.headers.get("location") === H + "/x?q=1", "www redirect");
console.log("LUS security smoke: " + n + " assertions passed");
