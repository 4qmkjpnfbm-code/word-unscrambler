/** One hop to the final path. Trailing slashes, .html copies and retired URLs. */

export function prettyMap(routes) {
  const pretty = {};
  const keys = Object.keys(routes);
  for (let i = 0; i < keys.length; i++) {
    const file = routes[keys[i]];
    if (typeof file === "string" && file.slice(-5) === ".html") pretty["/" + file] = keys[i];
    if (keys[i] !== "/") pretty[keys[i] + ".html"] = keys[i];
  }
  return pretty;
}

export function classifyPath(pathname, gone, pretty) {
  const raw = pathname || "/";
  let path = raw;
  if (path.length > 1) path = path.replace(/\/+$/, "") || "/";
  if (path === "/404.html") return { type: "notfound" };
  const goneDest = gone[path] || gone[path.replace(/\.html$/, "")];
  if (goneDest) return { type: "redirect", location: goneDest };
  if (pretty[path]) return { type: "redirect", location: pretty[path] };
  if (path !== raw) return { type: "redirect", location: path + (raw.indexOf("?") === 0 ? "" : "") };
  return { type: "ok", path: path };
}

export function withRequestQuery(location, searchParams) {
  const dest = new URL(location, "https://lettersunscrambler.com/");
  if (searchParams && typeof searchParams.forEach === "function") {
    searchParams.forEach(function (value, key) {
      if (!dest.searchParams.has(key)) dest.searchParams.set(key, value);
    });
  }
  dest.protocol = "https:";
  dest.hostname = "lettersunscrambler.com";
  dest.port = "";
  return dest.toString();
}
