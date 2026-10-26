# 2026-10-27 00:18 JST — 全深刻度の固定窓収集と一次資料照合

対象は **2026-10-27 00:18 JST / 2026-10-26 15:18 UTC**、前回21:35 JST以降の固定窓は **12:35:00〜15:18:00 UTC**です。取得は00:48 JST以降に行いました。公開・DB収録・改訂・侵入・修正提供・復旧は、それぞれ異なる時刻として扱います。保存した資料は取得時の現行改訂であり、無記載の追記を対象時点の本文へ完全には復元できません。

## 収集結果

| 集合 | 結果 | 読み方 |
|---|---:|---|
| NVD published | 98件 | 全件modifiedにも含まれます。Received 84 / Deferred 14。Rejected 0 |
| NVD modified | 1,048件 | 上記98件と、以前に収録された950件の改訂です |
| GHSA published | 0件 | この窓の新規公開はありません |
| GHSA modified | 19件 | いずれも既存reviewed。新規ゼロデイ公開集合ではありません |
| KEV | 1,756件 | 2026.10.23版。前回原本と展開後バイト列が一致し、追加0です |
| フィード | 取得済み | 窓内新規の一次インシデント確定には使いません。BleepingComputerの.NET記事RSSは15:38 UTCで基準後 |

NVDの98件と1,048件を足し合わせないでください。GHSAの19件のupdatedを、前回21:35の公開件数へ足し直しません。**件数増加は事件増加ではありません。** KEV非掲載は悪用や被害がない証明ではありません。

NVDの `Received` はCNAからの受け取りであり、CVSS確定・悪用確認ではありません。二次記事の通称（HTTP2Shell等）を、HTTP/2プロトコル欠陥の新規CVEとして数え直しません。

## 優先して確認する範囲

導入済みの境界機器・シェル・同梱ランタイム、公開した認証・webhook、テナント境界、機微情報を配信するフィルターから確認してください。バックアップ・秘密情報の失効、PHP/Brotliの更新・侵害調査、従来の境界機器対策も継続します。以下の「差分」には窓内のDB初収録を含み、すべてが今夜の新規発見・新しい侵害という意味ではありません。

### 1. FortiSandbox：代替経路による認証回避（NVD初収録）

**固定窓の追加登録 / 23:16 JST（NVD published 14:16:24 UTC）。**

CVE-2026-107656は FortiSandbox 5.0.0–5.0.6、4.4.0–4.4.9、4.2全版、および対応するPaaS系列について、代替経路・チャネルによる認証回避を説明します。細工したHTTPにより未認可のコードまたはコマンド実行の可能性、とNVD英文は記載します。状態は **Received**。修正版番号はNVD本文から推定しません。FortiGuard PSIRTを照合します。

**確認する対応：** インターネットに管理面を出している場合のみ FG-IR-26-185 を読み、系列ごとの公式修正を照合してください。NVD Received を緊急悪用確定としないでください。

[FortiGuard PSIRT FG-IR-26-185](https://fortiguard.fortinet.com/psirt/FG-IR-26-185)

### 2. Harbor：ProjectAdminのwebhook SSRF

**固定窓の追加登録 / 23:16 JST（NVD published 14:16:28 UTC）。**

CVE-2026-111590は webhook 配送先の検証不足で、ProjectAdmin権限の認証済み利用者がプライベート・リンクローカル宛先を置ける条件です。応答本文が実行ログに残る、と説明されます。任意の未認証利用者による全Harbor侵害ではありません。

**確認する対応：** webhook作成権限と宛先制限を確認し、開発元勧告の修正版を照合してください。

[GitHub勧告 GHSA-2phj-cp9f-qq6w](https://github.com/goharbor/harbor/security/advisories/GHSA-2phj-cp9f-qq6w)

### 3. mongosh：同梱Node.jsのeMudhra中間CA

**固定窓の追加登録 / 00:16 JST（NVD published 15:16:39 UTC）。**

CVE-2026-115930は MongoDB Shell がNode.js同梱のTLSストアを持ち、復旧可能なeMudhra中間CAを含む問題です。対象は **2.14.0未満**。2.14.0は Node.js 24.22.1以降を同梱するとNVDは説明します。npm経由のmongoshはホストNodeの更新が別条件です。Tailscale 1.104.2やNode 24.22.1と同系統のCA不信任であり、Tailworm修正の証明ではありません。

**確認する対応：** 配布経路ごとのmongosh版と、ホストNode版を分けて照合してください。

[MongoDB Shell changelog](https://www.mongodb.com/docs/mongodb-shell/changelog/)

### 4. Google Cloud MCP Toolbox：未認証のファイル持ち出し

**固定窓の追加登録 / 00:16 JST（NVD published 15:16:45 UTC）。**

CVE-2026-93328は googleapis/mcp-toolbox 1.2.0–1.4.0 の cloud-storage source におけるパストラバーサルと認可欠如です。未認証の遠隔攻撃者がホストファイルを外部GCSへ持ち出し、ローカルファイルを上書きできる、とNVDは記載します。状態はReceived。公開している場合のみ優先します。

**確認する対応：** 対象版の公開有無を確認し、PRと配布元の修正を照合してください。

[googleapis/mcp-toolbox PR 3454](https://github.com/googleapis/mcp-toolbox/pull/3454)

### 5. Avocent ACS8000：wsserverのコマンド組み立て

**固定窓の追加登録 / 00:16 JST（NVD published 15:16:41 UTC）。**

CVE-2026-65184は root権限の `wsserver` がWebSocket欄からshellコマンドを組み立て、`system()` / `popen()` へ渡す、というrunZero報告です。公開鍵session経路がアプライアンスsession検査を行わない、とあります。NVD Received。修正版は本調査で確定していません。

**確認する対応：** 該当アプライアンスをインターネット管理している場合のみ原勧告を読み、ベンダー案内を照合してください。

[runZero advisory](https://www.runzero.com/advisories/avocent-acs8000-wsserver-cmdinj-cve-2026-65184)

### 6. Apache Camel：Saxon XXE と OAuthトークンキャッシュ

**固定窓の追加登録 / 00:16 JST。**

CVE-2026-90885は camel-saxon のXXE。影響は 4.0.0以上4.18.5未満、4.19.0以上4.22.2未満。CVE-2026-94386は Camel OAuth のトークンキャッシュ取り違えで、4.19.0以上4.22.2未満。前回補完したDocling経路とは別条件です。

**確認する対応：** 使っているコンポーネントと系列を 4.18.5 / 4.22.2 以降の公式案内と照合してください。Camel全体の一括RCEとして数えません。

[CVE-2026-90885](https://camel.apache.org/security/CVE-2026-90885.html) / [CVE-2026-94386](https://camel.apache.org/security/CVE-2026-94386.html)

### 7. Mautic 7：upload / SSTI / デシリアライズ / SQLi 等

**固定窓の追加登録 / 23:16 JST台（Deferred）。**

CVE-2026-115188〜115196はMautic 7系の別条件です。キャンペーンimportの無制限upload、Twig sandboxのSSTI、セグメントfilterのデシリアライズ、管理画面AJAXとdashboard APIのSQLi、stored XSS、Asset APIのパストラバーサル、Stats APIの権限、公開formのopen redirect。認証済み権限や特定機能が前提のものが含まれます。未認証の全サーバー侵害として9件を足し合わせないでください。

**確認する対応：** 該当機能を使っている場合のみ、各GHSAの修正版と権限設定を照合してください。

[GHSA-mxjf-pghx-h299](https://github.com/mautic/mautic/security/advisories/GHSA-mxjf-pghx-h299) ほか同系列勧告

### 8. Bandit HTTP/2 ほか：HTTP2Shellとは別

**固定窓の追加登録 / 23:16 JST台。**

mtrudel bandit のHTTP/2・HTTP/1.1実装に、資源枯渇・複雑度・圧縮増幅・リクエスト密輸等の一連がNVDへ入りました。これは **CVE-2026-111497（Brotli decoder）とは別**です。HTTP/2を使うという理由だけでBrotli修正対象へ混ぜません。hackneyの証明書検証・接続枯渇も別記録です。

**確認する対応：** Elixir/Banditまたはhackneyを公開面で使う場合のみ、各CVEの成立条件と配布元修正を照合してください。

### 9. GHSA modified 19件：既存reviewedの改訂

**窓内更新 / 23:07〜00:16 JST。新規公開0。**

aiohttp 3.14.4（Secure cookie）、Keycloak 26.5.5系、kobako sandbox、Grav、Wagtail、Talos Linux support bundle、Dolibarr LFI、ImageSharp TIFF/ICC、PostCSS selector、Open WebUIの古いGHSA再タッチ、Log4j 1-to-2 bridgeのXML出力欠落など。`updated` は本文・パッケージ範囲・関連付けの改訂です。

**確認する対応：** 導入済みなら各GHSAの現行版境界を照合してください。今夜の新規ゼロデイ公開としては数えません。

[aiohttp GHSA-494j-54xm-rwp3](https://github.com/advisories/GHSA-494j-54xm-rwp3)

### 10. Brotli CVE-2026-111497：lastModのみ

**既公表CVEの改訂 / 23:16 JST（lastMod 14:16:28 UTC）。**

publishedは10/22。状態はなお **Awaiting Analysis**。参照追加に見える改訂であり、修正版番号の変更や悪用確定の追記としては読めません。 ImpervaのNode.js公式イメージRCE実証、JFrogの.NET/FFmpeg/ClickHouse/Arrow到達は10/22–25の一次研究です。本窓の「新しいCVE」ではありません。対策の棚卸しは[Brotli追補](26-brotli-http2shell.ja.md)。

[Google CNA](https://www.cve.org/CVERecord?id=CVE-2026-111497) / [JFrog](https://research.jfrog.com/post/brotli2shell-beyond-node2shell-and-http2shell/) / [Microsoft #494](https://github.com/dotnet/announcements/issues/494)

## 既存事案の範囲補完（この窓では版が動いていないもの）

PHP2Shellのhoneypot観測、Huntress token replay、Wiz Gheist、uCreator、Neat段階配信、PAN-OS 11.1 hotfix、Tailwormソースmergeは前回以前の公表です。夜の再報道を新しい被害や発見と数え直しません。KEVのArista VeloCloud Orchestrator（CVE-2026-114625）は dateAdded 2026-10-23 のまま、NVD lastMod がAnalyzedへ進んだ改訂です。

## 参考：対象時点の確定情報へ含めないもの

- GMO第7報の **00:20 JST訂正**（端末調査依頼日 10/23→10/25）。基準の2分後です。
- BleepingComputerの.NET緊急パッチ記事 RSS `pubDate` **15:38 UTC**。一次は10/25の #494 / #493。
- cybersecuritynews.com のHTTP2Shell記事は403。二次報道を権威にしません。

## 取得範囲・原本・限界

保存原本は `data/2026-10-27-0018/` と `data/2026-10-27-0018-vendors/`。再収集は `tools/intel/snapshot-0018.py` と vendors の `collect.py`。後日再実行しても、対象時刻の本文を完全には再現できません。NVD 98＋modified 1,048＋GHSA 19を事件数や被害数へ足し合わせないでください。
