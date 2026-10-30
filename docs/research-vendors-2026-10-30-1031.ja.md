# ベンダー続報 — 2026-10-30 10:31:35 UTC

[English](research-vendors-2026-10-30-1031.md) / 日本語

前回基準は2026-10-29T05:01:25Z、今回基準は2026-10-30T10:31:35Z（19:31:35 JST）。前回のimpact-registerとincident-registerを`data/20261029T050117Z-dbf8f2`で確認した。最初の取得は基準後の10:33〜10:34 UTC。新しい動向として採用するのは基準以前の日付・時刻が明示された公表である。動的ページは取得時の本文を示し、基準時点の厳密な保存画面ではない。この個別調査作業では台帳・翻訳を直接変更せず、以下の変更を親作業へ提案した。

証拠manifestは`data/2026-10-30-1031/vendor-followup-fetch.json`。最初の9件と追加3件、計12件のHTTP200本文、mtime=0のgzip、実保存bytesのSHA-256、URLと取得日時を保持する。同じディレクトリには他の調査原本もあるが、このmanifestで対象を特定できる。

## GMO：個別連絡を開始、情報提供数が増加。復旧完了は未確認

[10月30日15:30 JSTの顧客向け公式案内](https://group.gmo/info/alert/20261030/)は、お見舞金の受取手続きと代替サービスについて契約者への直接連絡を開始したと公表した。「案内予定」から「連絡開始」への変化であり、全件支払済み・代替提供完了・元のサービス復旧を確定しない。原本は`gmo-customer30.html.gz`。

[第16報](https://group.gmo/info/alert/2026102902/)は初出10月29日20:50 JST。同ページの10月30日18:00 JST更新で情報提供が累計428件、前日321件から107件増加したと記載する。情報提供数であり、被害顧客・逮捕・回収情報・損害額ではない。原本は`gmo-notice16.html.gz`。[公式index](https://group.gmo/info/alert/)は両案内へリンクする。[第15報](https://group.gmo/info/alert/20261029/)の当局への情報提出予定は過去の文脈で、続報も逮捕や犯人特定を確定しない。

impactの`gmo-real-impact`では、10月21日からの停止、顧客情報の持出し確認、10月28日04:00頃の犯人サイトdomain停止という確認事項を保持し、第16報の累計428件を追加する。responseは10月30日15:30の直接連絡開始へ更新し、開始を支払・全顧客復旧完了と区別する。unknownと`recovery_state: not-established`を維持し、両新規出典を追加。source_dateは2026-10-30、monitoring_statusはupdated、checked_atは今回基準。損害総額は確定しない。

incidentの`gmo-domain-stop`は「お見舞金・代替サービスの個別連絡開始、情報提供428件」へ更新し、被害者・逮捕件数や支払・復旧完了ではないと明示する。公式連絡から手続き・代替環境・補償条件を確認し、犯人サイト・流出物へアクセスせず、便乗した認証情報や手数料要求に応じない。date=2026-10-30、time=10/30 15:30・18:00 JST、kind=delta、monitoring_status=updatedとする。

## Railway：新しいstatusでも新規登録停止が継続

[公式status](https://status.railway.com/)の最新の明示された事件更新は10月29日15:45 UTCで今回窓内。新規登録停止、再開日未定、既存顧客の信頼性確保を優先し、次回更新を10月30日16:00 UTCに予定する。10月28日15:27 UTC更新も掲載。原本は`railway-status.html.gz`。[一次報告](https://blog.railway.com/p/preliminary-report-october-security-incident)は当初停止・その後の復旧・環境変数の潜在影響を区別し、最大1.85%・約100,000workspacesは人数ではない。原本は`railway-preliminary.html.gz`。live componentの表示だけで全体復旧を推定しない。

前回本文の「次回10月28日16:00 UTC予定が10月29日の基準より後」という記述は時系列が誤っていたため置換する。impactの`railway-real-impact`はbuild/deploy・dashboard/API/CLI/support停止の履歴を保持し、10月29日15:45 UTCでも新規登録停止、再開日未定へ更新する。secretは発行元で失効・再発行しGitHubやregistryを監査する。次回10月30日16:00 UTC予定は今回基準より後。source_date=2026-10-29、unknownとrecovery_stateは保持する。再開実績を示す更新ではない。

incidentの`railway-signups`も同じstatusを反映し、潜在影響の約100,000workspaces・最大1.85%を確定漏えい人数としない。timeは10/30 00:45 JST、表示dateはJSTの2026-10-30、出典公表のUTC日付は10月29日。新しい日付のstatusによるdeltaとして扱うが、実質的な復旧進展は確定しない。

## Studio：新しい資料日付を確認できず

[公式portal](https://studio.design/ja/security/notice/2026-10-incident)は最新更新10月28日00:30のまま。個人情報保護委員会への連名報告受付は11月上旬開始予定で、外部取得可能状態と実取得未確認を区別し、個別通知も別対応とする。原本は`studio-incident.html.gz`。前回資料日付・response・unknownを保持し、確認日時のみ更新、incidentのmonitoring_statusはrechecked-no-material-update。受付開始や漏えい人数確定の根拠はない。

## @link：新しい資料日付を確認できず

[運営状況](https://at-link.net/information/アットリンクへの不正アクセスおよびサービスの/)は最終更新10月28日12:30 JSTのまま。一部β利用はapp・Web予約・外部連携の一般再開とは別。[10月23日の調査案内](https://at-link.net/information/アットリンクへの不正アクセスに関する調査状況/)はDB不正取得と個人情報漏えいを確認し、対象数は調査中。原本は`atlink-operation.html.gz`、`atlink-investigation.html.gz`。既存事実・資料日付・復旧未確定を保持し、確認日時のみ更新する。HTTP200や別サイトの稼働だけで予約復旧を推定しない。

## KEV追加に関するベンダー確認：3原本を追加

[GitLab critical patch案内](https://docs.gitlab.com/releases/patches/patch-release-gitlab-19-4-2-released/)はCVE-2026-97229をCI/CDの細工正規表現による未認証RCE、CVSS10.0とする。CE/EEの対象は19.2系列の19.2.8未満、19.3系列の19.3.5未満、19.4系列の19.4.2未満。修正版は**19.2.8／19.3.5／19.4.2**。GitLab.comは適用済み、Dedicated tenantは内部適用。19.3.4を修正目標にせず19.3.5を確認する。原本は`gitlab-patch-19-4-2.html.gz`。

[Ruby一次案内](https://www.ruby-lang.org/en/news/2026/10/23/regexp-fixes-for-gitlab-cves)はGitLabのCVEとRuby側の割当を区別する。CVE-2026-93577とCVE-2026-97229で共有するcompiled-pattern integer overflowの初修正は**Ruby4.0.8／3.4.12／3.3.13**。列挙された全問題を含む推奨は**4.0.9／3.4.12／3.3.13以降**。信頼できないpatternのcompileが条件で、開発者作成の固定patternだけなら対象外。Regexp.timeoutやpattern長制限はcompileの問題を確実には防がない。GitLab同梱Rubyのbackportがあるため、Ruby版だけでGitLab固有修正版を置換しない。原本は`ruby-regexp-gitlab.html.gz`。

[Cisco一次勧告](https://sec.cloudapps.cisco.com/security/center/content/CiscoSecurityAdvisory/cisco-sa-asaftd-tunnel-dos-s6mgkb75)はCVE-2026-76418、CVSS8.6。対象tunnel groupにsecondary authenticationを設定したSSL VPNで、未認証の遠隔requestによりreload／DoSが起きる。VPN login成功は不要。PSIRTは2026年10月の実悪用を確認する。DoSの勧告であり、コード実行・情報窃取を確定しない。完全なworkaroundはなく、secondary authentication設定緩和はsecurity低下を伴うため評価が必要で更新を強く推奨する。group-list表示無効でもDefaultWEBVPNGroupを確認する。原本は`cisco-asa-tunnel.html.gz`。

実HTML表で確認したCiscoの最低修正版：

| 製品系列 | 最低修正版 |
| --- | --- |
| ASA9.16以前 | 9.16.4.104 |
| ASA9.18 | 9.18.4.96 |
| ASA9.20 | 9.20.4.50 |
| ASA9.22 | 9.22.3.200 |
| ASA9.23 | 9.23.1.48 |
| ASA9.24 | 9.24.1.27；9.24.10.1（同じvendor cellに両方記載） |
| FTD7.0以前 | 7.0.11 |
| FTD7.2 | 7.2.13 |
| FTD7.4 | 7.4.9 |
| FTD7.6 | 7.6.7 |
| FTD7.7 | 7.7.14 |
| FTD10.0 | 10.0.3 |
| FTD10.1 | 10.1.1 |

簡潔な対処文の提案：「GitLab CE/EEは19.2.8／19.3.5／19.4.2以降へ更新。Cisco ASA/FTDはSSL VPN・secondary authentication・既定トンネルグループの構成を確認し、系列別の修正版へ更新する。Ciscoは実悪用を確認しているが、本件の確認影響は再起動によるDoSである。」

追加3件は全て10:35:44 UTCにHTTP200で取得した。manifestは計12原本。公表日・取得日時・KEV追加日は別の時刻として扱う。
