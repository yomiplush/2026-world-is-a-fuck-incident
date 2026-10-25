# 大特集：Tailworm — Tailscale / headscale の信頼境界を確認する

**基準：2026-10-25 23:18 JST（14:18 UTC）。** 実取得は基準後。[取得記録・ハッシュ](../data/2026-10-25-2318/collection-summary.json)を保存。研究サイトは継続更新され、厳密な版履歴はないため、現在の本文全体が23:18以前に公開済みだったとは保証しない。調査環境でPoCを実行していない。

[English](27-tailworm.md) / [読む特集](https://infosec-briefing.yomiplush.dev/tailworm.html) / [6画面の特集](https://infosec-briefing.yomiplush.dev/?lang=ja#41)

## まず、自分に関係するか

Tailscale / headscale 利用者は、**Tailscale SSHを有効にしている端末と、そこへ接続できる主体**を先に確認する。SSHの許可先が広い環境では、通常の端末侵害から別サーバーへの権限昇格へつながる可能性がある。研究者は **Tailscale v1.104.2 / headscale v0.29.5** の実験室で再現したと報告している。これらは**検証対象版であり修正版ではない**。全旧版の厳密な影響範囲、専用CVE/CVSS、Tailwormを解消する最低修正版は今回未確定。[研究報告](https://tailworm.com/)

Tailscale開発責任者 Mike Shaver の10/25応答は、報告を受領し問題を調査・修正していると説明。現在把握する中心は接続許可後のUnix権限とSSH転送で、影響構成を確認中。全利用者にSSH無効化を勧める判断はしていない。不要なSSH・転送の許可削減、重要ホストの許可限定、check mode、自動更新を案内する。**check modeは入口の追加認証であり、接続後の権限昇格を修正しない**。[当事者の応答](https://www.reddit.com/r/Tailscale/comments/1xeoj1l/recent_tailscale_vulnerability_reports/)

**普通のOpenSSHをTailscale経由で使う構成と、tailscaled内蔵のTailscale SSHは分ける。** WireGuardそのものの暗号解読や、インターネットから全端末へ無認証でrootを取れることが確認されたという報告ではない。Tailscale SSHはホストごとの有効化とネットワーク・SSHポリシーが関係する。[公式SSH文書](https://tailscale.com/docs/features/tailscale-ssh)

## 研究者の11項目を、成立条件ごとに読む

以下は**研究者の再現報告の要約**。ベンダーによる11項目全体の個別認定、全製品・全環境での再現、実攻撃の観測を意味しない。「11項目」には設定上の注意や脅威モデルも含まれ、11件のCVEとは数えない。[一次報告](https://tailworm.com/)

| 報告項目 | 対象・前提 | 報告された影響 / 運用上の確認 |
|---|---|---|
| 1–3：SSH Unix socket転送とTOCTOU | Tailscale SSH有効、SSH接続許可、該当方向の転送許可 | rootで行うsocket接続・置換とパス競合。許可ユーザーから権限昇格・ファイル破壊・登録資格情報窃取へ。単にSSH先ユーザーを非rootにするだけでは不足 |
| 4：conn25 | 実験的conn25コネクタと、その利用capabilityを持つ端末 | 実宛先の検証不足により、コネクタ側ネットワーク・クラウドmetadata等へ到達するとの報告。全app connector構成への一般化を避ける |
| 5：SSH接続保持 | SSH接続の事前条件あり | tailscaledのメモリ枯渇。SSH許可と接続数・メモリを確認 |
| 6：headscale / DERP client | 公開headscale登録経路。DERP側は悪意あるrelayへ誘導できることが条件 | headscaleメモリ枯渇・登録キャッシュ排出、悪性relay応答でclientメモリ枯渇。Tailscale SaaS制御面を同じ被害範囲に数えない |
| 7–8：Serve TCP→Unix socket | operatorによる該当forward設定。8は設定後の競合 | 管理localapi等への露出、設定時検査だけでは残る競合。Serve設定と特権socket宛先を点検 |
| 9：Funnel entitlement | peer capabilityとlocal設定を持つ経路 | 研究者はnode attribute強制位置を脅威モデル上の問題として指摘。未認証の外部利用者が全Funnelへ侵入できるとの結論ではない |
| 10：全interfaceへのServe bind | `TS_SERVE_ALLOW_ALL_INTERFACES` を設定 | 設定上の注意。トンネル外へのlistenを確認。通常の全Serve既定動作と混同しない |
| 11：HTTP/2 Serve context競合 | 複数mountとheaderによるアプリ認可等 | mount間でcapabilityが混ざるという報告。backendの独立認可、mount分離を検討 |

研究者は、SSHポリシーが到達を許可した範囲での自動伝播を**実験室で実証した**とする。「worm」の名称から、自己増殖マルウェアが現実に流行中と推定しない。今回確認した一次資料ではTailwormを使った実環境の侵害は未確認。到達ポリシーは被害範囲を制限するが、許可済みセッション内のroot操作を修復するものではない。[研究報告](https://tailworm.com/)

## 今日の運用：確認 → 許可削減 → 更新監視

1. **棚卸し。** 稼働中のTailscale版、SSH有効ノード、SSHルールの送信元・宛先・ローカルユーザー・転送許可、headscale採用、conn25利用、Serve/Funnel設定を列挙する。共有タグ・広いグループが与える実到達範囲も確認。
2. **SSHを狭める。** 必要な利用者・端末から必要な宛先へ限定し、不要な転送を止める。通常のネットワーク到達ルールは `grants`、SSHのルールは専用の `ssh` セクション。存在確認していない転送フィールドをコピーさせる設定例は掲載しない。[公式ポリシー構文](https://tailscale.com/docs/reference/tailscale-policy-file)
3. **重要ホストはリスクに応じて一時停止も選択。** 代替管理経路を確認してからTailscale SSH停止を検討する。ベンダーの全員一律停止の勧告ではなく、管理者の暫定判断。通常のOpenSSHへの切替は、独立した認証・権限・転送設定を検証してから行う。
4. **headscaleは別の対策。** 研究者は0.29.5でSSH転送の抑止ができないと報告。SaaS用設定をそのまま使えるとせず、許可範囲の削減、必要ならSSH停止、登録経路の公開制限・rate limit・メモリ上限・再起動監視を検討。上限はサービス保護の緩和であり修正ではない。
5. **コネクタとServe。** conn25権限と実宛先を制限し、クラウドmetadata等へのegressを検証。Kubernetes NetworkPolicyは利用CNI・hostNetwork・転送経路で効力が異なるため、設定投入だけで完了にしない。Serveの特権Unix socket宛TCP転送と全interface bindを除く。Unix socketの競合はIP firewallだけでは防げない。[研究報告](https://tailworm.com/)
6. **監視と修正版確認。** 不審な端末追加、鍵発行・使用、ポリシーやroute変更、socketの置換、メモリ異常、身に覚えのない認証要求を調べる。証跡は侵害端末から分離して保存する。公式勧告・changelogとheadscaleの修正を継続確認。[Tailscale公式勧告](https://tailscale.com/security-bulletins) / [changelog](https://tailscale.com/changelog) / [headscale releases](https://github.com/juanfont/headscale/releases)

読み取り専用の入口（**秘密のstateファイルや鍵を貼り付けない**）：

```bash
tailscale version
tailscale serve status
tailscale funnel status
```

設定確認は管理コンソールと配置ファイルで行う。不要なTailscale SSHを止める場合のCLIは `tailscale set --ssh=false`。**アクセスを失う可能性があるので、別の管理経路を先に確認して手動実行する。** 上記以外の変更・侵入テストをこの調査では行っていない。[CLI公式](https://tailscale.com/docs/reference/tailscale-cli)

## 侵害を疑う場合：OSの再インストールだけで終わらせない

rootを取られた端末では、端末のstateや登録用資格情報が持ち出された可能性を調べる。隔離と証跡保全の後、制御面で端末を削除・失効し、到達可能だったauth key・API key等をローテート。Tailnet Lock署名ノードに被害があれば署名鍵の対応も検討する。再構築のみでは持ち出されたidentityの失効を証明できない。[研究者の封じ込め手順](https://tailworm.com/) / [公式の端末削除](https://tailscale.com/kb/1260/device-remove)

## 別件の証明書更新と混ぜない

Tailscale **1.104.2** は10/21の **TS-2026-013（eMudhra証明書）** に対する更新。Tailwormの研究でも同じ版を検証しているため、「最新版に上げたからTailworm対応完了」とはできない。既知の証明書問題への更新は適用しつつ、Tailwormの修正は別に追跡する。libtailscale **0.2.0** のTS-2026-012や4via6のTS-2026-011も別件。[公式bulletins](https://tailscale.com/security-bulletins)

## 証拠と留保

- 研究者：Erica Windisch / Cyberdione Labs。検証期間10/22–24、上記2版。報告を引用しており、本リポジトリでの独立再現はない。
- ベンダー：Mike Shaver名義のReddit投稿を一次応答として確認。JSON APIは403、本文はwebで確認。表示の相対時刻と日付は確認できたが厳密な公開・編集時刻は未確定。本文を23:18時点の不変の記録とはしない。
- 取得時のbulletinsの最新は10/21のTS-2026-013、changelogの最新clientは1.104.2。Tailworm専用修正版・CVSSをそこから作らない。
- 研究ページのpeer一覧やcheck mode等の広い主張もベンダーが全件確認したとは扱わない。追加証拠で訂正する。

[夜間の広域調査](28-snapshot-20261025-2318.ja.md) / [従来の16:34調査](25-snapshot-20261025.ja.md)
