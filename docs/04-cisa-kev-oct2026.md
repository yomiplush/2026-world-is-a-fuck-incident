# CISA KEV — additions from 14 to 20 October 2026

[**English**](04-cisa-kev-oct2026.md) | [日本語](04-cisa-kev-oct2026.ja.md)

CISA KEV (Known Exploited Vulnerabilities) is the catalogue of vulnerabilities with **confirmed
real-world exploitation**. US federal agencies have deadlines; everyone else can use it as the most
practical filter for "what to fix right now". 1,754 entries as of 2026-10-21.

## 1. New entries (with deadlines)

| Added | CVE | Product | Due | Detail |
|---|---|---|---|---|
| 10-20 | CVE-2026-96656 | Plex Media Server | **10-23** | An admin user can write arbitrary files that are executed on load |
| 10-20 | CVE-2026-96654 | Plex Media Server | **10-23** | Improper neutralisation of encoded URI schemes; can call other plugins' functions with attacker-supplied parameters |
| 10-20 | CVE-2026-96655 | Plex Media Server | 11-03 | SSRF via the `/video/:/transcode/universal` path parameter |
| 10-20 | CVE-2026-96652 | Plex Media Server | 11-03 | SSRF; any `X-Plex-Token` value plus a full URL in `protocol` makes the server POST to an attacker-chosen destination |
| 10-20 | CVE-2026-106931 | EG Secure Solutions SiteGuard | — | OS command injection |
| 10-20 | CVE-2026-110936 | Siemens Software Center | — | Uncontrolled search path element |
| 10-16 | CVE-2026-102764 | BeyondTrust Remote Support | 10-19 (**overdue**) | Authentication bypass by spoofing; remote file operations on the appliance |
| 10-16 | CVE-2025-61624 | Fortinet multiple products | — | Path traversal |
| 10-15 | CVE-2026-21589 | Atlassian multiple products | — | Files/directories accessible to external parties |
| 10-14 | CVE-2026-0322 | Palo Alto PAN-OS | 10-17 (**overdue**) | Code injection; an authenticated network-reachable attacker executes arbitrary code as root |
| 10-14 | CVE-2026-76519 | Cisco Secure Email Gateway | — | Relative path traversal |
| 10-14 | CVE-2026-105133 | Ahsay AhsayCBS | — | Improper authentication |
| 10-14 | CVE-2026-105134 | Ahsay AhsayCBS | — | Command injection |

## 2. Treat the four Plex CVEs as one attack

The KEV descriptions cross-reference each other:

1. **CVE-2026-96652 / 96655 (SSRF)** — the foothold; the server makes requests where you choose
2. **CVE-2026-96654 (URI schemes)** — call other plugins' functions with chosen parameters
3. **CVE-2026-96656 (file write)** — the written file executes on load

Plex tends to sit on a home LAN, which invites "it is not on the internet, so it is fine". **SSRF
makes it a stepping stone to other LAN services**, so not being internet-facing does not lower the
priority. The 10-23 deadline assumes the vendor fix is available.

## 3. How to use the list

KEV is a **priority argument**, not a completeness list.

```bash
curl -s https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json \
  | jq -r '.vulnerabilities | sort_by(.dateAdded) | reverse | .[0:15][]
           | "\(.dateAdded)  \(.cveID)  \(.vendorProject) \(.product)  due:\(.dueDate)"'
```

Filter in this order:

1. **Do you run the product?** (A 10.0 in a product you do not own is worth zero to you)
2. If yes, **is it exposed?** (If not, lower the priority)
3. Is it **confirmed exploited**? (That is what KEV tells you)
4. What is the deadline?

And remember: not being in KEV does not mean safe. Entries appear **after** exploitation is
confirmed — php2shell sat outside the catalogue while a public PoC existed.

## 4. Sources

- Catalogue: <https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json>
- KEV explanation: <https://www.cisa.gov/known-exploited-vulnerabilities-catalog>
- Snapshot: [`data/2026-10-22/kev-recent.json`](../data/2026-10-22/kev-recent.json)
