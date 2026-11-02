# AION2 まよえるこしつじ

調べたAION2の情報を、忘れてもすぐ探せる小さな非公式Webサイト。AION風の落ち着いた配色、スマホ向けの検索・カテゴリ・日課週課の導線。

## データ管理
- **Notion**：非公開の情報正本。疑問・調査内容・出典・未確認の差分を保管
- **GPT / Work**：情報を調査・既存メモと統合。公開時はNotionを読み、差分を提示
- **GitHub Pages**：`docs/data/notes.json` の**公開承認済み記事だけ**表示

APIキー・有料サーバー・定期自動収集は不要。Notionへの保存とサイトへの反映は、接続したGPTがその都度実行する。チャットだけで無条件に自動同期されるわけではない。

現在の公開用データは空（Notionの調査メモはすべて「要確認」）。記事がないのは意図どおり。

## サイト
- `docs/index.html`：キーワード・言い換え検索、カテゴリ、日課・週課へのリンク
- `docs/daily.html`, `docs/weekly.html`：承認済みの各ジャンルの記事を表示
- `docs/note.html?id=...`：短い結論、補足、注意、出典
- `docs/data/notes.json`：公開済みレコードのみ
- `docs/search.js`：外部依存なしの検索処理

## 確認
Node.js 20以降で追加インストールなし：
```sh
node scripts/validate-content.mjs
node scripts/test-site.mjs
```

変更をpushするとGitHub Actionsも同様の検査を実行。

## 公開手順
**[PUBLISHING.md](./PUBLISHING.md)** を参照。公開はユーザー確認後のみ。現時点のGitHub Pagesは確認用ブランチ `feat/starter-preview-20261016` の `/docs` から配信し、`main` は変更しない。
