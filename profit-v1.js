(function () {
  function $(id) { return document.getElementById(id); }
  function hide() {
    var n = $("adAfterResults");
    if (n) n.hidden = true;
    document.body.classList.remove("has-results");
  }
  function show() {
    document.body.classList.add("has-results");
    var n = $("adAfterResults");
    if (!n) return;
    n.hidden = false;
    var ins = n.querySelector("ins.adsbygoogle");
    if (!ins || ins.getAttribute("data-adsbygoogle-status")) return;
    try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch (e) {}
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
  var box = $("results");
  if (!box) return;
  ensureRefine();
  var mo = new MutationObserver(function () {
    if (box.classList.contains("empty")) hide();
    else {
      var n = box.querySelectorAll(".word").length;
      if (n) { show(); track(n); }
      else hide();
    }
  });
  mo.observe(box, { childList: true, subtree: true, attributes: true, attributeFilter: ["class"] });
  if (!box.classList.contains("empty") && box.querySelectorAll(".word").length) show();
})();
