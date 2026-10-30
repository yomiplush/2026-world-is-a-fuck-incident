# Research methodology

[English](research-methodology.md) · [日本語](research-methodology.ja.md)

This guide describes existing practices and inspectable examples, rather than a
claim that every historical snapshot uses an identical pipeline. The public
[About policy](https://www.infosec-briefing.net/about.en#research-methodology)
and [original source guide](08-intel-sources.md) provide editorial context.

## Collection and provenance

The [18:47 collector](../tools/intel/snapshot-1847.py), using the
[10:27 collector's request and NVD routines](../tools/intel/snapshot-1027.py),
queries fixed UTC windows separately for NVD publication and last modification,
without a severity filter. NVD pagination uses `startIndex` and `totalResults`.
GHSA queries separately cover published/modified and reviewed/unreviewed/malware,
following `Link` next-page URLs. Partial requests retain errors and completeness
flags. Do not turn a failure into an empty successful result.

The [dated collection manifest](../data/2026-10-27-1847/collection-summary.json)
records URLs, retrieval times, pages, hashes and errors. Saved response paths can
refer to unchanged originals in earlier directories. Do not copy or count those
references as additional independent evidence. The
[current dataset pointer](../data/latest.json) locates later registers and manifests;
it is a pointer, not an immutable snapshot.

## Primary-source evaluation and cross-referencing

Collection and indexing are scripted; editorial selection and interpretation are
not demonstrated to be fully automated. Vendor advisories, releases, public code,
CNA records and official incident updates are compared. Secondary reports provide
leads. CVE and GHSA identifiers and reference URLs connect records; these do not
always have a one-to-one relationship. Absence of a CVE does not exclude a package
advisory. Conflicting severity systems, affected ranges and patch availability
must retain their source attribution rather than being silently reconciled.

The [18:47 research notes](research-2026-10-27-1847.md) and
[collection notes](research-collection-2026-10-27-1847.md) document examples of
CNA/vendor discrepancies and unavailable bodies. A source-confirmed statement
should be distinguished from a researcher's reported observation and an
unconfirmed inference. A working laboratory exploit, a patch commit, a shipped
release, deployment, exploitation in the wild and recovery are different claims.

## Deduplication and classification

The [NVD index](../data/2026-10-27-1847/nvd-index.json) and
[structured register](../data/2026-10-27-1847/incident-register.json) retain IDs
and counts. Compare identifier sets across published/modified queries and NVD/GHSA;
do not add overlapping totals as new incidents. GHSA uses advisory IDs for its
own records; cross-source CVE intersections cannot account for advisories without
CVEs. Rejected records and unreviewed records need their status retained.

Register categories `delta`, `scope-complement` and `reference-only` distinguish
window updates, additional scope for earlier matters and references with uncertain
timing. These are editorial categories, not calibrated confidence or severity scores.
Later registers also label monitoring status; the
[October 29 English research](research-20261029T050117Z-dbf8f2.en.md)
explains that retained historical prose was not all revalidated.

## Time and integrity

Keep occurrence, detection, disclosure, database registration, revision, collection
cutoff, actual retrieval, fix availability and restoration separate. UTC query
windows and JST displays identify different representations of time; inclusive
boundaries may overlap adjacent windows. Date-only or unknown publication times
must not acquire invented precision. Retrieval after cutoff saves the then-current
revision, not necessarily the body that existed at cutoff.

Hash interpretation is manifest-specific. The October 27 main and supplemental
collectors hash decoded bodies, vendor records hash stored response bytes, and
discovery records have both stored and decoded hashes. The
[October 29 evidence manifest](../data/20261029T050117Z-dbf8f2/update-infosec-evidence.json)
hashes stored bytes, including gzip-compressed bytes, as described in its
[collection notes](research-collection-20261029T050117Z-dbf8f2.md).
A matching SHA-256 establishes integrity against the recorded digest, not factual
truth, upstream authenticity or completeness of coverage.

## Inspect and reproduce

From the repository root, with Python 3, no network or additional packages:

```sh
python3 tools/intel/verify-1847.py
python3 -m unittest discover -s tests -p evidence_manifest_test.py
```

The [dated verifier](../tools/intel/verify-1847.py) recomputes response hashes,
checks previous-file references, identifier overlaps, completeness flags and topic
counts. It writes derived `data/2026-10-27-1847/verification.json`.
The [current evidence tests](../tests/evidence_manifest_test.py) resolve the latest
pointer and verify stored evidence hashes, source mappings, API pagination and
translation consistency. These checks reproduce evidence and counting checks;
they do not reproduce exploitation or independently confirm every reported event.

For recollection, use a **separate checkout**: the following command accesses
upstream services and writes into the dated data directory:

```sh
python3 tools/intel/snapshot-1847.py
```

This only recollects that script's fixed window and sources. Other collections
have their own parameters; the October 29 notes describe reconfiguration of
`snapshot-1318.py`, not a standalone command to recreate all saved evidence.
Later upstream edits and rate limits can change responses. Compare new files to
saved evidence rather than replacing historical records in a contribution.

## Limits and corrections

Coverage is limited to selected sources and successful retrievals. Rate limits,
timeouts, redirects, anti-bot challenges and empty JavaScript shells can prevent
body verification even with HTTP success. Original records preserve such limits.
Unspecified fixed versions, unknown publication times, conflicting accounts and
unreviewed historical prose remain unknown. Absence from KEV or from this project
is not evidence of safety. This project is not a worldwide incident census.

[Issues](https://github.com/yomiplush/2026-world-is-a-fuck-incident/issues) should
identify the page, claim, primary source and retrieval date. Original code and
documentation use [MIT](../LICENSE); third-party originals retain their own rights.
