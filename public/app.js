(() => {
  const SCRABBLE = { a:1,b:3,c:3,d:2,e:1,f:4,g:2,h:4,i:1,j:8,k:5,l:1,m:3,n:1,o:1,p:3,q:10,r:1,s:1,t:1,u:1,v:4,w:4,x:8,y:4,z:10 };
  const WWF = { a:1,b:4,c:4,d:2,e:1,f:4,g:3,h:3,i:1,j:10,k:5,l:2,m:4,n:2,o:1,p:4,q:10,r:1,s:1,t:1,u:2,v:5,w:4,x:8,y:3,z:10 };

  const byLen = {};
  const bySig = {};
  const wordSet = new Set();
  let ready = false;
  let wordCount = 0;
  let timer = 0;
  let scoring = document.body.dataset.score === "wwf" ? "wwf" : "scrabble";
  let mode = document.body.dataset.tool || "subset";
  let sortBy = "score";
  const COACH = {
    subset: "Type the letters on your rack. Every word you can make appears below — including shorter ones.",
    anagram: "Type all the letters. Only words that use every letter are shown.",
    wordle: "Green boxes = right letter, right place. Letters box = yellows. Exclude = greys.",
    check: "Type a word. ENABLE is checked in this browser — nothing is sent to a server.",
    bee: "Type the 7 hive letters. Set the center letter. Words of 4+ letters, using only the hive, must include the center.",
    multi: "Type several scrambled words separated by spaces. Each is unjumbled on its own.",
    scramble: "Type a real word to shuffle a puzzle, or paste a scramble to solve it. Reshuffle until it looks hard.",
    gen: "Type the letters you are allowed to use. Letters may be reused. Unlike a rack, you are not limited to one copy of each tile.",
    boxed: "Type 12 letters clockwise from the top side (3+3+3+3). Consecutive letters cannot share a side. Words are 3+ letters."
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
    const orbit = $("orbit");
    if (orbit) orbit.classList.toggle("is-hidden", chars.length > 0);
    for (let i = 0; i < chars.slice(0, 16).length; i++) {
      const ch = chars[i];
      const wild = ch === "?" || ch === "*";
      const t = el("span", wild ? "tile wild" : "tile", wild ? "?" : ch);
      t.style.setProperty("--i", String(i));
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

  function boxedSides(input) {
    const fromFields = [0, 1, 2, 3].map((i) => (($("side" + i)?.value || "") + "").toLowerCase().replace(/[^a-z]/g, "").slice(0, 3));
    if (fromFields.every((s) => s.length === 3)) return fromFields;
    const raw = (input || "").toLowerCase().replace(/[^a-z]/g, "");
    if (raw.length !== 12) return null;
    return [raw.slice(0, 3), raw.slice(3, 6), raw.slice(6, 9), raw.slice(9, 12)];
  }

  function boxedSideOf(ch, sides) {
    for (let i = 0; i < 4; i++) if (sides[i].indexOf(ch) !== -1) return i;
    return -1;
  }

  function boxedOk(word, sides) {
    if (word.length < 3) return false;
    let prev = -1;
    for (let i = 0; i < word.length; i++) {
      const s = boxedSideOf(word[i], sides);
      if (s < 0 || s === prev) return false;
      prev = s;
    }
    return true;
  }

  function boxedChain(words, sides) {
    const need = new Set(sides.join(""));
    if (!words.length) return [];
    const byStart = {};
    for (let i = 0; i < words.length; i++) {
      const w = words[i];
      const k = w[0];
      (byStart[k] || (byStart[k] = [])).push(w);
    }
    const scored = words.slice().sort((a, b) => {
      const ua = new Set(a).size, ub = new Set(b).size;
      return ub - ua || b.length - a.length;
    });
    const chain = [scored[0]];
    const used = new Set(scored[0]);
    for (let guard = 0; guard < 8; guard++) {
      let missing = 0;
      need.forEach((c) => { if (!used.has(c)) missing++; });
      if (!missing) break;
      const last = chain[chain.length - 1];
      const nexts = byStart[last[last.length - 1]] || [];
      let best = null, bestN = -1;
      for (let i = 0; i < nexts.length; i++) {
        const w = nexts[i];
        if (chain.indexOf(w) !== -1) continue;
        let n = 0;
        for (let j = 0; j < w.length; j++) if (need.has(w[j]) && !used.has(w[j])) n++;
        if (n > bestN) { bestN = n; best = w; }
      }
      if (!best || bestN <= 0) break;
      chain.push(best);
      for (let j = 0; j < best.length; j++) used.add(best[j]);
    }
    return chain;
  }


  function filterValues() {
    return {
      starts: ($("starts")?.value || "").toLowerCase().replace(/[^a-z]/g, ""),
      ends: ($("ends")?.value || "").toLowerCase().replace(/[^a-z]/g, ""),
      contains: ($("contains")?.value || "").toLowerCase().replace(/[^a-z]/g, ""),
      exclude: (($("exclude")?.value || "") + ($("greys")?.value || "")).toLowerCase().replace(/[^a-z]/g, "")
    };
  }

  function hasFilters(f) {
    return Boolean(f.starts || f.ends || f.contains || f.exclude);
  }

  function hasQuery() {
    return Boolean(lettersEl.value.trim() || mode === "wordle" || mode === "check" || hasFilters(filterValues()));
  }

  function matchesContains(word, contains) {
    if (!contains) return true;
    if (document.body.dataset.hub === "contains") return word.includes(contains);
    return [...contains].every((c) => word.includes(c));
  }

  function filterLabel(f) {
    const bits = [];
    if (f.starts) bits.push("starting with " + f.starts.toUpperCase());
    if (f.ends) bits.push("ending with " + f.ends.toUpperCase());
    if (f.contains) bits.push("containing " + f.contains.toUpperCase());
    return bits.join(", ");
  }

  function renderCheck(raw) {
    const box = $("results");
    const meta = $("resultMeta");
    const copy = $("copy");
    hideDefine();
    hideNextPlay();
    hideBest();
    hideJumps();
    if ($("share")) $("share").hidden = true;
    if (copy) copy.hidden = true;
    if (!box) return [];
    box.replaceChildren();
    const w = (raw || "").toLowerCase().replace(/[^a-z]/g, "");
    if (!w) {
      box.className = "empty";
      const p = el("p", "", ready ? "Type a word. ENABLE is checked in this browser — nothing is sent away." : "Loading 168,000 words…");
      box.appendChild(p);
      if (ready) {
        const row = el("div", "examples");
        ["QI", "QAT", "LISTEN", "XYZZY"].forEach((ex) => {
          const b = el("button", "chip", ex);
          b.type = "button";
          b.addEventListener("click", () => { lettersEl.value = ex; collect(); lettersEl.focus(); });
          row.appendChild(b);
        });
        box.appendChild(row);
      }
      setResultsHeading("Word checker ");
      if (meta) meta.textContent = "";
      syncShare("");
      return [];
    }
    if (!ready) {
      box.className = "empty";
      box.textContent = "Dictionary still loading. Try again in a moment.";
      return [];
    }
    const valid = wordSet.has(w);
    box.className = "";
    const card = el("aside", valid ? "check-verdict is-yes" : "check-verdict is-no");
    card.appendChild(el("p", "try-label", "ENABLE dictionary"));
    card.appendChild(el("p", "check-word", w));
    if (valid) {
      card.appendChild(el("p", "best-meta", "Valid word · " + scoreWord(w) + " pts · " + w.length + " letters"));
      const def = el("p", "best-def");
      card.appendChild(def);
      lookup(w).then((text) => { if (def.isConnected) def.textContent = text; });
    } else {
      card.appendChild(el("p", "best-meta", "Not in ENABLE. Not a valid word on this site."));
    }
    const play = el("a", "chip", valid ? "Unscramble " + w.toUpperCase() : "Unscramble these letters instead");
    play.href = "/?q=" + encodeURIComponent(w.toUpperCase());
    card.appendChild(play);
    box.appendChild(card);
    setResultsHeading(valid ? w.toUpperCase() + " is a word " : w.toUpperCase() + " is not a word ");
    if (meta) meta.textContent = valid ? "· " + scoreWord(w) + " pts" : "";
    syncShare(lettersEl.value.trim());
    syncTitle(lettersEl.value.trim());
    if ($("share")) $("share").hidden = false;
    if (!valid) {
      renderNextPlay(w);
      return [];
    }
    const family = (bySig[sig(w)] || []).filter((x) => x !== w);
    const { front, back } = hooksOf(w);
    const extra = [];
    family.forEach((word) => extra.push({ word, len: word.length, score: scoreWord(word), tag: "anagram" }));
    front.concat(back).forEach((word) => extra.push({ word, len: word.length, score: scoreWord(word), tag: "hook" }));
    if (extra.length) {
      const group = el("div", "group");
      const title = el("div", "group-title");
      title.appendChild(el("span", "", "Anagrams and hooks"));
      title.appendChild(el("span", "", String(extra.length)));
      const grid = el("div", "grid");
      extra.forEach((m) => {
        const btn = el("button", "word", null);
        btn.type = "button";
        btn.dataset.word = m.word;
        btn.appendChild(el("b", "", m.word));
        btn.appendChild(el("span", "pts", m.tag + " · " + m.score + " pts"));
        btn.addEventListener("click", () => pickWord(m, btn, w.length));
        grid.appendChild(btn);
      });
      group.appendChild(title);
      group.appendChild(grid);
      box.appendChild(group);
    }
    renderNextPlay(w);
    showDefine({ word: w, score: scoreWord(w), len: w.length }, w.length);
    return [{ word: w, len: w.length, score: scoreWord(w) }];
  }

  let scrambleSrc = "";
  let scrambleOut = "";
  function ensureScramble(word, force) {
    const src = (word || "").toUpperCase();
    if (!force && scrambleSrc === src && scrambleOut) return scrambleOut;
    scrambleSrc = src;
    scrambleOut = scramble(src, (Date.now() % 90000) + src.length + 3);
    if (scrambleOut === src) scrambleOut = src.slice(1) + src[0];
    return scrambleOut;
  }

  function renderScramble(raw) {
    const box = $("results");
    const meta = $("resultMeta");
    const copy = $("copy");
    hideDefine();
    hideJumps();
    if ($("share")) $("share").hidden = true;
    if (!box) return [];
    box.replaceChildren();
    const word = (raw || "").toLowerCase().replace(/[^a-z]/g, "");
    if (!word) {
      box.className = "empty";
      box.appendChild(el("p", "", ready ? "Type a word to scramble into a puzzle, or paste a scramble to list its anagrams." : "Loading 168,000 words…"));
      hideBest();
      hideNextPlay();
      if (copy) copy.hidden = true;
      setResultsHeading("Word scrambler ");
      if (meta) meta.textContent = "";
      syncShare("");
      return [];
    }
    if (!ready) {
      box.className = "empty";
      box.textContent = "Dictionary still loading. Try again in a moment.";
      return [];
    }
    const mixed = ensureScramble(word);
    const list = (bySig[sig(word)] || []).slice().sort((a, b) => scoreWord(b) - scoreWord(a) || a.localeCompare(b));
    const unique = list.length <= 1;
    box.className = "";
    const card = el("aside", "best-play");
    card.appendChild(el("p", "try-label", "Scrambled puzzle"));
    card.appendChild(el("p", "best-word", mixed));
    card.appendChild(el("p", "best-meta", unique
      ? "One ENABLE solution — a fair puzzle."
      : list.length + " ENABLE anagrams — pick a harder shuffle or a rarer word."));
    const row = el("div", "examples");
    const again = el("button", "chip", "Reshuffle");
    again.type = "button";
    again.addEventListener("click", () => { ensureScramble(word, true); collect(); });
    row.appendChild(again);
    const copyMix = el("button", "chip", "Copy scramble");
    copyMix.type = "button";
    copyMix.addEventListener("click", () => {
      navigator.clipboard.writeText(mixed).then(() => toast("Copied " + mixed)).catch(() => {});
    });
    row.appendChild(copyMix);
    card.appendChild(row);
    box.appendChild(card);
    if (list.length) {
      const group = el("div", "group");
      const title = el("div", "group-title");
      title.appendChild(el("span", "", "Anagrams of " + word.toUpperCase()));
      title.appendChild(el("span", "", String(list.length)));
      const grid = el("div", "grid");
      const matches = [];
      list.forEach((w) => {
        const m = { word: w, len: w.length, score: scoreWord(w) };
        matches.push(m);
        const btn = el("button", "word", null);
        btn.type = "button";
        btn.dataset.word = w;
        btn.appendChild(el("b", "", w));
        btn.appendChild(el("span", "pts", m.score + " pts"));
        btn.addEventListener("click", () => pickWord(m, btn, w.length));
        grid.appendChild(btn);
      });
      group.appendChild(title);
      group.appendChild(grid);
      box.appendChild(group);
      if (copy) {
        copy.hidden = false;
        copy.dataset.words = mixed + " → " + list.join(", ");
      }
      renderBest(matches, word, word.length);
    } else {
      box.appendChild(el("p", "mini", "Not an ENABLE word. Shuffle still works for classroom puzzles; there is no listed solution."));
      hideBest();
      if (copy) copy.hidden = true;
    }
    setResultsHeading("Scramble of " + word.toUpperCase() + " ");
    if (meta) meta.textContent = "· " + mixed;
    if ($("share")) $("share").hidden = false;
    syncShare(raw.trim());
    syncTitle(raw.trim());
    renderNextPlay(word);
    renderTiles(mixed);
    return list.map((w) => ({ word: w, len: w.length, score: scoreWord(w) }));
  }

  function renderMulti(raw) {
    const box = $("results");
    const meta = $("resultMeta");
    const copy = $("copy");
    hideDefine();
    hideBest();
    hideJumps();
    if ($("share")) $("share").hidden = true;
    if (!box) return [];
    box.replaceChildren();
    const tokens = (raw || "").toUpperCase().split(/[\s,]+/).map((t) => t.replace(/[^A-Z?]/g, "")).filter((t) => t.length >= 2).slice(0, 8);
    if (!tokens.length) {
      box.className = "empty";
      const p = el("p", "", ready ? "Type two or more scrambled words, separated by spaces. Example: LEMON TRAIN." : "Loading 168,000 words…");
      box.appendChild(p);
      if (copy) copy.hidden = true;
      setResultsHeading("Multiple-word unscrambler ");
      if (meta) meta.textContent = "";
      hideNextPlay();
      syncShare("");
      return [];
    }
    if (!ready) {
      box.className = "empty";
      box.textContent = "Dictionary still loading. Try again in a moment.";
      return [];
    }
    box.className = "";
    const all = [];
    const lines = [];
    tokens.forEach((tok) => {
      const clean = tok.toLowerCase().replace(/[^a-z]/g, "");
      const list = (bySig[sig(clean)] || []).slice().sort((a, b) => scoreWord(b) - scoreWord(a) || a.localeCompare(b));
      const group = el("div", "group");
      const title = el("div", "group-title");
      title.appendChild(el("span", "", tok));
      title.appendChild(el("span", "", list.length ? (list.length + (list.length === 1 ? " anagram" : " anagrams")) : "no exact anagram"));
      const grid = el("div", "grid");
      if (!list.length) {
        grid.appendChild(el("p", "mini", "No ENABLE word uses every letter of " + tok + ". Open it in the word unscrambler for leftovers."));
      }
      list.forEach((w) => {
        const m = { word: w, len: w.length, score: scoreWord(w) };
        all.push(m);
        const btn = el("button", "word", null);
        btn.type = "button";
        btn.dataset.word = w;
        btn.appendChild(el("b", "", w));
        btn.appendChild(el("span", "pts", m.score + " pts"));
        btn.addEventListener("click", () => pickWord(m, btn, w.length));
        grid.appendChild(btn);
      });
      group.appendChild(title);
      group.appendChild(grid);
      box.appendChild(group);
      lines.push(tok + ": " + (list.join(", ") || "(none)"));
    });
    setResultsHeading(tokens.length + " scrambled words ");
    if (meta) meta.textContent = all.length ? "· " + all.length + " answers" : "";
    if (copy) {
      copy.hidden = false;
      copy.dataset.words = lines.join("\n");
    }
    if ($("share")) $("share").hidden = false;
    syncShare(raw.trim());
    syncTitle(tokens.join(" "));
    renderNextPlay(tokens[0] || "");
    renderTiles(tokens.join("").slice(0, 16));
    return all;
  }

  function collect() {
    const input = lettersEl.value.trim();
    const box = $("results");
    const meta = $("resultMeta");
    const copy = $("copy");
    if (!box) return [];
    box.replaceChildren();
    renderTiles(input);

    if (mode === "check") return renderCheck(input);
    if (mode === "multi") return renderMulti(input);
    if (mode === "scramble") return renderScramble(input);

    const f = filterValues();
    const filterOnly = !input && hasFilters(f);

    if (!input && mode !== "wordle" && !filterOnly) {
      box.className = "empty";
      box.replaceChildren();
      const p = el("p", "", ready
        ? (mode === "bee"
          ? "Type the 7 hive letters and a center letter. Words of 4 letters or more appear below."
          : mode === "gen"
            ? "Type the letters you may use. They can be reused. Every ENABLE word that only uses those letters appears below."
            : mode === "boxed"
              ? "Type 12 unique letters, 3 per side, clockwise from the top. Words of 3+ letters must hop sides."
          : "Type a rack, or a start / end / contains filter — no letters required.")
        : "Loading 168,000 words…");
      box.appendChild(p);
      if (ready && !document.body.dataset.hub) {
        const row = el("div", "examples");
        ["LISTEN", "A?PLE", "AEINRST"].forEach((ex) => {
          const b = el("button", "chip", ex);
          b.type = "button";
          b.addEventListener("click", () => { lettersEl.value = ex; collect(); lettersEl.focus(); });
          row.appendChild(b);
        });
        box.appendChild(row);
      }
      if (meta) meta.textContent = "";
      if (copy) copy.hidden = true;
      setResultsHeading("Words from your letters ");
      syncShare("");
      syncTitle("");
      hideDefine();
      hideNextPlay();
      hideBest();
      hideJumps();
      if ($("share")) $("share").hidden = true;
      return [];
    }
    if (!ready) {
      box.className = "empty";
      box.textContent = "Dictionary still loading. Try again in a moment.";
      return [];
    }

    const wilds = (input.match(/[?*]/g) || []).length;
    if (wilds > 2 && mode !== "pattern" && mode !== "bee" && mode !== "scramble" && mode !== "multi" && mode !== "gen" && mode !== "boxed") {
      box.className = "empty";
      box.textContent = "Use at most two blank tiles (?). More than that explodes the search.";
      if (meta) meta.textContent = "";
      if (copy) copy.hidden = true;
      hideDefine();
      hideNextPlay();
      hideBest();
      hideJumps();
      if ($("share")) $("share").hidden = true;
      return [];
    }

    const avail = countsOf(input);
    const starts = f.starts;
    const ends = f.ends;
    const contains = f.contains;
    const exclude = f.exclude;
    const chip = document.querySelector(".len[aria-pressed='true']");
    const lenKey = chip ? chip.dataset.len : "";
    const bodyExact = parseInt(document.body.dataset.exact || "", 10);
    const exact = lenKey && lenKey !== "9+" ? parseInt(lenKey, 10) : ($("length")?.value ? parseInt($("length").value, 10) : (bodyExact || null));
    const minNine = lenKey === "9+";
    const pattern = mode === "wordle" ? wordlePattern() : mode === "pattern" ? input.toLowerCase().replace(/[^a-z?.*_]/g, "").replace(/_/g, "?") : "";
    const maxLen = input ? input.replace(/[^a-zA-Z?*_]/g, "").length : 15;
    const minLen = parseInt(document.body.dataset.minlen || "", 10) || 2;
    const matches = [];

    if (mode === "boxed") {
      const sides = boxedSides(input);
      const letters12 = sides ? sides.join("") : "";
      const unique = new Set(letters12);
      if (!sides || unique.size !== 12) {
        box.className = "empty";
        box.textContent = !sides
          ? "Need 12 letters: 3 on each side, clockwise from the top."
          : "Letter Boxed needs 12 unique letters. Repeated letters cannot sit on the square.";
        if (meta) meta.textContent = "";
        if (copy) copy.hidden = true;
        hideDefine();
        hideNextPlay();
        hideBest();
        hideJumps();
        if ($("share")) $("share").hidden = true;
        return [];
      }
      const from = exact || (minNine ? 9 : 3);
      const to = exact || 15;
      for (let len = Math.min(to, 15); len >= Math.max(from, 3); len--) {
        const list = byLen[len] || [];
        for (const word of list) {
          if (!boxedOk(word, sides)) continue;
          if (starts && !word.startsWith(starts)) continue;
          if (ends && !word.endsWith(ends)) continue;
          if (contains && !matchesContains(word, contains)) continue;
          if (exclude && [...exclude].some((c) => word.includes(c))) continue;
          const cover = new Set(word).size;
          matches.push({ word, len: word.length, score: word.length + cover, cover });
        }
      }
    } else if (mode === "gen") {
      const hive = [...new Set(input.toLowerCase().replace(/[^a-z]/g, "").split(""))];
      if (hive.length < 2) {
        box.className = "empty";
        box.textContent = "Type at least two letters. They can be reused in every word.";
        if (meta) meta.textContent = "";
        if (copy) copy.hidden = true;
        hideDefine();
        hideNextPlay();
        hideBest();
        hideJumps();
        if ($("share")) $("share").hidden = true;
        return [];
      }
      const hiveSet = new Set(hive);
      const from = exact || (minNine ? 9 : Math.max(minLen, 3));
      const to = exact || 15;
      for (let len = Math.min(to, 15); len >= from; len--) {
        const list = byLen[len] || [];
        for (const word of list) {
          if (![...word].every((c) => hiveSet.has(c))) continue;
          if (starts && !word.startsWith(starts)) continue;
          if (ends && !word.endsWith(ends)) continue;
          if (contains && !matchesContains(word, contains)) continue;
          if (exclude && [...exclude].some((c) => word.includes(c))) continue;
          const pangram = hive.every((c) => word.includes(c));
          matches.push({ word, len: word.length, score: scoreWord(word), pangram });
        }
      }
    } else if (mode === "bee") {
      const hive = [...new Set(input.toLowerCase().replace(/[^a-z]/g, "").split(""))];
      const center = (($("center")?.value || hive[0] || "") + "").toLowerCase().replace(/[^a-z]/g, "").slice(0, 1);
      if (hive.length < 4 || hive.length > 7 || !center) {
        box.className = "empty";
        box.textContent = hive.length > 7
          ? "A hive has at most 7 unique letters."
          : "Need 4–7 unique hive letters and a center letter.";
        if (meta) meta.textContent = "";
        if (copy) copy.hidden = true;
        hideDefine();
        hideNextPlay();
        hideBest();
        hideJumps();
        if ($("share")) $("share").hidden = true;
        return [];
      }
      if (!hive.includes(center)) hive.push(center);
      const hiveSet = new Set(hive);
      const from = exact || (minNine ? 9 : 4);
      const to = exact || 15;
      for (let len = Math.min(to, 15); len >= Math.max(from, 4); len--) {
        const list = byLen[len] || [];
        for (const word of list) {
          if (![...word].every((c) => hiveSet.has(c))) continue;
          if (!word.includes(center)) continue;
          if (starts && !word.startsWith(starts)) continue;
          if (ends && !word.endsWith(ends)) continue;
          if (contains && !matchesContains(word, contains)) continue;
          if (exclude && [...exclude].some((c) => word.includes(c))) continue;
          const pangram = hive.every((c) => word.includes(c));
          const beeScore = (word.length === 4 ? 1 : word.length) + (pangram ? 7 : 0);
          matches.push({ word, len: word.length, score: beeScore, pangram });
        }
      }
    } else if (mode === "pattern" && input) {
      const raw = input.toLowerCase().replace(/[^a-z?.*_]/g, "").replace(/_/g, "?");
      const len = raw.length;
      const list = byLen[len] || [];
      const pat = raw.replace(/[?.*]/g, "_");
      for (const word of list) {
        if (!matchesPattern(word, pat)) continue;
        if (starts && !word.startsWith(starts)) continue;
        if (ends && !word.endsWith(ends)) continue;
        if (contains && !matchesContains(word, contains)) continue;
        if (exclude && [...exclude].some((c) => word.includes(c))) continue;
          matches.push({ word, len: word.length, score: scoreWord(word) });
      }
    } else if (mode === "anagram" && input && !avail.wild) {
      const key = sig(input.toLowerCase().replace(/[^a-z]/g, ""));
      const list = bySig[key] || [];
      for (const word of list) {
        if (starts && !word.startsWith(starts)) continue;
        if (ends && !word.endsWith(ends)) continue;
        if (contains && !matchesContains(word, contains)) continue;
        if (exclude && [...exclude].some((c) => word.includes(c))) continue;
        matches.push({ word, len: word.length, score: scoreWord(word) });
      }
    } else {
      const from = exact || (minNine ? 9 : minLen);
      const to = exact || (mode === "wordle" ? 5 : maxLen);
      const lo = mode === "wordle" ? 5 : from;
      const hi = mode === "wordle" ? 5 : Math.min(to, 15);
      for (let len = hi; len >= lo; len--) {
        if (mode === "anagram" && input && len !== maxLen) continue;
        const list = byLen[len] || [];
        for (const word of list) {
          if (word.length !== len) continue;
          if (starts && !word.startsWith(starts)) continue;
          if (ends && !word.endsWith(ends)) continue;
          if (contains && !matchesContains(word, contains)) continue;
          if (exclude && [...exclude].some((c) => word.includes(c))) continue;
          if (mode === "wordle") {
            if (pattern && !matchesPattern(word, pattern)) continue;
            if (input) {
              const need = countsOf(input);
              let ok = true;
              for (const [ch, n] of Object.entries(need.count)) {
                if ((word.split(ch).length - 1) < n) { ok = false; break; }
              }
              if (!ok) continue;
            }
          } else if (input && !canForm(word, avail)) continue;
          matches.push({ word, len: word.length, score: scoreWord(word) });
        }
      }
    }

    if (!matches.length) {
      box.className = "empty";
      box.replaceChildren();
      const p = el("p", "", mode === "anagram"
        ? "No exact anagrams for these letters. Shorter words still exist in All words."
        : mode === "wordle"
          ? "No 5-letter matches. Check greens, or take a letter out of yellows/greys."
          : mode === "bee"
            ? "No ENABLE words of 4+ letters use only that hive and the center letter. Try a different center."
          : mode === "gen"
            ? "No ENABLE words of 3+ letters use only those letters, even with reuse. Add a vowel."
          : mode === "boxed"
            ? "No ENABLE words hop around that square. Check that consecutive letters sit on different sides."
          : filterOnly
            ? "No ENABLE words match that start / end / contains filter. Try a shorter prefix."
            : "No words match yet. Type ? for a blank, or switch mode.");
      box.appendChild(p);
      if (mode === "anagram") {
        const b = el("button", "primary", "Show shorter words");
        b.type = "button";
        b.addEventListener("click", () => setMode("subset"));
        box.appendChild(b);
      }
      if (meta) meta.textContent = "";
      if (copy) copy.hidden = true;
      hideDefine();
      hideNextPlay();
      hideBest();
      hideJumps();
      if ($("share")) $("share").hidden = true;
      return [];
    }

    box.className = "";
    const totalFound = matches.length;
    const MAX_PER_LEN = 60;
    const grouped = {};
    for (const m of matches) (grouped[m.len] ||= []).push(m);
    const lens = Object.keys(grouped).map(Number).sort((a, b) => b - a);
    let truncated = false;
    const frag = document.createDocumentFragment();
    if (mode === "boxed") {
      const sides = boxedSides(input);
      const chain = sides ? boxedChain(matches.map((m) => m.word), sides) : [];
      if (chain.length) {
        const note = el("p", "mini", "Suggested chain: " + chain.join(" → ").toUpperCase());
        frag.appendChild(note);
      }
    }
    lens.forEach((len) => {
      const group = el("div", "group");
      group.id = "len-" + len;
      const title = el("div", "group-title");
      const words = grouped[len];
      if (sortBy === "alpha") words.sort((a, b) => a.word.localeCompare(b.word));
      else words.sort((a, b) => b.score - a.score || a.word.localeCompare(b.word));
      const shown = words.length > MAX_PER_LEN ? words.slice(0, MAX_PER_LEN) : words;
      if (shown.length < words.length) truncated = true;
      title.appendChild(el("span", "", len + "-letter words"));
      title.appendChild(el("span", "", words.length.toLocaleString("en-GB") + (shown.length < words.length ? " · showing " + shown.length : "")));
      const grid = el("div", "grid");
      shown.forEach((m) => {
        const card = el("button", (m.pangram || (mode !== "bee" && mode !== "gen" && mode !== "boxed" && m.len >= 7 && m.len === maxLen)) ? "word bingo" : "word", null);
        card.type = "button";
        if (typeof dailyAnswer === "string" && m.word === dailyAnswer.toLowerCase()) card.classList.add("daily-hit");
        card.dataset.word = m.word;
        card.appendChild(el("b", "", m.word));
        card.appendChild(el("span", "pts", (m.pangram ? "pangram · " : "") + m.score + " pts"));
        card.title = "Tap to copy, leftover tiles, and meaning — " + m.word;
        card.addEventListener("click", () => pickWord(m, card, maxLen));
        grid.appendChild(card);
      });
      group.appendChild(title);
      group.appendChild(grid);
      frag.appendChild(group);
    });
    box.appendChild(frag);
    lastRack = input;
    lastMatches = matches;
    const bingoNote = mode === "bee" || mode === "gen"
      ? matches.some((m) => m.pangram)
      : (mode !== "wordle" && input && matches.some((m) => m.len >= 7 && m.len === maxLen));
    const label = mode === "bee" ? "from this hive"
      : mode === "gen" ? "using these letters (reuse allowed)"
      : mode === "boxed" ? "that hop this square"
      : (filterOnly ? filterLabel(f) : "from your letters");
    setResultsHeading(totalFound.toLocaleString("en-GB") + " words " + label + " ");
    if (meta) meta.textContent = truncated ? "· add a letter or pick a length to see the rest" : (bingoNote ? ((mode === "bee" || mode === "gen") ? "· pangrams marked" : "· bingos marked") : "");
    const all = matches.map((m) => m.word).join(", ");
    if (copy) {
      copy.hidden = false;
      copy.dataset.words = all;
    }
    setCoach(matches, input);
    renderBest(matches, input, maxLen);
    renderJumps(lens);
    syncShare(lettersEl.value.trim());
    syncTitle(lettersEl.value.trim());
    saveRecent(lettersEl.value);
    maybeSolveDaily(matches);
    if ($("share")) $("share").hidden = false;
    renderNextPlay(lettersEl.value.trim(), matches);
    return matches;
  }

  function setResultsHeading(text) {
    const heading = $("resultsHeading");
    if (!heading) return;
    let node = heading.firstChild;
    if (!node || node.nodeType !== 3) {
      node = document.createTextNode(text);
      heading.insertBefore(node, heading.firstChild);
      return;
    }
    node.textContent = text;
  }

  function schedule() {
    clearTimeout(timer);
    timer = setTimeout(collect, 90);
  }

  function syncShare(q) {
    try {
      const u = new URL(location.href);
      if (q) u.searchParams.set("q", q);
      else u.searchParams.delete("q");
      const defaultMode = document.body.dataset.tool || "subset";
      if (mode && mode !== defaultMode) u.searchParams.set("mode", mode);
      else u.searchParams.delete("mode");
      const f = filterValues();
      if (f.starts) u.searchParams.set("starts", f.starts.toUpperCase());
      else u.searchParams.delete("starts");
      if (f.ends) u.searchParams.set("ends", f.ends.toUpperCase());
      else u.searchParams.delete("ends");
      if (f.contains) u.searchParams.set("contains", f.contains.toUpperCase());
      else u.searchParams.delete("contains");
      const center = ($("center")?.value || "").toUpperCase().replace(/[^A-Z]/g, "").slice(0, 1);
      if (mode === "bee" && center) u.searchParams.set("center", center);
      else u.searchParams.delete("center");
      history.replaceState(null, "", u.pathname + u.search + u.hash);
    } catch {}
  }

  const BASE_TITLE = document.title;
  function syncTitle(q) {
    const v = (q || "").toUpperCase().replace(/[^A-Z?]/g, "");
    if (mode === "check") {
      document.title = v ? ("Is " + v + " a word? – Word checker") : BASE_TITLE;
      return;
    }
    if (mode === "bee") {
      document.title = v ? ("Spelling Bee helper – " + v) : BASE_TITLE;
      return;
    }
    if (mode === "gen") {
      document.title = v ? ("Words from " + v + " – Word generator") : BASE_TITLE;
      return;
    }
    if (mode === "boxed") {
      document.title = v ? ("Letter Boxed – " + v) : BASE_TITLE;
      return;
    }
    if (mode === "scramble") {
      document.title = v ? ("Scramble " + v + " – Word scrambler") : BASE_TITLE;
      return;
    }
    document.title = v ? ("Unscramble " + v + " – Word Unscrambler") : BASE_TITLE;
  }

  let lastRack = "";
  let lastMatches = [];

  function leftoverOf(rack, word) {
    if (!rack) return "";
    const a = countsOf(rack || "");
    for (const c of word) {
      if (a.count[c]) a.count[c]--;
      else a.wild--;
    }
    let s = "";
    Object.keys(a.count).sort().forEach((ch) => {
      if (a.count[ch] > 0) s += ch.repeat(a.count[ch]);
    });
    if (a.wild > 0) s += "?".repeat(a.wild);
    return s.toUpperCase();
  }

  async function pickWord(m, card, maxLen) {
    document.querySelectorAll(".word.is-on").forEach((n) => n.classList.remove("is-on"));
    if (card) card.classList.add("is-on");
    try {
      await navigator.clipboard.writeText(m.word);
      const pts = card?.querySelector(".pts");
      if (pts) {
        pts.textContent = "copied";
        setTimeout(() => { pts.textContent = m.score + " pts"; }, 900);
      }
    } catch {}
    showDefine(m, maxLen);
  }

  function setCoach(matches, input) {
    const coach = $("coach");
    if (!coach) return;
    if (!matches || !matches.length) {
      if (!input) coach.textContent = COACH[mode] || COACH.subset;
      return;
    }
    const best = matches.reduce((a, b) => (a.score > b.score || (a.score === b.score && a.len > b.len) ? a : b));
    coach.textContent = matches.length.toLocaleString("en-GB") + " words · best " + best.word.toUpperCase() + " · " + best.score + " pts";
  }

  function hideBest() {
    const n = $("bestPlay");
    if (n) n.hidden = true;
  }
  function renderBest(matches, rack, maxLen) {
    let card = $("bestPlay");
    if (!card) {
      card = el("aside", "best-play");
      card.id = "bestPlay";
      const results = $("results");
      if (results) results.before(card);
      else return;
    }
    if (!matches.length) {
      card.hidden = true;
      return;
    }
    const best = matches.reduce((a, b) => (a.score > b.score || (a.score === b.score && a.len > b.len) ? a : b));
    const bingo = best.pangram || (best.len >= 7 && best.len === maxLen);
    const left = leftoverOf(rack, best.word);
    card.hidden = false;
    card.replaceChildren();
    card.appendChild(el("p", "try-label", best.pangram ? "Pangram" : (bingo ? "Bingo" : "Best play")));
    const wordBtn = el("button", "best-word", best.word);
    wordBtn.type = "button";
    wordBtn.addEventListener("click", () => {
      const target = document.querySelector('.word[data-word="' + best.word + '"]');
      pickWord(best, target, maxLen);
      target?.scrollIntoView({ block: "center", behavior: "smooth" });
    });
    card.appendChild(wordBtn);
    card.appendChild(el("p", "best-meta", best.score + " pts · " + best.len + " letters" + (left ? " · leftover " + left : "")));
    const def = el("p", "best-def");
    def.id = "bestDef";
    card.appendChild(def);
    lookup(best.word).then((text) => { if (def.isConnected) def.textContent = text; });
  }

  function hideJumps() {
    const n = $("lenJumps");
    if (n) n.hidden = true;
  }
  function renderJumps(lens) {
    let nav = $("lenJumps");
    if (!nav) {
      nav = el("nav", "len-jumps");
      nav.id = "lenJumps";
      nav.setAttribute("aria-label", "Jump to length");
      const status = document.querySelector(".status");
      if (status) status.after(nav);
      else $("results")?.before(nav);
    }
    nav.hidden = !lens.length;
    nav.replaceChildren();
    lens.forEach((len) => {
      const a = el("a", "chip", len + " letters");
      a.href = "#len-" + len;
      nav.appendChild(a);
    });
  }

  function withTimeout(promise, ms) {
    return Promise.race([
      promise,
      new Promise((_, rej) => setTimeout(() => rej(new Error("timeout")), ms))
    ]);
  }

  async function lookup(word) {
    if (defineCache[word]) return defineCache[word];
    try {
      const r = await withTimeout(fetch("https://api.dictionaryapi.dev/api/v2/entries/en/" + encodeURIComponent(word)), 2200);
      if (!r.ok) throw new Error("define");
      const data = await r.json();
      const meaning = data[0]?.meanings?.[0];
      const def = meaning?.definitions?.[0];
      const bits = [];
      if (meaning?.partOfSpeech) bits.push(meaning.partOfSpeech);
      if (def?.definition) bits.push(def.definition);
      if (def?.example) bits.push("“" + def.example + "”");
      if (bits.length) {
        defineCache[word] = bits.join(" · ");
        return defineCache[word];
      }
    } catch {}
    try {
      const r = await withTimeout(fetch("https://en.wikipedia.org/api/rest_v1/page/summary/" + encodeURIComponent(word)), 1800);
      if (!r.ok) throw new Error("wiki");
      const d = await r.json();
      if (d && d.type === "standard" && d.extract && d.extract.length > 40 && !/may mean/i.test(d.extract)) {
        defineCache[word] = d.extract.split(". ")[0] + ".";
        return defineCache[word];
      }
    } catch {}
    defineCache[word] = "Valid in the ENABLE word list.";
    return defineCache[word];
  }

  const defineCache = {};
  function ensureDefine() {
    let box = $("define");
    if (box) return box;
    box = el("aside", "define");
    box.id = "define";
    box.hidden = true;
    box.setAttribute("aria-live", "polite");
    box.innerHTML = '<p class="try-label" id="defineWord"></p><p id="defineText"></p><p class="define-extra" id="defineExtra"></p><div class="hook-row" id="defineHooks"></div>';
    const results = $("results");
    if (results) results.before(box);
    else document.body.appendChild(box);
    return box;
  }
  function hideDefine() {
    const box = $("define");
    if (box) box.hidden = true;
  }
  async function showDefine(m) {
    const word = typeof m === "string" ? m : m.word;
    const box = ensureDefine();
    box.hidden = false;
    const w = $("defineWord");
    const t = $("defineText");
    const extra = $("defineExtra");
    if (w) w.textContent = word;
    if (t) t.textContent = defineCache[word] || "Looking up meaning…";
    const left = leftoverOf(lastRack || lettersEl.value, word);
    const rackLen = (lastRack || lettersEl.value || "").replace(/[^a-zA-Z?]/g, "").length;
    const family = (bySig[sig(word)] || []).filter((x) => x !== word).slice(0, 6);
    const bits = [];
    if (typeof m === "object" && m.score) bits.push(m.score + " pts");
    if (left) bits.push("leftover " + left);
    else if (word.length === rackLen) bits.push("uses the whole rack");
    if (family.length) bits.push("also " + family.join(", "));
    if (extra) extra.textContent = bits.join(" · ");
    renderHooks(word);
    const text = await lookup(word);
    if (t && w && w.textContent === word) t.textContent = text;
  }

  function hooksOf(word) {
    const front = [];
    const back = [];
    if (!word || !wordSet.size) return { front, back };
    for (let i = 0; i < 26; i++) {
      const ch = String.fromCharCode(97 + i);
      if (wordSet.has(ch + word)) front.push(ch + word);
      if (wordSet.has(word + ch)) back.push(word + ch);
    }
    return { front, back };
  }
  function renderHooks(word) {
    const row = $("defineHooks");
    if (!row) return;
    row.replaceChildren();
    const { front, back } = hooksOf(word);
    if (!front.length && !back.length) return;
    if (front.length) {
      row.appendChild(el("span", "try-label", "Front hooks"));
      front.forEach((w) => {
        const b = el("button", "chip", w);
        b.type = "button";
        b.addEventListener("click", () => pickWord({ word: w, score: scoreWord(w), len: w.length }));
        row.appendChild(b);
      });
    }
    if (back.length) {
      row.appendChild(el("span", "try-label", "Back hooks"));
      back.forEach((w) => {
        const b = el("button", "chip", w);
        b.type = "button";
        b.addEventListener("click", () => pickWord({ word: w, score: scoreWord(w), len: w.length }));
        row.appendChild(b);
      });
    }
  }

  function hideNextPlay() {
    const nav = $("nextPlay");
    if (nav) nav.hidden = true;
  }
  function renderNextPlay(q) {
    let nav = $("nextPlay");
    if (!nav) {
      nav = el("nav", "next-play");
      nav.id = "nextPlay";
      nav.setAttribute("aria-label", "Related tools");
      const results = $("results");
      if (results) results.after(nav);
      else return;
    }
    const raw = (q || "").toUpperCase().replace(/[^A-Z?]/g, "");
    const n = raw.replace(/\?/g, "").length;
    const seen = new Set();
    const links = [];
    function add(href, label) {
      if (seen.has(href)) return;
      seen.add(href);
      links.push([href, label]);
    }
    if (n === 5) {
      add("/wordle-helper", "Wordle helper");
      add("/5-letter-words", "All 5-letter words");
    }
    if (n === 7) {
      add("/scrabble-word-finder", "Scrabble finder");
      add("/bingo-stems", "Bingo stems");
      add("/7-letter-words", "All 7-letter words");
    }
    if (n === 2) add("/2-letter-words", "Two-letter words");
    if (n >= 2 && n <= 10 && n !== 5 && n !== 7) add("/" + n + "-letter-words", n + "-letter list");
    if (mode !== "anagram" && n >= 3) add("/anagram-solver?q=" + encodeURIComponent(raw), "Anagrams only");
    add("/jumble-solver", "Jumble solver");
    add("/word-descrambler", "Word descrambler");
    add("/letter-unscrambler", "Letter unscrambler");
    add("/word-maker", "Word maker");
    add("/unjumble", "Unjumble");
    add("/word-scrambler", "Word scrambler");
    add("/word-generator", "Word generator");
    add("/spelling-bee", "Spelling Bee helper");
    add("/letter-boxed", "Letter Boxed");
    add("/text-twist-solver", "Text Twist");
    add("/crossword-solver", "Crossword solver");
    add("/hangman-solver", "Hangman solver");
    add("/word-checker", "Check a word");
    if (n === 5) add("/5-letter-words-starting-with", "5-letter starting with");
    else add("/words-starting-with", "Words starting with");
    add("/words-ending-with", "Words ending with");
    add("/words-containing", "Words containing");
    nav.hidden = false;
    nav.replaceChildren();
    nav.appendChild(el("p", "try-label", "Play these next"));
    const row = el("div", "examples");
    links.forEach(([href, label]) => {
      const a = el("a", "chip", label);
      a.href = href;
      row.appendChild(a);
    });
    nav.appendChild(row);
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
      wordSet.add(w);
    }
    wordCount = words.length;
    ready = true;
    const countEl = $("dictCount");
    if (countEl) countEl.textContent = wordCount.toLocaleString("en-GB");
    collect();
  }

  async function loadDict() {
    const sources = ["/words.txt"];
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
    const box = $("results");
    if (box) box.textContent = "Could not load the dictionary. Refresh the page.";
  }

  function setMode(next) {
    if (!next) return;
    mode = next;
    document.querySelectorAll("[data-mode]").forEach((btn) => {
      btn.setAttribute("aria-pressed", btn.dataset.mode === mode ? "true" : "false");
    });
    const wordle = $("wordleFields");
    if (wordle) wordle.hidden = mode !== "wordle";
    const bee = $("beeFields");
    if (bee) bee.hidden = mode !== "bee";
    const boxed = $("boxedFields");
    if (boxed) boxed.hidden = mode !== "boxed";
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
      toast("Copied");
      setTimeout(() => { btn.textContent = prev; }, 1400);
    }).catch(() => {});
  }

  $("go")?.addEventListener("click", () => {
    collect();
    if (matchMedia("(max-width: 720px)").matches) $("results")?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
  $("randomWord")?.addEventListener("click", () => {
    if (!ready) return;
    const chip = document.querySelector(".len[aria-pressed='true']");
    const lenKey = chip ? chip.dataset.len : "";
    const n = (lenKey && lenKey !== "9+" ? parseInt(lenKey, 10) : ($("length")?.value ? parseInt($("length").value, 10) : 7)) || 7;
    const list = byLen[n] || byLen[7] || [];
    if (!list.length) return;
    lettersEl.value = list[Math.floor(Math.random() * list.length)].toUpperCase();
    collect();
    lettersEl.focus();
  });
  lettersEl.addEventListener("input", () => {
    const tool = document.body.dataset.tool || mode;
    let clean;
    if (tool === "multi" || mode === "multi") {
      clean = lettersEl.value.toUpperCase().replace(/[^A-Z?*,\s]/g, "").replace(/\s+/g, " ").slice(0, 80);
    } else if (tool === "scramble" || mode === "scramble") {
      clean = lettersEl.value.toUpperCase().replace(/[^A-Z]/g, "").slice(0, 20);
    } else if (tool === "bee" || mode === "bee") {
      clean = lettersEl.value.toUpperCase().replace(/[^A-Z]/g, "").slice(0, 7);
    } else if (tool === "boxed" || mode === "boxed") {
      clean = lettersEl.value.toUpperCase().replace(/[^A-Z]/g, "").slice(0, 12);
    } else if (tool === "pattern" || mode === "pattern") {
      clean = lettersEl.value.toUpperCase().replace(/[^A-Z?*_]/g, "").replace(/_/g, "?").slice(0, 16);
    } else if (tool === "gen" || mode === "gen") {
      clean = lettersEl.value.toUpperCase().replace(/[^A-Z]/g, "").slice(0, 16);
    } else {
      clean = lettersEl.value.toUpperCase().replace(/[^A-Z?*]/g, "").slice(0, 16);
    }
    if (clean !== lettersEl.value) lettersEl.value = clean;
    if ((tool === "boxed" || mode === "boxed") && clean.length === 12) {
      ["side0", "side1", "side2", "side3"].forEach((id, i) => {
        if ($(id)) $(id).value = clean.slice(i * 3, i * 3 + 3);
      });
    }
    const c = $("clear");
    if (c) c.hidden = !lettersEl.value;
    schedule();
  });
  lettersEl.addEventListener("keydown", (e) => {
    if (e.key === "Enter") collect();
    if (e.key === "Escape") {
      lettersEl.value = "";
      collect();
    }
  });
  document.addEventListener("keydown", (e) => {
    if (e.key !== "/" || e.metaKey || e.ctrlKey || e.altKey) return;
    const tag = (e.target && e.target.tagName) || "";
    if (tag === "INPUT" || tag === "TEXTAREA") return;
    e.preventDefault();
    lettersEl.focus();
    lettersEl.select();
  });
  (function addFieldChrome() {
    if (!lettersEl || !lettersEl.parentNode) return;
    if (!lettersEl.parentElement.classList.contains("field-wrap")) {
      const wrap = el("div", "field-wrap");
      lettersEl.before(wrap);
      wrap.appendChild(lettersEl);
    }
    if (!$("clear")) {
      const c = el("button", "icon-clear", "×");
      c.id = "clear";
      c.type = "button";
      c.hidden = !lettersEl.value;
      c.setAttribute("aria-label", "Clear letters");
      c.title = "Clear";
      lettersEl.after(c);
      c.addEventListener("click", () => {
        lettersEl.value = "";
        collect();
        lettersEl.focus();
      });
    }
  })();
  (function ensureKeypad() {
    if ($("keypad") || !lettersEl) return;
    if (matchMedia("(max-width: 720px)").matches) return;
    const box = el("div", "keypad");
    box.id = "keypad";
    box.setAttribute("aria-label", "Letter keys");
    function addLetter(ch) {
      const n = lettersEl.value.replace(/[^a-zA-Z?]/g, "").length;
      if (n >= 16) return;
      lettersEl.value += ch;
      const c = $("clear");
      if (c) c.hidden = false;
      schedule();
    }
    ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"].forEach((line, i) => {
      const r = el("div", "key-row");
      if (i === 2) {
        const del = el("button", "key key-wide", "⌫");
        del.type = "button";
        del.setAttribute("aria-label", "Delete last letter");
        del.addEventListener("click", () => {
          lettersEl.value = lettersEl.value.slice(0, -1);
          const c = $("clear");
          if (c) c.hidden = !lettersEl.value;
          schedule();
        });
        r.appendChild(del);
      }
      line.split("").forEach((ch) => {
        const b = el("button", "key", ch);
        b.type = "button";
        b.addEventListener("click", () => addLetter(ch));
        r.appendChild(b);
      });
      if (i === 2) {
        const blank = el("button", "key key-wide", "?");
        blank.type = "button";
        blank.setAttribute("aria-label", "Blank tile");
        blank.addEventListener("click", () => {
          const wilds = (lettersEl.value.match(/[?*]/g) || []).length;
          if (wilds >= 2) { toast("Two blanks maximum"); return; }
          lettersEl.value = (lettersEl.value + "?").slice(0, 16);
          const c = $("clear");
          if (c) c.hidden = false;
          collect();
        });
        r.appendChild(blank);
      }
      box.appendChild(r);
    });
    const coach = $("coach");
    if (coach) coach.after(box);
    else lettersEl.parentNode.after(box);
  })();
  ["starts", "ends", "contains", "exclude", "greys", "center", "side0", "side1", "side2", "side3"].forEach((id) => {
    $(id)?.addEventListener("input", (e) => {
      const max = id === "center" ? 1 : id.indexOf("side") === 0 ? 3 : 99;
      const clean = e.target.value.toUpperCase().replace(/[^A-Z]/g, "").slice(0, max);
      if (clean !== e.target.value) e.target.value = clean;
      if (id.indexOf("side") === 0 && (mode === "boxed" || document.body.dataset.tool === "boxed")) {
        lettersEl.value = ["side0", "side1", "side2", "side3"].map((s) => ($(s)?.value || "")).join("");
      }
      if (hasQuery() || (id === "center" && clean) || id.indexOf("side") === 0) schedule();
    });
  });
  $("length")?.addEventListener("input", () => { if (hasQuery()) schedule(); });
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
  document.querySelectorAll("[data-ex], [data-starts], [data-ends], [data-contains], [data-center]").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (btn.dataset.ex != null) lettersEl.value = btn.dataset.ex;
      if (btn.dataset.starts != null && $("starts")) $("starts").value = btn.dataset.starts;
      if (btn.dataset.ends != null && $("ends")) $("ends").value = btn.dataset.ends;
      if (btn.dataset.contains != null && $("contains")) $("contains").value = btn.dataset.contains;
      if (btn.dataset.center != null && $("center")) $("center").value = btn.dataset.center;
      if (btn.dataset.sides) {
        const parts = btn.dataset.sides.toUpperCase().split(/[,\s]+/);
        parts.forEach((p, i) => { if ($("side" + i)) $("side" + i).value = p.replace(/[^A-Z]/g, "").slice(0, 3); });
        lettersEl.value = parts.join("").replace(/[^A-Z]/g, "").slice(0, 12);
      }
      collect();
      const hub = document.body.dataset.hub;
      (hub === "starts" ? $("starts") : hub === "ends" ? $("ends") : hub === "contains" ? $("contains") : lettersEl)?.focus();
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
    btn.setAttribute("aria-pressed", btn.dataset.score === scoring ? "true" : "false");
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

  const DAILY_WORDS = "LETTERS PUZZLES ENGLISH PLAYING READING WRITING NATURAL STRANGE RESULTS MACHINE ALREADY PROBLEM SERVICE PICTURE BETWEEN WITHOUT GREATER ANOTHER BECAUSE THROUGH JUMBLED RACKETS FINDERS SOLVING WORDING".split(" ");
  function dayKey() {
    const d = new Date();
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
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
    const y = new Date();
    y.setDate(y.getDate() - 1);
    const yesterday = y.getFullYear() + "-" + String(y.getMonth() + 1).padStart(2, "0") + "-" + String(y.getDate()).padStart(2, "0");
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

  (function stageMotion() {
    const stage = document.querySelector(".stage");
    const orbit = document.querySelector(".orbit");
    if (!stage || !orbit) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (matchMedia("(pointer: coarse)").matches) return;
    let raf = 0;
    let tx = 0, ty = 0, cx = 0, cy = 0;
    function tick() {
      cx += (tx - cx) * 0.08;
      cy += (ty - cy) * 0.08;
      orbit.style.transform = "translate3d(" + (cx * 28) + "px," + (cy * 18) + "px,0)";
      raf = Math.abs(tx - cx) + Math.abs(ty - cy) > 0.001 ? requestAnimationFrame(tick) : 0;
    }
    stage.addEventListener("pointermove", (e) => {
      const r = stage.getBoundingClientRect();
      tx = (e.clientX - r.left) / r.width - 0.5;
      ty = (e.clientY - r.top) / r.height - 0.5;
      if (!raf) raf = requestAnimationFrame(tick);
    });
  })();

  const params = new URLSearchParams(location.search);
  const tool = document.body.dataset.tool || "subset";
  const allowedMode = { subset: 1, anagram: 1, wordle: 1, pattern: 1, check: 1, bee: 1, multi: 1, scramble: 1, gen: 1, boxed: 1 };
  if (allowedMode[params.get("mode")]) mode = params.get("mode");
  const qRaw = params.get("q") || "";
  let qIn;
  if (tool === "multi" || mode === "multi") {
    qIn = qRaw.toUpperCase().replace(/[^A-Z?*,\s]/g, "").replace(/\s+/g, " ").trim().slice(0, 80);
  } else if (tool === "scramble" || mode === "scramble") {
    qIn = qRaw.toUpperCase().replace(/[^A-Z]/g, "").slice(0, 20);
  } else if (tool === "bee" || mode === "bee") {
    qIn = qRaw.toUpperCase().replace(/[^A-Z]/g, "").slice(0, 7);
  } else if (tool === "boxed" || mode === "boxed") {
    qIn = qRaw.toUpperCase().replace(/[^A-Z]/g, "").slice(0, 12);
  } else if (tool === "pattern" || mode === "pattern") {
    qIn = qRaw.toUpperCase().replace(/[^A-Z?*_]/g, "").replace(/_/g, "?").slice(0, 16);
  } else if (tool === "gen" || mode === "gen") {
    qIn = qRaw.toUpperCase().replace(/[^A-Z]/g, "").slice(0, 16);
  } else {
    qIn = qRaw.toUpperCase().replace(/[^A-Z?*]/g, "").slice(0, 16);
  }
  if (qIn) lettersEl.value = qIn;
  const centerIn = (params.get("center") || "").toUpperCase().replace(/[^A-Z]/g, "").slice(0, 1);
  if (centerIn && $("center")) $("center").value = centerIn;
  const startsIn = (params.get("starts") || "").toUpperCase().replace(/[^A-Z]/g, "").slice(0, 5);
  const endsIn = (params.get("ends") || "").toUpperCase().replace(/[^A-Z]/g, "").slice(0, 5);
  const containsIn = (params.get("contains") || "").toUpperCase().replace(/[^A-Z]/g, "").slice(0, 8);
  const lenIn = (params.get("len") || "").replace(/[^0-9+]/g, "");
  if (startsIn && $("starts")) $("starts").value = startsIn;
  if (endsIn && $("ends")) $("ends").value = endsIn;
  if (containsIn && $("contains")) $("contains").value = containsIn;
  if (lenIn) {
    if ($("length") && lenIn !== "9+") $("length").value = lenIn === "5" ? "5" : lenIn;
    document.querySelectorAll(".len").forEach((b) => {
      b.setAttribute("aria-pressed", b.dataset.len === lenIn ? "true" : "false");
    });
  } else if (document.body.dataset.exact) {
    const lock = document.body.dataset.exact;
    if ($("length")) $("length").value = lock;
    document.querySelectorAll(".len").forEach((b) => {
      b.setAttribute("aria-pressed", b.dataset.len === lock ? "true" : "false");
    });
  }
  if ((tool === "boxed" || mode === "boxed") && qIn.length === 12) {
    ["side0", "side1", "side2", "side3"].forEach((id, i) => {
      if ($(id)) $(id).value = qIn.slice(i * 3, i * 3 + 3);
    });
  }
  setMode(mode);
  const hub = document.body.dataset.hub;
  if (hub === "starts" && $("starts") && !qIn) $("starts").focus();
  else if (hub === "ends" && $("ends") && !qIn) $("ends").focus();
  else if (hub === "contains" && $("contains") && !qIn) $("contains").focus();
  else if (!qIn) lettersEl.focus();
  if (hub === "starts" && $("coach") && !qIn) $("coach").textContent = "Type a prefix in Starts with. A rack is optional.";
  if (hub === "ends" && $("coach") && !qIn) $("coach").textContent = "Type a suffix in Ends with. A rack is optional.";
  if (hub === "contains" && $("coach") && !qIn) $("coach").textContent = "Type a letter or cluster (TH, ING, QU). A rack is optional.";
  if (hub === "five-start" && $("coach") && !qIn) $("coach").textContent = "Type a starting letter. Length is locked to 5 for Wordle lists.";
  if ((tool === "bee" || mode === "bee") && $("coach") && !qIn) $("coach").textContent = COACH.bee;
  if ((tool === "gen" || mode === "gen") && $("coach") && !qIn) $("coach").textContent = COACH.gen;
  if ((tool === "boxed" || mode === "boxed") && $("coach") && !qIn) $("coach").textContent = COACH.boxed;
  loadDict();

  (function initAds() {
    const ins = document.querySelector(".ad-box ins.adsbygoogle");
    if (!ins || ins.getAttribute("data-adsbygoogle-status")) return;
    const run = () => {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch {}
    };
    if ("requestIdleCallback" in window) requestIdleCallback(run, { timeout: 2500 });
    else setTimeout(run, 1200);
  })();
})();
