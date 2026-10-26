# 固定窓の一次収集: 2026-10-26 10:27 JST

対象窓は前回締切 2026-10-25 23:18 JST（2026-10-25T14:18:00Z）から今回締切 2026-10-26 10:27 JST（2026-10-26T01:27:00Z）。取得は締切後 01:30 UTC 以降。原本は `data/2026-10-26-1027/`、URL・取得開始時刻・SHA-256・失敗は `collection-summary.json`、重複計算は `analysis.json`。gzip の SHA-256 は展開後原本の値。45原本のhashを実ファイルから照合した。

再取得: `python3 tools/intel/snapshot-1027.py`。再取得時の現行改訂が返るため過去時点の状態の再現ではない。NVDは全深刻度・全ページ、GHSAは published 窓・全ページを取得。境界はAPI指定上inclusiveであり、隣接窓の単純加算は避ける。脆弱性登録・更新数は侵害の発生件数ではない。網羅性はこの取得対象と成功した応答に限る。

## 件数と重複

|収集|結果|解釈|
|---|---:|---|
|NVD published|28件 / 一意28 CVE|全件 Received。公開日時が窓内にあるレコード|
|NVD lastModified|4,276件 / 一意4,276 CVE|2,000+2,000+276件の3ページ、既存情報の更新を含む|
|published ∩ modified|28 CVE|published全件がmodified内、NVDの和集合は4,276件|
|GHSA published|93件 / 一意93 CVE|全件 type=unreviewed、reviewed新規告知93件ではない|
|GHSA ∩ 今回NVD published|20 CVE|NVDとの重複あり|
|GHSA ∩ 今回NVD modified|24 CVE|API集合を足さない|
|GHSA ∩ 前回NVD published|73 CVE|前回公開分がGHSAに後追い登録されたもの|
|今回NVD・GHSAのCVE和集合|4,345 CVE|「新規事件4,345件」ではない|

GHSA severity内訳: critical 2、high 27、medium 43、low 16、unknown 5。NVD modifiedの状態は Analyzed 1,979、Deferred 1,879、Modified 236、Awaiting Analysis 138、Received 29、Undergoing Analysis 15。NVDのpublished/modified全URL・ページhashは収集manifest参照。[NVD API](https://services.nvd.nist.gov/rest/json/cves/2.0)、[GitHub Advisory API](https://api.github.com/advisories)。

CISA KEV は catalogVersion `2026.10.23`、dateReleased `2026-10-23T19:30:18.9209Z`、1,756件。前回取得と展開後SHA-256が同一であり、今回の取得でカタログ追加は認めなかった。[CISA公式ミラー原本](https://raw.githubusercontent.com/cisagov/kev-data/develop/known_exploited_vulnerabilities.json)。KEVに無いことは悪用不存在を意味しない。

## 編集上の重要な訂正と新しい一次情報

### PHP: 政府侵害のCVE帰属を撤回

Unit 42の現行本文は「October 25 Update」とし、欧州政府機関で脆弱なPHPアプリケーションの文脈の攻撃を観測したものの、初期侵入がPHP2Shellの特定CVEか確認できず、10月23日の更新を撤回したと明記している。したがって政府機関の侵害をPHP2Shellの確認済み悪用として引き続き断定してはいけない。元記事公開は10月23日、訂正は10月25日付、正確な訂正時刻は本文から特定していない。今回の取得が初めて訂正を確認した時刻であって、事件発生日時ではない。原本 `unit42-php.html.gz`。[Unit 42原文](https://unit42.paloaltonetworks.com/cve-2026-109618-cve-2026-109619/)。

### .NET: 10月13日告知に含まれなかった修正をOOBで補完

公式 `dotnet/announcements` issue 493は作成 `2026-10-25T18:50:05Z`（10月26日03:50:05 JST）、更新 `19:23:37Z`（04:23:37 JST）。今回の締切前。CVE-2026-70197はWindowsのSystem.Net.SocketsにおけるIPv4/IPv6 datagram間のSocketAsyncEventArgs再利用で、キャッシュ済みネイティブアドレスバッファが小さすぎるまま残るOOB write。10月13日に脆弱性を告知したが前回updateにfixが入っておらず今回補正したと説明する。告知上の修正版は8.0.33、9.0.22、10.0.14、11.0.0-rc.3.26522.148。High/CVSS3.1 8.1。新規CVEではなく修正提供の訂正。NVDレコードも今回modifiedに含まれ、publishedは10月13日。原本 `dotnet-oob.html` はGitHub API JSON。[公式告知](https://github.com/dotnet/announcements/issues/493)、[API原本](https://api.github.com/repos/dotnet/announcements/issues/493)。

### Perl: Starman / HTTP::Server::PSGI

CPAN Security Groupの署名者によるoss-sec本文の送信日時はStarmanが10月25日16:57:23 UTC（10月26日01:57:23 JST）、PSGIが16:56:52 UTC（01:56:52 JST）。RSS配信日時は10月26日00:29 UTC、00:27:14 UTCであり、本文送信日時と混同しない。

|CVE|影響と対策|
|---|---|
|CVE-2026-115817|Starman <0.4019、bodyを停止/低速送信してworkerを占有。0.4019以降へ|
|CVE-2026-115822|Starman <0.4019、chunked処理の正規表現でCPU DoS。0.4019以降へ|
|CVE-2026-115823|Starman <0.4019、HEAD等へbodyを返すことでkeep-alive/proxy上の応答がずれる。0.4019以降へ|
|CVE-2026-115824|Starman <0.4019、chunked bodyの無制限バッファリングでメモリDoS。0.4019以降へ|
|CVE-2026-115825|HTTP::Server::PSGI <1.0056、大きなContent-LengthでOOM/プロセス停止。本文SolutionsはPlack 1.0057以降と明記|

最後の項目は同じ告知内でAffected `<1.0056`、参照release `1.0056`、Solutions `1.0057 or later`が一致しない。対策を書くなら公式本文のSolutionsに合わせ1.0057以降とし、番号不一致を注記する。これら告知は脆弱性の説明で、実被害観測の主張ではない。原本 `oss-starman.html`、`oss-psgi.html`。[Starman告知](https://seclists.org/oss-sec/2026/q4/388)、[PSGI告知](https://seclists.org/oss-sec/2026/q4/387)。MetaCPANリリースページも保存したがページ本文だけでrelease日時を確認できていない。

### GHSA critical 2件は既知告知の後追い収録

Snipe-IT CVE-2026-116199はGHSA unreviewedではcritical（CVSS4 9.2）、CVSS3.1は8.1。ただし元ベンダー告知GHSA-xf36-wx48-5rqpは10月8日15:30:10Z公開でseverity medium。Google SSO有効・メール型username・ローカル無効化済みだがGoogle identityが有効という条件で権限を取り戻せる。既定firstname.lastname形式は非該当とする。8.6.3以降で修正。NVDは10月25日14:17Z、GHSA後追いは15:32:22Z。[ベンダー告知](https://github.com/grokability/snipe-it/security/advisories/GHSA-xf36-wx48-5rqp)、[後追い登録](https://github.com/advisories/GHSA-9cjx-rmhj-qc37)。原本 `snipe-vendor.html` はAPI JSON。

Parse Server CVE-2026-116163もGHSA unreviewedのcritical（CVSS4 9.1、CVSS3.1 7.4）。元GHSA-rq3w-5c6f-p7wrは10月10日02:04:34Z公開。AuthAdapterサブクラスの検証関数が呼ばれない問題で、その形式のcustom adapterを使うアプリが対象。built-in adapterとplain object形式のcustom adapterは対象外。NVD公開は10月25日14:16:55Z、GHSA後追いは15:32:18Z。8.6.102 / 9.10.5-alpha.2が後追い登録の修正版。[ベンダー告知](https://github.com/parse-community/parse-server/security/advisories/GHSA-rq3w-5c6f-p7wr)、[後追い登録](https://github.com/advisories/GHSA-f559-fhp5-c24h)。原本 `parse-vendor.html` はAPI JSON。

## フィード差分と限界

前回原本とhashが変わった一次feedはUnit42、SANS ISC、oss-sec、JVN。SANS新着はYARA-X 1.22.0 releaseであり、インシデント発生とは分類しない。JVN新着Siemens月次アップデートは10月26日09:00 JSTで今回窓内。[SANS](https://isc.sans.edu/diary/rss/33454)、[JVN](https://jvn.jp/vu/JVNVU90141693/)。Siemens個別内容は別の調査ノートを参照。

Project Zero、PortSwigger、Trail of Bits、GitHub Security、Talos、Microsoft Security、DFIR Report、CISA、JPCERT、Imperva、Citizen Labの取得原本は前回hashと同一。Tailworm本文、Tailscale bulletins/changelog/SSH docs、Fortinet記事も同一。ConnectWise HTMLはhashが変わったが、script/style/tagを除去して行単位の本文を比較すると差分なし。GitHubのDokploy/Firecrawlページの可視差分はリポジトリ全体のIssue/PR件数のみ、rotki PRとPaisa releaseは可視本文差分なし。HTML hashの変化だけで新規修正・告知更新を断定しない。

二次feed The Hacker News / BleepingComputerにも変化。BCのAGENTS.md記事は10月25日15:49:38 UTC（10月26日00:49:38 JST）という調査リード。THNの政府PHP悪用見出しより、現在の一次発表の撤回を優先する。二次記事の見出しを一次の観測根拠にしない。

失敗: IPA旧URL `https://www.ipa.go.jp/security/alert/index.html` は404、代替 `https://www.ipa.go.jp/security/security-alert/` は取得成功。Reddit Tailscale反応APIは403 Blockedで保存不可。エラー文字列・URL・取得時刻はmanifestに保存。Reddit反応未取得は公式patch状態の証拠ではない。

PHP 5.4–5.6バックポート議論の新しい返信も保存したが、コミュニティの非公式patchでありPHP Groupの正式修正や旧版の安全保証とは扱わない。[oss-sec返信](https://seclists.org/oss-sec/2026/q4/386)。

追加のNVD published候補（Received、CNA記述段階）: CVE-2026-116102 QuantGeekDev docker-mcp 0.1.0/0.2.0のWindows command構築におけるproject_name OS command injection、CVE-2026-116103/116104 Sony NNabla <=1.39.0 code injection（NVD記述ではmaintainer非サポート製品）、CVE-2026-116095 smg llm-multimodalのJPEGメモリDoS、CVE-2026-116096 llama.cpp Pocket-TTSのローカルOOB write。いずれもこの収集だけでは侵害発生・修正提供・ベンダー確認を断定しない。各IDのNVD原本はnvd-published-0.json.gz参照。
