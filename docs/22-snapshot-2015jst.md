# Snapshot — 2026-10-23 20:15 JST (11:15 UTC): the lead arrived on X, the exploit on an official build

[**English**](22-snapshot-2015jst.md) | [日本語](22-snapshot-2015jst.ja.md)

The fifth read of the day, and the widest. Previous sweeps asked "what did the databases
publish?". This one also asked "what did the channels say?" — the trade press and one X post —
because that is where the day's actual change appeared.

Two results:

1. **The Node.js flaw this repository already tracks now has a working exploit on an official
   build.** Imperva demonstrated code execution on the stock Node.js 24.22.0 Linux arm64 image
   using crafted Brotli data (`CVE-2026-111497`). The same input is rejected by 24.22.1. The
   first public PoC only worked on a deliberately weakened build; this one does not need one.
2. **php2shell was already being attempted four days before the advisory.** Amazon's honeypot
   telemetry has an exploitation attempt dated **2026-10-17**, and public PoCs from
   **2026-10-21 02:00 UTC** — twelve hours before the embargo lifted. "Patch day" was not the
   first day of attack.

And a methodological note this snapshot pays for: **neither of the two things above would have
reached a severity-filtered sweep.** `CVE-2026-111497` carries only a CVSS 4.0 score (9.2), so
the CRITICAL-14d query (a CVSS 3.x filter) does not return it; the day's other exploited flaw,
Arista's `CVE-2026-114625` (9.9), is scored only by the CNA, so that query misses it too. Both
are in the all-severity feed. That is the difference between "the database" and "the week".

```bash
tools/intel/fetch-intel --date 2026-10-23-2015jst --recent-hours 24
# 15 files, fetched 2026-10-23 11:18–11:30 UTC (20:18–20:30 JST)
```

## 1. What changed since 10:36 JST

| Source | 10:36 JST | 20:15 JST | Meaning |
|---|---|---|---|
| CISA KEV | `2026.10.21`, 1,754 | **unchanged** | No new confirmed exploitation in nine hours |
| MSRC CVRF `2026-Oct` | 2,937 (2,936 CVE) | **2,952 (2,951 CVE)** — **+15** | Nothing above 7.5 was added (below) |
| NVD CRITICAL 14 d | 104 | **98** | Same window arithmetic; nothing was fixed |
| NVD published 24 h | 381 | **342** | Different window (11:30 UTC start), same "no analysis" |
| NVD modified 6 h | 665 | **77** | Quiet night: no tracked CVE moved |
| GHSA 24 h | 58 | **58** | Same five criticals, two of them with no CVE id |
| Feeds | 13/13 | **14/14** | `imperva` added; 13 items the 10:36 set did not have |
| News / X | — | **2/2, 1 post** | New channels: the trade press, and one archived post |
| Tracked incidents | — | **+2** | Node2Shell (exploit), Arista VCO (0-day) |

### 1.1 MSRC +15, and the severity buckets did not move

| | Before | After |
|---|--:|---:|
| Entries | 2,937 | **2,952** |
| CVSS ≥ 9.8 | 158 | **158** |
| CVSS ≥ 9.0 | 227 | **227** |
| `Exploited:Yes` | 1 | **1** (`CVE-2026-96951`) |
| `Publicly Disclosed:Yes` | 2 | **2** |

All fifteen additions are 7.5 or lower — DoQ path-migration use-after-free, an HSTS
persistence bug, a wolfSSL pinning bypass, an SFTP/SCP redirect host-verification bypass, and
one entry titled **"Distrust compromised intermediate certificates in crypto/x509"**. That last
one reads as the eMudhra fallout arriving as a Windows component CVE ([`docs/03`](03-emudhra-ca.md)),
though the summary alone does not name the CA. Same document, fifth value in ten days:
2,575 → 2,578 → 2,584 → 2,937 → 2,952, with the exploited set unchanged throughout. **A count without a timestamp is not a measurement.**

### 1.2 The CRITICAL sweep went 104 → 98: six rows left, none entered, nothing was fixed

Same 14-day query, ten hours apart: 104 at 10:36 JST, **98 now**. The published window is the
same 10-09…10-23, so date arithmetic does not explain it. Measured instead:

- **Six rows dropped out and zero rows arrived.** All six still carry a CVSS 3.1 score of 9.1–9.9
  in NVD today — but marked `Secondary`, i.e. the CNA's assessment.
- **The severity filter does not count those.** Asking NVD directly,
  `?cveId=CVE-2026-91637&cvssV3Severity=CRITICAL` returns `totalResults: 0`, although the record
  holds a 9.9 — from the CNA (`Secondary`). The same is true of `CVE-2026-114625` (9.9,
  `Secondary`) and `CVE-2026-111497` (CVSS 4.0 9.2 only): `0` each.
- **So the list shrank because the filter's answer changed, not because anything got safer.**
  Several of the six were re-processed by NVD between the two runs (`lastModified` 02:16–04:18
  UTC). Nothing was patched.

The one KEV row is still BeyondTrust (`CVE-2026-102764`). The lesson of
[`docs/13` §5.4](13-recent-criticals.md) is not academic — it is why this README no longer quotes
"N criticals" as a trend.

### 1.3 The quiet part: NVD's update sweep shows nothing tracked moving

77 records changed in the six hours to 11:28 UTC, six of them at ≥ 9.0, and **none of the CVEs
this repository follows** (`CVE-2026-109618`, `-109619`, `-110264`, `-94300`, `-111497`,
`-114625`). Compare 07:25 JST, when the same sweep caught four tracked records being rescored in
one night. Quiet is a reading, not an absence of news: it says no vendor revised a document.

## 2. Node2Shell — from an X post to code execution on an official build

This is the lead that started this read, and it checks out. The chain runs: an X post (2026-10-23
07:51 UTC) → a trade-press article → the vendor research post (2026-10-22 12:22 UTC) → the Node.js
advisory (2026-10-21) → NVD → the Brotli upstream patch. Four of those five links are primary.

| When (UTC) | What |
|---|---|
| 2026-10-21 | Node.js discloses `CVE-2026-111497` and ships **22.23.4 / 24.22.1 / 26.12.1** |
| 2026-10-22 12:22 | Imperva publishes "Node2Shell": their PoC runs code on the **official 24.22.0 Linux arm64 image**, no debugger, no instrumented build |
| 2026-10-23 07:51 | The Hacker News posts the alert on X — the lead that started this read |
| 2026-10-23 11:20 | NVD's 24-hour sweep returns the record: `Awaiting Analysis`, CVSS 4.0 **9.2**, no CVSS 3.1 |

### 2.1 What the demonstration does and does not establish

Established: crafted Brotli data reaches the decoder Node.js bundles, execution happens inside
the target process (a marker file appeared in an application that had no code to create one), and
the fixed build **rejects the same input**. Tested on one build (24.22.0, Linux arm64), several
attempts needed before it took, Express 5.0.0–5.3.0 and body-parser 2.0.0–2.3.0 pinned (not every
release). Not established: 22.x, 26.x, other architectures, or that the first public PoC's
"crash plus limited memory read" was code execution — it was not, and Imperva says so.

No in-the-wild exploitation of `CVE-2026-111497` has been reported. This is a lab result against
a stock runtime, which is exactly what changes a patch from "this week" to "today".

### 2.2 Reachability, precisely — this corrects the blanket claim in `docs/02`

[`docs/02`](02-nodejs-oct2026.md) says: "if an HTTP server honours `Accept-Encoding: br`, it is
reachable by an unauthenticated request." That is too coarse, and the correction matters for
scoping:

| Path | What is required | Reachable unauthenticated? |
|---|---|---|
| Consumed HTTP response | your code calls the built-in `fetch()` on an attacker-influenced URL, and the response is Brotli-compressed | yes — the response is the input |
| Incoming request body | a parser that **inflates** Brotli bodies: Express 5's `express.json()` / `urlencoded()` / `text()` / `raw()`, or `body-parser` 2.x used directly | yes, on those routes |
| Bare `http.createServer()` | nothing inflates a request body automatically | no, unless the app decodes Brotli itself |

So "we serve HTTP" is not the question. **"Does untrusted Brotli reach the decoder?"** is, on
either side of the exchange. Both paths end in the same native function; both are fixed by the
same runtime update.

### 2.3 What to do

- **Patch the runtime**: 22.23.4 / 24.22.1 / 26.12.1 or newer in each line, **including container
  images and any artifact that bundles a Node binary** — a package inventory will miss those.
  `tools/node/nodefix-audit` lists them.
- **20.x is EOL** and receives nothing. There is no runtime workaround; Imperva's suggestion is to
  limit untrusted Brotli traffic on affected paths *while* updating, not instead of it.
- WAF rules now exist for this CVE (Imperva validated theirs). They buy time; they do not remove
  the decoder.
- Correlation only, not a detection: unexpected process exits during decompression and decoder
  format errors are worth a look, but neither is a reliable standalone sign of exploitation.

### 2.4 Why the severity sweep missed it

The record has `cvssMetricV40` 9.2 and **no `cvssMetricV31`**, and the NVD query that produces
[`docs/13`](13-recent-criticals.md) filters on CVSS 3.x severity. The exploited Node flaw of the
day is therefore absent from the CRITICAL list — as is Arista's 9.9, whose only 3.1 score is
marked `Secondary` (CNA). Two of today's three most consequential items were invisible to the
filter that looks most authoritative.

The all-severity published sweep (342 rows) and the vendor feed caught both. That is the
practical argument for keeping the wide, unfiltered sweep in the default run.

## 3. php2shell: attempted before it was disclosed

[`docs/01`](01-php2shell.md) says patch and hunt. This adds *when* to hunt from.

| Time (UTC) | Observation | Source |
|---|---|---|
| 2026-10-17 | First exploitation attempt against an AWS MadPot honeypot, from an anonymisation network | AWS |
| 2026-10-21 02:00 | Earliest working PoCs seen in the wild | AWS |
| 2026-10-21 13:38 | Imperva enables its full PHP2Shell rule set | Imperva |
| 2026-10-21 14:00 | Embargo lifts; patches ship (8.5.12 / 8.4.27 / 8.3.36 / 8.2.35) | PHP, AWS |
| 2026-10-21 → 22 | 482,342 requests / 122,311 sessions / 21,998 sites / 103 countries in 24 h | Imperva |

Imperva's first-24-hours telemetry: **64.5%** of targeted sites in the United States, then
Indonesia, Australia, Germany, Brazil; business **34.3%**, then education and financial services;
~3.9 requests per session (spray-and-pray); almost half the traffic from clients impersonating
browsers, most of the rest known bots and Go's HTTP library. Those are **attempted** requests
against protected sites — not compromised hosts, and Imperva says so explicitly.

The other half of the picture is that the weaponisation is not working well yet:

- **Sophos** (as quoted by The Hacker News; the Sophos post itself did not load from this network): the attempts try to install a Mirai variant called **Potassium** — C2
  `134.199.154[.]64`, loader `92.118.112[.]100`, DNS `thunder.godofthunder[.]st`, TCP 50792,
  flood targets in one Ukrainian network. The attempts were **unsuccessful**, and Sophos reads
  that as attackers "struggling" to build a reliable exploit.
- **Dataminr TRACE** (as quoted by BleepingComputer; the brief returned 403): activity remains scanning, fingerprinting and non-working exploits, with
  **no known compromises**.
- **CISA KEV**: still does not list `CVE-2026-109618` / `-109619`. EPSS **5.31% / 5.76%**.

Three sentences that must not be merged: *attempts are happening* (yes), *attempts are
succeeding* (no confirmed case), *the flaw is not in KEV* (correct, and it does not mean safe).
The AWS post's operational point is the one to carry: **investigate from at least 2026-10-17**,
because the disclosure date is not the earliest exploitation date.

## 4. What the wide sweep caught that no CVE list names

Four incidents and one vendor confirmation, all first seen through the news channel and then
checked against the primary source. Each row states what is verified and what is not.

| Item | Verified facts | Not verified / caveat |
|---|---|---|
| **Arista VeloCloud Orchestrator** `CVE-2026-114625` | exploited 0-day, CVSS 3.1 **9.9** / 4.0 9.4 (NVD); any authenticated user can become a local superuser (NVD); on-prem fixed in **5.2.3.18 / 6.1.3.10 / 6.4.2.12**, hosted and dedicated already patched; third exploited VCO flaw since late July (advisory 0183) | The "minimum *Enterprise Read Only*", the "no VCO setting prevents the exposure" and the attack IPs come from the advisory **as reported by the press (secondary)** — the advisory page returned 406 to a plain fetch at collection time. Arista does not say when attacks began, which instances, or what was done afterwards |
| **Linux KSMBD** `ZDI-CAN-33774`, `-33549` | 9.0 both; **33774 needs no authentication** (port 445, SMB1/SMB2 handler race); 33549 needs SMB Direct + an RDMA-capable interface + a writable share; **no CVE and no mainline fix** as of 10-22; part of the same ZDI public-mailing-list batch as [`docs/17`](17-lkml-oct2026.md) | 33549's fix is *reported* by Phoronix as queued for the next cycle — unconfirmed elsewhere. Stable kernels lag mainline by weeks |
| **Capcom — CAPCOM ID** | **11,774,247** records (email + account identifiers); 43 with date of birth, gender, country, nickname; 196 accounts had passwords changed; detected 10-19, reported to police and the PPC 10-21; no card data; no plaintext passwords leaked | No attribution, no entry vector disclosed ("identified and addressed"). Email addresses are enough for targeted phishing — treat the 43 and 196 as the sharp end |
| **Onamae.com Desktop Cloud** (GMO Internet) | up to **26,739** customer servers may be affected; unauthorised programs confirmed 2026-10-20; servers suspended from **2026-10-21 04:00 JST**, all plans; payment data held elsewhere; no confirmed data leak or misuse | Restart date unknown at publication. Servers held credentials for FX/MT4 automation — rotate from a clean host, not from the suspended VM |
| **Plex2Shell** (already tracked) | CISA's warning (as reported on 2026-10-21) treats the four-CVE chain as **exploited**; the first hits were honeypots turned into cryptominers; the researcher scores the chain 9.8; KEV **deadline is today** | The individual CVEs are 4.3–7.2. The reason to patch is the chain, not the highest single score |

The template is the same each time: the news item gives the *who and when*, the primary source
gives the *version numbers*, and the CVE record gives a score that is frequently late or absent.

## 5. Everything tracked, as of 2026-10-23 20:15 JST

| Item | State now | Action | Detail |
|---|---|---|---|
| **php2shell** | fixed; exploitation attempts since **10-17**, no confirmed compromise, not in KEV, EPSS 5.31 / 5.76% | patch 8.5.12 / 8.4.27 / 8.3.36 / 8.2.35; hunt from 10-17 | [`01`](01-php2shell.md) |
| **GitLab** | no new advisory; 19.5.1 stands | patch the 10.0 | [`09`](09-gitlab-19-5-1.md) |
| **LiteLLM** | issue body unchanged | remove 1.107.0, rotate | [`10`](10-litellm-1-107-0.md) |
| **Plex Media Server** | KEV deadline **today**; chain exploitation confirmed by CISA | ≥ 1.43.3.10861, rotate tokens | [`12`](12-plex-oct2026.md) |
| **ISC BIND 9** | NVD `Awaiting Analysis`, 8.1 | 9.20.30 / 9.21.27 | [`18`](18-bind-cve-2026-94300.md) |
| **KSMBD / LKML batch** | no CVE, no mainline fix; 33774 needs no auth | drop `ksmbd` if unused; follow distro kernel | [`17`](17-lkml-oct2026.md) |
| **Apache (Tomcat / httpd)** | unchanged | 11.0.27 / 10.1.61 / 9.0.123, httpd 2.4.69 | [`15`](15-apache-oct2026.md) |
| **Railway / OpenCode** | unchanged | rotate provider keys | [`11`](11-week-of-oct-20.md) |
| **Oracle Java SE** | unchanged, 55 CVEs, max 7.5 | fixed builds incl. Temurin 17.0.21+9 / 21.0.13+9 / 25.0.5+8 | [`07`](07-oracle-java-oct2026.md) |
| **eMudhra CA** | MSRC added a "distrust" CVE at ≤ 7.5; bundles still the fix | `ca-certificates` / `certifi` / Go / NSS; rebuild images without layer cache | [`03`](03-emudhra-ca.md) |
| **Node.js** | **public exploit on an official build**; no in-the-wild reports | 22.23.4 / 24.22.1 / 26.12.1, containers included | [`02`](02-nodejs-oct2026.md), §2 |
| **Infinity Core** | unchanged; five root PoCs public | kernel update **and reboot** | [`20`](20-infinity-core.md) |
| **Arista VCO** | **exploited 0-day**, 9.9, needs a login | on-prem 5.2.3.18 / 6.1.3.10 / 6.4.2.12; block `74.82.197[.]86` and review admin activity | §4 |
| **Capcom / Onamae** | disclosure stage | awareness only: phishing on one side, credential rotation on the other | §4 |

Nothing in this table is a reason to skip the KEV deadline that lands today.

## 6. Method: what this run cost and taught

- **Channels are not evidence, but they are the only early warning.** The X post and the trade
  press are now collected (`x-posts.json`, `news-feeds.json`) with their outbound links, and the
  note in both files says: cite the link, not the post. The news channel produced four items in
  §4 that no CVE feed named on the day.
- **An empty column is a claim.** This run's `with_epss` is **0/342**, and the honest reading is
  "EPSS has not scored anything published after its 2026-10-22 model run", not "the scores are
  zero". The collector now records refused batches separately (`epss_batches_failed`) so a 429
  cannot masquerade as an absence of scores. Same rule as [`docs/08` §5](08-intel-sources.md):
  a number without its timestamp and its coverage contradicts itself.
- **Two filters disagree by design.** NVD's severity filter counts its own primary CVSS 3.x
  score; the published sweep and the vendor feeds do not care who scored the record. Keep both,
  and read the unfiltered one when the question is "what is being exploited", not "what scored
  highly". Today that difference is concrete: the exploited Node flaw and the exploited Arista
  flaw are both 0-row answers from the filtered query.
- **Zero analysis is the norm for 24-hour-old CVEs.** 342 published, `Analyzed` **0**, CPE
  mapping **0/342**, CVSS 3.1 present on 244, CVSS 4.0 on 179. Nothing here is broken; the queue
  is simply longer than the news cycle.

## 7. Reproduce

```bash
# this snapshot (15 files)
tools/intel/fetch-intel --date 2026-10-23-2015jst --recent-hours 24

# the two new channels only
tools/intel/fetch-intel --sources news --out /tmp/wide
tools/intel/fetch-intel --sources x --x-posts 2113538808126038500 --out /tmp/wide
tools/intel/fetch-intel --sources feeds --out /tmp/wide   # includes `imperva`

# why the severity sweep misses the exploited Node flaw
curl -s 'https://services.nvd.nist.gov/rest/json/cves/2.0?cveId=CVE-2026-111497' \
  | jq -r '.vulnerabilities[0].cve | "\(.vulnStatus) v31=\(.metrics.cvssMetricV31 // "none") v40=\(.metrics.cvssMetricV40[0].cvssData.baseScore)"'

# and the Arista 9.9 that the same filter drops (CNA-only 3.1 score)
curl -s 'https://services.nvd.nist.gov/rest/json/cves/2.0?cveId=CVE-2026-114625' \
  | jq -r '.vulnerabilities[0].cve | "\(.vulnStatus) \(.metrics.cvssMetricV31[0].type) \(.metrics.cvssMetricV31[0].cvssData.baseScore)"'
```

## 8. Sources

- Snapshot: [`data/2026-10-23-2015jst/`](../data/2026-10-23-2015jst/) — 15 files, fetched
  2026-10-23 11:18–11:30 UTC.
- **Node2Shell**: Imperva, <https://www.imperva.com/blog/node2shell-from-brotli-data-to-remote-code-execution/>
  (2026-10-22 12:22 UTC); the X post,
  <https://x.com/TheHackersNews/status/2113538808126038500> (archived in `x-posts.json`);
  Node.js advisory, <https://nodejs.org/en/blog/vulnerability/october-2026-security-releases>;
  NVD, `CVE-2026-111497`; release dates from <https://nodejs.org/dist/index.json>.
- **php2shell exploitation**: AWS, <https://aws.amazon.com/blogs/security/amazon-threat-intelligence-identifies-php2shell-exploitation-prior-to-public-disclosure-in-madpot/>;
  Imperva, <https://www.imperva.com/blog/php2shell-early-attack-activity-through-impervas-lens/>;
  Sophos, <https://www.sophos.com/en-us/blog/proof-of-concept-exploit-released-for-php-vulnerabilities-109618-109619>
  (**could not be fetched from this network on 2026-10-23**; quoted via The Hacker News);
  Dataminr TRACE, <https://www.dataminr.com/resources/intel-brief/continued-analysis-of-core-php-vulnerabilities/>
  (**403 at collection time**; quoted via BleepingComputer).
- **Arista VCO**: advisory 0199,
  <https://www.arista.com/en/support/advisories-notices/security-advisory/24838-security-advisory-0199>;
  NVD, `CVE-2026-114625`; earlier flaws from advisory 0183.
- **KSMBD**: ZDI reports on the public LKML, summarised in
  [`docs/17`](17-lkml-oct2026.md); no CVE exists to link.
- **Capcom**: <https://www.capcom.co.jp/ir/news/html/261022.html> (2026-10-22).
- **Onamae.com Desktop Cloud**: <https://www.onamae.com/news/article/11584> (2026-10-21).
- **Plex2Shell**: CISA KEV, plus the researcher's write-up,
  <https://zmain.info/blog/plex2shell>; detail in [`docs/12`](12-plex-oct2026.md).
- NVD sweeps, GHSA, KEV, MSRC, JVN, feeds: [`data/2026-10-23-2015jst/`](../data/2026-10-23-2015jst/),
  commands in `SOURCES.md`.
