/* Daily scramble stats and spoiler-free share text. No puzzle answer is accepted or returned. */
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
    countdown: countdown
  };
})(typeof globalThis !== "undefined" ? globalThis : this);
