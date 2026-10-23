# 事案データの出所 — 情報源カタログ・スナップショット・AI への渡し方

[English](08-intel-sources.md) | [**日本語**](08-intel-sources.ja.md)

CVE の一覧は書いた瞬間から古くなります。残る価値があるのは**情報源の集合**と、**その
問い直し方**です。この文書はその集合です。研究者／業界フィード13本、公式フィード4本、
回収ツール1本、そして **2026-10-22** 時点のスナップショット。

§3 の数値はすべて `tools/intel/fetch-intel` が
[`data/2026-10-22/`](../data/2026-10-22/) に出力したものです。手で写した件数は載せていません。
手書きの数字は、検算できない主張になるからです。

## 1. 効く順番の4つの問い

1週間に出た情報を全部追うと、効く1件を落とします。次の順で問い、「自分向けでない」と
分かった時点で止めてください。

| # | 問い | 答える情報源 | 「いいえ」なら |
|---|---|---|---|
| 1 | 自分はそれを動かしているか | 自分の棚卸し（フィードではない） | 読了 |
| 2 | その主張は、主張を持つ当事者のものか | ベンダ勧告 / CNA のレコード | 「未確認」に格下げ |
| 3 | 実際に悪用されているか | CISA KEV | 「悪用は未確認」であって「安全」ではない |
| 4 | 自分の露出面に届くか | ベンダ勧告＋自構成 | 予定に落とす。呼び出さない |

フィードの並びも同じ論理です。まず発見した本人（自分の主張の限界を知っている）、次に
ベンダのインシデント対応、次に公式カタログ、最後に政策調査。

## 2. 情報源カタログ

`tools/intel/fetch-intel` が全部読みます。「階層」は*来歴*の話で、品質の話ではありません。
階層1は主張を所有している側、階層2はそれを報じる側、階層3は他人の主張のカタログです。

| 情報源 | 所有者 | 何に答えるか | 更新 | 階層 |
|---|---|---|---|---|
| `project-zero` | Google Project Zero | 脆弱性クラスの仕組み、「修正」が取りこぼしたもの | 週 | 1 |
| `portswigger-research` | PortSwigger Research | Web／プラットフォームの攻撃手法、デシンク、パーサ挙動 | 週 | 1 |
| `trail-of-bits` | Trail of Bits | 監査結果、サプライチェーンとツールの完全性 | 週 | 1 |
| `github-security` | GitHub Security Lab | シークレット、ファジング、コードスキャンの大規模な所見 | 週 | 1 |
| `unit42` | Palo Alto Networks | 注目 CVE の悪用状況、IR の観測 | 日 | 2 |
| `talos` | Cisco Talos | マルウェア／インフラのキャンペーン、exploit 解析 | 日 | 2 |
| `microsoft-security` | Microsoft | 国家支援・クラウドのキャンペーン報告 | 日 | 2 |
| `sans-isc` | SANS ISC | 実務のトリアージ、「今日スキャンが来ているか」 | 日 | 2 |
| `dfir-report` | The DFIR Report | IOC 付きの侵入事案の全記録 | 月 | 2 |
| `citizenlab` | Citizen Lab（トロント大） | スパイウェア、通信傍受法制、標的型監視 | 週 | 2 |
| `cisa-advisories` | CISA | 米国の公式勧告、ICS、#StopRansomware | 日 | 3 |
| `jpcert` | JPCERT/CC | 日本の調整情報、週次まとめ | 週 | 3 |
| Oracle CPU | Oracle | Java/DB/ミドルウェアの CVE、影響版、ノート | 四半期＋臨時 | 1 |
| CISA KEV | CISA | 悪用が確認された CVE と対応期限 | 随時 | 3 |
| MSRC CVRF | Microsoft | 月次の Windows/Office/クラウドの CVE 詳細、悪用状況 | 月 | 1 |
| JVN | JVN（IPA/JPCERT） | 日本の勧告、ベンダ調整 | 日 | 3 |
| NVD | NIST | CVE レコード、CVSS、参照 | 継続 | 3 |
| `imperva` | Imperva Threat Research | **配布ビルド**に対する Red Team の実証、攻撃開始24時間の観測 | 週 | 1 |
| `news`（THN、BleepingComputer） | 各媒体 | 事案名・製品名・ベンダ名を先に出す**導線**のチャネル | 時々 | 3 |
| `x`（追跡する投稿） | 各アカウント | 投稿本文・時刻・押し出したリンク。保存するが引用はしない | 随時 | 3 |

読み方を変える注意点:

- **KEV は「悪用の主張」であって「深刻度」ではない。** 載っていないのは「未確認」であり、
  開示より遅れます。米国スコープなので、日本だけで悪用されている CVE は載らないことがあります。
- **NVD は Oracle/Microsoft のレコードで `Awaiting Analysis` のまま**が多い。この2社は
  ベンダの risk matrix が一次ソースで、NVD は後から来るミラーです。
- **MSRC の件数は脆弱性の数ではない。** 1つの CVE が影響製品ビルドごとに出るので、
  「2,575 エントリ」は「2,575 個のバグ」ではありません。
- **JVN と JVN iPedia は別物。** `jvn.jp` の勧告は生きていますが、`jvndb` の検索 API は
  取得時点でメンテナンス画面を返していました（§5）。
- **導線は情報源ではありません。** 投稿や見出しが教えるのは*どこを見るか*で、引用するのは
  その中のリンクです。両方を URL 付きで保存しているのはそのためで（`x-posts.json`、
  `news-feeds.json`）、[`docs/22` §4](22-snapshot-2015jst.ja.md) が実例です。ニュースが先に
  名指しした4件は、いずれもベンダ自身のページで裏を取っています。
- **フィルタもまた情報源です。** CRITICAL スイープは CVSS 3.x で選び、しかも NVD 自身のスコアだけを
  数えます。`?cveId=CVE-2026-91637&cvssV3Severity=CRITICAL` は CNA の 9.9 があるのに **0件**。
  `CVE-2026-111497`（CVSS 4.0 のみ 9.2）と `CVE-2026-114625`（CNA 9.9）も同じです。
  CNA が採点した critical は、この一覧には出ません。「何が悪用されているか」を問うときは絞らない
  公開スイープを、「何が高く採点されたか」を問うときだけ絞った方を読みます。

## 3. スナップショット — 2026-10-22

### 3.1 CISA KEV

カタログ `2026.10.21`（2026-10-21 14:04 UTC 公開）、総数 **1,754** 件、直近30日
（2026-09-22 以降）の追加は **37 件**。Java は 0 件。ランサムウェア利用が既知のものも 0 件。

| 追加日 | ベンダ | 製品 | CVE |
|---|---|---|---|
| 2026-10-20 | EG Secure Solutions | SiteGuard Server Edition | `CVE-2026-106931` |
| 2026-10-20 | Plex | Media Server（4件） | `CVE-2026-96656` |
| 2026-10-20 | Siemens | Software Center | `CVE-2026-110936` |
| 2026-10-16 | BeyondTrust | Remote Support | `CVE-2026-102764` |
| 2026-10-16 | Fortinet | Multiple Products | `CVE-2025-61624` |
| 2026-10-15 | Atlassian | Multiple Products | `CVE-2026-21589` |
| 2026-10-14 | Cisco | Secure Email Gateway | `CVE-2026-76519` |
| 2026-10-14 | Palo Alto Networks | PAN-OS | `CVE-2026-0322` |
| 2026-10-14 | Ahsay | AhsayCBS（2件） | `CVE-2026-105134` |
| 2026-10-13 | Ivanti | Connect Secure | `CVE-2026-104935` |
| 2026-10-13 | Microsoft | Windows | `CVE-2026-96951` |
| 2026-10-04 | Citrix | NetScaler | `CVE-2026-88779` |
| 2026-10-01 | Fortinet | FortiMail | `CVE-2026-104286` |
| 2026-09-30 | Cisco | Catalyst SD-WAN Manager | `CVE-2026-76504` |
| 2026-09-25 | Microsoft | SharePoint | `CVE-2026-65660` |
| 2026-09-25 | MikroTik | RouterOS | `CVE-2026-67279` |
| 2026-09-24 | WSO2 | Multiple Products | `CVE-2026-5430` |
| 2026-09-22 | F5 | BIG-IP APM | `CVE-2026-94127` |
| 2026-09-22 | Check Point | Multiple Products | `CVE-2026-93616` |

**一番ためになるのは、上の表に入れなかった 2026-10-08 の追加分**です。BIND
`CVE-2015-5477`、Apache Struts `CVE-2016-3081`、ProFTPD `CVE-2015-3306`、Strapi
`CVE-2023-22894`、ONLYOFFICE `CVE-2021-3199`。**KEV への新規追加は、新しい脆弱性を意味しません。**
CISA は悪用を把握した時点で古い CVE を追加します。つまり「今週追加されたもの」は
「今週公開されたもの」ではなく、2015年の CVE は 2015年から一度も当てていない CVE です。

### 3.2 MSRC — 2026年10月（初回 2026-10-13、再公開 2026-10-21 / 2026-10-22）

| 指標 | 値 |
|---|--:|
| CVRF のエントリ数 | 2,575（CVE 2,574 + アドバイザリ 1） |
| CVSS ≥ 9.8 | 155 |
| CVSS ≥ 9.0 | 194 |
| `Exploited:Yes` | **1 件** — `CVE-2026-96951`（Windows、セキュリティ機能バイパス） |
| `Publicly Disclosed:Yes` | 2 件 — `CVE-2026-108398`、`CVE-2026-92707` |
| 影響の内訳（タイトル基準） | 権限昇格 678、RCE 347、情報漏えい 261 |

この表は **2026-10-21** の再公開時点のものです。同じ週に CVRF はさらに2回再公開され、
**2,578**（CVE +3）→ **2,584**（Azure の CVE +6、うち3件が CVSS 10.0）となりました。
3回の取得すべてで `Exploited:Yes` は 1 件のままでした。**件数が動いても、所見が動くとは
限りません**（[`docs/19` §5](19-snapshot-0730jst.ja.md)）。

`CVE-2026-96951` は 2026-10-13 に KEV にも入っており、2つの情報源が一致しています。
この一致は毎月確認する価値があります。MSRC が「悪用あり」と言い KEV に無い（またはその逆）
ときは、どちらかが遅れていて、どちらかは分からないからです。

### 3.3 JVN（フィード、20件）

粒度が分かる最近の例: LIFF SDK の XSS（2026-10-22）、ISC BIND（2026-10-22）、Apache Tomcat
（2026-10-21）、Xerj Console API の認証回避（2026-10-21）、CISA ICS 勧告のミラー
（2026-10-21 / 10-16）、Siemens の更新まとめ（2026-10-14）。加えて国内製品（DVR、
VOCALOID6 Editor、車検証閲覧アプリ、Creema、ゲオアプリ）。国内ベンダの調整事項と国内製品は
JVN が最初に出ます。KEV にも NVD にも載らないものが大半です。

### 3.4 研究者／業界フィード（13本すべて取得可）

| 日付 | 情報源 | 項目 |
|---|---|---|
| 2026-10-21 | `trail-of-bits` | [Your AI agent fixed the bug, but what else did it change?](https://blog.trailofbits.com/2026/10/21/your-ai-agent-fixed-the-bug-but-what-else-did-it-change/) |
| 2026-10-21 | `talos` | [Compromised eMudhra intermediate certificates](https://blog.talosintelligence.com/compromised-intermediate-certificates/) |
| 2026-10-21 | `talos` | [Two critical RCEs in PHP core](https://blog.talosintelligence.com/two-critical-rces-in-php-core/) |
| 2026-10-21 | `unit42` | [Threat Brief: CVE-2026-109618 / 109619（PHP）](https://unit42.paloaltonetworks.com/cve-2026-109618-cve-2026-109619/) |
| 2026-10-21 | `unit42` | [“Next Exploit Opportunities”: 攻撃者による AI 支援の計画立案](https://unit42.paloaltonetworks.com/ai-assisted-cybercrime-analysis/) |
| 2026-10-21 | `microsoft-security` | [ARTEX を用いた国家支援のサプライチェーン侵害](https://www.microsoft.com/en-us/security/blog/2026/10/21/storm-0940-uses-artex-agentic-ai-connectwise-supply-chain-compromise/) |
| 2026-10-21 | `cisa-advisories` | [PHP の重大脆弱性に即時パッチを求める勧告](https://www.cisa.gov/news-events/alerts/2026/10/21/critical-vulnerabilities-php-require-immediate-patching) |
| 2026-10-21 | `sans-isc` | [PHP CVE-2026-109618 / 109619 — infocon を yellow に](https://isc.sans.edu/diary/rss/33440) |
| 2026-10-21 | `jpcert` | [Weekly Report 2026-10-21](https://www.jpcert.or.jp/wr/2026/wr261021.html)（Edge、Juniper、BeyondTrust） |
| 2026-10-20 | `cisa-advisories` | [Hitachi Energy MicroSCADA X SYS600](https://www.cisa.gov/news-events/ics-advisories/icsa-26-293-04) |
| 2026-10-19 | `microsoft-security` | [Agents are your newest insiders](https://www.microsoft.com/en-us/security/blog/2026/10/19/agents-are-your-newest-insiders-security-must-move-at-their-speed/) |
| 2026-10-14 | `trail-of-bits` | [Package managers have an integrity problem](https://blog.trailofbits.com/2026/10/14/package-managers-have-an-integrity-problem/) |
| 2026-10-06 | `project-zero` | [How to fix a bug in a fix](https://projectzero.google/2026/10/emergency-patching.html) |
| 2026-10-06 | `portswigger-research` | [The model isn't cooperating](https://portswigger.net/research/the-model-isnt-cooperating) |

このうち2本は、このリポジトリが扱っている事案の直接の続報です。Talos の eMudhra 記事
（`docs/03` の CA 侵害）と PHP RCE の解説（`docs/01` の php2shell）。研究者の記事とベンダ勧告が
同じ事象を扱うとき、**「その修正では自分は守られない理由」を説明してくれるのは、たいてい
研究者側**です。

## 4. 「悪用されている」は4つの違う意味を持つ

同じ週に、php2shell について4つの両立する記述が出ました。これを矛盾と読むのが、よくある
（そして高くつく）誤りです。

| 記述 | 出所 | 実際に主張していること |
|---|---|---|
| 「公開時点で CISA は**悪用を観測していない**」 | CISA 勧告 2026-10-21 | **CISA の可視範囲で**確認された事案が無く、KEV にも未収載 |
| 「Unit 42 は**PoC を確認した**」 | Unit 42 脅威ブリーフ 2026-10-21 | 動作する exploit が公開または半公開で存在する |
| 「少なくとも1つの欧州政府が**予防的にサイトを停止**した」 | Unit 42 2026-10-21 | 事案は未確認のまま、誰かがリスクを高く見積もって行動した |
| 修正公開**前**に攻撃試行を観測（2026-10-21 07:43 UTC） | 本リポジトリ `docs/00`（Cloudflare） | 攻撃の動きに見える通信が既に来ていた。侵害成功とは別 |

ここから引き出すべき結論は、**「KEV 未収載」＋「公開 PoC あり」は普通の組み合わせ**で、
意味は「露出しているが、まだ燃えていない」。今日パッチを当てる理由にはなりますが、侵害調査を
始める理由にはなりません。

## 5. 想定すべき失敗（実測。仮定ではない）

| 失敗 | 2026-10-22 に観測した形 | 代わりにやること |
|---|---|---|
| **JVN iPedia / MyJVN API 停止** | `https://jvndb.jvn.jp/myjvn?...` が、試したどのクエリ形でも XML ではなく「メンテナンス中」の HTML を返した | `jvn.jp` の勧告フィード（動作する）と IPA の注意喚起ページを使う。日本のベンダ網羅を黙って NVD で代替しない |
| **MSRC ブログの `/feed` はフィードでない** | `msrc.microsoft.com/blog/feed` は `text/html` を 200 で返し、項目0件 | `microsoft.com/security/blog/feed/`（動作する）か CVRF API を使う |
| **「件数」が読み直しで動く** | `docs/05` は MSRC 2,578 件と記録。同じ CVRF は 2026-10-21 に再公開され、取得すると 2,575 件 | 件数は必ず再計算する。コピーしない。取得時刻を添える |
| **NVD に解析がまだ無い** | Oracle の10月分 CVE は `Awaiting Analysis` | CVSS と影響版はベンダの risk matrix を読む |
| **ベンダビルドの遅れ** | Oracle の CPU から2日後でも、Temurin の最新は8月のビルド | 誰かに更新を指示する前に、そのベンダのリリースノートを見る |

珍しい話は1つもありません。5つのうち3つは「情報源が想定と違う形だった」だけで、シェルを
持つエージェントなら1コマンドで確認でき、人間はたいてい確認しません。

## 6. AI への渡し方

プロンプトの目的は事実を与えることではありません（それはファイルがやります）。**ファイルが
扱っていない部分を、モデルに捏造させないこと**です。
[`prompts/intel-prompt.ja.txt`](../prompts/intel-prompt.ja.txt)（英語版は `intel-prompt.txt`）を
コピーし、リポジトリの URL と自分の環境ブロックと一緒に貼ってください。

```bash
bash tools/copy-prompt.sh intel ja     # 日本語
bash tools/copy-prompt.sh intel        # 英語
```

プロンプトが強制するのは次の5点で、この順番に意味があります。

1. 答える前に `docs/07`、`docs/08`、`SOURCES.ja.md` を読む。記憶から CVE を足さない。
2. まず `tools/intel/fetch-intel` を実行し、**数値が動いていたらそう言う**。古い
   スナップショットで作った回答は、古いと宣言させる。
3. **影響を受ける版**と**修正版**を分ける。ベンダの「影響版」一覧を修正版として報告しない
   （`docs/07` §2 の罠）。
4. 主張ごとに出所と取得日を添える。二次情報だけのものは「未確認」と明示する。
5. 出力は4リスト固定: 自分の環境で確定したもの / 対応が必要 / 判断できない / 対象外。
   加えて「答えが変わる条件」。

一緒に貼るもの: OS とパッチ手段、そのホストがインターネット公開か、把握しているランタイム、
そして §6 の検出コマンドの生出力。版文字列を持っているエージェントは、推測ではなく判断に
予算を使えます。

## 7. 再取得

```bash
tools/intel/fetch-intel --date 2026-10-22 --cpu Oct2026 --month 2026-Oct
tools/intel/fetch-intel --sources oracle,kev        # 一部だけ
tools/intel/fetch-intel --out /tmp/intel --limit 20 # 別の場所に、フィードは多めに
```

終了コード: `0` 全ソース取得、`10` 一部失敗（残りは書き込み済み）、`2` 何も取れず。
必要なのは Python 3 の標準ライブラリとネットワークだけ（jq も bs4 も不要）。同じコマンド、
同じファイル名なので、2つのスナップショットの `git diff` が「世界のどこが変わったか」に
なります。`--date` は履歴を残すためのもので、上書きしません。

## 8. 出所

上の URL がそれぞれの出所です。機械可読なスナップショットは
[`data/2026-10-22/`](../data/2026-10-22/) を対象にしています。**最新の取得は
[`data/2026-10-23-1036jst/`](../data/2026-10-23-1036jst/)**（07:25 のものは隣の
`data/2026-10-23-0730jst/`）。ファイル名もコマンドも同じで、それが要点です。2つの
スナップショットディレクトリを `git diff` すれば、実際に何が動いたかが分かります。10:36 の取得
では広域ソースが3つ増えています（`nvd-recent-24h.json`、`nvd-modified-6h.json`、
`ghsa-recent.json`）— [`docs/21` §2](21-snapshot-1036jst.ja.md)。

| ファイル | 中身 |
|---|---|
| `oracle-java-oct2026.json` | Java SE 55件。CVSS 構成要素、ノート、製品別の影響版 |
| `kev-recent.json` | 2026-09-22 以降の KEV 追加分（原文のまま） |
| `kev-catalog.json` | KEV のカタログ版、総数、対象期間 |
| `msrc-2026-oct.json` | 2,575 エントリ。スコア、影響、悪用状況 |
| `jvn-recent.json` | JVN フィードの項目と発行時刻 |
| `researcher-feeds.json` | 13本のフィードと最新項目 |

フィードの定義は `tools/intel/fetch-intel` の `FEEDS` にあります。追加は1行と、
「なぜそこに入れるのか」の理由だけです。
