(function () {
  function $(id) { return document.getElementById(id); }

  function fill(root) {
    var scope = root || document;
    var list = scope.querySelectorAll ? scope.querySelectorAll("ins.adsbygoogle") : [];
    list.forEach(function (ins) {
      if (ins.getAttribute("data-adsbygoogle-status")) return;
      try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch (e) {}
    });
  }

  function hideUnfilled() {
    document.querySelectorAll(".ad-region").forEach(function (n) {
      if (n.hidden) return;
      if (n.querySelector("iframe")) return;
      n.hidden = true;
    });
  }

  function hideAfter() {
    var n = $("adAfterResults");
    if (n) n.hidden = true;
    document.body.classList.remove("has-results");
  }

  function showAfter() {
    document.body.classList.add("has-results");
    var n = $("adAfterResults");
    if (!n) return;
    n.hidden = false;
    fill(n);
    setTimeout(hideUnfilled, 4000);
  }

  var sent = false;
  function track(n) {
    if (sent || !n) return;
    sent = true;
    try {
      if (typeof gtag === "function") gtag("event", "solve", { event_category: "tool", value: n });
    } catch (e) {}
  }

  function ensureRefine() {
    if ($("refineBtn")) return;
    var modes = document.querySelector(".stage-tool .modes");
    if (!modes) return;
    var btn = document.createElement("button");
    btn.type = "button";
    btn.id = "refineBtn";
    btn.className = "refine-btn";
    btn.setAttribute("aria-pressed", "false");
    btn.textContent = "Refine length & filters";
    btn.addEventListener("click", function () {
      var on = document.body.classList.toggle("is-refine");
      btn.setAttribute("aria-pressed", on ? "true" : "false");
      btn.textContent = on ? "Hide filters" : "Refine length & filters";
    });
    modes.after(btn);
  }

  fill(document);
  setTimeout(hideUnfilled, 4000);

  var box = $("results");
  if (!box) return;
  ensureRefine();
  var mo = new MutationObserver(function () {
    if (box.classList.contains("empty")) hideAfter();
    else {
      var n = box.querySelectorAll(".word").length;
      if (n) { showAfter(); track(n); }
      else hideAfter();
    }
  });
  mo.observe(box, { childList: true, subtree: true, attributes: true, attributeFilter: ["class"] });
  if (!box.classList.contains("empty") && box.querySelectorAll(".word").length) showAfter();
})();
