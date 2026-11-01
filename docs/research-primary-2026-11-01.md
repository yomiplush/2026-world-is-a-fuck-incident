# 一次資料の再確認 — 2026-11-01

前回基準は2026-10-31T01:02:11Z。11月1日に公式ページ本文を再確認した。動的ページの取得時点の内容であり、前回以降の全世界の出来事が存在しないことを意味しない。このノートでは台帳を直接変更せず、取得結果と編集上の判断材料を記録する。機械収集の完全な件数・差分・取得時刻は今回のcollection-summaryとmanifestを参照する。

## CISA KEV

[CISA公式GitHubミラー](https://raw.githubusercontent.com/cisagov/kev-data/main/known_exploited_vulnerabilities.json)はcatalogVersion=`2026.10.30`、dateReleased=`2026-10-30T17:02:45.3665Z`、count=1766。前回台帳と同じ版・件数で、10月31日以降の追加をこの取得からは確認できない。CISA本体の[JSON](https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json)と[カタログ](https://www.cisa.gov/known-exploited-vulnerabilities-catalog)はweb取得が403だったため、公式ミラーを利用した。厳密な同一bytes判定は親作業の原本収集結果に委ねる。

## ベンダー続報

### Railway：新しい復旧更新を確認できず

[公式status](https://status.railway.com/)で最新として掲載される事件更新は10月29日15:45 UTC。新規登録停止・再開日未定が続く。次回更新予定の10月30日16:00 UTCは今回確認より前であり、この予定を履行・再開実績として扱えない。statusの稼働コンポーネント表示から新規登録の再開を推定しない。前回の資料日付を保持し、`rechecked-no-material-update`とするのが妥当。

### GMO：428件のまま、10月30日の直接連絡開始案内から新たな続報なし

[公式index](https://group.gmo/info/alert/)の最新掲載は10月30日の[顧客向け案内](https://group.gmo/info/alert/20261030/)。15:30時点でお見舞金・代替サービスについて契約者へ直接連絡を開始したという内容を再確認した。[第16報](https://group.gmo/info/alert/2026102902/)の最新追記は10月30日18:00 JST、情報提供累計428件（+107件）のまま。平日18:00更新という案内がある。被害者数・逮捕件数・支払完了・全面復旧・損害総額はいずれもこの資料から確定しない。前回の資料日付・件数を保持し、`rechecked-no-material-update`とする。

### Studio：連名報告は11月上旬予定のまま

[公式portal](https://studio.design/ja/security/notice/2026-10-incident)の最新履歴は10月28日00:30、個人情報保護委員会への連名報告受付の開始時期を11月上旬予定とする案内。11月1日になったこと自体を受付開始の証拠にしない。外部からデータを取得可能だった状態と、実際の取得が未確認である点を区別する。前回の日付・不明事項を保持し、`rechecked-no-material-update`とする。

### @link：一部医療機関でのβテストのまま

[運営状況](https://at-link.net/information/アットリンクへの不正アクセスおよびサービスの/)の最終更新は10月28日12:30 JST。一部医療機関でクラウドβ版テスト開始、テスト完了後に同意済み医療機関へ案内すると説明する。患者アプリ・WEB予約・他社システム連携等は停止継続と記載。料金返金は11月中を目途とする予定で、実施完了ではない。予約変更は医療機関へ直接確認するという案内を保持し、`rechecked-no-material-update`とする。

## CERT/CC、JPCERT/CC、GitHubの探索

[CERT/CC一覧](https://www.kb.cert.org/vuls/)の最新公開項目は10月26日のVU#701544・VU#128947。二次サイトが10月31日と表示していたPHP・Xerjの資料も、[PHP公式個票](https://www.kb.cert.org/vuls/id/763488/)は初出・改訂とも10月22日、[Xerj公式個票](https://www.kb.cert.org/vuls/id/645818/)は初出10月20日・最終改訂10月27日。二次サイトの表示日を新規公表日に用いない。

[JPCERT/CCトップ](https://www.jpcert.or.jp/)の最新注意喚起は10月29日更新のPHP、最新脆弱性関連情報は10月30日14:00の三菱電機製品情報。この一覧から10月31日以降の新規注意喚起は確認できなかった。

[GitHubの日付指定検索](https://github.com/advisories?query=type%3Areviewed+published%3A2026-10-31..2026-11-01)では日付条件に反する10月30日掲載の項目が返り、エラーも表示された。このHTMLの絞込結果や表示総件数を期間内件数として採用しない。個票を確認した[Kubeflow archive DoS](https://github.com/advisories/GHSA-8fmv-6rg5-5924)・[Kubeflow log access](https://github.com/advisories/GHSA-wg5q-x4j9-qm54)はプロジェクト初出10月29日・GitHub DB掲載／最終更新10月30日、[pypdf EOF loop](https://github.com/advisories/GHSA-5849-834g-hvw5)もGitHub DB掲載／最終更新10月30日だったため、今回窓の新規公表として採用しない。新しいGitHub advisoryの有無・件数は親作業のAPI収集結果で判断する。

## 残る不明点

- 4社の全顧客の復旧・補償完了、最終漏えい対象数、調査完了は今回確認資料から確定しない。
- Railwayの更新予定が経過しているが、予定の遅れの原因やその後の非公開対応は不明。
- 上記の探索は公式ページの取得時表示に基づく。旧資料を再確認したことと、前回以降に重要な動向が新規公表されたことを区別する。

## 新規採用候補：Apache MINA CVE-2026-118636

[CVE Program公式原本内のApache CNA記録](https://raw.githubusercontent.com/CVEProject/cvelistV5/main/cves/2026/118xxx/CVE-2026-118636.json)を取得した。datePublishedは2026-10-31T20:17:11.191Z、dateUpdatedは同日21:08:27.192Z。ApacheのCVSS v3.1は9.8 Critical。3.0 codecのJavaNativeMessageDecoderがclass filterなしでObjectInputStream.readObject()を呼ぶため、信頼できないpeerから受信させるアプリケーションではgadget chainによる遠隔コード実行につながる。3.0.0 branchはinactiveで修正releaseの予定がなく、最新の2.2.X branchを推奨する。

対象データはpackageName=`org.apache.mina:mina-core`、version=`3.0.0`、lessThanOrEqual=`3.0.0-M2`、versionType=`maven`、tag=`unsupported-when-assigned`。この版の列挙は通常の安定版／milestoneの順序と紛らわしいため、独自に比較範囲を拡張・訂正しない。表示には「MINA 3.0系の当該codec」を用い、原文の境界は原本を参照させる。2.2系への移行推奨は、この脆弱性を修正する3.0系releaseが存在するという意味ではない。

一次告知は[Apache公式mail archive](https://lists.apache.org/thread/h76nwcrkvsffhsk2kq6cjzc6srtnty7x)。検索結果本文は取得できたが、直接openは失敗したため、判断の根拠は上記CNA原本を主とした。実悪用・侵害件数・PoC公開・特定の2.2.x修正版をこの原本からは確定しない。確認済みの潜在的影響としてdeltaへ採用可能で、実被害の確定記録にはしない。

## 新規採用候補：NorthflankのAI APIキー不正利用報告

[BleepingComputer報道](https://www.bleepingcomputer.com/news/security/northflank-security-breach-leads-to-abuse-of-customers-ai-api-keys/)を探索の入口に、[Northflank公式status](https://status.northflank.com/)を確認した。前回の`data/2026-10-31-1010/incident-register.json`・`impact-register.json`にはNorthflankの既収録を確認できなかった。

公式statusの10月30日23:38 UTC更新は、保存されたAI APIキーの不正利用をユーザーが報告したと公表。発行元で旧認証情報を失効し、再発行した値をNorthflankへ反映し、AI事業者の利用・請求ログを点検するよう指示した。全環境変数を侵害済みとして扱う方針はworkload・secret group・global secretを対象とし、実際に全顧客の全秘密情報が窃取されたとの確定ではない。

同じ公式statusに、10月31日01:04 UTCの全顧客への監査ログ開放、13:34のMySQL／Redis、22:32のMinio、23:31のRabbitMQのsecret rotation開放を確認した。いずれも今回基準2026-11-01T12:33:30Zより前。Postgres／MongoDBは10月30日15:12の開放済みで、外部公開したadd-onを非公開化する指示もある。

侵入経路、影響人数、被害額、BYOC固有の影響範囲はこの資料から確定しない。statusはIdentified・Major outageで、アプリ／APIがOperationalという表示だけで全面復旧としない。事件の初報は前回基準より前だが、今回窓内に監査・rotationの追加対応があり、未収録の実被害関連候補として採用可能。被害表現は「AIキー不正利用のユーザー報告を運営が公表」とし、全件漏えいや攻撃者の同一性は推定しない。
