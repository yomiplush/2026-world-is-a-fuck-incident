# 2026-10-27 07:47 JST — 固定窓収集と対策の一次資料照合

対象窓は2026-10-26 15:18:00〜22:47:00 UTC（00:18〜07:47 JST）。実取得は07:50 JST以降の現行改訂です。公開・DB収録・改訂・侵入・修正出荷・復旧を分離します。

## 収集結果

| 集合 | 件数 | 留保 |
|---|---:|---|
|NVD published|532|改訂にも全件重複、Rejected 20、Apple CNA 324|
|NVD modified|4,815|新規532を含む|
|GHSA published|540|unreviewed515、malware25、reviewed0|
|GHSA modified|748|unreviewed687、reviewed31、malware30。公開540を全件含む|
|KEV|1,756|2026.10.23版、前回展開バイト列と一致|

APIページは全ページ取得完了。GHSA公開のCVE 437件は今回NVD、78件は前回NVDと重複します。件数は事件数ではありません。

## GMO：00:20の日付訂正を確認、12:00は攻撃者予告

00:20 JST（公式訂正） / delta / confirmed-publication

第7報は端末調査の依頼日を10/23から10/25へ00:20 JSTに訂正。第7報の本文基準は前日23:10で、端末は解析中。10/27 12:00の情報公開・ランサムウェア攻撃は攻撃者とみられる者からの予告であり、実行済みの確定被害ではない。

**対応：** 第6報の端末検査・バックアップ・アカウント保護を続ける。公式の個別連絡を確認し、認証コードや金銭を求める連絡へ応じない。

[GMO第7報](https://group.gmo/info/alert/2026102602/) / [GMO第6報](https://group.gmo/info/alert/20261026/)

## Railway：復旧チャンネル開設、既存利用者と新規登録を分ける

04:12 / 05:46 JST（status 19:12 / 20:46 UTC） / delta / confirmed-publication

公式statusは19:12 / 20:46 UTCに復旧継続の通知を掲載し、追加のセキュリティ事件ではないと明記。一次報告の20:41 UTC改訂では既存利用者向けサービスの復旧と、新規登録停止を区別。既存原本との本文差分はContinuous Updatesの追記であり、以前の約10万workspaceという影響推計を今回の新規流出として数え直さない。

**対応：** 10/21より前に保存した機密環境変数・APIキー等の失効と再発行、GitHubやレジストリの監査を続ける。復旧は旧鍵の安全性を保証しない。新規登録の今週再開は予定。

[Railway公式status](https://status.railway.com/) / [Railway一次報告・継続更新](https://blog.railway.com/p/preliminary-report-october-security-incident)

## OpenHands SDK：公開sandbox agentの未認証コマンド実行

01:17 JST（NVD published） / delta / CNA-unreviewed

CVE-2026-112346のCNA記録はSDK 1.52.0未満で、空のsession_api_keysによる無認証のsandbox command実行を説明。公開portへ到達できる場合、sandbox内rootとmountされたworkspace・secretが対象。確認したPR #5209はDockerWorkspaceのhost側port公開を127.0.0.1へ制限し、container内の0.0.0.0待受は維持する。CNAが併記するApptainerへの同じ修正の適用は、このPRからは確認できない。

**対応：** software-agent-sdk 1.52.0以降の修正を照合し、workspaceを再作成してhost側port公開とsession key設定を確認する。agent-server imageのtagだけでSDK launcher修正の適用を判定しない。到達可能だったworkspaceのsecretはログ調査と失効・再発行を別作業で実施する。

[SDK 1.52.0 release](https://github.com/OpenHands/software-agent-sdk/releases/tag/v1.52.0) / [DockerWorkspace修正PR 5209](https://github.com/OpenHands/software-agent-sdk/pull/5209) / [CNA由来NVD記録](https://nvd.nist.gov/vuln/detail/CVE-2026-112346)

## Cloud Run MCP：ビルド用bucketのsquatting

01:17 JST（NVD published） / delta / CNA-unreviewed

CVE-2026-85297は1.11.0未満のGoogle Cloud Run MCP。bucket squattingによるソースコード取得・コード実行・持ち出しをGoogle CNAは説明。前回収録のMCP Toolbox cloud-storage問題とは別。

**対応：** Cloud Run MCPを1.11.0以降へ更新する。ToolboxとCloud Run MCPを同じ製品として一括判定せず、使ったビルド経路と機密情報の露出を確認する。

[開発元・CNA参照 1](https://github.com/GoogleCloudPlatform/cloud-run-mcp/releases/tag/v1.11.0)

## Consul：cached leaf証明書と秘密鍵の認可回避

03:17 JST（NVD published） / delta / CNA-unreviewed

CVE-2026-105765はACL有効構成のConsul 1.17.0〜2.0.4。agent HTTP APIのcached service leaf応答がACL token検査を欠き、到達可能な攻撃者が既にcacheされた証明書と秘密鍵を得られる条件。APIは既定でloopbackのみで、同一hostのprocessへ露出が限定される。全サービスの鍵が無条件に取れるという意味ではない。

**対応：** Consul Community 2.1.0、Enterprise 2.1.0 / 1.21.19を系列別に照合。agent APIの到達制限と、露出した可能性のあるservice identity・証明書を調査する。leaf endpointのblockはConnect-nativeアプリやconsul-templateが依存しない場合のみ検討する。

[開発元・CNA参照 1](https://discuss.hashicorp.com/t/hcsec-2026-46-consul-vulnerable-to-an-authorization-bypass-in-the-agents-service-mesh-leaf-certificate-api/77911)

## Consul：HTTP API DoS、mesh登録とhealth checkの認可

03:17 JST（NVD published） / delta / CNA-unreviewed

CVE-2026-105626は未認証HTTP APIのメモリ枯渇。105608はservice write権限からmesh writeなしのEnvoy escape-hatch設定。115804は認証済み利用者が同一nodeの他service health checkを変更する認可回避。leaf秘密鍵の問題とは成立条件が別。

**対応：** Community 2.1.0、Enterprise 2.1.0 / 1.21.19へ公式の系列別手順で更新。HTTP API公開とservice write権限、check登録を個別に点検する。

[開発元・CNA参照 1](https://discuss.hashicorp.com/t/hcsec-2026-48-consul-vulnerable-to-a-denial-of-service-in-http-apis/77913) / [開発元・CNA参照 2](https://discuss.hashicorp.com/t/hcsec-2026-47-consul-vulnerable-to-an-authorization-bypass-in-service-mesh-registration/77912) / [開発元・CNA参照 3](https://discuss.hashicorp.com/t/hcsec-2026-49-consul-vulnerable-to-an-authorization-bypass-in-health-check-registration/77914)

## consul-k8s：別namespaceのServiceAccountからcomponent権限

04:16 JST（NVD published） / delta / CNA-unreviewed

CVE-2026-110720はglobal.acls.manageSystemACLs=trueの構成。別namespaceでServiceAccountを作成しtokenを取得でき、Consul APIにも到達できる利用者が、component向けACL binding ruleを通じて昇格できる条件。

**対応：** consul-k8s 2.1.0 / 1.8.18を系列別に照合。Kubernetes RBAC、APIへの到達、system ACL管理の有効化を確認する。

[開発元・CNA参照 1](https://discuss.hashicorp.com/t/hcsec-2026-50-consul-k8s-vulnerable-to-a-cross-namespace-authorization-bypass-in-component-acl-binding-rules/77915)

## vLLM：template・共有memory・OCR・CORS・Responsesの複数条件

02:17 JST（NVD published） / delta / CNA-unreviewed

CVE-2026-115911〜115918は0.32.0で修正とCNAが記載。request chat templateによる資源枯渇、共有memory識別子、音声encoder、OCR/画像処理、token ID境界、CORS、Responses経路を含む。認証済みcaller・特定modelや設定が必要なものを未認証の一括RCEへまとめない。

**対応：** vLLM 0.32.0を照合し、公開APIの認証、任意template、model供給元、画像・音声入力、CORSの設定を確認する。

[開発元・CNA参照 1](https://github.com/vllm-project/vllm/releases/tag/v0.32.0) / [開発元・CNA参照 2](https://github.com/vllm-project/vllm/security/advisories/GHSA-542m-9234-8gvf) / [開発元・CNA参照 3](https://github.com/vllm-project/vllm/security/advisories/GHSA-6757-hggm-hp2w) / [開発元・CNA参照 4](https://github.com/vllm-project/vllm/security/advisories/GHSA-8397-8qf6-f2gm) / [開発元・CNA参照 5](https://github.com/vllm-project/vllm/security/advisories/GHSA-gq5q-89c7-vhvx)

## ONNX：信用できないmodelのshape inferenceと低bit配列

03:17 JST（NVD published） / delta / CNA-unreviewed

CVE-2026-115919〜115922は1.22.0未満。RNN/LSTM/GRUのrank検証、ConvTranspose、Scan shape inference、2/4bit unpack配列のサイズ等に関する不正model入力の問題。checker通過だけでshape inferenceの安全性が保証されるとはしない。

**対応：** ONNX 1.22.0以降を照合。外部modelの検証処理を制限付き環境へ置き、時間・memory上限を設定する。

[開発元・CNA参照 1](https://github.com/onnx/onnx/releases/tag/v1.22.0) / [開発元・CNA参照 2](https://github.com/onnx/onnx/security/advisories/GHSA-48m4-24cq-37qf) / [開発元・CNA参照 3](https://github.com/onnx/onnx/security/advisories/GHSA-6pwm-x34p-fvj2) / [開発元・CNA参照 4](https://github.com/onnx/onnx/security/advisories/GHSA-m4pr-6v3c-6fgr) / [開発元・CNA参照 5](https://github.com/onnx/onnx/security/advisories/GHSA-q69g-f4f5-v8m7)

## Netty tcnative：native TLSのbuffer・ticket・SNI

01:17 JST（NVD published） / delta / CNA-unreviewed

CVE-2026-116539〜116542はnative TLSのBIO buffer・bytes consumed報告・SNI・session ticket rotation等、成立条件が異なる。116540の公式GHSAはOpenSSL 3.0以降とのbuild、hot rotationと同時handshake、影響版2.0.81.Final以降・修正2.0.84.Finalを記載。CNA記録の下限2.0.66.Finalとの差があるため、最低影響版を本調査で確定しない。Java本体更新のみでnative library置換済みとはしない。

**対応：** netty-tcnative 2.0.84.Finalの修正と実際にloadしたnative artifactを確認。OpenSSL系列、ticket rotation、SNI routingの利用条件を分けて照合する。

[Netty公式UAF勧告](https://github.com/netty/netty-tcnative/security/advisories/GHSA-mmc8-vg2v-fvvw) / [開発元・CNA参照 1](https://github.com/netty/netty-tcnative/releases/tag/netty-tcnative-parent-2.0.84.Final) / [開発元・CNA参照 2](https://github.com/netty/netty-tcnative/security/advisories/GHSA-gf9q-9mg7-g5qh) / [開発元・CNA参照 3](https://github.com/netty/netty-tcnative/security/advisories/GHSA-mmc8-vg2v-fvvw) / [開発元・CNA参照 4](https://github.com/netty/netty-tcnative/security/advisories/GHSA-9xr3-jwv4-r489) / [開発元・CNA参照 5](https://github.com/netty/netty-tcnative/security/advisories/GHSA-2784-hxmm-4hgf)

## Go JOSE：4.1.5と4.1.6の修正境界を分ける

07:16 JST（NVD published） / delta / CNA-unreviewed

CVE-2026-116585は空のCBC-HMAC JWE ciphertext、116586は深いJSONによるpanic/stack overflowで4.1.5修正。116587は不正RSA JWKの検証負荷で4.1.6修正、Go 1.24以降の条件がある。4.1.5だけですべて解消とはしない。

**対応：** go-jose 4.1.6以降と組込みバイナリの再buildを確認。信用できないJWE / JSON / JWKをparseする入口に入力制限を設ける。

[Go JOSE v4.1.5 release](https://github.com/go-jose/go-jose/releases/tag/v4.1.5) / [Go JOSE v4.1.6 release](https://github.com/go-jose/go-jose/releases/tag/v4.1.6) / [CNA由来NVD記録](https://nvd.nist.gov/vuln/detail/CVE-2026-116587)

## Autobahn / Rust zip / snappy-java / Go compress：decoderの別問題

02:17 JST（NVD published） / delta / CNA-unreviewed

Autobahn CVE-2026-116579はopt-in permessage-brotliの出力上限を展開後に確認するDoSで26.10.1修正。Rust zip 115905はcentral/local header名の不一致で9.0.5修正、同時収録の115906〜115909は別境界。snappy-java 116590は1.1.10.9、Go compress 116591のzstd panicは1.20.2修正。Brotli2Shell CVE-2026-111497とは別。

**対応：** 実際に利用したdecoderと信頼できない入力経路を棚卸しし、それぞれの修正を適用。圧縮形式が同じというだけで別CVEの修正まで完了と判定しない。

[開発元・CNA参照 1](https://github.com/crossbario/autobahn-python/releases/tag/v26_10_1) / [開発元・CNA参照 2](https://github.com/crossbario/autobahn-python/security/advisories/GHSA-pjh6-c8mg-3x7m) / [開発元・CNA参照 3](https://github.com/zip-rs/zip2/releases/tag/v9.0.5) / [開発元・CNA参照 4](https://github.com/zip-rs/zip2/security/advisories/GHSA-m665-v7pm-7grj) / [開発元・CNA参照 5](https://github.com/zip-rs/zip2/releases/tag/v9.0.0)

## Backstage：catalog URL規則のcanonicalization不一致

03:17 JST（NVD published） / delta / CNA-unreviewed

CVE-2026-115923の3.9.2 / 4.0.2という境界は@backstage/plugin-catalog-backend packageの版。catalog.location.create権限の利用者がraw URL規則とURL readerの正規化差を使い、範囲外のentityをtrustedとして扱わせる条件。Backstage本体release v1.54.10にもcanonical URL照合の修正を確認し、本体版とpackage版を混同しない。

**対応：** @backstage/plugin-catalog-backend 3.9.2 / 4.0.2以降を系列別に確認。Backstage本体や独自portalの表示版だけで判定せず、実際の依存package、登録権限、catalog.rules、取得先URLを点検する。

[開発元・CNA参照 1](https://github.com/backstage/backstage/releases/tag/v1.54.10) / [開発元・CNA参照 2](https://github.com/backstage/backstage/releases/tag/v1.56.1) / [開発元・CNA参照 3](https://github.com/backstage/backstage/security/advisories/GHSA-w658-mh9p-ww8f)

## Kener / Transmission：管理入口とブラウザ経由RPC

07:16 JST（NVD published） / delta / CNA-unreviewed

Kener CVE-2026-116747は3.0.0〜4.1.10未満、KENER_SECRET_KEY空/未設定時のDUMMY_SECRET fallbackで管理者emailを知る攻撃者がtokenを偽造。Transmission 116748は4.0.0〜4.1.3未満のCORSがRPC anti-CSRF tokenを他originへ公開する条件。

**対応：** Kener 4.1.10へ更新し固有のsecretを設定、旧sessionを失効。Transmission 4.1.3の修正とRPCの認証・到達制限を照合。両製品を導入している場合に限って優先する。

[開発元・CNA参照 1](https://github.com/rajnandan1/kener/releases/tag/v4.1.10) / [開発元・CNA参照 2](https://github.com/transmission/transmission/releases/tag/4.1.3)

## Apache Vysper：全版に影響、修正版を待たない

01:17 JST（NVD published） / delta / CNA-unreviewed

CVE-2026-115721はXML解析の無制限allocation、115748はXEP-0077の認証検査欠落。プロジェクトはretiredで全版が対象、Apacheは修正版リリース予定なしと説明。後者は認証済み利用者による他accountの侵害条件。

**対応：** Vysperを使っている場合は代替へ移行する。未発表の修正版番号を設定せず、移行まで到達制限・登録機能制限を検討する。

[開発元・CNA参照 1](https://nvd.nist.gov/vuln/detail/CVE-2026-115721) / [開発元・CNA参照 2](https://nvd.nist.gov/vuln/detail/CVE-2026-115748)

## npm：malware新規25件と既存改訂を分離

01:17〜05:42 JST（GHSA published） / delta / confirmed-publication

新規25件にはnpmの@greenlake/*、@ppa-web-components/*、@drone-js-ext/*、ctf-agent 0.1.0等を含む。公開は16:17〜20:42 UTC。GHSA一覧登録は導入企業の侵害確定ではなく、package名やscope一致だけで他版へ一般化しない。

**対応：** lockfile、SBOM、install logで各GHSAのpackageとversionを照合する。実行済みなら隔離と、その実行環境に置かれたsecretの失効・再発行を別の安全な端末から行う。単にuninstallして完了としない。

[ctf-agent GHSA](https://github.com/advisories/GHSA-2j3v-rjgw-5wgg) / [@greenlake/auth GHSA](https://github.com/advisories/GHSA-h6v3-2957-9j3g) / [GHSA公開窓API](https://api.github.com/advisories?type=malware&published=2026-10-26T15:18:00Z..2026-10-26T22:47:00Z)

## GHSA reviewed改訂31件：AirflowやCA bundleは既存公開

00:48〜06:21 JST（GHSA updated） / delta / confirmed-publication

公開窓のreviewedは0件、改訂窓は31件。Airflow JWT logout / Hive / Edge3 / Google / Sqoop / Mongo provider、NASA AIT-Core、AgentScope、Aim、AutoGPT、certifi emSign CA、ImageSharp等の既存勧告を含む。2022〜2025年公開のものもあり、31件を今朝の新規ゼロデイへ換算しない。

**対応：** 導入済みpackageと各GHSAの現行range・修正を確認する。certifiのCA不信任と、他のTailwormやBrotli修正を混同しない。

[Airflow JWT GHSA](https://github.com/advisories/GHSA-c92r-g8j5-vhcx) / [certifi GHSA](https://github.com/advisories/GHSA-6q48-6c7w-9gw2)

## Apple：OS/Safariの10月26日security releaseを照合

10/26 release（公式日付）、NVD収録は固定窓内 / scope-complement / prior-scope

Apple一次資料はiOS/iPadOS 27.2と26.7.2、macOS Golden Gate 27.2の10/26 releaseを確認できる。この窓のNVD新規532件中324件はApple CNA記録で、過去releaseの修正にも言及する。324件すべてがこの窓の新規出荷や悪用確認という意味ではない。

**対応：** 端末ごとの対応系列をSoftware Updateと公式security releases一覧で照合し、OSとSafariを更新。旧系列の端末に27系を一律要求せず、対応機種を確認する。

[開発元・CNA参照 1](https://support.apple.com/en-us/149227) / [開発元・CNA参照 2](https://support.apple.com/en-us/149230) / [開発元・CNA参照 3](https://support.apple.com/en-us/149521) / [開発元・CNA参照 4](https://support.apple.com/en-us/149526) / [開発元・CNA参照 5](https://support.apple.com/en-us/149527)

## ConnectWise：準備継続、個別案内まで接続無効を維持

前日23:00 JST更新（今回取得で本文継続） / scope-complement / prior-scope

取得本文の最終更新は10/26 14:00 UTCのまま。phase onboardingの準備と復元開始可能時の通知を説明。10/26目標を達成報告として書き換えず、前回と同じ一次本文を参照。

**対応：** 対象接続は個別手順まで無効を維持し、M365のapp同意・転送規則・sign-in・deviceを別に調査する。

[ConnectWise Trust Center](https://www.connectwise.com/company/trust/advisories)

## PHP / PAN-OS / IceWarp：系列別hotfixと配置確認を継続

既存勧告の継続確認 / scope-complement / prior-scope

PAN JSON timeline最終は10/26 05:45 UTCで、11.1系4 hotfixのreleased情報は前回どおり。IceWarp公式API本文も前回と同一で15:30 UTC改訂。古いIceWarpの設定変更は部分緩和であり完全対処ではない。

**対応：** 公開管理面を制限し、PHP修正・各製品hotfix・全worker再起動・実際の同梱コピーを確認する。PANのETAを出荷済みへ変えず、IceWarpのmemory_limit=-1等を他環境へ無条件に転用しない。

[PAN CVE-2026-109618](https://security.paloaltonetworks.com/CVE-2026-109618) / [IceWarp PHP公式案内](https://support.icewarp.com/hc/en-us/articles/52154202993041-Patch-and-mitigation-of-PHP-Vulnerabilities-CVE-2026-109618-CVE-2026-109619-and-CVE-2026-115560)

## Tailscale / eMudhra：最新安定1.104.2、Tailworm修正版は未確定

最新安定10/21（今回取得で照合） / scope-complement / prior-scope

公式releasesの最新安定は10/21の1.104.2。eMudhra中間CA対応の版をTailwormの最低修正版と読み替えない。ソースmergeや環境変数だけで配布済み修正と断定しない。

**対応：** eMudhra対応とSSH forwarding / Serve / Funnel等の到達条件を分け、公式bulletinとreleaseを追跡する。代替管理経路を確保したうえで不要転送を停止する。

[Tailscale公式bulletin](https://tailscale.com/security-bulletins) / [Tailscale releases](https://github.com/tailscale/tailscale/releases)

## Genesys：内部LMS/CRMと顧客platformを区別

10/16把握の既存事案・範囲補完 / scope-complement / prior-scope

当事者は10/16把握の内部business system事案を説明。LMS/CRMのbusiness連絡先・account情報等へのアクセス/取得を確認する一方、Cloud / Engage / Engage Cloudや顧客platform内のcall recording等への侵害は否定。調査は継続。今回窓の新規侵入として数えない。

**対応：** Genesysを名乗りbusiness情報を引用する不審連絡に注意し、公式窓口で確認。内部CRMの漏えいを顧客contact center全体の侵害へ一般化しない。

[Genesys当事者公表](https://www.genesys.com/blog/post/security-update-incident-affecting-certain-genesys-internal-business-systems)

## 参考：Frontline Educationの8月事案通知

10/26付・公開時刻は未確定 / reference-only / timestamp-unconfirmed

10/26付の当事者公表はFrontline Central / School Health Managementの8/14〜15の不正活動について、個人通知開始を説明。個人によりSSN、出生年月日、政府ID、Medicaid / Student ID等が異なる。新しい10/26侵入ではなく、公開時刻が日付のみのため固定窓内の確定差分から分離。

**対応：** 対象学区と個別通知で自分の影響情報・対象の信用監視案内を確認する。全児童へ同じ情報が漏えいしたと一般化しない。

[Frontline Education通知](https://www.frontlineeducation.com/news/frontline-education-notice-of-data-breach/)

## 限界と原本

- 基準は2026-10-27 07:47 JST。取得は07:50 JST以降の現行改訂で、原公開時の本文を完全には復元しません。
- NVD新規532件は改訂4,815件に全件重複。20件のRejectedを含み、324件はApple CNAです。
- GHSA公開540件はunreviewed515 / malware25 / reviewed0。437件は今回NVD、78件は前回NVDのCVEと重複します。
- GHSA改訂748件は公開540件を全件含む。内訳はunreviewed687 / reviewed31 / malware30。全集合を足して事件数にしません。
- NVD Received / Awaiting Analysis / Deferred、GHSA unreviewedは、悪用・被害の確定を意味しません。
- APIによる収録・改訂時刻は、製品修正の初出荷時刻や攻撃開始時刻とは別です。
- KEV原本一致・非掲載、フィード未配信は悪用不存在の証明ではありません。
- API参照の一部は404/403、研究ページ1件はredirect loop。収集summaryへ失敗を保存し、空件数へ読み替えません。
- Railway復旧通知は追加インシデントではない。新規登録再開予定と既存利用者復旧を分けます。
- Appleの旧系列と新系列のCVEを合算して今朝の新規出荷数としません。
- 全世界の事件・被害を網羅した一覧ではありません。公表のない事案や未確認の攻撃者主張は件数に含めません。

原本・SHA-256・取得時刻は[data/2026-10-27-0747/collection-summary.json](../data/2026-10-27-0747/collection-summary.json)と[vendor collection](../data/2026-10-27-0747-vendors/collection-summary.json)。再実行はtools/intel/snapshot-0747.pyとvendors/collect.py。同一原本は過去snapshotを参照します。

## 追加監査（取得原本の照合）

Consul leafはACL有効・API到達可能・cached証明書の条件、既定loopback、修正CE 2.1.0 / Enterprise 2.1.0・1.21.19を公式本文で確認。OpenHands PR #5209のpatchはhost側Docker port公開を127.0.0.1へ変更し、container待受を維持します。sandbox内rootをhost rootへ一般化しません。確認PRはDockerWorkspaceが対象で、Apptainerへの同一修正は未確定です。Backstageは本体v1.54.10とplugin-catalog-backend 3.9.2 / 4.0.2を分離しました。Apple 27.2 / 26.7.2 / Golden Gate 27.2は公式本文と一致。Netty UAFの最低影響版にはCNAと開発元GHSAの差があり断定を避けます。Go JOSEのCNA参照GHSAにはrelease記載IDと文字列差があるため、修正境界を確認できるreleaseとNVDへ参照を揃えました。
