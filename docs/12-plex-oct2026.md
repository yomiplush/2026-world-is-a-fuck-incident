# Plex Media Server — five CVEs, a documented chain, and a KEV deadline that is today

[English](12-plex-oct2026.md) | [**日本語**](12-plex-oct2026.ja.md)

Plex is in CISA KEV, which is the only claim in this repository that means "someone is actually
using this". The four KEV entries were added **2026-10-20**, and two of them carry a due date of
**2026-10-23** — i.e. the day this snapshot was taken, so "tomorrow" became "today" while the
document was being written. Plex's current release is **1.43.5.11029**, two builds above the floor
the KEV note names.

What follows comes from CISA's own machine-readable advisory
([`data/2026-10-22/csaf-va-26-266-01.json`](../data/2026-10-22/csaf-va-26-266-01.json),
CISA CSAF **VA-26-266-01**), the NVD records, and the KEV entries. Plex's forum notice is cited
where it adds something the machine-readable sources do not.

## 1. The five CVEs

All five are fixed in the same build: **Plex Media Server 1.43.3.10861** (Plex Desktop 1.115.0).
CISA published VA-26-266-01 on **2026-09-23**, the same day the CVEs appeared in NVD — three
weeks after Plex's own notice (2026-09-01) said only that "CVEs have been requested". That
ordering is the useful part: for those three weeks the fixed version was actionable from the
vendor page, but the authoritative technical description arrived in CSAF and NVD together.

| CVE | What it is | CVSS 3.1 | CVSS 4.0 | Needs | KEV |
|---|---|--:|--:|---|---|
| `CVE-2026-96651` | path traversal via `/system/agents/media/get` — read any file the user can access, **including `PlexOnlineToken`** | 6.5 | 7.1 | a valid session token (LAN-adjacent via `X-Forwarded-For`) | — |
| `CVE-2026-96652` | SSRF via `/player/timeline`; put a URL in `protocol` and the server POSTs to it | 4.3 | 5.3 | **any** `X-Plex-Token` value | **yes**, due 2026-11-03 |
| `CVE-2026-96654` | `searchOne` does not neutralise URL values → call other plugins' functions with your parameters | 6.5 | 6.9 | none (pre-auth) | **yes**, due 2026-10-23 |
| `CVE-2026-96655` | SSRF via the `/video/:/transcode/universal` path parameter | 4.3 | 5.3 | authenticated user | **yes**, due 2026-11-03 |
| `CVE-2026-96656` | admin-supplied `TranscoderH264Options` is appended verbatim to x264's option string; at startup every `.so` is run **without signature, execute-bit or symbol checks** | 7.2 | 8.6 | admin | **yes**, due **2026-10-23**, forensic triage required |

Read the last row carefully. It is not "an admin can write a file". It is: an admin can write a
file, and the server will **execute it on the next start, with no integrity check at all**. That
is why the chain below exists.

## 2. The chain is the story, not the scores

CISA's KEV descriptions say it explicitly: `CVE-2026-96656` **can be chained with** `96652`,
`96654` and `96655`. Laid out in order of prerequisites:

```
any X-Plex-Token (96652)
      ↓  SSRF to an endpoint the server will process
pre-auth plugin invocation (96654)
      ↓  reach internal services / arbitrary host (96655)
admin-level file write (96656)
      ↓
arbitrary code execution at next start
```

Each individual score is unremarkable — 4.3, 6.5, 7.2. The chain is a full compromise, and it
starts from a token that every shared user, every client app and many third-party tools hold.
This is the concrete argument against triaging on CVSS alone: no row in that table is above 7.2,
and the KEV minimum for the whole set is already met.

`CVE-2026-96651` is the one *not* in KEV, and it is arguably the most damaging single bug:
reading `PlexOnlineToken` gives control of the Plex **account** and the server, i.e. persistence
beyond the box. Its own NVD record notes a LAN-adjacent attacker can reach it with a spoofed
`X-Forwarded-For` header. Two readings are possible — it is harder to weaponise than the SSRF
set, or it simply has not been observed yet. Either way, "not in KEV" is not "safe"; treat it as
the fourth member of the same patch.

## 3. Why this matters more than the score suggests

- **Plex is often published on purpose.** Remote Access maps port 32400 through UPnP/NAT-PMP by
  default-ish behaviour, and "it works from outside the house" is a feature people enable. That
  turns a home appliance into an internet-facing service, which is exactly what the 4.3 SSRF and
  the token-only path need.
- **Tokens are not scarce.** `X-Plex-Token` is handed to every client, every shared user, and
  every integration (Tautulli, Overseerr, *arr stack). "Requires a token" is a low bar in a Plex
  household.
- **Package managers lag, and Plex says so.** The vendor notice warns that NAS package managers
  may not have 1.43.3 yet and links a manual-install guide. A Synology/QNAP user who waits for
  the package store is exposed until the vendor pushes it.
- **No pre-auth RCE is needed.** The KEV listing is a chain of "modest" bugs, which is how real
  intrusions usually look.

## 4. Am I affected, and what do I do

```bash
# 1) Version (Settings -> General shows it too; this works over the API with your token)
curl -s "http://127.0.0.1:32400/identity" | tr '>' '>\n' | grep -i version
#    affected: anything before 1.43.3.10861

# 2) Is it reachable from the internet? (check from outside)
curl -s -o /dev/null -w '%{http_code}\n' "https://<your-plex-domain-or-ip>:32400/identity"

# 3) Updates
#    Synology/QNAP/NAS: the package store may lag -> install the vendor package manually
#    Docker (linuxserver/plex, plexinc/pms-docker): pull a tag that contains 1.43.3.10861
docker pull plexinc/pms-docker:latest && docker compose up -d
```

Then, assuming any of this was exposed while unpatched:

1. **Rotate the account token.** In Plex: sign out of all devices / change the password, which
   invalidates existing tokens; then re-authenticate clients. Treat `PlexOnlineToken` as
   compromised — that is precisely what `96651` reads.
2. **Review the server for persistence.** `96656` executes `.so` files at startup: check the
   Plug-ins/Codecs directories and anything that appeared under the Plex data directory for
   modified timestamps you cannot explain. CISA marks this CVE `Forensics Triage: Yes`, which in
   BOD 26-04 terms means "preserve evidence, do not just patch".
3. **Close the exposure.** If you do not need remote access, turn it off; otherwise put Plex
   behind a VPN or a reverse proxy with authentication, and stop port-forwarding 32400 directly.
4. **Check the accounts.** Look for unfamiliar shared users, libraries, or devices on the Plex
   account — the whole point of `96651` is account takeover.

## 5. What not to say

- Do not say "it is only 4.3, low priority". The four low scores are the *entry points* of the
  chain that KEV is tracking.
- Do not say "it needs admin, so it is fine". `96656` needs admin; `96652` needs a token that
  every client has; the chain is the product.
- Do not say "not in KEV" about `96651` and stop there. It reads the token that grants account
  control.
- Do not tell a NAS owner to "just update from the package store". The vendor already warned
  that store lags.

## 6. Sources

- CISA CSAF VA-26-266-01 (authority for the five CVEs and the fixed version; stored as
  [`data/2026-10-22/csaf-va-26-266-01.json`](../data/2026-10-22/csaf-va-26-266-01.json)):
  <https://github.com/cisagov/CSAF/blob/develop/csaf_files/IT/white/2026/va-26-266-01.json>
- Vendor notice, 2026-09-01 (platform instructions, NAS caveat):
  <https://forums.plex.tv/t/important-security-update-for-plex-media-server-v1-43-2-and-earlier/942319>
- NVD records (CVSS 3.1 and 4.0, per-CVE description):
  <https://services.nvd.nist.gov/rest/json/cves/2.0?cveId=CVE-2026-96656>
- KEV entries with due dates and the chain note:
  <https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json>
  (filter `vendorProject == "Plex"`), also in
  [`data/2026-10-22/kev-recent.json`](../data/2026-10-22/kev-recent.json)
- Researcher write-up referenced by NVD: <https://zmain.info/blog/plex2shell>
- OpenCVE vendor listing used as a cross-check for the older Plex CVEs:
  <https://app.opencve.io/cve/?vendor=plex>
