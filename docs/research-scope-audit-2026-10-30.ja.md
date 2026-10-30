# 対象範囲の監査（2026年10月30日）

固定された[135レコードの登録簿](../data/2026-10-30-1031/incident-register.json)を、記事の主題と対処の適用範囲で分類した。[範囲sidecar](../content/research-scope.json)の結果は **グローバル129、日本4、その他地域2、未確定0**。これは編集した話題グループ数であり、世界の事件の全数調査ではない。sidecarには登録簿の正確なSHA-256と実際の分類見直し時刻を記録した。この時刻は情報源を新たに検証した時刻ではない。

## 基準

- `global`：技術的な成立条件を満たす場合に、法域を越えて関連する技術・製品・パッケージ・プラットフォームのリスク。各国の被害や実悪用を確認したという意味ではない。
- `japan`：日本中心のサービス影響、事件、当局報告、地域向け案内。影響を受けた全員が日本在住とは断定しない。
- `regional`：日本以外の局地的な影響や観測された活動。他地域でも役立つ教訓があっても、被害自体が全世界に広がったとはしない。
- `unresolved`：資料から適切な範囲を確定できないもの。今回該当する行はなかったが、今後の不確実な案件向けに値を残す。

135件すべての安定IDに判断を一つずつ与え、同等の日本語・英語の理由と、その行の既存情報源URLを付した。情報源の言語・ホスト名や、企業・開発者の国籍を分類基準にしていない。[英語編集対応表](../data/2026-10-30-1031/editorial-en-map.json)は読解の補助であり、独立した事件の証拠ではない。

## 注意を要する判断

| レコード | 分類 | 証拠と解釈 |
|---|---|---|
| `gmo-domain-stop` | 日本 | [GMOの契約者向け案内](https://group.gmo/info/alert/20261030/)は「お名前.com デスクトップクラウド」の補償手続き・代替サービスが対象。[保存原文](../data/2026-10-30-1031/gmo-customer30.html.gz)は個別サービスの文脈を示すが、全契約者の居住地を確定するものではない。 |
| `atlink-beta` | 日本 | [@link運営案内](https://at-link.net/information/アットリンクへの不正アクセスおよびサービスの/)は医療機関の業務と患者への影響を扱い、[保存原文](../data/2026-10-30-1031/atlink-operation.html.gz)は予約・院内システム連携・患者アプリの停止を詳述する。 |
| `studio-reporting` | 日本 | 行の主題は日本の個人情報保護委員会への連名報告と本人通知。[公式ポータル](https://studio.design/ja/security/notice/2026-10-incident)と[保存原文](../data/2026-10-30-1031/studio-incident.html.gz)には全登録者の情報、外部APIキー、国情報を含むAI先行利用申込情報の露出可能性もある。日本枠への配置は当該行の当局報告という主題によるもので、**日本だけの情報露出という意味ではない**。プラットフォームの対処は国際的にも関連し得る。 |
| `sonet-disclosure` | 日本 | [運営者PDF](https://www.sonynetwork.co.jp/corporation/release/2026/v5e5u00000000zwj-att/20261027.pdf)を[前回snapshot](../data/20261029T050117Z-dbf8f2/supplement-8b80d04ae0c1ca704fbb.gz)に保存。So-net・plala（Sコース）の契約者・メールサービス区分と日本の当局への報告を扱う。世界のSonyサービス全体の侵害ではない。 |
| `unm-recovery` | その他地域 | [UNM公式案内](https://hscnews.unm.edu/news/ambulance-traffic-diverted-clinical-appointments-cancelled-and-classes-cancelled-due-to-cybersecurity-issue-at-unm-hsc)と[保存原文](../data/20261029T050117Z-dbf8f2/unm-official.html.gz)は、ニューメキシコの医療システムの救急搬送・外来・授業への影響と復旧を扱う。 |
| `silent-train` | その他地域 | [Lumen自身の観測](https://www.lumen.com/blog/en-us/silent-train-volt-typhoon-operational-framework)と[保存原文](../data/20261029T050117Z-dbf8f2/supplement-80facae04c59c1bd916e.gz)は、米国の戦略的重要組織への活動とHawaii・California・Texasへの集中を記載。複数国の中継ノードは世界各国の被害を示さない。 |
| `railway-signups`、`connectwise-validation` | グローバル | [Railway予備報告](https://blog.railway.com/p/preliminary-report-october-security-incident)（[保存資料](../data/2026-10-30-1031/railway-preliminary.html.gz)）と[ConnectWise案内](https://www.connectwise.com/company/trust/advisories)（[保存資料](../data/2026-10-30-1031/connectwise.html.gz)）は、特定法域に限定せずサービス利用者への対処・復旧状況を扱う。利用者の居住地や復旧完了を確定する分類ではない。 |
| ヤマハNWR100・Windows製品、Struts | グローバル | [NWR100](https://jvn.jp/vu/JVNVU91027179/)、[LAN Monitor](https://jvn.jp/jp/JVN23695234/)、[YMS-VPN8](https://jvn.jp/jp/JVN30675482/)、[Struts](https://jvn.jp/jp/JVN82782759/)は対象版と技術条件の問題。日本語での公表や企業の出自を理由に日本限定の事件とはしない。 |
| `php-kernel-identity` | グローバル | [Dream報告](https://dreamgroup.com/blog/chained-php2shell-exploit-roots-25-servers)と[保存原文](../data/20261029T050117Z-dbf8f2/supplement-ff1ebca6f559787f35b4.gz)は米国・日本・台湾・韓国にまたがる観測を述べる。攻撃連鎖は条件付きで関連し、観測した25サーバーを世界全体の件数とはしない。 |

KEVの各行は製品リスクの技術的な適用範囲が法域を越えるためグローバルとした。ただしCISAの対処期限は米国連邦機関向けの要件で、世界共通の法的期限ではない。パッケージ・悪性パッケージの行は列挙された依存関係と成立条件に関わり、開発者の国籍や世界の感染数を示さない。Juniper・Sophosでベンダー本文を取得できないことや最低修正版が不明なことは対処情報の確実性を制限するが、記載された製品リスクの法域を越えた関連性を否定しない。

## 監査の限界

今回行ったのは現行の編集済みデータベースと、選んだ保存済み一次資料の範囲分類であり、新しい収集期間の調査や、全技術記述の再検証ではない。**135件の全情報源を本日再確認したとは主張しない**。最新snapshotの[調査記録](research-2026-10-30-1031.en.md)と[ベンダー追跡記録](research-vendors-2026-10-30-1031.md)は、更新確認と以前からの文脈を区別している。So-net・UNM・Silent Train・ヤマハ・Strutsなどの引継ぎ資料は、**以前からの文脈の保持であり、新たに再検証したものではない**。保存原文を分類のために読んでも事件の最新状況を再確認したことにはならない。過去の登録簿・保存原文は変更せず、世界全体を網羅するという主張も裏付けられない。日本・その他地域の分離によって国境を越えて役立つ教訓まで見えなくしない。

## 収集範囲の不足と次回の精査

枠を分けても、収集が地理的に代表性を持つわけではありません。NVD・GHSA・KEVと選定した開発元の告知は、公開された脆弱性と既に監視している情報源に偏ります。ある地域や言語の記録がないことは、事件がない証拠ではありません。今回の分類は135論点のデータベースが対象で、別の被害ビューと過去レポートは既存の構成を保持します。地域別の収集を広げる前に、情報源の選定と取得可否を記録する必要があります。保存版や登録簿のハッシュが変われば、対応する精査ができるまで自動的に確認待ちの枠へ入り、国名から分類を推測しません。
