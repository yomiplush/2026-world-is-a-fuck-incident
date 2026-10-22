# Linux kernel, 2026-10-21/22 — six vulnerability reports posted to the public list

[English](17-lkml-oct2026.md) | [**日本語**](17-lkml-oct2026.ja.md)

Not a supply-chain incident and not a single CVE: **six kernel vulnerability reports were sent to
the public LKML instead of the private security mailing list**, overnight on 21–22 October, and at
least two of them are remote-reachable CVSS 9.0 issues. The fixes are not in mainline yet.

Reported by Phoronix (Michael Larabel, 2026-10-22 06:05 EDT). The individual reports are on
`lore.kernel.org`, and Greg Kroah-Hartman replied to each asking why it had gone to the public list.

## 1. The six reports

| ZDI id | Subsystem | Impact | Score | Patch status (per Phoronix, 10-22) |
|---|---|---|--:|---|
| `ZDI-CAN-33549` | **SMB Direct** | integer underflow → **remote code execution** | **9.0** | patch exists in a branch intended for v7.5; expected to be expedited to mainline |
| `ZDI-CAN-33774` | **ksmbd** | race condition → **remote code execution** | **9.0** | not stated |
| `ZDI-CAN-33367` | `skbuff` / `skb_zerocopy` | **local privilege escalation** | — | same issue reported by another source a week earlier; patch expected shortly |
| `ZDI-CAN-34068` | **vmwgfx** (VMware graphics) | out-of-bounds write → **local privilege escalation** | — | not stated |
| `ZDI-CAN-34076` | **nvmet** | uninitialised resource → **information disclosure** | — | not stated |
| `ZDI-CAN-32005` | TCP search-domain query | stack buffer overflow → **local privilege escalation** | — | posted a day earlier |

Three are LPEs, two are remote RCEs in SMB code paths, one is an info leak in NVMe-over-fabrics
target code. The two that matter for an exposed host are the SMB ones: **ksmbd** and **SMB Direct**
(`smbdirect`) are the kernel's file-server surfaces, and a CVSS 9.0 RCE there is reachable from the
network wherever those services listen.

## 2. Why this is a big deal even though "no CVE yet"

- **The embargo is gone.** These were sent to `linux-kernel@vger.kernel.org`, which is public,
  archived and mirrored. Anyone can now read the trigger descriptions months (or at least days)
  before a stable backport exists.
- **Mainline has no fix.** Phoronix states the vulnerabilities are unpatched in mainline; one patch
  sits in a v7.5 branch, one is expected "soon". For a distribution kernel that means the fix is
  still two hops away (subsystem → mainline → stable → distro).
- **It is a process failure, not a bug class.** The reports were not leaked by an attacker; they
  went out through the wrong address. The interesting part for defenders is that **the disclosure
  channel itself can be the leak**, which is the same lesson as [`docs/14`](14-supply-chain-oct2026.md)
  with a different mechanism.

## 3. What I could and could not verify

This repository's rule is to name the gap rather than paper over it:

| Claim | Verification |
|---|---|
| Six reports, ids, subsystems, scores, patch status | **Phoronix article** (secondary, but it links every report) |
| The reports exist on `lore.kernel.org` | links resolve in a browser; **automated fetch is blocked by Anubis** (proof-of-work bot protection) — recorded, not assumed |
| "Not patched in mainline" | checked the `torvalds/linux` mirror: **no commit message references any of the six ZDI ids** as of 2026-10-22 (the mirror shows 7.4-rc1 merges that day) |
| Greg Kroah-Hartman's replies | visible in the Phoronix links; not fetched here for the same Anubis reason |

So: the *event* is secondary-sourced with primary pointers, and the *absence of a fix* is
independently confirmed. That is the strongest statement this snapshot can make.

## 4. What to do (all of it is exposure reduction until kernels ship)

1. **Stop running ksmbd if you do not need it.** It is a kernel SMB server; most hosts that have it
   loaded do not use it. `lsmod | grep ksmbd`, then blacklist or drop the config.
2. **Never expose SMB Direct / SMB to untrusted networks.** If a file service must be reachable,
   put it behind a VPN and restrict it to known clients — a 9.0 RCE with a public trigger
   description is not something to leave at the edge.
3. **Patch the distro kernel on its normal cadence, and watch the stable queue** rather than
   waiting for a CVE. When these get CVEs, the advisory will lag the fixes.
4. **Treat `vmwgfx` and `nvmet` as host-hardening items**: the first is a guest driver (LPE inside
   the VM, and a sandbox escape only if the host trusts the guest), the second is an
   NVMe-over-fabrics target — if you run NVMe-oF targets, keep the fabric on a trusted network.
5. **Re-read this page in a week.** With no CVE and no stable backport, "we will patch when it is
   assigned" is exactly the wrong plan.

## 5. Sources

- Phoronix, "Several Linux Kernel Vulnerabilities Accidentally Posted To Public Kernel Mailing List"
  (2026-10-22) — secondary, but links every report:
  <https://www.phoronix.com/news/LKML-New-Trend-Vulnerabilities>
- The six LKML messages (linked from the article; Anubis-protected for automated clients):
  `lore.kernel.org/lkml/BYAPR01MB3830…80662@…` (`ZDI-CAN-33549`),
  `…80662@…` (`ZDI-CAN-33774`), `…80662@…` (`ZDI-CAN-33367`),
  `lore.kernel.org/dri-devel/2026102254-protector-seventy-6454@gregkh/` (`ZDI-CAN-34068`),
  `lore.kernel.org/all/2026102226-duly-imprison-a2c1@gregkh/` (`ZDI-CAN-34076`),
  `lore.kernel.org/all/BYAPR01MB3830…80672@…` (`ZDI-CAN-32005`)
- Mainline mirror used for the "no fix" check: <https://github.com/torvalds/linux/commits/master>
  (searched for each ZDI id, 2026-10-22)
- The disclosure-channel point, same as [`docs/14`](14-supply-chain-oct2026.md) §5:
  <https://github.com/yomiplush/2026-world-is-a-fuck-incident/blob/main/docs/14-supply-chain-oct2026.md>
