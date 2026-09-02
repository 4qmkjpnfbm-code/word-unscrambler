export const CANONICAL_HOST = "lettersunscrambler.com";
export const FEEDBACK_TO = "hdkdistributionltd@gmail.com";
export const EXTRA_WORDS = [
  "qi", "za", "ok", "hm", "mm", "uh", "um", "ew", "fe", "gi", "gu",
  "ko", "ky", "ny", "po", "st", "te", "wo", "yu", "zo"
];

export const CSP =
  "default-src 'self'; " +
  "script-src 'self' 'unsafe-inline' https://pagead2.googlesyndication.com https://www.googletagmanager.com https://www.google.com https://www.gstatic.com https://partner.googleadservices.com https://googleads.g.doubleclick.net https://tpc.googlesyndication.com https://adservice.google.com; " +
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
  "font-src 'self' https://fonts.gstatic.com data:; " +
  "img-src 'self' data: https:; " +
  "connect-src 'self' https://pagead2.googlesyndication.com https://www.google-analytics.com https://www.googletagmanager.com https://www.google.com https://googleads.g.doubleclick.net https://region1.google-analytics.com https://www.gstatic.com; " +
  "frame-src https://googleads.g.doubleclick.net https://tpc.googlesyndication.com https://www.google.com https://pagead2.googlesyndication.com; " +
  "frame-ancestors 'none'; form-action 'self'; base-uri 'self'; object-src 'none'";

const LONG = new Set(["css", "js", "svg", "jpg", "webmanifest", "gz"]);
const MIME = {
  html: "text/html;charset=UTF-8",
  css: "text/css;charset=UTF-8",
  js: "text/javascript;charset=UTF-8",
  svg: "image/svg+xml",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  xml: "application/xml;charset=UTF-8",
  txt: "text/plain;charset=UTF-8",
  webmanifest: "application/manifest+json",
  gz: "application/gzip"
};

export function mimeFor(name) {
  const ext = name.includes(".") ? name.split(".").pop() : "html";
  return MIME[ext] || "application/octet-stream";
}

export function stripSlash(p) {
  if (!p) return "/";
  if (p.length > 1 && p.endsWith("/")) return p.slice(0, -1);
  return p;
}

export function hostOf(host) {
  return String(host || "").split(":")[0].toLowerCase();
}

export function isLocalHost(host) {
  const h = hostOf(host);
  return h === "localhost" || h === "127.0.0.1" || h === "[::1]";
}

export function isCanonicalHost(host) {
  return hostOf(host) === CANONICAL_HOST;
}

/**
 * Map a request pathname to a file under public/.
 * Generic rules cover every current money page; special cases keep live aliases.
 */
export function resolveAsset(pathname) {
  let p = stripSlash(pathname || "/");
  if (p === "/favicon.ico") return { file: "favicon.svg", status: 200 };
  if (p === "/apple-touch-icon.png" || p === "/apple-touch-icon-precomposed.png") {
    return { file: "og.jpg", status: 200 };
  }
  if (p === "/.well-known/llms.txt") return { file: "llms.txt", status: 200 };
  if (p === "/.well-known/security.txt" || p === "/security.txt") {
    return { file: "security.txt", status: 200 };
  }
  if (p === "/") return { file: "index.html", status: 200 };

  const rest = p.slice(1);
  if (!rest) return { file: "index.html", status: 200 };

  if (rest.startsWith("unscramble/") && rest.split("/").length === 2) {
    const x = rest.split("/")[1];
    if (x && !x.includes(".")) return { file: "unscramble-" + x + ".html", status: 200, checkExists: true };
  }
  if (rest.startsWith("guides/") && rest.split("/").length === 2) {
    const x = rest.split("/")[1];
    if (x && !x.includes(".")) return { file: "guide-" + x + ".html", status: 200, checkExists: true };
  }
  if (!rest.includes("/")) {
    if (rest.includes(".")) return { file: rest, status: 200, checkExists: true };
    return { file: rest + ".html", status: 200, checkExists: true };
  }
  return { file: "404.html", status: 404 };
}

export function securityHeaders(name, extra) {
  const ext = name.includes(".") ? name.split(".").pop() : "html";
  const isHtml = ext === "html";
  const modern = name.indexOf("modern-v") === 0;
  const long = !modern && LONG.has(ext);
  const h = {
    "content-type": mimeFor(name),
    "cache-control": modern
      ? "public, max-age=60, must-revalidate"
      : long
        ? "public, max-age=86400"
        : "public, max-age=60",
    "x-content-type-options": "nosniff",
    "referrer-policy": "strict-origin-when-cross-origin",
    "x-frame-options": "DENY",
    "permissions-policy": "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()",
    "strict-transport-security": "max-age=31536000; includeSubDomains"
  };
  if (isHtml) {
    h["content-security-policy"] = CSP;
    h["cross-origin-opener-policy"] = "same-origin";
  }
  if (extra) Object.assign(h, extra);
  return h;
}

export function noindexIfQuery(url) {
  const q = url.searchParams;
  if (q.has("q") || q.has("mode") || q.has("starts") || q.has("ends") || q.has("contains") || q.has("len")) {
    return { "x-robots-tag": "noindex, follow" };
  }
  return undefined;
}

export function isHuman(value) {
  if (value === true) return true;
  const s = String(value == null ? "" : value).toLowerCase();
  return s === "true" || s === "on" || s === "1";
}

export function clip(s, n) {
  s = String(s || "").replace(/\s+/g, " ").trim();
  return s.length > n ? s.slice(0, n) : s;
}

export function mergeExtras(text) {
  const lines = String(text || "").replace(/\r\n/g, "\n").split("\n");
  const have = new Set(lines.map((w) => w.trim().toLowerCase()).filter(Boolean));
  const add = [];
  for (const w of EXTRA_WORDS) {
    if (!have.has(w)) add.push(w);
  }
  let out = String(text || "").replace(/\s+$/, "");
  if (add.length) out += (out ? "\n" : "") + add.join("\n");
  return out.endsWith("\n") ? out : out + "\n";
}

export function json(obj, status) {
  return new Response(JSON.stringify(obj), {
    status: status || 200,
    headers: {
      "content-type": "application/json;charset=UTF-8",
      "cache-control": "no-store",
      "x-content-type-options": "nosniff"
    }
  });
}

async function overRate(ip) {
  try {
    if (typeof caches === "undefined") return false;
    const cache = await caches.open("fb-rl");
    const key = new Request("https://lettersunscrambler.com/__rl/" + encodeURIComponent(ip || "0"));
    const hit = await cache.match(key);
    let n = 0;
    if (hit) n = parseInt(await hit.text(), 10) || 0;
    if (n >= 5) return true;
    await cache.put(
      key,
      new Response(String(n + 1), { headers: { "cache-control": "max-age=3600" } })
    );
    return false;
  } catch {
    return false;
  }
}

export async function handleFeedback(req) {
  const allow = {
    "access-control-allow-origin": "https://lettersunscrambler.com",
    "access-control-allow-methods": "POST, OPTIONS",
    "access-control-allow-headers": "content-type, accept"
  };
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: allow });
  }
  const origin = req.headers.get("origin") || "";
  if (origin !== "https://lettersunscrambler.com") {
    return json({ ok: false, error: "origin" }, 403);
  }
  let data = {};
  const ctype = (req.headers.get("content-type") || "").toLowerCase();
  try {
    if (ctype.indexOf("application/json") !== -1) data = await req.json();
    else {
      const fd = await req.formData();
      fd.forEach(function (v, k) { data[k] = String(v); });
    }
  } catch {
    return json({ ok: false, error: "bad_body" }, 400);
  }
  if (clip(data.company, 80)) return json({ ok: true });
  if (!isHuman(data.human)) return json({ ok: false, error: "human" }, 400);
  const message = clip(data.message, 4000);
  if (message.length < 8) return json({ ok: false, error: "message" }, 400);
  const ip = req.headers.get("cf-connecting-ip") || req.headers.get("x-forwarded-for") || "0";
  if (await overRate(ip)) return json({ ok: false, error: "rate" }, 429);

  const kind = clip(data.kind, 32) || "other";
  const rating = clip(data.rating, 2);
  const email = clip(data.email, 120);
  const path = clip(data.path, 180);
  const payload = {
    _subject: "Word Unscrambler feedback (" + kind + ")",
    _template: "table",
    _captcha: "false",
    kind,
    rating: rating || "unrated",
    message,
    email: email || "(none)",
    path: path || "/",
    human: true,
    sent_at: new Date().toISOString()
  };
  try {
    const r = await fetch("https://formsubmit.co/ajax/" + FEEDBACK_TO, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        accept: "application/json",
        origin: "https://lettersunscrambler.com",
        referer: "https://lettersunscrambler.com/feedback"
      },
      body: JSON.stringify(payload)
    });
    const text = await r.text();
    let body = null;
    try { body = JSON.parse(text); } catch { /* ignore */ }
    if (r.ok || (body && (body.success === true || body.ok === true))) return json({ ok: true });
    if (body && /confirm|activat/i.test(String(body.message || ""))) {
      return json({ ok: false, error: "activate", detail: body.message }, 502);
    }
  } catch { /* delivery */ }
  return json({ ok: false, error: "delivery" }, 502);
}
