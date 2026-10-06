/**
 * Preview-only Worker for lus-redesign-preview.
 * Serves this branch's files as static assets. No production KV. No routes.
 * Ads, GA4 and the consent bar are stripped. Every response is noindex.
 */
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

function withRobots(headers) {
  const h = new Headers(headers);
  h.set("X-Robots-Tag", "noindex, nofollow");
  h.set("X-Content-Type-Options", "nosniff");
  h.set("Referrer-Policy", "strict-origin-when-cross-origin");
  h.set("X-Frame-Options", "DENY");
  return h;
}

function rewriteHtml(html) {
  let out = html.replace(/<html\b([^>]*)>/i, (full, attrs) => {
    if (/\bclass=/.test(attrs)) return full.replace(/class="([^"]*)"/, 'class="$1 preview"');
    return "<html class=\"preview\"" + attrs + ">";
  });
  if (/name="robots"/i.test(out)) {
    out = out.replace(/<meta\s+name="robots"\s+content="[^"]*"/i, '<meta name="robots" content="noindex, nofollow"');
  } else {
    out = out.replace(/<head>/i, '<head>\n  <meta name="robots" content="noindex, nofollow" />');
  }
  out = out.replace(/<link\b[^>]*>/gi, (tag) => {
    if (/googletagmanager|google-analytics|fonts\.googleapis|fonts\.gstatic|googlesyndication|pagead2|adsbygoogle/i.test(tag)) return "";
    return tag;
  });
  out = out.replace(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi, (full, attrs, body) => {
    const srcMatch = /src\s*=\s*"([^"]*)"/i.exec(attrs);
    const src = srcMatch ? srcMatch[1] : "";
    if (/googletagmanager|google-analytics|adsbygoogle|pagead2|googlesyndication/i.test(src)) return "";
    if (!src && /gtag\s*\(|wu_consent|adsbygoogle|G-VR1EE3K51N|ca-pub-2666058844257008/.test(body)) return "";
    return full;
  });
  out = out.replace(/<ins\s+class="adsbygoogle"[\s\S]*?<\/ins>/gi, '<div class="ad-ph" role="presentation"></div>');
  return out;
}

async function readAsset(request, env, pathname) {
  const assetUrl = new URL(request.url);
  assetUrl.pathname = pathname;
  assetUrl.search = "";
  return env.ASSETS.fetch(new Request(assetUrl.toString(), { method: "GET" }));
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    let path = url.pathname;
    if (path.length > 1 && path.endsWith("/")) path = path.slice(0, -1);

    if (path === "/robots.txt") {
      return new Response("User-agent: *\nDisallow: /\n", {
        headers: withRobots(new Headers({
          "content-type": "text/plain; charset=utf-8",
          "cache-control": "public, max-age=3600"
        }))
      });
    }

    if (GONE[path]) {
      return new Response(null, {
        status: 301,
        headers: withRobots(new Headers({ location: GONE[path] }))
      });
    }

    const candidates = [];
    if (ROUTES[path]) candidates.push("/" + ROUTES[path]);
    else {
      candidates.push(path);
      if (!path.endsWith(".html") && !path.includes(".")) candidates.push(path + ".html");
    }

    let response = null;
    for (const candidate of candidates) {
      const res = await readAsset(request, env, candidate);
      if (res.status !== 404) {
        response = res;
        break;
      }
    }

    if (!response) {
      const missing = await readAsset(request, env, "/404.html");
      response = new Response(missing.body, { status: 404, headers: missing.headers });
    }

    const type = response.headers.get("content-type") || "";
    const headers = withRobots(response.headers);
    if (path.endsWith(".woff2") || (response.url || "").endsWith(".woff2")) {
      headers.set("content-type", "font/woff2");
      headers.set("cache-control", "public, max-age=31536000, immutable");
    }

    if (!type.includes("text/html") && response.status !== 404) {
      return new Response(response.body, { status: response.status, headers });
    }
    if (response.status === 404 && !type.includes("text/html")) {
      return new Response(response.body, { status: 404, headers });
    }

    const html = rewriteHtml(await response.text());
    headers.delete("content-length");
    headers.delete("content-encoding");
    headers.set("content-type", "text/html; charset=utf-8");
    headers.set("cache-control", "no-cache");
    return new Response(html, { status: response.status, headers });
  }
};
