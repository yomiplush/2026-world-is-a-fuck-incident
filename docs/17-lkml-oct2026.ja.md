# Linux カーネル、2026-10-21/22 — 6件の脆弱性報告が公開リストに流れた

[English](17-lkml-oct2026.md) | [**日本語**](17-lkml-oct2026.ja.md)

> **2026年10月には「Linux カーネルの6件」が2つあります。** この文書は**公開 LKML に流れた ZDI の
> 6件**（SMB Direct、ksmbd など）で、2026-10-23 時点で **mainline に修正がありません**。もう1つは
> [`Infinity Core`](20-infinity-core.ja.md) — **別の** CVE 6件（timer / signal / mm / futex /
> scheduler / SLAB）で、2026-10-16 に `oss-security` へ公開され、**安定版には修正が入っており**、
> root 取得 PoC も公開されています。「root 権限昇格 PoC 付きのカーネル6件」という見出しでここに
> 来たなら、読むべきは [`docs/20`](20-infinity-core.ja.md) です。

サプライチェーンの事案でも、単一の CVE でもありません。**6件のカーネル脆弱性報告が、非公開の
security リストではなく公開の LKML に送られた**——10月21〜22日の夜の話で、うち少なくとも2件は
リモート到達可能な CVSS 9.0 です。修正はまだ mainline に入っていません。

出所は Phoronix（Michael Larabel、2026-10-22 06:05 EDT）。個々の報告は `lore.kernel.org` に
あり、Greg Kroah-Hartman が各件に「なぜ公開リストに出したのか」と返信しています。

## 1. 6件の中身

| ZDI ID | サブシステム | 影響 | スコア | パッチ状況（Phoronix 10-22 時点） |
|---|---|---|--:|---|
| `ZDI-CAN-33549` | **SMB Direct** | 整数アンダーフロー → **リモートコード実行** | **9.0** | v7.5 向けブランチにパッチ。mainline へ前倒しされる見込み |
| `ZDI-CAN-33774` | **ksmbd** | 競合状態 → **リモートコード実行** | **9.0** | 記載なし |
| `ZDI-CAN-33367` | `skbuff` / `skb_zerocopy` | **ローカル権限昇格** | — | 同じ問題を別経路が1週間前に報告済み。パッチは近く |
| `ZDI-CAN-34068` | **vmwgfx**（VMware グラフィック） | 範囲外書き込み → **ローカル権限昇格** | — | 記載なし |
| `ZDI-CAN-34076` | **nvmet** | 未初期化リソース → **情報漏えい** | — | 記載なし |
| `ZDI-CAN-32005` | TCP の search-domain クエリ | スタックバッファ溢れ → **ローカル権限昇格** | — | 1日前に投稿 |

LPE が3件、SMB 経路のリモート RCE が2件、NVMe-oF ターゲットの情報漏えいが1件。露出したホストに
とって重要なのは SMB の2件です。**ksmbd** と **SMB Direct**（`smbdirect`）はカーネルの
ファイルサーバ面で、そこでの CVSS 9.0 RCE は、サービスが待ち受けている場所ならネットワークから
届きます。

## 2. 「まだ CVE が無い」のに、なぜ大きいのか

- **エンバーゴが消えた。** 送り先は `linux-kernel@vger.kernel.org`——公開・アーカイブ・ミラー
  あり。トリガーの説明が、安定版バックポートが出るより何日も（場合によっては何か月も）前に
  誰でも読める状態になりました。
- **mainline に修正が無い。** Phoronix は mainline 未修正と明記し、1件は v7.5 ブランチ、1件は
  「近く」。ディストリのカーネルに届くまでには、サブシステム → mainline → stable → ディストリと
  まだ2ホップあります。
- **バグの種類ではなく、プロセスの失敗。** 攻撃者が漏らしたのではなく、**宛先を間違えた**だけ。
  防御側にとっての学びは「**開示チャネル自体が漏えい源になる**」ことで、
  [`docs/14`](14-supply-chain-oct2026.ja.md) と同じ教訓を別の機構で見ていることになります。

## 3. 確認できたこと／できなかったこと

このリポジトリの規律に従い、穴は穴として書きます。

| 主張 | 検証 |
|---|---|
| 6件の ID・サブシステム・スコア・パッチ状況 | **Phoronix 記事**（二次。ただし全件のリンク付き） |
| 報告が `lore.kernel.org` に存在する | ブラウザでは開ける。**自動取得は Anubis（proof-of-work のbot protection）でブロック**——推測せず記録 |
| 「mainline 未修正」 | `torvalds/linux` ミラーを確認: 2026-10-22 時点で **6件の ZDI ID を参照するコミットは無し**（同日に 7.4-rc1 のマージは見える） |
| Greg Kroah-Hartman の返信 | Phoronix のリンク先に存在。同じ Anubis の理由で本文は未取得 |

つまり「事象」は二次資料＋一次へのポインタ、「修正が無いこと」は独立に確認済み。この
スナップショットで言えるのはここまでです。

## 4. やること（カーネルが出るまでは、すべて露出削減）

1. **使っていない ksmbd を止める。** カーネル内の SMB サーバで、読み込んでいるホストの大半は
   使っていません。`lsmod | grep ksmbd` で確認し、blacklist か設定削除。
2. **SMB Direct / SMB を信頼できないネットワークに出さない。** どうしても必要なら VPN の内側に
   置き、既知のクライアントに限定する——トリガーが公開された 9.0 RCE を、エッジに置いたままに
   しないこと。
3. **ディストリのカーネルは通常のサイクルで当て、stable キューを見る。** CVE の採番を待つと、
   助言は修正より遅れます。
4. **`vmwgfx` と `nvmet` はホスト硬化の項目として扱う。** 前者はゲスト側ドライバ（ゲスト内の
   LPE。ホストがゲストを信頼していなければ脱出ではない）、後者は NVMe-oF ターゲット——動かして
   いるならファブリックを信頼できる網に閉じる。
5. **1週間後にこのページを読み直す。** CVE も stable バックポートも無い状態で「採番されたら
   当てます」は、まさに間違った計画です。

## 5. 出所

- Phoronix「Several Linux Kernel Vulnerabilities Accidentally Posted To Public Kernel Mailing List」
  （2026-10-22）— 二次だが全件リンク付き:
  <https://www.phoronix.com/news/LKML-New-Trend-Vulnerabilities>
- 6件の LKML メッセージ（記事からのリンク。自動クライアントには Anubis が立ちはだかる）:
  `lore.kernel.org/lkml/BYAPR01MB3830…80662@…`（`ZDI-CAN-33549`）、
  `…80662@…`（`ZDI-CAN-33774`）、`…80662@…`（`ZDI-CAN-33367`）、
  `lore.kernel.org/dri-devel/2026102254-protector-seventy-6454@gregkh/`（`ZDI-CAN-34068`）、
  `lore.kernel.org/all/2026102226-duly-imprison-a2c1@gregkh/`（`ZDI-CAN-34076`）、
  `lore.kernel.org/all/BYAPR01MB3830…80672@…`（`ZDI-CAN-32005`）
- 「修正が無い」ことの確認に使った mainline ミラー:
  <https://github.com/torvalds/linux/commits/master>（2026-10-22 に各 ZDI ID で検索）
- 開示チャネルの論点は [`docs/14`](14-supply-chain-oct2026.ja.md) §5 と同じ:
  <https://github.com/yomiplush/2026-world-is-a-fuck-incident/blob/main/docs/14-supply-chain-oct2026.ja.md>
