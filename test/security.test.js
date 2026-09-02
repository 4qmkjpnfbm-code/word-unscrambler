import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { CSP, handleFeedback, noindexIfQuery } from "../src/lib.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

test("worker source has no GitHub-raw and no dolph/dictionary", () => {
  const srcDir = join(root, "src");
  for (const name of readdirSync(srcDir)) {
    if (!name.endsWith(".js")) continue;
    const text = readFileSync(join(srcDir, name), "utf8");
    assert.equal(text.includes("raw.githubusercontent.com"), false, name);
    assert.equal(text.includes("dolph/dictionary"), false, name);
  }
});

test("CSP has no unsafe-eval and allows ads + gtag", () => {
  assert.equal(CSP.includes("unsafe-eval"), false);
  assert.ok(CSP.includes("pagead2.googlesyndication.com"));
  assert.ok(CSP.includes("www.googletagmanager.com"));
});

test("querystring q/mode sets x-robots-tag", () => {
  const u = new URL("https://lettersunscrambler.com/?q=listen");
  assert.equal(noindexIfQuery(u)["x-robots-tag"], "noindex, follow");
  const clean = new URL("https://lettersunscrambler.com/scrabble-word-finder");
  assert.equal(noindexIfQuery(clean), undefined);
});

test("POST /feedback human=false → 400", async () => {
  const req = new Request("https://lettersunscrambler.com/feedback", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      origin: "https://lettersunscrambler.com"
    },
    body: JSON.stringify({
      message: "Please add more bingo stems to the list.",
      human: false
    })
  });
  const res = await handleFeedback(req);
  assert.equal(res.status, 400);
  const body = await res.json();
  assert.equal(body.ok, false);
});
