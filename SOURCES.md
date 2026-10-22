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

## Secondary (always marked as such in the text)

| Outlet | Used for |
|---|---|
| The Record | PHP Foundation statement, discovery history, sites taken offline |
| Krebs on Security | Ransomware-negotiation firm and ShinyHunters, sanctions |
| The Hacker News and others | Reporting on the number of eMudhra keys |

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

`data/2026-10-22/` holds the raw responses as retrieved. Re-fetch commands are in the table above.
The JSON files are unmodified responses from the public CISA / NVD / php.net APIs.
`ncsc.md` is a verbatim copy of NCSC-NL's README, so its relative links point at that
repository, not at this one.
