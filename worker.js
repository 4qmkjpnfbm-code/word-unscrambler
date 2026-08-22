const GH = "https://raw.githubusercontent.com/4qmkjpnfbm-code/word-unscrambler/2f04d69a534762d85c82a422577a1e46c4c4f21c/";
const GH_MAIN = "https://raw.githubusercontent.com/4qmkjpnfbm-code/word-unscrambler/main/";
const CANONICAL_HOST = "lettersunscrambler.com";
const DICT = "https://raw.githubusercontent.com/dolph/dictionary/master/enable1.txt";
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
  "styles.css","app.js","favicon.svg","og.jpg","stage.jpg","wood.jpg","robots.txt","sitemap.xml","404.html","ads.txt","manifest.webmanifest","llms.txt","llms-full.txt","b7e4c91a0f3d68e25a14c0b9d8e7f612.txt","8d7c4a91b2e05f63c1a47d90e8b6f352.txt","BingSiteAuth.xml","modern-v34.css","modern-v32.css"
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
  const ext = name.includes(".") ? name.split(".").pop() : "html";
  return MIME[ext] || "application/octet-stream";
}
function extraWords() {
  return ["qi","za","ok","hm","mm","uh","um","ew","fe","gi","gu","ko","ky","ny","po","st","te","wo","yu","zo"];
}
function headers(name, extra) {
  const ext = name.includes(".") ? name.split(".").pop() : "html";
  const long = LONG.has(ext);
  return {
    "content-type": mime(name),
    "cache-control": long ? "public, max-age=86400" : "public, max-age=60",
    ...SEC,
    ...(extra || {})
  };
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
      "access-control-allow-origin": "*",
      ...SEC
    }
  });
}
async function pull(name) {
  const ext = name.includes(".") ? name.split(".").pop() : "html";
  const modern = name === "modern-v34.css" || name === "modern-v32.css";
  const ttl = modern ? 60 : (LONG.has(ext) ? 86400 : 120);
  const srcs = modern
    ? [GH_MAIN + name, GH + name]
    : [GH + name, GH_MAIN + name];
  for (const src of srcs) {
    for (let i = 0; i < 2; i++) {
      try {
        const r = await fetch(src, { cf: { cacheTtl: ttl } });
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
  const text = new TextDecoder().decode(htmlBuf);
  if (text.includes("modern-v34.css")) return htmlBuf;
  const link = '<link rel="stylesheet" href="/modern-v34.css?v=34" />';
  let out = text;
  if (out.includes("</head>")) {
    out = out.replace("</head>", link + "\n</head>");
  } else if (out.includes("<head>")) {
    out = out.replace("<head>", "<head>\n" + link);
  }
  return new TextEncoder().encode(out).buffer;
}
export default {
  async fetch(req, env, ctx) {
    const url = new URL(req.url);
    if (url.hostname !== CANONICAL_HOST) {
      url.hostname = CANONICAL_HOST;
      url.protocol = "https:";
      url.port = "";
      return Response.redirect(url.toString(), 301);
    }
    let p = url.pathname;
    if (p === "/favicon.ico") p = "/favicon.svg";
    if (p.length > 1 && p.endsWith("/")) p = p.slice(0, -1);
    if (p === "/words.txt") return dictionary();
    let name = ROUTES[p];
    if (!name && p.startsWith("/") && ALLOW.has(p.slice(1))) name = p.slice(1);
    if (!name) {
      const miss = await pull("404.html");
      return new Response(miss || "Not found", {
        status: 404,
        headers: { "content-type": "text/html;charset=UTF-8", "cache-control": "no-store", ...SEC }
      });
    }
    let buf = await pull(name);
    if (!buf) {
      const miss = await pull("404.html");
      return new Response(miss || "Not found", {
        status: 404,
        headers: { "content-type": "text/html;charset=UTF-8", "cache-control": "no-store", ...SEC }
      });
    }
    const isHtml = !(name.includes(".")) || name.endsWith(".html");
    if (isHtml) buf = injectModern(buf);
    return new Response(buf, {
      headers: headers(name, (url.searchParams.has("q") || url.searchParams.has("mode"))
        ? { "x-robots-tag": "noindex, follow" }
        : undefined)
    });
  }
};
