# 2026 — php2shell / Node.js 2026年10月 / CA 侵害

[English](README.md) | [**日本語**](README_jp.md)

## 0. 忙しい人向け

- **PHP**（CVE-2026-109618 / 109619、CVSS 9.2）: 5.4.0 以降の全リリース。修正版は
  **8.5.12 / 8.4.27 / 8.3.36 / 8.2.35**。攻撃コードは公開済みで、**修正が出る前から**
  試行が観測されている。PHP を公開しているなら今日中に更新する。
- **Node.js**: **22.23.4 / 24.22.1 / 26.12.1** が最新で、**これより新しいパッチは無い**。
  20.x は EOL で、今後も修正されない。
- **CA**: eMudhra の中間CA 秘密鍵が侵害された。CA ストアを自前で持つランタイム
  （Node / Go / Python / Java）は更新が必要。
- **このリポジトリの残りは文脈**。上のどれかが該当して初めて意味を持つ。

自環境の確認は、読み取り専用の2コマンドで1分:

```bash
git clone https://github.com/yomiplush/2026-world-is-a-fuck-incident.git
cd 2026-world-is-a-fuck-incident
tools/php2shell/bin/p2s-audit --json      # 終了コード 10 = PHP が露出
tools/node/nodefix-audit                  # 修正版未満の Node を列挙
```

**AI に投げる場合**は、プロンプトをコピーしてリポジトリの URL と一緒に貼る:

```bash
bash tools/copy-prompt.sh        # 英語プロンプト → クリップボード
bash tools/copy-prompt.sh ja     # 日本語プロンプト → クリップボード
```

このプロンプトは、エージェントに「まず読み取り専用」「§2-3 の表で分岐」
「バージョンは実行中のバイナリで確認」「部分的な緩和を修正と呼ばない」を守らせる。

---

2026年10月後半に重なった3件（**PHP の RCE 2件**、**Node.js の定期セキュリティリリース**、
**公開CAの中間鍵侵害**）について、事実・一次ソース・再現手順・実行できる防御ツールを
ひとまとめにした記録です。**読むため**と、**手を動かすため**の両方に使えます。

**データ基準時点**: 2026-10-22 00:15 UTC（最終確認）。
新しいパッチは出ていないことを Node.js のリリース索引と勧告一覧で確認済み。

---

## 1. 3件の全体像

| 事案 | CVE | 深刻度 | 影響 | 修正版 | 悪用 | やること |
|---|---|---|---|---|---|---|
| **php2shell**（PHP本体のRCE） | CVE-2026-109618<br>CVE-2026-109619 | CVSS 4.0 **9.2** Critical | PHP **5.4.0 以降の全リリース**。FPM / mod_php / php-cgi / FrankenPHP / LiteSpeed | **8.5.12 / 8.4.27 / 8.3.36 / 8.2.35**（2026-10-21） | **公開済み**。リリース前の 07:43 UTC に攻撃試行を観測 | PHP を上げる。上げられない間は multipart 遮断＋部分緩和 |
| **Node.js 10月分** | CVE-2026-111497 ほか計9件 | 最高 **high** | Node 22 / 24 / 26。**20 は EOL で修正なし** | **22.23.4 / 24.22.1 / 26.12.1**（2026-10-21） | 未観測（公開PoCの領域） | 同メジャー内で更新（ABI 維持） |
| **eMudhra 中間CA 鍵侵害** | CVE-2026-111943（Go 側の追跡ID） | — | 当該中間CA を信頼している全トラストストア | 各ベンダの `ca-certificates` / Node 本体 | 前提は MITM 位置 | OS/ランタイムの CA バンドル更新 |

この3件は**独立**しています。PHP を直しても Node は直らず、CA はまた別です。

**php2shell だけが「今すぐ」の話**です。理由は (a) 攻撃コードが公開済み、(b) 修正が
公開される前から試行が観測されている、(c) 脆弱性が PHP のリクエスト処理の中にあり、
アプリ側の修正では消えないからです。

### 機械可読サマリ

```yaml
as_of: 2026-10-22T00:15Z
php:
  cves: [CVE-2026-109618, CVE-2026-109619]
  cvss_v4: 9.2
  affected: ">=5.4.0"
  fixed: { "8.5": "8.5.12", "8.4": "8.4.27", "8.3": "8.3.36", "8.2": "8.2.35" }
  no_official_fix: "<=8.1 (minimal source backports published for 7.4/8.0/8.1)"
  trigger: "multipart/form-data request body"
  verified_mitigations_partial:
    CVE-2026-109618: "memory_limit=-1 (php_admin_value) + small post_max_size"
    CVE-2026-109619: "session.upload_progress.enabled=0 (+ fatal_error_backtraces=0 on 8.5)"
node:
  latest: { "26": "26.12.1", "24": "24.22.1", "22": "22.23.4" }
  eol_no_fix: "20.x"
ca:
  event: "eMudhra intermediate CA key compromise"
  roots: ["Comodo AAA Services root", "emSign ECC Root CA - G3"]
  action: "update ca-certificates / runtime CA bundle"
```

---

## 2. AI エージェント向け — ここから始める

このリポジトリの URL だけを渡された状態から、**被害を出さずに**防御をセットアップできる
ように書いてあります。上から順に実行してください。

> 同じ内容を貼り付け用のプロンプトにしたものが `prompts/agent-prompt.ja.txt`（英語版は
> `agent-prompt.txt`）にあります。`bash tools/copy-prompt.sh ja` でコピーできます。

### 2-0. 制約（先に読む）

- **読み取り専用から始める**。`p2s-audit` と `nodefix-audit` は何も変更しません。
  変更系（`p2s-mitigate` / `p2s-patch`）は必ず `--dry-run` を先に実行する。
- **自分が管理権限を持つホストにだけ実行する**。`--target` は ssh 先を指定する引数で、
  このリポジトリには特定ホストの既定値は入っていない。
- **この README に書かれていない CVE を推測で補わない**。バージョン判定と修正版の対応は
  §1 の表と `docs/` が根拠。不明なら「不明」と報告する。
- **認証情報はこのリポジトリに無い**。Cloudflare トークンが必要な操作は、実行環境の
  `~/.config/cloudflare/token.env`（`CF_API_TOKEN=...`）か `--env-file` で渡す。
  無ければエッジ操作は**スキップ**してよい（オリジン側の対策が本体）。
- Docker は**グループ権限**で操作します（root 不要）。`docker` グループに入っていない
  場合、コンテナ系の検査は実行できません。

### 2-1. 取得と前提確認

```bash
git clone https://github.com/yomiplush/2026-world-is-a-fuck-incident.git
cd 2026-world-is-a-fuck-incident
bash tools/php2shell/tests/selftest.sh     # ツール自体が壊れていないか（30秒）
```

必要なもの: `bash` `curl` `jq` `docker`（グループ権限） `ssh`（リモート検査時）。
PHP 本体は不要。`nodefix-audit` は `node` があれば動く。

### 2-2. 発見（読み取り専用・変更なし）

```bash
tools/php2shell/bin/p2s-audit --json                 # ローカル
tools/php2shell/bin/p2s-audit --target <ssh-host>    # リモート
tools/node/nodefix-audit                             # Node ランタイム
tools/node/nodefix-audit --target <ssh-host>
p2s-audit の終了コード: 0 = 露出なし / 10 = 露出あり（要対応） / その他 = 実行失敗
```

`p2s-audit` は「PHP が動いているか」ではなく「**PHP が動いていて、かつ危険な設定が
有効か**」を見ます。PHP が1つも無いホストは、この脆弱性に対しては無条件で安全です。

### 2-3. 判定（機械的に分岐する）

| 観測結果 | 判定 | 次のアクション |
|---|---|---|
| PHP が存在しない | 対象外 | 何もしない。Node の判定へ |
| PHP のバージョン ≥ 修正版（8.5.12/8.4.27/8.3.36/8.2.35） | **修正済み** | 追加作業なし。既存の緩和設定は残してよい |
| PHP < 修正版、イメージ更新で上げられる | **要修正** | §2-4-A |
| PHP < 修正版、すぐ上げられない（ベンダ待ち・8.1以前） | **要緩和** | §2-4-B |
| Node < 22.23.4 / 24.22.1 / 26.12.1、または 20.x | **要修正** | §2-4-C |
| `ca-certificates` が eMudhra 中間CA を信頼したまま | 要更新 | §2-4-D |

> バージョンは**タグではなく実行中のバイナリで確認**すること。
> `docker exec <c> php -v` / `docker exec <c> node -v`。
> タグが `latest` のまま中身が古い、という事故が実際に起きます（`docs/06-lessons-and-gotchas.ja.md` §4）。

### 2-4-A. PHP を修正版に上げる（最優先）

```bash
tools/php2shell/bin/p2s-patch --container <name> --dry-run   # 何が変わるか確認
tools/php2shell/bin/p2s-patch --container <name>             # pull → recreate → 検証
```

自前イメージなら、ベースを修正版に固定するのが確実です:

```dockerfile
FROM php:8.3.36-fpm-alpine     # 8.2.35 / 8.4.27 / 8.5.12 でも同じ
```

`p2s-patch` は「pull して再作成し、**イメージダイジェストと PHP バージョンが変わったこと**を
示す」ところまでやります。終了コード 10 は「新しいイメージがまだ出ていない」の意味で、
失敗ではありません。その場合は §2-4-B に切り替えます。

### 2-4-B. すぐ上げられない場合の緩和（**部分対策**であることを理解して使う）

PHP 公式が「これは完全な修正ではない」と明記している緩和です。**更新の代替にはなりません。**

| 対象 | 設定 | 効果 |
|---|---|---|
| CVE-2026-109618（OOM 経由） | `memory_limit = -1` を `php_admin_value` 等で上書き不能に。`post_max_size` を小さく（アップロード不要なら 8M、必要なら 32M）、`upload_max_filesize` はその下 | メモリ上限を跨ぐ失敗を消す。ただし確保失敗そのものは残る |
| CVE-2026-109619（残留状態） | `session.upload_progress.enabled = 0`、PHP 8.5 は `fatal_error_backtraces = 0` | 確認済み経路のみ塞ぐ |
| 両方 | `multipart/form-data` を Web サーバで 403（Sansec 推奨） | 既知のトリガーを全部落とす。**ファイルアップロードが壊れるので要検証** |

```bash
tools/php2shell/bin/p2s-mitigate --container <name> --dry-run
tools/php2shell/bin/p2s-mitigate --container <name>
```

同梱の `ini/zz-php2shell.ini` は **109619 側だけ**を塞ぎます。109618 側には上の
`memory_limit` が必要で、**ツールは自動では入れません**（アプリのメモリ挙動を変えるため）。

```ini
; conf.d/zz-php2shell-mem.ini（または FPM プール）
memory_limit = -1
post_max_size = 8M
upload_max_filesize = 6M
```

`conf.d` に置くこと。`.user.ini` や `ini_set()` は PHP 公式が「頼るな」と明記しています。

nginx で multipart を落とす場合（**アプリのアップロード機能と両立するか必ず確認**）:

```nginx
if ($http_content_type ~* "multipart/form-data") { return 403; }
```

### 2-4-C. Node.js を修正版に上げる

**同じメジャーライン内で上げること**（ネイティブモジュールの ABI を維持するため）。

```bash
# 1) コンテナ: アプリイメージを保ったまま node バイナリだけ差し替える
#    FROM <your-app-image>
#    COPY --from=node:22.23.4-bookworm-slim /usr/local/bin/node /usr/local/bin/node
#    → ビルドして compose の image: 行を差し替え、--force-recreate で再作成

# 2) ホスト（Debian/Ubuntu + NodeSource）
sudo apt update && sudo apt install --only-upgrade nodejs
node -v     # 22.23.4 以上か

# 3) ホスト（Arch）
sudo pacman -Syu nodejs
```

- `better-sqlite3` などのネイティブモジュールを持つアプリは、バイナリ差し替えでは
  ABI が合わず落ちます。**その場合はソースから再ビルド**してください。
- 20.x は EOL で修正が来ません。22 以上へ移す以外に道はありません。
- 上げたあとは必ず `tools/node/nodefix-audit` で確認。

### 2-4-D. CA バンドルを更新する

```bash
sudo apt install --only-upgrade ca-certificates     # Debian/Ubuntu
sudo pacman -Syu ca-certificates                    # Arch
# Node/Go/Python など自前バンドルを持つランタイムは、ランタイム自体を更新する
```

詳細と条件は [`docs/03-emudhra-ca.ja.md`](docs/03-emudhra-ca.ja.md)。

### 2-5. 検証（対策したつもりを排除する）

```bash
tools/php2shell/bin/p2s-audit --target <ssh-host>          # 10 が返らなくなったか
docker exec <name> php -v                                  # 実際のバージョン
docker exec <name> php -i | grep -E 'session.upload_progress|memory_limit|post_max_size'
tools/php2shell/bin/p2s-hunt --container <name> --target <ssh-host> --scan   # RESULT: clean
bash tools/php2shell/tests/selftest.sh <ssh-host>          # 再起動を跨いで設定が残るか
```

**再起動を跨いだ確認を省かないこと。** `docker exec` で一時的に ini を置いても、
次の `docker compose up -d` で静かに消えます（`docs/06-lessons-and-gotchas.ja.md` §2）。

### 2-6. 侵害を疑う場合

`runbooks/php2shell.ja.md` §4 の順序（**遮断 → 保全 → 調査 → 再構築 → 認証情報のローテート**）に
従ってください。特に:
- `docker stop` で止める（消さない）。`docker cp` で Web ルートを保全する。
- Web ルートを「掃除」しない。変更されたファイルが唯一の証拠になり得る。
- 5xx の急増は、外部から見た UAF の典型的な痕跡です（`--logs`）。

### 2-7. やってはいけないこと

- 未検証の WAF ルールを「対策済み」として報告する（**対策したつもりが一番危険**）。
- 8.1 以前を「サポート終了だから対象外」と判断する（**修正版が無い＝露出が続く**）。
- このリポジトリのスクリプトを、所有者の同意なく第三者のホストに向ける。

---

## 3. 人間向け — 3コマンド

```bash
git clone https://github.com/yomiplush/2026-world-is-a-fuck-incident.git && cd 2026-world-is-a-fuck-incident
tools/php2shell/bin/p2s-audit --target <your-host>   # 露出の有無（読み取りのみ）
tools/node/nodefix-audit --target <your-host>        # Node ランタイムの版
```

`p2s-audit` が終了コード 10 を返したら、[`runbooks/php2shell.ja.md`](runbooks/php2shell.ja.md) へ。
0 なら PHP は安全です。Node が古ければ [`runbooks/nodejs.ja.md`](runbooks/nodejs.ja.md)。

---

## 4. 収録物

| パス | 中身 |
|---|---|
| [`docs/00-timeline.ja.md`](docs/00-timeline.ja.md) | 何がいつ起きたか（UTC/JST） |
| [`docs/01-php2shell.ja.md`](docs/01-php2shell.ja.md) | php2shell の技術解説・影響範囲・緩和の限界 |
| [`docs/02-nodejs-oct2026.ja.md`](docs/02-nodejs-oct2026.ja.md) | Node.js 10月分の CVE 一覧と更新方法 |
| [`docs/03-emudhra-ca.ja.md`](docs/03-emudhra-ca.ja.md) | 中間CA 鍵侵害と、どこを更新すれば足りるか |
| [`docs/04-cisa-kev-oct2026.ja.md`](docs/04-cisa-kev-oct2026.ja.md) | 同時期に悪用が確認された他の製品（期限つき） |
| [`docs/05-other-incidents.ja.md`](docs/05-other-incidents.ja.md) | その他の事案（Microsoft / Oracle / ランサムウェア動向） |
| [`docs/06-lessons-and-gotchas.ja.md`](docs/06-lessons-and-gotchas.ja.md) | 実装中に踏んだ罠と、判断を間違えた箇所の記録 |
| [`runbooks/php2shell.ja.md`](runbooks/php2shell.ja.md) | 検知 → 遮断 → 修正 → 検証 → 侵害時対応 |
| [`runbooks/nodejs.ja.md`](runbooks/nodejs.ja.md) | 監査 → コンテナ修正 → ホスト修正 → ロールバック |
| [`tools/php2shell/`](tools/php2shell/) | `p2s-audit` / `-mitigate` / `-hunt` / `-patch` / `-edge` / `-watch`、ini、systemd unit、selftest |
| [`tools/node/nodefix-audit`](tools/node/nodefix-audit) | Node ランタイムの版監査（修正版未満を列挙） |
| [`tools/copy-prompt.sh`](tools/copy-prompt.sh) | AI に渡すプロンプトをクリップボードへ（`en` / `ja`） |
| [`prompts/`](prompts/) | コピペ用プロンプト（英語版・日本語版） |
| [`data/2026-10-22/`](data/2026-10-22/) | 取得した生データ（CISA KEV 差分、NVD、PHP リリース一覧） |
| [`SOURCES.ja.md`](SOURCES.ja.md) | 全ソースと再取得コマンド |

ツールは「見つける・止める・確かめる」の3点に絞ってあります。攻撃コードは含みません。

`docs/` `runbooks/` `SOURCES` は、英語の原文（`NAME.md`）と日本語版（`NAME.ja.md`）の
2つを並べています。この README からは日本語版にリンクしています。

---

## 5. このリポジトリが意図的に含まないもの

- **認証情報・API トークン・秘密鍵**。Cloudflare トークン等は実行環境の外に置く前提です。
- **特定の組織のドメイン・ホスト名・IP・デバイス構成**。防御手順の再現に必要ないため。
  `docs/` は「ある構成でこうだった」という一般化した形で書いてあります。
- **攻撃ツール / PoC**。防御に必要なのは「到達したか」「何が残ったか」の観測であって、
  再現可能な Exploit ではありません。
- **ダークネット・非公開フォーラム由来の情報**。来歴が検証できない情報で防御ルールを作ると、
  対策したつもりで漏れます。全主張に一次ソースを付けています。

---

## 6. 鮮度について（重要）

このリポジトリは **2026-10-22 時点のスナップショット**です。脆弱性情報は数日で古くなります。

- バージョン判定は必ず**実行中のバイナリ**で行う。タグ・イメージ名は信用しない。
- 数日以上経っているなら、まず `SOURCES.ja.md` の一次ソースを叩き直す。
  特に Node.js の `dist/index.json` と PHP のリリース一覧は、見るだけで最新が分かります。
- 修正版が上がっていれば、この README の表より**上流を優先**してください。

## 7. ライセンス

MIT（[`LICENSE`](LICENSE)）。引用した一次ソースの権利は各提供元に帰属します。
