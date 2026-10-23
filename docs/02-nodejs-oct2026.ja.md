# Node.js — 2026年10月のセキュリティリリース

[English](02-nodejs-oct2026.md) | [**日本語**](02-nodejs-oct2026.ja.md)

2026-10-21 公開。修正版は **22.23.4 / 24.22.1 / 26.12.1**。**20.x は EOL で修正なし。**

## 1. CVE 一覧

| CVE | 重大度 | 内容 | 22 | 24 | 26 |
|---|---|---|---|---|---|
| CVE-2026-111497 | **high** | Brotli デコーダの out-of-bounds write → リモートコード実行 | ✓ | ✓ | ✓ |
| CVE-2026-105482 | **high** | `dns.resolve` が NUL 文字を含む名前を切り詰める | ✓ | ✓ | ✓ |
| CVE-2026-105483 | high | TLS ホスト名検証バイパス（IP を全角数字で書いた場合） | — | ✓ | ✓ |
| CVE-2026-106069 | high | TLS ホスト名検証バイパス（ホスト名が緩く IP に解決される場合） | ✓ | ✓ | ✓ |
| CVE-2026-105481 | medium | keep-alive 接続で、リクエスト到着前に応答が書かれる | ✓ | ✓ | ✓ |
| CVE-2026-106072 | medium | 非正規 IPv4 ホスト名で DNS SAN が IP エンドポイントを認証してしまう | ✓ | ✓ | ✓ |
| CVE-2026-106074 | medium | `crypto.randomUUID()` / `randomInt()` のエントロピーキャッシュが起動スナップショット・SEA に保存され、全プロセスが同じ値を繰り返す | ✓ | ✓ | ✓ |
| CVE-2026-106070 | low | ZipFile がヘッダ検証失敗後に攻撃者制御の接頭辞バイトを返す | — | — | ✓ |
| CVE-2026-106071 / 106073 | low | Permission Model / ZipFile 関連 | — | — | ✓ |

**実務上の優先度**: CVE-2026-111497（Brotli）が最も重い。未認証のリクエストで到達する経路は
2つある。自分のコードが組み込み `fetch()` で Brotli 圧縮された応答を消費する場合と、
リクエストボディを**展開する**パーサが処理する場合（Express 5 の `express.json()` /
`urlencoded()` / `text()` / `raw()`、または `body-parser` 2.x を直接）。素の
`http.createServer()` は受信ボディを自動では展開しない。
TLS 系 3件は「証明書検証を信頼している」処理に効くので、内部 API の相互 TLS や
プロキシ越しの検証に影響する。

### 1-1. 攻撃コードの状況（2026-10-23）: 公式ビルドで動く PoC

**Imperva の「Node2Shell」は、配布されている Node.js 24.22.0 Linux arm64 イメージ上で、
細工した Brotli データからコード実行に成功**しています。デバッガも計測ビルドも不要で、同じ
入力は 24.22.1 では拒否されます。検証は上記2経路の両方（`fetch()` による応答の消費と、
Express 5.0.0〜5.3.0 / body-parser 2.0.0〜2.3.0 を固定した `raw()` / `json()` ボディ）、
成功まで複数回の試行を要し、22.x / 26.x や他のアーキテクチャは未検証です。以前の公開 PoC は
意図的に弱くしたビルドでしかコード実行に至っていませんでした。

CVE-2026-111497 の実環境での悪用報告はありません。**今日**の作業として扱ってください —
22.23.4 / 24.22.1 / 26.12.1 に既に居るホストには何も変わらず、居ないホストには何の助けにも
なりません。NVD の CVSS 4.0 のみの 9.2 が、深刻度で絞った CRITICAL スイープに出ない理由を
含む詳細は [`22-snapshot-2015jst.ja.md` §2](22-snapshot-2015jst.ja.md)。

## 2. 同時に入った依存関係の更新

- **c-ares**（26/24/22）
- **ca-cert（eMudhra 中間CA 侵害への対応）**（26/24/22） — [`03-emudhra-ca.ja.md`](03-emudhra-ca.ja.md)
- OpenSSL（24/22）
- SQLite（22）
- Undici（26/24/22）

**ca-cert の更新はランタイムの信頼ストアを変える**。つまり Node を上げることは、
CA 侵害への対策も兼ねる。Node を独自にビルド・同梱している場合（`--openssl-system-ca-path`
等を使っている場合）は、そのバンドルも別途確認が必要。

## 3. 更新のしかた

### 3-1. コンテナ（アプリを触らずにランタイムだけ差し替える）

公式イメージが修正版に追随するまで待てない場合の方法。**同じメジャーライン**を使うこと
（ネイティブモジュールの ABI を維持するため）。

```dockerfile
# Dockerfile.nodefix
FROM <your-app-image>

# 同メジャーの修正版から node バイナリだけ持ってくる
COPY --from=node:22.23.4-bookworm-slim /usr/local/bin/node /usr/local/bin/node
```

```bash
docker build -f Dockerfile.nodefix -t <app>:node22.23.4 .
# compose の image: 行を <app>:node22.23.4 に変えて
docker compose up -d --force-recreate --no-deps <service>
```

注意点:

- **Wolfi / Alpine ベースのイメージ**では、差し替え先のバイナリが要求する共有ライブラリが
  足りないことがある（例: `libatomic` を `apk add` する必要があった）。
- **`better-sqlite3` などのネイティブモジュールを持つアプリは、この方法では動かない**。
  新しい ABI で再コンパイルが必要なので、イメージをソースから再ビルドする。
- 派生イメージはアプリのバージョンを固定する。上流が修正版で再ビルドしたら、派生タグを捨てて
  元の行に戻す（固定したまま忘れると、アプリ側の更新が止まる）。

### 3-2. ホスト（Debian/Ubuntu + NodeSource）

```bash
sudo apt update
apt-cache policy nodejs        # Candidate が修正版か確認
sudo apt install --only-upgrade nodejs
node -v
```

`Candidate` が古いままなら、NodeSource 側の公開待ち。**ランタイムをユーザー領域に入れて
PATH で優先させる**のが現実的な回避策（`~/.local/opt/node-vXX...` + `~/.local/bin`）。
ただし root が実行するサービスは `/usr/bin/node` を掴むので、そこだけは残る。

### 3-3. ホスト（Arch）

```bash
sudo pacman -Syu nodejs
node -v
```

Arch は `extra` の更新が速いが、修正版の公開とパッケージ化には時差がある。
**リポジトリの版が修正版未満なら、pacman で上げても意味がない**。`pacman -Si nodejs` で
バージョンを確認してから実行する。

## 4. 検証

```bash
tools/node/nodefix-audit                    # ローカル
tools/node/nodefix-audit --target <ssh-host>
# 出力の STATE が ok 以外なら未対応。版は必ず実行中のバイナリで確認する:
docker exec <container> node -v
```

`nodefix-audit` は `docker ps` の全コンテナと、ホストの `node`（`/usr/bin/node` と
`~/.local/bin/node` の両方）を見る。**同じホストに複数の node があること**が、
この手の対応で最も見落とされやすい。

## 5. ロールバック

派生イメージ方式なら、compose の1行を戻すだけで済む（元イメージは削除していないため）。

```bash
cp docker-compose.yml.bak-<timestamp> docker-compose.yml
docker compose up -d --force-recreate --no-deps <service>
```

ホストのパッケージは `apt install nodejs=<version>` / `pacman -U <cached .pkg.tar.zst>`。
**バージョンを固定できる状態を確保してから**上げること。

## 6. 出所

- 勧告: <https://nodejs.org/en/blog/vulnerability/october-2026-security-releases>
- リリース索引（版と日付の一次データ）: <https://nodejs.org/dist/index.json>
- 勧告一覧（新しい順）: <https://nodejs.org/en/blog/vulnerability>
