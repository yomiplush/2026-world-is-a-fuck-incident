# Sources and re-fetch commands

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

All feeds at once: `tools/intel/fetch-intel --sources feeds`.

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

`data/2026-10-22/` holds the raw responses as retrieved. Re-fetch everything with
`tools/intel/fetch-intel --date 2026-10-22` (see `docs/08`).

| File | Origin | Transformed? |
|---|---|---|
| `oracle-java-oct2026.json` | Oracle CPU Java SE risk matrix, parsed as a table | structured only; values as published |
| `kev-recent.json` | CISA KEV JSON, entries since 2026-09-22 | filtered only |
| `kev-catalog.json` | same feed | metadata only |
| `msrc-2026-oct.json` | MSRC CVRF (XML) | summary plus every entry |
| `jvn-recent.json` | JVN RDF | extracted |
| `researcher-feeds.json` | the 12 feeds | extracted |
| `nvd-recent.json`, `php-all.json`, `node-latest-lines.txt`, `ncsc.md` | public APIs / distribution files | response as-is |

`ncsc.md` is a verbatim copy of NCSC-NL's README, so its relative links point at that
repository, not at this one. Counts are as of retrieval: an MSRC CVRF that is re-issued moves
them (`docs/05` recorded 2,578; the 2026-10-21 re-issue yielded 2,575; 2026-10-22, 2,584). The
same applies to NVD scores — `CVE-2026-109619` moved 9.8 → 8.1 the day after publication.
