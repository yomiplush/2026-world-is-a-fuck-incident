# Snapshot — 2026-10-22 21:20 JST (12:20 UTC)

[English](16-snapshot-2120jst.md) | [**日本語**](16-snapshot-2120jst.ja.md)

A second read of the same day, taken because the first one was at 09:25 JST. Nothing dramatic
changed; four things did, and one of them corrects a number this repository published this
morning. This is what "as of 21:20 JST" means, with the commands to reproduce it.

```bash
tools/intel/fetch-intel --date 2026-10-22-2120jst --cpu Oct2026 --month 2026-Oct
# → data/2026-10-22-2120jst/  (kept beside the 09:25 JST snapshot in data/2026-10-22/)
```

## 1. What changed since the 09:25 JST snapshot

| Source | 09:25 JST | 21:20 JST | Meaning |
|---|---|---|---|
| CISA KEV | catalog `2026.10.21`, 37 entries in the 30-day window | **unchanged** | no new known-exploited CVE today |
| MSRC CVRF `2026-Oct` | 2,575 entries (2,574 CVE) | **2,578 (2,577 CVE)** | the document was re-issued, +3 CVEs |
| NVD CRITICAL sweep (14 days) | 120 | **124** | four newly published CRITICALs (below) |
| JVN advisory feed | 20 items | **unchanged** | no new JVN item today |
| JPCERT/CC feed | — | **+1** | 注意喚起 for php2shell (CVE-2026-109618/109619) |
| LiteLLM incident write-up | updated 02:19Z | updated **09:42Z**, body identical | comments/edits only; the artefact list is stable |
| Oracle CPU / GitLab advisory / Plex CSAF | — | **byte-identical** | vendor documents have not been revised |

### 1.1 The MSRC number moved back — and that matters

This repository published **2,575** in [`docs/08`](08-intel-sources.md) and [`docs/13`](13-recent-criticals.md)
this morning, and `docs/05` had recorded **2,578** from the first read on 2026-10-13. Both were
right at the time. The CVRF has now been re-issued again with **2,578 entries (+3 CVEs:
`CVE-2026-113679`, `CVE-2026-113680`, `CVE-2026-53614`)**.

So a count taken from a re-issued document is a snapshot of a moving object. The lesson already in
[`docs/08` §5](08-intel-sources.md) is now demonstrated in the same day: **cite the retrieval time,
or the number will contradict itself.** The exploited count is still exactly one
(`CVE-2026-96951`).

## 2. The four CRITICALs published today

All four have no EPSS score yet, and **three of the four are old CVEs being published now**:

| CVE | CVSS | What | Note |
|---|--:|---|---|
| `CVE-2021-48014` | 9.8 | FineReport 9.0 path traversal in `/WebReport/ReportServer` | 2021 CVE, published 2026-10-22 |
| `CVE-2021-48016` | 9.8 | DedeCMS ≤ 5.8.1-beta PHP code injection in `ShowMsg()` | 2021 CVE |
| `CVE-2022-51022` | 9.1 | YiShaAdmin 2.2–3.1 unauthenticated path traversal | 2022 CVE |
| `CVE-2026-114220` | 9.1 | NT OneAPP (NewType Infortech) improper certificate validation | current CVE |

"Newly published" is not "newly vulnerable". Three of these have been exploitable for years and
only now got a record — the same pattern as the KEV additions on 2026-10-08 (`CVE-2015-5477`,
`CVE-2016-3081`), and the reason a feed sorted by publication date is a bad priority list.

None of them is in KEV, none has EPSS yet, and none is in this repository's scope. They are listed
so the count in §1 is not a mystery number.

## 3. Deadlines and open items, as of this snapshot

| Item | Status at 21:20 JST | What to do tonight |
|---|---|---|
| **Plex** `CVE-2026-96656` / `-96654` | KEV due **2026-10-23** (tomorrow); forensic triage required on 96656 | patch to ≥ 1.43.3.10861 — see below, a newer build exists |
| **Plex** current release | **1.43.5.11029** (the KEV fix was 1.43.3.10861) | patching to latest also clears the KEV requirement |
| **BeyondTrust** `CVE-2026-102764` | KEV due **2026-10-19** — already past | patch and preserve evidence (CISA marks triage required) |
| **php2shell** | no KEV entry; JPCERT published a Japanese advisory today | if PHP was internet-facing on 10-20/21, check for compromise |
| **GitLab** `CVE-2026-110264` | 19.5.1 is still the newest patch release | nothing newer to move to |
| **Apache Tomcat** | **11.0.27 / 10.1.61 / 9.0.123** are the newest releases | those *are* the fixed versions ([`docs/15`](15-apache-oct2026.md)) |
| **httpd** | 2.4.69 is current | — |
| **Oracle Java** | 21.0.13 / 17.0.21 / 11.0.33 / 8u511 / 25.0.5 / 27.0.1 are still newest (no 21.0.14) | — |
| **Node.js** | 26.12.1 / 24.22.1 / 22.23.4 are still newest | — |
| **PHP** | 8.5.12 / 8.4.27 / 8.3.36 / 8.2.35 are still newest | — |

Two conclusions worth stating plainly:

1. **Plex's KEV deadline is tomorrow and the fixed version is already two releases old.** The
   practical instruction is "update to 1.43.5.11029", not "update to the version in the KEV note".
2. **Nothing shipped a new patch today.** For every product in this repository, the version this
   morning is still the newest — so today's work is applying them, not waiting for a better one.

## 4. What did not change (and is therefore still true)

- **KEV has no Java, PHP, GitLab, Apache, Railway, LiteLLM or Tailscale entries** for these events.
- **JVN is quiet today** after 20 items yesterday; JPCERT's only addition is the PHP advisory.
- **The Plex CSAF advisory (VA-26-266-01) and the GitLab patch-release page are byte-identical**
  to this morning, so all version arithmetic in [`docs/09`](09-gitlab-19-5-1.md) and
  [`docs/12`](12-plex-oct2026.md) still holds.
- **Oracle's Java SE risk matrix has not been revised**; the 55 CVEs and the
  affected-vs-fixed mapping are unchanged.

## 5. How to re-check this yourself in one minute

```bash
# 1) has KEV moved? (compare catalogVersion + count)
curl -s https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json \
  | jq -r '.catalogVersion, .count'

# 2) has any vendor shipped a newer build? (Plex example)
curl -s https://plex.tv/api/downloads/1.json | grep -o '"version":"[0-9.]*-[0-9a-f]*"' | head -3

# 3) what did the sweep add since the last snapshot?
tools/intel/fetch-intel --sources nvd-critical --out /tmp/now
# then diff /tmp/now/nvd-critical-14d.json against data/2026-10-22-2120jst/
```

## 6. Sources

- Everything in §1–§2 is from [`data/2026-10-22-2120jst/`](../data/2026-10-22-2120jst/), collected
  by `tools/intel/fetch-intel` at 2026-10-22 12:22 UTC.
- KEV: <https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json>
- MSRC CVRF (re-issued): <https://api.msrc.microsoft.com/cvrf/v3.0/cvrf/2026-Oct>
- NVD CRITICAL sweep: <https://services.nvd.nist.gov/rest/json/cves/2.0?cvssV3Severity=CRITICAL>
- JVN / JPCERT: <https://jvn.jp/rss/jvn.rdf>, <https://www.jpcert.or.jp/rss/jpcert.rdf>
- Plex release index: <https://plex.tv/api/downloads/1.json>
- Version checks: <https://tomcat.apache.org/whichversion.html>, <https://httpd.apache.org/>,
  <https://nodejs.org/dist/index.json>, <https://www.php.net/releases/index.php?json&version=8.5>,
  Oracle release-note URLs (21.0.14 → 404 as of this snapshot)
