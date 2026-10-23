# Node.js — the October 2026 security releases

[**English**](02-nodejs-oct2026.md) | [日本語](02-nodejs-oct2026.ja.md)

Published 2026-10-21. Fixed versions **22.23.4 / 24.22.1 / 26.12.1**. **20.x is EOL and gets
nothing.**


## 1. The CVEs

| CVE | Severity | Issue | 22 | 24 | 26 |
|---|---|---|---|---|---|
| CVE-2026-111497 | **high** | Brotli decoder out-of-bounds write → remote code execution | ✓ | ✓ | ✓ |
| CVE-2026-105482 | **high** | `dns.resolve` truncates names containing a NUL character | ✓ | ✓ | ✓ |
| CVE-2026-105483 | high | TLS hostname verification bypass (IP written in fullwidth digits) | — | ✓ | ✓ |
| CVE-2026-106069 | high | TLS hostname verification bypass (host loosely resolves to an IP) | ✓ | ✓ | ✓ |
| CVE-2026-105481 | medium | keep-alive connection writes a response before the request arrives | ✓ | ✓ | ✓ |
| CVE-2026-106072 | medium | Non-canonical IPv4 hostname lets a DNS SAN authenticate an IP endpoint | ✓ | ✓ | ✓ |
| CVE-2026-106074 | medium | `crypto.randomUUID()` / `randomInt()` entropy cache is saved into start-up snapshots and SEAs, so every process repeats the same values | ✓ | ✓ | ✓ |
| CVE-2026-106070 | low | ZipFile returns attacker-controlled prefix bytes after failed header validation | — | — | ✓ |
| CVE-2026-106071 / 106073 | low | Permission Model / ZipFile related | — | — | ✓ |

**Practical priority**: CVE-2026-111497 is the heaviest. It is reachable by an unauthenticated
request on one of two paths: your code calls the built-in `fetch()` on a Brotli-compressed
response, or a parser that **inflates** request bodies handles the request (Express 5's
`express.json()` / `urlencoded()` / `text()` / `raw()`, or `body-parser` 2.x directly). A bare
`http.createServer()` does not decode a Brotli body on its own. The three TLS issues matter
wherever certificate validation is trusted — mutual TLS between internal services, or validation
behind a proxy.

### 1-1. Exploit status (2026-10-23): a working PoC on an official build

**Imperva's "Node2Shell" runs code on the stock Node.js 24.22.0 Linux arm64 image** using crafted
Brotli data, with no debugger or instrumented binary; the same input is rejected by 24.22.1. Their
test covered both paths above (a consumed response through `fetch()`, and `raw()` / `json()` bodies
under Express 5.0.0–5.3.0 / body-parser 2.0.0–2.3.0, pinned versions), needed several attempts,
and did not test 22.x, 26.x or other architectures. The earlier public PoC only achieved code
execution on a deliberately weakened build.

No in-the-wild exploitation of CVE-2026-111497 has been reported. Treat the patch as **today's**
work: nothing changes for a host already on 22.23.4 / 24.22.1 / 26.12.1, and nothing helps one
that is not. Detail, including why NVD's CVSS 4.0-only 9.2 record never appears in a
severity-filtered CRITICAL sweep: [`22-snapshot-2015jst.md` §2](22-snapshot-2015jst.md).

## 2. Dependency updates shipped alongside

- **c-ares** (26/24/22)
- **ca-cert (the eMudhra intermediate-CA response)** (26/24/22) — `03-emudhra-ca.md`
- OpenSSL (24/22)
- SQLite (22)
- Undici (26/24/22)

**The ca-cert update changes the runtime's trust store.** Updating Node therefore also addresses the
CA compromise. If you build Node yourself or point it at a system bundle
(`--openssl-system-ca-path`), check that bundle separately.

## 3. How to update

### 3-1. Containers (swap the runtime, leave the app alone)

For when the app image has not caught up. **Stay in the same major line** so native module ABIs keep
working.

```dockerfile
# Dockerfile.nodefix
FROM <your-app-image>

# take the binary from the fixed build of the same major
COPY --from=node:22.23.4-bookworm-slim /usr/local/bin/node /usr/local/bin/node
```

```bash
docker build -f Dockerfile.nodefix -t <app>:node22.23.4 .
# change image: in compose to <app>:node22.23.4
docker compose up -d --force-recreate --no-deps <service>
```

Caveats:

- **Wolfi / Alpine bases** may lack shared libraries the replacement binary needs (e.g.
  `apk add libatomic`).
- **Apps with native modules (`better-sqlite3` and friends) will not work.** Rebuild from source
  against the new ABI instead.
- The derived image **pins the app version**. When upstream rebuilds on a fixed Node, drop the
  derived tag and go back — otherwise the app stops being updated.

### 3-2. Hosts (Debian/Ubuntu with NodeSource)

```bash
sudo apt update
apt-cache policy nodejs        # is Candidate the fixed version?
sudo apt install --only-upgrade nodejs
node -v
```

If `Candidate` is still old, you are waiting on NodeSource. The practical workaround is a
user-local runtime earlier in `PATH` (`~/.local/opt/node-vXX…` plus `~/.local/bin`). Note that
services run by root still pick up `/usr/bin/node`.

### 3-3. Hosts (Arch)

```bash
sudo pacman -Syu nodejs
node -v
```

Arch moves quickly, but packaging still lags the release. **If the repository version is below the
fixed version, upgrading is pointless.** Check `pacman -Si nodejs` first.

## 4. Verify

```bash
tools/node/nodefix-audit                    # local
tools/node/nodefix-audit --target <ssh-host>
# anything whose STATE is not ok is unpatched. Always confirm with the binary:
docker exec <container> node -v
```

`nodefix-audit` looks at every container from `docker ps` and at the host's `node` (both
`/usr/bin/node` and `~/.local/bin/node`). **Multiple node binaries on one host** is the most
commonly missed part of this work.

## 5. Rollback

With the derived-image method, rollback is one line in compose (the original image is still there):

```bash
cp docker-compose.yml.bak-<timestamp> docker-compose.yml
docker compose up -d --force-recreate --no-deps <service>
```

For host packages: `apt install nodejs=<version>` / `pacman -U <cached .pkg.tar.zst>`.
**Make sure you can go back before you go forward** — pacman caches are sometimes already cleaned.

## 6. Sources

- Advisory: <https://nodejs.org/en/blog/vulnerability/october-2026-security-releases>
- Release index (versions and build dates): <https://nodejs.org/dist/index.json>
- Advisory list, newest first: <https://nodejs.org/en/blog/vulnerability>
