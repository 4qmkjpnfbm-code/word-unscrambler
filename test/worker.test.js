import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import worker from "../src/worker.js";
import { EXTRA_WORDS, mergeExtras, resolveAsset } from "../src/lib.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const pub = join(root, "public");

function mockAssets() {
  return {
    async fetch(request) {
      const u = new URL(request.url);
      let name = u.pathname.replace(/^\//, "");
      if (!name) name = "index.html";
      const file = join(pub, name);
      if (!existsSync(file)) return new Response("missing", { status: 404 });
      const buf = readFileSync(file);
      return new Response(buf, { status: 200 });
    }
  };
}

async function hit(path, host = "lettersunscrambler.com", extra = {}) {
  const url = `https://${host}${path}`;
  const req = new Request(url, extra);
  return worker.fetch(req, { ASSETS: mockAssets() });
}

test("path mapping / → index.html", () => {
  assert.equal(resolveAsset("/").file, "index.html");
});

test("path mapping /scrabble-word-finder → scrabble-word-finder.html", () => {
  assert.equal(resolveAsset("/scrabble-word-finder").file, "scrabble-word-finder.html");
});

test("path mapping /unscramble/listen → unscramble-listen.html", () => {
  assert.equal(resolveAsset("/unscramble/listen").file, "unscramble-listen.html");
});

test("unknown path → 404.html", () => {
  const r = resolveAsset("/no-such-page-xyz");
  // one-segment maps to name.html then worker falls back when missing
  assert.equal(r.file, "no-such-page-xyz.html");
});

test("GET / serves index with CSP", async () => {
  const res = await hit("/");
  assert.equal(res.status, 200);
  assert.ok(res.headers.get("content-security-policy"));
  assert.ok(res.headers.get("cross-origin-opener-policy"));
  const html = await res.text();
  assert.ok(html.includes("Word Unscrambler"));
});

test("GET /scrabble-word-finder is 200", async () => {
  const res = await hit("/scrabble-word-finder");
  assert.equal(res.status, 200);
});

test("GET /unscramble/listen is 200", async () => {
  const res = await hit("/unscramble/listen");
  assert.equal(res.status, 200);
});

test("GET /unscramble/eagle is the restored page, not the stub", async () => {
  const res = await hit("/unscramble/eagle");
  assert.equal(res.status, 200);
  const html = await res.text();
  assert.ok(html.length > 5000);
  assert.ok(html.includes("site-header") || html.includes("brand-name") || html.includes("Word Unscrambler"));
});

test("GET /no-such-page-xyz is 404", async () => {
  const res = await hit("/no-such-page-xyz");
  assert.equal(res.status, 404);
});

test("unknown host canonicalises to https://lettersunscrambler.com", async () => {
  const res = await hit("/scrabble-word-finder", "evil.example");
  assert.equal(res.status, 301);
  assert.equal(res.headers.get("location"), "https://lettersunscrambler.com/scrabble-word-finder");
});

test("localhost is not redirected", async () => {
  const res = await hit("/", "localhost");
  assert.equal(res.status, 200);
});

test("/words.txt is served from ASSETS and contains extras", async () => {
  const res = await hit("/words.txt");
  assert.equal(res.status, 200);
  const text = await res.text();
  const lines = text.trim().split("\n");
  assert.ok(lines.length > 160000);
  for (const w of ["qi", "za", "ok", ...EXTRA_WORDS]) {
    assert.ok(text.toLowerCase().includes("\n" + w + "\n") || text.toLowerCase().startsWith(w + "\n") || text.toLowerCase().endsWith("\n" + w) || text.toLowerCase().split("\n").includes(w), w);
  }
});

test("mergeExtras does not duplicate", () => {
  const once = mergeExtras("qi\nza\nok\n");
  const twice = mergeExtras(once);
  assert.equal(twice, once);
});

test("app.js sources are local words.txt only", () => {
  const js = readFileSync(join(pub, "app.js"), "utf8");
  const m = js.match(/const sources = ([^;]+);/);
  assert.ok(m);
  assert.equal(m[1].includes("raw.githubusercontent.com"), false);
  assert.equal(m[1].includes("enable1"), false);
  assert.ok(m[1].includes("/words.txt"));
});
