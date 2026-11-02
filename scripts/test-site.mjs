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


import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
const dir = mkdtempSync(join(tmpdir(), "aion2-validation-"));
try {
  mkdirSync(join(dir, "docs", "data"), { recursive: true });
  const publish = (record) => {
    writeFileSync(join(dir, "docs", "data", "notes.json"), JSON.stringify([record]), "utf8");
    return spawnSync(process.execPath, [fileURLToPath(new URL("./validate-content.mjs", import.meta.url))],
      { cwd: dir, encoding: "utf8" });
  };
  const valid = {
    id: "sample-article", title: "検証用の架空記事", category: "gear", summary: "架空の記事",
    details: [], keywords: ["テスト"], status: "公開中",
    checked_at: "2026-11-02", sources: [{ label: "テスト出典", url: "https://example.com/" }]
  };
  assert.equal(publish(valid).status, 0, "well-formed approved records pass");
  assert.notEqual(publish({ ...valid, status: "要確認" }).status, 0, "unconfirmed records cannot be published");
  assert.notEqual(publish({ ...valid, sources: [] }).status, 0, "uncited records cannot be published");
  assert.notEqual(publish({ ...valid, checked_at: "2026-02-30" }).status, 0, "invalid check dates are blocked");
} finally {
  rmSync(dir, { recursive: true, force: true });
}
console.log("OK: approval, source, and date validation guards.");


const preview = readFileSync(new URL("../docs/preview-dictionary.html", import.meta.url), "utf8");
const prototypeJs = readFileSync(new URL("../docs/dictionary-preview.js", import.meta.url), "utf8");
const prototypeCss = readFileSync(new URL("../docs/dictionary-preview.css", import.meta.url), "utf8");
assert.match(preview, /class="sidebar"/, "dictionary layout has an independent left sidebar");
assert.match(preview, /class="workspace"/, "dictionary layout has a reading column");
assert.match(preview, /id="search"/, "search field is present");
assert.match(preview, /id="imageDialog"/, "image zoom dialog is present");
assert.match(preview, /仮データ/, "sample records are explicitly labeled");
assert.match(preview, /src="\.\/search\.js"[\s\S]*src="\.\/dictionary-preview\.js"/, "shared search is available before prototype UI");
assert.match(prototypeJs, /status==="公開中"/, "production notes are filtered to approved status");
assert.match(prototypeJs, /レイアウト例/, "sample article view is clearly marked");
assert.match(prototypeJs, /showModal\(\)/, "image zoom behavior is wired");
assert.match(prototypeCss, /max-width:680px/, "mobile navigation is supported");
console.log("OK: independent dictionary prototype layout, sample labels, and image UI.");
