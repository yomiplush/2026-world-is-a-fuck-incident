# minipc の update-infosec

```sh
update-infosec
```

現在の main を実行ごとの専用フォルダへ取得し、Codex による広域調査・一次資料照合、
調査DB・実社会への影響・日英レポート・必要なモーションの追加を行います。
生成、全 Node/Python 単体テスト、実 Chrome のスマホ表示検証が通った場合だけ、
GitHub main に通常の commit/push を行い、Cloudflare Pages の
`2026-incident-briefing` 本番へ公開します。最後に公開ファイルと検証済み成果物を照合します。
各実行は前面で進むため、SSHを切る場合は tmux 等を使用してください。

```sh
update-infosec --doctor                    # 依存・認証・本番プロジェクトへのアクセス確認
update-infosec --dry-run                   # 調査・生成・検証まで。commit/push/deployしない
update-infosec --retry-deploy <実行ID>      # 保存済みの検証済みコミットを再公開
```

調査には既存の Codex/ChatGPT 認証を利用します。処理時間・利用量は前回からの期間と
調査対象に依存します。全世界の事件を完全に網羅したり、AIの判断の正確さを保証するものでは
ありません。出典原本・取得失敗・不明点を保存し、公開前の機械検証で不足を止めます。
ホストやコンテナへの脆弱性パッチ適用は行いません。
調査用コマンドはCodexの workspace-write と公式の自動承認レビューで実行します。
minipcの名前空間制限によりサンドボックス起動が拒否される操作は、自動レビューで
承認された場合だけ再試行します。OSの制限変更や無条件の承認迂回は行いません。

## 配置と設定

- 実体: `~/2026-world-is-a-fuck-incident/tools/update-infosec`
- 入口: `~/.local/bin/update-infosec` と `~/bin/update-infosec`
- 設定: `~/.config/update-infosec/config.json`（Git管理外）
- 状態・ログ: `~/.local/state/update-infosec/runs/<実行ID>/`
- 専用CLI: `~/.local/opt/infosec-runtime/node_modules/.bin/`

設定例（browser はそのPCにある実行ファイルへ合わせる）:

```json
{
  "codex": "/home/yomiplush/.local/opt/infosec-runtime/node_modules/.bin/codex",
  "wrangler": "/home/yomiplush/.local/opt/infosec-runtime/node_modules/.bin/wrangler",
  "node_modules": "/home/yomiplush/.local/opt/infosec-runtime/node_modules",
  "browser": "/home/yomiplush/.cache/puppeteer/chrome/linux-151.0.7922.71/chrome-linux64/chrome"
}
```

Codexのモデルは既存ユーザー設定を使用します。明示したい場合は設定に `model` を追加します。
認証情報は設定JSONにもリポジトリにも書き込まず、各CLIのユーザー認証を利用します。

## 初期導入・ログイン

Node22、Python3.11以上、Git、Chrome が必要です。専用ランタイムの導入例:

```sh
npm install --prefix "$HOME/.local/opt/infosec-runtime" @openai/codex@0.165.0 wrangler@4.155.0 playwright@1.56.1
~/.local/opt/infosec-runtime/node_modules/.bin/codex login
~/.local/opt/infosec-runtime/node_modules/.bin/wrangler login
```

SSH越しに手元PCのブラウザでCloudflare認証する場合は、OAuthの戻り先を転送します。

```sh
ssh -L 8976:localhost:8976 -t minipc '~/.local/opt/infosec-runtime/node_modules/.bin/wrangler login --browser=false'
```

表示されたURLを手元のブラウザで開いて許可し、ターミナルで成功を確認してください。
認証後は `ssh minipc 'update-infosec --doctor'` でプロジェクトへのアクセスを確認できます。
通常実行は `ssh -t minipc 'update-infosec'` でも開始できます。

## 失敗したとき

失敗した段階と保存先を表示します。作業フォルダは削除せず、ログ・原本・生成結果を残します。
検証失敗ならコミットも公開も行いません。Push失敗なら本番公開へ進みません。
先に別の更新が main へ入った場合は強制Pushや自動的なマージを行いません。

Push直後に通信が切れた場合も `--retry-deploy` でGitHubのSHAを照合できます。
リモートmainが保存済みコミットと一致し、検証後のファイル変更がない場合だけ再公開します。
mainが先へ進んでいたら、古い成果物で上書きしません。

デプロイが成功して本番照合だけが失敗した場合、本番が更新されている可能性があります。
`run.json` の段階と `run.log` を確認してください。自動ロールバックは行いません。
ログは秘密情報を含まない想定ですが、調査先の本文も保存されるため公開フォルダには置きません。

実行履歴は自動削除しません。確認済みの古い実行フォルダは必要に応じて整理してください。
