import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import { classifyPath, prettyMap, withRequestQuery } from "../seo-redirect.mjs";

const routes = {
  "/": "index.html",
  "/about": "about.html",
  "/guides/how-to-unscramble": "guide-how-to-unscramble.html",
  "/unscramble/listen": "unscramble-listen.html",
  "/jumble-solver": "jumble-solver.html"
};
const gone = {
  "/words-from-letters": "/",
  "/word-scrambler": "/jumble-solver",
  "/unscramble/train": "/?q=TRAIN"
};
const pretty = prettyMap(routes);

test("retired, slash and html URLs resolve in one hop", () => {
  assert.equal(classifyPath("/about/", gone, pretty).location, "/about");
  assert.equal(classifyPath("/about.html", gone, pretty).location, "/about");
  assert.equal(classifyPath("/index.html", gone, pretty).location, "/");
  assert.equal(classifyPath("/guide-how-to-unscramble.html", gone, pretty).location, "/guides/how-to-unscramble");
  assert.equal(classifyPath("/guides/how-to-unscramble.html", gone, pretty).location, "/guides/how-to-unscramble");
  assert.equal(classifyPath("/unscramble-listen.html", gone, pretty).location, "/unscramble/listen");
  assert.equal(classifyPath("/words-from-letters/", gone, pretty).location, "/");
  assert.equal(classifyPath("/word-scrambler.html", gone, pretty).location, "/jumble-solver");
  assert.equal(classifyPath("/unscramble/train", gone, pretty).location, "/?q=TRAIN");
  assert.equal(classifyPath("/about", gone, pretty).type, "ok");
  assert.equal(classifyPath("/404.html", gone, pretty).type, "notfound");
  const params = new URLSearchParams("q=LISTEN");
  assert.equal(withRequestQuery("/about", params), "https://lettersunscrambler.com/about?q=LISTEN");
  assert.equal(withRequestQuery("/?q=TRAIN", new URLSearchParams()), "https://lettersunscrambler.com/?q=TRAIN");
});

test("sitemap lists only final indexable URLs", () => {
  const xml = fs.readFileSync(new URL("../sitemap.xml", import.meta.url), "utf8");
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  const required = [
    "https://lettersunscrambler.com/",
    "https://lettersunscrambler.com/about",
    "https://lettersunscrambler.com/scrabble-score-calculator",
    "https://lettersunscrambler.com/boggle-solver",
    "https://lettersunscrambler.com/daily",
    "https://lettersunscrambler.com/word-ladder-solver"
  ];
  for (const url of required) assert.ok(locs.includes(url), url);
  for (const url of locs) {
    assert.equal(url.includes("?"), false, url);
    assert.equal(url.endsWith(".html"), false, url);
    assert.ok(!url.endsWith("/") || url === "https://lettersunscrambler.com/", url);
    assert.match(url, /^https:\/\/lettersunscrambler\.com/);
    assert.equal(url.includes("www."), false);
  }
  assert.equal(new Set(locs).size, locs.length);
  const robots = fs.readFileSync(new URL("../robots.txt", import.meta.url), "utf8");
  assert.match(robots, /Sitemap: https:\/\/lettersunscrambler\.com\/sitemap\.xml/);
});

test("indexable pages have one canonical, one h1, and short unique tags", () => {
  const root = new URL("../", import.meta.url);
  const names = fs.readdirSync(root).filter((n) => n.endsWith(".html") && n !== "author-bio.html");
  const titles = new Map();
  const descs = new Map();
  for (const name of names) {
    const html = fs.readFileSync(new URL(name, root), "utf8");
    const robots = (html.match(/<meta name="robots" content="([^"]+)"/i) || [])[1] || "";
    const title = (html.match(/<title>([^<]*)<\/title>/i) || [])[1] || "";
    const desc = (html.match(/<meta name="description" content="([^"]*)"/i) || [])[1] || "";
    const h1 = html.match(/<h1\b/gi) || [];
    const canonicals = [...html.matchAll(/rel="canonical" href="([^"]+)"/gi)].map((m) => m[1]);
    if (name === "404.html") {
      assert.match(robots, /noindex/);
      assert.equal(canonicals.length, 0);
      continue;
    }
    assert.equal(h1.length, 1, name);
    assert.ok(title.length > 0 && title.length < 60, name + " title " + title.length);
    assert.ok(desc.length > 0 && desc.length < 155, name + " desc " + desc.length);
    assert.equal(canonicals.length, 1, name);
    assert.match(canonicals[0], /^https:\/\/lettersunscrambler\.com/);
    assert.equal(canonicals[0].includes("?"), false, name);
    if (titles.has(title)) assert.fail("duplicate title " + title);
    if (descs.has(desc)) assert.fail("duplicate description " + name);
    titles.set(title, name);
    descs.set(desc, name);
    if (!/noindex/i.test(robots)) assert.equal(canonicals[0].endsWith(".html"), false);
    for (const href of html.matchAll(/href="([^"]+)"/g)) {
      const url = href[1];
      if (!url.startsWith("/") && !url.startsWith("https://lettersunscrambler.com")) continue;
      const path = url.replace("https://lettersunscrambler.com", "").split("?")[0].split("#")[0];
      if (path.endsWith(".html")) assert.fail(name + " links " + url);
      if (path.length > 1 && path.endsWith("/")) assert.fail(name + " slash " + url);
      if (path === "/word-scrambler" || path === "/multiple-word-unscrambler" || path === "/words-from-letters") assert.fail(name + " gone " + url);
    }
  }
});
