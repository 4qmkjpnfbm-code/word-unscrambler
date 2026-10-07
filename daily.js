/* Today’s scramble and the previous 14 days. Today’s answer stays off the page. */
(function () {
  if (typeof document === "undefined" || !document.getElementById("dailyList")) return;
  const DS = globalThis.DailyShare;
  if (!DS) return;
  const days = DS.recent(new Date(), 15);
  const today = days[0];
  const word = document.getElementById("dailyTodayWord");
  const meta = document.getElementById("dailyTodayMeta");
  const play = document.getElementById("dailyTodayPlay");
  if (word) word.textContent = today.scramble;
  if (meta) meta.textContent = "Daily #" + today.number + " · " + today.key;
  if (play) play.href = "/?q=" + encodeURIComponent(today.scramble) + "&mode=anagram";
  const list = document.getElementById("dailyList");
  days.slice(1).forEach(function (day) {
    const li = document.createElement("li");
    const when = document.createElement("p");
    when.className = "when";
    when.textContent = "Daily #" + day.number + " · " + day.key;
    const rack = document.createElement("p");
    rack.className = "rack";
    rack.textContent = day.scramble;
    const answer = document.createElement("p");
    answer.className = "answer";
    answer.textContent = "Answer " + day.answer;
    li.appendChild(when);
    li.appendChild(rack);
    li.appendChild(answer);
    list.appendChild(li);
  });
})();
