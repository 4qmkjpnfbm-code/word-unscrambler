/* Anonymous yes/no. Sends one GA4 event and nothing else. No-ops when gtag is absent. */
(function () {
  if (typeof document === "undefined" || !document.querySelector) return;
  var main = document.querySelector("main");
  if (!main || document.querySelector(".help-ask")) return;
  var box = document.createElement("section");
  box.className = "help-ask";
  box.setAttribute("aria-label", "Did this help?");
  var q = document.createElement("p");
  q.textContent = "Did this help?";
  var row = document.createElement("div");
  ["yes", "no"].forEach(function (answer) {
    var btn = document.createElement("button");
    btn.type = "button";
    btn.setAttribute("data-help", answer);
    btn.textContent = answer === "yes" ? "Yes" : "No";
    row.appendChild(btn);
  });
  var thanks = document.createElement("p");
  thanks.className = "help-thanks";
  thanks.hidden = true;
  thanks.textContent = "Thanks. That’s anonymous.";
  box.appendChild(q);
  box.appendChild(row);
  box.appendChild(thanks);
  main.appendChild(box);
  box.addEventListener("click", function (e) {
    var btn = e.target.closest ? e.target.closest("button[data-help]") : null;
    if (!btn || box.getAttribute("data-sent") === "1") return;
    var answer = btn.getAttribute("data-help") === "yes" ? "yes" : "no";
    box.setAttribute("data-sent", "1");
    if (typeof gtag === "function") {
      gtag("event", "helpfulness", {
        help_answer: answer,
        page_path: location.pathname
      });
    }
    thanks.hidden = false;
    row.querySelectorAll("button").forEach(function (b) { b.disabled = true; });
  });
})();
