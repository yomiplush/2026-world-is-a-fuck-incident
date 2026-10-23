# Snapshot — 2026-10-23 10:36 JST (01:36 UTC): a broader sweep, and the blind spot it found

[English](21-snapshot-1036jst.md) | [**日本語**](21-snapshot-1036jst.ja.md)

Third read of the day, this time deliberately **wider** instead of deeper: every severity, every
package ecosystem, and the disclosure channel — not just the products this repository already
follows. Two things came out of it:

1. **The NVD severity sweeps cannot see a coordinated disclosure.** The biggest kernel item of the
   week — [`Infinity Core`](20-infinity-core.md), five public root PoCs — does not appear in any
   sweep by publication date, in any sweep by modification date, or in any of the twelve feeds this
   repository collected yesterday.
2. **The package ecosystem moved more than the CVE database did.** Two unauthenticated-RCE
   advisories for Next.js were published in 24 hours and **neither has a CVE**, so a CVE-shaped
   process sees nothing.

```bash
tools/intel/fetch-intel --date 2026-10-23-1036jst --recent-hours 24
# → data/2026-10-23-1036jst/   (collected 2026-10-23 01:36-02:2x UTC)
```

The collector grew four sources for this (see §2): `nvd-recent` (every severity, by publication),
`nvd-modified` (every severity, by NVD's own `lastModified`), `ghsa` (GitHub Advisory Database), and
an `oss-sec` feed.

## 1. What changed since the 07:25 JST snapshot

| Source | 07:25 JST | 10:36 JST | Meaning |
|---|---|---|---|
| CISA KEV | `2026.10.21` | **unchanged** | still no new known-exploited CVE |
| MSRC CVRF `2026-Oct` | 2,584 entries (2,583 CVE) | **2,937 (2,936 CVE)** — **+353** | the Edge/Chromium component set landed (below) |
| NVD CRITICAL sweep | 125 (window 10-08…10-22) | **104 (window 10-09…10-23)** | **the window rolled a day — not 21 CVEs fixed** |
| Oracle CPU / GitLab page / Plex CSAF / JVN | — | **identical** | no vendor revision |
| LiteLLM issue #47826 | updated 18:05Z | updated 22:58Z, **body identical** | comments only |
| Kernel | docs/17 set open | **+ Infinity Core** (fixed upstream) | [`docs/20`](20-infinity-core.md) |

### 1.1 MSRC +353, and none of them change the finding

The 353 additions are **all Chromium third-party component CVEs** (`CVE-2026-112992` …
`CVE-2026-113344`, one Edge/Chromium batch). The shape did not move:

| | Before | After |
|---|--:|---:|
| Entries | 2,584 | **2,937** |
| CVSS ≥ 9.0 | 198 | **227** |
| CVSS ≥ 9.8 | 158 | **158** (unchanged) |
| `Exploited:Yes` | 1 | **1** (`CVE-2026-96951`) |
| `Publicly Disclosed:Yes` | 2 | **2** |

So: a 13.7% jump in the count, zero change in the exploited set. This is the third re-issue of the
same document in ten days, and the number has now read 2,578 → 2,575 → 2,578 → 2,584 → 2,937. Cite
the retrieval time or the number contradicts itself — the point [`docs/08` §5](08-intel-sources.md)
has been making all along.

### 1.2 The CRITICAL count fell from 125 to 104 without a single CVE being fixed

`tools/intel/fetch-intel --sources nvd-critical` uses a 14-day window **ending today**. At 10:36 JST
"today" is 2026-10-23, so the window is now 10-09…10-23; ten hours ago it was 10-08…10-22. The
arithmetic, from the two files:

| | 07:25 JST | 10:36 JST |
|---|--:|--:|
| Window | 10-08…10-22 | 10-09…10-23 |
| Total | 125 | **104** |
| …published 10-08 | 17 | — (outside the window) |
| …published 10-20 / 10-22 | 66 / 12 | **64 / 10** (four left the CRITICAL set) |
| …published 10-23 | — | **0** |

125 − 17 (window edge) − 4 (rescored or re-statused) + 0 = 104. Nothing came in, 21 left, and the
headline moves. Compare the two numbers and you would write "critical vulnerabilities fell 17%" —
the same trap [`docs/13` §5.4](13-recent-criticals.md) describes, now in this repository's own
table.

## 2. The broad sweep (new sources)

| Source | Window | Result |
|---|---|---|
| `nvd-recent` | published, 24 h, **all severities** | **381 CVEs** — 54 at ≥ 9.0, 122 high, 128 medium, 27 low, 11 with no score |
| `nvd-modified` | NVD `lastModified`, 6 h, all severities | **665 records touched** — and it caught every one of our tracked CVEs (below) |
| `ghsa` | published, 24 h | **58 advisories** — 5 critical, 26 high, 20 medium, 7 low; 67 npm package entries, 28 pip, 8 rust |
| `oss-sec` (feed) | RSS head | 13/13 feeds readable; carried four items the other twelve did not |

### 2.1 The newest CVEs are the least usable ones

Not one of the 381 CVEs published in the last 24 hours has been analysed by NVD: `vulnStatus` is
`Received` 187, `Deferred` 141, `Awaiting Analysis` 45, `Undergoing Analysis` 7, `Rejected` 1,
**`Analyzed` 0**. Consequences you can measure in the same file:

- **CPE mappings: 0.** Yesterday's 14-day batch had 32 of 120 (27%). A fresh batch has none, so
  "attribute these by vendor from NVD" cannot work at all for a day-old CVE.
- **EPSS coverage: 71 of 381 (19%).** The highest score in the batch is **0.76%**
  (`CVE-2026-110354`, 7.5).
- **No CVSS 3.1 on 50 of them** (39 of those do carry a CVSS 4.0).

None of this is a defect in NVD — it is a queue. But it means "yesterday's CRITICAL count" and
"today's CRITICAL count" are measurements of *analysis progress*, which is exactly the mechanism
that made `CVE-2026-109619` disappear from the CRITICAL band yesterday ([`docs/19` §3](19-snapshot-0730jst.md)).

### 2.2 The modification sweep is the one that would have told you

`nvd-modified` (6 h) contains all four tracked CVEs whose records moved overnight — the two PHP CVEs,
GitLab's, and BIND's:

| CVE | `vulnStatus` now | CVSS 3.1 | CVSS 4.0 | EPSS |
|---|---|--:|--:|--:|
| `CVE-2026-109618` (PHP) | `Analyzed` | 9.8 | 9.2 | 5.31% |
| `CVE-2026-109619` (PHP) | `Modified` | **8.1** | 9.2 | 5.76% |
| `CVE-2026-110264` (GitLab) | `Undergoing Analysis` | **10.0** | — | 0.51% |
| `CVE-2026-94300` (BIND) | `Awaiting Analysis` | **8.1** | — | 0.73% |

GitLab's 10.0 is now an NVD **Primary** score (`Undergoing Analysis`, i.e. not final). BIND's 8.1
is likewise a score without analysis behind it. Both are "the number exists, the reasoning does
not" — the same shape as the CNA-only rows in [`docs/19` §3](19-snapshot-0730jst.md).

### 2.3 What the ecosystem published in 24 hours (GHSA)

The two most serious rows have **no CVE**, so nothing that filters on CVEs would show them:

| Advisory | Severity | Package → fix | What it is |
|---|---|---|---|
| Next.js `use cache` | **critical** | npm `next` → **16.4.1** | unauthenticated RCE in `use cache` functions returning typed arrays |
| Next.js image optimisation | **critical** | npm `next` → **15.5.28 / 16.4.1** | unauthenticated RCE when SVG is allowed through `/_next/image` |
| DOMPurify | **critical** | npm `dompurify` → **3.4.17** | `SAFE_FOR_TEMPLATES` bypass: split template expressions survive |
| Sentry Next.js middleware | **critical** | npm `@sentry/nextjs` → **9.47.2 / 10.75.2** | `CVE-2026-114139`, tunnel-route middleware bypass |
| Pillow multi-frame loaders | **critical** | pip `Pillow` → **13.0.0** | `CVE-2026-96639`, stale native image storage reused across mode change |
| GitPython submodules | high 7.5 | pip `GitPython` → **3.2.1** | `CVE-2026-114145`, `.git` path validated *after* cloning → RCE |
| `toml` (4 advisories) | high | npm `toml`/`tome` → **5.0.1** | prototype pollution + three resource-exhaustion bugs |
| Storybook dev server | high | npm `storybook` → **8.6.19 / 9.1.21 / 10.6.2** | code injection from the local network |
| graphql-core / @graphql-tools | high | pip **3.2.12**, npm **12.0.2** | DoS + prototype pollution |
| nbconvert | high | pip **7.17.2** | arbitrary file write via cell-output filename traversal |

Two Next.js unauthenticated RCEs in one day, and the fix is a patch version. If you run Next.js,
that is today's item regardless of what any CVE list says.

## 3. The blind spot: Infinity Core was in none of this

[`docs/20`](20-infinity-core.md) covers the vulnerability. What matters *here* is the collection
result, because it is a test of the method:

- The six CVEs were assigned **2026-09-04 → 2026-10-12** (published dates), so they are invisible to
  any "published in the last 24 hours" sweep — including the 381-row one above.
- Their NVD records were **not modified** in the last 6 hours, so `nvd-modified` did not show them
  either. (`vulnStatus: Received` on all six; four carry a 7.8 from the kernel team, two carry no
  score.)
- **None of the twelve feeds** collected yesterday mentioned it — `grep -ci infinity` over every
  feed title returns **0**, and it still returns 0 today over all thirteen, because the thread has
  scrolled off the head of the RSS. A feed is a window too; the archive is the record. It surfaced
  through a Japanese vendor blog and the researcher's GitHub.

So the method needs a third axis beside "published" and "modified": **the disclosure channel.**
Coordinated disclosure ends on a mailing list; a CVE published six weeks earlier becomes urgent the
day the PoC lands. `oss-sec` is now in the feed catalog for that reason — one line in `FEEDS`, and
on this run it immediately produced four items the other twelve missed (§4, §5).

> A sweep tells you what the database did. A disclosure channel tells you what changed meaning.

## 4. Python and the eMudhra CA: the version numbers arrived

[`docs/03`](03-emudhra-ca.md) said "update `ca-certificates` / `certifi` / Go / NSS". The Python
security response now names versions (oss-sec, 2026-10-22 20:45 UTC, quoting Seth Michael Larson):
the **emSign root** was removed from CA bundles such as `certifi`'s, and these are the floors:

| Package | Floor | Verified on PyPI at this snapshot |
|---|---|---|
| `certifi` | 2026.10.19 (advisory says 2026.10.18; 10.19 recommended for compatibility) | **2026.10.19** |
| `pip` | 26.2.2 | **26.2.2** |
| `uv` | 0.13.4 | **0.13.5** |
| `sigstore` | 4.5.1 | **4.5.1** |
| `conda` | 26.9.4 | distributed via conda channels — not verifiable on PyPI (`conda` there is a legacy 4.x package) |
| `pixi` | 0.82.1 | PyPI shows 1.0.1; the guidance's number refers to the installer channel — check `pixi --version` |

And the instruction that is easy to skip: **rebuild container images with layer caching disabled**,
or the "updated bundle" step is satisfied by a cached layer that still contains the old root.

Note the asymmetry this exposes in [`docs/03`](03-emudhra-ca.md): the intermediate keys were the
story; for Python the actionable change is a **root** removal, which breaks trust for anything still
chaining to it. Expect pinning failures after the upgrade; that is the check working.

## 5. PHP on EOL versions: unofficial backports exist

[`docs/01`](01-php2shell.md) and the README say PHP ≤ 8.1 has no official fix. That is still true,
but two community backports landed on 2026-10-22, and a reader on RHEL 6/7 will ask:

- **Oleksii Molchanov** ported the official minimal fix (php-src `712e60f9ed`, "Avoid state
  corruption via bailout", the 7.4 backport) to the vendor trees as
  `php-5.4.16-48.el7.php2shell.1` and `php-5.3.3-50.el6_10.php2shell.1`
  (<https://github.com/alvm/php2shell-eol-backport>), extending **Leon Lai**'s backports for Amazon
  Linux and PHP 7.3 on EL7.
- What they are: patches against the vendor source trees, built as distro packages.
- What they are **not**: vendor-supported updates. No distribution ships them, no advisory tracks
  them, and no CVE record will ever say "fixed" for those builds.

The honest position is the one [`docs/06`](06-lessons-and-gotchas.md) insists on: an unofficial
backport is a reasonable stop-gap **when you are the one who can review and rebuild it**, and it is
not "patched" in any reportable sense. If the choice is a public PHP 5.3 with a public RCE or a
reviewed backport, take the backport — and still plan the migration.

## 6. Still due today (nothing here changed)

| Item | Status at 10:36 JST | Action |
|---|---|---|
| **Plex** `CVE-2026-96654` / `-96656` | KEV deadline **today, 2026-10-23** | ≥ 1.43.3.10861; current release 1.43.5.11029 |
| **EG SiteGuard** `CVE-2026-106931` | KEV deadline **today** | vendor mitigations + forensic triage |
| **php2shell** | EPSS 5.31% / 5.76%, still not in KEV | patch; if PHP was exposed on 10-20/21, check for compromise |
| **Infinity Core** | fixed upstream, PoC public | `uname -r`, distro advisory, **reboot** ([`docs/20`](20-infinity-core.md)) |
| **Next.js** (if you run it) | two critical advisories, no CVE, today | 15.5.28 / 16.4.1 |
| **Python CA bundle** | floors published 2026-10-22 | `certifi` 2026.10.19, `pip` 26.2.2, rebuild images without cache |
| **Temurin** | 17.0.21+9 / 21.0.13+9 / 25.0.5+8 from 2026-10-22 | rebuild on those tags; 8 / 11 still August builds |

Unchanged and still newest: PHP 8.5.12 / 8.4.27 / 8.3.36 / 8.2.35; Node 26.12.1 / 24.22.1 /
22.23.4; GitLab 19.5.1; Tomcat 11.0.27 / 10.1.61; httpd 2.4.69; BIND 9.20.30 / 9.21.27; Oracle Java
21.0.13 / 17.0.21 / 11.0.33 / 8u511 / 25.0.5 / 27.0.1; kernel stable 7.2.12.

## 7. Reproduce

```bash
# the snapshot above
tools/intel/fetch-intel --date 2026-10-23-1036jst --recent-hours 24

# the three new sources on their own
tools/intel/fetch-intel --sources nvd-recent   --recent-hours 24 --out /tmp/broad
tools/intel/fetch-intel --sources nvd-modified --recent-hours 6  --out /tmp/broad
tools/intel/fetch-intel --sources ghsa         --recent-hours 24 --out /tmp/broad

# what a severity sweep misses: a CNA-only record is invisible to the filter
curl -s 'https://services.nvd.nist.gov/rest/json/cves/2.0?cveId=CVE-2026-98260' \
  | jq -r '.vulnerabilities[0].cve | "\(.vulnStatus) \(.metrics.cvssMetricV31[].type // "none")"'
```

NVD answers a 24-hour all-severity query in ~60 s and can exceed a single socket timeout, so the
collector asks in **6-hour slices**, sleeps 6 s between them (5 requests / 30 s without a key), and
retries with a backoff. A whole-day `nvd-modified` window is ~7 MB and unreliable without an API
key; 6 hours is what this snapshot uses, and it is enough to catch everything that changed since the
previous read.

## 8. Sources

- The snapshot: [`data/2026-10-23-1036jst/`](../data/2026-10-23-1036jst/) — 13 files, 2026-10-23
  01:36–02:2x UTC.
- NVD (published / modified / per-CVE):
  <https://services.nvd.nist.gov/rest/json/cves/2.0>
- GitHub Advisory Database: <https://api.github.com/advisories>
- oss-security feed: <https://seclists.org/rss/oss-sec.rss>; the two threads cited:
  <https://seclists.org/oss-sec/2026/q4/329> (PHP backports),
  <https://seclists.org/oss-sec/2026/q4/330> (Python / eMudhra)
- MSRC CVRF (re-issued): <https://api.msrc.microsoft.com/cvrf/v3.0/cvrf/2026-Oct>
- KEV: <https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json>
- Kernel releases: <https://www.kernel.org/releases.json>
- PyPI state: <https://pypi.org/pypi/certifi/json>, `…/pip/json`, `…/uv/json`, `…/sigstore/json`
- Infinity Core: [`docs/20`](20-infinity-core.md)
