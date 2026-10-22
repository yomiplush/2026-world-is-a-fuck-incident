# 2026 — php2shell / Node.js 2026年10月 / Oracle Java / CA 侵害

[English](README.md) | [**日本語**](README_jp.md)

## 0. 忙しい人向け

- **PHP**（CVE-2026-109618 / 109619、CVSS 9.2）: 5.4.0 以降の全リリース。修正版は
  **8.5.12 / 8.4.27 / 8.3.36 / 8.2.35**。攻撃コードは公開済みで、**修正が出る前から**
  試行が観測されている。PHP を公開しているなら今日中に更新する。
- **Node.js**: **22.23.4 / 24.22.1 / 26.12.1** が最新で、**これより新しいパッチは無い**。
  20.x は EOL で、今後も修正されない。
- **Oracle Java SE**（2026年10月 CPU）: 55件。最大 CVSS は **7.5** で 9.x は無く、
  KEV にも未収載。ただし **「影響を受ける版」と「修正版」が別**（例: 影響 21.0.12.1 →
  修正 21.0.13）。JVM を公開しているホストだけ、今日中に上げる。詳細は
  [`docs/07`](docs/07-oracle-java-oct2026.ja.md)。
- **CA**: eMudhra の中間CA 秘密鍵が侵害された。CA ストアを自前で持つランタイム
  （Node / Go / Python / Java）は更新が必要。
- **このリポジトリの残りは文脈**。上のどれかが該当して初めて意味を持つ。

自環境の確認は、読み取り専用の3コマンドで1分:

```bash
git clone https://github.com/yomiplush/2026-world-is-a-fuck-incident.git
cd 2026-world-is-a-fuck-incident
tools/php2shell/bin/p2s-audit --json      # 終了コード 10 = PHP が露出
tools/node/nodefix-audit                  # 修正版未満の Node を列挙
java -version                             # Java は「ビルド文字列」まで読む（docs/07 §2）
```

**AI に投げる場合**は、プロンプトをコピーしてリポジトリの URL と一緒に貼る:

```bash
bash tools/copy-prompt.sh            # 対応用プロンプト（英語）→ クリップボード
bash tools/copy-prompt.sh ja         # 対応用プロンプト（日本語）
bash tools/copy-prompt.sh intel      # 判断用プロンプト（英語・情報源版）
bash tools/copy-prompt.sh intel ja   # 判断用プロンプト（日本語・情報源版）
```

対応用は「まず読み取り専用」「§2-3 の表で分岐」「バージョンは実行中のバイナリで確認」
「部分的な緩和を修正と呼ばない」を守らせる。判断用は「まずデータを再取得」「影響版と修正版を
分ける」「主張ごとに出所と取得日」「空白を記憶で埋めない」を守らせる（[`docs/08`](docs/08-intel-sources.ja.md)）。

---

2026年10月後半に重なった4件（**PHP の RCE 2件**、**Node.js の定期セキュリティリリース**、
**公開CAの中間鍵侵害**、**Oracle Java SE の四半期パッチ**）について、事実・一次ソース・
再現手順・実行できる防御ツールをひとまとめにした記録です。**読むため**と、**手を動かすため**の両方に使えます。

**データ基準時点**: 2026-10-22 00:15 UTC（最終確認）。
新しいパッチは出ていないことを Node.js のリリース索引と勧告一覧で確認済み。

---

## 1. 4件の全体像

| 事案 | CVE | 深刻度 | 影響 | 修正版 | 悪用 | やること |
|---|---|---|---|---|---|---|
| **php2shell**（PHP本体のRCE） | CVE-2026-109618<br>CVE-2026-109619 | CVSS 4.0 **9.2** Critical | PHP **5.4.0 以降の全リリース**。FPM / mod_php / php-cgi / FrankenPHP / LiteSpeed | **8.5.12 / 8.4.27 / 8.3.36 / 8.2.35**（2026-10-21） | **公開済み**。リリース前の 07:43 UTC に攻撃試行を観測 | PHP を上げる。上げられない間は multipart 遮断＋部分緩和 |
| **Node.js 10月分** | CVE-2026-111497 ほか計9件 | 最高 **high** | Node 22 / 24 / 26。**20 は EOL で修正なし** | **22.23.4 / 24.22.1 / 26.12.1**（2026-10-21） | 未観測（公開PoCの領域） | 同メジャー内で更新（ABI 維持） |
| **Oracle Java SE 10月分** | 55件（例: CVE-2026-91415） | 最高 **7.5** | Java SE `8u503` / `11.0.32.1` / `17.0.20.1` / `21.0.12.1` / `25.0.4.1` / `26.0.2` / `27` | **`8u511` / `11.0.33` / `17.0.21` / `21.0.13` / `25.0.5` / `27.0.1`**（2026-10-20） | 未確認（KEV 0件） | 修正版へ上げる。JDK 26 は修正なしで 27 へ |
| **eMudhra 中間CA 鍵侵害** | CVE-2026-111943（Go 側の追跡ID） | — | 当該中間CA を信頼している全トラストストア | 各ベンダの `ca-certificates` / Node 本体 | 前提は MITM 位置 | OS/ランタイムの CA バンドル更新 |

この4件は**独立**しています。PHP を直しても Node は直らず、CA も Java もまた別です。

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
java:
  cpu: "2026-10"
  cves: 55
  remote_no_auth: 49
  max_cvss: 7.5
  affected: ["8u503", "8u503-perf", "11.0.32.1", "17.0.20.1", "21.0.12.1", "25.0.4.1", "26.0.2", "27"]
  fixed:    ["8u511", "11.0.33", "17.0.21", "21.0.13", "25.0.5", "27.0.1"]   # 2026-10-20
  no_fix:   "26 (26.0.3 does not exist; move to 27)"
  in_kev: false
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
| JVM のビルドが修正版未満（例: `21.0.12.1`） | **要修正** | §2-4-E |
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

### 2-4-E. Java を修正版に上げる

**「影響を受ける版」と「修正版」を取り違えないこと。** Oracle の表にあるのは影響版です。

| ライン | 影響版（上げる前） | 修正版（2026-10-20） |
|---|---|---|
| 8 | `8u503` / `8u503-perf` | **8u511** |
| 11 | `11.0.32.1` | **11.0.33** |
| 17 | `17.0.20.1` | **17.0.21** |
| 21 | `21.0.12.1` | **21.0.13** |
| 25 | `25.0.4.1` | **25.0.5** |
| 26 | `26.0.2` | 修正なし（26.0.3 は存在しない）→ 27 へ |
| 27 | `27` | **27.0.1** |

```bash
# どの JVM が動いているか（読み取りのみ。ビルド文字列まで見る）
for j in $(command -v java 2>/dev/null) /usr/lib/jvm/*/bin/java; do
  [ -x "$j" ] && printf '%s -> ' "$j" && "$j" -version 2>&1 | head -1
done
docker ps -q | xargs -r -I{} sh -c 'docker exec {} java -version 2>&1 | head -1 | sed "s|^|{} |"'

# ディストリのパッケージ（例）
sudo apt install --only-upgrade openjdk-21-jre-headless
sudo pacman -Syu jre-openjdk
```

- **Temurin / Corretto / Zulu は Oracle より遅れます。** 2026-10-22 時点で Temurin の最新は
  8月のビルド（`21.0.12.1+1` など）。ベンダのリリースノートを見て、出てから上げてください。
- コンテナは**修正版タグで再ビルド**。起動中のコンテナに JRE を差し込まない。
- 上げたあとは `java -version` の**ビルド文字列**（`21.0.13+10`）で確認する。

55件の内訳、Note 1/2/3 の読み方、Java が潜む場所の一覧は
[`docs/07-oracle-java-oct2026.ja.md`](docs/07-oracle-java-oct2026.ja.md)。

### 2-5. 検証（対策したつもりを排除する）

```bash
tools/php2shell/bin/p2s-audit --target <ssh-host>          # 10 が返らなくなったか
docker exec <name> php -v                                  # 実際のバージョン
docker exec <name> php -i | grep -E 'session.upload_progress|memory_limit|post_max_size'
for j in $(command -v java 2>/dev/null) /usr/lib/jvm/*/bin/java; do "$j" -version 2>&1 | head -1; done
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

## 4. データと情報源（AI に渡す前提）

**一覧は数日で古くなります。残るのは取得元と、その問い直し方です。**
[`docs/08-intel-sources.ja.md`](docs/08-intel-sources.ja.md) に、研究者／業界フィード12本・
公式フィード4本のカタログと、2026-10-22 時点のスナップショット（KEV 直近37件、MSRC 2,575
エントリ、JVN 20件）を置いてあります。手で写した数字は載せていません。

```bash
tools/intel/fetch-intel                       # data/YYYY-MM-DD/ に全部取得（python3 標準ライブラリのみ）
tools/intel/fetch-intel --sources oracle,kev  # 一部だけ
tools/intel/fetch-intel --out /tmp/intel      # 別の場所に
```

- 取得結果は [`data/2026-10-22/`](data/2026-10-22/) にあります（Oracle Java 55件の JSON、
  KEV 差分、MSRC、JVN、12本のフィード）。
- 終了コードは `0` 全部 / `10` 一部失敗（残りは書き込み済み）/ `2` 何も取れず。
- 同じコマンド・同じファイル名なので、2時点の `git diff` が「世界のどこが変わったか」に
  なります。**数値は必ず取り直して比べる。** 手で写した件数は検算できない主張です。
- 「悪用されている」は情報源ごとに意味が違います（CISA の「未観測」、Unit 42 の「PoC 確認」、
  KEV の収載は別物）。[`docs/08` §4](docs/08-intel-sources.ja.md) に php2shell を例に整理しました。

AI に判断させるときは、対応用プロンプトではなく判断用を使ってください。

```bash
bash tools/copy-prompt.sh intel ja
```

---

## 5. 収録物

| パス | 中身 |
|---|---|
| [`docs/00-timeline.ja.md`](docs/00-timeline.ja.md) | 何がいつ起きたか（UTC/JST） |
| [`docs/01-php2shell.ja.md`](docs/01-php2shell.ja.md) | php2shell の技術解説・影響範囲・緩和の限界 |
| [`docs/02-nodejs-oct2026.ja.md`](docs/02-nodejs-oct2026.ja.md) | Node.js 10月分の CVE 一覧と更新方法 |
| [`docs/03-emudhra-ca.ja.md`](docs/03-emudhra-ca.ja.md) | 中間CA 鍵侵害と、どこを更新すれば足りるか |
| [`docs/04-cisa-kev-oct2026.ja.md`](docs/04-cisa-kev-oct2026.ja.md) | 同時期に悪用が確認された他の製品（期限つき） |
| [`docs/05-other-incidents.ja.md`](docs/05-other-incidents.ja.md) | その他の事案（Microsoft / Oracle / ランサムウェア動向） |
| [`docs/06-lessons-and-gotchas.ja.md`](docs/06-lessons-and-gotchas.ja.md) | 実装中に踏んだ罠と、判断を間違えた箇所の記録 |
| [`docs/07-oracle-java-oct2026.ja.md`](docs/07-oracle-java-oct2026.ja.md) | Java SE 55件の全一覧、影響版と修正版の区別、Note 1/2/3、検出と更新 |
| [`docs/08-intel-sources.ja.md`](docs/08-intel-sources.ja.md) | 情報源カタログ、2026-10-22 のスナップショット、「悪用」の4つの意味 |
| [`runbooks/php2shell.ja.md`](runbooks/php2shell.ja.md) | 検知 → 遮断 → 修正 → 検証 → 侵害時対応 |
| [`runbooks/nodejs.ja.md`](runbooks/nodejs.ja.md) | 監査 → コンテナ修正 → ホスト修正 → ロールバック |
| [`tools/php2shell/`](tools/php2shell/) | `p2s-audit` / `-mitigate` / `-hunt` / `-patch` / `-edge` / `-watch`、ini、systemd unit、selftest |
| [`tools/node/nodefix-audit`](tools/node/nodefix-audit) | Node ランタイムの版監査（修正版未満を列挙） |
| [`tools/intel/fetch-intel`](tools/intel/fetch-intel) | 一次ソースの回収（Oracle CPU / KEV / JVN / MSRC / フィード12本）→ JSON |
| [`tools/copy-prompt.sh`](tools/copy-prompt.sh) | AI に渡すプロンプトをクリップボードへ（`en` / `ja` / `intel` / `intel ja`） |
| [`prompts/`](prompts/) | コピペ用プロンプト（対応用・判断用、英語版・日本語版） |
| [`data/2026-10-22/`](data/2026-10-22/) | 取得した生データ（Java 55件、KEV 差分、MSRC、JVN、フィード、NVD、PHP リリース一覧） |
| [`SOURCES.ja.md`](SOURCES.ja.md) | 全ソースと再取得コマンド |

ツールは「見つける・止める・確かめる」の3点に絞ってあります。攻撃コードは含みません。

`docs/` `runbooks/` `SOURCES` は、英語の原文（`NAME.md`）と日本語版（`NAME.ja.md`）の
2つを並べています。この README からは日本語版にリンクしています。

---

## 6. このリポジトリが意図的に含まないもの

- **認証情報・API トークン・秘密鍵**。Cloudflare トークン等は実行環境の外に置く前提です。
- **特定の組織のドメイン・ホスト名・IP・デバイス構成**。防御手順の再現に必要ないため。
  `docs/` は「ある構成でこうだった」という一般化した形で書いてあります。
- **攻撃ツール / PoC**。防御に必要なのは「到達したか」「何が残ったか」の観測であって、
  再現可能な Exploit ではありません。
- **ダークネット・非公開フォーラム由来の情報**。来歴が検証できない情報で防御ルールを作ると、
  対策したつもりで漏れます。全主張に一次ソースを付けています。

---

## 7. 鮮度について（重要）

このリポジトリは **2026-10-22 時点のスナップショット**です。脆弱性情報は数日で古くなります。

- バージョン判定は必ず**実行中のバイナリ**で行う。タグ・イメージ名は信用しない。
- 数日以上経っているなら、まず `SOURCES.ja.md` の一次ソースを叩き直す。まとめてやるなら
  `tools/intel/fetch-intel`（`docs/08`）。
  特に Node.js の `dist/index.json` と PHP のリリース一覧は、見るだけで最新が分かります。
- **数値は暗記しない。** `data/` の件数は取得時点のもので、MSRC の CVRF のように再公開で
  動きます（`docs/05` は 2,578、同じ文書の 2026-10-21 再公開は 2,575）。取り直して比べること。
- 修正版が上がっていれば、この README の表より**上流を優先**してください。

## 8. ライセンス

MIT（[`LICENSE`](LICENSE)）。引用した一次ソースの権利は各提供元に帰属します。
