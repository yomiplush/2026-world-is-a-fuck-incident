# 2026 — php2shell, Node.js October 2026, Oracle Java, and a CA compromise

[**English**](README.md) | [日本語](README_jp.md)

> **Latest update — 2026-10-24 19:13 JST:** [Broad review of 24 priority groups](docs/24-snapshot-20261024.md): exploited Arista/Collabora, Pillow, Wasmtime, Ruby, AI/MCP, Japanese products, HPE and industrial devices. Archived 526 newly published / 3,531 modified NVD records, 82 GitHub advisories and 17 recent KEV additions. [Structured register](data/2026-10-24/incident-register.json) / [primary-source notes](docs/research-2026-10-24.md). The [live briefing](https://2026-incident-briefing.pages.dev/?lang=en#26) gains eight scenes, **34 total**. Earlier sections retain their historical context; use the latest snapshot for current priorities.

## 0. Busy? Read this — three minutes to "is this mine?"

**Eight things landed in two weeks.** You do not need to read all of them. Find your row.
(For a wider "what else is critical right now", see [`docs/13`](docs/13-recent-criticals.md).)

### 0-1. Today (this is already happening)

| If you... | What happened (plainly) | Do this today |
|---|---|---|
| **serve PHP to the internet** | a hole in PHP core: no login needed to take over the server. **Exploitation attempts date from 2026-10-17 — four days before the advisory** — and no compromise has been confirmed, but nothing on the network can tell you that for your host. A **separate** flaw, `CVE-2026-115560`, has no patch until the next routine release | patch to **8.5.12 / 8.4.27 / 8.3.36 / 8.2.35**; hunt from 10-17; keep `session.upload_progress.enabled=0` → [`docs/01`](docs/01-php2shell.md), [`docs/23`](docs/23-php-cve-2026-115560.md) |
| **run GitLab yourself** | a perfect-10.0 hole: no login needed to run code. **Patching last week is not enough** | upgrade to **19.5.1 / 19.4.3 / 19.3.6 / 19.2.9 / 19.1.9 / 19.0.10 / 18.11.13** → [`docs/09`](docs/09-gitlab-19-5-1.md) |
| **installed LiteLLM 1.107.0** | installing it *was* the compromise: every Python start ships credentials out | **do not run `pip` first**; remove, then rotate → [`docs/10`](docs/10-litellm-1-107-0.md) |
| **deploy on Railway** | customer environment variables — i.e. your secrets — may have been decrypted | regenerate **every** env var → [`docs/11`](docs/11-week-of-oct-20.md) |
| **expose Plex Media Server** | **in KEV** (real exploitation): 4.3–7.2 individually, but chainable to code execution. **The deadline is today (2026-10-23)** | update to ≥ 1.43.3.10861 — Plex ships **1.43.5.11029** — and rotate account tokens → [`docs/12`](docs/12-plex-oct2026.md) |

### 0-2. This week (real, but conditional)

| If you... | What happened | Do this |
|---|---|---|
| **run Java on a server** | 55 CVEs, highest 7.5, no known exploitation — but **"affected" and "fixed" are different versions** (21.0.12.1 → 21.0.13). Temurin's 17 / 21 / 25 builds landed on 2026-10-22 | move to the fixed build → [`docs/07`](docs/07-oracle-java-oct2026.md) |
| **ship your own trust store** (Go / Python / Node / Java / containers / VPN) | eight eMudhra intermediate keys were **too weak to be secret** — 3–8 bits. Browsers handled theirs; the long tail is Docker, IoT, Python bundles | update `ca-certificates` / `certifi` / Go / NSS → [`docs/03`](docs/03-emudhra-ca.md) |
| **gave provider keys to an AI tool** | this week's attacks target **keys** (Railway, LiteLLM, OpenCode) | inventory keys, read provider usage logs → [`docs/11` §5](docs/11-week-of-oct-20.md) |
| **let an AI agent run shell commands** | two agent frameworks shipped approval gates that always say yes (**9.8**): text the agent reads becomes a host command, and the LLM / cloud keys leave with it | update (**EvoScientist 0.2.5**) or test the gate headlessly → [`docs/19` §6](docs/19-snapshot-0730jst.md) |
| **run containers or a shared kernel** | **Infinity Core**: five public root PoCs that escape a container to the host, in timer / signal / mm / futex / scheduler code. Needs local code execution first — which a compromised dependency gives | update the kernel **and reboot** → [`docs/20`](docs/20-infinity-core.md) |
| **run Node.js** | the Brotli flaw (`CVE-2026-111497`) now has a **working exploit on an official 24.22.0 build**; 20.x is EOL and will never be patched | move to **22.23.4 / 24.22.1 / 26.12.1**, containers included → [`docs/02` §1-1](docs/02-nodejs-oct2026.md) |

### 0-3. Words, translated

| Term | What it actually means |
|---|---|
| **CVSS 10.0** | the maximum: "no login, from the network, run code" |
| **KEV** | the list of CVEs the US CISA has *confirmed* were exploited. **Not being on it does not mean safe** |
| **affected / fixed version** | "the one you are vulnerable on" vs "the one that repairs it". Mixing them up is how you get breached after patching |
| **intermediate CA** | the authority that signs certificates. Leak its key and anyone can mint certificates that look like it issued them |
| **supply-chain attack** | getting in through a library or build system, so the official download is the malware |
| **rotate** | replace a secret with a new one and invalidate the old |

### 0-4. If you are unsure, three questions

1. **Do I run it?** → no: stop reading.
2. **Can the internet reach it?** → no: lower the priority.
3. **Is it being exploited?** (KEV) → no: "this week", not "today".

Check your own estate — three read-only commands, about a minute:

```bash
git clone https://github.com/yomiplush/2026-world-is-a-fuck-incident.git
cd 2026-world-is-a-fuck-incident
tools/php2shell/bin/p2s-audit --json      # exit 10 = a PHP runtime is exposed
tools/node/nodefix-audit                  # Node runtimes below the fixed versions
java -version                             # for Java read the build string (docs/07 §2)
```

**Handing this to an AI?** Copy the prompt, then paste it together with the repository URL:

```bash
bash tools/copy-prompt.sh            # remediation prompt -> clipboard
bash tools/copy-prompt.sh ja         # remediation prompt, Japanese
bash tools/copy-prompt.sh intel      # decision prompt, from the dated source snapshot
bash tools/copy-prompt.sh intel ja   # decision prompt, Japanese
```

**Tap-through briefing (web)**: <https://2026-incident-briefing.pages.dev> — the fifteen items in order,
then a **10-23 postscript** ([`docs/20`](docs/20-infinity-core.md), [`docs/21`](docs/21-snapshot-1036jst.md),
[`docs/22`](docs/22-snapshot-2015jst.md)): Infinity Core, the blind spot, the ecosystem, then Node2Shell,
the pre-disclosure attempts, the filter a CNA 9.9 cannot pass, the four incidents no CVE list named,
and PHP's follow-on `CVE-2026-115560`. 26 scenes, pseudo-3D motion, synthesised SFX and a generated
lofi loop. Sound is on; toggle it top-right.
**Language pull-down, 12 languages** (English / 日本語 / 中文 / 한국어 / Español / Français / Deutsch /
Português / Русский / العربية / हिन्दी / Bahasa Indonesia; `?lang=`, or press `L`).
Phone: tap/swipe. Desktop: space / arrows.

The remediation prompt keeps the agent read-only first, makes it branch on the table in §2-3,
verify versions against the running binary, and never describe a partial mitigation as a fix.
The decision prompt makes it re-fetch the data first, keep affected and fixed versions apart,
cite a retrieval date per claim, and never fill a gap from memory
([`docs/08`](docs/08-intel-sources.md)).

---

Seven events landed in the same week of October 2026 — **an RCE in PHP**, **a CVSS 10.0 in
GitLab**, **a supply-chain compromise of LiteLLM**, **Railway's environment-variable leak**,
**OpenCode's key revocation**, **the Oracle Java SE quarterly patch batch**, and **eight
compromised eMudhra CA keys**. This repository is the record: what happened, the primary sources, the reproduction
steps, and a defence toolkit you can actually run. It is meant to be **read** and **executed**.

**Data as of 2026-10-23 10:36 JST** (2026-10-23 01:36 UTC) — the fourth read of the week, and the
first one that is **broad**: every severity, the package ecosystems, and the disclosure channel.
That is in [`docs/21`](docs/21-snapshot-1036jst.md); the overnight diff is
[`docs/19`](docs/19-snapshot-0730jst.md). No newer patch exists for the products below — confirmed
against the Node.js, PHP, GitLab, Tomcat, httpd, BIND, Plex and Oracle release indexes — but the
**kernel** picture changed: see [`docs/20`](docs/20-infinity-core.md).

> Every document has an English original (`NAME.md`) and a Japanese mirror (`NAME.ja.md`).
> This README is the English entry point and carries every fact needed to act on its own.

---

## 1. The week at a glance (fifteen items)

| Event | What happened | Severity | Who cares | Fix | Detail |
|---|---|---|---|---|---|
| **php2shell** | RCE in PHP core, every release from 5.4.0 | **9.2** Critical | anyone serving PHP | **8.5.12 / 8.4.27 / 8.3.36 / 8.2.35** (10-21) | [`01`](docs/01-php2shell.md) |
| **GitLab** | integer overflow in the regex engine → unauthenticated RCE, **every release since 7.0 (2014)** | **10.0** (max) | self-managed operators | **19.5.1 / 19.4.3 / 19.3.6 / 19.2.9 / 19.1.9 / 19.0.10 / 18.11.13** (10-21) | [`09`](docs/09-gitlab-19-5-1.md) |
| **LiteLLM** | 1.107.0 wheels execute a credential stealer on any Python start, plus a remote loader | no GHSA | anyone who `pip`/Docker installed it | **back to 1.106.2** + rotate everything | [`10`](docs/10-litellm-1-107-0.md) |
| **Plex Media Server** | five CVEs: path traversal, two SSRF, plugin call, admin file write that executes at startup. **In KEV** | 4.3–7.2 | anyone exposing Plex | **1.43.3.10861** + rotate tokens | [`12`](docs/12-plex-oct2026.md) |
| **ISC BIND 9 (DNS)** | replaying GSS-TSIG-signed UDP corrupts `named`'s memory, with possible RCE. **No workaround** | 8.1 | AD/Kerberos-integrated DNS | **9.20.30 / 9.21.27** (S1: 9.20.30-S1) | [`18`](docs/18-bind-cve-2026-94300.md) |
| **Linux kernel (LKML)** | six vulnerability reports went to the **public** mailing list instead of the private one; SMB Direct and ksmbd are remote RCEs at 9.0 | 9.0 | kernel operators, SMB / NVMe-oF | **unpatched** as of 10-22; follow the distro kernel, drop ksmbd if unused | [`17`](docs/17-lkml-oct2026.md) |
| **Apache (Tomcat / httpd / Traffic Server)** | Tomcat: an auth bypass plus cross-user response mix-ups (HTTP/2, AJP); httpd 2.4.69; two Traffic Server smuggling bugs | 9.1 / 8.9 | anyone running Tomcat or httpd | **11.0.27 / 10.1.61 / 9.0.123**, httpd **2.4.69** | [`15`](docs/15-apache-oct2026.md) |
| **Railway** | customer environment variables (i.e. secrets) may have been decrypted; deploys paused | — | Railway customers | rotate all env vars and registry credentials | [`11`](docs/11-week-of-oct-20.md) |
| **OpenCode** | Console incident: provider keys exposed, user keys revoked (user-reported) | — | OpenCode users | re-issue provider keys, check usage | [`11`](docs/11-week-of-oct-20.md) |
| **Oracle Java SE** | 55 CVEs in the October CPU; highest 7.5, none in KEV | 7.5 | anyone running a JVM | **8u511 / 11.0.33 / 17.0.21 / 21.0.13 / 25.0.5 / 27.0.1** (10-20) | [`07`](docs/07-oracle-java-oct2026.md) |
| **eMudhra CA** | **eight** intermediate private keys with **3–8 bits** of entropy (`4, 56, 66, 115, 155, 156, 230, 237`): a 2025-04-30 ceremony's wrap/unwrap step produced a second, weak key set for 8 of 24 subordinates | PKI | anyone shipping a trust store | update `ca-certificates` / `certifi` / Go / NSS | [`03`](docs/03-emudhra-ca.md) |
| **Node.js** | nine October CVEs, plus the CA-bundle update. **A working exploit for the Brotli flaw now runs on a stock 24.22.0 build** | high (9.2 in NVD's CVSS 4.0) | Node 22 / 24 / 26; **20 is EOL** | **22.23.4 / 24.22.1 / 26.12.1** (10-21) | [`02`](docs/02-nodejs-oct2026.md) |
| **Linux kernel — "Infinity Core"** | six core LPEs (timer, signal, mm, futex, scheduler, SLAB); **public root PoCs for five**, container escape for the same five | 7.8 each (4 of 6 scored) | shared hosts, k8s nodes, CI runners | **fixed upstream** — 6.6.158 / 6.12.112 / 6.18.54 / 7.2.8, scheduler in 7.2.9; **reboot** | [`20`](docs/20-infinity-core.md) |
| **Arista VeloCloud Orchestrator** | SQL injection **exploited as a 0-day**: any logged-in user (minimum read-only) becomes a local superuser | **9.9** | anyone running on-prem VCO | **5.2.3.18 / 6.1.3.10 / 6.4.2.12** (hosted already patched) | [`22` §4](docs/22-snapshot-2015jst.md) |
| **PHP follow-on** | `CVE-2026-115560`: another RCE path, **no emergency patch** — PHP calls it unlikely and waits for the next routine release | unscored, unlisted | PHP apps that switch `session.serialize_handler` at runtime **and** leave upload progress on | **`session.upload_progress.enabled=0`** (the 10-21 mitigation) | [`23`](docs/23-php-cve-2026-115560.md) |

The fifteen are **independent**. Patching PHP does not fix GitLab; the CA, Java, Apache, the two kernel sets and BIND are separate again.

That table is only the named incidents. **The two-week CRITICAL sweep returned 120, then 125, then
104, then 98** — same query, same product. The last two runs share the same date window, so the
six-row drop is not a fix: NVD's severity filter counts only its own CVSS 3.x score, so records
scored by the CNA alone fall out of it. Exactly one row is known-exploited throughout, and two of
today's most consequential flaws are **absent** from the list: the exploited Node Brotli CVE
carries only a CVSS 4.0 score, and Arista's 9.9 carries only the CNA's 3.1 score. The filter, and the twelve rows that survived it, are in
[`docs/13`](docs/13-recent-criticals.md); its §9 explains what moved and why (a rescore, CNA-only
scores that the severity filter does not count, and a bug in the collector that has since been
fixed). [`docs/21` §1.2](docs/21-snapshot-1036jst.md) is the same lesson in this README's own
numbers.

Two corrections this snapshot owes the previous one, both in [`docs/19`](docs/19-snapshot-0730jst.md):
**NVD moved `CVE-2026-109619` from 9.8 to 8.1** (attack complexity, not impact — the fix is the same
release), and **the collector had been recording the CNA's score instead of NVD's** on rows where
the two differ. Neither changes a version to install.

What defines the week, though, is **credential theft**: Railway, LiteLLM and OpenCode are the same
attack against three different key stores, all aimed at AI inference credentials. That reading is
worked through in [`docs/11` §5](docs/11-week-of-oct-20.md).

**php2shell and GitLab are the "today" items** — public exploit or immediate reachability, a fix
that no application change can substitute for, and exposure that is enough on its own.

### Machine-readable summary

```yaml
as_of: 2026-10-23T13:25Z          # 2026-10-23 22:25 JST
php:
  cves: [CVE-2026-109618, CVE-2026-109619]
  cvss_v4: 9.2
  nvd_cvss_v31: { CVE-2026-109618: 9.8, CVE-2026-109619: 8.1 }   # 109619 rescored 2026-10-22T21:17Z; AC:L -> AC:H
  epss_2026-10-22: { CVE-2026-109618: 0.0531, CVE-2026-109619: 0.0576 }   # highest in the 14-day window
  affected: ">=5.4.0"
  fixed: { "8.5": "8.5.12", "8.4": "8.4.27", "8.3": "8.3.36", "8.2": "8.2.35" }
  followon:
    cve: CVE-2026-115560
    affected: "not stated (runtime session.serialize_handler switch + session upload progress)"
    fixed: "none — next routine release"
    mitigation: "session.upload_progress.enabled=0"
    nvd: "no record as of 2026-10-23T13:24Z"
    in_kev: false
  no_official_fix: "<=8.1 (minimal source backports published for 7.4/8.0/8.1)"
  trigger: "multipart/form-data request body"
  verified_mitigations_partial:
    CVE-2026-109618: "memory_limit=-1 (php_admin_value) + small post_max_size"
    CVE-2026-109619: "session.upload_progress.enabled=0 (+ fatal_error_backtraces=0 on 8.5)"
node:
  latest: { "26": "26.12.1", "24": "24.22.1", "22": "22.23.4" }
  eol_no_fix: "20.x"
  exploited_build: "24.22.0 (Linux arm64) — Imperva PoC, 2026-10-22; rejected by 24.22.1"
  in_the_wild: false              # no exploitation of CVE-2026-111497 reported as of 2026-10-23
java:
  cpu: "2026-10"
  cves: 55
  remote_no_auth: 49
  max_cvss: 7.5
  affected: ["8u503", "8u503-perf", "11.0.32.1", "17.0.20.1", "21.0.12.1", "25.0.4.1", "26.0.2", "27"]
  fixed:    ["8u511", "11.0.33", "17.0.21", "21.0.13", "25.0.5", "27.0.1"]   # 2026-10-20
  temurin:  ["17.0.21+9", "21.0.13+9", "25.0.5+8"]   # published 2026-10-22; 8u504 / 11.0.32.1 still August builds
  no_fix:   "26 (26.0.3 does not exist; move to 27)"
  in_kev: false
ca:
  event: "eMudhra intermediate CA keys compromised"
  count: 8                       # 6 TLS (DV/OV/EV x2) + 2 code signing
  cause: "insufficient randomness in the April 2025 ceremony; keys are small integers"
  roots: ["emSign ECC Root CA - G3", "Sectigo AAA Certificate Services (cross-sign)"]
  ct_caveat: "CT only covers TLS; the 2 code-signing CAs are not CT-logged"
  action: "update ca-certificates / certifi / Go / NSS / runtime bundles"
gitlab:
  cve: CVE-2026-110264
  cvss: 10.0
  affected: ">=7.0"
  fixed: ["19.5.1", "19.4.3", "19.3.6", "19.2.9", "19.1.9", "19.0.10", "18.11.13"]
litellm:
  bad: "1.107.0"
  current: "1.106.2"
  files: ["cook.pth", "cook.py", "sitecustomize.py"]
railway:
  event: "customer environment variables possibly decrypted"
  action: "roll every env var and registry credential"
plex:
  cves: [CVE-2026-96651, CVE-2026-96652, CVE-2026-96654, CVE-2026-96655, CVE-2026-96656]
  fixed: "1.43.3.10861"
  current: "1.43.5.11029"        # what Plex ships; either clears the KEV floor
  kev: [CVE-2026-96652, CVE-2026-96654, CVE-2026-96655, CVE-2026-96656]
  kev_due: "2026-10-23 (96654, 96656) — today at this snapshot; forensic triage required"
opencode:
  event: "Console incident; provider keys exposed, user keys revoked"
  published_by_vendor: false
recent_criticals:
  window: "2026-10-09..2026-10-23"   # 120 -> 125 -> 104 -> 98 as rows changed status; one KEV row throughout
  total: 104
  ge_9_8: 55
  in_kev: 1
  epss_max_in_window: 0.0531     # CVE-2026-109618 (109619 is 0.0576 but no longer CRITICAL)
  caveat: "cvssV3Severity counts NVD-analysed rows only; CNA-only scores are invisible"
msrc_2026_oct:
  entries: 2937                  # +353 on 2026-10-23, all Chromium component CVEs
  cve_entries: 2936
  exploited: [CVE-2026-96951]    # unchanged across four re-issues
  publicly_disclosed: [CVE-2026-108398, CVE-2026-92707]
kernel_infinity_core:            # docs/20
  cves: [CVE-2026-98260, CVE-2026-98256, CVE-2026-89754, CVE-2026-80775, CVE-2026-98385, CVE-2026-97941]
  impact: "LPE + container escape (5 of 6); CVE-2026-97941 is a kernel panic"
  nvd_cvss: { scored: 4, score: 7.8, unscored: 2, status: Received }
  fixed_stable: ["6.6.158", "6.12.112", "6.18.54", "7.2.8"]      # CVE-2026-98260; scheduler needs 7.2.9
  current_stable: ["7.2.12", "6.18.58", "6.12.114", "6.6.160", "6.1.190"]
  in_kev: false
  disclosure: "oss-security 2026-10-16T16:00Z (2026-10-17 01:00 JST)"
```

```yaml
# added 2026-10-23 10:36 JST — the broad sweep (docs/21)
broad_sweep:
  nvd_published_24h: { total: 381, ge_9_0: 54, analysed_by_nvd: 0, with_cpe: 0, with_epss: 71 }
  nvd_modified_6h: { total: 665, analysed: 144, deferred: 303 }
  ghsa_24h: { advisories: 58, critical: 5, high: 26, npm_entries: 67, pip_entries: 28 }
  feeds: 13
  headlines_without_a_cve:
    - "npm next: unauthenticated RCE (use cache) -> 16.4.1"
    - "npm next: unauthenticated RCE (image optimisation + SVG) -> 15.5.28 / 16.4.1"
python_ca_floors:               # 2026-10-22, oss-sec; certifi/pip/uv/sigstore verified on PyPI
  certifi: "2026.10.19"
  pip: "26.2.2"
  uv: "0.13.4"
  sigstore: "4.5.1"
  conda: "26.9.4"
  pixi: "0.82.1"
  note: "the emSign ROOT was removed, not only the intermediates; rebuild images without layer cache"
agent_approval_gates:            # docs/19 §6
  cves: [CVE-2026-109444, CVE-2026-77930]   # 9.8, 9.8 — OpenSRE / EvoScientist
  fixed: { EvoScientist: "0.2.5", OpenSRE: "later date-stamped release" }
```

<details>
<summary><b>The 15 supply-chain items of October 2026 — open the checked list</b></summary>

| # | Incident | What actually happened (plainly) | Status |
|---|---|---|---|
| 1 | Railway | customer env vars (i.e. secrets) may have been decrypted; rotate everything | vendor |
| 2 | LiteLLM 1.107.0 | installing it was the compromise; every Python start shipped credentials out | research + vendor |
| 3 | Zeabur | leaked internal credentials → cluster and GCP boxes' env vars read; second time in two months | vendor |
| 4 | OpenCode | Console incident exposed provider keys, keys revoked; no vendor advisory | user reports |
| 5 | OVHcloud CLI | official release assets replaced for 94 minutes (v0.11.0–v0.15.0) | vendor (GHSA) |
| 6 | Rank Math PRO | malware in some 3.0.123 downloads; fixed 3.0.124 (CVE-2026-111862, 9.8) | research + vendor |
| 7 | TeamUpdraft | customer DB read, then connection keys pushed malicious plugins into WordPress sites | vendor + research |
| 8 | ConnectWise | cloud backup identities compromised — **no primary source found** | **unverified** |
| 9 | Tensorlake (npm) | `tensorlake@0.5.144`: stealer + worm + a trap that wipes `$HOME` if you revoke the stolen token | research |
| 10 | SubQuery (npm) | `@subql/common@5.8.3`: credential collection at install and on import | research |
| 11 | GhostAction | fake `security-audit.yml` swept secrets and git history out of 345 repos | research |
| 12 | PHP | php2shell, every release from 5.4.0 | vendor |
| 13 | Node.js | fixed in 22.23.4 / 24.22.1 / 26.12.1 | vendor |
| 14 | eMudhra | eight intermediate keys too weak to be secret (one is `4`) | vendor + research |
| 15 | Tailscale | trusted those intermediates; fixed in v1.104.2 (Go 1.27.3) | vendor |

**14 of the 15 are confirmed against a primary source**; only ConnectWise is not. What they share
is that the *trust decision about what code runs* was the weak point — the detail and the controls
are in [`docs/14`](docs/14-supply-chain-oct2026.md).

</details>

---

## 2. If you are an AI agent — start here

This section is written so that an agent holding nothing but this URL can set up the defence
**without causing damage**. Work top to bottom.

> The same instructions as a paste-ready prompt live in `prompts/agent-prompt.txt`
> (Japanese: `prompts/agent-prompt.ja.txt`). Copy it with `bash tools/copy-prompt.sh`.

### 2-0. Constraints (read first)

- **Start read-only.** `p2s-audit` and `nodefix-audit` change nothing. Every mutating tool
  (`p2s-mitigate`, `p2s-patch`) must be run with `--dry-run` first.
- **Only run against hosts you have authority over.** `--target` is an ssh destination; there is
  no default host baked into this repository.
- **Do not invent CVEs or version mappings.** §1 and `docs/` are the evidence. If something is
  not covered, report it as unknown.
- **No credentials live here.** Edge operations read a Cloudflare token from
  `~/.config/cloudflare/token.env` (`CF_API_TOKEN=...`) or `--env-file`. If there is none,
  **skip the edge** — the origin-side control is the real one.
- Docker is used through **group permissions**, not root. Without `docker` group membership,
  container checks cannot run.

### 2-1. Fetch and preflight

```bash
git clone https://github.com/yomiplush/2026-world-is-a-fuck-incident.git
cd 2026-world-is-a-fuck-incident
bash tools/php2shell/tests/selftest.sh     # is the toolkit itself healthy? (~30s)
```

Requires: `bash`, `curl`, `jq`, `docker` (group), `ssh` (for remote checks). PHP is not needed.
`nodefix-audit` only needs `node` to be present.

### 2-2. Discover (read-only, changes nothing)

```bash
tools/php2shell/bin/p2s-audit --json                 # local
tools/php2shell/bin/p2s-audit --target <ssh-host>    # remote
tools/node/nodefix-audit                             # Node runtimes
tools/node/nodefix-audit --target <ssh-host>
```

`p2s-audit` exit codes: `0` = nothing exposed, `10` = exposed (action required), anything else =
the check itself failed.

`p2s-audit` asks "is PHP running **and** is the dangerous setting armed?", not merely "is PHP
running?". A host with no PHP at all is unconditionally safe from this bug.

### 2-3. Decide (mechanical)

| Observation | Verdict | Go to |
|---|---|---|
| No PHP present | Not affected | Nothing to do. Check Node next |
| PHP ≥ fixed (8.5.12 / 8.4.27 / 8.3.36 / 8.2.35) | **Patched** | Nothing. Existing hardening may stay |
| PHP < fixed, image can be bumped | **Needs patch** | §2-4-A |
| PHP < fixed, cannot bump yet (vendor wait, ≤8.1) | **Needs mitigation** | §2-4-B |
| Node < 22.23.4 / 24.22.1 / 26.12.1, or 20.x | **Needs patch** | §2-4-C |
| JVM build is below the fixed release (e.g. `21.0.12.1`) | **Needs fix** | §2-4-E |
| Self-managed GitLab below the fixed patch release | **Needs fix today** | §2-4-F |
| `litellm==1.107.0` installed, or a Docker tag that resolved to it | **Compromised** | §2-4-G |
| `ca-certificates` still trusts the eMudhra intermediates | Needs update | §2-4-D |

> Check the version **with the running binary, not the tag**:
> `docker exec <c> php -v` / `docker exec <c> node -v`.
> A `latest` tag whose content is months old is a real failure mode (see `docs/06-lessons-and-gotchas.md` §4).

### 2-4-A. Patch PHP (first choice)

```bash
tools/php2shell/bin/p2s-patch --container <name> --dry-run   # what would change
tools/php2shell/bin/p2s-patch --container <name>             # pull → recreate → verify
```

If you build your own image, pin the fixed base:

```dockerfile
FROM php:8.3.36-fpm-alpine     # or 8.2.35 / 8.4.27 / 8.5.12
```

`p2s-patch` pulls, recreates, and shows the image digest and PHP version before/after.
Exit code `10` means "no new image published yet" — that is not a failure, switch to §2-4-B.

### 2-4-B. Mitigate when you cannot patch (**partial** — say so out loud)

PHP's own advisory states these are not complete fixes. **They are not a substitute for updating.**

| Target | Setting | Effect |
|---|---|---|
| CVE-2026-109618 (OOM path) | `memory_limit = -1` where apps cannot override it (`php_admin_value`), plus a small `post_max_size` (8M without uploads, 32M with), `upload_max_filesize` below it | Removes the controllable memory-limit failure. Underlying allocation failure can still reach the vulnerable path |
| CVE-2026-109619 (stale state) | `session.upload_progress.enabled = 0`; on PHP 8.5 also `fatal_error_backtraces = 0` | Blocks the confirmed paths only |
| Both | Reject `multipart/form-data` at the web server (Sansec's recommendation) | Drops every known trigger. **Breaks file uploads — test first** |

```bash
tools/php2shell/bin/p2s-mitigate --container <name> --dry-run
tools/php2shell/bin/p2s-mitigate --container <name>
```

The bundled `ini/zz-php2shell.ini` closes **only the 109619 side**. The 109618 side needs
`memory_limit`, which the tool does **not** set for you (it changes application memory behaviour):

```ini
; conf.d/zz-php2shell-mem.ini  (or an FPM pool)
memory_limit = -1
post_max_size = 8M
upload_max_filesize = 6M
```

Put these in `conf.d` or the FPM pool. **Never in `.user.ini`, and not via `ini_set()`** — PHP
explicitly says not to rely on either for this.

TLS-terminating proxy / nginx (only if the app tolerates it):

```nginx
if ($http_content_type ~* "multipart/form-data") { return 403; }
```

### 2-4-C. Patch Node.js

**Stay inside the same major line** so native module ABIs keep working.

```bash
# 1) Containers: keep the app image, swap the node binary
#    FROM <your-app-image>
#    COPY --from=node:22.23.4-bookworm-slim /usr/local/bin/node /usr/local/bin/node
#    → build, repoint image:, then:
docker compose up -d --force-recreate --no-deps <service>

# 2) Debian/Ubuntu hosts (NodeSource)
sudo apt update && sudo apt install --only-upgrade nodejs
node -v     # must be >= 22.23.4 / 24.22.1 / 26.12.1

# 3) Arch hosts
sudo pacman -Syu nodejs
```

- Apps with native modules (`better-sqlite3` and friends) **will not work** with a swapped binary.
  Rebuild them from source against the new ABI.
- 20.x gets no fix. Moving to 22 or later is the only option.
- Verify afterwards with `tools/node/nodefix-audit`.

### 2-4-D. Update the CA bundle

```bash
sudo apt install --only-upgrade ca-certificates     # Debian/Ubuntu
sudo pacman -Syu ca-certificates                    # Arch
# Runtimes that ship their own bundle (Node, Go, Python, Java) need the runtime updated
```

Details and the three preconditions: `docs/03-emudhra-ca.md`.

### 2-4-E. Patch Java

**Do not confuse the affected list with the fixed list.** Oracle's column is what you are
probably running.

| Line | Affected (before) | Fixed (2026-10-20) |
|---|---|---|
| 8 | `8u503` / `8u503-perf` | **8u511** |
| 11 | `11.0.32.1` | **11.0.33** |
| 17 | `17.0.20.1` | **17.0.21** |
| 21 | `21.0.12.1` | **21.0.13** |
| 25 | `25.0.4.1` | **25.0.5** |
| 26 | `26.0.2` | no fix (no `26.0.3`) → move to 27 |
| 27 | `27` | **27.0.1** |

```bash
# Which JVMs are running (read-only, and read the build string)
for j in $(command -v java 2>/dev/null) /usr/lib/jvm/*/bin/java; do
  [ -x "$j" ] && printf '%s -> ' "$j" && "$j" -version 2>&1 | head -1
done
docker ps -q | xargs -r -I{} sh -c 'docker exec {} java -version 2>&1 | head -1 | sed "s|^|{} |"'

# Distribution packages (examples)
sudo apt install --only-upgrade openjdk-21-jre-headless
sudo pacman -Syu jre-openjdk
```

- **Temurin / Corretto / Zulu lag Oracle — but Temurin has now caught up on three of the five
  lines.** As of 2026-10-23 Adoptium publishes `17.0.21+9`, `21.0.13+9` and `25.0.5+8` (uploaded
  2026-10-22 12:07–17:28 UTC). Its 8 and 11 lines are still the August builds (`8u504`,
  `11.0.32.1`) and **their numbering does not map onto Oracle's** (`8u511`, `11.0.33`) — read that
  vendor's release notes instead of translating the number. Corretto / Zulu were not checked.
- **Rebuild container images** on the fixed tag. Do not copy a JRE into a running container.
- Verify with the **build string** (`21.0.13+10`), not the product name.

The full 55-CVE table, the Note 1/2/3 reading, and where Java hides:
[`docs/07-oracle-java-oct2026.md`](docs/07-oracle-java-oct2026.md).

### 2-4-F. Patch self-managed GitLab

CVSS 10.0, unauthenticated, every release since 7.0. `docs/09` has the full picture; the short
version:

```bash
sudo gitlab-rake gitlab:env:info 2>/dev/null | head -5     # what am I running?
sudo apt install --only-upgrade gitlab-ee                  # Debian/Ubuntu repo install
sudo gitlab-ctl reconfigure
```

Fixed: **19.5.1 / 19.4.3 / 19.3.6 / 19.2.9 / 19.1.9 / 19.0.10 / 18.11.13**. If you patched on
2026-10-12 you are still affected — the fix is one release above that. There is no published
workaround: if you cannot upgrade, remove internet reachability and enable GitLab's two
detections ("Onigmo native worker crash", "Org mode render error burst").

### 2-4-G. LiteLLM 1.107.0

Installing it was the compromise; the payload runs on every Python start. **Do not run `pip`
first** — that re-executes it.

```bash
python3 - <<'INNER_PY'
import site, pathlib
for d in set(site.getsitepackages() + [site.getusersitepackages()]):
    for n in ("cook.pth", "cook.py", "sitecustomize.py"):
        p = pathlib.Path(d)/n
        if p.exists(): print("HIT", p, p.stat().st_size)
INNER_PY
```

Then delete those files from every site-packages, kill the detached daemon, and reinstall pinned:

```bash
pip install 'litellm==1.106.2'
```

Assume exfiltration: rotate the instance/task IAM role, every provider key in the proxy DB, the
master and virtual keys, `DATABASE_URL`, and any secret in that host's environment. Full
checklist in `docs/10` §4.

### 2-5. Verify (remove "I think I fixed it")

```bash
tools/php2shell/bin/p2s-audit --target <ssh-host>          # no longer exits 10
docker exec <name> php -v                                  # the actual version
docker exec <name> php -i | grep -E 'session.upload_progress|memory_limit|post_max_size'
for j in $(command -v java 2>/dev/null) /usr/lib/jvm/*/bin/java; do "$j" -version 2>&1 | head -1; done
tools/php2shell/bin/p2s-hunt --container <name> --target <ssh-host> --scan   # RESULT: clean
bash tools/php2shell/tests/selftest.sh <ssh-host>          # survives a restart
```

**Do not skip the restart check.** An ini dropped in with `docker exec` disappears silently on the
next `docker compose up -d` (see `docs/06-lessons-and-gotchas.md` §2).

### 2-6. If you suspect compromise

Follow `runbooks/php2shell.md` §4 — **contain → preserve → investigate → rebuild → rotate**:

- `docker stop` (do not delete), `docker cp` the web root.
- Do not "clean" the web root. A modified file may be the only evidence.
- A burst of 5xx is the outside view of the UAF firing (`--logs`).

### 2-7. Do not

- Report an unverified WAF rule as "mitigated". **Believing you are covered is the dangerous state.**
- Treat PHP ≤ 8.1 as "out of scope". **No fix means continued exposure.**
- Point these scripts at third-party hosts without authorisation.

---

## 3. If you are a human — three commands

```bash
git clone https://github.com/yomiplush/2026-world-is-a-fuck-incident.git && cd 2026-world-is-a-fuck-incident
tools/php2shell/bin/p2s-audit --target <your-host>   # exposure check (read-only)
tools/node/nodefix-audit --target <your-host>        # Node runtime versions
```

If `p2s-audit` exits `10`, go to `runbooks/php2shell.md`. If it exits `0`, PHP is fine.
If Node is behind, go to `runbooks/nodejs.md`.

---

## 4. Data and sources (what to hand an AI)

**A list is stale in days. The sources and the way to re-ask them are what survives.**
[`docs/08-intel-sources.md`](docs/08-intel-sources.md) holds the catalog — 12 researcher and
industry feeds, four official feeds — plus the 2026-10-22 snapshot (KEV's last 37 additions,
2,584 MSRC entries, 20 JVN items). No hand-copied counts: every number is regenerated.

```bash
tools/intel/fetch-intel                       # everything into data/YYYY-MM-DD/
tools/intel/fetch-intel --sources oracle,kev  # a subset
tools/intel/fetch-intel --out /tmp/intel      # somewhere else
```

- Results live in [`data/2026-10-22/`](data/2026-10-22/): the 55 Java CVEs, the GitLab advisory
  parsed to one record per CVE, the LiteLLM incident report verbatim, the KEV delta, MSRC, JVN,
  and 13 feeds.
- Sources now include `gitlab`, `litellm`, `csaf` and `nvd-critical`, so the tables in `docs/09`,
  `docs/10`, `docs/12` and `docs/13` are regenerated the same way as everything else.
- `nvd-critical` pulls NVD CRITICALs for a window and attaches KEV membership and EPSS
  (`--critical-days`).
- Exit codes: `0` all fetched, `10` partial (the rest written), `2` nothing fetched.
- Same command, same file names — so `git diff` between two snapshots shows what the world
  changed. **Re-derive counts; never copy them.** A copied count is a claim you cannot check.
- "Exploited" means different things per source (CISA "not observed", Unit 42 "PoC seen", a KEV
  listing). [`docs/08` §4](docs/08-intel-sources.md) works through the php2shell example.

For decisions rather than remediation, use the decision prompt, not the remediation one:

```bash
bash tools/copy-prompt.sh intel
```

---

## 5. What is in here

| Path | Contents |
|---|---|
| `docs/00-timeline.md` | What happened when (UTC/JST) |
| `docs/01-php2shell.md` | Technical detail, blast radius, why mitigation is partial |
| `docs/02-nodejs-oct2026.md` | The nine CVEs, update methods, ABI constraints |
| `docs/03-emudhra-ca.md` | The CA compromise and exactly what to update |
| `docs/04-cisa-kev-oct2026.md` | Other known-exploited products from the same week |
| `docs/05-other-incidents.md` | Microsoft, Oracle, ransomware/economic-sanctions news |
| `docs/06-lessons-and-gotchas.md` | The mistakes made while responding, and what they cost |
| `docs/07-oracle-java-oct2026.md` | All 55 Java SE CVEs, affected-vs-fixed, Notes 1/2/3, detection and patching |
| `docs/08-intel-sources.md` | Source catalog, the 2026-10-22 snapshot, the four meanings of "exploited" |
| `docs/09-gitlab-19-5-1.md` | CVE-2026-110264 (CVSS 10.0): affected/fixed branches, the patch-history trap, detections |
| `docs/10-litellm-1-107-0.md` | LiteLLM 1.107.0: payload files, detection, remediation order, the March precedent |
| `docs/11-week-of-oct-20.md` | The vx-underground list fact-checked: Railway, OpenCode, and the "it is the keys" reading |
| `docs/12-plex-oct2026.md` | Plex's five CVEs (KEV, the chain, the deadline), NAS package lag, token rotation |
| `docs/13-recent-criticals.md` | A two-week CRITICAL sweep: 120 CVEs, the twelve that survived, four traps in the data |
| `docs/14-supply-chain-oct2026.md` | The 15-item October list checked one by one: 14 verified, 1 not, and the controls that would have helped |
| `docs/15-apache-oct2026.md` | Apache in October: three Tomcat fixes, httpd 2.4.69, Traffic Server smuggling, and labels versus CVSS |
| `docs/16-snapshot-2120jst.md` | The 21:20 JST re-read: KEV unchanged, MSRC 2,575→2,578, CRITICAL 120→124, current Plex build |
| `docs/19-snapshot-0730jst.md` | The 07:25 JST re-read: NVD rescored one PHP CVE to 8.1, MSRC +6 (three at 10.0), the collector's CNA-score bug, and the two agent approval-gate CVEs |
| `docs/20-infinity-core.md` | **Infinity Core**: six kernel core LPEs with public root PoCs and container escape, the fix that already shipped, and why it is *not* the six in `docs/17` |
| `docs/21-snapshot-1036jst.md` | The 10:36 JST broad sweep: 381 CVEs in 24 h with **zero** NVD analysis, 665 records modified, 58 package advisories, and the blind spot that hid Infinity Core |
| `docs/22-snapshot-2015jst.md` | The 20:15 JST read, widest yet: **Node2Shell** (a working exploit on an official Node.js build), **php2shell attempted from 10-17**, Arista VCO, KSMBD, Capcom and Onamae, plus the two flaws a severity-filtered sweep cannot see |
| `docs/23-php-cve-2026-115560.md` | `CVE-2026-115560`: the four conditions, the one-line mitigation, and everything PHP has not said (no versions, no score, no fix, no NVD record) |
| `docs/17-lkml-oct2026.md` | Six kernel reports posted publicly: SMB Direct and ksmbd at 9.0, still unpatched, and what was verifiable |
| `docs/18-bind-cve-2026-94300.md` | BIND 9 GSS-TSIG replay: CVSS 8.1, no workaround, affected/fixed versions, how to check your config |
| `runbooks/php2shell.md` | Detect → contain → patch → verify → post-compromise |
| `runbooks/nodejs.md` | Audit → containers → hosts → rollback |
| `tools/php2shell/` | `p2s-audit` / `-mitigate` / `-hunt` / `-patch` / `-edge` / `-watch`, ini, systemd unit, selftest |
| `tools/node/nodefix-audit` | Lists Node runtimes below the fixed versions |
| `tools/intel/fetch-intel` | Collects the primary sources (Oracle CPU / KEV / JVN / MSRC / 13 feeds / NVD broad sweeps / GHSA) into JSON |
| `tools/copy-prompt.sh` | Puts an AI prompt on the clipboard (`en` / `ja` / `intel` / `intel ja`) |
| `prompts/` | Ready-to-paste prompts: remediation and decision, English and Japanese |
| `data/2026-10-23-2015jst/` | Raw responses behind this read: 15 files — Oracle, KEV, MSRC, JVN, 14 feeds, 2 news feeds, the archived X post, NVD sweeps, GHSA |
| `site/` | The tap-through briefing (<https://2026-incident-briefing.pages.dev>): pseudo-3D canvas, synthesised SFX, generative lofi |
| `SOURCES.md` | Every source, with the command to re-fetch it |

Each of the files above also exists as `NAME.ja.md` (Japanese).

The tools do three things only: **find it, stop it, prove it**. No exploit code.

---

## 6. What this repository deliberately excludes

- **Credentials, API tokens, private keys.** Tokens are expected to live outside the repo.
- **Owner-specific domains, hostnames, IPs and device inventories.** Not needed to reproduce the
  defence; `docs/` describes deployments in generalised form.
- **Exploits / PoCs.** Defence needs observation — "did it reach us?", "what is left behind?" —
  not a working payload.
- **Darknet or closed-forum material.** Rules built on unverifiable claims create false
  confidence. Every claim here traces to a source you can re-read.

---

## 7. Freshness (important)

This is a **snapshot from 2026-10-23 22:25 JST**. Vulnerability data decays in days.

- Judge versions **by the running binary**. Never trust a tag or an image name.
- If this is more than a few days old, re-fetch the primary sources in `SOURCES.md` first — the
  Node.js `dist/index.json` and the PHP release listing tell you the current state by themselves.
- If upstream has shipped newer fixed versions, **upstream wins over this README**.

## 8. License

MIT (`LICENSE`). Quoted primary sources remain the property of their publishers.
