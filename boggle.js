/* Classic 4×4 Boggle. Adjacent includes diagonals. A Q die is QU. Words of 3+ letters. */
(function (g) {
  const DIRS = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];

  function boggleScore(len) {
    if (len <= 4) return len >= 3 ? 1 : 0;
    if (len === 5) return 2;
    if (len === 6) return 3;
    if (len === 7) return 5;
    return 11;
  }

  function faceOf(raw) {
    const t = String(raw || "").toLowerCase().replace(/[^a-z]/g, "");
    if (!t) return "";
    if (t === "q" || t === "qu") return "qu";
    return t.charAt(0);
  }

  function solveBoggle(words, cells) {
    if (!cells || cells.length !== 16) return { error: "board" };
    const board = [];
    for (let i = 0; i < 16; i++) {
      const face = faceOf(cells[i]);
      if (!face) return { error: "empty" };
      board.push(face);
    }
    const trie = { end: false, next: Object.create(null) };
    const list = words || [];
    for (let i = 0; i < list.length; i++) {
      const w = list[i];
      if (!w || w.length < 3) continue;
      let node = trie;
      for (let c = 0; c < w.length; c++) {
        const ch = w.charAt(c);
        if (!node.next[ch]) node.next[ch] = { end: false, next: Object.create(null) };
        node = node.next[ch];
      }
      node.end = true;
    }
    const found = new Map();
    const used = new Array(16).fill(false);
    function step(idx, node, path) {
      const face = board[idx];
      let n = node;
      for (let i = 0; i < face.length; i++) {
        n = n.next[face.charAt(i)];
        if (!n) return;
      }
      const word = path + face;
      if (n.end && word.length >= 3) found.set(word, boggleScore(word.length));
      used[idx] = true;
      const r = (idx / 4) | 0;
      const c = idx % 4;
      for (let d = 0; d < 8; d++) {
        const nr = r + DIRS[d][0];
        const nc = c + DIRS[d][1];
        if (nr < 0 || nc < 0 || nr > 3 || nc > 3) continue;
        const ni = nr * 4 + nc;
        if (used[ni]) continue;
        step(ni, n, word);
      }
      used[idx] = false;
    }
    for (let i = 0; i < 16; i++) step(i, trie, "");
    const wordsOut = [];
    found.forEach(function (score, word) { wordsOut.push({ word: word, score: score }); });
    wordsOut.sort(function (a, b) { return b.score - a.score || (a.word < b.word ? -1 : a.word > b.word ? 1 : 0); });
    let total = 0;
    for (let i = 0; i < wordsOut.length; i++) total += wordsOut[i].score;
    return { words: wordsOut, total: total };
  }

  g.boggleScore = boggleScore;
  g.solveBoggle = solveBoggle;

  if (typeof document === "undefined" || !document.getElementById("boggleGrid")) return;

  const grid = document.getElementById("boggleGrid");
  const status = document.getElementById("boggleStatus");
  const out = document.getElementById("boggleOut");
  const inputs = [];
  let dict = null;

  for (let i = 0; i < 16; i++) {
    const input = document.createElement("input");
    input.type = "text";
    input.maxLength = 2;
    input.autocomplete = "off";
    input.spellcheck = false;
    input.setAttribute("aria-label", "Row " + ((i / 4 | 0) + 1) + ", column " + ((i % 4) + 1));
    input.addEventListener("input", function () {
      const v = input.value.toLowerCase().replace(/[^a-z]/g, "");
      input.value = v === "q" || v === "qu" ? v : v.slice(0, 1);
      if (input.value && i < 15) inputs[i + 1].focus();
    });
    input.addEventListener("keydown", function (e) {
      if (e.key === "Backspace" && !input.value && i > 0) inputs[i - 1].focus();
    });
    inputs.push(input);
    grid.appendChild(input);
  }

  function say(msg) { if (status) status.textContent = msg; }

  function show(result) {
    out.replaceChildren();
    if (!result || result.error || !result.words.length) {
      const p = document.createElement("p");
      p.className = "ladder-empty";
      p.textContent = result && result.error === "empty"
        ? "Fill all 16 squares. Type Q for the QU die."
        : "No ENABLE words of 3 or more letters on that board.";
      out.appendChild(p);
      say(result && result.error === "empty" ? "Board incomplete" : "No words");
      return;
    }
    const list = document.createElement("ol");
    list.className = "boggle-words";
    result.words.forEach(function (item) {
      const li = document.createElement("li");
      li.textContent = item.word + " · " + item.score;
      list.appendChild(li);
    });
    out.appendChild(list);
    say(result.words.length + " words · " + result.total + " points");
  }

  async function dictionary() {
    if (dict) return dict;
    say("Loading the dictionary…");
    const res = await fetch("/words.txt");
    if (!res.ok) throw new Error("dictionary");
    const text = await res.text();
    dict = text.split(/\s+/).map(function (w) { return w.trim().toLowerCase(); }).filter(function (w) { return w.length >= 3; });
    return dict;
  }

  const preset = (new URLSearchParams(location.search).get("q") || "").toLowerCase().replace(/[^a-z]/g, "");
  if (preset.length >= 16) {
    for (let i = 0; i < 16; i++) inputs[i].value = preset.charAt(i);
  }

  document.getElementById("boggleSample").addEventListener("click", function () {
    const sample = ["c","a","t","s","a","r","e","o","t","i","n","s","s","e","d","l"];
    sample.forEach(function (ch, i) { inputs[i].value = ch; });
    inputs[0].focus();
  });

  document.getElementById("boggleForm").addEventListener("submit", async function (e) {
    e.preventDefault();
    const cells = inputs.map(function (input) { return input.value; });
    try {
      const words = await dictionary();
      show(solveBoggle(words, cells));
    } catch (err) {
      out.replaceChildren();
      const p = document.createElement("p");
      p.className = "ladder-empty";
      p.textContent = "The dictionary did not load. Try again.";
      out.appendChild(p);
      say("No words");
    }
  });
})(typeof globalThis !== "undefined" ? globalThis : this);
