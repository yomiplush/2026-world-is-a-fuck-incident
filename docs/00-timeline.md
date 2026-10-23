# Timeline (UTC / JST)

[**English**](00-timeline.md) | [日本語](00-timeline.ja.md)

October 2026, when the PHP and Node.js responses collided. Times follow the primary sources;
JST is UTC+9.

| UTC | JST | Event | Source |
|---|---|---|---|
| 2026-08-01 | 08-01 | Ryan Austin (Calif) finds multiple RCE paths | Sansec |
| 2026-08-11 | 08-11 | Calif reports the first bug to PHP; coordinated disclosure starts | Sansec / PHP Foundation |
| 2026-08-24 | 08-24 | Wiz Research reports the same vulnerabilities to PHP | Sansec |
| 2026-10-13 | 10-13 (night) | Microsoft October Patch Tuesday. One exploited CVE: CVE-2026-96951 | MSRC CVRF `2026-Oct` |
| 2026-10-14 | 10-14 | CISA KEV adds Ahsay / Cisco Secure Email / PAN-OS | CISA KEV |
| 2026-10-16 | 10-16 | CISA KEV adds BeyondTrust / Fortinet | CISA KEV |
| 2026-10-20 | 10-20 | Details leak; watchTowr confirms RCE in PHP | Sansec |
| 2026-10-20 | 10-20 | CISA KEV adds four Plex Media Server CVEs, Siemens, EG SiteGuard | CISA KEV |
| **2026-10-21 07:43** | **10-21 16:43** | **Cloudflare observes exploitation attempts before the fix exists** | Cloudflare |
| 2026-10-21 | 10-21 | CISA issues its emergency PHP alert | CISA |
| **2026-10-21 14:00** | **10-21 23:00** | **PHP publishes the fixed releases** (8.5.12 / 8.4.27 / 8.3.36 / 8.2.35) | php.net |
| 2026-10-21 14:17 | 10-21 23:17 | NVD publishes CVE-2026-109618 / CVE-2026-109619 | NVD |
| 2026-10-21 | 10-21 | Node.js ships its regular security releases (26.12.1 / 24.22.1 / 22.23.4) | nodejs.org |
| 2026-10-21 | 10-22 early | Governments and newsrooms take sites offline as a precaution (Dutch House of Representatives, NCSC, Tweakers, …) | Sansec / The Record (secondary) |
| 2026-10-22 00:15 | 10-22 09:15 | **Snapshot time for this repository** | — |
| 2026-10-22 12:22 | 10-22 21:22 | Second read the same day (MSRC re-issued, +3 CVEs) | [`docs/16`](16-snapshot-2120jst.md) |
| 2026-10-22 21:17 | 10-23 06:17 | **NVD rescored `CVE-2026-109619` from 9.8 to 8.1** (`AC:L` → `AC:H`); 109618 stays 9.8 | NVD |
| 2026-10-16 16:00 | 10-17 01:00 | **"Infinity Core" disclosed on oss-security**: six kernel core LPEs, public PoCs for five, fixed upstream | [`docs/20`](20-infinity-core.md) |
| 2026-10-22 20:45 | 10-23 05:45 | Python security response names the CA bundle floors (`certifi` 2026.10.19, `pip` 26.2.2, …) | oss-sec |
| 2026-10-22 22:25 | 10-23 07:25 | **Snapshot time for this repository (third read)** | [`docs/19`](19-snapshot-0730jst.md) |
| 2026-10-23 01:36 | 10-23 10:36 | **Snapshot time for this repository (fourth read, broad sweep)** | [`docs/21`](21-snapshot-1036jst.md) |
| **2026-10-17** | **10-17** | **First php2shell exploitation attempt seen in AWS honeypot telemetry — four days before the advisory** | AWS MadPot |
| 2026-10-21 02:00 | 10-21 11:00 | Earliest working php2shell PoCs observed in the wild (embargo lifts at 14:00 UTC) | AWS MadPot |
| 2026-10-22 | 10-22 | Arista discloses an exploited VeloCloud Orchestrator SQL injection (`CVE-2026-114625`, 9.9) | Arista |
| 2026-10-22 | 10-22 | Capcom confirms a CAPCOM ID breach: 11,774,247 addresses; GMO suspends Onamae Desktop Cloud (up to 26,739 servers) | Capcom / GMO |
| 2026-10-22 12:22 | 10-22 21:22 | **Imperva demonstrates code execution on an official Node.js 24.22.0 build** (Node2Shell, `CVE-2026-111497`) | Imperva |
| 2026-10-23 07:51 | 10-23 16:51 | The Hacker News pushes the Node2Shell alert to X — the lead that started this read | X |
| 2026-10-23 10:12 | 10-23 19:12 | **PHP publishes an informational advisory for `CVE-2026-115560`**: no patch until the next routine release, keep `session.upload_progress.enabled=0` | [`docs/23`](23-php-cve-2026-115560.md) |
| 2026-10-23 11:18 | 10-23 20:18 | **Snapshot time for this repository (fifth read: 15 files, news + X channels added)** | [`docs/22`](22-snapshot-2015jst.md) |
| 2026-10-23 13:25 | 10-23 22:25 | Snapshot for `docs/23` (PHP archive, KEV, NVD query, the referenced GHSA) | [`data/2026-10-23-2235jst`](../data/2026-10-23-2235jst) |
| 2026-10-23 | 10-23 | KEV due dates fall due for Plex (`CVE-2026-96654`, `CVE-2026-96656`) and EG SiteGuard (`CVE-2026-106931`) | CISA KEV |

## What to take from this

- **PHP shipped the fix the day after the leak.** The ~24 hours between the leak (10-20) and the
  release (10-21 14:00 UTC) was the dangerous window. Anything serving PHP publicly during it needs
  a separate compromise check afterwards, even once patched (`runbooks/php2shell.md` §4).
- **Cloudflare's observation at 07:43 UTC is more than six hours before the fix.** "React when the
  PoC drops" does not work for this class of bug.
- Node.js and PHP released on the same day by coincidence. There is no shared cause; you simply
  had to track both.
- Some dates look off by one (PHP's changelog shows 8.5.12 as "22 Oct 2026" while the release
  announcement says 21 Oct). That is normal. **Match on version numbers, not dates.**
- **The score is part of the timeline.** NVD moved `CVE-2026-109619` from 9.8 to 8.1 twenty-eight
  hours after publishing it, while the fix and the advisory stayed identical. If your record of
  "what happened when" stops at the publication date, it is missing the events that change
  decisions ([`docs/19` §2](19-snapshot-0730jst.md)).
