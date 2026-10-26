# 保存するCodex翻訳

Google翻訳へのリンクではなく、Codexが生成した翻訳本文をGitに保存します。249言語は**対象数**です。完成数とは異なります。現在の正確な件数と未完成・生成失敗・対応困難の状態は [最新の翻訳台帳](../../data/translations/2026-10-26-2135/manifest.json) に記録します。

初回の対象は10月26日21:35 JSTの37論点です。タイトル・本文・対策・時刻の説明・全留保・短い要約・読者向け文言の201項目を翻訳します。過去の原本、以前の調査、Tailworm特集やモーションの全文を249言語化したという意味ではありません。

## データと検査

`data/translations/<snapshot>/<locale>.json` に、翻訳文字列と、出典・ID・分類を保った自己完結した `database` を保存します。`source.json` は対応する日本語、`manifest.json` は進捗です。全項目が揃い、原文ハッシュと**出典URL・基準時刻などを含む台帳全体のハッシュ**が一致するデータだけ公開します。

`memory/<locale>.json` は原文文字列のSHA-256から翻訳への対応表です。次回更新では同じ文章を再利用し、変わった文章をCodexで翻訳します。数値、CVE/GHSA、版、設定値、URLは生成中に保護します。検査に通らないデータや日本語・英語のコピーを、別言語の完成データとして扱いません。

これは機械的な整合性検査です。意味の正確さや母語として自然かどうかを保証しません。全ページにAI翻訳・母語話者による未校閲である旨を表示し、原文・公式資料に戻れるようにします。少数言語も別言語で穴埋めせず、Codexが生成できなかった状態を残します。

## 更新・再開

公式Codex CLIを認証済みの環境で使います。キーや認証ファイルをリポジトリへ保存しないでください。

```sh
python3 tools/translations/manage.py prepare
python3 tools/translations/manage.py run --workers 1
python3 tools/translations/manage.py status
python3 tools/build-site.py
python3 tests/stored_translations_test.py
python3 tests/seo_test.py
```

制限を挟んで継続生成する場合は `python3 tools/translations/refresh.py --rounds 12 --cooldown 600` を使います。未完了だけを逐次実行し、失敗時は10分待機して最大12巡まで再開します。対応困難と記録した言語は同じ原文で繰り返し生成しません。完成分の静的ページを各巡の後に更新しますが、Gitへのpushや本番へのデプロイは行いません。

必要な言語だけ再開する場合は `--locales es,zh-CN,ko` を指定できます。完成済みの現在の翻訳は再生成しません。Codexのデフォルトモデルを使い、JSON構造化出力と読み取り専用サンドボックスで動かします。使用量・生成日時・プロンプト版・校閲状態は各ファイルの `provenance` に残ります。最初の英仏独とアフリカーンス語にはCodexによる数字表記等の補正を明記しています。

429は30秒・60秒待機して再試行し、それでも続けば残りを未完了のまま止めます。制限後は時間を置いて同じコマンドで再開できます。認証・契約・提供側の制限を回避する実装はありません。

公開するのは `/database.<locale>` と `/data/translations/<snapshot>/<locale>.json` です。日本語原文は `/database`。`/languages` は完成データだけにリンクし、未完成言語を折りたたんで表示します。canonicalとhreflangは実在するページに限ります。翻訳APIやGoogleへの翻訳リクエストは発生しません。
