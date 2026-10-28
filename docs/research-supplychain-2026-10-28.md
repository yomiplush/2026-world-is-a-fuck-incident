# Supply chain / identity research — 2026-10-28

基準時刻: **2026-10-28T04:18:44Z / 13:18:44 JST**。資料取得は基準時刻以後の現行ページ。下記は一次公開資料の確認結果で、世界全体の事件数ではない。原公開、本文改訂、攻撃・停止発生、ソフトウェアreleaseを区別する。既存 `data/2026-10-27-1847/incident-register.json` を継続確認した。

## New actionable differences

### ConnectWise Cloud Backup — third-party validation still pending

- [公式Trust Center](https://www.connectwise.com/company/trust/advisories): 原公開10月16日17:47 UTC、最新更新 **10月27日14:30 UTC**（今回差分）。段階復旧準備は完了、必須の第三者検証待ちで、restore access提供開始をまだ宣言していない。対象接続を無効のまま維持し個別案内を待つ。
- 実被害: application credentialsへの不正アクセスとサービス中断は確認。バックアップ保存、archive access、restoreに加えSaaS Security監視・alertとCloud Management管理にも支障が生じた。影響顧客数・損害額・全面復旧時刻は未公表。暗号化backup archiveについて侵害の兆候なしという説明は、各Microsoft 365 tenantの無侵害を証明しない。
- 同URLのAxcient Legacy Portalは10月22日復旧、backup自体は継続。**別のPHP対策事案**なのでCloud Backupの復旧に合算しない。
- 推奨DB区分: `confirmed-disruption` / status `restoration-awaiting-validation` / victim_count `null`。

### Tailscale — official minimum fixed release now documented

- [公式Security Bulletins](https://tailscale.com/security-bulletins)には10月26日付TS-2026-014〜017が現れ、最低修正版 **1.104.4** を明記。SSH Unix socket転送のroot権限、SSH sessionメモリDoS、Serve Unix socket backend、Serve HTTP/2 capability混線が対象。SSH転送無効化は `TS_SSH_DISABLE_FORWARDING=1` とdaemon再起動。
- [公式GitHub v1.104.4](https://github.com/tailscale/tailscale/releases/tag/v1.104.4) は `2704763` を指すtagとして表示され、UIのtag時刻は **27 Oct 23:01**。ページだけでは秒・timezoneを確定できず、APIの `published_at` を別取得するのが望ましい。
- [公式changelog](https://tailscale.com/changelog) は取得時点ではclient最新の本文が1.104.2のまま。複数一次資料の更新タイミングに差がある。1.104.2はeMudhra CA対処であり上記修正ではない。
- 実際の野外悪用、被害組織数、現実の停止件数は上記bulletinに記載なし。認証・許可済みSSH session等の条件がある。匿名インターネットから任意の全端末を乗っ取れると説明しない。
- [研究者Tailworm報告](https://tailworm.com/) の10月27日追記はmainに修正済み・番号release未提供という当時の記述。headscale、experimental connector等まで1.104.4で全11項目修正と拡張しない。最低修正版の新しい公式確認を特定4bulletinに限定して載せる。
- 推奨DB区分: `vulnerability-confirmed` / observed_exploitation `unknown` / minimum_fixed `1.104.4`（列挙4件のみ）。

### Fireblocks mpc-lib CVE-2026-90975 — revised assessment, still no fix

- [CERT VU#701544](https://kb.cert.org/vuls/id/701544): 原公開10月26日、本文最終改訂 **10月27日14:45 UTC**。descendant signer shareとchain codeを得た攻撃者が同じMPC partyのancestor/root shareに到達し得る。MPC thresholdは残るので単独で送金可能な完全private keyが得られるとはされていない。vendor fix未提供、chain codeを秘密扱いし階層全体を調査。
- 実際の資産盗難、損害額、被害顧客数はこの資料に記載なし。0件ではなく未確認・未公表。vendor responseもUnknown。
- [Fireblocks eMudhra対策](https://www.fireblocks.com/blog/emudhra-certificate-compromise) は10月21日公開の**別事案**。Agent for Key Link **2.4.4**、legacy Python SDK **2.19.1** が指定される。これらをmpc-libの修正版として転用しない。非browser clientへの実悪用はpublicly knownではないとの記述。

### Fortinet FIPS — newly available branches, build mismatch requires care

- [Fortinet公式Community技術記事10月27日](https://community.fortinet.com/fortigate-3/frontier-ai-assisted-firmware-updates-for-fips-enabled-fortigates-october-2026-230877) はFIPS向けhardening firmwareが利用可能と説明。7.4は **FIPS-CC-74-15 (b9481)**。7.2は本文 **FIPS-CC-72-8 (b9883)** に対して同本文download pathが **b9893-FIPS-CC-72-8** と異なるため、7.2のbuildを確定して自動適用の推奨に使わない。ReadMeとsupport downloadで照合する。
- 同記事は7.0 FIPS延長supportも終了し、今回hardening releaseの計画なしと説明する。
- [10月21日公式hardening announcement](https://www.fortinet.com/blog/ciso-collective/fortinet-releases-security-hardening-release-for-multiple-products): GA版FortiOS最低8.0.2 / 7.6.8 / 7.4.13 / 7.2.14を列挙。インターネット公開機器を優先。個別PSIRTは11月10日公開予定という当時の説明。実被害数や今回の全欠陥の野外悪用を裏付ける文書ではない。
- [FG-IR-26-181](https://fortiguard.fortinet.com/psirt/FG-IR-26-181)は今回web取得も403。前回CVE-2026-106174の最低修正版未照合を、この別hardening表だけで解消したとは記録しない。

## Continuing confirmed real-world impacts

### LiteLLM October supply-chain compromise

- [公式incident](https://docs.litellm.ai/blog/security-incident-oct-21-2026): 10月21日公開、20:30 UTC更新。悪性 **1.107.0** とcontainerの実配布を確認。PyPI対象窓11:39–13:23 UTC、container11:46–14:20 UTC。同時点の暫定pinは **1.106.2**。実行環境を再構築し到達可能な鍵を失効・交換する。単純なpip更新を先に行うとstartup hookを再実行し得る。
- [10月23日canonical attack-chain report](https://docs.litellm.ai/blog/security-incident-oct-21-2026-attack-chain): 5月27日に公開されたmaster keyが失効されず、10月10日にGitHub owner token等の奪取、release pipeline操作へつながったというvendor調査。初日の一部仮説よりこの後日分析を優先する。
- 実配布とpublisher侵害は確認。利用者全体の被害組織数、総盗難額、全利用者の鍵流出は未公表。March 1.82.7/1.82.8事案の2500社等の数字をOctober事案へ転記しない。

### Railway — business interruption and subset secrets decrypted

- [10月22日公式preliminary report（10月26日追記あり）](https://blog.railway.com/p/preliminary-report-october-security-incident): 攻撃期間のvendor推定10月20日13:58〜22日03:32 UTC。build/deploy停止とdashboard/API/CLI/support障害、内部侵入、一部環境変数の復号を認める。最大 **1.85% / 約100,000 workspaces** は「some environment variables potentially compromised」の上限表現。被害確定顧客数やユーザー数に読み替えない。
- 稼働中の既存workloadはオンラインを維持、全tierのbuildは22日に復旧。26日追記は既存500万users向けservice復旧と新規signup停止を区別。広範囲の予防的API鍵失効も発生し、失効通知だけではその鍵の窃取を証明しない。
- 10月21日以前のsensitive variablesを失効・再発行し、GitHub/registry監査、DB公開制限を推奨。[公式10月23日changelog](https://railway.com/changelog/2026-10-23-october-21-security-incident)も同措置。
- この資料はfinal forensic reportではない。ソースコードアクセスは排除されていないが確定していない。損害額未公表。

## Publication safeguards

- 「確認済み停止・不正アクセス」「脆弱性により可能な影響」「影響範囲未確認」を別フィールドにする。CVSSを現実世界の被害点数として使わない。
- 件数は資料の単位を保持（workspace、user、organization、certificateを混同しない）。不明値はnull。0を推定しない。
- 基準時刻以後の本文を取得したので、文書の最終改訂が基準前の範囲のみを採用。bulletin日付とGit tag日付にずれがある場合は双方を残す。
- 取得不可URL: Fortinet PSIRT FG-IR-26-181 HTTP403。完全scan／新規0件という結論には使わない。
