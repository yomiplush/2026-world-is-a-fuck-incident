# Apache, October 2026 — three projects, one lesson about severity labels

[English](15-apache-oct2026.md) | [**日本語**](15-apache-oct2026.ja.md)

Apache's October output is a useful counter-example to the rest of this repository: the CVEs are
real, several are serious, and **none of them are in CISA KEV**. It is also where vendor severity
labels and CVSS disagree most visibly, in the same project family.

Everything below is taken from the projects' own security pages (`tomcat.apache.org`,
`httpd.apache.org`) or from NVD records filed by `security@apache.org`. OpenCVE's vendor listing
was used only to find the candidates — it reports **3,832** Apache CVEs in total, which is why an
unfiltered feed is useless as a starting point.

## 1. Tomcat — three "Important" fixes, same day, three branches

Public **2026-10-20**, fixed in **11.0.27 / 10.1.61 / 9.0.123**.

| CVE | Apache label | CVSS | What it is | Affects (11.0 line) |
|---|---|---|---|--|
| `CVE-2026-101296` | **Important** | 4.0 **9.1** | JNDIRealm with a non-GSSAPI SASL mechanism **fails open**: an attacker authenticates without the correct password | 11.0.0-M1 → 11.0.26 |
| `CVE-2026-101356` | **Important** | 3.1 **9.1** | incorrect object recycling in **HTTP/2 async servlets** → request/response mix-up **between users** | 11.0.22 → 11.0.26 |
| `CVE-2026-103119` | **Important** | — | **AJP** response mix-up: a buffer under-read splits a response body across two requests, leaking data from the first into the second | 11.0.0-M25 → 11.0.26 |
| `CVE-2026-93446` | Low | — | TLS 1.3 connections fail intermittently | 11.0.0-M21 → 11.0.26 |
| `CVE-2026-88041` | Low | — | HTTP/2 trailer information leaks into the next request | — |
| `CVE-2026-74049` | Low | — | Jasper JSTL `<c:redirect>` does not stop page processing | — |
| `CVE-2026-74048` | Low | — | FIPS activation failure falls back to non-FIPS JSSE | — |

Read the first three together. They are three different mechanisms with the same outcome:
**one user's request or response crossing into another user's**. For a multi-tenant application
that is the worst failure mode there is, and it is why "Important" here is not the same as
"moderate". `CVE-2026-101296` is a straight authentication bypass under a specific realm
configuration; the other two are data-mixup bugs.

**The practical problem is not patching, it is knowing your version.** Most Tomcat in the world
is not installed as Tomcat — it is embedded in Spring Boot, an appliance, or a vendor product,
and the version string never appears in `dpkg -l`.

```bash
# standalone
/opt/tomcat/bin/version.sh 2>/dev/null | head -3
# inside a running JVM (Spring Boot embedded Tomcat, fat jars)
java -jar app.jar --debug 2>/dev/null | grep -i "tomcat" | head -3
# running process
jcmd <pid> VM.system_properties 2>/dev/null | grep -Ei "tomcat|server.info"
# packaged
dpkg -l | awk '/tomcat/ {print $2, $3}'
```

## 2. Apache HTTP Server 2.4.69 — "low" that scores 7.5

Released **2026-10-01**. Two fixes matter on 2.4.x:

| CVE | Apache label | CVSS (NVD) | What it is | Affects |
|---|---|---|---|--|
| `CVE-2026-56154` | low | — | **mod_rewrite use-after-free** via `%{LA-U:HTTP:...}` lookahead | 2.4.0 → 2.4.68 |
| `CVE-2026-56449` | low | **7.5** | **mod_proxy_html out-of-bounds write** with a crafted response body | 2.4.68 |

Apache rates both **low**; NVD scores `CVE-2026-56449` at **7.5**. Both are correct on their own
terms: Apache's label reflects "needs a specific configuration and a crafted upstream", NVD's
score assumes the component is reachable with attacker-influenced input. If you operate
mod_rewrite or mod_proxy_html in front of untrusted upstreams, the NVD reading is the one that
matches your exposure. **This is the same trap as [`docs/13`](13-recent-criticals.md) §5.1**, and
it appears inside a single vendor family in a single month.

## 3. Traffic Server — request smuggling by two routes

Published **2026-10-21**, both filed by `security@apache.org`:

| CVE | CVSS 3.1 | CVSS 4.0 | What it is |
|---|--:|--:|---|
| `CVE-2025-31699` | **8.9** | 9.1 | an origin connection is returned to the shared pool while the origin is still waiting for a request body the client declared but never sent (including `Expect: 100-continue`) → the next request on that connection is read by the wrong party |
| `CVE-2025-55702` | **8.7** | 7.0 | with `Expect: 100-continue`, a body the origin never read is parsed as the **next request** — exploitable by an attacker behind a front-end proxy that shares connections |
| `CVE-2026-112381` | 5.9 | 8.2 | null-pointer dereference crash (DoS) when a client POST is half-closed during chunked reparse |

Two of the three are **request smuggling**, the class that turns a shared connection pool into a
cross-user channel. Note the version numbers: two CVEs are `CVE-2025-*` published in **October
2026** — disclosure lag is real, and a "2025" prefix does not mean "old news".

## 4. The rest of the Apache batch (aggregator only)

These appeared in the same window on OpenCVE but were **not** cross-checked against the project
pages for this document, so they are listed without severity claims:

| Project | CVE | OpenCVE score |
|---|---|--|
| Johnzon | `CVE-2026-71253` | 9.8 |
| Kylin | `CVE-2026-108743` | 8.8 |
| Cocoon | `CVE-2026-108086` … `-108089` | 7.5 (one of four) |
| CouchDB | `CVE-2026-86471`, `-90797` … `-90800` | not scored |
| Airflow (Amazon / Keycloak providers) | `CVE-2026-86467`, `-96806` | 5.8 |
| Arrow C++ / PyArrow | `CVE-2026-92287` | 4.7 |

Treat this table as a to-do list for the *project* pages, not as evidence.

## 5. What is actually actionable

1. **Tomcat → 11.0.27 / 10.1.61 / 9.0.123.** Find every embedded copy, not just installed ones.
   "Important" with an auth bypass and two cross-user mix-ups, made public 2026-10-20, is the
   one row here worth today.
2. **httpd → 2.4.69** if you run mod_rewrite with lookahead or mod_proxy_html.
3. **Traffic Server** — if you operate a CDN/cache tier, two of these are smuggling; check the
   project advisory for fixed versions before assuming your build is out of range.
4. **KEV is empty for all of them** (checked 2026-10-22; the only Apache entry added in the last
   30 days is `CVE-2016-3081` Struts, a 2016 CVE added retroactively). That does not make them
   optional — it means no one has published exploitation yet, which for a cross-user data bug is
   exactly the state where you do not want to be the first evidence.

## 6. Sources

- Tomcat security pages (labels, affected ranges, fixed versions, commits):
  <https://tomcat.apache.org/security-11.html> · <https://tomcat.apache.org/security-10.html> ·
  <https://tomcat.apache.org/security-9.html>
- httpd 2.4 vulnerabilities (labels, affected ranges, 2.4.69):
  <https://httpd.apache.org/security/vulnerabilities_24.html>
- NVD records filed by `security@apache.org`:
  <https://services.nvd.nist.gov/rest/json/cves/2.0?cveId=CVE-2026-101356> (and the other ids)
- KEV check: <https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json>
- Candidate discovery (aggregator, 3,832 CVEs — index only):
  <https://app.opencve.io/cve/?vendor=apache>
