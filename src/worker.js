import {
  CANONICAL_HOST,
  isLocalHost,
  isCanonicalHost,
  resolveAsset,
  securityHeaders,
  noindexIfQuery,
  handleFeedback,
  mergeExtras
} from "./lib.js";
import { injectModern } from "./inject.js";

async function fromAssets(env, req, file) {
  const url = new URL(req.url);
  url.pathname = "/" + file;
  url.search = "";
  return env.ASSETS.fetch(new Request(url.toString(), { method: "GET" }));
}

export default {
  async fetch(req, env) {
    const url = new URL(req.url);
    const host = url.hostname;
    if (!isLocalHost(host) && !isCanonicalHost(host)) {
      url.hostname = CANONICAL_HOST;
      url.protocol = "https:";
      url.port = "";
      return Response.redirect(url.toString(), 301);
    }

    const p = url.pathname;
    if ((p === "/feedback" || p === "/feedback/") && (req.method === "POST" || req.method === "OPTIONS")) {
      return handleFeedback(req);
    }

    if (p === "/words.txt" || p === "/words.txt/") {
      const r = await fromAssets(env, req, "words.txt");
      if (!r.ok) return new Response("dictionary unavailable", { status: 502 });
      const merged = mergeExtras(await r.text());
      return new Response(merged, {
        headers: securityHeaders("words.txt", { "access-control-allow-origin": "*" })
      });
    }

    const mapped = resolveAsset(p);
    let file = mapped.file;
    let status = mapped.status;
    let asset = await fromAssets(env, req, file);
    if (!asset.ok) {
      file = "404.html";
      status = 404;
      asset = await fromAssets(env, req, file);
    }

    let body = await asset.arrayBuffer();
    const isHtml = file.endsWith(".html");
    if (isHtml && status === 200) body = injectModern(body);

    const extra = noindexIfQuery(url);
    const headers = securityHeaders(file, extra);
    if (status === 404) headers["cache-control"] = "no-store";
    return new Response(body, { status, headers });
  }
};
