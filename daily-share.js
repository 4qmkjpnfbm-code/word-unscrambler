/* Daily scramble stats and spoiler-free share text. Share lines never include the answer. */
(function (g) {
  function pad(n) { return String(n).padStart(2, "0"); }
  function dayKey(d) {
    d = d || new Date();
    return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
  }
  function yesterdayKey(today) {
    const p = today.split("-");
    const d = new Date(Number(p[0]), Number(p[1]) - 1, Number(p[2]));
    d.setDate(d.getDate() - 1);
    return dayKey(d);
  }
  function puzzleNumber(d) {
    d = d || new Date();
    const start = Date.UTC(2026, 0, 1);
    const cur = Date.UTC(d.getFullYear(), d.getMonth(), d.getDate());
    return Math.floor((cur - start) / 86400000) + 1;
  }
  function emptyStats() {
    return { played: 0, streak: 0, best: 0, solved: "", tries: 0, triesDay: "", solvedTries: 0 };
  }
  function recordTry(stats, today) {
    const s = stats || emptyStats();
    if (s.solved === today) return s;
    const tries = s.triesDay === today ? (s.tries || 0) + 1 : 1;
    return {
      played: s.played || 0,
      streak: s.streak || 0,
      best: s.best || 0,
      solved: s.solved || "",
      tries: tries,
      triesDay: today,
      solvedTries: s.solvedTries || 0
    };
  }
  function applySolve(stats, today) {
    const s = stats || emptyStats();
    if (s.solved === today) return s;
    const streak = s.solved === yesterdayKey(today) ? (s.streak || 0) + 1 : 1;
    const tries = s.triesDay === today && s.tries > 0 ? s.tries : 1;
    return {
      played: (s.played || 0) + 1,
      streak: streak,
      best: Math.max(s.best || 0, streak),
      solved: today,
      tries: tries,
      triesDay: today,
      solvedTries: tries
    };
  }
  function shareLine(n, tries, streak) {
    const t = tries === 1 ? "1 try" : tries + " tries";
    return "Letters Unscrambler Daily #" + n + " ✅ in " + t + " 🔥 " + streak + "-day streak lettersunscrambler.com";
  }
  const DAILY_WORDS = "LETTERS PUZZLES ENGLISH PLAYING READING WRITING NATURAL STRANGE RESULTS MACHINE ALREADY PROBLEM SERVICE PICTURE BETWEEN WITHOUT GREATER ANOTHER BECAUSE THROUGH JUMBLED RACKETS FINDERS SOLVING WORDING".split(" ");
  function mulberry(a) {
    return function () {
      let t = (a += 0x6d2b79f5);
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function scramble(word, seed) {
    const rnd = mulberry(seed);
    const arr = word.split("");
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(rnd() * (i + 1));
      const tmp = arr[i];
      arr[i] = arr[j];
      arr[j] = tmp;
    }
    const out = arr.join("");
    return out === word ? word.slice(1) + word.charAt(0) : out;
  }
  function puzzle(date) {
    const key = dayKey(date);
    const seed = Number(key.replace(/-/g, "")) || 1;
    const answer = DAILY_WORDS[Math.floor(mulberry(seed)() * DAILY_WORDS.length)];
    return {
      key: key,
      number: puzzleNumber(date || new Date()),
      answer: answer,
      scramble: scramble(answer, seed + 17)
    };
  }
  function recent(date, count) {
    const start = date || new Date();
    const n = count > 0 ? count : 15;
    const days = [];
    for (let i = 0; i < n; i++) {
      days.push(puzzle(new Date(start.getFullYear(), start.getMonth(), start.getDate() - i)));
    }
    return days;
  }
  function countdown(now) {
    const next = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    let sec = Math.max(0, Math.floor((next - now) / 1000));
    const h = Math.floor(sec / 3600);
    sec -= h * 3600;
    const m = Math.floor(sec / 60);
    sec -= m * 60;
    return "Next puzzle in " + pad(h) + "h " + pad(m) + "m " + pad(sec) + "s";
  }
  g.DailyShare = {
    dayKey: dayKey,
    puzzleNumber: puzzleNumber,
    emptyStats: emptyStats,
    recordTry: recordTry,
    applySolve: applySolve,
    shareLine: shareLine,
    countdown: countdown,
    puzzle: puzzle,
    recent: recent
  };
})(typeof globalThis !== "undefined" ? globalThis : this);
