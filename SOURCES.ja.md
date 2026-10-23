# ソースと再取得コマンド

[English](SOURCES.md) | [**日本語**](SOURCES.ja.md)

**原則**: 一次ソース（ベンダの勧告・API・リポジトリ）のみを根拠にする。二次報道を使う場合は
本文で「（二次）」と明記する。来歴が検証できない情報（非公開フォーラム等）は使わない。

## 一次ソース

| 対象 | URL | 何が分かる | 再取得 |
|---|---|---|---|
| PHP 公式勧告 | <https://www.php.net/archive/2026.php#2026-10-21-5> | 2 CVE の公式説明と**有効な緩和** | ブラウザ |
| PHP リリース一覧 | <https://www.php.net/releases/index.php?json&version=8.3> | 修正版の確認（8.2〜8.5） | `curl -s 'https://www.php.net/releases/index.php?json&version=8.3'` |
| php-src NEWS | <https://raw.githubusercontent.com/php/php-src/PHP-8.3.36/NEWS> | 修正の要約（"Avoid state corruption via bailout"） | 同 URL |
| NVD（109618） | <https://services.nvd.nist.gov/rest/json/cves/2.0?cveId=CVE-2026-109618> | CVSS・公式説明 | `curl -s '...' \| jq` |
| NVD（期間指定） | <https://services.nvd.nist.gov/rest/json/cves/2.0> | 期間内の Critical 一覧 | `?pubStartDate=...&pubEndDate=...&cvssV3Severity=CRITICAL` |
| CISA KEV | <https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json> | 悪用確認済みと期限 | `curl -s <URL> \| jq '.vulnerabilities\|length'` |
| CISA 勧告フィード | <https://www.cisa.gov/cybersecurity-advisories/all.xml> | PHP 緊急勧告、#StopRansomware | `curl -s <URL>` |
| Node.js 勧告 | <https://nodejs.org/en/blog/vulnerability/october-2026-security-releases> | CVE 一覧・重大度・依存更新 | ブラウザ |
| Node.js リリース索引 | <https://nodejs.org/dist/index.json> | 各ライン最新版とビルド日 | `curl -s <URL> \| jq -r '.[0:3][]\|"\(.version) \(.date)"'` |
| NodeSource（deb） | <https://deb.nodesource.com/node_22.x/dists/nodistro/main/binary-amd64/Packages.gz> | 配布パッケージの追従状況 | `curl -s <URL> \| zcat \| grep -A2 '^Package: nodejs'` |
| Arch パッケージ | <https://archlinux.org/packages/extra/x86_64/nodejs/json/> | リポジトリの版 | `curl -s <URL> \| jq -r '.pkgver'` |
| Red Hat（eMudhra） | <https://access.redhat.com/security/vulnerabilities/RHSB-2026-012> | CA 侵害の条件・影響・対応 | ブラウザ |
| MSRC CVRF | <https://api.msrc.microsoft.com/cvrf/v3.0/cvrf/2026-Oct> | 10月分の悪用確認 CVE | `curl -s <URL>` |
| NCSC-NL | <https://github.com/NCSC-NL/php2shell> | CERT-EU 版の運用情報・対象製品リスト | `curl -s <raw README>` |
| Sansec | <https://sansec.io/research/php2shell> | 攻撃チェーン・multipart・メモリ漏洩 | ブラウザ |
| Cloudflare | <https://blog.cloudflare.com/php-vulnerabilities-waf-protection> | 修正前の攻撃試行観測 | ブラウザ |
| Docker Hub API | <https://hub.docker.com/v2/repositories/<owner>/<repo>/tags> | イメージの再ビルド確認 | `curl -s <URL> \| jq` |

### Oracle Java（`docs/07`）

| 対象 | URL | 何が分かる | 再取得 |
|---|---|---|---|
| Oracle CPU 2026年10月 | <https://www.oracle.com/security-alerts/cpuoct2026.html> | Java SE 55件、CVSS、影響版、Note 1/2/3、一括修正 | `tools/intel/fetch-intel --sources oracle` |
| Oracle リリースノート | `https://www.oracle.com/java/technologies/javase/<版>-relnotes.html` | **修正版のリリース日とビルド文字列**（例 `21-0-13`） | ブラウザ |
| IPA 注意喚起 | <https://www.ipa.go.jp/security/security-alert/2026/1021-jre.html> | 日本語の対象版・対策（2026-10-21） | ブラウザ |
| Adoptium API | <https://api.adoptium.net/v3/assets/latest/21/hotspot?architecture=x64&image_type=jdk&os=linux> | Temurin などサードパーティビルドの追従状況 | `curl -s <URL> \| jq -r '.[0].release_name'` |
| Adoptium 提供ライン | <https://api.adoptium.net/v3/info/available_releases> | LTS・最新機能版の一覧 | `curl -s <URL>` |
| NVD（Java 1件） | <https://services.nvd.nist.gov/rest/json/cves/2.0?cveId=CVE-2026-91484> | 起票元・公開時刻の突き合わせ | `curl -s <URL> \| jq` |

### 情報源フィード（`docs/08`）

| 対象 | URL | 何が分かる |
|---|---|---|
| CISA KEV | <https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json> | 悪用確認と期限（カタログ版・総数も） |
| CISA 勧告 | <https://www.cisa.gov/cybersecurity-advisories/all.xml> | 公式勧告、ICS、#StopRansomware |
| MSRC CVRF | <https://api.msrc.microsoft.com/cvrf/v3.0/cvrf/2026-Oct> | 月次 CVE、`Exploited`/`Publicly Disclosed` |
| JVN フィード | <https://jvn.jp/rss/jvn.rdf> | 日本の勧告・調整（JVN iPedia とは別） |
| JPCERT/CC | <https://www.jpcert.or.jp/rss/jpcert.rdf> | 週次まとめ、国内調整 |
| Project Zero | <https://googleprojectzero.blogspot.com/feeds/posts/default?alt=rss> | 脆弱性クラスの一次分析 |
| PortSwigger Research | <https://portswigger.net/research/rss> | Web 攻撃手法 |
| Trail of Bits | <https://blog.trailofbits.com/feed/> | 監査、サプライチェーン |
| GitHub Security Lab | <https://github.blog/security/feed/> | シークレット、コードスキャン |
| Unit 42 | <https://unit42.paloaltonetworks.com/feed/> | 悪用状況、IR |
| Cisco Talos | <https://blog.talosintelligence.com/rss/> | キャンペーン、exploit 解析 |
| Microsoft Security | <https://www.microsoft.com/security/blog/feed/> | 国家支援、クラウド |
| SANS ISC | <https://isc.sans.edu/rssfeed.xml> | 実務のトリアージ |
| The DFIR Report | <https://thedfirreport.com/feed/> | 侵入事案の全記録 |
| Citizen Lab | <https://citizenlab.ca/feed/> | スパイウェア、政策 |

フィードはすべて `tools/intel/fetch-intel --sources feeds` で一括取得できます。

### 広域スイープ（`docs/21`）

| 対象 | URL | 何が分かるか | 再取得 |
|---|---|---|---|
| NVD・指定期間に**公開**・全深刻度 | `https://services.nvd.nist.gov/rest/json/cves/2.0?pubStartDate=…&pubEndDate=…` | 何が出たか。深刻度フィルタで HIGH 帯が隠れない | `tools/intel/fetch-intel --sources nvd-recent --recent-hours 24` |
| NVD・`lastModified` 期間 | `…?lastModStartDate=…&lastModEndDate=…` | **NVD が何を変えたか**。9.8 → 8.1 の再評価を自力で拾う走査 | `--sources nvd-modified --recent-hours 6` |
| GitHub Advisory Database | <https://api.github.com/advisories> | npm / pip / Go / Maven の勧告と修正版。**CVE が無いものも含む** | `--sources ghsa --recent-hours 24` |
| カーネル CVE 告知 | <https://lists.openwall.net/linux-cve-announce/> | CVE ごとの `Fixed in <stable> with commit <sha>` | ブラウザ / アーカイブ |
| kernel.org リリース索引 | <https://www.kernel.org/releases.json> | mainline / stable / longterm の現行版 | `curl -s <URL> \| jq -r '.releases[:5][]\|"\(.moniker) \(.version)"'` |

NVD は24時間・全深刻度のクエリに約60秒かかり、1ページ最大2,000件を返します。収集ツールが
**6時間スライス**で問い合わせるのはそのためで、`lastModified` の丸1日分（約7MB）は API キー
無しでは不安定です。

### GitLab / LiteLLM / Railway / OpenCode（`docs/09`〜`docs/11`）

| 対象 | URL | 何が分かる | 再取得 |
|---|---|---|---|
| GitLab パッチリリース | <https://docs.gitlab.com/releases/patches/patch-release-gitlab-19-5-1-released/> | CVE-2026-110264 の 10.0 ベクター、影響範囲、検知2つ | `tools/intel/fetch-intel --sources gitlab` |
| GitLab 検知フレームワーク | <https://docs.gitlab.com/security/detecting_security_incidents/> | Sigma ルールの適用方法 | ブラウザ |
| LiteLLM 事案の一次記録 | <https://github.com/BerriAI/litellm/issues/47826> | wheel のハッシュ、ペイロードのファイル、IOC、対処順序 | `tools/intel/fetch-intel --sources litellm` |
| PyPI の状態 | <https://pypi.org/pypi/litellm/json> | 1.107.0 が本当に消えたか（ファイル数 0） | `curl -s <URL> \| jq` |
| Railway の開示 | <https://blog.railway.com/p/security-disclosure-wednesday-october-21st> | 何にアクセスされたか、ローテート一覧、デプロイ停止 | ブラウザ |
| Railway ステータス | <https://status.railway.com> | 公開時点の経過 | ブラウザ |
| OpenCode の利用者報告 | <https://github.com/anomalyco/opencode/issues/56833> | キー失効の利用者側の証拠（ベンダの勧告は存在しない） | ブラウザ |
| OpenCode のリポジトリ漏えい | <https://github.com/anomalyco/opencode/issues/56819> | プロジェクト自身の bot が確認したコミット済み秘密 | ブラウザ |

### Plex と直近クリティカル走査（`docs/12`・`docs/13`）

| 対象 | URL | 何が分かる | 再取得 |
|---|---|---|---|
| CISA CSAF ライブラリ（2026） | <https://github.com/cisagov/CSAF/tree/develop/csaf_files/IT/white/2026> | 機械可読のアドバイザリ。NVD の解析より先に存在することが多い | `tools/intel/fetch-intel --sources csaf` |
| CSAF VA-26-266-01（Plex） | <https://raw.githubusercontent.com/cisagov/CSAF/develop/csaf_files/IT/white/2026/va-26-266-01.json> | 5件と修正版 | 同上 |
| Plex のベンダ告知 | <https://forums.plex.tv/t/important-security-update-for-plex-media-server-v1-43-2-and-earlier/942319> | プラットフォーム別の更新手順、NAS のパッケージ遅延の注意 | ブラウザ |
| NVD API（深刻度で絞る） | <https://services.nvd.nist.gov/rest/json/cves/2.0?cvssV3Severity=CRITICAL&pubStartDate=2026-10-08T00:00:00.000&pubEndDate=2026-10-22T23:59:59.999> | CRITICAL の走査そのもの | `tools/intel/fetch-intel --sources nvd-critical` |
| EPSS API | <https://api.first.org/data/v1/epss?cve=CVE-2026-96656> | 悪用確率（新しい CVE では遅れる） | 同上 |
| Plex の KEV 絞り込み | <https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json> | 期限と連鎖の注記 | `jq '.vulnerabilities[]\|select(.vendorProject=="Plex")'` |

### CA 侵害（`docs/03`）

| 対象 | URL | 何が分かる |
|---|---|---|
| Google（Chrome Root Program） | <https://blog.google/security/protecting-chrome-and-android-users-from-compromised-emudhra-intermediate-ca-certificates/> | SPKI ブロック、CT の見解、ルート削除 |
| Mozilla Security Blog | <https://blog.mozilla.org/security/2026/10/20/protecting-firefox-users-following-the-compromise-of-emudhra-intermediate-certificates/> | OneCRL / NSS の対応 |
| Cisco Talos（2026-10-21） | <https://blog.talosintelligence.com/compromised-intermediate-certificates/> | 8本の証明書と CCADB ID、セレモニーと wrap/unwrap の原因、Microsoft のブロック、Go の CVE と版 |
| Mozilla bug 2083449 | <https://bugzilla.mozilla.org/show_bug.cgi?id=2083449> | Talos が転記した証明書一覧の原典 |
| 非公式勧告サイト | <https://emudhra.we-have-a-problem.com/> | 「We have a problem here – Wayne」の署名ページ |
| ISC 勧告 CVE-2026-94300 | <https://kb.isc.org/docs/cve-2026-94300> | 深刻度、影響版／修正版、「回避策なし」、謝辞 |
| CVE.org / NVD（CVE-2026-94300） | <https://www.cve.org/CVERecord?id=CVE-2026-94300> · <https://nvd.nist.gov/vuln/detail/CVE-2026-94300> | CNA 原文、CVSS 8.1、影響範囲 |
| Phoronix（2026-10-22） | <https://www.phoronix.com/news/LKML-New-Trend-Vulnerabilities> | **二次**: 公開 LKML に出た6件の ZDI 報告（各件へのリンク付き） |
| LKML の各報告（lore.kernel.org） | <https://lore.kernel.org/lkml/> | 一次メッセージ本体。**Anubis の proof-of-work が自動取得をブロック**（2026-10-22 記録） |
| Ars Technica（2026-10-20） | <https://arstechnica.com/security/2026/10/the-internet-goes-on-high-alert-after-discovery-of-8-compromised-tls-certs/> | **二次**: 8個の鍵の値、Valsorda の Heartbleed 比較、長い尾のリスト |
| eMudhra 声明 | <https://emudhra.com/en/post/certificate-security-incident> | ベンダの範囲主張、Mozilla 時系列の引用元 |
| Scott Helme | <https://scotthelme.co.uk/eight-bits-of-trust-emudhras-ca-keys-cracked-in-milliseconds/> | 8本すべての復元、小整数という原因 |
| Go issue / commit | <https://github.com/golang/go/issues/82345> | CVE-2026-111943、URGENT トラック、拒否リストの挙動 |
| certifi | <https://pypi.org/pypi/certifi/json> | 出荷版 2026.10.19 |

## 二次（本文で明記しているもの）

| 媒体 | 用途 |
|---|---|
| The Record | PHP Foundation の声明、発見の経緯、各国の停止措置 |
| Krebs on Security | ランサム交渉業者と ShinyHunters の件、制裁 |
| The Hacker News 等 | eMudhra の鍵本数の報道。`docs/09`〜`docs/11` からリンクした GitLab / LiteLLM / Railway の各記事 |
| vx-underground（SNS 投稿、2026-10-22） | `docs/11` でその週の項目の索引としてのみ使用。各行は一次ソースで検証している |

## 取得が失敗する前提で

一次ソースは落ちます。2026-10-22 時点の実測:

| 症状 | 実測 | 代わりに |
|---|---|---|
| JVN iPedia / MyJVN API | `jvndb.jvn.jp/myjvn?...` が XML ではなく「メンテナンス中」の HTML（384バイト）を返す | `jvn.jp` の勧告フィード、IPA のページ |
| MSRC ブログの `/feed` | `text/html` を 200 で返し、項目 0 件 | `microsoft.com/security/blog/feed/`、CVRF API |
| NVD の解析待ち | Oracle の10月分は `Awaiting Analysis` | ベンダの risk matrix |
| ベンダビルドの遅れ | Oracle から2日後も Temurin は8月ビルド。ただし翌日には 17 / 21 / 25 を公開 | 各ベンダのリリースノート（行動する当日に確認する） |

`tools/intel/fetch-intel` は1ソースが失敗しても残りを書き、終了コード `10` で「一部失敗」を
返します（`0` 全部、`2` 何も取れず）。

## 検算のしかた

数字が怪しいときは、この順で疑う。

1. **件数**（「1,400 件の脆弱性」なのか「2,578 の CVE エントリ」なのか）
   → CVRF を取って `grep -c 'CVE-'` と `sort -u` の両方を見る
2. **日付**（公開日 / ビルド日 / チェンジログの日付はずれる）
   → バージョン番号で突き合わせる
3. **「修正済み」の根拠**（タグか、実行中のバイナリか）
   → `docker exec <c> php -v` / `node -v`
4. **悪用の有無**（KEV に載っているか、ベンダが「観測」と言っているか）
   → KEV の JSON と、ベンダの原文を両方読む

## このリポジトリのスナップショット

`data/2026-10-22/` に取得時点の生データを置いてある。再取得は
`tools/intel/fetch-intel --date 2026-10-22`（`docs/08`）。

| ファイル | 由来 | 改変 |
|---|---|---|
| `oracle-java-oct2026.json` | Oracle CPU の Java SE risk matrix を表として解釈 | 構造化のみ（値は原文のまま） |
| `kev-recent.json` | CISA KEV の JSON（2026-09-22 以降を抽出） | 抽出のみ |
| `kev-catalog.json` | 同上（カタログ版・総数・対象期間） | メタのみ |
| `msrc-2026-oct.json` | MSRC CVRF（XML） | 要約＋全エントリ |
| `jvn-recent.json` | JVN RDF | 抽出のみ |
| `researcher-feeds.json` | 13本のフィード | 抽出のみ |
| `nvd-recent.json` `php-all.json` `node-latest-lines.txt` `ncsc.md` | 公開 API / 配布物 | 応答そのまま |

`ncsc.md` は NCSC-NL の README の逐語コピーなので、内部の相対リンクは
このリポジトリではなく配布元を指す。件数は取得時点のもので、MSRC の CVRF のように
再公開で動く（`docs/05` の 2,578 → 2026-10-21 再公開の 2,575 → 2026-10-22 は 2,584）。
NVD のスコアも同じで、`CVE-2026-109619` は公開の翌日に 9.8 → 8.1 と動いた。
