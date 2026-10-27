# 2026-10-27 18:47 JST vendor followups

対象窓: 2026-10-26 22:47 UTC〜2026-10-27 09:47 UTC（10/27 07:47〜18:47 JST）。実取得は09:49:39 UTC以降（18:49:39 JST以降）。取得時刻を公開時刻に置換しない。現行原本であり締切時点の完全復元ではない。

## GMO: 予告から、情報と称するものの公開確認へ

[GMO第8報](https://group.gmo/info/alert/20261027/)は09:58 JST（00:58 UTC）時点、10:56 JST（01:56 UTC）追記訂正。端末解析継続、Trend Micro等の協力申し出、バックアップ後のネットワーク切断・電源断・コード取り外しを顧客に要請。

[第9報](https://group.gmo/info/alert/2026102702/)の訂正済み見出しは11:59 JST（02:59 UTC）時点。解析完了端末からマルウェア未確認とするが、全顧客端末の安全確認ではない。掲載時刻訂正の注記があり、本文末尾の過去経緯は11:52と不一致。初回公開時刻を厳密に確定しない。

[第10報](https://group.gmo/info/alert/2026102703/)は13:55 JST（04:55 UTC）時点。会社・顧客に関する情報と称するものが公開されたことを12:30 JST（03:30 UTC）に確認したと説明。内容は確認中で事実と異なる可能性がある。ランサムウェア攻撃は13:55時点で未確認。公開行為の確認と公開内容の真正性・全件影響確定を分ける。該当情報を当社が確認した顧客へ個別連絡予定。

[第11報](https://group.gmo/info/alert/2026102704/)は14:55 JST（05:55 UTC）時点。公開情報へのアクセス・転載・誘導リンク拡散を控えるよう要請し、既にアクセスした人にフルスキャンを推奨。便乗フィッシング、パスワード・認証コード・金銭を求める連絡に注意。第10報の端末隔離要請も参照する。サイト訪問者の情報取得についてはGMOの説明であり、本調査で独立検証していない。

## Railway: 新規登録再開日を未定と明記

[公式status](https://status.railway.com/)の10/27 03:22 UTC（12:22 JST）の通知を確認。「追加事件ではない」「前回から変更なし」、既存顧客の信頼性を優先し新規登録停止を継続、再開日をまだ示せないと説明。[一次報告](https://blog.railway.com/p/preliminary-report-october-security-incident)本文は07:47版と同一。新規登録の今週再開を確定予定扱いしない。次回status更新予定15:00 UTC（10/28 00:00 JST）は締切後の予定であり成果として含めない。

対応は10/21より前に登録した顧客向けの保存secretのローテーション、GitHub・registryの監査を継続。復旧通知はsecret安全性の確認とは別。

## 取得本文の継続を確認した資料

以下は07:47保存原本とBeautifulSoup.get_text(' ', strip=True)全文一致。新規公開や修正出荷の差分をこの取得からは認めない。

- [ConnectWise](https://www.connectwise.com/company/trust/advisories): Cloud Backup最新更新は10/26 14:00 UTC（23:00 JST）。段階的onboarding準備、個別通知待ち。次回予定10/27 14:00 UTCは締切外。対象接続は個別案内まで無効維持。
- [SoftBank](https://www.softbank.jp/corp/news/info/2026/20261023_01/): 更新10/26 23:45 JST（14:45 UTC）、全緊急速報メール再開10/26 23:17 JST（14:17 UTC）。どちらも前回窓以前。PHP修正に伴うメンテ終了であり新規被害確認ではない。
- [Tailscale bulletin](https://tailscale.com/security-bulletins)・[changelog](https://tailscale.com/changelog): 全文一致。[release API](https://api.github.com/repos/tailscale/tailscale/releases?per_page=5)最新安定v1.104.2、published_at=2026-10-21T02:55:49Z（11:55:49 JST）。eMudhra対処版をTailworm修正版と断定できない。SSH forwarding / Serve / Funnelの利用・到達条件と、CA鍵問題を分離して点検する。
- [eMudhra incident](https://emudhra.com/en/post/certificate-security-incident)・[MEA声明](https://emudhra.com/en/press-release/emudhra-confirms-no-impact-middle-east-africa-global-tls-incident): 全文一致。地域限定の声明を全製品・全世界の安全性保証へ拡張しない。
- [Fortinet](https://www.fortinet.com/blog/ciso-collective/fortinet-releases-security-hardening-release-for-multiple-products): 全文一致。系列別修正と公開管理面の制限を継続。本文の10/22 availabilityや11/10詳細勧告予定を今回の新規出荷・悪用確認と数えない。

## .NET Brotli: 新規差分ではなく既存一次情報の再照合

[Microsoft公式issue 494](https://github.com/dotnet/announcements/issues/494)のAPI created_at=10/25 19:06:12 UTC（10/26 04:06:12 JST）、updated_at=10/25 19:23:38 UTC（10/26 04:23:38 JST）。今回窓の改訂ではない。

ASP.NET Core / HttpClientは既定ではBrotli自動展開をしない。.NET Frameworkは非対象。攻撃者制御データをBrotli展開する経路を確認し、系列別にruntime 8.0.33 / 9.0.22 / 10.0.14 / 11.0.0-rc.3.26522.148へ。shared runtime更新後はアプリ再起動、self-containedは再build・再deploy、NativeAOTはSDKと明示compiler/runtime-pack参照を更新して再publish・再deployする。未使用の自動展開を緩和例のために新規有効化しない。

## 原本と限界

19件のHTTP応答・headers・SHA-256・取得開始時刻を[data/2026-10-27-1847-vendors/collection-summary.json](../data/2026-10-27-1847-vendors/collection-summary.json)へ保存。HTMLからの抽出テキストと比較diffも同ディレクトリ。HTTP 200は内容の真正性を超える事実の証明ではない。今回は選定した既存一次URLとGMO一覧を確認したもので、全vendorサイトの更新不存在や悪用不存在を証明しない。Tailworm専用配布修正版の最低版はこの確認では確定できない。

## 追加: PAN PHP hotfixの出荷状態が更新

[公式PHP勧告](https://security.paloaltonetworks.com/CVE-2026-109618)および[JSON](https://security.paloaltonetworks.com/json/CVE-2026-109618)のcna.timelineで、10/27 00:10 UTC（09:10 JST）に10.2.13-h27 / 10.2.16-h12、04:03 UTC（13:03 JST）に12.1.7-h11 / 12.2.4-h1をreleasedとしてETA削除したことを確認。前回の最終timeline10/26 05:45 UTCに対する真の差分。00:10更新はFAQとKoi状態も更新。自分の系列の修正を照合し、別系列の版を一律に適用しない。11.2.13-h4等に残るETAを出荷済みに変換しない。JSON原本は本ディレクトリpan-json.response。

親collectorのdata/2026-10-27-1847/unit42-php.html.gzも確認したが、見出しはUpdated October25、末尾履歴はOctober25 2:15pm PTの訂正が最後。RSSの刷新時刻だけで新たなPHP悪用確認とみなさない。
