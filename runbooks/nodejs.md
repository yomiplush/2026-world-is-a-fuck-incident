# Runbook — Node.js, October 2026 releases

[**English**](nodejs.md) | [日本語](nodejs.ja.md)

Scope: hosts and containers running Node.js. 20–60 minutes (longer if images must be rebuilt).
Fixed versions **22.23.4 / 24.22.1 / 26.12.1**. **20.x is EOL and gets nothing.**

---

## 0. Discover

```bash
tools/node/nodefix-audit                    # local
tools/node/nodefix-audit --target <ssh-host>
```

It looks at every container from `docker ps` and at the host's `/usr/bin/node` and
`~/.local/bin/node`. **Several node binaries on one host** is the biggest trap
(`../docs/06-lessons-and-gotchas.md` §6).

```bash
which -a node
node -v
/usr/bin/node -v 2>/dev/null       # the system one, used by root services
```

---

## 1. Branch

| Situation | Action |
|---|---|
| Containers (the app bundles Node) | §2 derived image, or rebuild the app |
| Hosts (Debian/Ubuntu with NodeSource) | §3-1 |
| Hosts (Arch) | §3-2 |
| 20.x still present | **Major upgrade required**. §4 |

---

## 2. Containers

### 2-1. Check whether upstream already fixed it

```bash
curl -s "https://hub.docker.com/v2/repositories/<owner>/<repo>/tags?page_size=5&ordering=last_updated" \
  | jq -r '.results[]|"\(.name)\t\(.last_updated)\t\(.digest[0:19])"'
docker exec <c> node -v
```

If the upstream image now ships a fixed Node, pull and recreate:

```bash
docker compose pull <service>
docker compose up -d --force-recreate --no-deps <service>
docker exec <c> node -v
```

### 2-2. Otherwise, swap only the runtime

```dockerfile
# Dockerfile.nodefix
FROM <your-app-image>
COPY --from=node:22.23.4-bookworm-slim /usr/local/bin/node /usr/local/bin/node
```

```bash
docker build -f Dockerfile.nodefix -t <app>:node22.23.4 .
# change image: in docker-compose.yml to <app>:node22.23.4
docker compose up -d --force-recreate --no-deps <service>
docker exec <c> node -v
```

**Rules**:

- Use the **same major line** of node (ABI compatibility).
- Wolfi / Alpine bases may lack shared libraries (`apk add libatomic` etc.).
- **Apps with native modules (`better-sqlite3`…) will not work this way.** Rebuild from source (§2-3).
- Read the startup logs. `node -v` can be correct while the app fails to boot.

### 2-3. Rebuild from source

```dockerfile
FROM node:22.23.4-bookworm-slim AS build
# ... install deps and build ...
```

Anything built with `node-gyp` must be recompiled against the new ABI. Run a clean `npm ci`
(reusing `node_modules` leaves stale `.node` binaries behind).

---

## 3. Hosts

### 3-1. Debian / Ubuntu (NodeSource)

```bash
sudo apt update
apt-cache policy nodejs          # is Candidate the fixed version?
sudo apt install --only-upgrade nodejs
node -v
```

If `Candidate` is still old, you are waiting on NodeSource. **Meanwhile**: install the fixed release
under your home directory and put it earlier in `PATH`.

```bash
# e.g. unpack the official tarball into ~/.local/opt and link into ~/.local/bin
# ensure ~/.local/bin precedes /usr/bin in PATH
```

Note that **services run by root still pick up `/usr/bin/node`**. Either point the unit at the
user-local binary (`ExecStart=/home/<user>/.local/bin/node …`) or pin `Environment=PATH=…` in a
drop-in.

### 3-2. Arch

```bash
pacman -Si nodejs      # check the repo version first
sudo pacman -Syu nodejs
node -v
```

**If the repository version is below the fixed version, upgrading achieves nothing.** Use the
user-local fixed release earlier in `PATH` (§3-1).

---

## 4. Leaving 20.x (EOL)

There is no fix for 20.x. Moving to 22 or later is the only option.

1. Check the app's `engines` constraint
   ```bash
   docker exec <c> node -e 'console.log(require("/app/package.json").engines)'
   ```
2. If 22 is acceptable, update as in §2
3. Rebuild native modules if present (§2-3)
4. **Exercise the main flows** afterwards (login, API, background jobs)

---

## 5. Verify

```bash
tools/node/nodefix-audit                 # every line must be ok
docker exec <c> node -v                  # each container
/usr/bin/node -v                         # the host, for root services
```

Also check application health — a new version is not the same as a working service:

```bash
docker compose ps
docker logs --tail 100 <c>
curl -sS -o /dev/null -w '%{http_code}\n' http://127.0.0.1:<port>/
```

---

## 6. Rollback

| Method | How |
|---|---|
| Derived image | Revert `image:` in compose, then `up -d --force-recreate --no-deps` |
| Host (apt) | `sudo apt install nodejs=<old version>` |
| Host (pacman) | `sudo pacman -U /var/cache/pacman/pkg/nodejs-<old>.pkg.tar.zst` |

**Make sure rollback is possible before you upgrade.** pacman caches are sometimes already cleaned —
check `/var/cache/pacman/pkg` first.

---

## 7. CVEs worth knowing

| CVE | Why it matters |
|---|---|
| CVE-2026-111497 | Brotli decoder OOB write → RCE. On an HTTP server that honours `Accept-Encoding: br`, **reachable unauthenticated** |
| CVE-2026-106069 / 105483 | TLS hostname verification bypass. Affects mutual TLS between services and validation behind proxies |
| CVE-2026-106074 | The entropy cache survives into start-up snapshots/SEAs, so every process emits the same random values. Serious if you generate tokens |

Detail: `../docs/02-nodejs-oct2026.md`
