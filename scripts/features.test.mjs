import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import vm from "node:vm";

function load(file) {
  const context = { console };
  context.globalThis = context;
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(new URL("../" + file, import.meta.url), "utf8"), context);
  return context;
}

const daily = load("daily-share.js").DailyShare;
const ladder = load("word-ladder.js");

test("puzzle numbers increase one per day and share text hides the answer", () => {
  const a = new Date(2026, 0, 1);
  const b = new Date(2026, 0, 2);
  assert.equal(daily.puzzleNumber(a), 1);
  assert.equal(daily.puzzleNumber(b), 2);
  const line = daily.shareLine(12, 2, 5);
  assert.equal(line, "Letters Unscrambler Daily #12 ✅ in 2 tries 🔥 5-day streak lettersunscrambler.com");
  assert.equal(line.includes("COLD") || line.includes("WARM") || line.includes("LETTERS"), false);
  assert.equal(daily.shareLine(3, 1, 1), "Letters Unscrambler Daily #3 ✅ in 1 try 🔥 1-day streak lettersunscrambler.com");
});

test("streak, best and played update once per day", () => {
  let stats = daily.emptyStats();
  stats = daily.recordTry(stats, "2026-10-01");
  stats = daily.applySolve(stats, "2026-10-01");
  assert.equal(stats.played, 1);
  assert.equal(stats.streak, 1);
  assert.equal(stats.best, 1);
  assert.equal(stats.solvedTries, 1);
  const again = daily.applySolve(stats, "2026-10-01");
  assert.equal(again.played, 1);
  stats = daily.recordTry(stats, "2026-10-02");
  stats = daily.recordTry(stats, "2026-10-02");
  stats = daily.applySolve(stats, "2026-10-02");
  assert.equal(stats.played, 2);
  assert.equal(stats.streak, 2);
  assert.equal(stats.best, 2);
  assert.equal(stats.solvedTries, 2);
  stats = daily.applySolve(daily.recordTry(stats, "2026-10-05"), "2026-10-05");
  assert.equal(stats.streak, 1);
  assert.equal(stats.best, 2);
  assert.equal(stats.played, 3);
});

test("countdown text keeps a fixed shape", () => {
  const text = daily.countdown(new Date(2026, 9, 7, 22, 15, 3));
  assert.match(text, /^Next puzzle in \d{2}h \d{2}m \d{2}s$/);
});

test("shortest ladder changes one letter per step", () => {
  const words = ["cat", "cot", "cog", "dog", "car", "bat"];
  const found = ladder.shortestLadder(words, "CAT", "dog", 0);
  assert.equal(JSON.stringify(found.path), JSON.stringify(["cat", "cot", "cog", "dog"]));
  for (let i = 1; i < found.path.length; i++) {
    let diff = 0;
    for (let c = 0; c < found.path[i].length; c++) if (found.path[i][c] !== found.path[i - 1][c]) diff++;
    assert.equal(diff, 1);
  }
});

test("author bio stays hidden until Harry replaces the placeholder", () => {
  const about = fs.readFileSync(new URL("../about.html", import.meta.url), "utf8");
  const bio = fs.readFileSync(new URL("../author-bio.html", import.meta.url), "utf8");
  assert.match(about, /id="author" hidden/);
  assert.match(bio, /PLACEHOLDER/);
  assert.match(about, /Last reviewed 7 October 2026/);
  for (const name of ["guide-how-to-unscramble.html", "guide-blank-tiles.html", "how-it-works.html"]) {
    const html = fs.readFileSync(new URL("../" + name, import.meta.url), "utf8");
    assert.match(html, /Last reviewed 7 October 2026/);
  }
});

test("max steps and missing words produce no ladder", () => {
  const words = ["cat", "cot", "cog", "dog"];
  assert.equal(ladder.shortestLadder(words, "cat", "dog", 2).path, null);
  assert.equal(ladder.shortestLadder(words, "cat", "zzz", 0).error, "missing");
  assert.equal(ladder.shortestLadder(words, "cat", "cats", 0).error, "length");
  assert.equal(ladder.shortestLadder(words, "to", "go", 0).error, "range");
});
