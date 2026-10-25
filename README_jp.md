# 2026 — php2shell / Node.js 2026年10月 / Oracle Java / CA 侵害

> **提言：[Patch the Planet](https://patchtheplanet.org/) を推奨します。オープンソースの脆弱性修正を支える取り組みです。**

> **最新調査 — 2026-10-25 16:34 JST基準:** [対応優先順位・16群の追加/訂正](docs/25-snapshot-20261025.ja.md)。Fortinet緊急更新、Java/Python証明書対策、DNS、Brotli、Postiz、ATSとOTクライアントを補完。ConnectWiseの一次確認とLiteLLM確定原因を反映。固定窓NVD新規99件/更新5,432件を保存。[構造化索引](data/2026-10-25/incident-register.json) / [一次調査](docs/research-2026-10-25.md) / [読み物版](https://infosec-briefing.yomiplush.dev/update-20261025.html) / [41画面のブリーフィング・今回追補へ](https://infosec-briefing.yomiplush.dev/?lang=ja#34)。実取得は基準時刻後。以下の古い時点の記述は最新調査で上書きします。

> **投稿追補：[HTTP2Shell / Brotli](docs/26-brotli-http2shell.ja.md)** — 指定投稿を一次確認し、Envoy/IstioとHTTPクライアントの展開経路を追加。[専用画面 #40](https://infosec-briefing.yomiplush.dev/?lang=ja#40)。

[English](README.md) | [**日本語**](README_jp.md)

> **最新更新 — 2026-10-24 19:13 JST:** [広域調査と24事案群](docs/24-snapshot-20261024.ja.md)。Arista/Collaboraの実悪用、Pillow・Wasmtime・Ruby、AI/MCP、国内製品・HPE・産業機器を追加。NVD新規526件/更新3,531件、GHSA82件、KEV直近17件を保存。[構造化索引](data/2026-10-24/incident-register.json) / [一次調査メモ](docs/research-2026-10-24.md)。[公開ブリーフィング](https://2026-incident-briefing.pages.dev/?lang=ja#26)は8画面追加して**34画面**。以下は過去時点の記録を含み、現在の優先事項は最新調査を参照してください。

## 0. 忙しい人向け — 3分で「自分に関係あるか」まで

この2週間に**8件**が重なりました。全部を読む必要はありません。自分に該当する行だけ追ってください。
（さらに広く「直近の CRITICAL」を見たい場合は [`docs/13`](docs/13-recent-criticals.ja.md)。）

### 0-1. 今日やる（すでに現実になっているもの）

| あなたが | 何が起きたか（かみ砕くと） | 今日やること |
|---|---|---|
| **PHP をインターネットに出している** | PHP 本体に穴。ログインなしでサーバを乗っ取れる。**悪用の試行は 2026-10-17 から（勧告の4日前）**。侵害は未確認だが、手元のホストがそうだとはネットワークからは分からない。**別件** `CVE-2026-115560` は次の定期リリースまで修正が無い | PHP を **8.5.12 / 8.4.27 / 8.3.36 / 8.2.35** へ。10-17 から侵害を確認し、`session.upload_progress.enabled=0` を維持 → [`docs/01`](docs/01-php2shell.ja.md)、[`docs/23`](docs/23-php-cve-2026-115560.ja.md) |
| **自前の GitLab を運用している** | 満点（CVSS 10.0）。ログインなしでコード実行。**先週パッチを当てていても該当する** | **19.5.1 / 19.4.3 / 19.3.6 / 19.2.9 / 19.1.9 / 19.0.10 / 18.11.13** へ → [`docs/09`](docs/09-gitlab-19-5-1.ja.md) |
| **LiteLLM を 1.107.0 で入れた** | 入れた時点で侵害。Python を起動するたびに資格情報を外部へ送る | **先に `pip` を実行しない**。手順どおり除去とローテート → [`docs/10`](docs/10-litellm-1-107-0.ja.md) |
| **Railway にデプロイしている** | 環境変数（＝APIキー、DBのパスワード）が復号された可能性 | 環境変数を**全部**作り直す → [`docs/11`](docs/11-week-of-oct-20.ja.md) |
| **Plex Media Server を外部公開している** | **KEV 収載**（実悪用）。個々は 4.3〜7.2 だが連鎖でコード実行。**米連邦向け期限は2026-10-23（経過）** | 1.43.3.10861 以上へ（現行は **1.43.5.11029**）＋アカウントトークンをローテート → [`docs/12`](docs/12-plex-oct2026.ja.md) |

### 0-2. 今週中（条件が揃えば効くもの）

| あなたが | 何が起きたか | やること |
|---|---|---|
| **サーバで Java を動かしている** | 55件。最大 7.5 で悪用は未確認。ただし**「影響版」と「修正版」が別**（21.0.12.1 → 21.0.13）。Temurin の 17 / 21 / 25 は 2026-10-22 に出た | 修正版ビルドへ → [`docs/07`](docs/07-oracle-java-oct2026.ja.md) |
| **CA バンドルを自前で持つ**（Go / Python / Node / Java / コンテナ / VPN） | eMudhra の中間CA **8本**の鍵が弱すぎて、誰でも計算できる（**3〜8ビット**）。ブラウザは対応済み、長い尾は Docker・IoT・Python の同梱ルート | `ca-certificates` / `certifi` / Go / NSS を更新 → [`docs/03`](docs/03-emudhra-ca.ja.md) |
| **AI ツールにプロバイダキーを渡している** | 今週の攻撃は**鍵**を狙っている（Railway / LiteLLM / OpenCode） | キーを棚卸しし、プロバイダ側の利用履歴を見る → [`docs/11` §5](docs/11-week-of-oct-20.ja.md) |
| **AI エージェントにシェルを許可している** | 許可プロンプトが常に「はい」を返す実装が2件（**9.8**）。エージェントが読むテキストがホストのコマンドになり、LLM・クラウドの鍵ごと持ち出される | 更新（**EvoScientist 0.2.5**）またはヘッドレスでゲートを検証 → [`docs/19` §6](docs/19-snapshot-0730jst.ja.md) |
| **コンテナや共有カーネルを動かしている** | **Infinity Core**: コンテナからホストへ抜ける root 取得 PoC が5件公開。timer / signal / mm / futex / scheduler のコード。先にローカルでのコード実行が必要 — それは侵害された依存パッケージが与える | カーネルを更新し**再起動** → [`docs/20`](docs/20-infinity-core.ja.md) |
| **Node.js を 20.x で動かしている** | 20 は EOL。修正が来ない | **22.23.4 / 24.22.1 / 26.12.1** へ → [`docs/02`](docs/02-nodejs-oct2026.ja.md) |

### 0-3. 言葉の言い換え（このリポジトリでよく出る言葉）

| 言葉 | かみ砕くと |
|---|---|
| **CVSS 10.0** | 満点。「ログイン不要・遠隔から・コード実行」 |
| **KEV** | 米 CISA が「実際に悪用された」と確認した一覧。**載っていない＝安全ではない** |
| **影響版 / 修正版** | 「今危ない版」と「上げれば直る版」。混同すると、直したつもりで漏れる |
| **中間CA** | 証明書を発行する権限。鍵が漏れると、そのCAが発行したのと同じ偽証明書を作れる |
| **サプライチェーン攻撃** | ライブラリやビルド環境側に侵入して、正規の配布物を汚染する手口 |
| **ローテート** | 秘密を新しく作り直し、古いものを無効にする |

### 0-4. 迷ったら、この3行

1. **そのソフトを自分で動かしている？** → いいえ、で読了。
2. **インターネットから届く？** → いいえ、で優先度を下げる。
3. **実際に悪用されている？（KEV）** → いいえ、で「今日中」ではなく「今週中」。

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

**タップで進むブリーフィング（Web）**: <https://2026-incident-briefing.pages.dev> — 15件を時系列に、
そのあと **10-23 の追記7件**（[`docs/20`](docs/20-infinity-core.ja.md) /
[`docs/21`](docs/21-snapshot-1036jst.ja.md) / [`docs/22`](docs/22-snapshot-2015jst.ja.md): Infinity Core、
開示の盲点、エコシステム、Node2Shell、開示前の試行、CNA の 9.9 が通らないフィルタ、CVE 一覧が
名指ししない4件、PHP の後続 CVE-2026-115560）。全34シーン、すべての図を実3Dで構築（ドラッグ／スワイプで視点を回転、ダブルタップで正面に戻る）、効果音と infosec.mp3 のBGM。音が出ます（右上の SOUND で消せます）。
**言語はプルダウンで12言語**（English / 日本語 / 中文 / 한국어 /
Español / Français / Deutsch / Português / Русский / العربية / हिन्दी / Bahasa Indonesia。`?lang=` / `L` キー）。
スマホはタップで進む／ドラッグで視点回転、PCはスペース／←→とドラッグで視点回転。

対応用は「まず読み取り専用」「§2-3 の表で分岐」「バージョンは実行中のバイナリで確認」
「部分的な緩和を修正と呼ばない」を守らせる。判断用は「まずデータを再取得」「影響版と修正版を
分ける」「主張ごとに出所と取得日」「空白を記憶で埋めない」を守らせる（[`docs/08`](docs/08-intel-sources.ja.md)）。

---

2026年10月後半の1週間に重なった7件（**PHP の RCE**、**GitLab の CVSS 10.0**、
**LiteLLM のサプライチェーン侵害**、**Railway の環境変数漏えい**、**OpenCode の鍵失効**、
**Oracle Java の四半期パッチ**、**eMudhra の CA 鍵8本**）について、事実・一次ソース・
再現手順・実行できる防御ツールをひとまとめにした記録です。**読むため**と、**手を動かすため**の両方に使えます。

**データ基準時点**: **2026-10-23 10:36 JST**（2026-10-23 01:36 UTC）— この週の4回目にして、
はじめて**広く**取った取得です（全深刻度、パッケージエコシステム、開示チャネル）。結果は
[`docs/21`](docs/21-snapshot-1036jst.ja.md)、夜間の差分は
[`docs/19`](docs/19-snapshot-0730jst.ja.md)。下記の製品に新しいパッチが出ていないことは
Node.js・PHP・GitLab・Tomcat・httpd・BIND・Plex・Oracle のリリース索引で確認済みですが、
**カーネル**の状況は変わりました: [`docs/20`](docs/20-infinity-core.ja.md)。

---

## 1. 今週の全体像（15件）

| 事案 | 何が起きたか | 深刻度 | 該当する人 | 修正・対処 | 詳細 |
|---|---|---|---|---|---|
| **php2shell** | PHP 本体の RCE 2件。5.4.0 以降の全リリース | **9.2** Critical | PHP を公開している | **8.5.12 / 8.4.27 / 8.3.36 / 8.2.35**（10-21） | [`01`](docs/01-php2shell.ja.md) |
| **GitLab** | 正規表現エンジンの整数オーバーフロー → 未認証 RCE。**7.0（2014年）以降すべて** | **10.0**（満点） | self-managed を運用 | **19.5.1 / 19.4.3 / 19.3.6 / 19.2.9 / 19.1.9 / 19.0.10 / 18.11.13**（10-21） | [`09`](docs/09-gitlab-19-5-1.ja.md) |
| **LiteLLM** | 1.107.0 の wheel が Python 起動時に資格情報を窃取＋遠隔ローダ | GHSA 未公開 | `pip` / Docker で導入した | **1.106.2 に戻す**＋全資格情報ローテート | [`10`](docs/10-litellm-1-107-0.ja.md) |
| **Plex Media Server** | 5件（パストラバーサル／SSRF 2件／プラグイン呼び出し／管理権限のファイル書き込み→起動時実行）。**KEV 収載** | 4.3〜7.2 | Plex を外部公開している | **1.43.3.10861** へ＋トークンローテート | [`12`](docs/12-plex-oct2026.ja.md) |
| **ISC BIND 9（DNS）** | GSS-TSIG の署名済み UDP を**再送**されると `named` のメモリが壊れ、RCE の可能性。**回避策なし** | 8.1 | AD/Kerberos 連携 DNS を運用 | **9.20.30 / 9.21.27**（S1 は 9.20.30-S1）へ | [`18`](docs/18-bind-cve-2026-94300.ja.md) |
| **Linux カーネル（LKML）** | 6件の脆弱性報告が非公開リストではなく**公開 LKML** に流れた。SMB Direct と ksmbd はリモート RCE（9.0） | 9.0 | カーネル運用・SMB / NVMe-oF | **未修正**（10-22 時点）。distro カーネルを追従、不要な `ksmbd` を停止 | [`17`](docs/17-lkml-oct2026.ja.md) |
| **Apache（Tomcat / httpd / Traffic Server）** | Tomcat は認証バイパス＋利用者間の応答混線（HTTP/2・AJP）、httpd は 2.4.69、Traffic Server はスマグリング2件 | 9.1 / 8.9 | Tomcat・httpd を運用 | **11.0.27 / 10.1.61 / 9.0.123**、httpd **2.4.69** | [`15`](docs/15-apache-oct2026.ja.md) |
| **Railway** | 顧客の環境変数（＝秘密）が復号された可能性。デプロイ停止 | — | Railway にデプロイ | 環境変数・レジストリ資格情報を全ローテート | [`11`](docs/11-week-of-oct-20.ja.md) |
| **OpenCode** | Console 事案でプロバイダキーが露出、利用者のキーが失効（利用者報告） | — | OpenCode を利用 | プロバイダキーを再発行し利用履歴を確認 | [`11`](docs/11-week-of-oct-20.ja.md) |
| **Oracle Java SE** | 10月 CPU で55件。最大 7.5、KEV 未収載 | 7.5 | JVM を動かしている | **8u511 / 11.0.33 / 17.0.21 / 21.0.13 / 25.0.5 / 27.0.1**（10-20） | [`07`](docs/07-oracle-java-oct2026.ja.md) |
| **eMudhra CA** | 中間CA **8本**の秘密鍵が **3〜8ビット**しかない（`4, 56, 66, 115, 155, 156, 230, 237`）。2025-04-30 の鍵生成で wrap/unwrap が誤り、24本の下位CAのうち8本に弱い鍵 | PKI | CA バンドルを自前で持つ | `ca-certificates` / `certifi` / Go / NSS を更新 | [`03`](docs/03-emudhra-ca.ja.md) |
| **Node.js** | 10月分の CVE 9件。CA バンドル更新も同梱。**Brotli の脆弱性に、公式 24.22.0 ビルドで動く公開 Exploit が出た** | high（NVD の CVSS 4.0 は 9.2） | Node 22 / 24 / 26。**20 は EOL** | **22.23.4 / 24.22.1 / 26.12.1**（10-21）。コンテナも含む | [`02`](docs/02-nodejs-oct2026.ja.md) |
| **Linux カーネル「Infinity Core」** | 中核処理（timer / signal / mm / futex / scheduler / SLAB）の LPE 6件。**5件で root 取得 PoC が公開**、同じ5件でコンテナ脱出 | 各 7.8（6件中4件にスコア） | 共有ホスト、k8s ノード、CI ランナー | **上流で修正済み** — 6.6.158 / 6.12.112 / 6.18.54 / 7.2.8、スケジューラは 7.2.9。**要再起動** | [`20`](docs/20-infinity-core.ja.md) |
| **Arista VeloCloud Orchestrator** | SQL インジェクションが **0-day として悪用中**。ログイン済みなら（最小は読み取り専用）ローカル superuser になれる | **9.9** | オンプレの VCO を運用 | **5.2.3.18 / 6.1.3.10 / 6.4.2.12**（Hosted は修正済み） | [`22` §4](docs/22-snapshot-2015jst.ja.md) |
| **PHP の後続** | `CVE-2026-115560`: 別の RCE 経路。**緊急修正は無し** — PHP は「可能性は低い」として次の定期リリースを待つ | 未採点・未収載 | 実行中に `session.serialize_handler` を切り替え、upload progress を有効にしている PHP アプリ | **`session.upload_progress.enabled=0`**（10-21 の緩和と同じ1行） | [`23`](docs/23-php-cve-2026-115560.ja.md) |

15件は**独立**しています。PHP を直しても GitLab は直らず、CA も Java も、カーネルの2つの集合も別です。

この表は「名前が付いた事案」だけです。**2週間 CRITICAL スイープは 120 → 125 → 104 → 98 と
動きました** — 同じクエリ・同じ製品です。直近2回は公開日の窓も同じ 10-09…10-23 なので、6件減は
修正ではありません。NVD の深刻度フィルタは自分（Primary）の CVSS 3.x しか数えないため、CNA の
スコアしか持たないレコードは落ちます。悪用確認済みは一貫して1件。そして今日もっとも重い2件は、
この一覧に**出てきません**: 悪用された Node の Brotli は CVSS 4.0 のスコアしか持たず、Arista の
9.9 は CNA の 3.1 スコアしか持ちません。絞り込みの手順と残った12件は
[`docs/13`](docs/13-recent-criticals.ja.md)、数字が動いた理由（再評価、CNA のスコアしか持たない行を
深刻度フィルタが数えないこと、修正済みの収集バグ）は同 §9 にあります。
[`docs/21` §1.2](docs/21-snapshot-1036jst.ja.md) は、同じ教訓がこの README 自身の数字で起きた例です。

前回の取得に対して、このスナップショットが訂正するものが2つあります（[`docs/19`](docs/19-snapshot-0730jst.ja.md)）。
**NVD は `CVE-2026-109619` を 9.8 → 8.1 に下げました**（攻撃の複雑さの判断で、影響度も修正内容も
変わらない）。そして**収集ツールが CNA のスコアを採用していた**行がありました。入れるべき版は
どちらでも変わりません。

ただし今週を特徴づけるのは**鍵の窃取**です。Railway・LiteLLM・OpenCode の3件は、
「AI 推論プロバイダの資格情報」という同じ獲物を狙う同じ形をしています。この読み方は
[`docs/11` §5](docs/11-week-of-oct-20.ja.md) にまとめました。

**php2shell と GitLab が「今日」**です。理由は (a) 攻撃コードや悪用の現実性、(b) 修正が
アプリ側では消えない、(c) 露出しているだけで到達される、の3点。

### 機械可読サマリ

```yaml
as_of: 2026-10-23T13:25Z          # 2026-10-23 22:25 JST
php:
  cves: [CVE-2026-109618, CVE-2026-109619]
  cvss_v4: 9.2
  nvd_cvss_v31: { CVE-2026-109618: 9.8, CVE-2026-109619: 8.1 }   # 109619 は 2026-10-22T21:17Z に再評価（AC:L → AC:H）
  epss_2026-10-22: { CVE-2026-109618: 0.0531, CVE-2026-109619: 0.0576 }   # 14日窓の最高値
  affected: ">=5.4.0"
  fixed: { "8.5": "8.5.12", "8.4": "8.4.27", "8.3": "8.3.36", "8.2": "8.2.35" }
  followon:
    cve: CVE-2026-115560
    affected: "未公表（実行時の session.serialize_handler 切り替え＋session upload progress）"
    fixed: "無し — 次の定期リリース"
    mitigation: "session.upload_progress.enabled=0"
    nvd: "2026-10-23T13:24Z 時点でレコード無し"
    in_kev: false
  no_official_fix: "<=8.1 (minimal source backports published for 7.4/8.0/8.1)"
  trigger: "multipart/form-data request body"
  verified_mitigations_partial:
    CVE-2026-109618: "memory_limit=-1 (php_admin_value) + small post_max_size"
    CVE-2026-109619: "session.upload_progress.enabled=0 (+ fatal_error_backtraces=0 on 8.5)"
node:
  latest: { "26": "26.12.1", "24": "24.22.1", "22": "22.23.4" }
  eol_no_fix: "20.x"
  exploited_build: "24.22.0 (Linux arm64) — Imperva の PoC、2026-10-22。24.22.1 は同じ入力を拒否"
  in_the_wild: false              # CVE-2026-111497 の実環境での悪用報告は 2026-10-23 時点で無し
java:
  cpu: "2026-10"
  cves: 55
  remote_no_auth: 49
  max_cvss: 7.5
  affected: ["8u503", "8u503-perf", "11.0.32.1", "17.0.20.1", "21.0.12.1", "25.0.4.1", "26.0.2", "27"]
  fixed:    ["8u511", "11.0.33", "17.0.21", "21.0.13", "25.0.5", "27.0.1"]   # 2026-10-20
  temurin:  ["17.0.21+9", "21.0.13+9", "25.0.5+8"]   # 2026-10-22 公開。8u504 / 11.0.32.1 は8月ビルドのまま
  no_fix:   "26 (26.0.3 does not exist; move to 27)"
  in_kev: false
ca:
  event: "eMudhra intermediate CA keys compromised"
  count: 8                       # 6 TLS (DV/OV/EV x2) + 2 code signing
  cause: "insufficient randomness in the April 2025 ceremony; keys are small integers"
  roots: ["emSign ECC Root CA - G3", "Sectigo AAA Certificate Services (cross-sign)"]
  ct_caveat: "CT only covers TLS; the 2 code-signing CAs are not CT-logged"
  action: "update ca-certificates / certifi / Go / NSS / runtime bundles"
gitlab:
  cve: CVE-2026-110264
  cvss: 10.0
  affected: ">=7.0"
  fixed: ["19.5.1", "19.4.3", "19.3.6", "19.2.9", "19.1.9", "19.0.10", "18.11.13"]
litellm:
  bad: "1.107.0"
  current: "1.106.2"
  files: ["cook.pth", "cook.py", "sitecustomize.py"]
railway:
  event: "customer environment variables possibly decrypted"
  action: "roll every env var and registry credential"
plex:
  cves: [CVE-2026-96651, CVE-2026-96652, CVE-2026-96654, CVE-2026-96655, CVE-2026-96656]
  fixed: "1.43.3.10861"
  current: "1.43.5.11029"        # Plex が配布している版。どちらでも KEV の下限は満たす
  kev: [CVE-2026-96652, CVE-2026-96654, CVE-2026-96655, CVE-2026-96656]
  kev_due: "2026-10-23 (96654, 96656) — このスナップショット時点で本日。フォレンジックトリアージ必須"
opencode:
  event: "Console incident; provider keys exposed, user keys revoked"
  published_by_vendor: false
recent_criticals:
  window: "2026-10-09..2026-10-23"   # 窓は時計とともに動く: 9時間で 120 -> 125 -> 104
  total: 104
  ge_9_8: 55
  in_kev: 1
  epss_max_in_window: 0.0531     # CVE-2026-109618（109619 は 0.0576 だが CRITICAL の外）
  caveat: "cvssV3Severity は NVD が解析済みの行だけを数える。CNA のスコアしか無い行は見えない"
msrc_2026_oct:
  entries: 2937                  # 2026-10-23 に +353。すべて Chromium のコンポーネント CVE
  cve_entries: 2936
  exploited: [CVE-2026-96951]    # 4回の再公開を通じて1件のまま
  publicly_disclosed: [CVE-2026-108398, CVE-2026-92707]
kernel_infinity_core:            # docs/20
  cves: [CVE-2026-98260, CVE-2026-98256, CVE-2026-89754, CVE-2026-80775, CVE-2026-98385, CVE-2026-97941]
  impact: "LPE とコンテナ脱出（5件）。CVE-2026-97941 はカーネルパニック"
  nvd_cvss: { scored: 4, score: 7.8, unscored: 2, status: Received }
  fixed_stable: ["6.6.158", "6.12.112", "6.18.54", "7.2.8"]      # CVE-2026-98260。スケジューラは 7.2.9
  current_stable: ["7.2.12", "6.18.58", "6.12.114", "6.6.160", "6.1.190"]
  in_kev: false
  disclosure: "oss-security 2026-10-16T16:00Z（2026-10-17 01:00 JST）"
```

```yaml
# 2026-10-23 10:36 JST 追加 — 広域スイープ（docs/21）
broad_sweep:
  nvd_published_24h: { total: 381, ge_9_0: 54, analysed_by_nvd: 0, with_cpe: 0, with_epss: 71 }
  nvd_modified_6h: { total: 665, analysed: 144, deferred: 303 }
  ghsa_24h: { advisories: 58, critical: 5, high: 26, npm_entries: 67, pip_entries: 28 }
  feeds: 13
  headlines_without_a_cve:
    - "npm next: 未認証 RCE（use cache） -> 16.4.1"
    - "npm next: 未認証 RCE（画像最適化 + SVG） -> 15.5.28 / 16.4.1"
python_ca_floors:               # 2026-10-22、oss-sec。certifi/pip/uv/sigstore は PyPI で確認
  certifi: "2026.10.19"
  pip: "26.2.2"
  uv: "0.13.4"
  sigstore: "4.5.1"
  conda: "26.9.4"
  pixi: "0.82.1"
  note: "削除されたのは emSign の『ルート』。中間CAだけではない。イメージはキャッシュ無効で再ビルド"
agent_approval_gates:            # docs/19 §6
  cves: [CVE-2026-109444, CVE-2026-77930]   # 9.8, 9.8 — OpenSRE / EvoScientist
  fixed: { EvoScientist: "0.2.5", OpenSRE: "以降の日付版" }
```

<details>
<summary><b>供給網の15件（2026年10月）— 検証済みの一覧を開く</b></summary>

| # | 事案 | 何が起きたか（かみ砕くと） | 状態 |
|---|---|---|---|
| 1 | Railway | 顧客の環境変数（＝秘密）が復号された可能性。全ローテート | ベンダ |
| 2 | LiteLLM 1.107.0 | 入れた時点で侵害。Python 起動のたびに資格情報を窃取 | 研究＋ベンダ |
| 3 | Zeabur | 内部資格情報の漏えい → クラスタとGCP機の環境変数を読まれる。2か月で2回目 | ベンダ |
| 4 | OpenCode | Console 事案でプロバイダキーが露出、キー失効。勧告は未公開 | 利用者報告 |
| 5 | OVHcloud CLI | 公式リリース資産が94分間だけ差し替え（v0.11.0〜v0.15.0） | ベンダ（GHSA） |
| 6 | Rank Math PRO | 3.0.123 の一部にマルウェア。修正 3.0.124（CVE-2026-111862、9.8） | 研究＋ベンダ |
| 7 | TeamUpdraft | 顧客DBを読まれ、接続キーで WordPress へ悪性プラグインを投入 | ベンダ＋研究 |
| 8 | ConnectWise | クラウドバックアップの身元侵害——**10/25調査で一次確認** | [最新の調査・対策](docs/25-snapshot-20261025.ja.md) |
| 9 | Tensorlake (npm) | `tensorlake@0.5.144`。窃取＋ワーム＋失効させると `$HOME` を消す罠 | 研究 |
| 10 | SubQuery (npm) | `@subql/common@5.8.3`。インストール時と import 時に資格情報を収集 | 研究 |
| 11 | GhostAction | 偽 `security-audit.yml` が345リポジトリの秘密と履歴を外部送信 | 研究 |
| 12 | PHP | php2shell、5.4.0 以降の全リリース | ベンダ |
| 13 | Node.js | 22.23.4 / 24.22.1 / 26.12.1 で修正 | ベンダ |
| 14 | eMudhra | 中間CA 8本の秘密鍵が弱すぎる（1本は `4`） | ベンダ＋研究 |
| 15 | Tailscale | 当該中間CAを信頼していた。v1.104.2（Go 1.27.3）で修正 | ベンダ |

15件のうち **14件は一次ソースで確認済み**、ConnectWise だけ確認できていません。
共通点は「何のコードが動くかを決める信頼」の側が壊れたこと——詳細と対策は
[`docs/14`](docs/14-supply-chain-oct2026.ja.md)。

</details>

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
| self-managed の GitLab が修正版未満 | **本日対応** | §2-4-F |
| `litellm==1.107.0` を入れた（Docker タグがそれを指した場合も） | **侵害済み** | §2-4-G |
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

- **Temurin / Corretto / Zulu は Oracle より遅れます。ただし Temurin は5ライン中3ラインで追いつきました。**
  2026-10-23 時点で Adoptium は `17.0.21+9` / `21.0.13+9` / `25.0.5+8` を公開しています
  （2026-10-22 12:07〜17:28 UTC にアップロード）。8 と 11 は8月ビルド（`8u504` / `11.0.32.1`）のままで、
  **番号は Oracle（`8u511` / `11.0.33`）と対応しません。** 番号を翻訳せず、そのベンダの
  リリースノートを読んでください。Corretto / Zulu は未確認です。
- コンテナは**修正版タグで再ビルド**。起動中のコンテナに JRE を差し込まない。
- 上げたあとは `java -version` の**ビルド文字列**（`21.0.13+10`）で確認する。

55件の内訳、Note 1/2/3 の読み方、Java が潜む場所の一覧は
[`docs/07-oracle-java-oct2026.ja.md`](docs/07-oracle-java-oct2026.ja.md)。

### 2-4-F. self-managed GitLab を更新する

CVSS 10.0 の未認証 RCE で、7.0 以降すべてが該当。詳細は `docs/09`。要点だけ:

```bash
sudo gitlab-rake gitlab:env:info 2>/dev/null | head -5     # 何を動かしているか
sudo apt install --only-upgrade gitlab-ee                  # Debian/Ubuntu のリポジトリ導入
sudo gitlab-ctl reconfigure
```

修正版: **19.5.1 / 19.4.3 / 19.3.6 / 19.2.9 / 19.1.9 / 19.0.10 / 18.11.13**。
2026-10-12 にパッチを当てていても該当します（修正版はその1つ上）。公開された回避策は
ありません。上げられないならインターネットからの到達性を外し、GitLab の検知2つ
（"Onigmo native worker crash" / "Org mode render error burst"）を有効にしてください。

### 2-4-G. LiteLLM 1.107.0

入れたこと自体が侵害です。ペイロードは Python 起動のたびに走ります。**先に `pip` を実行しないで
ください**——そこで再実行されます。

```bash
python3 - <<'INNER_PY'
import site, pathlib
for d in set(site.getsitepackages() + [site.getusersitepackages()]):
    for n in ("cook.pth", "cook.py", "sitecustomize.py"):
        p = pathlib.Path(d)/n
        if p.exists(): print("HIT", p, p.stat().st_size)
INNER_PY
```

そのうえで全 site-packages から該当ファイルを削除し、常駐デーモンを止めて、版を固定して入れ直す:

```bash
pip install 'litellm==1.106.2'
```

外部送信は成立したものとして扱ってください。インスタンス／タスクの IAM ロール、プロキシ DB の
全プロバイダキー、マスター／仮想キー、`DATABASE_URL`、そのホストの環境にあった秘密を
ローテートします。完全なチェックリストは `docs/10` §4。

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
[`docs/08-intel-sources.ja.md`](docs/08-intel-sources.ja.md) に、研究者／業界フィード13本・
公式フィード4本のカタログと、2026-10-23 時点のスナップショット（KEV 直近33件、MSRC 2,584
エントリ、JVN 20件）を置いてあります。手で写した数字は載せていません。

```bash
tools/intel/fetch-intel                       # data/YYYY-MM-DD/ に全部取得（python3 標準ライブラリのみ）
tools/intel/fetch-intel --sources oracle,kev  # 一部だけ
tools/intel/fetch-intel --out /tmp/intel      # 別の場所に
```

- 取得結果は [`data/2026-10-22/`](data/2026-10-22/) にあります（Oracle Java 55件、GitLab 勧告を
  CVE 単位に構造化したもの、LiteLLM 事案記録の逐語、KEV 差分、MSRC、JVN、13本のフィード）。
- 取得元に `gitlab` / `litellm` / `csaf` / `nvd-critical` を追加したので、`docs/09`・`docs/10`・
  `docs/12`・`docs/13` の表も他と同じ手順で作り直せます。
- `nvd-critical` は NVD の CRITICAL を期間で抜き、KEV と EPSS を付けて出力します（`--critical-days`）。
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
| [`docs/09-gitlab-19-5-1.ja.md`](docs/09-gitlab-19-5-1.ja.md) | CVE-2026-110264（CVSS 10.0）: 影響／修正ブランチ、「先週パッチ済み」の罠、検知 |
| [`docs/10-litellm-1-107-0.ja.md`](docs/10-litellm-1-107-0.ja.md) | LiteLLM 1.107.0: ペイロードのファイル、検出、対処の順序、3月の前例 |
| [`docs/11-week-of-oct-20.ja.md`](docs/11-week-of-oct-20.ja.md) | vx-underground のリストを検証: Railway、OpenCode、「鍵が狙われている」の整理 |
| [`docs/12-plex-oct2026.ja.md`](docs/12-plex-oct2026.ja.md) | Plex の5件（KEV、連鎖、期限）、NAS のパッケージ遅延、トークンローテート |
| [`docs/13-recent-criticals.ja.md`](docs/13-recent-criticals.ja.md) | 直近2週間の CRITICAL 120件の走査、残った12件、データの4つの罠 |
| [`docs/14-supply-chain-oct2026.ja.md`](docs/14-supply-chain-oct2026.ja.md) | 供給網の15件を1件ずつ検証（14件確認・1件未確認）、8件の詳細、統制の表 |
| [`docs/15-apache-oct2026.ja.md`](docs/15-apache-oct2026.ja.md) | Apache の10月分: Tomcat 3件・httpd 2.4.69・Traffic Server、深刻度ラベルと CVSS の食い違い |
| [`docs/16-snapshot-2120jst.ja.md`](docs/16-snapshot-2120jst.ja.md) | 2026-10-22 21:20 JST の再取得。KEV 据え置き / MSRC 2,575→2,578 / CRITICAL 120→124 / Plex 最新版 |
| [`docs/19-snapshot-0730jst.ja.md`](docs/19-snapshot-0730jst.ja.md) | 2026-10-23 07:25 JST の再取得。NVD が PHP の CVE 1件を 8.1 へ / MSRC +6（うち3件が 10.0）/ 収集ツールの CNA スコア誤読 / エージェントの許可ゲート 2件 |
| [`docs/20-infinity-core.ja.md`](docs/20-infinity-core.ja.md) | **Infinity Core**: カーネル中核の LPE 6件、root 取得 PoC とコンテナ脱出、既に出ている修正、そして `docs/17` の6件とは別物であること |
| [`docs/21-snapshot-1036jst.ja.md`](docs/21-snapshot-1036jst.ja.md) | 2026-10-23 10:36 JST の広域スイープ。24時間で公開381件・NVD 解析ゼロ、更新665件、パッケージ勧告58件、そして Infinity Core を隠した盲点 |
| [`docs/22-snapshot-2015jst.ja.md`](docs/22-snapshot-2015jst.ja.md) | 2026-10-23 20:15 JST、これまでで最も広い取得。**Node2Shell**（公式 Node.js ビルドで動く Exploit）、**10-17 から試行されていた php2shell**、Arista VCO、KSMBD、カプコンとお名前.com、そして深刻度フィルタに見えない2件 |
| [`docs/23-php-cve-2026-115560.ja.md`](docs/23-php-cve-2026-115560.ja.md) | `CVE-2026-115560`: 4つの条件、1行の緩和、そして PHP が言っていないこと（影響版・スコア・修正版・NVD レコードのすべてが無い） |
| [`docs/17-lkml-oct2026.ja.md`](docs/17-lkml-oct2026.ja.md) | Linux カーネルの6件が公開 LKML へ。SMB Direct / ksmbd の 9.0、未修正、露出削減、検証できたこと・できなかったこと |
| [`docs/18-bind-cve-2026-94300.ja.md`](docs/18-bind-cve-2026-94300.ja.md) | BIND 9 の GSS-TSIG リプレイ（CVSS 8.1、回避策なし）、影響版と修正版、設定の確認方法 |
| [`runbooks/php2shell.ja.md`](runbooks/php2shell.ja.md) | 検知 → 遮断 → 修正 → 検証 → 侵害時対応 |
| [`runbooks/nodejs.ja.md`](runbooks/nodejs.ja.md) | 監査 → コンテナ修正 → ホスト修正 → ロールバック |
| [`tools/php2shell/`](tools/php2shell/) | `p2s-audit` / `-mitigate` / `-hunt` / `-patch` / `-edge` / `-watch`、ini、systemd unit、selftest |
| [`tools/node/nodefix-audit`](tools/node/nodefix-audit) | Node ランタイムの版監査（修正版未満を列挙） |
| [`tools/intel/fetch-intel`](tools/intel/fetch-intel) | 一次ソースの回収（Oracle CPU / KEV / JVN / MSRC / フィード13本 / NVD 広域スイープ / GHSA）→ JSON |
| [`tools/copy-prompt.sh`](tools/copy-prompt.sh) | AI に渡すプロンプトをクリップボードへ（`en` / `ja` / `intel` / `intel ja`） |
| [`prompts/`](prompts/) | コピペ用プロンプト（対応用・判断用、英語版・日本語版） |
| [`data/2026-10-23-2015jst/`](data/2026-10-23-2015jst/) | この回の生データ15ファイル（Oracle、KEV、MSRC、JVN、フィード14本、ニュース2本、保存した X 投稿、NVD スイープ、GHSA） |
| [`site/`](site/) | タップ進行のブリーフィングサイト（<https://2026-incident-briefing.pages.dev>）。擬似3D・自作SFX・生成Lofi |
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

このリポジトリは **2026-10-23 22:25 JST 時点のスナップショット**です。脆弱性情報は数日で古くなります。

- バージョン判定は必ず**実行中のバイナリ**で行う。タグ・イメージ名は信用しない。
- 数日以上経っているなら、まず `SOURCES.ja.md` の一次ソースを叩き直す。まとめてやるなら
  `tools/intel/fetch-intel`（`docs/08`）。
  特に Node.js の `dist/index.json` と PHP のリリース一覧は、見るだけで最新が分かります。
- **数値は暗記しない。** `data/` の件数は取得時点のもので、MSRC の CVRF のように再公開で
  動きます（`docs/05` は 2,578、同じ文書の 2026-10-21 再公開は 2,575）。取り直して比べること。
- 修正版が上がっていれば、この README の表より**上流を優先**してください。

## 8. ライセンス

MIT（[`LICENSE`](LICENSE)）。引用した一次ソースの権利は各提供元に帰属します。
