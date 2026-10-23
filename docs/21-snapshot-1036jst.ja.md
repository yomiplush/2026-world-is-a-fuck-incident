# スナップショット — 2026-10-23 10:36 JST（01:36 UTC）: 広く取ったら、盲点が見つかった

[English](21-snapshot-1036jst.md) | [**日本語**](21-snapshot-1036jst.ja.md)

この日の3回目の取得。今度は深くではなく**広く** — 全深刻度、全パッケージエコシステム、
そして開示チャネルまで。このリポジトリが既に追っている製品だけではありません。結果は2つ:

1. **NVD の深刻度スイープは、調整開示（coordinated disclosure）を見られません。** 今週最大の
   カーネル事案 — [`Infinity Core`](20-infinity-core.ja.md)、root 取得 PoC 5件が公開 — は、
   公開日スイープにも、更新日スイープにも、昨日収集した12本のフィードにも出てきません。
2. **CVE データベースよりパッケージエコシステムの方が動きました。** Next.js の未認証 RCE
   アドバイザリが24時間に2件出て、**どちらにも CVE がありません**。CVE の形をしたプロセスには
   何も見えません。

```bash
tools/intel/fetch-intel --date 2026-10-23-1036jst --recent-hours 24
# → data/2026-10-23-1036jst/   （2026-10-23 01:36〜02:2x UTC に取得）
```

この回のために収集ツールへ4つ追加しました（§2）: `nvd-recent`（全深刻度・公開日順）、
`nvd-modified`（全深刻度・NVD の `lastModified` 順）、`ghsa`（GitHub Advisory Database）、
そして `oss-sec` フィードです。

## 1. 07:25 JST のスナップショットから変わったこと

| 情報源 | 07:25 JST | 10:36 JST | 意味 |
|---|---|---|---|
| CISA KEV | `2026.10.21` | **変化なし** | 新たな悪用確認は依然としてゼロ |
| MSRC CVRF `2026-Oct` | 2,584（CVE 2,583） | **2,937（CVE 2,936）** — **+353** | Edge / Chromium のコンポーネント群が入った（下記） |
| NVD CRITICAL スイープ | 125（窓 10-08…10-22） | **104（窓 10-09…10-23）** | **窓が1日ずれただけ。21件直ったわけではない** |
| Oracle CPU / GitLab / Plex CSAF / JVN | — | **同一** | ベンダ改訂なし |
| LiteLLM issue #47826 | 18:05Z 更新 | 22:58Z 更新、**本文は同一** | コメントのみ |
| カーネル | docs/17 の6件は未修正 | **+ Infinity Core**（上流修正済み） | [`docs/20`](20-infinity-core.ja.md) |

### 1.1 MSRC +353、所見は1つも変わらない

増えた353件は**すべて Chromium のサードパーティコンポーネント CVE**（`CVE-2026-112992` …
`CVE-2026-113344`、Edge/Chromium の1バッチ）です。形は動いていません:

| | 変更前 | 変更後 |
|---|--:|---:|
| エントリ数 | 2,584 | **2,937** |
| CVSS ≥ 9.0 | 198 | **227** |
| CVSS ≥ 9.8 | 158 | **158**（変化なし） |
| `Exploited:Yes` | 1 | **1**（`CVE-2026-96951`） |
| `Publicly Disclosed:Yes` | 2 | **2** |

つまり件数は13.7%増、悪用の集合は不変。同じ文書の再公開は10日で3回目で、数字は
2,578 → 2,575 → 2,578 → 2,584 → 2,937 と読み取れました。**取得時刻を添えないと数字は自分自身と
矛盾します** — [`docs/08` §5](08-intel-sources.ja.md) が言い続けてきたとおりです。

### 1.2 CVE が1件も直っていないのに、CRITICAL は 125 から 104 に減った

`tools/intel/fetch-intel --sources nvd-critical` は**今日で終わる**14日窓です。10:36 JST の
「今日」は 2026-10-23 なので、窓は 10-09…10-23。10時間前は 10-08…10-22 でした。2つのファイルから
の算術:

| | 07:25 JST | 10:36 JST |
|---|--:|--:|
| 窓 | 10-08…10-22 | 10-09…10-23 |
| 合計 | 125 | **104** |
| うち 10-08 公開 | 17 | —（窓の外） |
| うち 10-20 / 10-22 公開 | 66 / 12 | **64 / 10**（4件が CRITICAL 集合から外れた） |
| うち 10-23 公開 | — | **0** |

125 − 17（窓の端）− 4（再評価・ステータス変更）+ 0 = 104。何も入っておらず、21件が出ていって
見出しが動いただけです。2つの数字を並べれば「CRITICAL が17%減った」と書けてしまいます。
[`docs/13` §5.4](13-recent-criticals.ja.md) の罠が、今度はこのリポジトリ自身の表で起きた形です。

## 2. 広域スイープ（新しい情報源）

| 情報源 | 窓 | 結果 |
|---|---|---|
| `nvd-recent` | 公開日・24時間・**全深刻度** | **381件** — ≥9.0 が54、high 122、medium 128、low 27、スコア無し11 |
| `nvd-modified` | NVD `lastModified`・6時間・全深刻度 | **665レコードが動いた** — 追跡中の CVE を全部拾った（下記） |
| `ghsa` | 公開日・24時間 | **58件** — critical 5、high 26、medium 20、low 7。npm のパッケージ項目67、pip 28、rust 8 |
| `oss-sec`（フィード） | RSS の先頭 | 13/13 が読める。他12本が落としていた項目を4つ運んできた |

### 2.1 一番新しい CVE が、一番使えない

直近24時間に公開された381件のうち、NVD が解析を終えたものは**1件もありません**:
`vulnStatus` は `Received` 187、`Deferred` 141、`Awaiting Analysis` 45、`Undergoing Analysis` 7、
`Rejected` 1、**`Analyzed` 0**。同じファイルで測れる帰結:

- **CPE マッピング: 0件。** 昨日の14日バッチは 120件中32件（27%）でした。新しいバッチはゼロなので、
  「NVD からベンダを引く」は1日前の CVE では原理的に効きません。
- **EPSS のカバレッジ: 381件中71件（19%）。** バッチ内の最高値は **0.76%**
  （`CVE-2026-110354`、7.5）。
- **CVSS 3.1 が無いものが50件**（うち39件は CVSS 4.0 を持つ）。

これは NVD の欠陥ではなく、単なる待ち行列です。ただし「昨日の CRITICAL 件数」と「今日の
CRITICAL 件数」は**解析の進捗**の測定値になる、という意味でもあります。`CVE-2026-109619` が
CRITICAL 帯から消えた仕組みと同じです（[`docs/19` §3](19-snapshot-0730jst.ja.md)）。

### 2.2 教えてくれるのは更新スイープの方

`nvd-modified`（6時間）には、夜間にレコードが動いた追跡中の CVE が4件とも入っています。
PHP の2件、GitLab、BIND:

| CVE | 現在の `vulnStatus` | CVSS 3.1 | CVSS 4.0 | EPSS |
|---|---|--:|--:|--:|
| `CVE-2026-109618`（PHP） | `Analyzed` | 9.8 | 9.2 | 5.31% |
| `CVE-2026-109619`（PHP） | `Modified` | **8.1** | 9.2 | 5.76% |
| `CVE-2026-110264`（GitLab） | `Undergoing Analysis` | **10.0** | — | 0.51% |
| `CVE-2026-94300`（BIND） | `Awaiting Analysis` | **8.1** | — | 0.73% |

GitLab の 10.0 は NVD の **Primary** スコアになりました（`Undergoing Analysis`、つまり確定では
ありません）。BIND の 8.1 も解析の裏付けがないスコアです。どちらも「数字はあるが根拠はまだ無い」
— [`docs/19` §3](19-snapshot-0730jst.ja.md) の CNA のみの行と同じ形です。

### 2.3 24時間にエコシステムが出したもの（GHSA）

深刻な上位2件には **CVE がありません**。CVE で絞るプロセスには見えません。

| アドバイザリ | 深刻度 | パッケージ → 修正 | 内容 |
|---|---|---|---|
| Next.js `use cache` | **critical** | npm `next` → **16.4.1** | 型付き配列を返す `use cache` 関数での未認証 RCE |
| Next.js 画像最適化 | **critical** | npm `next` → **15.5.28 / 16.4.1** | `/_next/image` で SVG を許可している場合の未認証 RCE |
| DOMPurify | **critical** | npm `dompurify` → **3.4.17** | `SAFE_FOR_TEMPLATES` バイパス（分割したテンプレート式が残る） |
| Sentry Next.js ミドルウェア | **critical** | npm `@sentry/nextjs` → **9.47.2 / 10.75.2** | `CVE-2026-114139`、tunnel 経由のミドルウェアバイパス |
| Pillow マルチフレーム | **critical** | pip `Pillow` → **13.0.0** | `CVE-2026-96639`、モード切替時に古いネイティブ画像領域を再利用 |
| GitPython サブモジュール | high 7.5 | pip `GitPython` → **3.2.1** | `CVE-2026-114145`、clone **後**に `.git` パスを検証 → RCE |
| `toml`（4件） | high | npm `toml` / `tome` → **5.0.1** | プロトタイプ汚染＋資源枯渇3件 |
| Storybook dev server | high | npm `storybook` → **8.6.19 / 9.1.21 / 10.6.2** | ローカルネットワークからのコード注入 |
| graphql-core / @graphql-tools | high | pip **3.2.12**、npm **12.0.2** | DoS＋プロトタイプ汚染 |
| nbconvert | high | pip **7.17.2** | セル出力ファイル名のパストラバーサルで任意書き込み |

Next.js の未認証 RCE が1日に2件、修正はパッチ版です。Next.js を動かしているなら、どの CVE
リストが何と言おうと今日の項目です。

## 3. 盲点: Infinity Core はこのどれにも出てこない

脆弱性そのものは [`docs/20`](20-infinity-core.ja.md)。ここで重要なのは**収集結果**で、これは
手法のテストになっています。

- 6件の CVE は **2026-09-04 〜 2026-10-12** に採番・公開されているため、「直近24時間に公開」の
  スイープには出ません — 上の381件にも。
- NVD レコードは直近6時間に**更新されていない**ので、`nvd-modified` にも出ません。
  （6件とも `vulnStatus: Received`。4件はカーネルチームの 7.8、2件はスコア無し。）
- **昨日収集した12本のフィードはどれも触れていません** — 全フィードのタイトルに
  `grep -ci infinity` して **0**。今日13本で試しても 0 のままで、スレッドが RSS の先頭から
  流れ落ちているためです。**フィードもまた窓であり、記録はアーカイブ側にあります。** 発見の
  入口は日本語のベンダブログと研究者の GitHub でした。

つまり手法には「公開日」「更新日」のほかに**開示チャネル**という軸が要ります。調整開示は
メーリングリストで終わり、6週間前に採番された CVE が PoC 公開の日に緊急になります。
`oss-sec` をフィードに加えたのはそのためで、この回だけで他12本が落とした4件を拾いました（§4、§5）。

> スイープはデータベースが何をしたかを教える。開示チャネルは、何の意味が変わったかを教える。

## 4. Python と eMudhra CA: 具体的な版番号が出た

[`docs/03`](03-emudhra-ca.ja.md) は「`ca-certificates` / `certifi` / Go / NSS を更新」としか
書いていませんでした。Python 側の対応は版番号まで示しています（oss-sec、2026-10-22 20:45 UTC、
Seth Michael Larson の発言の引用）。**emSign ルート**が `certifi` などのバンドルから削除され、
以下が下限です:

| パッケージ | 下限 | このスナップショットで PyPI を確認 |
|---|---|---|
| `certifi` | 2026.10.19（勧告は 2026.10.18、互換性のため 10.19 推奨） | **2026.10.19** |
| `pip` | 26.2.2 | **26.2.2** |
| `uv` | 0.13.4 | **0.13.5** |
| `sigstore` | 4.5.1 | **4.5.1** |
| `conda` | 26.9.4 | conda チャネル配布。PyPI では検証できない（PyPI の `conda` は 4.x の旧パッケージ） |
| `pixi` | 0.82.1 | PyPI は 1.0.1。案内の番号はインストーラのチャネルなので `pixi --version` で確認 |

そして飛ばしやすい指示: **レイヤキャッシュを無効にしてコンテナイメージを再ビルドする**。
そうしないと「バンドル更新」の手順は、古いルートを含むキャッシュ層で満たされたことになります。

これは [`docs/03`](03-emudhra-ca.ja.md) の非対称性も露呈します。話の中心は中間CAでしたが、
Python で効く変更は**ルートの削除**で、そこへ連鎖する証明書の信頼が切れます。更新後にピン留めが
失敗するのは、確認が機能している証拠です。

## 5. EOL の PHP: 非公式バックポートが出ている

[`docs/01`](01-php2shell.ja.md) と README は「PHP 8.1 以前に公式修正なし」と書いています。
事実はそのままですが、2026-10-22 にコミュニティ製のバックポートが2つ出ました。RHEL 6/7 の
読者は必ず聞く話です。

- **Oleksii Molchanov** が公式の最小修正（php-src `712e60f9ed`「Avoid state corruption via
  bailout」、7.4 向けバックポート）をベンダのソースツリーへ移植し、
  `php-5.4.16-48.el7.php2shell.1` と `php-5.3.3-50.el6_10.php2shell.1` として公開
  （<https://github.com/alvm/php2shell-eol-backport>）。**Leon Lai** の Amazon Linux /
  PHP 7.3 on EL7 向けを拡張したものです。
- これは何か: ベンダのソースツリーに対するパッチを、ディストリのパッケージとしてビルドしたもの。
- これは何ではないか: ベンダサポートのある更新。どのディストリも配布せず、どのアドバイザリも
  追跡せず、これらのビルドについて CVE レコードが「修正済み」になることもありません。

[`docs/06`](06-lessons-and-gotchas.ja.md) が求める正直な立場はこうです。非公式バックポートは、
**自分でレビューして再ビルドできる立場なら**妥当なつなぎであり、報告可能な意味での「修正済み」
ではありません。公開 RCE のある PHP 5.3 を晒すか、レビュー済みバックポートを選ぶかの二択なら
後者を取り、それでも移行計画は残してください。

## 6. 本日期限のもの（ここは何も変わっていない）

| 項目 | 10:36 JST 時点 | やること |
|---|---|---|
| **Plex** `CVE-2026-96654` / `-96656` | KEV 期限は**本日 2026-10-23** | 1.43.3.10861 以上。現行 1.43.5.11029 |
| **EG SiteGuard** `CVE-2026-106931` | KEV 期限は**本日** | ベンダの緩和策＋フォレンジックトリアージ |
| **php2shell** | EPSS 5.31% / 5.76%、KEV 未収載 | 適用。10-20/21 に露出していたなら侵害確認 |
| **Infinity Core** | 上流修正済み、PoC 公開 | `uname -r`、ディストリの勧告、**再起動**（[`docs/20`](20-infinity-core.ja.md)） |
| **Next.js**（使っていれば） | critical 2件、CVE なし、本日 | 15.5.28 / 16.4.1 |
| **Python の CA バンドル** | 下限が 2026-10-22 に公表 | `certifi` 2026.10.19、`pip` 26.2.2、キャッシュ無効で再ビルド |
| **Temurin** | 17.0.21+9 / 21.0.13+9 / 25.0.5+8（10-22 公開） | そのタグで再ビルド。8 / 11 は8月ビルドのまま |

据え置きで最新のもの: PHP 8.5.12 / 8.4.27 / 8.3.36 / 8.2.35、Node 26.12.1 / 24.22.1 /
22.23.4、GitLab 19.5.1、Tomcat 11.0.27 / 10.1.61、httpd 2.4.69、BIND 9.20.30 / 9.21.27、
Oracle Java 21.0.13 / 17.0.21 / 11.0.33 / 8u511 / 25.0.5 / 27.0.1、カーネル stable 7.2.12。

## 7. 再現

```bash
# 上のスナップショット
tools/intel/fetch-intel --date 2026-10-23-1036jst --recent-hours 24

# 新しい3ソースを個別に
tools/intel/fetch-intel --sources nvd-recent   --recent-hours 24 --out /tmp/broad
tools/intel/fetch-intel --sources nvd-modified --recent-hours 6  --out /tmp/broad
tools/intel/fetch-intel --sources ghsa         --recent-hours 24 --out /tmp/broad

# 深刻度スイープが何を取りこぼすか: CNA のみのレコードはフィルタに見えない
curl -s 'https://services.nvd.nist.gov/rest/json/cves/2.0?cveId=CVE-2026-98260' \
  | jq -r '.vulnerabilities[0].cve | "\(.vulnStatus) \(.metrics.cvssMetricV31[].type // "none")"'
```

NVD は24時間・全深刻度のクエリに約60秒かかり、1回のソケットタイムアウトを超えることがあるため、
収集ツールは**6時間のスライス**で問い合わせ、間に6秒sleepを入れ（API キー無しでは30秒に5回）、
失敗時はバックオフして再試行します。`nvd-modified` の丸1日分は約7MBで、API キー無しでは不安定
です。このスナップショットは6時間を使い、前回取得からの変化を拾うには十分でした。

## 8. 出典

- スナップショット: [`data/2026-10-23-1036jst/`](../data/2026-10-23-1036jst/) — 13ファイル、
  2026-10-23 01:36〜02:2x UTC。
- NVD（公開日 / 更新日 / 個別）: <https://services.nvd.nist.gov/rest/json/cves/2.0>
- GitHub Advisory Database: <https://api.github.com/advisories>
- oss-security フィード: <https://seclists.org/rss/oss-sec.rss>。引用した2スレッド:
  <https://seclists.org/oss-sec/2026/q4/329>（PHP バックポート）、
  <https://seclists.org/oss-sec/2026/q4/330>（Python / eMudhra）
- MSRC CVRF（再公開）: <https://api.msrc.microsoft.com/cvrf/v3.0/cvrf/2026-Oct>
- KEV: <https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json>
- カーネルのリリース: <https://www.kernel.org/releases.json>
- PyPI の状態: <https://pypi.org/pypi/certifi/json>、`…/pip/json`、`…/uv/json`、`…/sigstore/json`
- Infinity Core: [`docs/20`](20-infinity-core.ja.md)
