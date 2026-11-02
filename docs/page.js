"use strict";
(async () => {
  const root = document.getElementById("page-content");
  const mode = document.body.dataset.page;
  const Search = globalThis.AionSearch;
  const element = (tag, value, className) => {
    const node = document.createElement(tag);
    if (value !== undefined) node.textContent = value;
    if (className) node.className = className;
    return node;
  };
  const notice = (message) => root.append(element("div", message, "notice"));
  try {
    const response = await fetch("./data/notes.json");
    if (!response.ok) throw Error("fetch failed");
    const raw = await response.json();
    if (!Array.isArray(raw)) throw Error("invalid data");
    const articles = raw.filter((entry) => entry && entry.status === "公開中");
    if (mode === "daily" || mode === "weekly") {
      const selected = articles.filter((entry) => entry.category === mode);
      selected.sort((a, b) => {
        const rank = { "最優先": 0, "高": 1, "中": 2 };
        return (rank[a.importance] ?? 9) - (rank[b.importance] ?? 9);
      });
      if (!selected.length) {
        notice("このページの情報は確認中です。公開できる内容がそろい次第、追加します。");
      } else {
        const list = element("div", undefined, "routine-list");
        for (const item of selected) {
          const card = element("a", undefined, "routine-entry");
          card.href = "./note.html?id=" + encodeURIComponent(item.id);
          if (item.importance) card.append(element("span", item.importance, "tag"));
          card.append(element("strong", item.title), element("p", item.summary));
          list.append(card);
        }
        root.append(list);
      }
      return;
    }
    const id = new URLSearchParams(location.search).get("id");
    const entry = articles.find((item) => item.id === id);
    if (!entry) {
      document.getElementById("title").textContent = "記事が見つかりません";
      notice("公開が終了したか、URLが違う可能性があります。トップページから検索してください。");
      return;
    }
    document.title = entry.title + " | AION2 まよえるこしつじ";
    document.getElementById("title").textContent = entry.title;
    document.getElementById("kind").textContent = Search.labels[entry.category] || "メモ";
    root.append(element("div", entry.summary, "notice"));
    if (entry.importance) root.append(element("p", "重要度：" + entry.importance, "mini"));
    if (entry.details && entry.details.length) {
      root.append(element("h2", "もう少し詳しく"));
      const list = element("ul");
      for (const line of entry.details) list.append(element("li", line));
      root.append(list);
    }
    if (entry.caution) {
      root.append(element("h2", "気をつけること"));
      root.append(element("p", entry.caution));
    }
    if (entry.sources && entry.sources.length) {
      root.append(element("h2", "出典"));
      for (const source of entry.sources) {
        const p = element("p", undefined, "source-item");
        const a = element("a", source.label);
        a.href = source.url;
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        p.append(a);
        root.append(p);
      }
    }
    root.append(element("p", "確認日：" + entry.checked_at, "mini"));
  } catch (error) {
    notice("情報を読み込めませんでした。再読み込みをお試しください。");
    const heading = document.getElementById("title");
    if (heading) heading.textContent = "読み込みエラー";
  }
})();
