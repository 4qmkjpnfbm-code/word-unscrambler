const GH = "https://raw.githubusercontent.com/4qmkjpnfbm-code/word-unscrambler/2f04d69a534762d85c82a422577a1e46c4c4f21c/";
const GH_MAIN = "https://raw.githubusercontent.com/4qmkjpnfbm-code/word-unscrambler/main/";
const CANONICAL_HOST = "lettersunscrambler.com";
const DICT = "https://raw.githubusercontent.com/dolph/dictionary/master/enable1.txt";
const FEEDBACK_TO = "hdkdistributionltd@gmail.com";
const ROUTES = {
  "/": "index.html",
  "/anagram-solver": "anagram-solver.html",
  "/scrabble-word-finder": "scrabble-word-finder.html",
  "/words-with-friends": "words-with-friends.html",
  "/wordle-helper": "wordle-helper.html",
  "/jumble-solver": "jumble-solver.html",
  "/crossword-solver": "crossword-solver.html",
  "/words-from-letters": "words-from-letters.html",
  "/how-it-works": "how-it-works.html",
  "/guides/blank-tiles": "guide-blank-tiles.html",
  "/guides/scrabble-vs-wwf": "guide-scrabble-vs-wwf.html",
  "/guides/wordle-starters": "guide-wordle-starters.html",
  "/guides/pattern-solver": "guide-pattern-solver.html",
  "/guides/how-to-unscramble": "guide-how-to-unscramble.html",
  "/word-lists": "word-lists.html",
  "/2-letter-words": "2-letter-words.html",
  "/3-letter-words": "3-letter-words.html",
  "/4-letter-words": "4-letter-words.html",
  "/5-letter-words": "5-letter-words.html",
  "/6-letter-words": "6-letter-words.html",
  "/7-letter-words": "7-letter-words.html",
  "/8-letter-words": "8-letter-words.html",
  "/q-without-u": "q-without-u.html",
  "/jqxz-words": "jqxz-words.html",
  "/bingo-stems": "bingo-stems.html",
  "/about": "about.html",
  "/privacy": "privacy.html",
  "/terms": "terms.html",
  "/contact": "contact.html",
  "/feedback": "feedback.html",
  "/unscramble": "unscramble.html",
  "/unscramble/listen": "unscramble-listen.html",
  "/unscramble/aeinrst": "unscramble-aeinrst.html",
  "/unscramble/scrabble": "unscramble-scrabble.html",
  "/unscramble/train": "unscramble-train.html",
  "/unscramble/earth": "unscramble-earth.html",
  "/unscramble/adobe": "unscramble-adobe.html",
  "/unscramble/race": "unscramble-race.html",
  "/unscramble/retina": "unscramble-retina.html",
  "/unscramble/orange": "unscramble-orange.html",
  "/unscramble/stressed": "unscramble-stressed.html",
  "/unscramble/master": "unscramble-master.html",
  "/unscramble/planet": "unscramble-planet.html",
  "/unscramble/credit": "unscramble-credit.html",
  "/unscramble/friend": "unscramble-friend.html",
  "/llms.txt": "llms.txt",
  "/llms-full.txt": "llms-full.txt",
  "/.well-known/llms.txt": "llms.txt"
};
const ALLOW = new Set(Object.values(ROUTES).concat([
  "styles.css","app.js","favicon.svg","og.jpg","stage.jpg","wood.jpg","robots.txt","sitemap.xml","404.html","ads.txt","manifest.webmanifest","llms.txt","llms-full.txt","b7e4c91a0f3d68e25a14c0b9d8e7f612.txt","8d7c4a91b2e05f63c1a47d90e8b6f352.txt","BingSiteAuth.xml","modern-v38.css","modern-v37.css","modern-v35.css","modern-v34.css","modern-v32.css","feedback.html","guide-blank-tiles.html","guide-scrabble-vs-wwf.html","guide-wordle-starters.html","guide-pattern-solver.html","guide-how-to-unscramble.html"
]));
const LONG = new Set(["css","js","svg","jpg","webmanifest"]);
const MIME = {
  html: "text/html;charset=UTF-8",
  css: "text/css;charset=UTF-8",
  js: "text/javascript;charset=UTF-8",
  svg: "image/svg+xml",
  jpg: "image/jpeg",
  xml: "application/xml;charset=UTF-8",
  txt: "text/plain;charset=UTF-8",
  webmanifest: "application/manifest+json"
};
const SEC = {
  "x-content-type-options": "nosniff",
  "referrer-policy": "strict-origin-when-cross-origin",
  "x-frame-options": "DENY",
  "permissions-policy": "camera=(), microphone=(), geolocation=()",
  "strict-transport-security": "max-age=31536000; includeSubDomains"
};
function mime(name) {
  const ext = name.indexOf(".") >= 0 ? name.split(".").pop() : "html";
  return MIME[ext] || "application/octet-stream";
}
function extraWords() {
  return ["qi","za","ok","hm","mm","uh","um","ew","fe","gi","gu","ko","ky","ny","po","st","te","wo","yu","zo"];
}
function headers(name, extra) {
  const ext = name.indexOf(".") >= 0 ? name.split(".").pop() : "html";
  const modern = name.indexOf("modern-v") === 0;
  const long = !modern && LONG.has(ext);
  const h = {
    "content-type": mime(name),
    "cache-control": modern ? "public, max-age=60, must-revalidate" : (long ? "public, max-age=86400" : "public, max-age=60"),
    "x-content-type-options": SEC["x-content-type-options"],
    "referrer-policy": SEC["referrer-policy"],
    "x-frame-options": SEC["x-frame-options"],
    "permissions-policy": SEC["permissions-policy"],
    "strict-transport-security": SEC["strict-transport-security"]
  };
  if (extra) {
    const keys = Object.keys(extra);
    for (let i = 0; i < keys.length; i++) h[keys[i]] = extra[keys[i]];
  }
  return h;
}
function json(obj, status) {
  return new Response(JSON.stringify(obj), {
    status: status || 200,
    headers: {
      "content-type": "application/json;charset=UTF-8",
      "cache-control": "no-store",
      "x-content-type-options": "nosniff"
    }
  });
}
function clip(s, n) {
  s = String(s || "").replace(/\s+/g, " ").trim();
  return s.length > n ? s.slice(0, n) : s;
}
async function handleFeedback(req) {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: { "access-control-allow-origin": "https://lettersunscrambler.com", "access-control-allow-methods": "POST", "access-control-allow-headers": "content-type" } });
  }
  let data = {};
  const ctype = (req.headers.get("content-type") || "").toLowerCase();
  try {
    if (ctype.indexOf("application/json") !== -1) data = await req.json();
    else {
      const fd = await req.formData();
      fd.forEach(function (v, k) { data[k] = String(v); });
    }
  } catch (e) {
    return json({ ok: false, error: "bad_body" }, 400);
  }
  if (clip(data.company, 80)) return json({ ok: true });
  const message = clip(data.message, 4000);
  if (message.length < 8) return json({ ok: false, error: "message" }, 400);
  const kind = clip(data.kind, 32) || "other";
  const rating = clip(data.rating, 2);
  const email = clip(data.email, 120);
  const path = clip(data.path, 180);
  const payload = {
    _subject: "Word Unscrambler feedback (" + kind + ")",
    _template: "table",
    _captcha: "false",
    kind: kind,
    rating: rating || "unrated",
    message: message,
    email: email || "(none)",
    path: path || "/",
    sent_at: new Date().toISOString()
  };
  try {
    const r = await fetch("https://formsubmit.co/ajax/" + FEEDBACK_TO, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "accept": "application/json",
        "origin": "https://lettersunscrambler.com",
        "referer": "https://lettersunscrambler.com/feedback"
      },
      body: JSON.stringify(payload)
    });
    const text = await r.text();
    let body = null;
    try { body = JSON.parse(text); } catch (e) {}
    if (r.ok || (body && (body.success === true || body.ok === true))) return json({ ok: true });
    if (body && /confirm|activat/i.test(String(body.message || ""))) {
      return json({ ok: false, error: "activate", detail: body.message }, 502);
    }
  } catch (e) {}
  return json({ ok: false, error: "delivery" }, 502);
}
async function dictionary() {
  const r = await fetch(DICT, { cf: { cacheTtl: 86400, cacheEverything: true } });
  if (!r.ok) return new Response("dictionary unavailable", { status: 502 });
  const text = await r.text();
  const extra = extraWords().join("\n");
  return new Response(text.trimEnd() + "\n" + extra + "\n", {
    headers: {
      "content-type": "text/plain;charset=UTF-8",
      "cache-control": "public, max-age=86400",
      "access-control-allow-origin": "*"
    }
  });
}
async function pull(name) {
  const ext = name.indexOf(".") >= 0 ? name.split(".").pop() : "html";
  const modern = name.indexOf("modern-v") === 0;
  const isHtml = ext === "html" || name.indexOf(".") === -1;
  const preferMain = modern || isHtml || name === "sitemap.xml" || name === "robots.txt" || name === "app.js" || name === "styles.css";
  const ttl = preferMain ? 60 : (LONG.has(ext) ? 86400 : 120);
  const srcs = preferMain ? [GH_MAIN + name, GH + name] : [GH + name, GH_MAIN + name];
  for (let s = 0; s < srcs.length; s++) {
    for (let i = 0; i < 2; i++) {
      try {
        const r = await fetch(srcs[s], { cf: { cacheTtl: ttl } });
        if (r.ok) {
          const buf = await r.arrayBuffer();
          if (buf.byteLength > 20) return buf;
        }
      } catch (e) {}
    }
  }
  return null;
}
function injectModern(htmlBuf) {
  let out = new TextDecoder().decode(htmlBuf);
  if (out.indexOf("modern-v38.css") === -1) {
    out = out.replace(/<link rel="stylesheet" href="\/modern-v3[0-9]\.css\?v=[0-9]+" \/>\n?/g, "");
    const link = '<link rel="stylesheet" href="/modern-v38.css?v=38" />';
    if (out.indexOf("</head>") !== -1) out = out.replace("</head>", link + "\n</head>");
    else if (out.indexOf("<head>") !== -1) out = out.replace("<head>", "<head>\n" + link);
  }
  if (out.indexOf('src="/stage.jpg"') !== -1 && out.indexOf('href="/stage.jpg"') === -1) {
    const pre = '<link rel="preload" href="/stage.jpg" as="image" fetchpriority="high" />';
    if (out.indexOf("</head>") !== -1) out = out.replace("</head>", pre + "\n</head>");
  }
  if (out.indexOf("application/ld+json") === -1 && out.indexOf("</head>") !== -1) {
    const schema = '<script type="application/ld+json">{"@context":"https://schema.org","@graph":[{"@type":"WebSite","name":"Word Unscrambler","url":"https://lettersunscrambler.com/","inLanguage":"en-GB","publisher":{"@id":"https://lettersunscrambler.com/#org"},"potentialAction":{"@type":"SearchAction","target":{"@type":"EntryPoint","urlTemplate":"https://lettersunscrambler.com/?q={search_term_string}"},"query-input":"required name=search_term_string"}},{"@type":"Organization","@id":"https://lettersunscrambler.com/#org","name":"Word Unscrambler","legalName":"HDK Distribution Ltd","url":"https://lettersunscrambler.com/","logo":{"@type":"ImageObject","url":"https://lettersunscrambler.com/og.jpg"},"address":{"@type":"PostalAddress","addressCountry":"GB"}}]}</script>';
    out = out.replace("</head>", schema + "\n</head>");
  }
  if (out.indexOf('href="/feedback"') === -1 && out.indexOf('href="/contact">Contact</a>') !== -1) {
    out = out.replace('<a href="/contact">Contact</a>', '<a href="/feedback">Feedback</a>\n        <a href="/contact">Contact</a>');
  }
  if (out.indexOf("has-consent") === -1 && out.indexOf('KEY = "wu_consent"') !== -1) {
    out = out.replace(
      'bar.className = "consent";',
      'document.body.classList.add("has-consent"); bar.className = "consent";'
    );
    out = out.replace(
      'bar.remove();',
      'document.body.classList.remove("has-consent"); bar.remove();'
    );
  }
  return new TextEncoder().encode(out).buffer;
}
export default {
  async fetch(req) {
    const url = new URL(req.url);
    if (url.hostname !== CANONICAL_HOST) {
      url.hostname = CANONICAL_HOST;
      url.protocol = "https:";
      url.port = "";
      return Response.redirect(url.toString(), 301);
    }
    let p = url.pathname;
    if (p === "/favicon.ico") p = "/favicon.svg";
    if (p.length > 1 && p.charAt(p.length - 1) === "/") p = p.slice(0, -1);
    if (p === "/feedback" && (req.method === "POST" || req.method === "OPTIONS")) return handleFeedback(req);
    if (p === "/words.txt") return dictionary();
    let name = ROUTES[p];
    if (!name && p.charAt(0) === "/" && ALLOW.has(p.slice(1))) name = p.slice(1);
    if (!name) {
      const miss = await pull("404.html");
      return new Response(miss || "Not found", { status: 404, headers: { "content-type": "text/html;charset=UTF-8", "cache-control": "no-store" } });
    }
    let buf = await pull(name);
    if (!buf) {
      const miss = await pull("404.html");
      return new Response(miss || "Not found", { status: 404, headers: { "content-type": "text/html;charset=UTF-8", "cache-control": "no-store" } });
    }
    const isHtml = name.indexOf(".") === -1 || name.slice(-5) === ".html";
    if (isHtml) buf = injectModern(buf);
    return new Response(buf, {
      headers: headers(name, (url.searchParams.has("q") || url.searchParams.has("mode"))
        ? { "x-robots-tag": "noindex, follow" }
        : undefined)
    });
  }
};
