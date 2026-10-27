# 2026-10-27 18:47 JST — 固定窓収集・検証

対象窓は2026-10-26T22:47:00Z〜2026-10-27T09:47:00Z（07:47〜18:47 JST）。API収集は18:49:44〜18:50:35 JST、追加一次照合はその後です。公開・DB収録・改訂・修正初出荷・被害確認・取得は別々の時刻として扱います。窓境界はinclusiveです。

| 集合 | 件数 | 重複・留保 |
|---|---:|---|
| NVD published | 89 | modifiedへ全件重複、Received64 / Deferred24 / Rejected1 |
| NVD modified | 192 | 新規89を含む |
| GHSA published | 127 | unreviewed125 / malware2 / reviewed0 |
| GHSA modified | 181 | 公開127を全件含む。型別の全原本を保存 |
| GHSA公開とCVEの重複 | 88 / 37 | 今回NVD / 前回NVD。malware2件はCVEなし |
| CISA KEV | 1,758 | 2026.10.26版。前回保存原本からPHP2件差分 |
| 照合済み応答原本・参照 | 146 | 主収集55、補助47、当事者19、広域25。27件は過去原本への参照 |

NVD/GHSAの公開・改訂は各typeの全ページ取得を完了。重大度で収集対象を絞っていません。全世界の被害を網羅する収集ではなく、フィード未収録・KEV非掲載・ソース本文一致を、攻撃や更新が存在しない証明にしません。

## 保存と再現

- `data/2026-10-27-1847/collection-summary.json`: URL・取得時刻・APIページ・SHA-256・エラー。
- `nvd-index.json`: NVD公開/改訂とGHSA公開の見やすい索引。`ghsa-modified-index.json`はGHSA改訂。
- `supplemental/`: 選定した開発元advisory、release、CNAとKEV公式Git commitの47応答。
- `data/2026-10-27-1847-vendors/`: GMO第8〜11報、Railway、PAN等19応答と比較資料。
- `data/2026-10-27-1847-discovery/`: JVN・CERT・MSRC等25成功応答、失敗1件。MSRC原本はgzip保存、35公開revisionと7既存改訂の`msrc-revision-index.json`付き。
- `data/2026-10-27-1847-packages/`: 選定CNA/GHSA recordとbrowserによる一次資料取得結果。選定recordや抽出textは派生資料で、146のHTTP原本へ重複加算していません。

主collectorと補助collectorのSHA-256は展開body、当事者は保存response byte、広域manifestは保存byteとdecoded byteの両方です。`tools/intel/verify-1847.py`が各方式で146件すべてを再検証します。過去原本への相対参照も検証対象です。後日再取得しても当時の改訂本文を再現できるとは限りません。

```sh
python3 tools/intel/verify-1847.py
# 再収集は保存原本を更新するため、別checkoutで行う
python3 tools/intel/snapshot-1847.py
```

## 特に注意した不一致

- KEVのdateReleasedは07:24 JST（窓前）、公式Git commitは10:13:12 JST（窓内）。2件の前回保存差分は確認したが、元の公開時刻や攻撃開始時刻を推定していない。`forensicTriage=Yes`、ransomware campaignは`Unknown`。
- GMO第9報は訂正済み見出し11:59 JSTと経緯欄11:52に差。第10報は公開を確認した一方、内容は確認中、13:55時点のransomware未確認を保持。
- OpenPanelのCNA境界3.0.0と一部開発元GHSAのcommit/空patched欄を併記。修正配備はcommitとimage digestで確認する。
- Supermicro CVE-2026-18449のNVD説明が18450と重複。hardcoded SMCRAKP keyという開発元本文を優先。
- GROWI開発元GHSAのCVE欄はNo known CVEだがJVNには対応CVEあり。両者の付与状態の差を保持。
- JVN新規周知を初修正出荷と混同しない。Kubernetes9/14初公開、DOMPurify10/12、vsomeip7/6修正、Psono7/30修正等。

## 失敗・限界

主collectorの旧IPA feed URL404と研究ページredirect loopを保存。広域collectorのIPA旧URLも404。一部Fortinet PSIRT403、Moxa/Apacheのvendor本文取得未完はCNA条件付き記載として残しました。HTTP200のanti-botページは本文確認とみなさず、各研究メモの取得限界を優先します。失敗を0件へ変換しません。今回保存資料はcutoff後の現行改訂です。
