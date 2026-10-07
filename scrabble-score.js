/* Tile score for one word. Premiums are chosen by the player. Bingo is added after the word multiplier. */
(function (g) {
  const SCRABBLE = { a:1,b:3,c:3,d:2,e:1,f:4,g:2,h:4,i:1,j:8,k:5,l:1,m:3,n:1,o:1,p:3,q:10,r:1,s:1,t:1,u:1,v:4,w:4,x:8,y:4,z:10 };
  const WWF = { a:1,b:4,c:4,d:2,e:1,f:4,g:3,h:3,i:1,j:10,k:5,l:2,m:4,n:2,o:1,p:4,q:10,r:1,s:1,t:1,u:2,v:5,w:4,x:8,y:3,z:10 };
  const WORD_MULTS = { 1:1, 2:2, 3:3, 4:4, 6:6, 9:9 };

  function scorePlay(raw, options) {
    const opts = options || {};
    const game = opts.game === "wwf" ? "wwf" : "scrabble";
    const table = game === "wwf" ? WWF : SCRABBLE;
    const letters = String(raw || "").toLowerCase().replace(/[^a-z?]/g, "");
    if (!letters) return { error: "empty" };
    if (letters.length > 15) return { error: "long" };
    const blanks = opts.blanks || [];
    const letterMult = opts.letterMult || [];
    const wordMult = WORD_MULTS[Number(opts.wordMult)] || 1;
    let face = 0;
    const tiles = [];
    for (let i = 0; i < letters.length; i++) {
      const ch = letters.charAt(i);
      const blank = ch === "?" || blanks[i] === true;
      const base = blank || ch === "?" ? 0 : (table[ch] || 0);
      let mult = Number(letterMult[i]);
      if (mult !== 2 && mult !== 3) mult = 1;
      const points = base * mult;
      face += points;
      tiles.push({ letter: ch, blank: blank, base: base, mult: mult, points: points });
    }
    const bingo = opts.bingo === true && letters.length >= 7 ? (game === "wwf" ? 35 : 50) : 0;
    return {
      game: game,
      word: letters,
      tiles: tiles,
      face: face,
      wordMult: wordMult,
      bingo: bingo,
      total: face * wordMult + bingo
    };
  }

  g.scorePlay = scorePlay;

  if (typeof document === "undefined" || !document.getElementById("scoreWord")) return;

  const wordEl = document.getElementById("scoreWord");
  const gameEl = document.getElementById("scoreGame");
  const multEl = document.getElementById("scoreWordMult");
  const bingoEl = document.getElementById("scoreBingo");
  const tilesEl = document.getElementById("scoreTiles");
  const status = document.getElementById("scoreStatus");
  const out = document.getElementById("scoreOut");
  let dict = null;

  function say(msg) { if (status) status.textContent = msg; }

  function paintTiles() {
    const letters = String(wordEl.value || "").toLowerCase().replace(/[^a-z?]/g, "");
    const prev = tilesEl.querySelectorAll(".score-tile");
    const keep = [];
    prev.forEach(function (tile) {
      keep.push({
        blank: tile.querySelector("input").checked,
        mult: tile.querySelector("select").value
      });
    });
    tilesEl.replaceChildren();
    if (!letters) return;
    for (let i = 0; i < letters.length; i++) {
      const tile = document.createElement("div");
      tile.className = "score-tile";
      const face = document.createElement("strong");
      face.textContent = letters.charAt(i) === "?" ? "?" : letters.charAt(i).toUpperCase();
      const blankLabel = document.createElement("label");
      const blank = document.createElement("input");
      blank.type = "checkbox";
      blank.checked = letters.charAt(i) === "?" || (keep[i] && keep[i].blank);
      blankLabel.appendChild(blank);
      blankLabel.appendChild(document.createTextNode(" Blank"));
      const select = document.createElement("select");
      select.setAttribute("aria-label", "Letter premium for " + face.textContent);
      [["1", "—"], ["2", "DL"], ["3", "TL"]].forEach(function (pair) {
        const opt = document.createElement("option");
        opt.value = pair[0];
        opt.textContent = pair[1];
        if (keep[i] && keep[i].mult === pair[0]) opt.selected = true;
        select.appendChild(opt);
      });
      tile.appendChild(face);
      tile.appendChild(select);
      tile.appendChild(blankLabel);
      tilesEl.appendChild(tile);
    }
    if (letters.length >= 7 && bingoEl && !bingoEl.dataset.touched) bingoEl.checked = true;
    if (letters.length < 7 && bingoEl && !bingoEl.dataset.touched) bingoEl.checked = false;
  }

  function readOpts() {
    const blanks = [];
    const letterMult = [];
    tilesEl.querySelectorAll(".score-tile").forEach(function (tile) {
      blanks.push(tile.querySelector("input").checked);
      letterMult.push(Number(tile.querySelector("select").value));
    });
    return {
      game: gameEl.value,
      blanks: blanks,
      letterMult: letterMult,
      wordMult: Number(multEl.value),
      bingo: bingoEl.checked
    };
  }

  function show(result, known) {
    out.replaceChildren();
    if (result.error) {
      const p = document.createElement("p");
      p.className = "ladder-empty";
      p.textContent = result.error === "long" ? "Use 15 letters or fewer." : "Type a word to score.";
      out.appendChild(p);
      say("No score");
      return;
    }
    const list = document.createElement("ol");
    list.className = "score-break";
    result.tiles.forEach(function (tile) {
      const li = document.createElement("li");
      const name = tile.letter === "?" ? "Blank" : tile.letter.toUpperCase();
      const extra = tile.mult > 1 ? " × " + tile.mult : "";
      li.textContent = name + (tile.blank && tile.letter !== "?" ? " blank" : "") + " " + tile.points + extra;
      list.appendChild(li);
    });
    const sum = document.createElement("p");
    sum.className = "score-total";
    let line = "Face " + result.face;
    if (result.wordMult > 1) line += " × " + result.wordMult + " word";
    if (result.bingo) line += " + " + result.bingo + " bingo";
    line += " = " + result.total;
    sum.textContent = line;
    out.appendChild(list);
    out.appendChild(sum);
    if (known === true) {
      const note = document.createElement("p");
      note.className = "mini";
      note.textContent = result.word.replace(/\?/g, "") + " is in the ENABLE list.";
      out.appendChild(note);
    } else if (known === false && result.word.indexOf("?") === -1) {
      const note = document.createElement("p");
      note.className = "mini";
      note.textContent = "That spelling is not in the ENABLE list. The points above are still the tile total.";
      out.appendChild(note);
    }
    say(result.total + (result.total === 1 ? " point" : " points"));
  }

  async function dictionary() {
    if (dict) return dict;
    const res = await fetch("/words.txt");
    if (!res.ok) throw new Error("dictionary");
    const text = await res.text();
    dict = new Set(text.split(/\s+/).map(function (w) { return w.trim().toLowerCase(); }).filter(Boolean));
    return dict;
  }

  wordEl.addEventListener("input", paintTiles);
  if (bingoEl) bingoEl.addEventListener("change", function () { bingoEl.dataset.touched = "1"; });
  document.getElementById("scoreForm").addEventListener("submit", async function (e) {
    e.preventDefault();
    paintTiles();
    const result = scorePlay(wordEl.value, readOpts());
    show(result, null);
    if (result.error || result.word.indexOf("?") !== -1) return;
    try {
      const set = await dictionary();
      show(result, set.has(result.word));
    } catch (err) {
      const note = document.createElement("p");
      note.className = "mini";
      note.textContent = "The dictionary did not load, so this score is unchecked.";
      out.appendChild(note);
    }
  });
})(typeof globalThis !== "undefined" ? globalThis : this);
