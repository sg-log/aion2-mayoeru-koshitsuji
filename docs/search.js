/* Shared search logic. Browser + Node compatible; no external library. */
(function (root) {
  "use strict";
  const labels = Object.freeze({
    money: "通貨・商店", items: "アイテム・素材", gear: "装備・強化",
    battle: "戦闘・スキル", explore: "探索・コンテンツ",
    settings: "設定・便利機能", daily: "デイリー", weekly: "ウィークリー"
  });
  const synonyms = Object.freeze({
    "金貨": "ギーナ", "お金": "ギーナ", "キナ": "ギーナ",
    "日課": "デイリー", "毎日やること": "デイリー",
    "週課": "ウィークリー", "毎週やること": "ウィークリー",
    "売れない": "取引不可", "売れなくなる": "取引不可",
    "引き継ぎ": "継承", "引継": "継承"
  });
  const normalize = (value) => String(value ?? "")
    .normalize("NFKC").toLowerCase()
    .replace(/[\u30a1-\u30f6]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0x60))
    .replace(/[\s\u3000・_()（）\-]/g, "");
  function terms(query) {
    const q = String(query ?? "").trim();
    if (!q) return [];
    return q.split(/[\s\u3000]+/).filter(Boolean).map((word) => {
      const normalized = normalize(word);
      const equivalent = Object.entries(synonyms)
        .filter(([key]) => normalize(key) === normalized)
        .map(([, value]) => normalize(value));
      return [normalized, ...equivalent];
    });
  }
  function matches(record, query) {
    const tokens = terms(query);
    if (!tokens.length) return true;
    const fields = [
      record.title, record.summary, record.caution,
      ...(record.details || []), ...(record.keywords || []),
      labels[record.category] || ""
    ];
    const haystack = normalize(fields.join(" "));
    return tokens.every((candidates) => candidates.some((token) => haystack.includes(token)));
  }
  const api = Object.freeze({ labels, synonyms, normalize, terms, matches });
  root.AionSearch = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof globalThis !== "undefined" ? globalThis : this);
