# スナップショット — 2026-10-23 07:25 JST（2026-10-22 22:25 UTC）

[**English**](19-snapshot-0730jst.md) | [日本語](19-snapshot-0730jst.ja.md)

夜間の再取得。新しいパッチは出ておらず、KEV にも新規登録はありません。それでも**この
リポジトリが昨日公開した数字のうち3つは、いま正しくありません**。php2shell の2件のうち1件の
v3.1 スコア、2週間スイープの最高 EPSS（上位2件を PHP の2件が占めました）、そして
[`docs/13`](13-recent-criticals.ja.md) の ≥9.8 件数です。最後の1つは世界ではなく収集ツールの
不具合によるものです。3つともトリアージの順番を変えますが、**入れるべきものは変わりません**。

```bash
tools/intel/fetch-intel --date 2026-10-23-0730jst --cpu Oct2026 --month 2026-Oct
# → data/2026-10-23-0730jst/（2026-10-22 22:24〜22:33 UTC に取得）
```

## 1. 21:20 JST のスナップショットから変わったこと

| 情報源 | 2026-10-22 21:20 JST | 2026-10-23 07:25 JST | 意味 |
|---|---|---|---|
| CISA KEV | カタログ `2026.10.21`、30日窓で37件 | **変化なし**（`2026.10.21`。33件なのは窓の開始が 09-23 にずれたため） | 一晩で新たな「悪用確認済み」はなし |
| `CVE-2026-109619` の NVD スコア | 9.8 | **8.1**（2026-10-22 21:17Z に再評価） | php2shell の2件のうち1件が CRITICAL 帯を出た |
| `CVE-2026-109618` の NVD スコア | 9.8 | **9.8**（20:45Z にレコード更新、説明文は同一） | 変化なし |
| NVD CRITICAL スイープ（14日） | 124 | **125** — ただし**11件入り、10件出た** | この数字は台帳ではなく、動く索引の窓 |
| PHP 2件の EPSS | スコアなし | **5.31% / 5.76%**、約93パーセンタイル | 窓の中で最も高い2件になった |
| MSRC CVRF `2026-Oct` | 2,578 エントリ（CVE 2,577） | **2,584（CVE 2,583）** | また再公開。Azure の6件増、うち3件が 10.0 |
| JVN 注意喚起フィード | 20件 | **変化なし** | 静か |
| Oracle CPU / Plex CSAF / GitLab アドバイザリ | — | **バイト単位で同一** | 夜間のベンダ改訂はなし |
| LiteLLM issue #47826 | 09:42Z 更新 | 18:05Z 更新、**本文は同一**（`sha256 07cdfef8…`） | コメントのみ。検体リストは安定 |
| Eclipse Temurin | 21 は `21.0.12.1+1`（8月ビルド） | **17.0.21+9 / 21.0.13+9 / 25.0.5+8** | 5ライン中3ラインでベンダ遅れが解消 |

動いて**いない**ものは、推測せずに確認しました。`docs/17` のカーネル報告は mainline に
修正が入っておらず、**修正版の番号はどこも進んでいません**。新しく出たのは Temurin の
17 / 21 / 25 ビルドだけで、これは Oracle が 10-20 に示した版と同じものです。

## 2. NVD は `CVE-2026-109619` を CRITICAL から外した

| | `CVE-2026-109618` | `CVE-2026-109619` |
|---|---|---|
| NVD CVSS 3.1（2026-10-21） | 9.8 | 9.8 |
| NVD CVSS 3.1（2026-10-22 21:17Z） | 9.8 | **8.1** |
| NVD ベクタ | `AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H` | **`AV:N/AC:H/…`**（旧 `AC:L`） |
| PHP 自身の CVSS 4.0 | 9.2 | 9.2 |

差は**攻撃の複雑さ（AC）だけ**です。NVD はグローバル状態の使い回し経路に、攻撃者が自由に
設定できない条件が必要だと判断しました。OOM / longjmp 側は `AC:L` のままです。PHP の
アドバイザリは両方 9.2（v4.0）で、変わっていません。

これが意味すること・しないこと:

- **修正内容は変わりません。** 2件は同じリリース（8.5.12 / 8.4.27 / 8.3.36 / 8.2.35）で直ります。
  109618 だけ直って 109619 が残る版は存在しません。
- **109619 が安全になったわけではありません。** 8.1 でも遠隔・認証不要・影響大で、
  [`docs/01` §3](01-php2shell.ja.md) の部分緩和はこの経路を狙ったものです。
- **トリアージのルールが壊れます。** 「CVSS 9.0 以上だけ見る」運用にしていると、同じ
  アドバイザリ・同じパッチの兄弟が片方だけ消えます。**スコアではなくアドバイザリ単位で
  適用する**のが正解です。

[`docs/13`](13-recent-criticals.ja.md) が書いている罠の裏返しです。スコアは時刻付きの
評価であり、評価は数時間後に改訂されます。

## 3. 124 → 125 なのに 11件入り・10件出た理由

API を見ると、機構は2つです。加えて、このリポジトリの読み取り側に欠陥がありました。

**(a) 再評価。** `CVE-2026-109619` が出ました（§2）。スコアは改訂され、窓は古い値を覚えません。

**(b) CNA のスコアは数えられない。** NVD の `cvssV3Severity` フィルタは **NVD 自身の
（Primary）評価**で答えます。`Awaiting Analysis` のまま CNA（Secondary）のスコアしか持たない
レコードは、その値がいくつでも対象外です。実際に確認した結果:

```bash
# CVE-2026-101809: Oracle E-Business Suite、CNA スコア 10.0、vulnStatus "Awaiting Analysis"
curl -s 'https://services.nvd.nist.gov/rest/json/cves/2.0?cveId=CVE-2026-101809&cvssV3Severity=CRITICAL' | jq .totalResults
# → 0
curl -s 'https://services.nvd.nist.gov/rest/json/cves/2.0?cveId=CVE-2026-101809&cvssV3Severity=HIGH' | jq .totalResults
# → 0      （レコードの指標は secalert_us@oracle.com の Secondary 10.0 のみ）

# 逆方向: 109619 は HIGH に入り、CRITICAL からは外れた
curl -s 'https://services.nvd.nist.gov/rest/json/cves/2.0?cveId=CVE-2026-109619&cvssV3Severity=HIGH' | jq .totalResults
# → 1
```

つまり見出しの数字は「**解析が終わった** CVE の数」で、「危険な CVE の数」ではありません。
残り9件の離脱も同じ状態です（`CVE-2026-101809` は `Awaiting Analysis` で CNA 10.0、
`CVE-2026-101420` は `Undergoing Analysis` で 9.6、`CVE-2026-20043` / `-76473` / `-76474` /
`-76475` は `Awaiting Analysis` で 9.0〜9.8、`CVE-2026-113390` / `-112370` / `-114220` は
`Deferred` で 9.9 / 9.1）。いずれも窓の内側で公開され、CNA の評価では十分に危険なのに、
どちらのクエリにも出てきません。

> 実務ルール: `cvssV3Severity=CRITICAL` は便利なノイズ除去であって、危険の定義ではありません。
> 答えているのは「NVD が解析を終えたものは何か」という別の問いです。

**(c) 読み取り側にバグがあり、このスナップショットで直しました。** 上の数字を再計算していて
`tools/intel/fetch-intel` の欠陥が出ました。`collect_nvd_critical` は `cvssMetricV31` の
**先頭**をスコアとして採用していましたが、NVD は一部のレコードで CNA（Secondary）を NVD
（Primary）より先に並べます。両者は深刻度帯ごと食い違うことがあります:

```console
$ curl -s 'https://services.nvd.nist.gov/rest/json/cves/2.0?cveId=CVE-2026-95695' | jq '.vulnerabilities[0].cve.metrics.cvssMetricV31'
# psirt@us.ibm.com  Secondary  7.4  HIGH
# nvd@nist.gov      Primary    9.1  CRITICAL
```

この行は CRITICAL フィルタで選ばれ、7.4 として記録されていました。抽出は Primary を優先する
よう修正し（無ければ在るものを使う）、**同じ125行**で ≥9.8 の件数は **53 → 72** に変わります。
ちょうど 10.0 の件数（13）は動きません。世界ではなく、読み取り側が変わったのです。
[`docs/13`](13-recent-criticals.ja.md) と古い `data/` スナップショットは取得時の値をそのまま
保ちます。履歴を書き換えず、[`docs/13` §9](13-recent-criticals.ja.md) に訂正として記録します。

## 4. EPSS が php2shell に移った — 2件とも93パーセンタイル

| CVE | EPSS（2026-10-22） | パーセンタイル | CRITICAL スイープに入っているか |
|---|--:|--:|---|
| `CVE-2026-109619` | **5.76%** | 0.930 | いいえ（8.1） |
| `CVE-2026-109618` | **5.31%** | 0.926 | はい（9.8） |
| 窓のその他の最高値 | 3.04%（`CVE-2020-37282`） | — | はい |

昨日のスイープは「窓の中で最も高い EPSS は **3.0%**」と書いていました。書いた時点では正しく、
PHP の2件にはまだスコアがありませんでした。1日で、2週間の窓の上位2件が php2shell の2件に
なり、そのうち**高い方は CRITICAL を出た方**です。

EPSS は**モデルの確率推定**で、観測ではありません。CISA のアラートは今も「悪用は観測して
いない」と述べており、KEV 登録もありません。この4つが別の主張である理由は
[`docs/08` §4](08-intel-sources.ja.md) にあります。使い方はもっと狭く、**在庫がなく、
後回しにする順番を決めたいなら、データが1番目に置くのはこの行**ということです。公開 PoC、
公開から修正まで約24時間（2026-10-20 → 10-21）、そしてこの束で最大の EPSS。

## 5. MSRC が `2026-Oct` をまた再公開: 2,578 → 2,584、増えた6件

このリポジトリの観測窓で CVRF の件数は 2,578（2026-10-13）→ 2,575（10-21）→ 2,578
（10-22 21:20）→ **2,584**（10-22 22:25）と読み取りました。**増減の両方向に動く**のが要点です。
増えた6件はすべて Azure で、**3件が CVSS 10.0** です。

| CVE | CVSS | 内容 | 悪用 |
|---|--:|---|---|
| `CVE-2026-110063` | 10.0 | VM Inspector for Azure Virtual Machines — 特権昇格 | No |
| `CVE-2026-83938` | 10.0 | Azure Kubernetes Configuration Service — 特権昇格 | No |
| `CVE-2026-97785` | 10.0 | AAD App Proxy — 特権昇格 | No |
| `CVE-2026-105014` | 9.1 | Azure Pipelines — リモートコード実行（コマンド注入） | No |
| `CVE-2026-108456` | 7.7 | Azure AI Foundry — 特権昇格 | No |
| `CVE-2026-96185` | 7.5 | Exchange Online — リモートコード実行 | No |

スコアではなく悪用状況の列を読んでください。6件とも `Exploited:No` / `Publicly Disclosed:No`
で、今月の悪用確認済みは **1件のまま**（`CVE-2026-96951`、10月の Patch Tuesday）。10.0 の
3件は `Latest Software Release: N/A` のクラウドサービス特権昇格で、**手元で上げるビルドが
ありません**。「パッチを当てる」が実行可能な指示にならない種類の脆弱性です。テナント側で
できるのは CVRF のレコードとサービスの変更通知を追うことまでで、このリポジトリは検証できない
Azure の設定手順を載せません。

## 6. このリポジトリの主張に重なる新しい行

スイープに入ったのは11件です。うち4件は §5 の Azure（`CVE-2026-110063` / `-83938` /
`-97785` が 10.0、`CVE-2026-105014` が 9.1）、1件は `CVE-2026-95695`（§3(c) で 7.4 と
誤読していた IBM WebSphere Liberty、NVD は 9.1）。残る6件は共通の主題を持ちます。
**ネットワークの境界ではなく、エージェント・コンテナ・サンドボックスの境界**です。

| CVE | CVSS | 壊れるもの | 修正 |
|---|--:|---|---|
| `CVE-2026-109444` | 9.8 | **OpenSRE** ≤ 0.1.2026.10.19 — ヘッドレスプレゼンタの `execution_allowed()` が常に True を返し、`shell_run` が確認なしで走る。アラートや Slack に仕込んだ指示がホストのコマンドになり、LLM / Slack / クラウドの資格情報が持ち出される | 以降の日付版（0.x へのバックポートなし） |
| `CVE-2026-77930` | 9.8 | **EvoScientist** 0.1.0–0.2.4 — `interrupt_on` ゲートを持たない非同期サブエージェントにコマンドを委譲する。取得した Web ページに仕込んだ指示が、ユーザ権限と環境変数の秘密で実行される | **0.2.5** |
| `CVE-2026-115377` | 9.9 | **Incus** — 移行元が転送ボリュームに symlink を仕込み、rsync / btrfs receive がホストのファイルを root で書く | **6.0.7 / 7.0.2 / 7.5.0** |
| `CVE-2026-115375` | 9.9 | **Incus** — 取り込んだバックアップの `index.yaml` 内の依存ボリューム名に `../` を入れると、ホストに root 所有のディレクトリを作れる | **7.0.2 / 7.5.0** |
| `CVE-2026-115384` | 9.9 | **Wasmtime** — 型の合わない component-model-async コールバック戻り値でネイティブスタック（約16KB）を越え、悪意あるゲストがサンドボックスを脱出する | **48.0.4 / 49.0.2** |
| `CVE-2022-51026` | 9.8 | **Bytebase** 0.12.0–1.0.0 — `/api/auth/login/GITLAB_SELF_HOST` がクライアント供給の `instanceUrl` を信頼し、Owner を含む任意のユーザとしてログインできる | **1.0.1** |

最初の2件は10月のパターンの機構違いです。Railway・LiteLLM・OpenCode は「**鍵の保管場所**が
弱点」でした。こちらは「**許可プロンプト**が弱点」— エージェントにコマンドを実行させないための
仕組みそのものが True を返します。残り4件は同じ話の裏側で、コンテナ・移行経路・WASM の境界は
**確認の代わりに信頼を置いてしまう**場所です。

数字を上げる以外にやるべきこと:

1. **ゲートをヘッドレスで試す。** 実際に配備するモード（`--headless`、cron、CI）で、無害な
   カナリアコマンドを実行させ、拒否することを確認する。拒否できなければ、そのゲートは
   制御ではなく文章です。
2. **エージェント専用の資格情報**を渡す。短命・スコープ限定・ローテーション可能に。クラウドと
   Slack の秘密が同居するホストの環境変数を渡さない。`docs/11` §5 と同じ議論です。
3. **取り込みをデータではなく入力として扱う。** どちらのバイパスも、エージェントが読むテキスト
   （アラート、Slack メッセージ、取得したページ）だけで成立します。

検証メモ: これらは NVD / CNA の記述とリリース番号の算術です。OpenSRE と EvoScientist は
ベンダのアドバイザリも GHSA も読んでいない（KEV 登録もなし）ため、修正版は CNA の主張として
扱ってください。Incus・Wasmtime・Bytebase の版範囲は NVD レコードに書かれているものです。

## 7. 本日中に期限が来るもの

| 項目 | 2026-10-23 07:25 JST 時点 | やること |
|---|---|---|
| **Plex** `CVE-2026-96654` / `-96656` | KEV の期限は**本日 2026-10-23** | 1.43.3.10861 以上へ。現行リリースは **1.43.5.11029** |
| **EG Secure Solutions SiteGuard** `CVE-2026-106931` | KEV の期限は**本日 2026-10-23** | ベンダの緩和策。Plex と同じ 2026-10-20 の追加分で、要件も同じ |
| 本日期限の KEV 3件すべて | CISA の**フォレンジックトリアージ**要件つき | まず適用、次にトリアージ。「適用済み」は「きれい」ではない |
| **php2shell** | KEV 登録なし。EPSS 5.3〜5.8% | 10-20 / 21 に PHP がインターネット公開されていたなら侵害確認を実施 |
| **Temurin / Adoptium** | 17.0.21+9 / 21.0.13+9 / 25.0.5+8 が 2026-10-22 公開 | そのタグでイメージを再ビルド。8 と 11 は8月ビルドのままで、番号は Oracle と対応しない（[`docs/07` §3](07-oracle-java-oct2026.ja.md)） |
| その他 | PHP / Node / GitLab / Tomcat / httpd / BIND / Oracle Java はすべて据え置き | 今日の作業は「適用」であって「待機」ではない |

この表の依存関係は明示しておく価値があります。**Plex の期限は時計であって、パッチ水準では
ありません。** KEV を満たすのは 1.43.3.10861、Plex が今日出しているのは 1.43.5.11029。
どちらでも期限は満たされ、どうせ選ぶなら後者です。

## 8. 変わっていない（したがって今も正しい）こと

- **カーネル: mainline に修正なし。** `torvalds/linux` ミラーをコミット検索で再確認しました。
  `ZDI-CAN-33549` → 0件、`ZDI-CAN-33367` → 0件、`ZDI-CAN-33774` → 2件（どちらも2024年の
  `dt-bindings` / `arm64: dts` のコミットで、番号が含まれるだけ）。[`docs/17`](17-lkml-oct2026.ja.md)
  の結論はそのままです。未修正。ksmbd は使わないなら止める。
- **より新しい修正版はどこにもない。** PHP 8.5.12 / 8.4.27 / 8.3.36 / 8.2.35、Node 26.12.1 /
  24.22.1 / 22.23.4、GitLab 19.5.1（Docker タグ一覧に 19.5.2 はなし）、Tomcat 11.0.27 /
  10.1.61、httpd 2.4.69、BIND 9.20.30 / 9.21.27、Oracle Java 21.0.13 / 17.0.21 / 11.0.33 /
  8u511 / 25.0.5 / 27.0.1。
- **LiteLLM 1.107.0 は依然として PyPI に無い。** 一覧にあるのは `1.107.0rc1` / `rc2` と
  `.dev1`〜`3` だけで、現行は 1.106.2。`1.107.0` を固定した lockfile があるなら、それは
  PyPI から来ていない — それ自体が所見です。
- **KEV に Java / PHP / GitLab / Apache / Railway / LiteLLM / Tailscale / OpenSRE /
  EvoScientist の登録はありません。**
- **JVN は静か**（20件）。

## 9. 1分で追認する方法

```bash
# 1) KEV は動いたか（catalogVersion と最終 dateAdded）
curl -s https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json \
  | jq -r '.catalogVersion, ([.vulnerabilities[].dateAdded]|max)'

# 2) PHP の2件目はまだ 8.1 か（動いた方のスコア）
curl -s 'https://services.nvd.nist.gov/rest/json/cves/2.0?cveId=CVE-2026-109619' \
  | jq -r '.vulnerabilities[0].cve.metrics.cvssMetricV31[]|[.source,.cvssData.baseScore]|@tsv'

# 3) ベンダビルドは出たか（動いたのは Temurin）
curl -s 'https://api.adoptium.net/v3/assets/latest/21/hotspot?architecture=x64&image_type=jdk&os=linux' \
  | jq -r '.[0].release_name'

# 4) 全部取り直して、このスナップショットと差分を取る
tools/intel/fetch-intel --date 2026-10-23-1200jst --out /tmp/now
diff <(jq -S 'del(.fetched_at)' data/2026-10-23-0730jst/nvd-critical-14d.json) \
     <(jq -S 'del(.fetched_at)' /tmp/now/nvd-critical-14d.json)
```

## 10. 出典

- §1〜§7 はすべて [`data/2026-10-23-0730jst/`](../data/2026-10-23-0730jst/)。取得は
  `tools/intel/fetch-intel`、2026-10-22 22:24:59 UTC（NVD スイープのみ §3(c) の修正後に
  22:32:32 UTC で再取得）。
- NVD の個別レコード（スコア、`vulnStatus`、ベクタ）:
  <https://services.nvd.nist.gov/rest/json/cves/2.0?cveId=…>
- EPSS: <https://api.first.org/data/v1/epss?cve=CVE-2026-109618,CVE-2026-109619>
- MSRC CVRF（再公開）: <https://api.msrc.microsoft.com/cvrf/v3.0/cvrf/2026-Oct>
- KEV: <https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json>
- CISA の PHP アラート（未改訂、「観測していない」）:
  <https://www.cisa.gov/news-events/alerts/2026/10/21/critical-vulnerabilities-php-require-immediate-patching>
- Adoptium: <https://api.adoptium.net/v3/assets/latest/21/hotspot?architecture=x64&image_type=jdk&os=linux>
- LiteLLM の PyPI 状況: <https://pypi.org/pypi/litellm/json>
- カーネルのコミット検索: <https://api.github.com/search/commits?q=repo:torvalds/linux+33774>
- ベンダのリリース索引: PHP <https://www.php.net/releases/index.php?json&version=8.5>、
  Node <https://nodejs.org/dist/index.json>、
  GitLab タグ <https://hub.docker.com/v2/repositories/gitlab/gitlab-ee/tags>、
  Tomcat <https://dlcdn.apache.org/tomcat/tomcat-11/>、
  httpd <https://dlcdn.apache.org/httpd/>、
  BIND <https://downloads.isc.org/isc/bind9/>、
  Plex <https://plex.tv/api/downloads/5.json>
- Unit 42 の eMudhra CA 解説（2026-10-22）と OAuth 攻撃の概観:
  <https://unit42.paloaltonetworks.com/emudhra-certificate-compromise/>、
  <https://unit42.paloaltonetworks.com/current-landscape-oauth-attacks/>
