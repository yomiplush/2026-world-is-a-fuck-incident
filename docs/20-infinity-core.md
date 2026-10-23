# Infinity Core — six kernel core LPEs, with working PoCs and a fix that already shipped

[English](20-infinity-core.md) | [**日本語**](20-infinity-core.ja.md)

Six Linux kernel vulnerabilities in **timer, signal, memory management, futex, scheduler and SLAB**
code, disclosed on `oss-security` on **2026-10-16 16:00 UTC (2026-10-17 01:00 JST)** after the
`linux-distros` embargo expired. Five give an unprivileged local user root, and the same five escape
a container to the host. The sixth corrupts the SLUB partial list and panics the kernel.

**This is not the six from [`docs/17`](17-lkml-oct2026.md).** Different bugs, different researcher,
different disclosure channel — and, unlike that set, **these are fixed upstream**. §6 separates them.

The name, the CVE list and the fix commits are the researcher's own:
**Hyunwoo Kim** (`@v4bel`), <https://github.com/V4bel/InfinityCore>. Everything below was checked
against that document, the oss-security post and the kernel CVE announcements.

## 1. The six

| Subsystem | CVE | Impact | Tested target | Introduced | Fixed |
|---|---|---|---|---|---|
| Timer | `CVE-2026-98260` | LPE, container escape, **Android LPE** | Ubuntu 26.04 `7.0.0-30-generic`; Galaxy S26 Ultra | `55e8c8eb2c7b` | `acb03d388181` |
| Signal | `CVE-2026-98256` | LPE, container escape | Ubuntu 26.04 `7.0.0-30-generic` | `fb3bbcfe344e` | `d2710c8d938a` |
| MM | `CVE-2026-89754` | LPE, container escape | Ubuntu 26.04 `7.0.0-30-generic` | `3b89863c3fa4` | `aedf2efd1897` |
| Futex | `CVE-2026-80775` | LPE, container escape | Ubuntu 26.04 `7.0.0-30-generic` | `d9b05321e21e` | `bde023808364` |
| Scheduler | `CVE-2026-98385` | LPE, container escape | Arch Linux `7.2.4-arch1-2` | `df0d98475954` | `28f9c0e0a0b9`, `b636fef85bda` |
| SLAB | `CVE-2026-97941` | kernel panic (no LPE chain shown) | Arch Linux `7.2.4-arch1-2` | `ba7425312607` | `4a724bcf5d70` |

Five of the six are memory-safety bugs in object lifetime, and the theme is the same: a reference
that outlives the thing it points at (`exec()` swapping task identity, `mm_struct` being replaced,
per-CPU state outliving its owner). The SLAB one is a different shape, a list-corruption race.
Concretely:

- **98260** — a per-thread POSIX CPU timer's node survives in a live task's timerqueue when `exec()`
  fails in a non-leader thread. Later task cleanup walks the freed node.
- **98256** — the dying leader's pending `sigqueue` list is flushed without a lock while another
  path links an entry into the *new* leader's queue via the exchanged PID; the object is freed with
  the entry still linked.
- **89754** — retry state (`ACTION_AGAIN`) escapes the lower page-table walker, so `mincore()` walks
  the same PUD range twice and writes past its one-page result buffer.
- **80775** — two tasks sharing an `mm_struct` through nested `vfork()` publish different per-CPU
  futex counters, one reference is lost, and the live private futex hash is freed underneath a
  surviving bucket pointer.
- **98385** — scheduler cache accounting keeps writing to per-CPU statistics belonging to an
  `mm_struct` that `exec()` has already replaced and freed.
- **97941** — an ABA race between optimistic freelist return and partial-list removal during SLUB
  refill links the same list node twice.

Why they are not "just local bugs" in a cloud: **the container shares the host kernel**. An attacker
who can already run code in a container — a compromised app, a malicious dependency, a CI job
running a pull-request build — gets from that container to the host root with these. The researcher
demonstrated escape for five of the six.

**Two limits worth stating.** None of the six is remote or unauthenticated: you need local code
execution first (or an unprivileged shell on a shared host). And the scheduler one is conditional —
`CONFIG_SCHED_CACHE=y`, scheduler cache active at runtime, a topmost `SD_SHARE_LLC` domain with more
than one CPU and a wider parent domain, and `sysctl_sched_cache_user` non-zero. The PoC assumes four
vCPUs split into two LLCs.

## 2. The Android result, and what is *not* published

`CVE-2026-98260` was shown to reach root from the `untrusted_app` sandbox on a **Samsung Galaxy
S26 Ultra** (build `S948NKSS4BZIG`) with no additional app privileges. The Android exploit itself is
**withheld** until the device is patched, and only a hash is published:

```
713a294f72abc46b6e12633117d40e85629ca2b998698fd75c76e523e0d53253
```

That hash is not an exploit, and the Linux server PoC being public does not mean the Android one is.
Two different claims; keep them apart.

## 3. The fix already shipped — check the running kernel, not the number

The kernel CVE announcement for `CVE-2026-98260` names the branches that carry the fix:

```
fixed in 6.6.158   with commit 6f1977cea3e8
fixed in 6.12.112  with commit d9ae467e617c
fixed in 6.18.54   with commit 75aa08b93c65
fixed in 7.2.8     with commit d602877baf36
fixed in 7.3-rc4   with commit acb03d388181
```

`CVE-2026-98385` (scheduler) is narrower: its announcement lists **7.2.9** and **7.3-rc5**, with no
6.x backport in the mail. As of this snapshot the current releases are **7.2.12**, **6.18.58**,
**6.12.114**, **6.6.160** and **6.1.190** — so every current line is above the fix for the timer
family, and 7.2.12 is above 7.2.9. Distributions backport into their own version numbers, so this
arithmetic tells you "a fixed kernel exists", **not** "your kernel is fixed".

```bash
uname -r                                  # what you are running
# then: the distribution's advisory for these CVE ids, and the *package* revision
# Debian/Ubuntu: apt changelog linux-image-$(uname -r) | head
# RHEL/Fedora:  rpm -q --changelog kernel | head -40
# Arch:         pacman -Qi linux | grep -E 'Version|Install Date'
```

**Reboot is part of the fix.** A patched kernel package installed next to a running old kernel is
the most common way this stays open. `uname -r` after the reboot is the only proof.

Priority order, from the researcher's own framing plus the exposure argument: shared hosts, Kubernetes
worker nodes, CI/build runners, and any multi-user server. Those are the places where "local" is not
a high bar.

## 4. What to do if you cannot patch this week

These are reductions, not fixes — say so out loud, as [`docs/06`](06-lessons-and-gotchas.md) insists:

1. **Stop running untrusted code on shared kernels.** PR builds from forks, "try it" previews,
   multi-tenant runners: move them to dedicated nodes or a sandbox that does not share your kernel.
2. **Reduce who can get a shell.** The entry price for every one of these is "code execution as a
   user", which is also what a compromised dependency gives an attacker.
3. `seccomp`, LSM profiles and dropping container privileges raise the cost. **None of them is
   verified to block all six**, and seccomp filters do not remove a kernel UAF that a permitted
   syscall reaches.
4. Do **not** treat "BPF and user namespaces are disabled" as protection. The researcher explicitly
   excluded those attack surfaces from this work — that is the point of the set.

## 5. What I could and could not verify

| Claim | Status |
|---|---|
| Six CVEs, subsystems, impacts, tested targets, fix commits | researcher's document **and** the six NVD records (kernel CVE text) — both agree |
| Disclosure date and embargo | oss-security `Message-ID <atJKE2-xaxxpko2X@v4bel>`, `Sat, 17 Oct 2026 01:00:19 +0900` (= 2026-10-16 16:00 UTC) |
| Fixed-in branches for 98260 / 98385 | kernel CVE announcements, quoted above |
| Current stable is newer than every fixed version | kernel.org release index at this snapshot |
| Not known-exploited | no KEV entry; CISA has not listed any of the six |
| NVD severity | **4 of 6 carry 7.8** (`AV:L/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:H`, the kernel CVE team's own score); **`CVE-2026-80775` and `CVE-2026-98385` carry no score at all**, and all six are `vulnStatus: Received` — NVD has not analysed them |
| Android exploit exists | the researcher's claim plus a hash; **not** independently verifiable, and correctly withheld |

The honest summary: **the bug detail and the fixes are primary-sourced; the severity numbers are
not.** Anyone filtering this week on "CVSS ≥ 9.0" would have missed all six.

## 6. Not the same six as `docs/17`

Both weeks produced "six Linux kernel vulnerabilities". They share the number and nothing else:

| | This document (Infinity Core) | [`docs/17`](17-lkml-oct2026.md) |
|---|---|---|
| Reported by | Hyunwoo Kim, coordinated via `linux-distros` | six reports sent to **public** `linux-kernel@` instead of the private list |
| Identifiers | `CVE-2026-98xxx` / `-89xxx` / `-80xxx` | ZDI ids (`ZDI-CAN-33549`, `-33774`, …) |
| Subsystems | timer, signal, mm, futex, scheduler, SLAB | SMB Direct, ksmbd, skbuff, vmwgfx, nvmet, TCP |
| Impact | local root, container escape (5 of 6) | **remote** RCE at CVSS 9.0 in SMB paths |
| Exploit status | PoC public for 5, panic trigger for 1 | no public PoC reported |
| **Fix status** | **fixed upstream; stable lines carry it** | **no fix in mainline when checked (2026-10-23)** |
| In KEV | no | no |

If you take one thing from the pair: **"kernel vulnerability" is not an actionable category.** The
label that matters is "is there a patched kernel I can install and boot", and for these two sets the
answer is opposite.

## 7. Sources

- Researcher's document (all six, PoCs, fix commits, conditions):
  <https://github.com/V4bel/InfinityCore>
- Disclosure thread: <https://openwall.com/lists/oss-security/2026/10/16/36>
  (the archive path is UTC-dated; the mail itself is 2026-10-17 01:00 JST)
- Kernel CVE announcements (per-CVE `Fixed in` lines):
  <https://lists.openwall.net/linux-cve-announce/2026/10/06/118> (`CVE-2026-98260`),
  <https://lists.openwall.net/linux-cve-announce/2026/10/12/1> (`CVE-2026-98385`),
  <https://lists.openwall.net/linux-cve-announce/2026/10/06/114>,
  <https://lists.openwall.net/linux-cve-announce/2026/09/25/198>,
  <https://lists.openwall.net/linux-cve-announce/2026/09/04/14>
- NVD records: `https://services.nvd.nist.gov/rest/json/cves/2.0?cveId=CVE-2026-98260` (and the five)
- Current stable versions: <https://www.kernel.org/releases.json>
- Japanese summary that surfaced it (secondary, and the reason to check the primary):
  <https://rocket-boys.co.jp/security-measures-lab/linux%e3%82%ab%e3%83%bc%e3%83%8d%e3%83%ab%e3%81%ab6%e4%bb%b6%e3%81%ae%e8%84%86%e5%bc%b1%e6%80%a7%e3%80%8cinfinity-core%e3%80%8d%e3%80%815%e4%bb%b6%e3%81%a7root%e6%a8%a9%e9%99%90%e6%98%87%e6%a0%bc/>
