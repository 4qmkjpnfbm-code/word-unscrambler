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

test("homepage lists each tool once in a single card grid", () => {
  const html = fs.readFileSync(new URL("../index.html", import.meta.url), "utf8");
  const body = html.split("<footer")[0];
  assert.equal((body.match(/class="tool-row"/g) || []).length, 1);
  assert.equal((body.match(/class="related"/g) || []).length, 0);
  assert.equal((body.match(/class="bento-card" href=/g) || []).length, 0);
  const cards = body.match(/class="tool-card" href="([^"]+)"/g) || [];
  const hrefs = cards.map((c) => c.match(/href="([^"]+)"/)[1]);
  assert.equal(new Set(hrefs).size, hrefs.length);
  assert.ok(hrefs.includes("/word-ladder-solver"));
  assert.ok(hrefs.includes("/jumble-solver"));
});

test("scrabble score applies premiums before the bingo", () => {
  const score = load("scrabble-score.js");
  assert.equal(score.scorePlay("quiz", { game: "scrabble" }).total, 22);
  assert.equal(score.scorePlay("quiz", { game: "wwf" }).total, 23);
  const doubled = score.scorePlay("quiz", { game: "scrabble", letterMult: [1, 1, 1, 2], wordMult: 2 });
  assert.equal(doubled.face, 32);
  assert.equal(doubled.total, 64);
  const bingo = score.scorePlay("letters", { game: "scrabble", bingo: true, wordMult: 2 });
  assert.equal(bingo.face, 7);
  assert.equal(bingo.bingo, 50);
  assert.equal(bingo.total, 64);
  const blank = score.scorePlay("fizz", { blanks: [false, false, false, true] });
  assert.equal(blank.total, 15);
  assert.equal(score.scorePlay("", {}).error, "empty");
});

test("boggle finds touching words and scores the Qu die once", () => {
  const boggle = load("boggle.js");
  assert.equal(boggle.boggleScore(3), 1);
  assert.equal(boggle.boggleScore(4), 1);
  assert.equal(boggle.boggleScore(5), 2);
  assert.equal(boggle.boggleScore(6), 3);
  assert.equal(boggle.boggleScore(7), 5);
  assert.equal(boggle.boggleScore(8), 11);
  const row = ["c", "a", "t", "s"].concat(Array(12).fill("x"));
  const found = boggle.solveBoggle(["cat", "cats", "sat", "at"], row);
  assert.equal(JSON.stringify(found.words.map((w) => w.word)), JSON.stringify(["cat", "cats"]));
  assert.equal(found.total, 2);
  const qu = ["qu", "i", "t", "x"].concat(Array(12).fill("z"));
  const quit = boggle.solveBoggle(["quit", "it"], qu);
  assert.equal(JSON.stringify(quit.words.map((w) => w.word)), JSON.stringify(["quit"]));
  const reused = ["c"].concat(Array(15).fill("a"));
  const once = boggle.solveBoggle(["cac", "caa"], reused);
  assert.equal(once.words.some((w) => w.word === "cac"), false);
  assert.equal(once.words.some((w) => w.word === "caa"), true);
  assert.equal(boggle.solveBoggle(["cat"], ["c"]).error, "board");
});

test("new tools are routed and describe themselves", () => {
  const worker = fs.readFileSync(new URL("../worker.js", import.meta.url), "utf8");
  const preview = fs.readFileSync(new URL("../preview-worker.js", import.meta.url), "utf8");
  for (const file of [worker, preview]) {
    assert.match(file, /\/scrabble-score-calculator": "scrabble-score-calculator.html"/);
    assert.match(file, /\/boggle-solver": "boggle-solver.html"/);
  }
  assert.match(worker, /scrabble-score.js/);
  assert.match(worker, /boggle.js/);
  for (const name of ["scrabble-score-calculator.html", "boggle-solver.html"]) {
    const html = fs.readFileSync(new URL("../" + name, import.meta.url), "utf8");
    assert.match(html, /FAQPage/);
    assert.match(html, /id="how"/);
    assert.match(html, /G-VR1EE3K51N/);
    assert.match(html, /ca-pub-2666058844257008/);
    assert.match(html, /data-theme/);
  }
  const home = fs.readFileSync(new URL("../index.html", import.meta.url), "utf8");
  assert.match(home, /href="\/scrabble-score-calculator"/);
  assert.match(home, /href="\/boggle-solver"/);
});

test("daily archive is stable and today’s share text hides the answer", () => {
  const day = new Date(2026, 9, 7);
  const puzzle = daily.puzzle(day);
  assert.equal(puzzle.key, "2026-10-07");
  assert.equal(puzzle.answer.length, 7);
  assert.equal(puzzle.scramble.split("").sort().join(""), puzzle.answer.split("").sort().join(""));
  assert.equal(daily.puzzle(day).scramble, puzzle.scramble);
  const days = daily.recent(day, 15);
  assert.equal(days.length, 15);
  assert.equal(days[0].key, "2026-10-07");
  assert.equal(days[14].key, "2026-09-23");
  assert.equal(daily.shareLine(puzzle.number, 2, 3).includes(puzzle.answer), false);
  const page = fs.readFileSync(new URL("../daily.html", import.meta.url), "utf8");
  const script = fs.readFileSync(new URL("../daily.js", import.meta.url), "utf8");
  assert.match(page, /id="dailyList"/);
  assert.match(script, /days\.slice\(1\)/);
  assert.match(script, /today\.scramble/);
  const worker = fs.readFileSync(new URL("../worker.js", import.meta.url), "utf8");
  assert.match(worker, /\/daily": "daily.html"/);
  const manifest = JSON.parse(fs.readFileSync(new URL("../manifest.webmanifest", import.meta.url), "utf8"));
  assert.equal(manifest.display, "standalone");
  assert.equal(manifest.name, "Letters Unscrambler");
  assert.ok(manifest.icons.some((icon) => icon.sizes === "192x192" && icon.type === "image/png"));
  assert.ok(manifest.icons.some((icon) => icon.sizes === "512x512"));
  const app = fs.readFileSync(new URL("../app.js", import.meta.url), "utf8");
  assert.match(app, /Try these letters in…/);
  assert.match(app, /scrabble-score-calculator" \+ qLink/);
});

test("helpfulness sends a yes or no and never the letters", () => {
  const js = fs.readFileSync(new URL("../help.js", import.meta.url), "utf8");
  assert.match(js, /typeof gtag === "function"/);
  assert.match(js, /"helpfulness"/);
  assert.match(js, /location\.pathname/);
  assert.equal(js.includes("location.search"), false);
  assert.equal(js.includes("localStorage"), false);
  assert.equal(js.includes("letters"), false);
  const worker = fs.readFileSync(new URL("../worker.js", import.meta.url), "utf8");
  assert.match(worker, /help\.js/);
  for (const name of ["index.html", "word-ladder-solver.html", "guide-how-to-unscramble.html", "how-it-works.html", "boggle-solver.html"]) {
    const html = fs.readFileSync(new URL("../" + name, import.meta.url), "utf8");
    assert.match(html, /src="\/help\.js"/);
  }
});

test("max steps and missing words produce no ladder", () => {
  const words = ["cat", "cot", "cog", "dog"];
  assert.equal(ladder.shortestLadder(words, "cat", "dog", 2).path, null);
  assert.equal(ladder.shortestLadder(words, "cat", "zzz", 0).error, "missing");
  assert.equal(ladder.shortestLadder(words, "cat", "cats", 0).error, "length");
  assert.equal(ladder.shortestLadder(words, "to", "go", 0).error, "range");
});
