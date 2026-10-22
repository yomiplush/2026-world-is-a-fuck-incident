# ソースと再取得コマンド

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

## 二次（本文で明記しているもの）

| 媒体 | 用途 |
|---|---|
| The Record | PHP Foundation の声明、発見の経緯、各国の停止措置 |
| Krebs on Security | ランサム交渉業者と ShinyHunters の件、制裁 |
| The Hacker News 等 | eMudhra の鍵本数の報道 |

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

`data/2026-10-22/` に取得時点の生データを置いてある。再取得コマンドは上の表のとおり。
JSON は CISA / NVD / php.net の公開 API の応答をそのまま保存したもの（改変していない）。
