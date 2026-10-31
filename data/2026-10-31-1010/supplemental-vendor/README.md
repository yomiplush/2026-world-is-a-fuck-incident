# Supplemental vendor research

Evidence acquisition started at 2026-10-31T01:02:48Z. Exact retrieval timestamps, original URLs, HTTP results and SHA-256 digests are in `manifest.json`. HTML files are actual fetched response bodies. Derived `.txt` files use BeautifulSoup text extraction. No register was edited.

## Ivanti: verified update and limits

CISA official KEV mirror: https://raw.githubusercontent.com/cisagov/kev-data/develop/known_exploited_vulnerabilities.json (collected by main collector). Version 2026.10.30 was released 2026-10-30T17:02:45.3665Z, after the prior cutoff. Newly added: CVE-2026-111357 (local authenticated privilege escalation, due 2026-11-02, forensicTriage Yes) and CVE-2026-118527 (remote authenticated predictable-location file upload, due 2026-11-13, forensicTriage No). Each CISA entry references a chain with the other two CVEs, including CVE-2026-104935. Ransomware use Unknown.

Ivanti advisory response is HTTP 200 but is a Salesforce JavaScript application shell. Neither CVE nor its fix table appears in its retrieved text. Treat it as an access limitation, not verified vendor-body evidence. Web retrieval separately returned HTTP 403. Do not use third-party writeups as proof of the exact vendor version table.

Primary government source: https://www.cyber.gc.ca/en/alerts-advisories/ivanti-security-advisory-av26-1035 is updated October 30 and explicitly confirms both new KEV additions. Its combined Connect Secure advisory lists versions before 25.1.1.3, 25.1.3.1 and 22.8R2.6. This is not a per-CVE matrix; avoid asserting that every branch is affected by each new CVE individually.

Primary investigator: https://www.volexity.com/blog/2026/10/13/a-series-of-unauthenticated-events-chained-exploitation-of-ivanti-connect-secure-zero-days/ has an opening update stating that Ivanti published a fix for the privilege escalation on October 29, now CVE-2026-111357. It explicitly leaves the rest of the original text unchanged, including now-stale future-patch wording. Its investigation says the observed chain achieved unauthenticated root access on a then-current 22.8R2.4 appliance. Memory-only changes and restored configuration mean its disk integrity checker alone cannot establish absence of compromise. Volexity does not map CVE-2026-118527 to a specific chain step in the updated text; do not invent that mapping.

### Suggested concise Japanese update

10月30日、CISAがIvanti Connect SecureのCVE-2026-111357とCVE-2026-118527をKEVへ追加。前者はローカル認証済み攻撃者の権限昇格、後者はリモート認証済み攻撃者による予測可能な場所へのファイル配置で、CVE-2026-104935との連鎖が記載されています。前者は米連邦機関向け期限11月2日・フォレンジック調査対象、後者は11月13日です。Volexityは権限昇格の修正公開を10月29日と追記しました。ベンダーの最新案内で稼働系列の修正版を確認し、侵害疑いではディスク整合性検査だけで判断せず調査してください。

### Suggested concise English update

On October 30, CISA added Ivanti Connect Secure CVE-2026-111357 and CVE-2026-118527 to KEV. These cover local authenticated privilege escalation and remote authenticated file placement at a predictable location; CISA links both with CVE-2026-104935. The federal deadlines are November 2, with forensic triage, and November 13 respectively. Volexity's update dates the privilege-escalation patch to October 29. Confirm the fixed build for the deployed branch in Ivanti's current guidance; a clean disk integrity check alone does not establish absence of compromise.

## Railway: no material new publication established

Actual report body saved. Its latest continuous-update heading remains Monday October 26. Web-rendered status https://status.railway.com/ on October 31 still shows October 29, 15:45 UTC as latest: new signups paused, reopening date unavailable. It promises an October 30 update, but a scheduled update is not evidence that one was published. The direct status fetch returned 403. Retain existing incident dates and mark checked/no new material; do not promote a promised reopening from the older blog over the newer status wording.

JA: 10月31日の再確認でも、取得できた最新statusは10月29日15:45 UTC。新規登録停止が続き、再開日は未定。予定されていた10月30日更新の公開は確認できませんでした。

EN: Rechecked October 31; the latest retrieved status remains October 29 at 15:45 UTC. New signups remain paused without a reopening date. Publication of the scheduled October 30 update was not verified.

## GMO: no material new publication established

Actual alert index and notice 16 saved. Index latest notice is October 30 customer guidance, already included in the prior register. Notice 16 still shows 428 tips as of October 30, 18:00 JST (09:00Z), before cutoff. No October 31 notice or later count was observed. The page says counts update weekdays excluding holidays; do not infer service recovery or victim counts from tip totals.

JA: 重要なお知らせ一覧と第16報を再確認。最新の累計428件（10月30日18:00 JST）は前回反映済みで、以後の新しい公表は確認できませんでした。

EN: Rechecked the alert index and notice 16. The latest cumulative count remains 428 tips at 18:00 JST on October 30, already reflected in the prior update; no later publication was verified.
