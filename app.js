(() => {
  const SCRABBLE = { a:1,b:3,c:3,d:2,e:1,f:4,g:2,h:4,i:1,j:8,k:5,l:1,m:3,n:1,o:1,p:3,q:10,r:1,s:1,t:1,u:1,v:4,w:4,x:8,y:4,z:10 };
  const WWF = { a:1,b:4,c:4,d:2,e:1,f:4,g:3,h:3,i:1,j:10,k:5,l:2,m:4,n:2,o:1,p:4,q:10,r:1,s:1,t:1,u:2,v:5,w:4,x:8,y:3,z:10 };

  const byLen = {};
  const bySig = {};
  let ready = false;
  let wordCount = 0;
  let timer = 0;
  let scoring = "scrabble";
  let mode = document.body.dataset.tool || "subset";
  let sortBy = "score";
  const COACH = {
    subset: "Type the letters on your rack. Every word you can make appears below — including shorter ones.",
    anagram: "Type all the letters. Only words that use every letter are shown.",
    wordle: "Green boxes = right letter, right place. Letters box = yellows. Exclude = greys.",
    pattern: "Type the crossword pattern. Use ? for a blank square, like C?O??."
  };

  const $ = (id) => document.getElementById(id);
  const lettersEl = $("letters");
  if (!lettersEl) return;

  function scoreWord(word) {
    const table = scoring === "wwf" ? WWF : SCRABBLE;
    let s = 0;
    for (const c of word) s += table[c] || 0;
    return s;
  }

  function countsOf(str) {
    const count = {};
    let wild = 0;
    for (const ch of str.toLowerCase()) {
      if (ch === "?" || ch === "*" || ch === ".") wild++;
      else if (ch >= "a" && ch <= "z") count[ch] = (count[ch] || 0) + 1;
    }
    return { count, wild };
  }

  function canForm(word, avail) {
    const need = {};
    for (const c of word) need[c] = (need[c] || 0) + 1;
    let wild = avail.wild;
    for (const letter in need) {
      const n = need[letter];
      const have = avail.count[letter] || 0;
      if (have >= n) continue;
      const deficit = n - have;
      if (wild >= deficit) wild -= deficit;
      else return false;
    }
    return true;
  }

  function sig(word) {
    return [...word].sort().join("");
  }

  function el(tag, cls, text) {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  function renderTiles(raw) {
    const box = $("tiles");
    if (!box) return;
    box.replaceChildren();
    const chars = raw.toUpperCase().replace(/[^A-Z?*]/g, "");
    const table = scoring === "wwf" ? WWF : SCRABBLE;
    for (const ch of chars.slice(0, 16)) {
      const wild = ch === "?" || ch === "*";
      const t = el("span", wild ? "tile wild" : "tile", wild ? "?" : ch);
      if (!wild) {
        const v = el("span", "val", String(table[ch.toLowerCase()] || 0));
        t.appendChild(v);
      }
      box.appendChild(t);
    }
  }

  function wordlePattern() {
    const slots = document.querySelectorAll("[data-slot]");
    if (!slots.length) return "";
    let p = "";
    slots.forEach((s) => {
      const v = s.value.toLowerCase().replace(/[^a-z]/g, "");
      p += v ? v[0] : "_";
    });
    return p;
  }

  function matchesPattern(word, pattern) {
    if (!pattern) return true;
    if (word.length !== pattern.length) return false;
    for (let i = 0; i < pattern.length; i++) {
      if (pattern[i] !== "_" && pattern[i] !== "?" && pattern[i] !== "." && pattern[i] !== word[i]) return false;
    }
    return true;
  }

  function collect() {
    const input = lettersEl.value.trim();
    const box = $("results");
    const meta = $("resultMeta");
    const copy = $("copy");
    box.replaceChildren();
    renderTiles(input);

    if (!input && mode !== "wordle") {
      box.className = "empty";
      box.textContent = ready ? "Your words will show here." : "Loading the dictionary…";
      meta.textContent = "";
      if (copy) copy.hidden = true;
      const heading = $("resultsHeading");
      if (heading) heading.childNodes[0].textContent = "Words ";
      syncShare("");
      return [];
    }
    if (!ready) {
      box.className = "empty";
      box.textContent = "Dictionary still loading. Try again in a moment.";
      return [];
    }

    const wilds = (input.match(/[?*]/g) || []).length;
    if (wilds > 2) {
      box.className = "empty";
      box.textContent = "Use at most two blank tiles (?). More than that explodes the search.";
      meta.textContent = "";
      if (copy) copy.hidden = true;
      return [];
    }

    const avail = countsOf(input);
    const starts = ($("starts")?.value || "").toLowerCase().trim();
    const ends = ($("ends")?.value || "").toLowerCase().trim();
    const contains = ($("contains")?.value || "").toLowerCase().trim();
    const exclude = ($("exclude")?.value || "").toLowerCase().replace(/[^a-z]/g, "");
    const chip = document.querySelector(".len[aria-pressed='true']");
    const lenKey = chip ? chip.dataset.len : "";
    const exact = lenKey && lenKey !== "9+" ? parseInt(lenKey, 10) : ($("length")?.value ? parseInt($("length").value, 10) : null);
    const minNine = lenKey === "9+";
    const pattern = mode === "wordle" ? wordlePattern() : mode === "pattern" ? input.toLowerCase().replace(/[^a-z?.*]/g, "") : "";
    const maxLen = input ? input.replace(/[^a-zA-Z?*]/g, "").length : 15;
    const minLen = 2;
    const matches = [];

    if (mode === "pattern") {
      const raw = input.toLowerCase().replace(/[^a-z?.*]/g, "");
      const len = raw.length;
      const list = byLen[len] || [];
      const pat = raw.replace(/[?.*]/g, "_");
      for (const word of list) {
        if (!matchesPattern(word, pat)) continue;
        if (starts && !word.startsWith(starts)) continue;
        if (ends && !word.endsWith(ends)) continue;
        if (contains && !word.includes(contains)) continue;
        if (exclude && [...exclude].some((c) => word.includes(c))) continue;
          matches.push({ word, len: word.length, score: scoreWord(word) });
      }
    } else if (mode === "anagram" && !avail.wild) {
      const key = sig(input.toLowerCase().replace(/[^a-z]/g, ""));
      const list = bySig[key] || [];
      for (const word of list) {
        if (starts && !word.startsWith(starts)) continue;
        if (ends && !word.endsWith(ends)) continue;
        if (contains && !word.includes(contains)) continue;
        if (exclude && [...exclude].some((c) => word.includes(c))) continue;
        matches.push({ word, len: word.length, score: scoreWord(word) });
      }
    } else {
      const from = exact || (minNine ? 9 : minLen);
      const to = exact || (mode === "wordle" ? 5 : maxLen);
      const lo = mode === "wordle" ? 5 : from;
      const hi = mode === "wordle" ? 5 : Math.min(to, 15);
      const green = mode === "wordle" ? wordlePattern() : "";
      for (let len = hi; len >= lo; len--) {
        if (mode === "anagram" && len !== maxLen) continue;
        const list = byLen[len] || [];
        for (const word of list) {
          if (word.length !== len) continue;
          if (starts && !word.startsWith(starts)) continue;
          if (ends && !word.endsWith(ends)) continue;
          if (contains && !word.includes(contains)) continue;
          if (exclude && [...exclude].some((c) => word.includes(c))) continue;
          if (pattern && mode === "wordle" && !matchesPattern(word, pattern)) continue;
          if (mode === "wordle") {
            if (input) {
              const need = countsOf(input);
              let ok = true;
              for (const [ch, n] of Object.entries(need.count)) {
                const have = word.split(ch).length - 1;
                if (have < n) {
                  ok = false;
                  break;
                }
              }
              if (!ok) continue;
              // Yellows must not sit on a known-green slot they don't match
              if (green) {
                let blocked = false;
                for (let i = 0; i < 5; i++) {
                  if (green[i] === "_" && need.count[word[i]] && word[i] !== green[i]) {
                    // yellow letter in this position is allowed unless we know it isn't here;
                    // we don't have per-slot yellows, so skip
                  }
                }
                if (blocked) continue;
              }
            }
          } else if (!canForm(word, avail)) continue;
            matches.push({ word, len: word.length, score: scoreWord(word) });
        }
      }
    }

    if (!matches.length) {
      box.className = "empty";
      box.textContent = "No words match yet. Try All words, add a ? blank, or clear More options.";
      meta.textContent = "";
      if (copy) copy.hidden = true;
      return [];
    }

    box.className = "";
    const grouped = {};
    for (const m of matches) (grouped[m.len] ||= []).push(m);
    const frag = document.createDocumentFragment();
    const lens = Object.keys(grouped).map(Number).sort((a, b) => b - a);
    lens.forEach((len) => {
      const group = el("div", "group");
      const title = el("div", "group-title");
      const words = grouped[len];
      if (sortBy === "alpha") words.sort((a, b) => a.word.localeCompare(b.word));
      else words.sort((a, b) => b.score - a.score || a.word.localeCompare(b.word));
      title.appendChild(el("span", "", len + "-letter words"));
      title.appendChild(el("span", "", words.length.toLocaleString("en-GB")));
      const grid = el("div", "grid");
      words.forEach((m) => {
        const card = el("button", m.len >= 7 && m.len === maxLen ? "word bingo" : "word", null);
        card.type = "button";
        card.appendChild(el("b", "", m.word));
        card.appendChild(el("span", "pts", m.score + " pts"));
        card.title = "Click to copy " + m.word;
        card.addEventListener("click", async () => {
          try {
            await navigator.clipboard.writeText(m.word);
            card.querySelector(".pts").textContent = "copied";
            setTimeout(() => { card.querySelector(".pts").textContent = m.score + " pts"; }, 900);
          } catch {}
        });
        grid.appendChild(card);
      });
      group.appendChild(title);
      group.appendChild(grid);
      frag.appendChild(group);
    });
    box.appendChild(frag);
    const bingoNote = mode !== "wordle" && matches.some((m) => m.len >= 7 && m.len === maxLen);
    const heading = $("resultsHeading");
    if (heading) heading.childNodes[0].textContent = matches.length.toLocaleString("en-GB") + " words ";
    meta.textContent =
      bingoNote ? "· bingos marked" : "";
    const all = matches.map((m) => m.word).join(", ");
    if (copy) {
      copy.hidden = false;
      copy.dataset.words = all;
    }
    syncShare(lettersEl.value.trim());
    saveRecent(lettersEl.value);
    maybeSolveDaily(matches);
    if ($("share")) $("share").hidden = false;
    return matches;
  }

  function schedule() {
    clearTimeout(timer);
    timer = setTimeout(collect, 90);
  }

  function syncShare(q) {
    try {
      const u = new URL(location.href);
      const cur = u.searchParams.get("q") || "";
      if (q === cur) return;
      if (q) u.searchParams.set("q", q);
      else u.searchParams.delete("q");
      history.replaceState(null, "", u.pathname + u.search + u.hash);
    } catch {}
  }

  const EXTRA = "ch da di ea ee fe fy gi gu io ja ki ko ky ny ob oi ok oo ou po qi st te ug ur yu za qis zas".split(" ");
  async function ingest(text) {
    const words = text.split(/\s+/).filter((w) => {
      const n = w.length;
      return n >= 2 && n <= 15 && /^[a-z]+$/.test(w);
    });
    for (const w of EXTRA) if (!words.includes(w)) words.push(w);
    for (const w of words) {
      (byLen[w.length] ||= []).push(w);
      (bySig[sig(w)] ||= []).push(w);
    }
    wordCount = words.length;
    ready = true;
    const countEl = $("dictCount");
    if (countEl) countEl.textContent = wordCount.toLocaleString("en-GB");
    collect();
  }

  async function loadDict() {
    const sources = ["/words.txt", "https://raw.githubusercontent.com/dolph/dictionary/master/enable1.txt"];
    for (const src of sources) {
      try {
        const res = await fetch(src, { cache: "force-cache" });
        if (!res.ok) continue;
        const text = await res.text();
        if (text.length < 10000) continue;
        await ingest(text.toLowerCase());
        return;
      } catch {}
    }
    const countEl = $("dictCount");
    if (countEl) countEl.textContent = "unavailable";
    $("results").textContent = "Could not load the dictionary. Refresh the page.";
  }

  function setMode(next) {
    if (!next) return;
    mode = next;
    document.querySelectorAll("[data-mode]").forEach((btn) => {
      btn.setAttribute("aria-pressed", btn.dataset.mode === mode ? "true" : "false");
    });
    const wordle = $("wordleFields");
    if (wordle) wordle.hidden = mode !== "wordle";
    if (mode === "wordle" && $("length") && !$("length").value) $("length").value = "5";
    const coach = $("coach");
    if (coach && COACH[mode]) coach.textContent = COACH[mode];
    collect();
  }

  function copyWords(btn) {
    const words = btn.dataset.words || "";
    navigator.clipboard.writeText(words).then(() => {
      const prev = btn.textContent;
      btn.textContent = "Copied";
      setTimeout(() => { btn.textContent = prev; }, 1400);
    }).catch(() => {});
  }

  $("go")?.addEventListener("click", collect);
  lettersEl.addEventListener("input", schedule);
  lettersEl.addEventListener("keydown", (e) => { if (e.key === "Enter") collect(); });
  ["starts", "ends", "contains", "length", "exclude"].forEach((id) => {
    $(id)?.addEventListener("input", () => { if (lettersEl.value.trim() || mode === "wordle") schedule(); });
  });
  document.querySelectorAll("[data-slot]").forEach((s) => {
    s.addEventListener("input", (e) => {
      e.target.value = e.target.value.toUpperCase().replace(/[^A-Z]/g, "").slice(0, 1);
      e.target.classList.toggle("filled", Boolean(e.target.value));
      const next = e.target.nextElementSibling;
      if (e.target.value && next && next.matches("[data-slot]")) next.focus();
      schedule();
    });
    s.addEventListener("keydown", (e) => {
      if (e.key === "Backspace" && !e.target.value) {
        const prev = e.target.previousElementSibling;
        if (prev && prev.matches("[data-slot]")) prev.focus();
      }
    });
  });
  document.querySelectorAll("[data-ex]").forEach((btn) => {
    btn.addEventListener("click", () => {
      lettersEl.value = btn.dataset.ex;
      collect();
      lettersEl.focus();
    });
  });
  document.querySelectorAll("[data-mode]").forEach((btn) => {
    btn.addEventListener("click", () => setMode(btn.dataset.mode));
  });
  document.querySelectorAll("[data-sort]").forEach((btn) => {
    btn.addEventListener("click", () => {
      sortBy = btn.dataset.sort;
      document.querySelectorAll("[data-sort]").forEach((b) => b.setAttribute("aria-pressed", b === btn ? "true" : "false"));
      collect();
    });
  });
  document.querySelectorAll("[data-score]").forEach((btn) => {
    btn.addEventListener("click", () => {
      scoring = btn.dataset.score;
      document.querySelectorAll("[data-score]").forEach((b) => b.setAttribute("aria-pressed", b === btn ? "true" : "false"));
      collect();
    });
  });
  document.querySelectorAll(".len").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".len").forEach((b) => b.setAttribute("aria-pressed", b === btn ? "true" : "false"));
      const lenEl = $("length");
      if (lenEl) lenEl.value = btn.dataset.len === "9+" ? "" : (btn.dataset.len || "");
      collect();
    });
  });
  $("copy")?.addEventListener("click", () => copyWords($("copy")));

  function toast(msg) {
    let n = document.getElementById("toast");
    if (!n) {
      n = document.createElement("div");
      n.id = "toast";
      n.className = "toast";
      n.setAttribute("role", "status");
      document.body.appendChild(n);
    }
    n.textContent = msg;
    n.classList.remove("show");
    void n.offsetWidth;
    n.classList.add("show");
    clearTimeout(n._t);
    n._t = setTimeout(() => n.classList.remove("show"), 1600);
  }

  const prevCopy = copyWords;
  copyWords = function (btn) {
    prevCopy(btn);
    toast("Copied");
  };

  document.getElementById("themeBtn")?.addEventListener("click", () => {
    const next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try { localStorage.setItem("wu_theme", next); } catch {}
  });

  $("share")?.addEventListener("click", async () => {
    const q = lettersEl.value.trim().toUpperCase();
    const data = { title: q ? "Words from " + q : "Word Unscrambler", url: location.href };
    try {
      if (navigator.share) await navigator.share(data);
      else {
        await navigator.clipboard.writeText(location.href);
        toast("Link copied");
      }
    } catch {}
  });

  function renderRecents() {
    const box = $("recents");
    if (!box) return;
    let r = [];
    try { r = JSON.parse(localStorage.getItem("wu_recent") || "[]"); } catch {}
    box.replaceChildren();
    if (!r.length) {
      box.textContent = "Racks you type are saved on this device.";
      return;
    }
    r.forEach((q) => {
      const b = el("button", "chip", q);
      b.type = "button";
      b.addEventListener("click", () => { lettersEl.value = q; collect(); lettersEl.focus(); });
      box.appendChild(b);
    });
  }
  function saveRecent(q) {
    const v = (q || "").toUpperCase().replace(/[^A-Z?]/g, "");
    if (v.length < 3) return;
    let r = [];
    try { r = JSON.parse(localStorage.getItem("wu_recent") || "[]"); } catch {}
    r = [v, ...r.filter((x) => x !== v)].slice(0, 8);
    try { localStorage.setItem("wu_recent", JSON.stringify(r)); } catch {}
    renderRecents();
  }

  const DAILY_WORDS = "LETTERS PUZZLES ENGLISH PLAYING READING WRITING NATURAL PRESENT STRANGE RESULTS MACHINE ALREADY PROBLEM SERVICE PICTURE BETWEEN WITHOUT GREATER ANOTHER BECAUSE THROUGH JUMBLED RACKETS FINDERS SOLVING WORDING".split(" ");
  function dayKey() {
    return new Date().toISOString().slice(0, 10);
  }
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
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    const out = arr.join("");
    return out === word ? word.slice(1) + word[0] : out;
  }
  function dailySeed() {
    return Number(dayKey().replace(/-/g, "")) || 1;
  }
  const dailyAnswer = DAILY_WORDS[Math.floor(mulberry(dailySeed())() * DAILY_WORDS.length)];
  const dailyScramble = scramble(dailyAnswer, dailySeed() + 17);

  function dailyInit() {
    const scrambleEl = $("dailyScramble");
    if (!scrambleEl) return;
    scrambleEl.textContent = dailyScramble;
    const key = dayKey();
    let last = "";
    let streak = 0;
    try {
      last = localStorage.getItem("wu_daily_last") || "";
      streak = parseInt(localStorage.getItem("wu_daily_streak") || "0", 10) || 0;
    } catch {}
    const solved = last === key;
    const meta = $("dailyMeta");
    if (meta) meta.textContent = solved ? "Solved · streak " + streak : "New seven-letter jumble · streak " + streak;
    if (solved) $("daily")?.classList.add("is-solved");
    $("dailyPlay")?.addEventListener("click", () => {
      setMode("anagram");
      lettersEl.value = dailyScramble;
      collect();
      lettersEl.focus();
    });
  }
  function maybeSolveDaily(matches) {
    if (!matches || !matches.some((m) => m.word === dailyAnswer.toLowerCase())) return;
    const key = dayKey();
    let last = "";
    let streak = 0;
    try {
      last = localStorage.getItem("wu_daily_last") || "";
      streak = parseInt(localStorage.getItem("wu_daily_streak") || "0", 10) || 0;
    } catch {}
    if (last === key) return;
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    streak = last === yesterday ? streak + 1 : 1;
    try {
      localStorage.setItem("wu_daily_last", key);
      localStorage.setItem("wu_daily_streak", String(streak));
    } catch {}
    $("daily")?.classList.add("is-solved");
    const meta = $("dailyMeta");
    if (meta) meta.textContent = "Solved · streak " + streak;
    toast("Daily solved · streak " + streak);
  }

  dailyInit();
  renderRecents();

  const params = new URLSearchParams(location.search);
  if (params.get("q")) lettersEl.value = params.get("q");
  if (params.get("mode")) mode = params.get("mode");
  setMode(mode);
  if (!params.get("q")) lettersEl.focus();
  loadDict();
})();
