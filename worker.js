const GH = "https://raw.githubusercontent.com/4qmkjpnfbm-code/word-unscrambler/0f324f48a55064ad68204914e1b4300a89c7e759/";
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
  "/how-it-works": "how-it-works.html",
  "/guides/blank-tiles": "guide-blank-tiles.html",
  "/guides/scrabble-vs-wwf": "guide-scrabble-vs-wwf.html",
  "/guides/wordle-starters": "guide-wordle-starters.html",
  "/guides/pattern-solver": "guide-pattern-solver.html",
  "/guides/how-to-unscramble": "guide-how-to-unscramble.html",
  "/word-lists": "word-lists.html",
  "/words-starting-with": "words-starting-with.html",
  "/words-ending-with": "words-ending-with.html",
  "/5-letter-words-starting-with": "5-letter-words-starting-with.html",
  "/word-checker": "word-checker.html",
  "/words-containing": "words-containing.html",
  "/spelling-bee": "spelling-bee.html",
  "/word-generator": "word-generator.html",
  "/letter-boxed": "letter-boxed.html",
  "/text-twist-solver": "text-twist-solver.html",
  "/hangman-solver": "hangman-solver.html",
  "/word-ladder-solver": "word-ladder-solver.html",
  "/is-it-a-word": "is-it-a-word.html",
  "/2-letter-words": "2-letter-words.html",
  "/3-letter-words": "3-letter-words.html",
  "/4-letter-words": "4-letter-words.html",
  "/5-letter-words": "5-letter-words.html",
  "/6-letter-words": "6-letter-words.html",
  "/7-letter-words": "7-letter-words.html",
  "/8-letter-words": "8-letter-words.html",
  "/9-letter-words": "9-letter-words.html",
  "/10-letter-words": "10-letter-words.html",
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
  "/unscramble/eagle": "unscramble-eagle.html",
  "/unscramble/airbag": "unscramble-airbag.html",
  "/unscramble/pallet": "unscramble-pallet.html",
  "/llms.txt": "llms.txt",
  "/llms-full.txt": "llms-full.txt",
  "/.well-known/llms.txt": "llms.txt",
  "/.well-known/security.txt": "security.txt",
  "/security.txt": "security.txt"
};
const GONE = {
  "/words-from-letters": "/",
  "/word-descrambler": "/",
  "/letter-unscrambler": "/",
  "/letters-unscrambler": "/",
  "/word-maker": "/",
  "/unjumble": "/jumble-solver",
  "/word-mix-up-solver": "/jumble-solver",
  "/word-solver": "/crossword-solver",
  "/3-letter-unscrambler": "/3-letter-words",
  "/4-letter-unscrambler": "/4-letter-words",
  "/7-letter-unscrambler": "/7-letter-words",
  "/8-letter-unscrambler": "/8-letter-words",
  "/10-letter-unscrambler": "/10-letter-words",
  "/unscramble/train": "/?q=TRAIN",
  "/unscramble/earth": "/?q=EARTH",
  "/unscramble/adobe": "/?q=ADOBE",
  "/unscramble/race": "/?q=RACE",
  "/unscramble/retina": "/?q=RETINA",
  "/unscramble/orange": "/?q=ORANGE",
  "/unscramble/stressed": "/?q=STRESSED",
  "/unscramble/master": "/?q=MASTER",
  "/unscramble/planet": "/?q=PLANET",
  "/unscramble/credit": "/?q=CREDIT",
  "/unscramble/friend": "/?q=FRIEND",
  "/word-scrambler": "/jumble-solver",
  "/multiple-word-unscrambler": "/jumble-solver"
};
const ALLOW = new Set(Object.values(ROUTES).concat([
  "styles.css","app.js","favicon.svg","og.jpg","stage.jpg","stage.webp","stage.avif","wood.jpg","robots.txt","sitemap.xml","404.html","ads.txt","manifest.webmanifest","llms.txt","llms-full.txt","b7e4c91a0f3d68e25a14c0b9d8e7f612.txt","8d7c4a91b2e05f63c1a47d90e8b6f352.txt","BingSiteAuth.xml","modern-v38.css","modern-v39.css","modern-v40.css","modern-v41.css","modern-v42.css","modern-v37.css","modern-v35.css","modern-v34.css","modern-v32.css","fonts/roboto-400.woff2","fonts/roboto-500.woff2","fonts/roboto-700.woff2","img/listen-hero.avif","img/listen-hero.webp","daily-share.js","word-ladder.js","word-ladder-solver.html","profit-v1.js","feedback.html","guide-blank-tiles.html","guide-scrabble-vs-wwf.html","guide-wordle-starters.html","guide-pattern-solver.html","guide-how-to-unscramble.html","security.txt","unscramble-eagle.html","unscramble-airbag.html","unscramble-pallet.html"
]));
const LONG = new Set(["css","js","svg","jpg","webp","avif","webmanifest","woff2"]);
const MIME = {
  html: "text/html;charset=UTF-8",
  css: "text/css;charset=UTF-8",
  js: "text/javascript;charset=UTF-8",
  svg: "image/svg+xml",
  jpg: "image/jpeg",
  webp: "image/webp",
  avif: "image/avif",
  woff2: "font/woff2",
  xml: "application/xml;charset=UTF-8",
  txt: "text/plain;charset=UTF-8",
  webmanifest: "application/manifest+json"
};
const SEC = {
  "x-content-type-options": "nosniff",
  "referrer-policy": "strict-origin-when-cross-origin",
  "x-frame-options": "DENY",
  "permissions-policy": "camera=(), microphone=(), geolocation=(), payment=(), usb=(), midi=(), gyroscope=(), accelerometer=(), magnetometer=(), xr-spatial-tracking=()",
  "strict-transport-security": "max-age=31536000; includeSubDomains"
};
// Security 2026-10-06: CSP is Report-Only (logs, never blocks) so AdSense / Funding Choices / GA cannot break
// if Google adds a host. Promote to an enforced Content-Security-Policy only after a clean report period.
const CSP_REPORT_ONLY = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://pagead2.googlesyndication.com https://www.googletagservices.com https://partner.googleadservices.com https://adservice.google.com https://www.google.com https://www.gstatic.com https://fundingchoicesmessages.google.com https://ep1.adtrafficquality.google https://ep2.adtrafficquality.google https://tpc.googlesyndication.com https://static.cloudflareinsights.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://www.gstatic.com",
  "img-src 'self' data: https:",
  "font-src 'self' data: https://fonts.gstatic.com https://www.gstatic.com",
  "connect-src 'self' https://www.googletagmanager.com https://www.google-analytics.com https://analytics.google.com https://region1.google-analytics.com https://pagead2.googlesyndication.com https://googleads.g.doubleclick.net https://tpc.googlesyndication.com https://fundingchoicesmessages.google.com https://ep1.adtrafficquality.google https://ep2.adtrafficquality.google https://www.google.com https://www.gstatic.com https://csi.gstatic.com https://cloudflareinsights.com https://api.dictionaryapi.dev https://en.wikipedia.org https://raw.githubusercontent.com",
  "frame-src https://googleads.g.doubleclick.net https://tpc.googlesyndication.com https://www.google.com https://fundingchoicesmessages.google.com https://ep1.adtrafficquality.google https://ep2.adtrafficquality.google https://pagead2.googlesyndication.com"
].join("; ");
const ORIGIN = "https://" + CANONICAL_HOST;
function secHeaders(h) {
  h["x-content-type-options"] = SEC["x-content-type-options"];
  h["referrer-policy"] = SEC["referrer-policy"];
  h["x-frame-options"] = SEC["x-frame-options"];
  h["permissions-policy"] = SEC["permissions-policy"];
  h["strict-transport-security"] = SEC["strict-transport-security"];
  return h;
}
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
  if (mime(name).indexOf("text/html") === 0) {
    h["cross-origin-opener-policy"] = "same-origin-allow-popups";
    h["content-security-policy-report-only"] = CSP_REPORT_ONLY;
  }
  if (extra) {
    const keys = Object.keys(extra);
    for (let i = 0; i < keys.length; i++) h[keys[i]] = extra[keys[i]];
  }
  return h;
}
function json(obj, status) {
  return new Response(JSON.stringify(obj), {
    status: status || 200,
    headers: secHeaders({
      "content-type": "application/json;charset=UTF-8",
      "cache-control": "no-store"
    })
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
  // Browsers always send Origin on POST: refuse other sites posting into the feedback relay (CSRF / spam via third-party pages).
  const origin = req.headers.get("origin");
  if (origin && origin !== ORIGIN) return json({ ok: false, error: "origin" }, 403);
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
    _subject: "Letters Unscrambler feedback (" + kind + ")",
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
async function pull(name, env) {
  if (env && env.SITE) {
    try {
      const kvVal = await env.SITE.get(name, { type: "arrayBuffer" });
      if (kvVal && kvVal.byteLength > 20) return kvVal;
    } catch (e) {}
  }
  const ext = name.indexOf(".") >= 0 ? name.split(".").pop() : "html";
  const modern = name.indexOf("modern-v") === 0;
  const isHtml = ext === "html" || name.indexOf(".") === -1;
  const fresh = modern || isHtml || name === "sitemap.xml" || name === "robots.txt" || name === "profit-v1.js" || name === "app.js";
  const ttl = fresh ? 60 : (LONG.has(ext) ? 86400 : 120);
  const fromMain = name === "profit-v1.js" || name === "modern-v39.css" || name === "modern-v40.css" || name === "modern-v41.css" || name === "app.js";
  const srcs = fromMain
    ? ["https://raw.githubusercontent.com/4qmkjpnfbm-code/word-unscrambler/main/" + name + "?v=47"]
    : [GH_MAIN + name + "?v=polish3", GH + name];
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
  out = out.replace(/<meta name="twitter:site"[^>]*>\n?/g, "");
  out = out.replace(/,"sameAs":\["https:\/\/x\.com\/h4_rry2"\]/g, "");
  out = out.replace(/"sameAs":\["https:\/\/x\.com\/h4_rry2"\],/g, "");
  const redesigned = out.indexOf("modern-v42.css") !== -1;
  if (!redesigned) {
    out = out.replace(/<link rel="stylesheet" href="\/modern-v3[0-9]\.css\?v=[^"]+" \/>\n?/g, "");
    out = out.replace(/<link rel="stylesheet" href="\/modern-v40\.css\?v=[^"]+" \/>\n?/g, "");
    out = out.replace(/<link rel="stylesheet" href="\/modern-v41\.css\?v=[^"]+" \/>\n?/g, "");
  }
  out = out.replace(/<link rel="stylesheet" href="\/styles\.css\?v=[0-9]+" \/>/g, '<link rel="stylesheet" href="/styles.css?v=32" />');
  out = out.replace(/<script src="\/app\.js\?v=[0-9]+" defer><\/script>/g, '<script src="/app.js?v=27" defer></script>');
  out = out.replace('content="width=device-width, initial-scale=1"', 'content="width=device-width, initial-scale=1, viewport-fit=cover"');
  if (!redesigned && out.indexOf("modern-v41.css") === -1) {
    const link = '<link rel="stylesheet" href="/modern-v39.css?v=47" />\n  <link rel="stylesheet" href="/modern-v40.css?v=47" />\n  <link rel="stylesheet" href="/modern-v41.css?v=47" />';
    if (out.indexOf("</head>") !== -1) out = out.replace("</head>", link + "\n</head>");
    else if (out.indexOf("<head>") !== -1) out = out.replace("<head>", "<head>\n" + link);
  }
  if (out.indexOf('src="/stage.jpg"') !== -1 && out.indexOf('href="/stage.avif"') === -1 && out.indexOf('href="/stage.webp"') === -1 && out.indexOf('href="/stage.jpg"') === -1) {
    const pre = '<link rel="preload" href="/stage.avif" as="image" type="image/avif" fetchpriority="high" />';
    if (out.indexOf("</head>") !== -1) out = out.replace("</head>", pre + "\n</head>");
  }
  if (out.indexOf("application/ld+json") === -1 && out.indexOf("</head>") !== -1) {
    const schema = '<script type="application/ld+json">{"@context":"https://schema.org","@graph":[{"@type":"WebSite","name":"Letters Unscrambler","url":"https://lettersunscrambler.com/","inLanguage":"en-GB","publisher":{"@id":"https://lettersunscrambler.com/#org"},"potentialAction":{"@type":"SearchAction","target":{"@type":"EntryPoint","urlTemplate":"https://lettersunscrambler.com/?q={search_term_string}"},"query-input":"required name=search_term_string"}},{"@type":"Organization","@id":"https://lettersunscrambler.com/#org","name":"Letters Unscrambler","legalName":"HDK Distribution Ltd","url":"https://lettersunscrambler.com/","logo":{"@type":"ImageObject","url":"https://lettersunscrambler.com/og.jpg"},"address":{"@type":"PostalAddress","addressCountry":"GB"}}]}</script>';
    out = out.replace("</head>", schema + "\n</head>");
  }
  if (out.indexOf('href="/feedback"') === -1 && out.indexOf('href="/contact">Contact</a>') !== -1) {
    out = out.replace('<a href="/contact">Contact</a>', '<a href="/feedback">Feedback</a>\n        <a href="/contact">Contact</a>');
  }
  if (out.indexOf('href="/word-checker"') === -1 && out.indexOf('href="/jumble-solver">Jumble solver</a>') !== -1) {
    out = out.replace('<a href="/jumble-solver">Jumble solver</a>', '<a href="/jumble-solver">Jumble solver</a>\n        <a href="/word-checker">Word checker</a>');
  }
  if (out.indexOf('href="/words-starting-with"') === -1 && out.indexOf('href="/bingo-stems">Bingo stems</a>') !== -1) {
    out = out.replace('<a href="/bingo-stems">Bingo stems</a>', '<a href="/bingo-stems">Bingo stems</a>\n        <a href="/words-starting-with">Words starting with</a>\n        <a href="/words-ending-with">Words ending with</a>\n        <a href="/words-containing">Words containing</a>\n        <a href="/5-letter-words-starting-with">5-letter starting with</a>\n        <a href="/9-letter-words">9-letter words</a>\n        <a href="/10-letter-words">10-letter words</a>');
  }
  if (out.indexOf('href="/words-containing"') === -1 && out.indexOf('href="/words-ending-with">Words ending with</a>') !== -1) {
    out = out.replace('<a href="/words-ending-with">Words ending with</a>', '<a href="/words-ending-with">Words ending with</a>\n        <a href="/words-containing">Words containing</a>');
  }
  out = out.replace(/\s*<a href="\/word-scrambler">Word scrambler<\/a>/g, "");
  out = out.replace(/\s*<a href="\/multiple-word-unscrambler">Multiple-word unscrambler<\/a>/g, "");
  if (out.indexOf('href="/spelling-bee"') === -1 && out.indexOf('href="/word-checker">Word checker</a>') !== -1) {
    out = out.replace('<a href="/word-checker">Word checker</a>', '<a href="/word-checker">Word checker</a>\n        <a href="/spelling-bee">Spelling Bee helper</a>');
  }
  if (out.indexOf('href="/word-generator"') === -1 && out.indexOf('href="/spelling-bee">Spelling Bee helper</a>') !== -1) {
    out = out.replace('<a href="/spelling-bee">Spelling Bee helper</a>', '<a href="/spelling-bee">Spelling Bee helper</a>\n        <a href="/word-generator">Word generator</a>\n        <a href="/letter-boxed">Letter Boxed</a>\n        <a href="/7-letter-words">7-letter words</a>\n        <a href="/text-twist-solver">Text Twist solver</a>\n        <a href="/is-it-a-word">Is it a word</a>');
  }
  if (out.indexOf('href="/words-containing"') === -1 && out.indexOf('href="/bingo-stems">Bingo stems</a>') !== -1) {
    out = out.replace('<a href="/bingo-stems">Bingo stems</a>', '<a href="/bingo-stems">Bingo stems</a>\n        <a href="/words-containing">Words containing</a>');
  }
  if (out.indexOf('id="adAfterResults"') === -1 && out.indexOf('id="results"') !== -1) {
    const ad = '<aside class="ad-region ad-after-results" id="adAfterResults" hidden aria-label="Advertisement"><p class="ad-label">Advertisement</p><div class="ad-box ad-box-slim"><ins class="adsbygoogle" style="display:block;min-height:90px" data-ad-client="ca-pub-2666058844257008" data-ad-format="horizontal" data-full-width-responsive="true"></ins></div></aside>';
    out = out.replace('<div id="results" class="empty">Your words will show here.</div>', '<div id="results" class="empty">Your words will show here.</div>\n    ' + ad);
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
  // Ads and the refine button are not needed for the first paint. Load after the
  // load event so they do not sit on the main thread with the solver.
  const profitLazy = '<script>addEventListener("load",function(){if(document.querySelector("script[data-profit]"))return;var s=document.createElement("script");s.src="/profit-v1.js";s.defer=true;s.setAttribute("data-profit","1");document.body.appendChild(s);},{once:true});</script>';
  if (out.indexOf("profit-v1.js") === -1 && out.indexOf('id="results"') !== -1) {
    out = out.replace("</body>", profitLazy + "\n</body>");
  } else {
    out = out.replace(/<script src="\/profit-v1\.js"[^>]*><\/script>/g, profitLazy);
  }
  return new TextEncoder().encode(out).buffer;
}
const SEARCH_PARAMS = ["q", "mode", "starts", "ends", "contains", "len", "center"];
const SEARCH_MODES = { subset: 1, anagram: 1, wordle: 1, pattern: 1, check: 1, bee: 1, multi: 1, scramble: 1, gen: 1, boxed: 1 };
function isSearchView(url) {
  for (let i = 0; i < SEARCH_PARAMS.length; i++) if (url.searchParams.has(SEARCH_PARAMS[i])) return true;
  return false;
}
function esc(s) {
  return String(s).replace(/[&<>"']/g, function (c) {
    return c === "&" ? "&amp;" : c === "<" ? "&lt;" : c === ">" ? "&gt;" : c === '"' ? "&quot;" : "&#39;";
  });
}
function lettersMax(tool) {
  return tool === "bee" ? 7 : tool === "boxed" ? 12 : 16;
}
// Search letters from the URL: A-Z plus ? (blank) only, capped. Nothing else survives, so no markup can reach the page.
function cleanLetters(raw, tool) {
  let s = String(raw || "").slice(0, 200).toUpperCase();
  const wild = !(tool === "bee" || tool === "boxed" || tool === "gen" || tool === "scramble");
  s = wild ? s.replace(/[*_]/g, "?").replace(/[^A-Z?]/g, "") : s.replace(/[^A-Z]/g, "");
  return s.slice(0, lettersMax(tool));
}
function cleanFilter(raw, max) {
  return String(raw || "").slice(0, 100).toUpperCase().replace(/[^A-Z]/g, "").slice(0, max);
}
function searchTitle(mode, letters, base) {
  if (!letters) return base;
  if (mode === "check") return "Is " + letters + " a word? – Word checker";
  if (mode === "bee") return "Spelling Bee helper – " + letters;
  if (mode === "gen") return "Words from " + letters + " – Word generator";
  if (mode === "boxed") return "Letter Boxed – " + letters;
  if (mode === "scramble") return "Scramble " + letters + " – Word scrambler";
  return "Unscramble " + letters + " – Letters Unscrambler";
}
function nextTools(path, mode, letters) {
  const enc = encodeURIComponent(letters);
  const pattern = mode === "pattern";
  const n = pattern ? letters.length : letters.replace(/\?/g, "").length;
  const len = n >= 2 && n <= 10 ? n : 5;
  const cands = pattern
    ? [["/crossword-solver" + (letters ? "?q=" + enc : ""), "Crossword solver"], ["/hangman-solver" + (letters ? "?q=" + enc : ""), "Hangman solver"], ["/wordle-helper", "Wordle helper"], ["/word-checker", "Word checker"]]
    : [["/" + (letters ? "?q=" + enc : ""), "Word unscrambler"], ["/anagram-solver" + (letters ? "?q=" + enc : ""), "Anagram solver"], ["/wordle-helper", "Wordle helper"], ["/word-checker" + (letters && letters.indexOf("?") === -1 ? "?q=" + enc : ""), "Word checker"], ["/scrabble-word-finder" + (letters ? "?q=" + enc : ""), "Scrabble word finder"]];
  const out = [];
  for (let i = 0; i < cands.length && out.length < 3; i++) {
    if (cands[i][0].split("?")[0] === path) continue;
    out.push(cands[i]);
  }
  const lenPath = "/" + len + "-letter-words";
  if (lenPath !== path) out.push([lenPath, len + "-letter words"]);
  return out;
}
const SEARCH_CSS = '<style id="searchAgainCss">' +
  '.panel>.search-again{order:7}' +
  '.search-again{margin:14px 0 12px;padding:10px 12px;border:1px solid color-mix(in oklab,#fff 14%,transparent);border-radius:14px;background:color-mix(in oklab,#070908 24%,transparent)}' +
  '.search-again form{margin:0}' +
  '.search-again .try-label{display:block!important;margin:0 0 6px}' +
  '.search-again .input-row{display:flex!important;flex-direction:row!important;align-items:stretch!important;gap:8px!important}' +
  '.search-again .input-row input[type="text"]{flex:1 1 auto;width:auto!important;min-width:0;min-height:44px!important;text-transform:uppercase}' +
  '.search-again .primary{width:auto!important;min-height:44px!important;padding:0 18px;flex:0 0 auto}' +
  '.search-again .try-next{margin-top:10px}' +
  '.search-again .examples{display:flex!important;flex-wrap:wrap;gap:6px;margin-top:4px}' +
  '.search-again .chip{display:inline-flex;align-items:center;min-height:44px;padding:0 12px;font-size:.85rem;text-decoration:none}' +
  'html[data-theme="light"] .search-again{background:#f7f0e4;border-color:color-mix(in oklab,#1c1710 14%,transparent)}' +
  '</style>';
// Result views (?q= etc.): noindex + canonical to the clean page, prefilled letters, and a Search again / next tools block above the results.
function injectSearch(htmlBuf, url, path) {
  let out = new TextDecoder().decode(htmlBuf);
  const clean = "https://" + CANONICAL_HOST + (path === "/" ? "/" : path);
  if (/<meta name="robots"[^>]*>/i.test(out)) out = out.replace(/<meta name="robots"[^>]*>/gi, '<meta name="robots" content="noindex, follow" />');
  else out = out.replace("</head>", '<meta name="robots" content="noindex, follow" />\n</head>');
  // Every tool page already carries a canonical to its clean URL; keep it, add one only if missing.
  if (!/<link rel="canonical"[^>]*>/i.test(out)) out = out.replace("</head>", '<link rel="canonical" href="' + clean + '" />\n</head>');
  if (out.indexOf('<div id="results"') === -1) return new TextEncoder().encode(out).buffer;
  const tm = out.match(/<body[^>]*data-tool="([a-z]+)"/);
  const tool = tm ? tm[1] : "subset";
  const pm = url.searchParams.get("mode");
  const mode = pm && Object.prototype.hasOwnProperty.call(SEARCH_MODES, pm) ? pm : tool;
  const letters = cleanLetters(url.searchParams.get("q"), mode);
  const center = mode === "bee" ? cleanFilter(url.searchParams.get("center"), 1) : "";
  const hasFilter = cleanFilter(url.searchParams.get("starts"), 5) || cleanFilter(url.searchParams.get("ends"), 5) || cleanFilter(url.searchParams.get("contains"), 8);
  if (tool === "wordle" || mode === "wordle" || mode === "multi" || (!letters && !hasFilter)) return new TextEncoder().encode(out).buffer;
  out = out.replace(/<title>([^<]*)<\/title>/, function (m, base) { return "<title>" + esc(searchTitle(mode, letters, base)) + "</title>"; });
  if (letters) out = out.replace('<input id="letters" ', '<input id="letters" value="' + esc(letters) + '" ');
  const hidden = (mode !== tool ? '<input type="hidden" name="mode" value="' + esc(mode) + '" />' : "") +
    (center ? '<input type="hidden" name="center" value="' + esc(center) + '" />' : "");
  const links = nextTools(path, mode, letters).map(function (l) {
    return '<a class="chip" href="' + esc(l[0]) + '">' + esc(l[1]) + "</a>";
  }).join("");
  const block = '<div class="search-again" id="searchAgain">' +
    '<form class="search-again-form" id="searchAgainForm" role="search" action="' + esc(path) + '" method="get">' +
    '<label class="try-label" for="searchAgainInput">Search again</label>' +
    '<div class="input-row"><input id="searchAgainInput" name="q" type="text" value="' + esc(letters) + '" maxlength="' + lettersMax(mode) + '" autocomplete="off" spellcheck="false" autocapitalize="characters" enterkeyhint="search" placeholder="New letters" />' + hidden +
    '<button class="primary" type="submit">Search</button></div></form>' +
    '<nav class="try-next" aria-label="Try these tools next"><p class="try-label">Try these tools next</p><div class="examples">' + links + "</div></nav>" +
    "</div>\n    ";
  out = out.replace('<div id="results"', block + '<div id="results"');
  out = out.replace("</head>", SEARCH_CSS + "\n</head>");
  return new TextEncoder().encode(out).buffer;
}
export default {
  async fetch(req, env) {
    const url = new URL(req.url);
    if (url.hostname !== CANONICAL_HOST) {
      url.hostname = CANONICAL_HOST;
      url.protocol = "https:";
      url.port = "";
      return Response.redirect(url.toString(), 301);
    }
    let p = url.pathname;
    if (p.length > 1 && p.charAt(p.length - 1) === "/") {
      url.pathname = p.slice(0, -1);
      return Response.redirect(url.toString(), 301);
    }
    if (p === "/favicon.ico") p = "/favicon.svg";
    if (p === "/apple-touch-icon.png" || p === "/apple-touch-icon-precomposed.png") p = "/og.jpg";
    if (p === "/feedback" && (req.method === "POST" || req.method === "OPTIONS")) return handleFeedback(req);
    if (p === "/words.txt") return dictionary();
    const gone = GONE[p] || GONE[p.replace(/\.html$/, "")];
    if (gone) {
      const dest = new URL("https://" + CANONICAL_HOST + gone);
      const q = url.searchParams.get("q");
      if (q && !dest.searchParams.has("q")) dest.searchParams.set("q", q);
      return Response.redirect(dest.toString(), 301);
    }
    let name = ROUTES[p];
    if (!name && p.charAt(0) === "/" && ALLOW.has(p.slice(1))) name = p.slice(1);
    if (!name) {
      const miss = await pull("404.html", env);
      return new Response(miss || "Not found", { status: 404, headers: headers("404.html", { "cache-control": "no-store" }) });
    }
    let buf = await pull(name, env);
    if (!buf) {
      const miss = await pull("404.html", env);
      return new Response(miss || "Not found", { status: 404, headers: headers("404.html", { "cache-control": "no-store" }) });
    }
    const isHtml = name.indexOf(".") === -1 || name.slice(-5) === ".html";
    const search = isSearchView(url);
    if (isHtml) buf = injectModern(buf);
    if (isHtml && search) buf = injectSearch(buf, url, p);
    return new Response(buf, {
      headers: headers(name, search ? { "x-robots-tag": "noindex, follow" } : undefined)
    });
  }
};
