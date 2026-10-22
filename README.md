# 2026 — php2shell, Node.js October 2026, and a CA compromise

[**English**](README.md) | [日本語](README_jp.md)

## 0. Busy? Read this

- **PHP** (CVE-2026-109618 / 109619, CVSS 9.2): every release from 5.4.0 on. Fixed in
  **8.5.12 / 8.4.27 / 8.3.36 / 8.2.35**. Exploit is public and attempts were observed
  **before** the fix shipped — if you serve PHP, patch today.
- **Node.js**: **22.23.4 / 24.22.1 / 26.12.1** are current, and there is **no newer patch**.
  20.x is EOL and will never be fixed.
- **CA**: eMudhra intermediate keys were compromised. Runtimes that bundle their own CA store
  (Node, Go, Python, Java) must be updated.
- **Everything else here is context.** It only matters after one of the above fires.

Check your own estate — two read-only commands, about a minute:

```bash
git clone https://github.com/yomiplush/2026-world-is-a-fuck-incident.git
cd 2026-world-is-a-fuck-incident
tools/php2shell/bin/p2s-audit --json      # exit 10 = a PHP runtime is exposed
tools/node/nodefix-audit                  # Node runtimes below the fixed versions
```

**Handing this to an AI?** Copy the prompt, then paste it together with the repository URL:

```bash
bash tools/copy-prompt.sh        # English prompt -> clipboard
bash tools/copy-prompt.sh ja     # Japanese prompt -> clipboard
```

The prompt keeps the agent read-only first, makes it branch on the table in §2-3, verify
versions against the running binary, and never describe a partial mitigation as a fix.

---

Three events landed in the same week of October 2026 — **two critical RCEs in PHP itself**,
**the Node.js October security releases**, and **the compromise of a public CA's intermediate
keys**. This repository is the record: what happened, the primary sources, the reproduction
steps, and a defence toolkit you can actually run. It is meant to be **read** and **executed**.

**Data as of 2026-10-22 00:15 UTC** (last verified). No newer patch exists — confirmed against
the Node.js release index and the advisory list.

> The detailed docs under `docs/` and `runbooks/` are currently written in Japanese.
> This README is the English entry point and carries every fact needed to act.

---

## 1. The three events at a glance

| Event | CVE | Severity | Affects | Fixed in | Exploited | Do this |
|---|---|---|---|---|---|---|
| **php2shell** (RCE in PHP core) | CVE-2026-109618<br>CVE-2026-109619 | CVSS 4.0 **9.2** Critical | **Every PHP release from 5.4.0 on.** FPM / mod_php / php-cgi / FrankenPHP / LiteSpeed | **8.5.12 / 8.4.27 / 8.3.36 / 8.2.35** (2026-10-21) | **Yes — public.** Attempts seen at 07:43 UTC, before the fix shipped | Upgrade PHP. If you cannot, block multipart + apply partial mitigations |
| **Node.js October** | CVE-2026-111497 and 8 more | highest **high** | Node 22 / 24 / 26. **20 is EOL with no fix** | **22.23.4 / 24.22.1 / 26.12.1** (2026-10-21) | Not observed (public PoC territory) | Update within the same major line (keeps ABI) |
| **eMudhra intermediate CA compromise** | CVE-2026-111943 (Go's tracking ID) | — | Any trust store that trusts those intermediates | Vendor `ca-certificates` / runtime bundles | Requires a MITM position | Update the CA bundle |

The three are **independent**. Patching PHP does not fix Node; the CA is separate again.

**Only php2shell is urgent.** Attack code is public, exploitation was observed before the fix,
and the bug sits in PHP's request handling — no application-level fix can remove it.

### Machine-readable summary

```yaml
as_of: 2026-10-22T00:15Z
php:
  cves: [CVE-2026-109618, CVE-2026-109619]
  cvss_v4: 9.2
  affected: ">=5.4.0"
  fixed: { "8.5": "8.5.12", "8.4": "8.4.27", "8.3": "8.3.36", "8.2": "8.2.35" }
  no_official_fix: "<=8.1 (minimal source backports published for 7.4/8.0/8.1)"
  trigger: "multipart/form-data request body"
  verified_mitigations_partial:
    CVE-2026-109618: "memory_limit=-1 (php_admin_value) + small post_max_size"
    CVE-2026-109619: "session.upload_progress.enabled=0 (+ fatal_error_backtraces=0 on 8.5)"
node:
  latest: { "26": "26.12.1", "24": "24.22.1", "22": "22.23.4" }
  eol_no_fix: "20.x"
ca:
  event: "eMudhra intermediate CA key compromise"
  roots: ["Comodo AAA Services root", "emSign ECC Root CA - G3"]
  action: "update ca-certificates / runtime CA bundle"
```

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

### 2-5. Verify (remove "I think I fixed it")

```bash
tools/php2shell/bin/p2s-audit --target <ssh-host>          # no longer exits 10
docker exec <name> php -v                                  # the actual version
docker exec <name> php -i | grep -E 'session.upload_progress|memory_limit|post_max_size'
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

## 4. What is in here

| Path | Contents |
|---|---|
| `docs/00-timeline.md` | What happened when (UTC/JST) |
| `docs/01-php2shell.md` | Technical detail, blast radius, why mitigation is partial |
| `docs/02-nodejs-oct2026.md` | The nine CVEs, update methods, ABI constraints |
| `docs/03-emudhra-ca.md` | The CA compromise and exactly what to update |
| `docs/04-cisa-kev-oct2026.md` | Other known-exploited products from the same week |
| `docs/05-other-incidents.md` | Microsoft, Oracle, ransomware/economic-sanctions news |
| `docs/06-lessons-and-gotchas.md` | The mistakes made while responding, and what they cost |
| `runbooks/php2shell.md` | Detect → contain → patch → verify → post-compromise |
| `runbooks/nodejs.md` | Audit → containers → hosts → rollback |
| `tools/php2shell/` | `p2s-audit` / `-mitigate` / `-hunt` / `-patch` / `-edge` / `-watch`, ini, systemd unit, selftest |
| `tools/node/nodefix-audit` | Lists Node runtimes below the fixed versions |
| `tools/copy-prompt.sh` | Puts the AI handoff prompt on the clipboard (`en` / `ja`) |
| `prompts/` | Ready-to-paste agent prompts, English and Japanese |
| `data/2026-10-22/` | Raw API responses the numbers come from |
| `SOURCES.md` | Every source, with the command to re-fetch it |

The tools do three things only: **find it, stop it, prove it**. No exploit code.

---

## 5. What this repository deliberately excludes

- **Credentials, API tokens, private keys.** Tokens are expected to live outside the repo.
- **Owner-specific domains, hostnames, IPs and device inventories.** Not needed to reproduce the
  defence; `docs/` describes deployments in generalised form.
- **Exploits / PoCs.** Defence needs observation — "did it reach us?", "what is left behind?" —
  not a working payload.
- **Darknet or closed-forum material.** Rules built on unverifiable claims create false
  confidence. Every claim here traces to a source you can re-read.

---

## 6. Freshness (important)

This is a **snapshot from 2026-10-22**. Vulnerability data decays in days.

- Judge versions **by the running binary**. Never trust a tag or an image name.
- If this is more than a few days old, re-fetch the primary sources in `SOURCES.md` first — the
  Node.js `dist/index.json` and the PHP release listing tell you the current state by themselves.
- If upstream has shipped newer fixed versions, **upstream wins over this README**.

## 7. License

MIT (`LICENSE`). Quoted primary sources remain the property of their publishers.
