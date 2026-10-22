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

## 二次（本文で明記しているもの）

| 媒体 | 用途 |
|---|---|
| The Record | PHP Foundation の声明、発見の経緯、各国の停止措置 |
| Krebs on Security | ランサム交渉業者と ShinyHunters の件、制裁 |
| The Hacker News 等 | eMudhra の鍵本数の報道 |

## 取得が失敗する前提で

一次ソースは落ちます。2026-10-22 時点の実測:

| 症状 | 実測 | 代わりに |
|---|---|---|
| JVN iPedia / MyJVN API | `jvndb.jvn.jp/myjvn?...` が XML ではなく「メンテナンス中」の HTML（384バイト）を返す | `jvn.jp` の勧告フィード、IPA のページ |
| MSRC ブログの `/feed` | `text/html` を 200 で返し、項目 0 件 | `microsoft.com/security/blog/feed/`、CVRF API |
| NVD の解析待ち | Oracle の10月分は `Awaiting Analysis` | ベンダの risk matrix |
| ベンダビルドの遅れ | Oracle から2日後も Temurin は8月ビルド | 各ベンダのリリースノート |

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
| `researcher-feeds.json` | 12本のフィード | 抽出のみ |
| `nvd-recent.json` `php-all.json` `node-latest-lines.txt` `ncsc.md` | 公開 API / 配布物 | 応答そのまま |

`ncsc.md` は NCSC-NL の README の逐語コピーなので、内部の相対リンクは
このリポジトリではなく配布元を指す。件数は取得時点のもので、MSRC の CVRF のように
再公開で動く（`docs/05` の 2,578 → 2026-10-21 再公開の 2,575）。
