# Runbook — Node.js 2026年10月分

対象: Node.js で動くホスト／コンテナ。所要 20〜60 分（イメージの再ビルドを含む場合）。
修正版は **22.23.4 / 24.22.1 / 26.12.1**。**20.x は EOL で修正なし。**

---

## 0. 発見

```bash
tools/node/nodefix-audit                    # ローカル
tools/node/nodefix-audit --target <ssh-host>
```

見ているもの: `docker ps` の全コンテナ、ホストの `/usr/bin/node` と `~/.local/bin/node`。
**同じホストに複数の node があること**が最大の落とし穴（[`../docs/06-lessons-and-gotchas.md`](../docs/06-lessons-and-gotchas.md) §6）。

```bash
which -a node
node -v
/usr/bin/node -v 2>/dev/null       # システムのもの（root サービスが掴む）
```

---

## 1. 分岐

| 状況 | 手段 |
|---|---|
| コンテナ（アプリが Node を同梱） | §2 派生イメージ、またはアプリを再ビルド |
| ホスト（Debian/Ubuntu + NodeSource） | §3-1 |
| ホスト（Arch） | §3-2 |
| 20.x が残っている | **メジャーアップが必要**。§4 |

---

## 2. コンテナ

### 2-1. まず「上流が直したか」を確認する

```bash
curl -s "https://hub.docker.com/v2/repositories/<owner>/<repo>/tags?page_size=5&ordering=last_updated" \
  | jq -r '.results[]|"\(.name)\t\(.last_updated)\t\(.digest[0:19])"'
docker exec <c> node -v
```

上流イメージが修正版を同梱していれば、`pull` して再作成するだけで済む。

```bash
docker compose pull <service>
docker compose up -d --force-recreate --no-deps <service>
docker exec <c> node -v
```

### 2-2. 上流が未追随なら、ランタイムだけ差し替える

```dockerfile
# Dockerfile.nodefix
FROM <your-app-image>
COPY --from=node:22.23.4-bookworm-slim /usr/local/bin/node /usr/local/bin/node
```

```bash
docker build -f Dockerfile.nodefix -t <app>:node22.23.4 .
# docker-compose.yml の image: を <app>:node22.23.4 に変更
docker compose up -d --force-recreate --no-deps <service>
docker exec <c> node -v
```

**守ること**:

- **同じメジャーライン**の node を使う（ABI を維持するため）。
- Wolfi / Alpine ベースは共有ライブラリが足りないことがある（`apk add libatomic` 等）。
- **ネイティブモジュール（`better-sqlite3` 等）を持つアプリはこの方法では動かない**。
  ソースから再ビルドする（§2-3）。
- 起動ログを確認する。`node -v` が上がっていても、アプリが起動時に落ちることがある。

### 2-3. ソースから再ビルドする場合

```dockerfile
FROM node:22.23.4-bookworm-slim AS build
# ... 依存インストールとビルド ...
```

`node-gyp` 系は新しい ABI でコンパイルし直す必要がある。`npm ci` をクリーンに流すこと
（`node_modules` を使い回すと古い `.node` が残る）。

---

## 3. ホスト

### 3-1. Debian / Ubuntu（NodeSource）

```bash
sudo apt update
apt-cache policy nodejs          # Candidate が修正版か
sudo apt install --only-upgrade nodejs
node -v
```

`Candidate` が古いままなら、NodeSource の公開待ち。**その間の回避策**:
修正版をユーザー領域に入れて PATH で優先させる。

```bash
# 例: 公式 tarball を ~/.local/opt に展開し、~/.local/bin にリンク
# PATH は ~/.local/bin が /usr/bin より前にあること
```

ただし **root が実行するサービスは `/usr/bin/node` を掴む**。そこは残る。
systemd の unit に `ExecStart=/home/<user>/.local/bin/node ...` と書くか、
`drop-in` で `Environment=PATH=...` を固定する。

### 3-2. Arch

```bash
pacman -Si nodejs      # リポジトリの版を先に見る
sudo pacman -Syu nodejs
node -v
```

**リポジトリの版が修正版未満なら、pacman で上げても意味がない**。
その場合はユーザー領域の修正版を PATH で優先させる（§3-1 と同じ）。

---

## 4. 20.x（EOL）からの移行

20.x には修正が来ない。22 以上へ移す以外に道はない。

1. アプリの `engines` 制約を確認する
   ```bash
   docker exec <c> node -e 'console.log(require("/app/package.json").engines)'
   ```
2. 22 が許容範囲なら、そのまま §2 の方法で上げる
3. ネイティブモジュールがあれば再ビルド（§2-3）
4. **移行後は必ずアプリの主要動線を触る**（ログイン、API、バックグラウンドジョブ）

---

## 5. 検証

```bash
tools/node/nodefix-audit                 # 全て ok になること
docker exec <c> node -v                  # 各コンテナ
/usr/bin/node -v                         # ホスト（root サービス用）
```

アプリの健全性も見る（バージョンが上がったことと、動いていることは別）:

```bash
docker compose ps
docker logs --tail 100 <c>
curl -sS -o /dev/null -w '%{http_code}\n' http://127.0.0.1:<port>/
```

---

## 6. ロールバック

| 手段 | 戻し方 |
|---|---|
| 派生イメージ | compose の `image:` 行を元に戻し、`up -d --force-recreate --no-deps` |
| ホスト（apt） | `sudo apt install nodejs=<旧版>` |
| ホスト（pacman） | `sudo pacman -U /var/cache/pacman/pkg/nodejs-<旧版>.pkg.tar.zst` |

**戻せる状態を確保してから上げる**。pacman はキャッシュが消えていることがあるので、
上げる前に `/var/cache/pacman/pkg` を確認する。

---

## 7. 注意すべき CVE

| CVE | なぜ重要か |
|---|---|
| CVE-2026-111497 | Brotli デコーダの OOB write → RCE。`Accept-Encoding: br` を扱う HTTP サーバなら**未認証で到達し得る** |
| CVE-2026-106069 / 105483 | TLS ホスト名検証のバイパス。内部 API の相互 TLS やプロキシ越しの検証に効く |
| CVE-2026-106074 | 起動スナップショット/SEA にエントロピーキャッシュが残り、全プロセスが同じ乱数を出す。トークン生成に使っているなら影響大 |

詳細: [`../docs/02-nodejs-oct2026.md`](../docs/02-nodejs-oct2026.md)
