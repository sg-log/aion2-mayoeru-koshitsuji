# AION2 まよえるこしつじ

AION2の情報を、あとから探し直しやすくする非公式の個人サイト。広告なし・静的HTML・スマホ対応。

## 構成
- `docs/` : GitHub Pages用の公開ファイル
- `docs/data/notes.json` : **公開中のみ**をWeb側に出すためのデータ（今は空）
- Notion「AION2 まよえるこしつじ｜情報DB」: 非公開の情報正本

## 情報を増やすとき
1. GPTで調査し、情報源・確認日・対象環境をNotionに保存
2. 重複や矛盾をチェック。未確認は「要確認」のまま保管
3. さらが公開差分を確認して承認したものだけ `docs/data/notes.json` に追加
4. GitHub Pagesへ反映（自動収集・定期更新・自動公開なし）

データ形式の例：
```json
[{"id":"sample","title":"サンプル","category":"money","summary":"短い説明","details":["補足"],"keywords":["別名"],"status":"公開中","checked_at":"YYYY-MM-DD","sources":[{"label":"情報源","url":"https://example.com/"}]}]
```

実際のゲーム内容が未確認なら、公開データへ追加しないこと。転載・個人情報にも注意。

## 公開前の確認
このブランチはサイトデザインの確認用。 `main` には未反映。
公開するときは承認後にマージし、GitHubの Settings → Pages → Deploy from a branch → `main` / `/docs` を指定する。
