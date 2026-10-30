# Vendor followup — 2026-10-30 10:31:35 UTC

English / [日本語](research-vendors-2026-10-30-1031.ja.md)

Comparison: prior cutoff 2026-10-29T05:01:25Z; current cutoff 2026-10-30T10:31:35Z (19:31:35 JST). Reviewed prior impact-register and incident-register in `data/20261029T050117Z-dbf8f2`. Retrieval occurred after cutoff, at 10:33–10:34 UTC; only explicitly dated publications before cutoff are used as new developments. Dynamic pages establish the fetched content, not an archived exact cutoff rendering. No registers or translations were edited by this research task.

Evidence: `data/2026-10-30-1031/vendor-followup-fetch.json` records nine HTTP 200 bodies, deterministic gzip mtime 0, stored-file SHA-256, URL and retrieval timestamp. Hashes refer to compressed bytes. Other agents may save additional files in this same directory; this manifest identifies this task’s captures.

## GMO: direct contact began; tips rose, no established recovery

[Official customer notice, October 30 15:30 JST](https://group.gmo/info/alert/20261030/) says the company began contacting contracted customers directly about receipt procedures for condolence payments and alternative services. This changes the earlier “will offer” response to “contact started”. It does not establish all payments made, all alternatives delivered, or original service recovery. Capture: `gmo-customer30.html.gz`.

[Notice 16](https://group.gmo/info/alert/2026102902/), initially dated October 29 20:50 JST, contains an explicitly dated October 30 18:00 JST update: cumulative 428 information submissions, +107 from October 29’s 321. These are tip submissions, not affected customers, arrests, recovered records or loss totals. Capture: `gmo-notice16.html.gz`. [Official index](https://group.gmo/info/alert/) links both new notices. [Notice 15](https://group.gmo/info/alert/20261029/) remains historical context and describes planned submission of information to authorities; neither newer notice proves arrest or offender identification.

Proposed impact `gmo-real-impact` corrections:

- `confirmed`: 「10月21日からサービス停止。顧客情報の外部持出しを確認。10月28日04:00頃に犯人サイトのドメイン停止を確認。第16報の10月30日18:00時点で情報提供は累計428件。」
- `response`: 「10月30日15:30、お見舞金の受取手続きと代替サービスについて契約者への直接連絡を開始したと公表。連絡開始は支払完了や全顧客の復旧完了を意味しない。」
- Preserve `unknown` and `recovery_state: not-established`; add October 30 notice and notice16 source; `source_date: 2026-10-30`, `monitoring_status: updated`, checked_at current cutoff. Do not claim aggregate loss.

Proposed incident `gmo-domain-stop` replacement:

- title: 「GMO：お見舞金・代替サービスの個別連絡開始、情報提供428件」
- body: 「10月30日15:30、お見舞金の受取手続きと代替サービスについて契約者への直接連絡を開始したと公表。第16報の同日18:00時点で情報提供は累計428件。これは被害者数や逮捕件数ではなく、支払完了・サービス復旧も未確認。」
- action: 「公式の個別連絡で手続き・代替環境・補償条件を確認する。犯人サイトや流出物へアクセスせず、便乗した認証情報・手数料要求に応じない。」
- date 2026-10-30; time 「10/30 15:30・18:00 JST」; kind delta; monitoring_status updated; sources October30 customer notice and notice16.

## Railway: refreshed status confirms continuing signup pause

[Railway status](https://status.railway.com/) latest explicit incident update is October 29 15:45 UTC, within this delta. It says signups remain paused, no reopening date exists, existing-customer reliability remains priority, and next update is due October 30 16:00 UTC. October 28 15:27 UTC is also present. Capture `railway-status.html.gz`. [Preliminary report](https://blog.railway.com/p/preliminary-report-october-security-incident) retains the distinction between incident interruptions, later restoration, and potential exposure of environment variables affecting at most 1.85% (about 100,000 workspaces); this is not a person count. Capture `railway-preliminary.html.gz`. No confirmed full recovery inferred from live component availability indicators.

The prior text’s assertion that the scheduled October 28 16:00 UTC update was after the prior October29 cutoff is chronologically wrong. Replace the stale schedule explicitly.

Proposed impact `railway-real-impact` corrections:

- `confirmed`: 「build/deploy中断とdashboard/API/CLI/supportの利用不能期間があった。10月29日15:45 UTCのstatusでも新規登録停止が継続し、再開日は未定。既存顧客の信頼性確保を優先すると説明。」
- `response`: 「保存secretを発行元で失効・再発行しGitHubやregistry監査を実施。次回status予定は10月30日16:00 UTCで、今回基準より後。」
- source_date 2026-10-29; preserve unknown and recovery_state not-established. This is a dated status update confirming continued state, not restored signup.

Proposed incident `railway-signups` corrections:

- title: 「Railway：10月29日更新も新規登録停止、再開日未定」
- body: 「10月29日15:45 UTCのstatus更新でも新規登録停止が継続し、再開日は未定。既存顧客の信頼性確保を優先すると説明。約100,000workspaces・最大1.85%は環境変数の潜在影響範囲で、確定漏えい人数ではない。」
- action: 「旧secretを発行元で失効・再発行し監査する。次回10月30日16:00 UTCの予定を、今回基準時点の復旧実績として扱わない。」
- time 「10/30 00:45 JST status」; date 2026-10-30 (JST display convention); source publication UTC date remains10/29. kind delta is reasonable for newly dated update, but explicitly state no material recovery change; preserve source links.

## Studio: no newly dated change established

[Official incident portal](https://studio.design/ja/security/notice/2026-10-incident) still displays latest update October28 00:30 and early-November planned start for joint reporting to the Personal Information Protection Commission. It still distinguishes externally obtainable data from actual retrieval, which remains unconfirmed, and states individual notification is separate from joint reporting. Capture `studio-incident.html.gz`. Retain prior source date, response and unknown; update checked_at / editorial-review timestamp only, monitoring_status rechecked-no-material-update for incident. No basis for claiming report受付 started or actual leakage counts established.

## @link: no newly dated change established

[Official operations notice](https://at-link.net/information/アットリンクへの不正アクセスおよびサービスの/) still labels its last update October28 12:30 JST. Limited beta use is distinct from generally resumed app/Web reservations and external integrations. [October23 investigation notice](https://at-link.net/information/アットリンクへの不正アクセスに関する調査状況/) still confirms unauthorized database acquisition and personal-information leakage, while affected counts remain under investigation. Captures `atlink-operation.html.gz`, `atlink-investigation.html.gz`. Retain existing facts/source dates and not-established recovery; update check/review timestamps only. Do not infer restored booking from HTTP200 or unrelated site availability.

## Additional KEV vendor followup (three captures appended)

[GitLab critical patch announcement](https://docs.gitlab.com/releases/patches/patch-release-gitlab-19-4-2-released/) explicitly identifies CVE-2026-97229 as unauthenticated remote code execution through crafted CI/CD regular expressions, CVSS 10.0. Affected CE/EE branches are 19.2 before19.2.8, 19.3 before19.3.5, and19.4 before19.4.2. Fixed releases: **19.2.8 / 19.3.5 / 19.4.2**; GitLab.com already patched, Dedicated tenants patched internally. Do not use19.3.4 as the patch target: the announcement explicitly directs19.3.5. Capture `gitlab-patch-19-4-2.html.gz`.

[Ruby primary notice](https://www.ruby-lang.org/en/news/2026/10/23/regexp-fixes-for-gitlab-cves) distinguishes the GitLab CVEs from upstream Ruby assignments. The underlying compiled-pattern integer overflow shared by CVE-2026-93577 and CVE-2026-97229 is first fixed in **Ruby4.0.8 / 3.4.12 / 3.3.13**. Ruby recommends **4.0.9 / 3.4.12 / 3.3.13 or later**, covering all listed bugs. Untrusted pattern compilation is the condition; developer-authored static patterns alone are unaffected. Regexp.timeout and pattern-length restrictions do not reliably prevent these compilation bugs. GitLab’s bundled Ruby backports mean upstream Ruby version alone must not replace GitLab’s product-specific fixed versions. Capture `ruby-regexp-gitlab.html.gz`.

[Cisco primary advisory](https://sec.cloudapps.cisco.com/security/center/content/CiscoSecurityAdvisory/cisco-sa-asaftd-tunnel-dos-s6mgkb75) identifies **CVE-2026-76418**, CVSS8.6, unauthenticated remote SSL-VPN requests causing device reload/DoS when secondary authentication is configured in applicable tunnel groups. Successful VPN login is unnecessary. PSIRT explicitly confirms awareness of active exploitation in October2026. This is a DoS finding; this advisory does not establish code execution or data theft. No complete workaround; mitigating secondary authentication configuration can reduce security and must be evaluated; upgrade is strongly recommended. DefaultWEBVPNGroup still requires inspection even if group-list display is disabled. Capture `cisco-asa-tunnel.html.gz`.

Verified Cisco first-fixed releases, transcribed from the actual HTML table:

| Product branch | First fixed |
| --- | --- |
| ASA9.16 and earlier |9.16.4.104|
| ASA9.18 |9.18.4.96|
| ASA9.20 |9.20.4.50|
| ASA9.22 |9.22.3.200|
| ASA9.23 |9.23.1.48|
| ASA9.24 |9.24.1.27;9.24.10.1 (both listed in same vendor cell)|
| FTD7.0 and earlier |7.0.11|
| FTD7.2 |7.2.13|
| FTD7.4 |7.4.9|
| FTD7.6 |7.6.7|
| FTD7.7 |7.7.14|
| FTD10.0 |10.0.3|
| FTD10.1 |10.1.1|

Suggested concise Japanese action: 「GitLab CE/EEは19.2.8／19.3.5／19.4.2以降へ更新。Cisco ASA/FTDはSSL VPN・secondary authentication・既定トンネルグループの構成を確認し、系列別の修正版へ更新する。Ciscoは実悪用を確認しているが、本件の確認影響は再起動によるDoSである。」

All three additional responses were HTTP200 at10:35:44UTC. The vendor manifest now contains12 captures; historical publication dates are distinct from this retrieval time and the new KEV inclusion date.
