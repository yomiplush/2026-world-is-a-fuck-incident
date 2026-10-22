# CISA KEV — 2026年10月14日〜20日の新規追加

CISA KEV（Known Exploited Vulnerabilities）は「**実際に悪用が確認された**」脆弱性のカタログ。
米連邦機関には期限付きの対応義務があるが、**民間でも「今すぐ直すべきもの」のフィルタとして
最も実用的**。2026-10-21 時点で 1,754 件。

## 1. 新規追加（期限つき）

| 追加日 | CVE | 製品 | 期限 | 内容 |
|---|---|---|---|---|
| 10-20 | CVE-2026-96656 | Plex Media Server | **10-23** | admin ユーザが任意ファイルを書き込み、ロード時に実行される |
| 10-20 | CVE-2026-96654 | Plex Media Server | **10-23** | エンコードされた URI スキームの中和不備。他プラグインの関数を任意パラメータで呼べる |
| 10-20 | CVE-2026-96655 | Plex Media Server | 11-03 | SSRF（`/video/:/transcode/universal` のパスパラメータ） |
| 10-20 | CVE-2026-96652 | Plex Media Server | 11-03 | SSRF。任意の `X-Plex-Token` で `protocol` に完全な URL を入れ、任意の送信先へ POST させる |
| 10-20 | CVE-2026-106931 | EG Secure Solutions SiteGuard | — | OS コマンドインジェクション |
| 10-20 | CVE-2026-110936 | Siemens Software Center | — | 非制御の検索パス要素 |
| 10-16 | CVE-2026-102764 | BeyondTrust Remote Support | 10-19（**超過**） | なりすましによる認証バイパス。遠隔からアプライアンス上のファイル操作が可能 |
| 10-16 | CVE-2025-61624 | Fortinet 複数製品 | — | パストラバーサル |
| 10-15 | CVE-2026-21589 | Atlassian 複数製品 | — | 外部の当事者からファイル/ディレクトリに到達可能 |
| 10-14 | CVE-2026-0322 | Palo Alto PAN-OS | 10-17（**超過**） | コードインジェクション。ネットワーク到達可能な認証済み攻撃者が root で任意コード実行 |
| 10-14 | CVE-2026-76519 | Cisco Secure Email Gateway | — | 相対パストラバーサル |
| 10-14 | CVE-2026-105133 | Ahsay AhsayCBS | — | 認証不備 |
| 10-14 | CVE-2026-105134 | Ahsay AhsayCBS | — | コマンドインジェクション |

## 2. Plex の4件は「1つの攻撃」として扱う

KEV の説明文が相互参照しているとおり、以下が連鎖する:

1. **CVE-2026-96652 / 96655（SSRF）** — 足がかり。任意の送信先へリクエストを飛ばせる
2. **CVE-2026-96654（URI スキーム）** — 他プラグインの関数を任意パラメータで呼ぶ
3. **CVE-2026-96656（ファイル書込）** — 書き込んだファイルがロード時に実行される

Plex は家庭用メディアサーバとして LAN に置かれがちで、「インターネットに出していないから
安全」と判断されやすい。**SSRF は LAN 内の別サービスへの足がかりになる**ので、
公開していなくても優先度は下がらない。10-23 の期限は Plex 側の修正版公開を前提にしたもの。

## 3. この一覧の使い方

KEV は「網羅リスト」ではなく**優先順位の根拠**として使う。

```bash
# 最新のカタログを取得して、直近の追加を見る
curl -s https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json \
  | jq -r '.vulnerabilities | sort_by(.dateAdded) | reverse | .[0:15][]
           | "\(.dateAdded)  \(.cveID)  \(.vendorProject) \(.product)  due:\(.dueDate)"'
```

判定のしかた:

1. **製品を持っているか**で絞る（持っていない製品の 10.0 は自分にとって 0 点）
2. 持っているなら **KEV の期限＝最低ライン**。過ぎているものは「対応漏れ」として扱う
3. `knownRansomwareCampaignUse` が `Known` のものは、優先度をさらに上げる
4. KEV に載っていない＝安全、ではない。**載るのは悪用が確認されてから**。
   php2shell のように「公開 PoC はあるが KEV 未収載」の期間がある

## 4. 出所

- カタログ本体: <https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json>
- KEV の説明: <https://www.cisa.gov/known-exploited-vulnerabilities-catalog>
- スナップショット: [`data/2026-10-22/kev-recent.json`](../data/2026-10-22/kev-recent.json)
