# Snapshot — 2026-10-23 07:25 JST (2026-10-22 22:25 UTC)

[English](19-snapshot-0730jst.md) | [**日本語**](19-snapshot-0730jst.ja.md)

The overnight re-read. Nothing shipped a new patch, no new CVE entered KEV, and yet **three numbers
this repository published yesterday are wrong**: the v3.1 score of one of the two php2shell CVEs,
the highest EPSS in the two-week sweep (both PHP CVEs now hold the top two places), and the ≥ 9.8
count in [`docs/13`](13-recent-criticals.md) — that last one because of a bug in the collector, not
a change in the world. All three matter for how you triage. **None changes what you should
install.**

```bash
tools/intel/fetch-intel --date 2026-10-23-0730jst --cpu Oct2026 --month 2026-Oct
# → data/2026-10-23-0730jst/  (collected 2026-10-22 22:24-22:33 UTC)
```

## 1. What changed since the 21:20 JST snapshot

| Source | 2026-10-22 21:20 JST | 2026-10-23 07:25 JST | Meaning |
|---|---|---|---|
| CISA KEV | catalog `2026.10.21`, 37 entries in the 30-day window | **unchanged** (`2026.10.21`; 33, because the window start slid to 09-23) | no new known-exploited CVE overnight |
| NVD score for `CVE-2026-109619` | 9.8 | **8.1** (rescored 2026-10-22 21:17Z) | one of the two php2shell CVEs left the CRITICAL band |
| NVD score for `CVE-2026-109618` | 9.8 | **9.8** (record touched 20:45Z, description identical) | unchanged |
| NVD CRITICAL sweep (14 days) | 124 | **125** — but **11 arrived and 10 left** | the count is a window on a moving index, not a ledger |
| EPSS for the PHP pair | no score | **5.31% / 5.76%**, ~93rd percentile | now the two highest EPSS values in the window |
| MSRC CVRF `2026-Oct` | 2,578 entries (2,577 CVE) | **2,584 (2,583 CVE)** | re-issued again, +6 Azure CVEs, three at 10.0 |
| JVN advisory feed | 20 items | **unchanged** | quiet |
| Oracle CPU / Plex CSAF / GitLab advisory | — | **byte-identical** | no vendor revision overnight |
| LiteLLM issue #47826 | updated 09:42Z | updated 18:05Z, **body identical** (`sha256 07cdfef8…`) | comments only; the artefact list is stable |
| Eclipse Temurin | 21 = `21.0.12.1+1` (August build) | **17.0.21+9 / 21.0.13+9 / 25.0.5+8** | the vendor lag closed for three of the five lines |

Two things did **not** move, and they are checked below rather than assumed: the kernel reports
from [`docs/17`](17-lkml-oct2026.md) are still unpatched in mainline, and **no fixed version number
has advanced** — the only vendor artefact that appeared is Temurin's 17 / 21 / 25 builds, which
match the versions Oracle named on 10-20.

## 2. NVD took `CVE-2026-109619` back out of CRITICAL

| | `CVE-2026-109618` | `CVE-2026-109619` |
|---|---|---|
| NVD CVSS 3.1, 2026-10-21 | 9.8 | 9.8 |
| NVD CVSS 3.1, 2026-10-22 21:17Z | 9.8 | **8.1** |
| NVD vector | `AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H` | **`AV:N/AC:H/…`** (was `AC:L`) |
| PHP's own CVSS 4.0 | 9.2 | 9.2 |

The whole difference is **attack complexity**: NVD judged the stale-global-state path to need a
condition the attacker cannot set at will, while the OOM/longjmp path stayed `AC:L`. PHP's advisory
scores both at 9.2 under v4.0 and has not changed.

What this does and does not mean:

- **It does not change the fix.** Both CVEs are repaired by the same release (8.5.12 / 8.4.27 /
  8.3.36 / 8.2.35). There is no version that fixes 109618 and not 109619.
- **It does not mean 109619 is safe.** 8.1 is still remote, unauthenticated, high-impact; the
  partial mitigations in [`docs/01` §3](01-php2shell.md) are still aimed at this exact path.
- **It does break a triage rule.** Anyone filtering "CVSS ≥ 9.0" now silently drops 109619 while
  keeping its sibling — same advisory, same patch, one row missing from the list. Patch by
  advisory, not by score threshold.

This is the same trap [`docs/13`](13-recent-criticals.md) describes from the other direction: a
score is an assessment with a timestamp, and assessments get revised hours later.

## 3. Why the sweep went 124 → 125 with 11 in and 10 out

Two different mechanisms, both visible in the API — plus one defect in this repository's own
reader:

**(a) Rescoring.** `CVE-2026-109619` left (see §2). Scores get revised; the window does not
remember the old value.

**(b) CNA-only scores are not counted.** NVD's `cvssV3Severity` filter answers on **NVD's own
(Primary) assessment**. A record still `Awaiting Analysis`, carrying only the CNA's (Secondary)
score, is invisible to it whatever that score says. Verified directly:

```bash
# CVE-2026-101809: Oracle E-Business Suite, CNA score 10.0, vulnStatus "Awaiting Analysis"
curl -s 'https://services.nvd.nist.gov/rest/json/cves/2.0?cveId=CVE-2026-101809&cvssV3Severity=CRITICAL' | jq .totalResults
# → 0
curl -s 'https://services.nvd.nist.gov/rest/json/cves/2.0?cveId=CVE-2026-101809&cvssV3Severity=HIGH' | jq .totalResults
# → 0      (the record has one metric: secalert_us@oracle.com, Secondary, 10.0)

# the other direction: 109619 is now HIGH and no longer CRITICAL
curl -s 'https://services.nvd.nist.gov/rest/json/cves/2.0?cveId=CVE-2026-109619&cvssV3Severity=HIGH' | jq .totalResults
# → 1
```

So the headline number counts **analysed** CVEs, not serious ones. All nine remaining departures
are in that state — `CVE-2026-101809` (`Awaiting Analysis`, CNA 10.0), `CVE-2026-101420`
(`Undergoing Analysis`, 9.6), `CVE-2026-20043`, `-76473`, `-76474`, `-76475` (`Awaiting Analysis`,
9.0–9.8), and `CVE-2026-113390`, `-112370`, `-114220` (`Deferred`, 9.9 / 9.1) — every one
published inside the window, serious by its CNA's own score, and absent from both severity
queries.

> Practical rule: `cvssV3Severity=CRITICAL` is a convenient noise filter, not a definition of what
> is dangerous. It answers "what has NVD finished analysing", which is a different question.

**(c) The reader had a bug, and this snapshot fixes it.** Re-deriving the numbers above exposed a
defect in `tools/intel/fetch-intel`: `collect_nvd_critical` took the *first* `cvssMetricV31` entry
as the score, and NVD lists the CNA's ("Secondary") metric before its own ("Primary") on some
records. The two can differ by a whole severity band:

```console
$ curl -s 'https://services.nvd.nist.gov/rest/json/cves/2.0?cveId=CVE-2026-95695' | jq '.vulnerabilities[0].cve.metrics.cvssMetricV31'
# psirt@us.ibm.com  Secondary  7.4  HIGH
# nvd@nist.gov      Primary    9.1  CRITICAL
```

That row was selected by a CRITICAL filter and then recorded as 7.4. The extractor now prefers the
Primary metric (falling back to whatever exists), and on **the same 125 rows** the count at ≥ 9.8
goes from **53 to 72**, while the count at exactly 10.0 (13) does not move. Nothing in the world
changed; the reader did. Scores already published in [`docs/13`](13-recent-criticals.md) and in the
older `data/` snapshots still carry the old reading — they are kept as they were collected, and
[`docs/13` §9](13-recent-criticals.md) records the correction rather than rewriting the history.

## 4. EPSS moved onto php2shell — both CVEs, 93rd percentile

| CVE | EPSS (2026-10-22) | Percentile | In the CRITICAL sweep? |
|---|--:|--:|---|
| `CVE-2026-109619` | **5.76%** | 0.930 | no (8.1) |
| `CVE-2026-109618` | **5.31%** | 0.926 | yes (9.8) |
| highest other row in the window | 3.04% (`CVE-2020-37282`) | — | yes |

Yesterday the sweep's own text said "highest EPSS anywhere in the window: **3.0%**". That was
correct when it was written: neither PHP CVE had a score yet. One day later the two highest values
in the whole two-week window are the two php2shell CVEs — and the highest of them is the one that
just left the CRITICAL set.

EPSS is a **model's probability estimate**, not an observation: CISA's alert still says it "has not
observed exploitation", and there is no KEV entry. [`docs/08` §4](08-intel-sources.md) works through
why those are four different claims. The useful reading is narrower: *if you have a backlog and no
inventory, this is now the row the data ranks first* — a public exploit, a ~24-hour
disclosure-to-patch window (2026-10-20 → 10-21), and the largest EPSS in the batch.

## 5. MSRC re-issued `2026-Oct` again: 2,578 → 2,584, and the six new rows

The CVRF has now read 2,578 (2026-10-13), 2,575 (10-21), 2,578 (10-22 21:20) and **2,584**
(10-22 22:25) — a count that moves in both directions, which is the point. The six additions are all
Azure, and **three of them are CVSS 10.0**:

| CVE | CVSS | What | Exploited |
|---|--:|---|---|
| `CVE-2026-110063` | 10.0 | VM Inspector for Azure Virtual Machines — elevation of privilege | No |
| `CVE-2026-83938` | 10.0 | Azure Kubernetes Configuration Service — elevation of privilege | No |
| `CVE-2026-97785` | 10.0 | AAD App Proxy — elevation of privilege | No |
| `CVE-2026-105014` | 9.1 | Azure Pipelines — remote code execution (command injection) | No |
| `CVE-2026-108456` | 7.7 | Azure AI Foundry — elevation of privilege | No |
| `CVE-2026-96185` | 7.5 | Exchange Online — remote code execution | No |

Read the exploit-status column rather than the score: all six are `Exploited:No` and
`Publicly Disclosed:No`, and the exploited count for the month is unchanged at **one** CVE
(`CVE-2026-96951`, the October Patch Tuesday one). The three 10.0s are cloud-service elevation
bugs with `Latest Software Release: N/A` — there is no build for you to move to, so "patch" is not
an instruction you can follow. For a tenant-level service the artefact is the CVRF record and the
service's own change notices; this repository does not carry Azure configuration guidance it cannot
verify.

## 6. The new rows that fit this repository's thesis

Eleven CVEs entered the sweep. Four are the Azure batch in §5 (`CVE-2026-110063`, `-83938`,
`-97785` at 10.0 and `CVE-2026-105014` at 9.1) and one is `CVE-2026-95695`, the IBM WebSphere
Liberty row that §3(c) had been mis-reading at 7.4 (NVD: 9.1). The remaining six share a subject:
the boundary around an **agent, a container or a sandbox** — not a network edge.

| CVE | CVSS | What breaks | Fix |
|---|--:|---|---|
| `CVE-2026-109444` | 9.8 | **OpenSRE** ≤ 0.1.2026.10.19 — the headless presenter's `execution_allowed()` always returns True, so the agent runs `shell_run` without asking; injected instructions in alerts or Slack messages become host commands, and LLM / Slack / cloud credentials leave with them | later date-stamped release (no 0.x backport) |
| `CVE-2026-77930` | 9.8 | **EvoScientist** 0.1.0–0.2.4 — commands get delegated to async sub-agents that have no `interrupt_on` gate; instructions planted in fetched web pages run with user privileges and environment secrets | **0.2.5** |
| `CVE-2026-115377` | 9.9 | **Incus** — a migration source plants symlinks in transferred volumes; rsync/btrfs receive writes host files as root | **6.0.7 / 7.0.2 / 7.5.0** |
| `CVE-2026-115375` | 9.9 | **Incus** — `../` in a dependent volume name inside `index.yaml` of an imported backup creates root-owned directories on the host | **7.0.2 / 7.5.0** |
| `CVE-2026-115384` | 9.9 | **Wasmtime** — mistyped component-model-async callback returns overflow the native stack (~16 KB), so a malicious guest can escape the sandbox | **48.0.4 / 49.0.2** |
| `CVE-2022-51026` | 9.8 | **Bytebase** 0.12.0–1.0.0 — `/api/auth/login/GITLAB_SELF_HOST` trusts a client-supplied `instanceUrl`, so anyone can log in as anyone, Owner included | **1.0.1** |

The first two are the October pattern with the mechanism changed. Railway, LiteLLM and OpenCode
were "the key store was the weak point"; these are "the **permission prompt** was the weak point" —
the control that exists to stop an agent from running a command is the thing that returns True.
The last four are the other half of the same thought: the container, the migration channel and the
WASM boundary are places people put trust **instead of** checking.

What to do that is not "upgrade a number":

1. **Test the gate, headless.** Run the agent with a harmless canary command in exactly the mode
   you deploy (`--headless`, cron, CI) and confirm it refuses. If it cannot refuse, the gate is
   documentation, not a control.
2. **Give the agent its own credentials**, short-lived, scoped, and rotatable — not a host
   environment that also holds cloud and Slack secrets. `docs/11` §5 is the same argument.
3. **Treat ingest as input, not as data.** Both bypasses need only text the agent reads: an alert,
   a Slack message, a fetched page.

Verification note: these descriptions are NVD/CNA text and release-note arithmetic; no vendor
advisory was read for OpenSRE or EvoScientist (no KEV entry, no GHSA checked), so treat the fix
versions as the CNA's claim. The Incus, Wasmtime and Bytebase rows map to version ranges stated in
the NVD record itself.

## 7. What is due today

| Item | Status at 07:25 JST, 2026-10-23 | What to do |
|---|---|---|
| **Plex** `CVE-2026-96654` / `-96656` | KEV due date is **today, 2026-10-23** | patch to ≥ 1.43.3.10861; current release is **1.43.5.11029** |
| **EG Secure Solutions SiteGuard** `CVE-2026-106931` | KEV due date is **today, 2026-10-23** | vendor mitigations; added in the same 2026-10-20 batch as Plex, same triage requirement |
| All three KEV rows due today | carry CISA's **forensic triage** requirement | patch first, then triage; "patched" is not "clean" |
| **php2shell** | no KEV entry; EPSS 5.3–5.8% | if PHP was internet-facing on 2026-10-20/21, run the compromise checks |
| **Temurin / Adoptium** | 17.0.21+9, 21.0.13+9, 25.0.5+8 published 2026-10-22 | rebuild images on those tags; 8 and 11 are still August builds and their numbering does not match Oracle's (see [`docs/07` §3](07-oracle-java-oct2026.md)) |
| Everything else | PHP / Node / GitLab / Tomcat / httpd / BIND / Oracle Java all unchanged | today's work is applying them |

The dependency in that table is worth naming: **the Plex deadline is a clock, not a patch level.**
1.43.3.10861 satisfies KEV; 1.43.5.11029 is what Plex actually ships today. Either clears the
deadline, and the second one is the one you would choose anyway.

## 8. What did not change (and is therefore still true)

- **Kernel: still no fix in mainline.** Re-checked the `torvalds/linux` mirror by commit search for
  the three ids that matter: `ZDI-CAN-33549` → 0 commits, `ZDI-CAN-33367` → 0, `ZDI-CAN-33774` →
  2 hits, both 2024 `dt-bindings`/`arm64: dts` commits that merely contain the number. So the
  answer in [`docs/17`](17-lkml-oct2026.md) stands: unpatched, keep ksmbd off.
- **No newer fixed version anywhere.** PHP 8.5.12 / 8.4.27 / 8.3.36 / 8.2.35; Node 26.12.1 /
  24.22.1 / 22.23.4; GitLab 19.5.1 (no 19.5.2 in the Docker tag list); Tomcat 11.0.27 / 10.1.61;
  httpd 2.4.69; BIND 9.20.30 / 9.21.27; Oracle Java 21.0.13 / 17.0.21 / 11.0.33 / 8u511 / 25.0.5 / 27.0.1.
- **LiteLLM 1.107.0 is still not on PyPI.** Only `1.107.0rc1/rc2` and `.dev1–3` are listed;
  1.106.2 remains current. A lockfile that pins `1.107.0` therefore did not get it from PyPI —
  which is its own finding.
- **KEV has no Java, PHP, GitLab, Apache, Railway, LiteLLM, Tailscale, OpenSRE or EvoScientist
  entry.**
- **JVN is quiet** at 20 items.

## 9. How to re-check this in one minute

```bash
# 1) did anything in KEV move? (catalogVersion + last dateAdded)
curl -s https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json \
  | jq -r '.catalogVersion, ([.vulnerabilities[].dateAdded]|max)'

# 2) is the second PHP CVE still 8.1? (the score that moved)
curl -s 'https://services.nvd.nist.gov/rest/json/cves/2.0?cveId=CVE-2026-109619' \
  | jq -r '.vulnerabilities[0].cve.metrics.cvssMetricV31[]|[.source,.cvssData.baseScore]|@tsv'

# 3) did any vendor build land? (Temurin, the one that moved)
curl -s 'https://api.adoptium.net/v3/assets/latest/21/hotspot?architecture=x64&image_type=jdk&os=linux' \
  | jq -r '.[0].release_name'

# 4) full re-read, then diff against this snapshot
tools/intel/fetch-intel --date 2026-10-23-1200jst --out /tmp/now
diff <(jq -S 'del(.fetched_at)' data/2026-10-23-0730jst/nvd-critical-14d.json) \
     <(jq -S 'del(.fetched_at)' /tmp/now/nvd-critical-14d.json)
```

## 10. Sources

- Everything in §1–§7 is from [`data/2026-10-23-0730jst/`](../data/2026-10-23-0730jst/), collected
  by `tools/intel/fetch-intel` at 2026-10-22 22:24:59 UTC, with the NVD sweep re-collected at
  22:32:32 UTC after the extractor fix in §3(c).
- NVD per-CVE records (scores, `vulnStatus`, vectors):
  <https://services.nvd.nist.gov/rest/json/cves/2.0?cveId=…>
- EPSS: <https://api.first.org/data/v1/epss?cve=CVE-2026-109618,CVE-2026-109619>
- MSRC CVRF (re-issued): <https://api.msrc.microsoft.com/cvrf/v3.0/cvrf/2026-Oct>
- KEV: <https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json>
- CISA PHP alert (unchanged, "not observed"): <https://www.cisa.gov/news-events/alerts/2026/10/21/critical-vulnerabilities-php-require-immediate-patching>
- Adoptium: <https://api.adoptium.net/v3/assets/latest/21/hotspot?architecture=x64&image_type=jdk&os=linux>
- PyPI state of LiteLLM: <https://pypi.org/pypi/litellm/json>
- Kernel commit search: <https://api.github.com/search/commits?q=repo:torvalds/linux+33774>
- Vendor release indexes (PHP, Node, GitLab tags, Tomcat, httpd, BIND, Plex):
  <https://www.php.net/releases/index.php?json&version=8.5>,
  <https://nodejs.org/dist/index.json>,
  <https://hub.docker.com/v2/repositories/gitlab/gitlab-ee/tags>,
  <https://dlcdn.apache.org/tomcat/tomcat-11/>,
  <https://dlcdn.apache.org/httpd/>,
  <https://downloads.isc.org/isc/bind9/>,
  <https://plex.tv/api/downloads/5.json>
- Unit 42's write-ups on the eMudhra CA compromise (2026-10-22) and the OAuth attack landscape:
  <https://unit42.paloaltonetworks.com/emudhra-certificate-compromise/>,
  <https://unit42.paloaltonetworks.com/current-landscape-oauth-attacks/>
