import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const search = require("../docs/search.js");
const fixture = [
  { id: "sample-currency", title: "ギーナの使い分け", category: "money", summary: "通貨を整理", keywords: ["きな", "お金"], details: ["使い道"] },
  { id: "sample-daily", title: "毎日チェック", category: "daily", summary: "予定を確認", keywords: ["毎日のこと"], details: [] },
  { id: "sample-gear", title: "装備の継承", category: "gear", summary: "引継の注意点", keywords: ["強化"], details: [] }
];
assert.equal(search.matches(fixture[0], "金貨"), true, "金貨→ギーナ");
assert.equal(search.matches(fixture[0], "きーな"), false, "unknown terms are not invented");
assert.equal(search.matches(fixture[1], "日課"), true, "日課→デイリー");
assert.equal(search.matches(fixture[2], "装備 継承"), true, "multiple words work");
assert.equal(search.matches(fixture[2], "引き継ぎ"), true, "引き継ぎ→継承");
assert.equal(search.matches(fixture[0], "悪夢"), false, "unrelated entries do not match");
assert.equal(search.matches(fixture[0], ""), true, "empty query matches all");
assert.equal(search.normalize("ギーナ"), search.normalize("ぎーな"), "katakana and hiragana");
const index = readFileSync(new URL("../docs/index.html", import.meta.url), "utf8");
const detail = readFileSync(new URL("../docs/note.html", import.meta.url), "utf8");
const daily = readFileSync(new URL("../docs/daily.html", import.meta.url), "utf8");
const weekly = readFileSync(new URL("../docs/weekly.html", import.meta.url), "utf8");
assert.match(index, /placeholder="キーワードを検索"/);
assert.match(index, /src="\.\/search\.js"[\s\S]*src="\.\/app\.js"/);
assert.match(detail, /data-page="note"/);
assert.match(daily, /data-page="daily"/);
assert.match(weekly, /data-page="weekly"/);
for (const file of [detail, daily, weekly]) assert.match(file, /src="\.\/page\.js"/);
console.log("OK: synonym search, routes, and content view wiring.");
