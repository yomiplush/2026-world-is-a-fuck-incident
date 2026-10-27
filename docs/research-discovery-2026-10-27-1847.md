# 2026-10-27 18:47 JST — broad primary discovery

対象窓は2026-10-26 22:47 UTCから2026-10-27 09:47 UTC（07:47〜18:47 JST）。取得はcutoff後の現行本文で、原公開時本文の復元ではない。日時は公開・改訂・修正出荷・悪用発生を区別した。原本は[data/2026-10-27-1847-discovery/collection-summary.json](../data/2026-10-27-1847-discovery/collection-summary.json)。一部responseはContent-Encoding:gzipのbyte列で保存し、SHA-256は保存byteのhash。*.txtは便宜的な解析用抽出。検索は探索にのみ使用し、以下は一次本文で照合した。

## GROWI — 新規開発元勧告とJVN

**confirmed-publication / delta**。JVN一覧は10/27 15:00 JST。開発元GHSA APIの公開時刻は14:18:29、14:18:34、14:18:39 JST（05:18:29/34/39 UTC）。3件を独立した被害事案と数えない。

- CVE-2026-105272: v3.2.10〜8.0.6。ログイン済み利用者が、閲覧できるpage IDと閲覧不可pageのrevision IDを組み合わせ、本文やcommentへアクセス。対象revision IDを知る等の条件がある。
- CVE-2026-109848: v4.5.5〜8.0.6。非read-onlyのログイン済み利用者による他page revision本文の取得・自身のpageへの保存、関連page更新経路。別pageのrevision IDを知る条件を落とさない。
- CVE-2026-115624: v7.0.0〜8.0.6。同時編集接続が閲覧のみを検査。公開閲覧pageなら未認証guestもdraftを変更できる。guest自身が直接revisionを保存できるという意味ではなく、正規editorの後続保存で混入する可能性。read-only/停止中等でもview権限があれば影響。

**対策：GROWI v8.0.7以降へ更新。** guest accessをDenyにする暫定策は未認証guestのみを遮断し、ログイン済みread-only等への完全対策ではない。公開閲覧pageのdraftを保存前に点検。登録停止だけではguest問題を緩和しない。

一次: [JVN#51223238](https://jvn.jp/jp/JVN51223238/index.html)、[read GHSA](https://github.com/growilabs/growi/security/advisories/GHSA-m72c-xgjf-56ww)、[write GHSA](https://github.com/growilabs/growi/security/advisories/GHSA-pqx5-gx68-83h4)、[draft GHSA](https://github.com/growilabs/growi/security/advisories/GHSA-3v2v-8q3r-mhm4)。GHSAのCVE欄はNo known CVEだがJVNはCVEを対応付けているため、CVE付与状況の違いを隠さない。

## Sleipnir Android — JVN新規、修正出荷は10/15

**confirmed-publication / delta-localization**。JVN一覧10/27 12:00 JST。CVE-2026-109434はSleipnir Mobile for Android 3.9.0未満のUI spoofing。細工page閲覧時に偽address bar等でphishingの可能性。開発元release告知は10/15で、今日の新規修正出荷ではない。

**対策：3.9.0以降へ更新。** 開発元によればfullscreen移行時にdomainと終了方法を表示する修正。Android版の範囲をWindows/iOS版へ一般化しない。

一次: [JVN#90463048](https://jvn.jp/jp/JVN90463048/index.html)、[開発元3.9.0告知](https://www.fenrir-inc.com/jp/news/2026/10/15/sleipnir-mobile-for-android-3-9-0/)。

## Fireblocks mpc-lib — JVN新規、CERT本文は07:45 JST

**confirmed-publication / delta-localization; original prior-window**。JVN一覧10/27 10:30 JST。CERT/CC VU#701544の最終改訂は10/26 22:45 UTC＝10/27 07:45 JSTで、対象窓開始の2分前。CVE-2026-90975はBIP32 hardened derivationでparent secretがない場合にzeroを使用するfail-open。単一MPC partyのdescendant signer shareとchain codeを得た攻撃者が、そのpartyのancestor/root shareを得る可能性。MPCのthreshold層は残り、単独でspendable private keyを得るとは説明していない。

CERT本文ではvendor fixは未提供、vendor statementも未受領。**対策はchain codeの秘匿（watch-only extended public key等から配布しない）、hardened derivationをshare間の隔離として信用せず、leaf share侵害をそのpartyのhierarchy全体へ及ぶ可能性として調査する。** 架空の修正版番号を設定しない。ここでの対策はCERTが示す暫定緩和であり、完全修正にはlibrary変更が必要。

一次: [JVNVU#90547696](https://jvn.jp/vu/JVNVU90547696/index.html)、[CERT VU#701544](https://kb.cert.org/vuls/id/701544)。

## COVESA vsomeip — JVN新規、修正は7月

**confirmed-publication / delta-localization; fix prior-scope**。JVN一覧10/27 10:30 JST。CERT VU#128947は10/26公開。CVE-2026-91141はvsomeip 3.7.3以下のreliable TCP endpointが受信確認前に宣言size分のbufferを確保するDoS。既定で約4 GB/接続までの宣言が可能。明示的reliable size制限のある構成は影響なし。接続先serverが悪性の場合client側も対象。

**対策：3.7.4以降へ更新。** CERTによると3.7.4出荷は2026-07-06で既定上限10 MiBを追加。更新できない場合はサービスに適したmax-payload-size-reliable等の制限、信頼peerのみへnetwork到達を限定する。今回のJVN公開を新規修正出荷・新規攻撃観測へ読み替えない。

一次: [JVNVU#90363302](https://jvn.jp/vu/JVNVU90363302/index.html)、[CERT VU#128947](https://kb.cert.org/vuls/id/128947)。

## Siemens / Mendix — JVNの月次集約更新

**confirmed-modification / delta-localization; vendor date-only reference**。JVN一覧10/27 10:15 JST、本文は10/14初公開・10/27最終更新。新規20件/更新22件という一覧は10月累積であり、今朝42件の新規事案ではない。

今回末尾のMendixをvendor本文で補完。SSA-137528は10/26公開CVE-2026-89209、IdP-initiated SSOで有効なSAML assertionのreplayによる認証回避。SSA-887643は9/3公開CVE-2026-80465で、10/26のV1.1は「以前の修正版では完全修正されなかったため、新しい修正版を公開」と明記。SAML response署名検証の問題は特定SSO設定が条件。いずれもvendor日付のみで時間が不明なため、vendor公開自体が対象窓内とは確定しない。

**対策：Mendix9系のSAML module 3.6.29以降、Mendix10/11系4.2.4以降へ。** Mendix本体versionとmodule版を混同しない。SSA-137528の暫定策はIdP-initiated SSO無効。過去に修正版を適用していても80465は再照合が必要。

一次: [JVNVU#90141693](https://jvn.jp/vu/JVNVU90141693/index.html)、[SSA-137528](https://cert-portal.siemens.com/productcert/html/ssa-137528.html)、[SSA-887643](https://cert-portal.siemens.com/productcert/html/ssa-887643.html)。

## 広域確認と限界

- [JPCERT home](https://www.jpcert.or.jp/)の注意喚起欄の最新は10/26 Brotli/PHP。脆弱性欄は上記JVNを反映。これは全世界で新規脅威なしという意味ではない。
- [FortiGuard PSIRT](https://www.fortiguard.com/psirt)の取得一覧先頭は10/13公開群。検索の「新規なし」だけでは全件改訂なしと断定しない。
- [Cisco一覧](https://sec.cloudapps.cisco.com/security/center/publicationListing.x)のraw HTMLはAngular templateで、単独では現行一覧全件を検査できない。ゼロ件扱いしない。
- [Chrome stable](https://chromereleases.googleblog.com/search/label/Stable%20updates)取得先頭は10/23 iOS、10/20 Android/Desktop。未観測を新規なしの保証にしない。
- [Apple security releases](https://support.apple.com/en-us/100100)は27.2系と10/26出荷を示す。対象窓内の新規出荷としては扱わない。
- [PAN RSS](https://security.paloaltonetworks.com/rss.xml)はBrotli05:40 UTC/PHP04:03 UTCの窓内改訂を検出。既存incident担当へ引継ぎ済み。
- [MSRC updates API](https://api.msrc.microsoft.com/cvrf/v3.0/updates)は2026-OctのCurrentReleaseDate=2026-10-27T01:46:22Z（10:46:22 JST）を示す。document更新時刻であり全CVEの新規公開時刻ではない。
- IPAで試したannounce/index.htmlは404、FortiGuardのweb renderingは403だったがshell経由取得は200。取得失敗と空集合を区別する。
- このnotesの確定は勧告の公開/改訂。ここから悪用・情報漏えいの発生を確認したものはない。

## MSRC CVRF追加照合 — Chromium記録の新規収録と既存改訂

[October CVRF一次JSON](https://api.msrc.microsoft.com/cvrf/v3.0/cvrf/2026-Oct)を取得。DocumentTrackingのCurrentReleaseDateは01:46:22 UTC、InitialReleaseDateは10/13。窓内RevisionHistoryのある42 CVEのうち、35件はこのdocumentで初回revision、7件は既存revisionの追記。既存7件はCVE-2026-110264、115379、115383、115557、97229、106269、106378。初回35件はChromium関連の記録であり、35件の新規悪用や新規修正出荷へ換算しない。

例としてCVE-2026-110158（Passwords UAF）は23:16:43 UTCにInformation published、CVRFのFixedBuildはEdge155.0.4283.60。本文FAQはlatest EdgeがもはやvulnerableではないことをSUGで案内する説明。現在の安定最新版や修正出荷時刻をこのAPIのみから確定しない。**対策はEdgeのAbout画面等で現行security update適用を確認すること。** 古いFixedBuildの文字列を「本日の最新推奨版」とはしない。

解析用一覧は[msrc-window-summary.json](../data/2026-10-27-1847-discovery/msrc-window-summary.json)。raw JSON内RevisionHistory Dateはtimezone suffixを欠くが、updates APIは同一CurrentReleaseDateをZ付きで返す。時刻を表示する場合この対応を根拠とした。本文差分は前回同一CVRF原本との比較をしていないため、Information publishedの具体的変更内容は未確定。

保存容量整理：大きなresponseは元のresponse bytesをgzipで可逆圧縮して保存。manifestのsha256/bytesは保存file、decoded_sha256/decoded_bytesはgzip展開後本文、original_response_sha256がある場合はローカル圧縮前responseを示す。CVRF原本はmsrc-october.json.gz。[msrc-revision-index.json](../data/2026-10-27-1847-discovery/msrc-revision-index.json)には新規収録35件/既存改訂7件のCVE、窓内revision時刻、FixedBuildとproduct IDを抽出した。展開一致と全25保存fileのhashを再検証済み。
