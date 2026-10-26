# 2026-10-26 21:35 JST — 全深刻度の固定窓収集と一次資料照合

対象は **2026-10-26 21:35 JST / 12:35 UTC**、前回14:56 JST以降の固定窓は **05:56:00〜12:35:00 UTC**です。取得は21:37 JST以降に行いました。公開・DB収録・改訂・侵入・修正提供・復旧は、それぞれ異なる時刻として扱います。保存した資料は取得時の現行改訂であり、無記載の追記を対象時点の本文へ完全には復元できません。

## 収集結果

| 集合 | 結果 | 読み方 |
|---|---:|---|
| NVD published | 99件 | 全件modifiedにも含まれます。うち1件はRejectedです |
| NVD modified | 1,434件 | 上記99件と、以前に収録された1,335件の改訂です |
| GHSA published | 111件 | unreviewed103、malware8、reviewed0 |
| GHSA modified | 151件 | unreviewed124、malware27、reviewed0。公開111件は全件こちらにも含まれます |
| KEV | 1,756件 | 2026.10.23版。前回原本と展開後バイト列が一致し、追加0です |
| フィード | 18取得先 | 17応答成功、IPA旧URL404。現行窓口は取得済みです |

NVDとGHSAの公開集合は95 CVEで重なり、GHSAには前回NVD publishedの8 CVEも含まれます。残る8件はCVEではないmalware勧告です。**99＋1,434＋111＋151を事件数や被害数へ足し合わせないでください。** `CVE-2012-20006`はRejectedとして原本・索引に残し、新しい有効な脆弱性の対応対象にはしていません。

今回はGitHub公式APIの`type=reviewed / unreviewed / malware`を明示し、`published`に加えて、公開または更新を対象とする`modified`も全ページ取得しました。以前の既定照会と範囲が異なるため、今回のmalware8件を以前の窓の「malwareなし」と単純比較できません。[GitHub公式API仕様](https://docs.github.com/en/rest/security-advisories/global-advisories)

開発元のFrappe3勧告は14:58 JSTに公開されていますが、今回のグローバル公開窓には当該3 CVEが含まれません。Ashの開発元勧告は前回窓内の14:32 JSTで、今回NVDへ収録されました。APIの集合と開発元の公開時刻が一致しない場合もあるため、グローバルAPIのreviewed0を「開発元の新規勧告がない」と解釈しないでください。

## 優先して確認する範囲

導入済みの悪性パッケージ、公開した認証・画像取得経路、テナント境界、機微情報を配信するフィルターから確認してください。バックアップ・秘密情報の失効、PHP/Brotliの更新・侵害調査、従来の境界機器対策も継続します。以下の「差分」には窓内のDB初収録や国内注意喚起を含み、すべてが今夜の新規発見・新しい侵害という意味ではありません。

### 1. npmの2パッケージ：インストール時の採掘処理

**固定窓の追加登録・公開 / 15:30 JST（GHSA公開）。**

GitHubのmalware勧告はdsh-plugin-blender-3d 0.2.1と@walknpm/todo-cli 2.0.1のpostinstallによる採掘プログラムと永続化処理を説明しています。rootやパスワード不要sudoの有無で処理が異なります。全npmパッケージやBlender本体の侵害という意味ではありません。

**確認する対応：** 該当版の導入履歴を確認してください。実行済みなら環境を隔離し、永続化・外部通信・資格情報への到達を調査し、安全な環境から必要な鍵を失効してください。

[GitHub malware勧告](https://github.com/advisories/GHSA-c7hg-7rf4-q54h) / [GitHub malware勧告](https://github.com/advisories/GHSA-q4qv-538q-m27m) / [OpenSSF原記録](https://raw.githubusercontent.com/ossf/malicious-packages/eac9baa31aaebdf7ba1cb053549c9fcddb5bb60f/osv/malicious/npm/dsh-plugin-blender-3d/MAL-2026-18321.json)

### 2. @worca/app：対象RC版のmalware勧告

**固定窓の追加登録・公開 / 16:33 JST（GHSA公開）。**

GitHubは@worca/app 1.14.0-rc.2 / 1.14.0-rc.4をmalwareと分類し、実行・導入した端末を侵害された前提で扱うよう案内しています。公開記録は具体的な被害組織数や侵入開始日時を示していません。

**確認する対応：** 対象版を導入した環境を隔離して調査してください。別の安全な端末から鍵・秘密情報を更新し、パッケージ削除だけで復旧完了としないでください。

[GitHub malware勧告](https://github.com/advisories/GHSA-rmc5-cxrx-5fh9)

### 3. npmのpublish-poc系：インストール環境の公開権限

**固定窓の追加登録・公開 / 18:31 JST（GHSA公開）。**

publish-poc-test3の対象7版はpostinstallで利用環境のnpm認証を用いた公開処理を試みると報告されています。publish-poc-base 1.0.7はREADME断片と資格情報を含む一時ファイルを準備しますが、その版では公開・通信の前に削除すると説明されています。両者を同じ外部送信成功と数えないでください。

**確認する対応：** 対象版とCIの導入ログ、npm公開履歴を確認してください。不審な公開があれば該当トークンを失効し、依存関係と公開権限を見直してください。

[test3勧告](https://github.com/advisories/GHSA-mq69-4j49-gmx8) / [base勧告](https://github.com/advisories/GHSA-35j9-6ggx-3fcq) / [OpenSSF原記録](https://raw.githubusercontent.com/ossf/malicious-packages/4f27542fecd13e7f077489c04a2f3503d1189f32/osv/malicious/npm/publish-poc-test3/MAL-2026-18324.json)

### 4. PyPI netweavex：import時の遠隔コード取得

**固定窓の追加登録・公開 / 21:30 JST（GHSA公開）。**

対象はnetweavex 1.1.0 / 1.1.1 / 1.1.2です。原分析は正規パッケージの複製、難読化、import時のGitHubからのコード取得・実行を説明しています。分析時の取得先はplaceholderだったとも記載されており、特定の情報窃取が成功したとまでは確認していません。

**確認する対応：** 該当版を実行せず導入履歴を確認してください。実行済みなら外部通信と実行履歴を調査し、秘密情報の露出に応じて失効・再構築を行ってください。

[GitHub malware勧告](https://github.com/advisories/GHSA-rr8h-gqmw-34rx) / [OpenSSF原記録](https://raw.githubusercontent.com/ossf/malicious-packages/704cd12348e734be09a1c7c2f3bdba3e5f889d84/osv/malicious/pypi/netweavex/MAL-2026-18328.json)

### 5. PyPIの2件：基本端末情報の送信と分析分類

**固定窓の追加登録・公開 / 18:31 JST（GHSA公開）。**

zagents-framework 6.25.30.10b5 / 99.25.30.10b5とchanges-lxc-wrapper 0.0.0 / 0.1.0は、installまたはimportで基本端末情報を送ると記録されています。GitHubはmalware区分ですが、原分析の分類はPROBABLY_PENTESTです。大規模な資格情報窃取事件と同一視しないでください。

**確認する対応：** 利用目的と導入経路を確認し、不要な対象パッケージを除外してください。実行済みなら送信先と実際の影響を調査してください。

[zagents勧告](https://github.com/advisories/GHSA-vqh8-gjqw-v2r3) / [changes-lxc-wrapper勧告](https://github.com/advisories/GHSA-3rm9-gfp2-hphh) / [OpenSSF原記録](https://raw.githubusercontent.com/ossf/malicious-packages/6338462adbfe05eae85d7721e0235915b2a4e352/osv/malicious/pypi/zagents-framework/MAL-2026-18327.json)

### 6. Frappe Builder：画像取得のSSRFとAI利用権限

**固定窓の追加登録・公開 / 14:58 JST（開発元勧告）、21:17 JST（NVD収録）。**

開発元は14:58 JSTに3勧告を公開しました。ログイン済み利用者による画像取得先の制御、redirect・DNS再解決による内部宛先への到達、AI provider keyを使うimprove_promptの権限不足が対象です。任意の未認証利用者による全サーバー侵害ではありません。

**確認する対応：** Builder 1.36.1以降とFrappe v16.36.1以降の要件を照合してください。画像取得先・公開保存物・AI利用ログを確認し、更新できない場合は対象APIの制限とAIキーの一時除去を検討してください。

[画像取得勧告](https://github.com/frappe/builder/security/advisories/GHSA-5qcg-q3jf-fjcg) / [AI利用権限勧告](https://github.com/frappe/builder/security/advisories/GHSA-58mj-c563-p78w) / [redirect対策勧告](https://github.com/frappe/builder/security/advisories/GHSA-hvrf-fhv3-3v7p)

### 7. MISP Guard：共有ポリシーの判定を確認

**固定窓の追加登録・公開 / 18:16 JST（NVD収録）。**

CVE-2026-116372は200以外の成功応答、116469はタグ・category・sharing group UUIDの大文字小文字によって、配信フィルターを迂回できる問題です。開発元は16:53 / 18:25 JSTのコミットで対処しています。MISP本体すべての侵害や、全てのfeedデータの流出確認ではありません。

**確認する対応：** 両修正を含む稼働コードを照合し、TLP等の許可設定と配信履歴を確認してください。最低の配布リリース番号は今回未確定です。

[成功応答の修正](https://github.com/MISP/misp-guard/commit/b5f606a4e57a49cc4dbf9b3ef0c6ddd19f866735) / [大文字小文字の修正](https://github.com/MISP/misp-guard/commit/9868b1d93fc9cc40cc7c69ca11c86afd825bbc1c)

### 8. Mendix SAML：IdP起点の応答再利用

**固定窓の追加登録・公開 / 20:16 JST（NVD収録）。**

CVE-2026-89209はIdP-initiated SSOで有効なSAML応答を再利用する条件の認証回避です。Mendix 9用モジュール3.6.29未満、10/11用4.2.4未満が対象です。任意のSAML応答を作るだけで成立するとまでは記載していません。

**確認する対応：** 利用するSAMLモジュールを3.6.29または4.2.4以降へ更新してください。直ちに更新できない場合はIdP-initiated SSOの無効化を開発元の案内と照合してください。

[Siemens公式勧告](https://cert-portal.siemens.com/productcert/html/ssa-137528.html)

### 9. Ash：upsertのテナント境界

**既公表資料の範囲補完 / 14:32 JST（開発元勧告）、17:17 JST（NVD収録）。**

CVE-2026-96581の開発元勧告は14:32 JSTで前回基準前の公表です。attribute multitenancyで、主キー等を受け付けるupsert付きcreate actionから他テナントのレコードを更新・取得できる条件を説明します。全create actionや全Ashアプリが同じ構成とは限りません。

**確認する対応：** Ash 3.37.2以降を照合し、テナントを跨ぐupsertとレコード移動履歴を確認してください。暫定upsert_conditionはMnesiaでは効かないとの例外にも注意してください。

[開発元勧告](https://github.com/ash-project/ash/security/advisories/GHSA-vw7c-67pf-gh96)

### 10. Apache Camel：更新後にもDoclingの設定が必要

**既公表資料の範囲補完 / 10/22公表、10/26 NVD収録。**

10/22公表の5勧告をNVD収録に合わせて補完しました。Doclingの入出力パス、Keycloak introspection結果の期限、AWS2-S3のオブジェクト名の式評価、CoAPのエラー情報漏えいは別の条件です。Keycloakの問題はtoken introspectionを有効にした場合で、既定ではありません。

**確認する対応：** 4.18.5 / 4.22.2 / 4.23.0等へ更新してください。外部入力からDocling出力先を指定できる経路は、更新後もoutputBaseDirectoryを設定してください。S3 headerと期限切れtokenの扱いを確認してください。

[Docling出力先](https://camel.apache.org/security/CVE-2026-95629.html) / [Docling引数](https://camel.apache.org/security/CVE-2026-95628.html) / [Keycloak期限](https://camel.apache.org/security/CVE-2026-95663.html) / [S3式評価](https://camel.apache.org/security/CVE-2026-95664.html) / [CoAPエラー](https://camel.apache.org/security/CVE-2026-101259.html)

### 11. SOEM：同一EtherCATネットワーク上の装置応答

**既公表資料の範囲補完 / 9/21付勧告、10/26 NVD収録。**

9/21付のRT-Labs資料はSOEM 2.0.0以前の6件を説明しています。悪意ある・侵害されたEtherCAT装置がmasterへ不正な応答を返すことが前提で、長さ・累積量・配列添字等の検証不足からメモリ破損、情報漏えい、停止の可能性があります。一般のインターネット到達だけで成立する問題ではありません。

**確認する対応：** SOEM 2.0.1以降の組込みを製品ベンダーと照合してください。EtherCAT区画への装置追加、保守用接続、master権限を確認し、設備の停止手順と検証計画に沿って更新してください。

[RT-Labs原勧告PDF](https://rt-labs.com/wp-content/uploads/2026/10/RRTL-260921-01.pdf)

### 12. WooCommerce決済連携：入金通知と注文状態

**既公表資料の範囲補完 / 10/23原報告公開、16:17 JST（NVD収録）。**

10/23公開の6件をNVD収録に合わせて補完しました。CCAvenue、nexi Alpha Bank、Eurobank、iKhokha、OPay、Mintpayの個別プラグインで、通知の真正性や既定の空secretによる支払済み・取消等への状態変更が問題です。銀行本体やWooCommerce本体の侵害ではありません。

**確認する対応：** iKhokhaは3.0.4以降を照合してください。他5件は原資料で既知の修正版なしとされるため、影響連携の利用停止・代替と、決済事業者の記録による入金照合を検討してください。

[CCAvenue原報告](https://wpscan.com/vulnerability/7224481a-60f8-42c2-87e9-4615ce666357/) / [nexi Alpha Bank原報告](https://wpscan.com/vulnerability/0a1c3070-181d-49ea-9488-d0d7e4be419c/) / [Eurobank原報告](https://wpscan.com/vulnerability/37851403-0765-4fc2-80f6-f70d3fc34a88/) / [iKhokha原報告](https://wpscan.com/vulnerability/2d888e78-ed1f-4968-9bdc-19e9420f6956/) / [OPay原報告](https://wpscan.com/vulnerability/c07f15a0-3c15-429f-bcde-1511ad658c6c/) / [Mintpay原報告](https://wpscan.com/vulnerability/593fa052-8917-416c-944b-11b890c9ab50/)

### 13. WordPress追加群：権限と個別修正版を照合

**固定窓の追加登録・公開 / 20:16 JST（NVD収録）。**

JetEngine 3.9.0以前のSQL injectionはContributor、Media Library Assistant 3.42以前のSQL injectionはAuthor、AI Engine 3.8.6以前の認可不足はContributorの権限条件を原資料で確認しました。ほかのXSS・CSRF登録も含め、全件を未認証RCEや実悪用とは扱いません。

**確認する対応：** JetEngine 3.9.0.1、Media Library Assistant 3.43、AI Engine 3.8.7以降を照合し、投稿者権限と利用プラグインを点検してください。残りの個別記録はNVD索引から製品別の修正を確認してください。

[JetEngine原報告](https://patchstack.com/database/wordpress/plugin/jet-engine/vulnerability/wordpress-jetengine-plugin-3-9-0-sql-injection-vulnerability?_s_id=cve) / [Media Library Assistant原報告](https://patchstack.com/database/wordpress/plugin/media-library-assistant/vulnerability/wordpress-media-library-assistant-plugin-3-42-sql-injection-vulnerability?_s_id=cve) / [AI Engine原報告](https://patchstack.com/database/wordpress/plugin/ai-engine/vulnerability/wordpress-ai-engine-plugin-3-8-6-broken-access-control-vulnerability?_s_id=cve)

### 14. NocoDB追加4件：認証処理とレート制限の役割

**固定窓の追加登録・公開 / 15:17 JST（NVD収録）。**

CVE-2026-116120〜116123は登録・再設定の資源消費、登録競合、sign-inの情報差、認証試行制限に関するCNA記録です。公式のPublicApiLimiterGuardはreverse proxy等で制限する設計と明記し、現在の登録処理にはwithSignupClaimもあります。登録番号の増加だけで全版未修正とは判断できません。

**確認する対応：** 外部公開した登録・再設定・ログインのレート制限をproxy側も含めて確認してください。異常な登録・セッション失効ログと利用版を照合し、最低出荷修正版は未確定として扱ってください。

[CVE-2026-116120](https://nvd.nist.gov/vuln/detail/CVE-2026-116120) / [CVE-2026-116121](https://nvd.nist.gov/vuln/detail/CVE-2026-116121) / [CVE-2026-116122](https://nvd.nist.gov/vuln/detail/CVE-2026-116122) / [CVE-2026-116123](https://nvd.nist.gov/vuln/detail/CVE-2026-116123) / [公式guardコード](https://raw.githubusercontent.com/nocodb/nocodb/develop/packages/nocodb/src/guards/public-api-limiter.guard.ts) / [公式登録処理](https://raw.githubusercontent.com/nocodb/nocodb/develop/packages/nocodb/src/services/users/users.service.ts)

### 15. libimobiledevice：接続相手のプロトコル応答

**固定窓の追加登録・公開 / 20:16 JST（NVD収録）。**

CVE-2026-116258〜116262は1.4.0までのAFC・Web Inspector等のメモリ処理に関するCNA登録です。device infoにはローカル条件の項目も含まれます。公式コードは確認しましたが、研究者サイトは動的表示で詳細を取得できず、接続・ペアリング等の全条件と最低修正版は未確定です。

**確認する対応：** 利用する端末管理ツールと同梱版、信頼して接続する装置を確認してください。全iPhoneが任意のWeb閲覧だけで侵害されると解釈せず、不審な端末・プロトコル応答の処理を隔離してください。

[CVE-2026-116258](https://nvd.nist.gov/vuln/detail/CVE-2026-116258) / [CVE-2026-116262](https://nvd.nist.gov/vuln/detail/CVE-2026-116262) / [公式AFCコード](https://raw.githubusercontent.com/libimobiledevice/libimobiledevice/master/src/afc.c) / [研究者サイト・本文制限](https://bohmid-com.vercel.app/)

### 16. libgsf：OLE2ファイル解析の境界確認

**固定窓の追加登録・公開 / 16:17 JST（NVD収録）。**

CVE-2026-116124は1.14.60までのOLE2 parserに関するCNA登録です。GNOME公式mirrorで9/26の境界書込み修正コミットを確認しました。元GitLabページはHTTP成功でもchallenge画面のため本文は読めていません。今回の新規修正ではなく、最低配布修正版は未確定です。

**確認する対応：** 文書解析・変換処理の同梱libgsfを棚卸しし、当該修正を含む配布物を確認してください。非信頼のOLE2文書を扱う処理環境と権限を制限してください。

[CVE-2026-116124](https://nvd.nist.gov/vuln/detail/CVE-2026-116124) / [GNOME公式mirrorの修正](https://github.com/GNOME/libgsf/commit/a8e25560b74f84c3f86df6ca0ac59195fa5af68a)

### 17. Qt：HTTP/2の悪意ある接続先による停止

**固定窓の追加登録・公開 / 21:17 JST（NVD収録）。**

CVE-2026-96432はQNetworkAccessManagerが悪意ある・侵害されたHTTP/2サーバーの応答列を処理して停止する問題です。公式表は6.8.0〜6.8.9、6.9.0〜6.11.2を対象としています。利用アプリからのコード実行や全Qt製品の侵害確認ではありません。

**確認する対応：** Qt 6.8.10 / 6.11.3等の該当系列を照合し、アプリや同梱ライブラリの更新を行ってください。接続先の制御と再起動監視も確認してください。

[Qt公式脆弱性一覧](https://wiki.qt.io/List_of_known_vulnerabilities_in_Qt_products) / [Qt修正](https://codereview.qt-project.org/c/qt/qtbase/+/759718)

### 18. BRAIN2：インストールログに残るサービス資格情報

**固定窓の追加登録・公開 / 19:16 JST（NVD収録）。**

CVE-2026-112250はBRAIN2 3.09以前で、SQL Server Integrated SecurityとWindowsサービスアカウント指定を組み合わせた場合に平文パスワードがsetup logへ残る問題です。ログは通常、導入した管理者の一時領域にあり、標準ユーザーへ無条件公開されるという説明ではありません。

**確認する対応：** 3.10以降へ更新し、該当setup logの安全な除去とアクセス権を確認してください。露出が疑われるサービスアカウントは資格情報を変更してください。

[Bizerba公式勧告PDF](https://www.bizerba.com/downloads/global/information-security/2026/bizerba-sa-2026-0004.pdf)

### 19. 画像アップロード：一時ファイルと削除権限

**固定窓の追加登録・公開 / 21:17 JST（NVD収録）。**

PictShare CVE-2026-116263は予測できる一時ファイル名による競合で、検査後の内容が差し替わる問題です。10/18の修正とv3.7.2タグを確認しましたがGitHub Release APIは404でした。EasyImage CVE-2026-116223は削除権限の問題で、10/24の関連hardeningコミットを確認しています。両製品の条件は同一ではありません。

**確認する対応：** PictShareは3.7.2相当のタグ・修正収録、EasyImageは該当修正と認証・保存先設定を照合してください。任意の番号を新たな最低修正版として推定しないでください。

[PictShare修正](https://github.com/HaschekSolutions/pictshare/commit/6306e33da630c04ddff60703922c2ec7b7539452) / [PictShare v3.7.2タグ](https://github.com/HaschekSolutions/pictshare/tree/v3.7.2) / [EasyImage関連修正](https://github.com/icret/EasyImages2.0/commit/b12cb67d447bcbb67e21c8f011d0f5638229760c)

### 20. agent-teams-ai：ローカルHTTPサービスの境界

**固定窓の追加登録・公開 / 16:17 JST（NVD収録）。**

CVE-2026-116228は2.17.10までのLocal HTTP Serviceの認証不足に関するCNA登録です。公式コードでは既定のlocalhost origin処理と、設定によって広がるCORS条件、指定hostでのlistenを確認しました。外部Webページから全設定で無条件侵害できるとまでは検証していません。

**確認する対応：** ローカルHTTPサービスのlisten先、CORS_ORIGIN、実行ユーザーとローカル利用者の権限を確認してください。最低修正版は未確定です。

[CVE-2026-116228](https://nvd.nist.gov/vuln/detail/CVE-2026-116228) / [公式HTTPコード](https://raw.githubusercontent.com/777genius/agent-teams-ai/main/src/main/services/infrastructure/HttpServer.ts)

### 21. ゲーム・デスクトップ補助ツール：外部入力の処理

**固定窓の追加登録・公開 / 17:17 JST（NVD収録）。**

FFXIV Teamcraft CVE-2026-116229はrendererのclipboard IPC、Plague Inc Evolved CVE-2026-116230はWorkshop scenarioのデシリアライズが対象です。Teamcraft 11.4.32の公開は10/13で、今夜の新規修正ではありません。ゲーム本体すべてや通常の閲覧だけへの一般化は避けてください。

**確認する対応：** Teamcraft 11.4.32、Plague Inc Evolved 1.24.0.4等の修正案内を利用環境と照合し、非信頼のscenario・renderer入力を制限してください。

[Teamcraft公式release](https://github.com/ffxiv-teamcraft/ffxiv-teamcraft/releases/tag/v11.4.32) / [Plague Inc公式更新](https://store.steampowered.com/news/app/246620/view/708909893000628135) / [CVE-2026-116230](https://nvd.nist.gov/vuln/detail/CVE-2026-116230)

### 22. プリザンター：LDAP認証の既報を再照合

**既公表資料の範囲補完 / 10/23開発元公表、10/26 NVD収録。**

CVE-2026-113438のNVD収録に合わせ、10/23の開発元説明を再確認しました。LDAP認証でLinux/DockerまたはWindows Novell providerと、ADまたは匿名bindを許すLDAPを組み合わせた条件が対象です。ローカル・SAML・パスキー等を含む全利用者の認証回避ではありません。

**確認する対応：** 対象構成では1.5.9.1以降へ更新してください。1.5.9.0には修正が含まれない点、LDAP+LocalではLDAP利用者が対象となる点を確認してください。

[開発元説明](https://pleasanter.org/news/vulnerability-update-20261023/)

### 23. V-SFT：既報7件のNVD収録

**既公表資料の範囲補完 / 13:00 JST（既報JVN）、16:17 JST（NVD収録）。**

CVE-2026-107894〜107900は前回までにJVN情報として掲載した7件です。今回NVDへ収録されましたが、新しい7事件や新たな7件の実悪用を意味しません。細工したV7形式ファイルを設計端末で開く条件が継続します。

**確認する対応：** 6.2.11.0以前の利用と外部設計ファイルの取扱いを確認し、6.2.12.0の改善情報・パッチを照合してください。

[JVN一次勧告](https://jvn.jp/vu/JVNVU96549652/) / [CVE-2026-107894](https://nvd.nist.gov/vuln/detail/CVE-2026-107894)

### 24. JPCERT/CC：PHP更新とBrotliの国内注意喚起

**固定窓の追加登録・公開 / 16:25 / 18:00 JST（公式フィード）。**

16:25 JSTのJPCERT/CCはPHPの実証・環境依存条件とupload progress緩和を追記し、Brotli注意喚起を公開しました。18:00のJVNもBrotliを掲載しています。新たなPHP/Brotliの別CVEではなく、国内向け説明の更新です。

**確認する対応：** PHPは修正版への更新・侵害調査を継続し、CVE-2026-115560へのsession.upload_progress.enabled=0と全worker再起動を確認してください。Brotliは1.0.10 / 1.1.1 / 1.2.1の分岐別修正と同梱製品の案内を照合してください。

[JPCERT PHP](https://www.jpcert.or.jp/at/2026/at260033.html) / [JPCERT Brotli](https://www.jpcert.or.jp/at/2026/at260034.html) / [JVN Brotli](https://jvn.jp/vu/JVNVU97400824/)

### 25. Oray X5 Pro：設定値からの改行・ファイル処理

**固定窓の追加登録・公開 / 17:17〜19:16 JST（NVD収録）。**

CVE-2026-116231〜116237はPugongying X5 Pro 7.6.1のSer2net、SNMP、Dnsmasq、IPsec、L2TP、PPPoE等の設定処理に関するCNA登録です。改行注入とuploadを一括して無認証の外部侵入へ一般化せず、管理操作への到達と権限条件の追加確認が必要です。

**確認する対応：** 機種・firmware、管理口の公開範囲、設定変更履歴を確認してください。最低修正版は未確定のため、ベンダー案内と不要な管理アクセスの制限を照合してください。

[CNA/NVD](https://nvd.nist.gov/vuln/detail/CVE-2026-116231) / [CNA/NVD](https://nvd.nist.gov/vuln/detail/CVE-2026-116236)

### 26. Logsign SIEM / Liman MYS：製品別の管理経路

**固定窓の追加登録・公開 / 21:17 JST（NVD収録）。**

CNAはLogsign SIEM 6.4.120以上6.4.122未満のpath traversalと、Liman MYS 2.3.4-1124以上2.3.5-1131未満のパスワード回復を別件として記録しています。国の原通知ページは動的画面で本文を取得できず、成立条件と実悪用は今回独立確認できていません。

**確認する対応：** Logsign 6.4.122、Liman 2.3.5-1131等の配布元案内を利用系列と照合し、管理経路の公開・回復手順・関連ログを確認してください。

[Logsign CNA/NVD](https://nvd.nist.gov/vuln/detail/CVE-2026-105947) / [Liman CNA/NVD](https://nvd.nist.gov/vuln/detail/CVE-2026-94380) / [トルコ当局・本文取得制限](https://siberguvenlik.gov.tr/guvenlik-bildirimleri/detay/tr-26-1397)

## 全件索引と扱いを保留した項目

NVD新規99件のうち、61 CVEを上記の論点で説明し、残る37件の有効な記録も[全件索引](../data/2026-10-26-2135/nvd-index.json)へ保存しました。未掲載は安全を意味しません。残りにはWordPressの27件と、benotes、Edimax、OPNsense、DedeCMS、FluxCP、Codefever、RhaPHP、BillaBear等の10件があります。SQL injection、XSS、SSRF、決済通知元の確認、インストーラ公開範囲等はそれぞれ異なる条件なので、利用製品のCNA・開発元情報へ戻ってください。

OPNsenseの公式GHSAは8/12公開で、26.7.1_1の設定画面・ログ画面に関するXSSを説明しています。今回のNVD収録を新しい未認証ファイアウォールRCEと読み替えず、管理者の閲覧・低権限操作の条件と配布元の修正案内を確認してください。[公式GHSA](https://github.com/opnsense/core/security/advisories/GHSA-9h93-hhcx-957c)

今回modified集合の取得時状態は、Analyzed 466件、Modified 97件、Deferred 587件、Awaiting Analysis 104件、Undergoing Analysis 3件、Received 176件、Rejected 1件です。これは**現在のDB状態の内訳**であり、全件がこの窓でその状態へ変わったと判定した数ではありません。前回14:56索引に含まれたCVEとのID重複はありませんが、前回の索引自体も限定窓であり、その他の既存CVEを初発と扱う根拠にはなりません。

PHPのCVE-2026-109618 / 109619は19:10 JST改訂の現行NVDでAnalyzedとなり、CNAのCVSS v4.0は両方9.2、NVDのCVSS v3.1はそれぞれ9.8 / 8.1を記録しています。評価方式の異なる数値を置き換えたり、評点追加を新しいCVE・実悪用の証拠としたりしないでください。[109618](https://nvd.nist.gov/vuln/detail/CVE-2026-109618) / [109619](https://nvd.nist.gov/vuln/detail/CVE-2026-109619)

## フィードから一次資料へ戻った結果

JPCERT/CCの16:25 JSTのPHP更新・Brotli公開、JVN18:00 JSTのBrotliを確認しました。成功した17フィードのうち10件は、前回保存原本とバイト単位で同一です。原本の変化だけで事件が増えたとは判定していません。

二次フィードには、PHPの研究者honeypot報告、GitHub tokenのGheist、Microsoft 365 token replay、Android uCreatorの紹介が追加されました。これらの個別事実・原報告の公表日・実験と実被害の境界は、別の[ベンダー・事件一次調査](research-2026-10-26-2135.md)で照合します。既報AGENTS.md研究の再紹介や新しいディストリビューションのリリースを、新しい侵害数には加えていません。

## 原本、失敗、再取得

**106応答記録のSHA-256を検証し、うち27件は同一の過去原本への相対参照です。** 実取得UTCは`2026-10-26T12:37:35+00:00`〜`2026-10-26T12:45:48+00:00`。gzip保存物は展開後バイト列のhashを記録しています。

- [collection-summary.json](../data/2026-10-26-2135/collection-summary.json)：照会URL、実取得UTC、原本の相対パス、SHA-256、失敗・本文制限。
- [nvd-index.json](../data/2026-10-26-2135/nvd-index.json)：99 published / 1,434 modifiedと公開GHSAの要約。
- [ghsa-modified-index.json](../data/2026-10-26-2135/ghsa-modified-index.json)：公開または改訂151件の原記録を索引化。
- [feed-index.json](../data/2026-10-26-2135/feed-index.json)：配信項目、公開UTC、固定窓内判定。RSS日時と本文の改訂日時は別です。
- [incident-register.json](../data/2026-10-26-2135/incident-register.json)：本書で説明する技術・注意喚起26群に、重複を除いたベンダー・国内外続報11群を統合した37群。追加37 ID、Rejected1 ID、留保、原資料URLも含みます。HTTP原本の検証は技術側106応答とベンダー側63応答の計169応答で、別に描画テキスト補足1件を保存しています。
- [supplemental-sources.json](../data/2026-10-26-2135/supplemental-sources.json)：追加照合した一次資料URL一覧。

再取得は`python3 tools/intel/snapshot-2135.py`です。深刻度フィルターなしで全ページを取得し、GHSAはLinkヘッダーの次ページURLを追います。後日同じ固定窓を再照会しても、本文やDBの改訂により応答が変わるため、過去状態の完全再現は保証できません。取得・保存は行いましたが、パッケージを導入したりPoCを実行したりしていません。

IPA旧URL404、PictShare Release API404、NocoDB authファイルの推定2 URLの404、Zcode原報告の302ループを記録しました。PictShareは別途v3.7.2のtag存在を確認し、GNOME GitLabはHTTP成功でもchallenge画面だったため公式GitHub mirrorの同コミットで補いました。libimobiledeviceの研究者サイトとトルコ当局2通知は動的画面で、原文の詳細を独立確認できていません。ネットワークの成功応答を、そのまま本文の検証成功と扱っていません。

KEV非掲載、フィード未配信、今回の更新なしは、被害や悪用がないことの証明ではありません。また、全世界の全インシデントを完全に列挙した資料ではありません。
