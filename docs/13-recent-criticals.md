# Two weeks of CRITICALs — 120 CVEs, one actually exploited

[English](13-recent-criticals.md) | [**日本語**](13-recent-criticals.ja.md)

> **Re-read 2026-10-23 07:25 JST.** The same query, run ten hours later, returns **125** — eleven
> rows in, ten out — because NVD rescored one of the two PHP CVEs and because the severity filter
> ignores CNA-only scores. Re-deriving the numbers also exposed an extraction bug in the collector
> that had been recording the CNA's score instead of NVD's. §2 below is kept as the 2026-10-22
> reading; **§9** has what changed and why, including the corrected ≥ 9.8 count.

"Are there other serious ones?" is the right question and the wrong shape. A two-week sweep of
NVD returns **120 CVEs scored CRITICAL**, and if you read them in order you will spend a day on
routers you do not own and learn nothing about the one that is being exploited.

So this document is a sweep *plus* the filter: what the data says, what survived, and four traps
in the data that will mislead you if you take the numbers at face value.

## 1. Method

```bash
tools/intel/fetch-intel --sources nvd-critical      # NVD API, cvssV3Severity=CRITICAL
tools/intel/fetch-intel --sources csaf,kev          # vendor CSAF + the exploited list
```

- **Window**: 2026-10-08 → 2026-10-22 (14 days), by NVD `published` date, not by CVE year.
  Republishing an old CVE counts as "published" — one row below is `CVE-2020-37282`.
- **Filter**: `cvssV3Severity=CRITICAL` (CVSS 3.1 ≥ 9.0). A separate query with
  `cvssV4Severity=CRITICAL` returned **0**, which says more about NVD's v4 coverage than about
  the vulnerabilities.
- **Enrichment**: KEV membership for each CVE, and EPSS for 109 of 120 (11 had no score yet).
- Machine-readable result:
  [`data/2026-10-22/nvd-critical-14d.json`](../data/2026-10-22/nvd-critical-14d.json).

## 2. The numbers, before any interpretation

| Measure | Value |
|---|--:|
| CRITICAL CVEs published in the window | **120** |
| …also in CISA KEV | **1** |
| …at exactly 10.0 | 11 |
| …at ≥ 9.8 | 48 |
| …whose NVD record maps a CPE vendor | 32 (27%) |
| …with an EPSS score | 109 |
| Highest EPSS anywhere in the window | **3.0%** |
| Oracle product families in the batch | 34 |
| Consumer routers / cameras / IoT (Tenda, TOTOLINK, D-Link, H3C, DrayTek, `boa`-based) | 38 |

**72 of 120 (60%) are Oracle or consumer IoT.** That is not a judgement about their quality; it
is a statement about who publishes in batches and who gets CVEs assigned by a scanning CNA. Your
estate is probably neither.

## 3. What actually survived the filter

These are the rows I would spend time on, in this order. Scores are CVSS 3.1 from NVD unless
noted; "why" is the reason it is here at all.

| Product | CVE | Score | Why it is on the list | Action |
|---|---|--:|---|---|
| **Plex Media Server** | 96651–96656 | 4.3–7.2 | **In KEV**, chainable to code execution, often internet-exposed ([`docs/12`](12-plex-oct2026.md)) | patch to 1.43.3.10861, rotate tokens |
| **Cisco Unified CM / Emergency Responder / Prime Collaboration Deployment** | `CVE-2026-76473`, `-76474`, `-76475` | 9.8, 9.8, 9.3 | call managers are internet-adjacent in many estates and have been exploited before; published 2026-10-21, so no KEV entry *yet* | check CUCM version against Cisco's advisory |
| **Cisco Snort 3** | `CVE-2026-20043` | 9.0 | IDS/IPS engine itself; an inspection bypass is a blind spot, not a host compromise | update Snort 3 |
| **Broadcom / Brocade Fabric OS** | `CVE-2026-87659`, `-87684` | 9.8 | a compromised switch can inject management traffic into the fabric — SAN management plane | update Fabric OS to ≥ 10.0.1 |
| **Progress MOVEit Transfer** | `CVE-2026-89068` | 8.1 *(CNA)* / 9.8 *(NVD)* | auth bypass in the LDAP module; MOVEit is a known mass-exploitation target | fixed in 2025.1.6 / 2026.0.4 |
| **JetBrains TeamCity** | `CVE-2026-111094` | 8.1 *(CNA)* / 9.8 *(NVD)* | RCE via a whitelist bypass in the build-messages protocol; CI servers hold deploy credentials | fixed in 2026.2 / 2026.1.4 / 2025.11.8 |
| **IBM DataStage on Cloud Pak for Data** | `CVE-2026-81212`, `-82101`, `-82110` | 10.0, 9.6, 9.6 | unauthenticated write into shared Redis under any tenant's key — a cross-tenant boundary break in a managed platform | apply IBM fix; verify tenant isolation assumptions |
| **Froxlor** | `CVE-2026-113678` | 9.9 | hosting panel: an authenticated customer takes ownership of arbitrary host directories via a root cron | upgrade to 2.3.15 |
| **FreeBSD (RACK stack)** | `CVE-2026-101307` | 9.1 | 16-bit allocation counter wrap in the kernel TCP stack → remote DoS/RCE surface | patch or disable RACK |
| **Node.js `undici`** | `CVE-2026-109383`, `-109829` | 7.4 | HTTP client used by a large share of Node tooling; fixed in 6.29.0+ / 7.30.0+ / 8.12.1+ | bump the dependency |
| **BeyondTrust Remote Support** | `CVE-2026-102764` | 9.8 | **in KEV since 2026-10-16, due date 2026-10-19** — already past | patch, then forensic triage (CISA marks it required) |
| **Dell Secure Connect Gateway Policy Manager** | `CVE-2026-76779` | 7.4 | management appliance holding credentials to many Dell devices | update |

Two entries carry an important asterisk: MOVEit and TeamCity show **two different CVSS 3.1
scores in the same NVD record** — the vendor's 8.1 (with `AC:H`) and NVD's 9.8 (with `AC:L`) —
see §5.1.

The IBM Guardium cluster (11 CVEs at 8.1) and DataPower (4 rows) are not in the table: they are
real, but they are "one vendor published a batch on one day", and the action is the same for all
of them (apply IBM's update). That is a scheduling task, not a triage task.

## 4. Already covered in this repository

Do not re-read these here; they have their own documents.

| Incident | Where | Score |
|---|---|---|
| PHP core RCE (php2shell) | [`01`](01-php2shell.md) | 9.2 (CVSS 4.0) / 9.8 (CVSS 3.1) |
| GitLab unauthenticated RCE | [`09`](09-gitlab-19-5-1.md) | 10.0 |
| LiteLLM supply-chain compromise | [`10`](10-litellm-1-107-0.md) | no CVSS — not that kind of incident |
| Plex Media Server | [`12`](12-plex-oct2026.md) | 4.3–7.2, in KEV |
| Oracle October CPU (non-Java) | [`05`](05-other-incidents.md) §2 | 10.0 × several, mostly authenticated |

## 5. Four traps in the data

### 5.1 The same CVE can have two CVSS scores, and the higher one is often wrong for you

MOVEit and TeamCity both show **8.1 from the CNA** and **9.8 from NVD** in one record. The
difference is one component:

```
8.1  CVSS:3.1/AV:N/AC:H/PR:N/UI:N/S:U/C:H/I:H/A:H    ← CNA (Progress / JetBrains)
9.8  CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H    ← NVD
```

`AC:H` means "an attacker needs conditions they do not control" — the vendor, who knows the
preconditions, says hard. `AC:L` says easy. If you triage on the maximum score, you are reading
someone else's assumption. **Quote the vector and its source, not just the number.**

### 5.2 CVSS 3.1 and 4.0 disagree by more than rounding

PHP is **9.8 in CVSS 3.1** and **9.2 in CVSS 4.0**. This repository uses 9.2 because PHP's own
advisory does. Both are correct; they are different scales with different assumptions about
attack complexity. A table that mixes them without labels is not comparable to anything.

### 5.3 EPSS is useless for CVEs that are days old

Highest EPSS in the entire window: **3.0%**. The one CVEs in KEV here:

| CVE | EPSS | KEV |
|---|--:|---|
| `CVE-2026-102764` (BeyondTrust) | 1.2% | in KEV, **deadline already passed** |
| `CVE-2026-96656` (Plex) | 0.76% | in KEV, due 2026-10-23 |

EPSS estimates the probability of exploitation *given evidence accumulated so far*; a CVE
published last week has almost none. For a same-week decision, **KEV presence and exposure beat
EPSS**, and "low EPSS" is not an argument to wait. Use EPSS on the 6–18 month tail, not on this
week's items.

### 5.4 Counts measure disclosure batching, not risk

- 34 of 120 are Oracle's quarterly CPU — one publication event.
- 38 are consumer IoT firmware, many from a single scanning-style CNA, all 9.8–10.0, most with
  no patch available to the owner.
- 18 are IBM, published as one batch.
- Only **32 of 120 (27%)** have an NVD CPE mapping, so anything that tries to attribute these by
  vendor using NVD alone gets a third of the picture.

If a weekly report tells you "critical vulnerabilities rose 40% this week", it is measuring press
releases.

## 6. The triage recipe this sweep supports

1. **Drop the rows you cannot run.** Oracle EBS, Fabric OS, DataStage: if it is not in your
   inventory, the row is finished. (This removes 60% of the 120.)
2. **For the rest, read the CNA vector, not the max score.** `AC:H` and `PR:H` change the
   priority; a 10.0 that needs an authenticated admin on an internal network is a maintenance
   item.
3. **Check KEV before you check EPSS.** KEV is a claim of observed exploitation with a deadline;
   EPSS is a probability with a lag.
4. **Ask "what does this hold?" rather than "how bad is it?"** A CI server (TeamCity) and a
   managed file transfer (MOVEit) hold credentials to everything; a media server (Plex) holds a
   token to your account. That question reorders the list faster than any score.
5. **Write down what you decided not to do, and why.** The next sweep will show the same CVE with
   a new number attached, and you will not remember the reasoning.

## 7. Reproduce

```bash
tools/intel/fetch-intel --sources nvd-critical               # 14-day CRITICAL sweep + KEV + EPSS
tools/intel/fetch-intel --sources nvd-critical --critical-days 7
tools/intel/fetch-intel --sources csaf                       # Plex CSAF VA-26-266-01
```

The NVD API without a key is rate-limited; the collector makes two requests (CVEs, then EPSS in
chunks) and tolerates a failed EPSS call by leaving `epss: null` rather than dropping the CVE.

## 8. Sources

- NVD API 2.0 (the sweep itself):
  <https://services.nvd.nist.gov/rest/json/cves/2.0?pubStartDate=2026-10-08T00:00:00.000&pubEndDate=2026-10-22T23:59:59.999&cvssV3Severity=CRITICAL>
- CISA KEV (the exploitation column):
  <https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json>
- EPSS (the probability column): <https://api.first.org/data/v1/epss>
- CISA CSAF library (vendor-neutral machine-readable advisories):
  <https://github.com/cisagov/CSAF/tree/develop/csaf_files/IT/white/2026>
- Per-vendor advisories for the §3 rows: Cisco, Broadcom, IBM, Progress, JetBrains, Froxlor,
  FreeBSD, Node.js/undici, Dell, BeyondTrust (each linked from its NVD record's references)

## 9. Re-read on 2026-10-23 07:25 JST — 125, and a bug in the reader

Same command, same window (2026-10-08 → 2026-10-22), ten hours later:
[`data/2026-10-23-0730jst/nvd-critical-14d.json`](../data/2026-10-23-0730jst/nvd-critical-14d.json).
Full write-up in [`docs/19`](19-snapshot-0730jst.md).

| | 2026-10-22 (this document) | 2026-10-23 07:25 JST |
|---|--:|---|
| CVEs returned | 120 | **125** |
| …at exactly 10.0 | 11 | **13** |
| …at ≥ 9.8 | 48 | **72** (same 125 rows read correctly — see §9.3) |
| …with an EPSS score | 109 | **114** |
| Highest EPSS in the window | 3.0% | **5.76%** (`CVE-2026-109619`) |
| In KEV | 1 | 1 |

### 9.1 A fifth trap: the severity filter counts only NVD's own assessment

`cvssV3Severity=CRITICAL` answers on the **Primary** metric. A record still `Awaiting Analysis`,
carrying only the CNA's Secondary score, is invisible to it:

```bash
curl -s 'https://services.nvd.nist.gov/rest/json/cves/2.0?cveId=CVE-2026-101809&cvssV3Severity=CRITICAL' | jq .totalResults
# → 0    (the record's only metric is secalert_us@oracle.com, Secondary, 10.0)
```

Nine of the ten rows that left between the two reads are in that state (`Awaiting Analysis`,
`Undergoing Analysis`, `Deferred`); the tenth is the rescore in §9.2. So "N CVEs scored CRITICAL" is a count of **analysed** records,
not of serious ones — the same class of mistake as §5.1, one layer down: not "which score do I
read" but "which scores does the query even see".

### 9.2 NVD rescored one of the two PHP CVEs

`CVE-2026-109619` went 9.8 → **8.1** at 2026-10-22 21:17Z, with `AC:L` → `AC:H`. `CVE-2026-109618`
stayed 9.8. PHP's own CVSS 4.0 (9.2 for both) is unchanged, and the fix is unchanged. The
operational consequence is narrow and worth knowing: a "≥ 9.0" triage filter now drops one of the
two CVEs in a single advisory. Patch by advisory, not by score.

### 9.3 The collector was reading the wrong metric

`collect_nvd_critical` took `metrics.cvssMetricV31[0]` as the score. NVD lists the CNA's metric
before its own on some records, and the two can sit in different severity bands — `CVE-2026-95695`
is Secondary 7.4 (IBM) **and** Primary 9.1 (NVD) at once, so a row selected by a CRITICAL filter
was being recorded as 7.4. The collector now prefers `type: Primary` and falls back otherwise.
On **the same 125 rows**: ≥ 9.8 goes from 53 to **72**; exactly 10.0 stays at 13.

That is a defect in the instrument, not a change in the world, and it is the reason this document
now reads §2 as a dated measurement. The old `data/` snapshots are kept as they were collected.

### 9.4 The window's top EPSS is now php2shell

`CVE-2026-109619` 5.76% (percentile 0.930) and `CVE-2026-109618` 5.31% (0.926), both dated
2026-10-22. §5.3 said the maximum was 3.0% and that EPSS is near-useless for week-old CVEs; the
first half of that is now out of date, the second half is not. 5.3% is still a low absolute number
— but it is the highest in the window, on a CVE with a public exploit, and CISA still records
"not observed". [`docs/08` §4](08-intel-sources.md) is the reason those are separate claims.
