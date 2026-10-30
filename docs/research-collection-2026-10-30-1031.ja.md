# 収集の来歴 — 10月30日19:31:35 JST

[English](research-collection-2026-10-30-1031.md) / 日本語

`python3 tools/intel/snapshot-20261030.py --output-dir data/recollect-2026-10-30-1031`を新しい出力ディレクトリに対して実行する。既存ディレクトリは通信開始前に拒否する。既存の`snapshot-1318.py`と基底collectorを、指定OUT（今回の保存先は`data/2026-10-30-1031`）、PREVIOUS=`data/20261029T050117Z-dbf8f2`、START=`2026-10-29T05:01:25`、END=`2026-10-30T10:31:35`へ再設定し、継承元に固定されていたJST metadataも修正する。再実行しても取得済みの過去改訂を再現できない。過去原本は変更しない。

NVDの公開・改訂窓、GitHub reviewed／unreviewed／malwareの公開・改訂窓、CISA KEV、ベンダー続報、feedを取得する。個別errorとcontent warningは`collection-summary.json`に保持する。同一本文は過去保存原本への相対参照を使う場合があるが、実際の新しい取得日時も記録する。summaryのhashは展開後bytesを対象とし、evidence manifestの実保存bytesのhashとは異なる。

今回公開のreviewed／malware各entryのhtml_urlから追加の勧告HTML本文を直接取得した。urllib、User-Agent=`Infosec-Briefing-research`、timeout50秒、worker5、`gzip.compress(mtime=0)`を使用。`advisory-fetch.json`は全71件のHTTP200原本、実保存bytesのSHA256、UTC取得日時を保持する。別途12件のベンダー一次本文を取得し`vendor-followup-fetch.json`へ記録した。[ベンダー調査](research-vendors-2026-10-30-1031.ja.md)を参照。継承した証拠のfetched_atは元のまま保持し、統合manifestはAPI pageのURLと実保存本文も対応付ける。

台帳変更は編集判断に基づき、対応する英語文字列mapを`editorial-en-map.json`に保持する。既存translation managerでsource hash付き日本語packageを作成し、英語packageは変更のない前回英語値を保持した上で、変更文字列にCodexによる翻訳を追加する。managerは全keyと保護された数字・識別子を検証する。他言語は今回snapshotでは準備中とし、古い翻訳を最新として公開しない。
