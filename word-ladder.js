/* Shortest word ladder by BFS. One letter changes at each step. */
(function (g) {
  const ALPHA = "abcdefghijklmnopqrstuvwxyz";
  function clean(w) {
    return String(w || "").toLowerCase().replace(/[^a-z]/g, "");
  }
  function shortestLadder(words, startRaw, endRaw, maxSteps) {
    const start = clean(startRaw);
    const end = clean(endRaw);
    if (!start || !end) return { error: "empty" };
    if (start.length !== end.length) return { error: "length" };
    if (start.length < 3 || start.length > 6) return { error: "range" };
    const cap = Number(maxSteps);
    const limit = cap > 0 ? cap : Infinity;
    const set = new Set();
    const list = words || [];
    for (let i = 0; i < list.length; i++) {
      if (list[i].length === start.length) set.add(list[i]);
    }
    if (!set.has(start) || !set.has(end)) return { error: "missing", start: start, end: end };
    if (start === end) return { path: [start] };
    const prev = new Map();
    const depth = new Map();
    const q = [start];
    depth.set(start, 0);
    let head = 0;
    while (head < q.length) {
      const word = q[head++];
      const d = depth.get(word);
      if (d >= limit) continue;
      for (let i = 0; i < word.length; i++) {
        for (let a = 0; a < 26; a++) {
          const ch = ALPHA.charAt(a);
          if (ch === word.charAt(i)) continue;
          const next = word.slice(0, i) + ch + word.slice(i + 1);
          if (!set.has(next) || depth.has(next)) continue;
          const nd = d + 1;
          if (nd > limit) continue;
          depth.set(next, nd);
          prev.set(next, word);
          if (next === end) {
            const path = [end];
            let cur = end;
            while (cur !== start) {
              cur = prev.get(cur);
              path.push(cur);
            }
            path.reverse();
            return { path: path };
          }
          q.push(next);
        }
      }
    }
    return { path: null };
  }
  g.shortestLadder = shortestLadder;

  if (typeof document === "undefined" || !document.getElementById("ladderStart")) return;
  const startEl = document.getElementById("ladderStart");
  const endEl = document.getElementById("ladderEnd");
  const preset = new URLSearchParams(location.search).get("q") || "";
  const presetWord = preset.toUpperCase().replace(/[^A-Z]/g, "").slice(0, 6);
  if (presetWord.length >= 3) startEl.value = presetWord;
  const maxEl = document.getElementById("ladderMax");
  const out = document.getElementById("ladderOut");
  const status = document.getElementById("ladderStatus");
  let dict = null;
  function say(msg) { if (status) status.textContent = msg; }
  function showPath(path) {
    out.replaceChildren();
    out.className = "ladder-steps";
    path.forEach((word, i) => {
      if (i) {
        const arrow = document.createElement("span");
        arrow.className = "ladder-arrow";
        arrow.setAttribute("aria-hidden", "true");
        arrow.textContent = "→";
        out.appendChild(arrow);
      }
      const step = document.createElement("span");
      step.className = "ladder-step";
      step.textContent = word;
      out.appendChild(step);
    });
  }
  function showEmpty(msg) {
    out.className = "";
    out.replaceChildren();
    const p = document.createElement("p");
    p.className = "ladder-empty";
    p.textContent = msg;
    out.appendChild(p);
  }
  async function words() {
    if (dict) return dict;
    say("Loading the dictionary…");
    const res = await fetch("/words.txt");
    if (!res.ok) throw new Error("dictionary");
    const text = await res.text();
    dict = text.split(/\s+/).map((w) => w.trim().toLowerCase()).filter((w) => w.length >= 3 && w.length <= 6);
    return dict;
  }
  document.getElementById("ladderForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const start = clean(startEl.value);
    const end = clean(endEl.value);
    const max = maxEl.value ? Number(maxEl.value) : 0;
    if (start.length !== end.length) {
      showEmpty("Start and end need the same number of letters.");
      say("No ladder");
      return;
    }
    if (start.length < 3 || start.length > 6) {
      showEmpty("Use words of 3, 4, 5 or 6 letters.");
      say("No ladder");
      return;
    }
    try {
      const list = await words();
      const result = shortestLadder(list, start, end, max);
      if (result.error === "missing") {
        showEmpty("One of those words is not in the ENABLE list, so there is no ladder.");
        say("No ladder found");
        return;
      }
      if (!result.path) {
        showEmpty(max > 0
          ? "No ladder found within " + max + " steps."
          : "No ladder found between those words.");
        say("No ladder found");
        return;
      }
      showPath(result.path);
      const steps = result.path.length - 1;
      say(steps === 0 ? "Same word" : steps + (steps === 1 ? " step" : " steps"));
    } catch (err) {
      showEmpty("The dictionary did not load. Try again.");
      say("No ladder");
    }
  });
})(typeof globalThis !== "undefined" ? globalThis : this);
