# October 2026, as a supply-chain wave — 14 verified incidents and one unverified

> **October 25 update:** ConnectWise is now supported by vendor and Microsoft primary reports. See the [current verification and response](25-snapshot-20261025.md). The original October 22 assessment below is historical.

[English](14-supply-chain-oct2026.md) | [**日本語**](14-supply-chain-oct2026.ja.md)

On 2026-10-22 a widely shared post listed fifteen things that broke in October and closed with
the line *"the biggest security risk might not be the code we write, but the code we trust."*

This document checks that list item by item, the same way [`11`](11-week-of-oct-20.md) checked the
vx-underground one. **Fourteen of the fifteen check out against a primary source. One does not**
(ConnectWise — see §4). The distinction matters more than the slogan.

## 1. The list, checked

Status legend: **vendor** = the affected project published it; **research** = the finding's
authors published it; **unverified** = no primary source found on 2026-10-22.

| # | Claim | What it actually is | Status | Source |
|---|---|---|---|---|
| 1 | Railway — customer secrets exposure | env vars possibly decrypted; deploys paused; rotate everything | vendor | Railway disclosure, 2026-10-21 ([`11`](11-week-of-oct-20.md) §2) |
| 2 | LiteLLM — malicious PyPI + Docker | 1.107.0 wheels run a stealer on any Python start; built from a lookalike repo | research + vendor | [`10`](10-litellm-1-107-0.md) |
| 3 | **Zeabur — infrastructure breached** | leaked internal creds → shared cluster + GCP Dedicated Servers; env vars read | **vendor** | Zeabur report, 2026-10-19 |
| 4 | OpenCode — AI API keys exposed | Console incident, keys revoked; no vendor advisory published | user reports only | [`11`](11-week-of-oct-20.md) §3 |
| 5 | **OVHcloud CLI — official binaries backdoored** | release assets for v0.11.0–v0.15.0 replaced for 94 minutes | **vendor (GHSA)** | GHSA-862f-55f5-vmvw |
| 6 | **Rank Math PRO — malware in official plugin** | some 3.0.123 downloads carried malware; fixed 3.0.124 | **research + vendor** | Wordfence PSA, CVE-2026-111862 |
| 7 | **TeamUpdraft — customer data compromised** | customer DB read; UpdraftCentral connection keys abused to push malicious plugins | **vendor + research** | TeamUpdraft notice; Wordfence PSA |
| 8 | ConnectWise — cloud backup identities compromised | — | **unverified** | no bulletin in ConnectWise's trust RSS (latest 2026-09-08) |
| 9 | **Tensorlake — npm package infected** | `tensorlake@0.5.144` stealer + worm + a hostage token that wipes `$HOME` if revoked | **research** | StepSecurity, 2026-10-08 |
| 10 | **SubQuery — backdoored npm package** | `@subql/common@5.8.3` collects credentials, opens a remote shell | **research** | StepSecurity, 2026-10-05 |
| 11 | **GhostAction — malicious workflows** | compromised maintainers pushed a fake `security-audit.yml` to 345 repos | **research** | StepSecurity, 2026-10-09 |
| 12 | PHP — critical RCE | php2shell, 5.4.0+ | vendor | [`01`](01-php2shell.md) |
| 13 | Node.js — patched | 22.23.4 / 24.22.1 / 26.12.1 | vendor | [`02`](02-nodejs-oct2026.md) |
| 14 | eMudhra — CA keys compromised | eight intermediates, weak keys, one is `4` | vendor + research | [`03`](03-emudhra-ca.md) |
| 15 | **Tailscale — eMudhra incident** | client trusted the compromised intermediates; fixed in v1.104.2 | **vendor** | bulletin TS-2026-013 |

Eight of the fifteen are `npm` / `pip` / plugin / release-artefact problems — code distribution,
not code. That is the actual shape of October, and it is why the closing line of the post lands.

## 2. The ones that were not yet in this repository

### 2.1 Zeabur — leaked credentials in plaintext, second time in two months

- **2026-10-14 01:36 → 10-15 21:05 UTC**: an attacker used Zeabur internal AWS keys and shared
  cluster admin tokens, then read environment variables and service secrets from the platform
  database. Commands ran inside **865** database services; not all succeeded. GCP Dedicated
  Servers and the shared cluster in 9 regions were in scope.
- **Root cause, per Zeabur**: long-lived admin credentials were stored in **plaintext** in a
  private configuration repository, the admin interface was reachable from the public internet,
  and the tokens had no expiry.
- **Why it repeated**: the August incident's rotation did not cover the credentials used this
  time. Customers who followed August's advice and moved env vars to their own Dedicated Server
  avoided the database read.
- Reported publicly **2026-10-19**, with an explicit vocabulary for evidence quality
  ("confirmed" / "assessed" / "cannot be confirmed" / "hypothesis"). That vocabulary is the most
  reusable part of the report.

### 2.2 OVHcloud CLI — a 94-minute window, and why release immutability is a security control

- A **compromised OVHcloud GitHub developer account** replaced release assets with malicious
  binaries on **2026-10-19, 14:47–16:21 UTC+2**.
- Affected releases: **v0.11.0 through v0.15.0**. Only installs/downloads inside that window are
  affected; anyone who fetched the same versions earlier is clean.
- Source code and build chain were **not** affected — this was asset replacement, not a
  poisoned build.
- Root cause stated by OVHcloud: the repository **was not configured for release immutability**.
  That is a settings checkbox standing between you and a backdoored binary.

### 2.3 Rank Math SEO PRO — CVE-2026-111862, CVSS 9.8

- Some downloads of **3.0.123** were malicious, in the window
  **2026-10-15 20:02 UTC → 2026-10-16 07:12 UTC**.
- Fixed in **3.0.124**. Wordfence classifies it as *unauthenticated embedded malicious code*,
  **9.8**, `CVE-2026-111862`.
- If the affected build was active: **updating is not remediation.** The payload may have created
  administrator accounts, extra files or scheduled tasks. Wordfence's guidance is to treat the
  site as compromised and hunt.

### 2.4 TeamUpdraft — the database was the entry point to thousands of sites

- Unauthorized access to `teamupdraft.com` over the weekend of **2026-10-17/18**; the customer
  database was read: names, emails, billing addresses, order history, **hashed** passwords, 2FA
  settings, and **connection keys for UpdraftCentral, UpdraftVault and UpdraftClone**. No card
  data (Stripe/PayPal).
- The keys were then used to send **validly signed** commands to connected WordPress sites,
  uploading, activating and deleting plugins. Because the signatures were real, a site with the
  earlier UpdraftPlus fix (`CVE-2026-10795`) would still accept them.
- Vendor response: all accounts signed out; **UpdraftPlus 1.26.13 / 2.26.13** auto-disconnect
  every UpdraftCentral connection made before **22:00 BST on 18 October**; Vault and Clone keys
  rotated; reported to the ICO.
- Only sites with a connection key were directly at risk — but "we use UpdraftPlus free" is not
  the discriminator; "is this site connected to cloud UpdraftCentral" is.

### 2.5 Tensorlake — a package that punishes you for cleaning up

- **`tensorlake@0.5.144`** (npm) steals credentials on install, tries to spread to other packages
  and repos, and **sets a trap**: if you revoke the GitHub token it stole, a background job on
  your machine deletes your home directory.
- It was pushed **straight to the `main` branch** of `tensorlakeai/tensorlake` under a
  maintainer's identity and released from that repo — so npm shows a **valid provenance
  attestation**. Provenance says where it was built; it does not say the code is safe.
- It also writes `.claude/settings.json` and `.vscode/tasks.json` into reachable repos, so it
  executes again when someone opens the project in Claude Code or VS Code.

### 2.6 SubQuery — install-time and import-time execution

- **`@subql/common@5.8.3`** carries a hidden payload that collects credentials and supports
  remote shell access, starting **during installation** and again **on import**. Targets are
  developer workstations and CI (GitHub Actions), plus whatever cloud credentials reach them.

### 2.7 GhostAction — 345 repositories in two automated windows

- On **2026-10-08**, compromised maintainer accounts pushed a workflow disguised as
  `security-audit.yml` to **345 repositories** in two bursts: 27 repos via the account of
  `pyxel`'s author at 13:20 UTC, then **318 repos in 16 minutes** (21:10–21:26 UTC) via another.
- The workflow exfiltrates CI/CD secrets **and entire git histories** to a hardcoded IP over
  plain HTTP. It is a fake "security improvement" — the thing you are least likely to review.

### 2.8 Tailscale — the CA compromise reaching a VPN client

- Bulletin **TS-2026-013** (2026-10-21): *"Leaked private keys for eMudhra TLS intermediate
  certificates."*
- Tailscale validates TLS with the **host operating system's trust store** (plus an embedded
  Let's Encrypt bundle), and accepts any connection signed by a certificate the store trusts. So
  when eMudhra's intermediates became forgeable, every Tailscale client that trusted them
  inherited the problem.
- Fixed in **v1.104.2**, by updating Go to **1.27.3** — i.e. by pulling in Go's x509 denylist
  ([`03`](03-emudhra-ca.md) §6). A CA compromise becomes a client-update problem three layers
  away from the CA.

## 3. What the wave has in common

Six of the eight new incidents share a single sentence: **the thing that was trusted to decide
what code runs was itself the weak point.**

- release immutability (OVHcloud), provenance attestation (Tensorlake), maintainer identity
  (GhostAction), plugin update channel (Rank Math), backup connection keys (TeamUpdraft),
  plaintext admin credentials (Zeabur).

None of them is a memory-safety bug. None is fixed by a WAF rule. The controls that would have
helped are boring and mostly configuration:

| Control | Would have stopped |
|---|---|
| Release immutability + signed artefacts verified at install | OVHcloud |
| Pinned versions with hashes; no `latest`; review diff vs. git tag | LiteLLM, Tensorlake, SubQuery |
| No long-lived plaintext admin credentials; short expiry; private admin plane | Zeabur, Railway |
| Review workflows from outside contributors; `pull_request_target` hygiene | GhostAction |
| Rotate connection keys; treat vendor DB compromise as your compromise | TeamUpdraft |
| Keep an inventory of *which* cloud services hold your connection keys | TeamUpdraft, Railway, OpenCode |

## 4. The one that did not check out

**ConnectWise — "cloud backup identities compromised."** On 2026-10-22 this repository could find
**no primary source**: ConnectWise's security-bulletin RSS lists nothing after
`2026-09-08-screenconnect-bulletin`, and their trust page has no October entry. It may be
accurate and simply not published yet; it may be a misreading of an older BCDR/R1Soft incident.
**Recorded as unverified rather than repeated as fact** — that is the whole discipline of this
repository, and a list of fifteen is exactly where one wrong row hides.

## 5. What to do, in one page

1. **Inventory the trust decisions, not the dependencies.** For each project: where does the
   artefact come from, who can replace it, and is that replacement verified? Release immutability
   and signature checks are the answers.
2. **Assume vendor databases hold your keys.** TeamUpdraft, Railway, Zeabur all ended the same
   way: someone else's database contained the credential that reached you. Keep a list of which
   vendors hold connection keys to your systems, and rotate on their incidents, not on your own.
3. **Treat "update available" as news, not as remediation.** Rank Math and TeamUpdraft both
   required hunting for persistence after patching.
4. **Read the workflow files.** GhostAction is the cheapest attack in this list and the easiest
   to miss, because it looks like hardening.
5. **When a CA breaks, follow the trust store.** Tailscale's fix was a Go version bump; your
   static binaries, container bases and language runtimes each need their own
   ([`03`](03-emudhra-ca.md) §6).

## 6. Sources

- Zeabur: <https://zeabur.com/blogs/october-2026-security-incident> (2026-10-19)
- OVHcloud CLI: <https://github.com/ovh/ovhcloud-cli/security/advisories/GHSA-862f-55f5-vmvw>
- Rank Math: <https://www.wordfence.com/blog/2026/10/rank-math-seo-pro-3-0-123-malware/>
  (CVE-2026-111862)
- TeamUpdraft: <https://teamupdraft.com/blog/security-incident-october-2026/> and
  <https://www.wordfence.com/blog/2026/10/updraftcentral-connection-key-compromise/>
- Tensorlake: <https://www.stepsecurity.io/blog/tensorlake-npm-compromised-hostage-token-worm>
- SubQuery: <https://www.stepsecurity.io/blog/subql-ecosystem-compromised>
- GhostAction: <https://www.stepsecurity.io/blog/ghostaction-returns>
- Tailscale: bulletin TS-2026-013, <https://tailscale.com/security-bulletins>, and the
  **v1.104.2** changelog entry (2026-10-21)
- The list that prompted this: Juampi (@juampitech), 2026-10, quoted in
  [`docs/14`](14-supply-chain-oct2026.md) — **secondary**, used only as an index
