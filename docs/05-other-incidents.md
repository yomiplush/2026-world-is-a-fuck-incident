# Other incidents (October 2026)

[**English**](05-other-incidents.md) | [日本語](05-other-incidents.ja.md)

Everything outside php2shell, Node.js and the CA compromise. Each item leads with its blast radius
so you only read what applies to you. Items sourced only from secondary reporting are marked
**(secondary)**.

## 1. Microsoft October Patch Tuesday (2026-10-13)

- The MSRC CVRF lists **2,578 CVE entries** (a count across products and updates, not "2,578
  distinct vulnerabilities"; press reports said "more than 1,400"). That figure is as of the
  first read: the same CVRF was re-issued on 2026-10-21, and retrieving it on 2026-10-22 yields
  **2,575** entries. Re-derive the count; see `08-intel-sources.md` §5.
- **Exactly one was confirmed exploited**: **CVE-2026-96951** — Windows Shell security feature
  bypass. Command injection lets an unauthorised attacker bypass a security feature over the
  network. CVSS 3.1 **8.8** (`AV:N/AC:L/PR:N/UI:R/S:U/C:H/I:H/A:H/E:F`). Updates include KB5126836.
- Practically: **check whether that one applies to you** and patch Windows hosts monthly anyway —
  it is cheap.

Source: <https://api.msrc.microsoft.com/cvrf/v3.0/cvrf/2026-Oct>

## 2. Oracle October Critical Patch Update

- Several CVSS **10.0** findings (JD Edwards EnterpriseOne Orchestrator, SOA Suite, Access Manager,
  E-Business Suite and others).
- It is easy to be led by the 10.0, but **most require authentication and internal network
  position**. If the Oracle product is not exposed, the quarterly cycle is enough.
- The exception: an internet-facing Oracle HTTP Server or SOA Suite deserves top priority.

Source: NVD (query with `pubStartDate` / `pubEndDate`)

## 3. Ransomware and sanctions

| Date | Event | Source |
|---|---|---|
| 10-20 | CISA publishes **#StopRansomware: SafePay** | CISA advisory feed (primary) |
| 10-19 | US authorities arrest an executive of a **ransomware negotiation firm suspected of running the ShinyHunters extortion site** | Krebs (secondary) |
| 10-14 | UK **sanctions crypto exchange Cryptomus** over Russian money laundering | Krebs (secondary) |

The negotiation-firm angle matters for incident-response design: know who you are handing your
contact details and breach data to. If your IR plan has no criteria for choosing a negotiator, that
is worth adding.

## 4. Also noted

| Date | Event | Source |
|---|---|---|
| 10-21 | Netherlands fines Meta $25B in a privacy ruling | The Record (secondary) |
| 10-21 | Three tech companies launch a $10M initiative for under-resourced utilities | The Record (secondary) |
| 10-16 | CISA advisory on techniques used against election and campaign officials | CISA (primary) |

## 5. How to decide you do not need to read this

Chasing every event of the week is how you miss the one that matters. Filter in this order:

1. **Do you operate the product?** (No → done)
2. If yes, **is it exposed?** (No → lower priority)
3. Is exploitation **confirmed**? (Check KEV)
4. What is the **deadline**?

Applied here, only Plex (if you run it) and php2shell survive the filter.
