# Sources and re-fetch commands

Latest, October 26 **14:56 JST**: [fixed-window collection and technical findings](docs/research-collection-2026-10-26-1456.md), [vendor and domestic primary-source review](docs/research-2026-10-26-1456.md), [merged register](data/2026-10-26-1456/incident-register.json). Window **13:01–14:56 JST**: NVD 8 published / 11 modified (**8 overlap**), GHSA **0 newly published**; KEV remains 2026.10.23 with 1,756 records. **7 delta / 8 earlier-scope / 3 timestamp-unconfirmed reference groups** are editorial groups, not new incident counts.

**82 response records were hash-verified, including 15 references to unchanged previous originals.** [Database/feed provenance](data/2026-10-26-1456/collection-summary.json) / [vendor provenance](data/2026-10-26-1456-vendors/collection-summary.json) / [NVD index](data/2026-10-26-1456/nvd-index.json) / [feed index](data/2026-10-26-1456/feed-index.json). Re-fetch: `python3 tools/intel/snapshot-1456.py`. All responses were retrieved after cutoff and represent then-current revisions. PAN-OS JSON/CSAF timestamps disagree; the report preserves both. Same-day eMudhra, Douzone and VALTEC follow-ups lack a reliable publication time and remain reference-only. GHSA 0 does not mean no existing-advisory edits. Earlier records below are historical.

Previous, October 26 13:01 JST: [primary research](docs/research-2026-10-26-1301.md), [structured register](data/2026-10-26-1301/incident-register.json), [all query URLs, retrieval times and 46 response hashes](data/2026-10-26-1301/collection-summary.json). Window 10:27–13:01 JST: NVD8 published/20 modified; GHSA13, overlapping. Retrieved after13:04 JST; date-only VALTEC follow-up is reference-only. Earlier records below are historical.

Previous, October 26 10:27 JST: [review](docs/29-snapshot-20261026-1027.md), [primary research](docs/research-2026-10-26-1027.md), [fixed window and overlap](docs/research-collection-2026-10-26-1027.md), [URLs/times/SHA-256](data/2026-10-26-1027/collection-summary.json). Re-fetch: `python3 tools/intel/snapshot-1027.py`; retrieval-time revisions do not reconstruct historical edits.


Previous nightly delta: [23:18 review](docs/28-snapshot-20261025-2318.md), [Tailworm](docs/27-tailworm.md), [URLs/times/hashes](data/2026-10-25-2318/collection-summary.json), [87-record index](data/2026-10-25-2318/nvd-index.json). Re-fetch: `python3 tools/intel/snapshot-2318.py`.

Latest fixed-window queries, retrieval times and sources: [October 25 review](docs/25-snapshot-20261025.md), [research](docs/research-2026-10-25.md), [packages](docs/research-packages-2026-10-25.md), [query URLs](data/2026-10-25/collection-summary.json).

[**English**](SOURCES.md) | [日本語](SOURCES.ja.md)

**Rule**: primary sources only (vendor advisories, APIs, repositories). When secondary reporting is
used, it is marked **(secondary)** in the text. Material whose provenance cannot be verified is not
used at all.

## Primary sources

| Subject | URL | What it tells you | Re-fetch |
|---|---|---|---|
| PHP advisory | <https://www.php.net/archive/2026.php#2026-10-21-5> | Official description of both CVEs and **the mitigations that actually work** | browser |
| PHP releases | <https://www.php.net/releases/index.php?json&version=8.3> | Fixed versions (8.2–8.5) | `curl -s 'https://www.php.net/releases/index.php?json&version=8.3'` |
| php-src NEWS | <https://raw.githubusercontent.com/php/php-src/PHP-8.3.36/NEWS> | Fix summary ("Avoid state corruption via bailout") | same URL |
| NVD (109618) | <https://services.nvd.nist.gov/rest/json/cves/2.0?cveId=CVE-2026-109618> | CVSS and official description | `curl -s '…' \| jq` |
| NVD (date range) | <https://services.nvd.nist.gov/rest/json/cves/2.0> | Criticals in a window | `?pubStartDate=…&pubEndDate=…&cvssV3Severity=CRITICAL` |
| CISA KEV | <https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json> | Confirmed exploitation and deadlines | `curl -s <URL> \| jq '.vulnerabilities\|length'` |
| CISA advisories | <https://www.cisa.gov/cybersecurity-advisories/all.xml> | The PHP emergency alert, #StopRansomware | `curl -s <URL>` |
| Node.js advisory | <https://nodejs.org/en/blog/vulnerability/october-2026-security-releases> | CVE list, severities, dependency updates | browser |
| Node.js release index | <https://nodejs.org/dist/index.json> | Latest version per line and build date | `curl -s <URL> \| jq -r '.[0:3][]\|"\(.version) \(.date)"'` |
| NodeSource (deb) | <https://deb.nodesource.com/node_22.x/dists/nodistro/main/binary-amd64/Packages.gz> | Whether the package repo caught up | `curl -s <URL> \| zcat \| grep -A2 '^Package: nodejs'` |
| Arch package | <https://archlinux.org/packages/extra/x86_64/nodejs/json/> | Repository version | `curl -s <URL> \| jq -r '.pkgver'` |
| Red Hat (eMudhra) | <https://access.redhat.com/security/vulnerabilities/RHSB-2026-012> | CA compromise preconditions, impact, response | browser |
| MSRC CVRF | <https://api.msrc.microsoft.com/cvrf/v3.0/cvrf/2026-Oct> | The exploited CVE in the October batch | `curl -s <URL>` |
| NCSC-NL | <https://github.com/NCSC-NL/php2shell> | CERT-EU operational info and affected-product list | `curl -s <raw README>` |
| Sansec | <https://sansec.io/research/php2shell> | Attack chain, multipart, memory disclosure | browser |
| Cloudflare | <https://blog.cloudflare.com/php-vulnerabilities-waf-protection> | Attacker attempts before the fix | browser |
| Docker Hub API | <https://hub.docker.com/v2/repositories/<owner>/<repo>/tags> | Whether an image was rebuilt | `curl -s <URL> \| jq` |

### Oracle Java (`docs/07`)

| Subject | URL | What it tells you | Re-fetch |
|---|---|---|---|
| Oracle CPU October 2026 | <https://www.oracle.com/security-alerts/cpuoct2026.html> | The 55 Java SE patches, CVSS, affected versions, Notes 1/2/3, bulk CVE fixes | `tools/intel/fetch-intel --sources oracle` |
| Oracle release notes | `https://www.oracle.com/java/technologies/javase/<version>-relnotes.html` | **Release date and build string of the fixed build** (e.g. `21-0-13`) | browser |
| IPA alert (Japan) | <https://www.ipa.go.jp/security/security-alert/2026/1021-jre.html> | Japanese list of affected versions and the fix (2026-10-21) | browser |
| Adoptium API | <https://api.adoptium.net/v3/assets/latest/21/hotspot?architecture=x64&image_type=jdk&os=linux> | Whether third-party builds (Temurin) have caught up | `curl -s <URL> \| jq -r '.[0].release_name'` |
| Adoptium releases | <https://api.adoptium.net/v3/info/available_releases> | LTS and current feature lines | `curl -s <URL>` |
| NVD (one Java CVE) | <https://services.nvd.nist.gov/rest/json/cves/2.0?cveId=CVE-2026-91484> | Filer and publication time cross-check | `curl -s <URL> \| jq` |

### Feeds used by `docs/08`

| Subject | URL | What it tells you |
|---|---|---|
| CISA KEV | <https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json> | Confirmed exploitation, deadlines, catalog version |
| CISA advisories | <https://www.cisa.gov/cybersecurity-advisories/all.xml> | Official alerts, ICS, #StopRansomware |
| MSRC CVRF | <https://api.msrc.microsoft.com/cvrf/v3.0/cvrf/2026-Oct> | Monthly CVEs with `Exploited` / `Publicly Disclosed` |
| JVN feed | <https://jvn.jp/rss/jvn.rdf> | Japanese advisories and coordination (not JVN iPedia) |
| JPCERT/CC | <https://www.jpcert.or.jp/rss/jpcert.rdf> | Weekly roundups, domestic coordination |
| Project Zero | <https://googleprojectzero.blogspot.com/feeds/posts/default?alt=rss> | Primary analysis of vulnerability classes |
| PortSwigger Research | <https://portswigger.net/research/rss> | Web attack technique |
| Trail of Bits | <https://blog.trailofbits.com/feed/> | Audits, supply chain |
| GitHub Security Lab | <https://github.blog/security/feed/> | Secrets, code scanning |
| Unit 42 | <https://unit42.paloaltonetworks.com/feed/> | Exploitation status, IR |
| Cisco Talos | <https://blog.talosintelligence.com/rss/> | Campaigns, exploit analysis |
| Microsoft Security | <https://www.microsoft.com/security/blog/feed/> | Nation-state, cloud |
| SANS ISC | <https://isc.sans.edu/rssfeed.xml> | Practitioner triage |
| The DFIR Report | <https://thedfirreport.com/feed/> | Full intrusion walkthroughs |
| Citizen Lab | <https://citizenlab.ca/feed/> | Spyware, policy research |
| **oss-security** | <https://seclists.org/rss/oss-sec.rss> | **Where a coordinated disclosure lands when the embargo ends** — added 2026-10-23 after it carried "Infinity Core" (`docs/20`) and four items no other feed had |
| **Imperva Threat Research** | <https://www.imperva.com/blog/feed/> | Red-team demonstrations against stock builds, and first-24-hours attack telemetry (`docs/22`) |
| **Trade press** (THN, BleepingComputer) | <https://feeds.feedburner.com/TheHackersNews>, <https://www.bleepingcomputer.com/feed/> | The lead channel: names the incident and the vendor. **Secondary** — follow the link it prints |
| **X posts** (tracked) | `https://cdn.syndication.twimg.com/tweet-result?id=<id>&token=a` | The post text and the links it pushed, archived; the post is a lead, the link is the citation |

All feeds at once: `tools/intel/fetch-intel --sources feeds`; news and the archived post are
`--sources news` and `--sources x`.

### Broad sweeps (`docs/21`)

| Subject | URL | What it tells you | Re-fetch |
|---|---|---|---|
| NVD, published in a window, **all severities** | `https://services.nvd.nist.gov/rest/json/cves/2.0?pubStartDate=…&pubEndDate=…` | what appeared, without a severity filter hiding the HIGH band | `tools/intel/fetch-intel --sources nvd-recent --recent-hours 24` |
| NVD, `lastModified` window | `…?lastModStartDate=…&lastModEndDate=…` | **what NVD changed** — the sweep that catches a rescore (9.8 → 8.1) on its own | `--sources nvd-modified --recent-hours 6` |
| GitHub Advisory Database | <https://api.github.com/advisories> | npm / pip / Go / Maven advisories with patched versions, **including ones with no CVE** | `--sources ghsa --recent-hours 24` |
| Kernel CVE announcements | <https://lists.openwall.net/linux-cve-announce/> | per-CVE `Fixed in <stable> with commit <sha>` lines | browser / list archive |
| kernel.org release index | <https://www.kernel.org/releases.json> | current mainline / stable / longterm versions | `curl -s <URL> \| jq -r '.releases[:5][]\|"\(.moniker) \(.version)"'` |

NVD answers a 24-hour all-severity query in ~60 s and returns up to 2,000 rows per page; the
collector asks in **6-hour slices** for that reason, and a whole-day `lastModified` window (~7 MB) is
unreliable without an API key.

### PHP's follow-on advisory (`docs/23`)

| Subject | URL | What it tells you | Re-fetch |
|---|---|---|---|
| PHP news archive, entry `2026-10-23-1` | <https://www.php.net/archive/2026.php#2026-10-23-1> | **the whole public advisory** for `CVE-2026-115560`: four conditions, one mitigation, no versions, no score, no fix | `tools/intel/fetch-intel --sources php` |
| PHP release state per line | <https://www.php.net/releases/index.php?json&version=8.5> (8.2 / 8.3 / 8.4) | whether anything newer than the 10-21 security release exists | same |
| NVD, `CVE-2026-115560` | <https://services.nvd.nist.gov/rest/json/cves/2.0?cveId=CVE-2026-115560> | **0 results** on 2026-10-23 — an absence worth storing | `curl -s <URL> \| jq .totalResults` |
| `GHSA-6wmf-4rv5-p3rp` | <https://github.com/php/php-src/security/advisories/GHSA-6wmf-4rv5-p3rp> | the 10-21 advisory whose mitigation this one reuses (it is **not** an advisory for 115560) | browser / GitHub API |
| CISA KEV catalog | <https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json> | catalog version `2026.10.21`, which predates the CVE — absence proves nothing | `--sources kev` |

### Node2Shell, and exploitation before disclosure (`docs/22`)

| Subject | URL | What it tells you | Re-fetch |
|---|---|---|---|
| Imperva, Node2Shell | <https://www.imperva.com/blog/node2shell-from-brotli-data-to-remote-code-execution/> | the PoC against the stock 24.22.0 arm64 image, both reachable paths, the pinned middleware versions, what was **not** tested | browser / `--sources feeds` |
| The X post | <https://x.com/TheHackersNews/status/2113538808126038500> | timestamp of the lead and the article it pushed (2026-10-23 07:51 UTC) | `--sources x` (archives it) |
| Node.js advisory | <https://nodejs.org/en/blog/vulnerability/october-2026-security-releases> | `CVE-2026-111497`, severity, fixed versions | browser |
| AWS, MadPot telemetry | <https://aws.amazon.com/blogs/security/amazon-threat-intelligence-identifies-php2shell-exploitation-prior-to-public-disclosure-in-madpot/> | **exploitation attempt dated 2026-10-17**, PoCs from 10-21 02:00 UTC, IOCs, "investigate from 10-17" | browser |
| Imperva, php2shell first 24 h | <https://www.imperva.com/blog/php2shell-early-attack-activity-through-impervas-lens/> | 482,342 requests / 122,311 sessions / 21,998 sites / 103 countries; **attempts**, not compromises | browser / `--sources feeds` |
| Sophos | <https://www.sophos.com/en-us/blog/proof-of-concept-exploit-released-for-php-vulnerabilities-109618-109619> | the Potassium Mirai variant, C2, and that the attempts were **unsuccessful** | browser |
| Dataminr TRACE | <https://www.dataminr.com/resources/intel-brief/continued-analysis-of-core-php-vulnerabilities/> | "no known compromises" as of 10-22 | browser |
| Arista advisory 0199 | <https://www.arista.com/en/support/advisories-notices/security-advisory/24838-security-advisory-0199> | `CVE-2026-114625`: 9.9, minimum role, fixed releases, IOCs | browser (the page 406s a plain curl) |
| Capcom, CAPCOM ID | <https://www.capcom.co.jp/ir/news/html/261022.html> | 11,774,247 records, 43 / 196 subsets, the 10-19 → 10-21 timeline | browser |
| Onamae.com Desktop Cloud | <https://www.onamae.com/news/article/11584> | up to 26,739 servers, suspension from 2026-10-21 04:00 JST, rotation advice | browser |

### GitLab, LiteLLM, Railway, OpenCode (`docs/09`-`docs/11`)

| Subject | URL | What it tells you | Re-fetch |
|---|---|---|---|
| GitLab patch release | <https://docs.gitlab.com/releases/patches/patch-release-gitlab-19-5-1-released/> | CVE-2026-110264: 10.0 vector, impacted ranges, the two detections | `tools/intel/fetch-intel --sources gitlab` |
| GitLab detection framework | <https://docs.gitlab.com/security/detecting_security_incidents/> | how the Sigma rules are meant to be deployed | browser |
| LiteLLM incident write-up | <https://github.com/BerriAI/litellm/issues/47826> | wheel hashes, payload files, IOCs, remediation order | `tools/intel/fetch-intel --sources litellm` |
| PyPI release state | <https://pypi.org/pypi/litellm/json> | whether 1.107.0 is really gone (file count 0) | `curl -s <URL> \| jq` |
| Railway disclosure | <https://blog.railway.com/p/security-disclosure-wednesday-october-21st> | what was accessed, the rotation list, deploy pause | browser |
| Railway status | <https://status.railway.com> | incident timeline as it was published | browser |
| OpenCode incident reports | <https://github.com/anomalyco/opencode/issues/56833> | user-side evidence of the key revocation (no vendor advisory exists) | browser |
| OpenCode repo leak | <https://github.com/anomalyco/opencode/issues/56819> | committed secret confirmed by the project's own bot | browser |

### Plex and the recent-critical sweep (`docs/12`, `docs/13`)

| Subject | URL | What it tells you | Re-fetch |
|---|---|---|---|
| CISA CSAF library (2026) | <https://github.com/cisagov/CSAF/tree/develop/csaf_files/IT/white/2026> | machine-readable advisories, often before NVD has analysis | `tools/intel/fetch-intel --sources csaf` |
| CSAF VA-26-266-01 (Plex) | <https://raw.githubusercontent.com/cisagov/CSAF/develop/csaf_files/IT/white/2026/va-26-266-01.json> | the five CVEs and the fixed version | same |
| Plex vendor notice | <https://forums.plex.tv/t/important-security-update-for-plex-media-server-v1-43-2-and-earlier/942319> | per-platform update steps, NAS package-lag warning | browser |
| NVD API, severity filter | <https://services.nvd.nist.gov/rest/json/cves/2.0?cvssV3Severity=CRITICAL&pubStartDate=2026-10-08T00:00:00.000&pubEndDate=2026-10-22T23:59:59.999> | the CRITICAL sweep itself | `tools/intel/fetch-intel --sources nvd-critical` |
| EPSS API | <https://api.first.org/data/v1/epss?cve=CVE-2026-96656> | exploitation probability (lags on new CVEs) | same |
| KEV filter for Plex | <https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json> | due dates and the chain note | `jq '.vulnerabilities[]\|select(.vendorProject=="Plex")'` |

### The CA compromise (`docs/03`)

| Subject | URL | What it tells you |
|---|---|---|
| Google (Chrome Root Program) | <https://blog.google/security/protecting-chrome-and-android-users-from-compromised-emudhra-intermediate-ca-certificates/> | SPKI blocking, CT statement, root removal |
| Mozilla Security Blog | <https://blog.mozilla.org/security/2026/10/20/protecting-firefox-users-following-the-compromise-of-emudhra-intermediate-certificates/> | OneCRL / NSS response |
| Cisco Talos (2026-10-21) | <https://blog.talosintelligence.com/compromised-intermediate-certificates/> | the eight certs with CCADB ids, the ceremony and wrap/unwrap cause, Microsoft's block, Go's CVE and versions |
| Mozilla bug 2083449 | <https://bugzilla.mozilla.org/show_bug.cgi?id=2083449> | the certificate table Talos reproduces |
| Informal advisory site | <https://emudhra.we-have-a-problem.com/> | the signed "We have a problem here – Wayne" page |
| ISC advisory CVE-2026-94300 | <https://kb.isc.org/docs/cve-2026-94300> | severity, affected/fixed versions, "no workarounds", credit |
| CVE.org / NVD (CVE-2026-94300) | <https://www.cve.org/CVERecord?id=CVE-2026-94300> · <https://nvd.nist.gov/vuln/detail/CVE-2026-94300> | CNA text, CVSS 8.1, affected ranges |
| Phoronix (2026-10-22) | <https://www.phoronix.com/news/LKML-New-Trend-Vulnerabilities> | **secondary**: the six ZDI reports on the public LKML, with links to each |
| LKML reports (lore.kernel.org) | <https://lore.kernel.org/lkml/> | the primary messages — **Anubis proof-of-work blocks automated fetch** (recorded 2026-10-22) |
| Ars Technica (2026-10-20) | <https://arstechnica.com/security/2026/10/the-internet-goes-on-high-alert-after-discovery-of-8-compromised-tls-certs/> | **secondary**: the eight key values, Valsorda's Heartbleed comparison, the long-tail list |
| eMudhra statement | <https://emudhra.com/en/post/certificate-security-incident> | vendor scope claims, and Mozilla's timeline quoted |
| Scott Helme | <https://scotthelme.co.uk/eight-bits-of-trust-emudhras-ca-keys-cracked-in-milliseconds/> | recovery of all eight keys; the small-integer cause |
| Go issue / commit | <https://github.com/golang/go/issues/82345> | CVE-2026-111943, URGENT track, denylist behaviour |
| certifi | <https://pypi.org/pypi/certifi/json> | shipped version 2026.10.19 |

## Secondary (always marked as such in the text)

| Outlet | Used for |
|---|---|
| The Record | PHP Foundation statement, discovery history, sites taken offline |
| Krebs on Security | Ransomware-negotiation firm and ShinyHunters, sanctions |
| The Hacker News and others | Reporting on the number of eMudhra keys; the GitLab, LiteLLM and Railway articles linked from `docs/09`-`docs/11` |
| vx-underground (social post, 2026-10-22) | Used only as an index of the week's items in `docs/11`; every row is checked against a primary source |

## Assume a source will fail

Primary sources go down. Measured on 2026-10-22:

| Symptom | What was observed | Use instead |
|---|---|---|
| JVN iPedia / MyJVN API | `jvndb.jvn.jp/myjvn?...` returned a 384-byte HTML page titled メンテナンス中, not XML | the `jvn.jp` advisory feed, IPA pages |
| MSRC blog `/feed` | returned `text/html` with HTTP 200 and zero items | `microsoft.com/security/blog/feed/`, CVRF API |
| NVD analysis pending | Oracle's October CVEs are `Awaiting Analysis` | the vendor risk matrix |
| Vendor build lag | Temurin still on August builds two days after Oracle — then shipped 17 / 21 / 25 the next day | that vendor's own release notes, checked on the day you act |
| Arista advisory pages | returned **HTTP 406** to a plain fetch (2026-10-23) | NVD's record for `CVE-2026-114625` plus the press summary; see `docs/22` §4 |
| Sophos blog | HTTP/2 stream reset, then a timeout (2026-10-23) | The Hacker News' quotation of it, marked as secondary in `docs/22` §3 |
| Dataminr brief | **403** (2026-10-23) | BleepingComputer's summary, marked as secondary |

`tools/intel/fetch-intel` writes the sources that worked and exits `10` on partial failure
(`0` all, `2` nothing).

## How to check a number

When a figure looks wrong, doubt it in this order:

1. **The unit** ("1,400 vulnerabilities" vs "2,578 CVE entries")
   → pull the CVRF and look at both `grep -c 'CVE-'` and `sort -u`
2. **The date** (publication, build and changelog dates differ)
   → match on version numbers
3. **The basis for "patched"** (a tag, or the running binary)
   → `docker exec <c> php -v` / `node -v`
4. **Whether it is actually exploited** (in KEV, or a vendor saying "observed")
   → read the KEV JSON and the vendor's wording

## Snapshot in this repository

`data/2026-10-22/` holds the raw responses as retrieved, `data/2026-10-23-2015jst/` the broad read
(15 files), and `data/2026-10-23-2235jst/` the PHP follow-on (5 files). Re-fetch with
`tools/intel/fetch-intel --date <name>` (see `docs/08`).

| File | Origin | Transformed? |
|---|---|---|
| `oracle-java-oct2026.json` | Oracle CPU Java SE risk matrix, parsed as a table | structured only; values as published |
| `kev-recent.json` | CISA KEV JSON, entries since 2026-09-22 | filtered only |
| `kev-catalog.json` | same feed | metadata only |
| `msrc-2026-oct.json` | MSRC CVRF (XML) | summary plus every entry |
| `jvn-recent.json` | JVN RDF | extracted |
| `researcher-feeds.json` | the 13 feeds | extracted |
| `nvd-recent.json`, `php-all.json`, `node-latest-lines.txt`, `ncsc.md` | public APIs / distribution files | response as-is |

`ncsc.md` is a verbatim copy of NCSC-NL's README, so its relative links point at that
repository, not at this one. Counts are as of retrieval: an MSRC CVRF that is re-issued moves
them (`docs/05` recorded 2,578; the 2026-10-21 re-issue yielded 2,575; 2026-10-22, 2,584). The
same applies to NVD scores — `CVE-2026-109619` moved 9.8 → 8.1 the day after publication.


## 2026-10-24 — Broad update

[24 reviewed groups, collection windows and 17 KEV rows](docs/24-snapshot-20261024.md) · [Primary-source research](docs/research-2026-10-24.md) · [Structured register](data/2026-10-24/incident-register.json)

Primary evidence: [Collabora](https://github.com/CollaboraOnline/online/security/advisories/GHSA-g3vx-3m76-fghh), [Arista](https://www.arista.com/en/support/advisories-notices/security-advisory/24838-security-advisory-0199), [Ruby](https://www.ruby-lang.org/en/news/2026/10/23/regexp-fixes-for-gitlab-cves/), [HPE CSAF](https://csaf.arubanetworking.hpe.com/2026/hpe_networking_-_hpesbnw05162.json), [JPCERT](https://www.jpcert.or.jp/at/2026/at260030.html). Per-incident URLs and evidence are archived in [data/2026-10-24](data/2026-10-24/).
