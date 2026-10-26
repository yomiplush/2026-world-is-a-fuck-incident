# 2026-10-26 14:56 JST — 固定窓の全深刻度収集と一次資料照合

対象は **2026-10-26 14:56 JST / 05:56 UTC**、前回13:01 JST以降の固定窓は **04:01:00〜05:56:00 UTC**。実取得は15:00 JST以降。公開、DB収録、改訂、侵入、修正提供、取得を分ける。APIは対象時刻後に取得した現行改訂を返すため、後日の無記載追記まで当時の本文へ復元できない。

## 集計と前回との差

| 集合 | 今回の固定窓 | 重複・解釈 |
|---|---:|---|
| NVD published | 8 | 全件modifiedにも含む。新しい8件の実被害ではない |
| NVD modified | 11 | 上記8件と旧CVE3件。合計19件と数えない |
| GHSA published | 0 | 全深刻度・全ページを取得。既存GHSAの改訂が0という意味ではない |
| KEV | 1,756 | 2026.10.23版。前回13:01取得と展開後バイト列が一致、新規追加0 |
| フィード | 18取得先 | 17応答成功、IPA旧URL404。現行IPAページへフォールバック済み |

前回13:01のNVD published 8 / modified 20、GHSA13件とは別の固定窓。今回publishedのCVEは前回published集合と重複しないが、**MLITのCVE-2026-113345は前回12:00 JSTのJVN情報として既報**。DBへの初収録と、本レポートで初めて扱う問題を区別する。

17件の成功フィード中13件は前回と原本が同一。日時解析できた配信項目では今回窓内の新規公開を確認しなかった。フィード原本の違いだけで新しい事件や本文変更と判定しない。JPCERT、JVN、CISA、Microsoft、Talos、Unit 42、oss-sec、GitHub、Project Zero等を横断し、二次フィードは一次探索の入口として保存した。配信なしは事故なしの証明ではない。

## DB収録から確認した6群・8 CVE

### GouGuOA：一般従業員アカウントからのアップロード経路

**CVE-2026-116113、NVD13:17:47 JST。** CNA対象は6.1.2までの`chunkUpload`、`file_extension`による危険なファイルのアップロード。リンク先の研究者原報告は**9/28付**で、6.1.2の既定構成を実験し、一般従業員のログインが必要と明記する。CNAの「遠隔」を未認証攻撃と読み替えない。分割片の拡張子確認と結合後ファイルの拡張子確認が別で、Web公開領域への保存と組み合わさる。HTTP 500でもファイル書込み後のエラーであり、安全に拒否された証拠にはならないという研究報告。

**対応：** 利用版、従業員アカウント、分割アップロード公開範囲を確認。結合後の拡張子許可リストとWeb公開領域でのコード実行禁止を点検し、保存領域の不審スクリプトを調査。最低修正版と実悪用は今回未確定。研究報告の修正案とベンダー配布済み修正を混同しない。

[CNA/NVD](https://nvd.nist.gov/vuln/detail/CVE-2026-116113) / [研究者原報告](https://github.com/Gum29/rrrreeeeeeee-readme/blob/main/images/img/GouguOA-RCE-Standard-Vuln-Report-EN.md)

### Yoosee GM8135Sカメラ：盗聴・WiFi初期設定・ローカル改変を分ける

**CVE-2026-116114 / 116115 / 116116、NVD13:17:54〜55 JST。** CNA対象は21.00.01.36。研究者ページの公開履歴は**7/20**であり、新規発見ではなくDB収録の補足。

- 116114：稼働中のライブUDP H.264映像が平文で流れ、通信経路上等で観測できる攻撃者が再構成できるという報告。世界中の任意の端末から映像を無条件取得できるとの証明ではない。
- 116115：パスワード不要の既定SSIDへ自動接続するWiFi設定。近接・同一無線環境等の条件を分ける。
- 116116：firmwareの署名・真正性検証不足。研究者はフラッシュを読み出し改変して書き戻すローカルな経路を説明する。これをインターネット経由の未認証RCEへ変換しない。

**対応：** 機種・firmware・P2P通信を棚卸しし、機微な場所への設置と外向き通信を見直す。専用IoTセグメントと許可先制限を確認し、必要な遠隔閲覧は暗号化された管理経路へ。Ethernet化だけでは平文映像や署名検証の問題は解消しない。ページは公開時点でfirmware修正なしとするが、現在の最低修正版は今回未確定。

[116114](https://nvd.nist.gov/vuln/detail/CVE-2026-116114) / [116115](https://nvd.nist.gov/vuln/detail/CVE-2026-116115) / [116116](https://nvd.nist.gov/vuln/detail/CVE-2026-116116) / [研究者一次報告](https://akosibrylle.me/writeups/yoosee-cve)

### MLIT電子納品物検査支援システム：既報のNVD初収録

**CVE-2026-113345、NVD14:17:54 JST。** 前回13:01レポートに12:00のJVN公表を掲載済み。Ver.4.0.36以前のインストール先のアクセス権により、ローカルファイル改ざんからコード実行の可能性。新たな事件や遠隔侵入が確認されたわけではない。

**対応：** 導入済みは更新、新規導入は最新版インストーラ。最低修正版の番号を推測しない。

[NVD](https://nvd.nist.gov/vuln/detail/CVE-2026-113345) / [JVN](https://jvn.jp/jp/JVN75668103/) / [開発元](https://www.ysk.nilim.go.jp/cals/)

### Halo：テンプレート名のpath traversal登録

**CVE-2026-116117、NVD14:17:54 JST。** CNA対象は2.27.0-beta.1まで、`DefaultViewNameResolver.resolveViewNameOrDefault`。現行公式コードではテーマの`templates`領域へ要求名をresolveしてファイル存在確認をする経路を確認した。ただし、この一部分だけでは全HTTP到達条件、情報取得範囲、任意コード実行を独立実証したことにならない。

**対応：** テーマ・template名を外部から選択する機能と権限を確認。非信頼template名を渡さず、配布元の修正を追跡。最低修正版と実悪用は未確定。

[CNA/NVD](https://nvd.nist.gov/vuln/detail/CVE-2026-116117) / [公式コード](https://github.com/halo-dev/halo/blob/main/application/src/main/java/run/halo/app/theme/DefaultViewNameResolver.java)

### Z.ai Zcode：sedコマンドのフィルター境界

**CVE-2026-116118、NVD14:17:54 JST。** CNAは3.14.3/3.15.1までのSed Command FilterにOSコマンドインジェクションと記載。CNAが参照するFeishu原報告はリダイレクトループで取得できず、実際の入力、承認設定、起動元等の前提を確認できなかった。

**対応：** 該当製品とコマンド自動実行・承認設定を確認し、非信頼入力のコマンド処理を制限する。任意のWeb閲覧だけで無条件RCEとせず、最低修正版・実悪用は未確定とする。

[CNA/NVD](https://nvd.nist.gov/vuln/detail/CVE-2026-116118) / [原報告URL・今回取得失敗](https://mcniyfj5bw9b.feishu.cn/docx/ZRTudN7cPoJUaZxv89ycn3rbnTG)

### NocoDB：パスワード再設定の競合、開発版には対処コードあり

**CVE-2026-116119、NVD14:17:54 JST。** CNA対象は2026.08.0までのパスワード再設定競合。公式issue #14684は現在削除済みと表示する。一方、**10/15の公式コミット9e57d237にも、トークンを更新条件に含めて1回だけ消費する`consumeResetPasswordToken`呼出しとモデル実装が存在する**ことを確認した。CNAの「返信なし」やissue削除から、全バージョンで修正が存在しないと推測してはいけない。

**対応：** 有効な再設定トークンの競合防止を含む配布物か確認し、公開認証経路と再設定・セッション失効のログを点検する。最低出荷修正版と対象ビルドへの収録、再現の完全照合は今回未確定。任意アカウントのトークン不要乗っ取りを実証したとは記載しない。

[CNA/NVD](https://nvd.nist.gov/vuln/detail/CVE-2026-116119) / [削除済みissue](https://github.com/nocodb/nocodb/issues/14684) / [10/15時点の呼出し](https://github.com/nocodb/nocodb/blob/9e57d237c8964ff74ae9ab1fb131d25a2a637a8e/packages/nocodb/src/services/users/users.service.ts) / [同モデル実装](https://github.com/nocodb/nocodb/blob/9e57d237c8964ff74ae9ab1fb131d25a2a637a8e/packages/nocodb/src/models/User.ts)

## 既公表CVEの改訂と重要な範囲補完

### .NET Brotli：既定では解凍しない。NativeAOTは共有runtime更新だけでは不足

**CVE-2026-111497のNVD更新14:17:53 JST。公式.NET勧告#494自体は10/26 04:06:12 JST作成、04:23:38 JST更新で、前回13:01より前。** 新規の午後公表ではなく、今回一次勧告を補完したもの。

ASP.NET Coreのリクエスト解凍、HttpClientの自動レスポンス解凍は既定では有効でない。Brotliを明示的に有効化するか、`BrotliStream` / `BrotliDecoder`等で攻撃者のデータを展開するアプリが対象。.NET Frameworkは対象外。緩和のために、それまでなかった自動解凍を新規に有効化してはいけない。

**対応：** .NET8は8.0.33、9は9.0.22、10は10.0.14、11previewは11.0.0-rc.3.26522.148等の公式表を照合。アプリ再起動、self-containedの再ビルド・再配置を行う。**NativeAOTはSDK・明示的compiler/runtime packを更新して再publish・再配置**。マシンの共有runtime更新だけではバイナリにリンク済みのdecoderは置換されない。これは別の.NET socket CVE-2026-70197と原因・条件が異なる。

[NVD](https://nvd.nist.gov/vuln/detail/CVE-2026-111497) / [Microsoft公式勧告#494](https://github.com/dotnet/announcements/issues/494)

Brotli上流の1.0.10 / 1.1.1 / 1.2.1は10/21の既存修正版であり、前回までにも記録済み。単純な「1.0.3〜1.2.0全て」の連続範囲は修正済みバックポートを誤って含む。分岐別範囲とベンダーパッケージを照合する。

[1.0.10](https://github.com/google/brotli/releases/tag/v1.0.10) / [1.1.1](https://github.com/google/brotli/releases/tag/v1.1.1) / [1.2.1](https://github.com/google/brotli/releases/tag/v1.2.1)

### Red Hat版OpenSSH：FIPSのclient停止とX11 forwardingを区別

**CVE-2026-55653 / 55655のNVD更新13:17:57 JST。初公表は6月。** 55653はFIPSモードのDH-GEX処理で悪意あるSSHサーバーとの接続によりclientが停止する問題。55655はローカルの攻撃者が明示的に有効なX11 forwardingを横取りする条件。Red Hatは自社配布版の問題で、上流OpenSSH一般を同一対象としないと説明する。Tailwormの11研究項目に新たなCVEが付いたという意味でもない。

**対応：** 利用するRed Hat製品のerrataを照合し、不要なX11 forwardingを停止。FIPSの交渉設定は製品の暗号ポリシーと照合して見直す。古い弱い暗号を例示のまま追加して緩和としない。2件をインターネット公開sshdの未認証RCEへ読み替えない。

[Red Hat55653](https://access.redhat.com/security/cve/CVE-2026-55653) / [Red Hat55655](https://access.redhat.com/security/cve/CVE-2026-55655)

## 再現性、原本、取得失敗

再取得は`python3 tools/intel/snapshot-1456.py`。前回の基盤collectorを利用し、NVD published/modifiedは深刻度無指定・全ページ、GHSAも公開窓の全ページを取得する。今回NVDは両方1ページで全件回収でき、GHSAは空配列の成功応答を保存した。`modified`はCVE改訂日時の検索であり、収録された関連URL先すべての更新を検出できるわけではない。

- [collection-summary.json](../data/2026-10-26-1456/collection-summary.json)：URL、実取得UTC、成功/失敗、原本への相対パス、展開後SHA-256。
- [nvd-index.json](../data/2026-10-26-1456/nvd-index.json)：全8件/11件の本文・出典URL・評価とGHSA集合。
- [feed-index.json](../data/2026-10-26-1456/feed-index.json)：フィード別項目・公開UTC・今回窓内判定。フィード日時と本文の更新時刻は別。

原本が前回と同一の場合は前回13:01ファイルへの相対参照で重複保存を避け、今回の取得時刻とhashを保持する。SHA-256はgzip展開後の応答バイト列。NVD/GHSA/KEVの件数は別集合で重複があるため、被害件数や事件数へ変換しない。

IPA旧URLは404、現行ページは成功。Zcode原報告は302リダイレクトループで失敗した。失敗は「問題なし」「修正済み」の証拠ではない。Halo/NocoDBのコードは利用版の実行検証ではなくソース照合であり、PoCを実行していない。

Neat、eMudhra、PAN-OS、ConnectWise等の下流・ベンダー情報も原本を保存した。正確な対象時刻以前の公開確認と、時刻不明の同日資料は別担当の一次調査で照合する。公開時刻を持たない現行本文や生成時刻だけで固定窓の新規公表へ格上げしない。
