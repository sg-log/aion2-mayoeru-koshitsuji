"use strict";
(() => {
  const search = document.getElementById("query");
  const notesEl = document.getElementById("notes");
  const countEl = document.getElementById("resultCount");
  const empty = document.getElementById("empty");
  const categoryButtons = [...document.querySelectorAll("[data-cat]")];
  const Search = globalThis.AionSearch;
  let records = [];
  let category = "";
  function element(tag, className, value) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (value !== undefined) node.textContent = value;
    return node;
  }
  function updateUrl() {
    const url = new URL(location.href);
    const query = search.value.trim();
    if (query) url.searchParams.set("q", query);
    else url.searchParams.delete("q");
    history.replaceState(null, "", url);
  }
  function render() {
    const visible = records.filter((record) =>
      (!category || record.category === category) && Search.matches(record, search.value)
    );
    notesEl.replaceChildren();
    countEl.textContent = visible.length + " 件";
    empty.hidden = visible.length !== 0;
    empty.textContent = records.length
      ? "該当するメモはありません。別の言葉でも探してみてね。"
      : "公開準備中です。確認できた情報から少しずつ増やします。";
    for (const record of visible) {
      const card = element("a", "note");
      card.href = "./note.html?id=" + encodeURIComponent(record.id);
      card.append(
        element("span", "tag", Search.labels[record.category] || "メモ"),
        element("strong", "", record.title),
        element("p", "", record.summary)
      );
      notesEl.append(card);
    }
  }
  categoryButtons.forEach((button) => button.addEventListener("click", () => {
    category = category === button.dataset.cat ? "" : button.dataset.cat;
    categoryButtons.forEach((item) =>
      item.setAttribute("aria-pressed", String(item.dataset.cat === category))
    );
    render();
    document.getElementById("results").scrollIntoView({ behavior: "smooth", block: "start" });
  }));
  document.querySelectorAll("[data-query]").forEach((button) => button.addEventListener("click", () => {
    category = "";
    categoryButtons.forEach((item) => item.setAttribute("aria-pressed", "false"));
    search.value = button.dataset.query;
    updateUrl();
    render();
    search.focus();
  }));
  search.value = new URLSearchParams(location.search).get("q") || "";
  search.addEventListener("input", () => { updateUrl(); render(); });
  fetch("./data/notes.json")
    .then((response) => { if (!response.ok) throw Error("fetch failed"); return response.json(); })
    .then((data) => {
      records = Array.isArray(data)
        ? data.filter((item) => item && item.status === "公開中") : [];
      render();
    })
    .catch(() => {
      countEl.textContent = "";
      empty.hidden = false;
      empty.textContent = "メモを読み込めませんでした。再読み込みをお試しください。";
    });
})();
