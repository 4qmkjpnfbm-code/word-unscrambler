(function () {
  function $(id) { return document.getElementById(id); }
  function hide() {
    var n = $("adAfterResults");
    if (n) n.hidden = true;
  }
  function show() {
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
  var box = $("results");
  if (!box) return;
  var mo = new MutationObserver(function () {
    if (box.classList.contains("empty")) hide();
    else {
      var n = box.querySelectorAll(".word").length;
      if (n) { show(); track(n); }
    }
  });
  mo.observe(box, { childList: true, subtree: true, attributes: true, attributeFilter: ["class"] });
})();
