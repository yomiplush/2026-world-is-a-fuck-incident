# スナップショット — 2026-10-22 21:20 JST（12:20 UTC）

[English](16-snapshot-2120jst.md) | [**日本語**](16-snapshot-2120jst.ja.md)

同じ日の2回目の取得です。1回目は 09:25 JST でした。劇的な変化はありませんが、**4点**が動き、
そのうち1点は今朝このリポジトリが公開した数字を訂正します。これが「21:20 JST 時点」の中身で、
再現コマンド付きです。

```bash
tools/intel/fetch-intel --date 2026-10-22-2120jst --cpu Oct2026 --month 2026-Oct
# → data/2026-10-22-2120jst/（09:25 JST 版の data/2026-10-22/ と並べて保持）
```

## 1. 09:25 JST からの差分

| ソース | 09:25 JST | 21:20 JST | 意味 |
|---|---|---|---|
| CISA KEV | カタログ `2026.10.21`、30日窓で37件 | **変化なし** | 今日、新たに悪用確認された CVE は無し |
| MSRC CVRF `2026-Oct` | 2,575エントリ（CVE 2,574） | **2,578（CVE 2,577）** | 文書が再公開され **+3 CVE** |
| NVD CRITICAL 走査（14日） | 120件 | **124件** | 新規公開の CRITICAL が4件（下記） |
| JVN 勧告フィード | 20件 | **変化なし** | 今日の新着なし |
| JPCERT/CC | — | **+1** | php2shell（CVE-2026-109618/109619）の注意喚起 |
| LiteLLM 事案記録 | 02:19Z 更新 | **09:42Z 更新**、本文は同一 | コメント／編集のみ。ファイル一覧は安定 |
| Oracle CPU / GitLab 勧告 / Plex CSAF | — | **バイト単位で同一** | ベンダ文書は改訂されていない |

### 1.1 MSRC の数字が戻った — ここが本題

このリポジトリは今朝、[`docs/08`](08-intel-sources.ja.md) と [`docs/13`](13-recent-criticals.ja.md)
で **2,575** を公開し、`docs/05` は 2026-10-13 の初回取得で **2,578** と記録していました。
どちらもその時点では正しい。CVRF が再び再公開され、**2,578エントリ（+3 CVE:
`CVE-2026-113679`、`CVE-2026-113680`、`CVE-2026-53614`）** になりました。

つまり**再公開される文書から取った件数は「動く対象のスナップショット」**です。
[`docs/08` §5](08-intel-sources.ja.md) に書いた教訓が、同じ日のうちに実演された形です。
**取得時刻を添えない件数は、自己矛盾を起こします。** 悪用確認は1件
（`CVE-2026-96951`）のままです。

## 2. 今日公開された CRITICAL 4件

いずれも EPSS はまだ無く、**4件のうち3件は「古い CVE が今公開された」**ものです。

| CVE | CVSS | 内容 | 備考 |
|---|--:|---|---|
| `CVE-2021-48014` | 9.8 | FineReport 9.0 のパストラバーサル（`/WebReport/ReportServer`） | 2021年の CVE、公開は 2026-10-22 |
| `CVE-2021-48016` | 9.8 | DedeCMS ≤ 5.8.1-beta の PHP コードインジェクション（`ShowMsg()`） | 2021年 |
| `CVE-2022-51022` | 9.1 | YiShaAdmin 2.2–3.1 の未認証パストラバーサル | 2022年 |
| `CVE-2026-114220` | 9.1 | NT OneAPP（NewType Infortech）の証明書検証不備 | 現行の CVE |

**「新規公開」は「新規に危険」ではありません。** 3件は何年も前から悪用可能で、記録が今付いた
だけです。2026-10-08 に KEV へ遡及追加された `CVE-2015-5477` / `CVE-2016-3081` と同じ構図で、
**公開日で並べたフィードが優先順位にならない理由**です。

いずれも KEV 未収載、EPSS 未提供、このリポジトリの対象外。§1 の件数が「謎の増加」に見えない
ように列挙しています。

## 3. 期限と未完了項目（このスナップショット時点）

| 項目 | 21:20 JST の状態 | 今夜やること |
|---|---|---|
| **Plex** `CVE-2026-96656` / `-96654` | KEV 期限 **2026-10-23**（明日）。96656 はフォレンジックトリアージ必須 | **1.43.3.10861 以上**へ（下記のとおり、もっと新しい版あり） |
| **Plex** の最新版 | **1.43.5.11029**（KEV の修正版は 1.43.3.10861） | 最新へ上げれば KEV の要求も満たす |
| **BeyondTrust** `CVE-2026-102764` | KEV 期限 **2026-10-19** — 既に超過 | パッチ＋証拠保全（CISA がトリアージ必須と指定） |
| **php2shell** | KEV 未収載。JPCERT が今日、日本語の注意喚起を公開 | 10-20/21 に PHP を公開していたなら侵害有無を確認 |
| **GitLab** `CVE-2026-110264` | 19.5.1 が依然最新のパッチリリース | 上げ先はこれ以上無い |
| **Apache Tomcat** | **11.0.27 / 10.1.61 / 9.0.123** が最新リリース | それが修正版そのもの（[`docs/15`](15-apache-oct2026.ja.md)） |
| **httpd** | 2.4.69 が最新 | — |
| **Oracle Java** | 21.0.13 / 17.0.21 / 11.0.33 / 8u511 / 25.0.5 / 27.0.1 が最新（21.0.14 は無い） | — |
| **Node.js** | 26.12.1 / 24.22.1 / 22.23.4 が最新 | — |
| **PHP** | 8.5.12 / 8.4.27 / 8.3.36 / 8.2.35 が最新 | — |

はっきり言える結論は2つです。

1. **Plex の KEV 期限は明日で、修正版はすでに2つ古い。** 実務の指示は「KEV に書かれた版へ」
   ではなく **「1.43.5.11029 へ」**。
2. **今日、新しいパッチを出した製品は無い。** このリポジトリが扱う全製品で、今朝の版が
   依然最新——つまり今日の作業は「待つ」ではなく「当てる」です。

## 4. 変わっていない（＝まだ正しい）こと

- **KEV には Java / PHP / GitLab / Apache / Railway / LiteLLM / Tailscale の該当が無い。**
- **JVN は今日は静か**（昨日20件）。JPCERT の追加は PHP の注意喚起のみ。
- **Plex の CSAF（VA-26-266-01）と GitLab のパッチリリースページはバイト単位で同一**なので、
  [`docs/09`](09-gitlab-19-5-1.ja.md) と [`docs/12`](12-plex-oct2026.ja.md) の版の対応は有効。
- **Oracle の Java SE risk matrix は未改訂**。55件と影響版/修正版の対応は変わらない。

## 5. 1分で自分で再確認する

```bash
# 1) KEV は動いたか（カタログ版と件数）
curl -s https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json \
  | jq -r '.catalogVersion, .count'

# 2) ベンダが新しいビルドを出したか（Plex の例）
curl -s https://plex.tv/api/downloads/1.json | grep -o '"version":"[0-9.]*-[0-9a-f]*"' | head -3

# 3) 前回スナップショットから走査に何が増えたか
tools/intel/fetch-intel --sources nvd-critical --out /tmp/now
# /tmp/now/nvd-critical-14d.json と data/2026-10-22-2120jst/ の同名ファイルを diff
```

## 6. 出所

- §1〜§2 はすべて [`data/2026-10-22-2120jst/`](../data/2026-10-22-2120jst/)
  （2026-10-22 12:22 UTC に `tools/intel/fetch-intel` で取得）。
- KEV: <https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json>
- MSRC CVRF（再公開）: <https://api.msrc.microsoft.com/cvrf/v3.0/cvrf/2026-Oct>
- NVD CRITICAL 走査: <https://services.nvd.nist.gov/rest/json/cves/2.0?cvssV3Severity=CRITICAL>
- JVN / JPCERT: <https://jvn.jp/rss/jvn.rdf>、<https://www.jpcert.or.jp/rss/jpcert.rdf>
- Plex リリース索引: <https://plex.tv/api/downloads/1.json>
- 版の確認: <https://tomcat.apache.org/whichversion.html>、<https://httpd.apache.org/>、
  <https://nodejs.org/dist/index.json>、<https://www.php.net/releases/index.php?json&version=8.5>、
  Oracle のリリースノート URL（21.0.14 は 404）
