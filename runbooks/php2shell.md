# Runbook — php2shell

[**English**](php2shell.md) | [日本語](php2shell.ja.md)

Scope: any host or container running PHP. 10–30 minutes when a fixed image exists.
**The steps are ordered: discover → patch → verify → post-compromise. Do not skip ahead.**

Requires: `docker` group membership, `ssh` (for remote), `jq`, `curl`.
Root is normally unnecessary (only edge operations and host-level ini placement may need it).

---

## 0. Decide in 30 seconds

```bash
tools/php2shell/bin/p2s-audit --json                 # local
tools/php2shell/bin/p2s-audit --target <ssh-host>    # remote
```

| Exit code | Meaning | Next |
|---|---|---|
| 0 | No PHP, or patched/mitigated | §5. Nothing to do |
| 10 | **PHP is running and the dangerous setting is armed** | §1 |
| other | The check failed (ssh / docker group / permissions) | Fix the environment, re-run |

`p2s-audit` is **read-only**. Running it repeatedly is safe.

---

## 1. Establish what is running

```bash
tools/php2shell/bin/p2s-audit                    # tabular view
docker ps --format '{{.Names}}\t{{.Image}}'
docker exec <container> php -v                   # the running version, not the tag
docker images --format '{{.Repository}}:{{.Tag}}\t{{.CreatedSince}}' | grep -i php
```

**Check stopped images too.** Not running today only means not exposed today.

```bash
docker images --format '{{.Repository}}:{{.Tag}}\t{{.CreatedSince}}' | grep -Ei 'nextcloud|wordpress|flarum|php'
```

If an image is years old, re-pull before starting it (`06-lessons-and-gotchas.md` §11).

---

## 2. Branch

| Situation | Action |
|---|---|
| A fixed image exists (`php:8.3.36` etc.) | **§3 patch.** The only complete fix |
| No fixed image yet / vendor wait / ≤ 8.1 | **§4 mitigate** to buy time, and plan the migration |
| Exposed and showing signs of compromise | **§6 post-compromise.** Contain before patching |

---

## 3. Patch (first choice)

```bash
tools/php2shell/bin/p2s-patch --container <name> --dry-run
tools/php2shell/bin/p2s-patch --container <name>
```

It pulls, recreates, and **compares the image digest and PHP version before/after**.
Exit code 10 means "no new image published yet" — not a failure; go to §4.

If you build your own image:

```dockerfile
FROM php:8.3.36-fpm-alpine
# same for 8.2.35 / 8.4.27 / 8.5.12
```

```bash
docker build -t <app>:php8.3.36 . && docker compose up -d --force-recreate --no-deps <service>
```

### Verify after patching (mandatory)

```bash
docker exec <c> php -v      # 8.3.36 or equivalent
tools/php2shell/bin/p2s-audit --target <host>   # must no longer exit 10
```

---

## 4. Mitigate (**partial** — never a substitute for updating)

PHP states these are not complete fixes. **Know what each one covers.**

### 4-1. What the tool installs (the CVE-2026-109619 side)

```bash
tools/php2shell/bin/p2s-mitigate --container <name> --dry-run
tools/php2shell/bin/p2s-mitigate --container <name>
docker exec <c> php -r 'echo ini_get("session.upload_progress.enabled");'   # must be 0
```

It mounts an ini through a compose override (it does not rewrite files inside the container), so the
setting survives recreation. `--revert` puts it back.

### 4-2. What you must add by hand (the CVE-2026-109618 side)

`memory_limit` changes application memory behaviour, so the tool will not set it for you.

```ini
; conf.d/zz-php2shell-mem.ini  or the FPM pool
memory_limit = -1
post_max_size = 8M
upload_max_filesize = 6M
```

In an FPM pool (`/etc/php/<ver>/fpm/pool.d/*.conf`):

```ini
php_admin_value[memory_limit] = -1
php_admin_value[post_max_size] = 8M
php_admin_flag[session.upload_progress.enabled] = off
```

- If the application needs uploads, raise `post_max_size` to about 32M and keep
  `upload_max_filesize` below it.
- **`memory_limit = -1` trades away availability.** Set a container/cgroup memory limit so only the
  affected worker dies. Do not use `RLIMIT_AS` / `RLIMIT_DATA` (they can trigger the vulnerable
  allocation failure).
- **`.user.ini` and `ini_set()` are not acceptable** (PHP says so explicitly).

### 4-3. Drop the trigger itself (optional, must be tested)

Every known trigger is a `multipart/form-data` body.

```nginx
# this breaks file uploads — verify before keeping it
if ($http_content_type ~* "multipart/form-data") { return 403; }
```

Apache:

```apache
RewriteEngine On
RewriteCond %{HTTP:Content-Type} multipart/form-data [NC]
RewriteRule ^ - [F]
```

After adding it, **exercise the main flows** (login, post, upload). If something breaks, remove it
immediately. It is meant to be removed once the patched runtime is in place.

---

## 5. Verify

```bash
tools/php2shell/bin/p2s-audit --target <host>            # nothing exposed
docker exec <c> php -v                                   # the running version
docker exec <c> php -i | grep -E 'session.upload_progress|memory_limit|post_max_size'
tools/php2shell/bin/p2s-hunt --container <c> --target <host> --scan
bash tools/php2shell/tests/selftest.sh <host>            # includes the restart check
```

**Do not skip the restart check.** Settings disappearing on `docker compose up -d` is a real failure
mode. `selftest.sh` restarts the container at the end and re-reads the values.

---

## 6. When you suspect compromise

**Order: contain → preserve → investigate → rebuild → rotate.**
Cleaning first destroys the evidence.

### 6-1. Signals

| Signal | How to check |
|---|---|
| New or modified `.php` file | `p2s-hunt --scan` (diff against baseline) |
| `.php` file under an upload directory | Same (a finding even if baselined) |
| A burst of 5xx | `p2s-hunt --logs --since 72h` |
| Unexpected egress | `p2s-hunt --scan` (non-loopback sockets) |

### 6-2. Procedure

```bash
# 1. contain (do not delete)
docker stop <container>

# 2. preserve
docker cp <container>:/var/www/html /tmp/evidence-html-$(date +%s)
docker logs <container> > /tmp/evidence-log-$(date +%s).txt 2>&1

# 3. investigate
tools/php2shell/bin/p2s-hunt --container <c> --target <host> --logs --since 72h
```

Then, in this order:

1. **Rotate credentials** the container could read: application logins, the database, API keys in
   its settings. **CVE-2026-109618 leaks memory**, so tokens and sessions from other requests the
   same worker handled may also have leaked — include SSO sessions in your thinking.
2. **Rebuild from the image.** Do not "clean" a running container.
3. **Check lateral movement**: is the container talking to non-loopback addresses? Is the Docker
   socket mounted (if so, assume host compromise)?
4. **Find the entry**: reverse proxy / CDN / SSO logs, to identify when and which session.

---

## 7. Edge (optional)

```bash
tools/php2shell/bin/p2s-edge --zone <zone> --dry-run       # dry-run by default
tools/php2shell/bin/p2s-edge --zone <zone> --apply
tools/php2shell/bin/p2s-edge --zone <zone> --php-host <host> --apply   # exempt a PHP-serving host
```

What it installs: `.php`/`.phtml`/`.phar` paths, `/cgi-bin/`, phpmyadmin / wp-login, dotfiles
(`/.env`, `/.git`), PHP-CGI argument-injection markers.

**What it cannot install**: request-body rules. On Cloudflare's Free plan `http.request.body.raw` is
unavailable; the tool detects the rejection and drops just that rule.

> **Important**: the edge stops the scanner wave, not php2shell itself. **The origin control (§3 or
> §4) is the real mitigation.** Do not treat the edge as completion.

---

## 8. Run it continuously

```bash
tools/php2shell/deploy/install.sh <ssh-host>    # 6-hourly systemd user timer
systemctl --user list-timers php2shell-watch.timer
journalctl --user -u php2shell-watch
```

`p2s-watch` checks three things: runtime exposure, web-root integrity, and **the appearance of a new
PHP surface**. The third one matters — it catches the moment someone starts a dormant CMS.

---

## 9. Known gaps (deliberately not addressed)

- **No rate limiting / Fail2ban.** It changes request handling and deserves its own change window.
- **Container egress is unrestricted.** A compromised container is also an exfiltration path.
  `DOCKER-USER` allowlisting is the next step, but it needs an inventory of each container's
  legitimate destinations first.
- **Ports published on the LAN** are a separate problem. Docker publishes ports past `ufw`, so
  "ufw blocks it" is not evidence. Worth auditing independently of php2shell.
