# php2shell — two RCEs in PHP itself (CVE-2026-109618 / CVE-2026-109619)

[**English**](01-php2shell.md) | [日本語](01-php2shell.ja.md)

The community name comes from the leaked exploit tool. This document covers only what a defender
needs.

## 1. What is vulnerable

| Item | Detail |
|---|---|
| Affected | **Every PHP release from 5.4.0 (2012) onward** |
| SAPI | php-fpm, Apache mod_php, php-cgi, FrankenPHP, LiteSpeed — **anything serving web requests** |
| Fixed | Published 2026-10-21: 8.5.12 / 8.4.27 / 8.3.36 / 8.2.35 |
| 8.1 and older | **No official fix.** The PHP project published minimal source backports for 7.4 / 8.0 / 8.1 |
| CVSS | v4.0 **9.2** (both). 9.8 under v3.1 |
| Attack requirements | No authentication, but High complexity (`AC:H`) |
| Exploitation | Public. Attempts observed at 07:43 UTC, before the fix shipped |

**The important property**: the bug lives in `php-src` request handling. Application code, framework
routers, plugins and path-based WAF rules are all bypassed. "My app is up to date" is not a
mitigation.

## 2. The two CVEs are different bugs

### CVE-2026-109618 — request state corrupted by OOM handling

PHP handles allocation failure (OOM) with `longjmp()`, aborting request handling. On some paths,
request memory is passed onward **uninitialised**, and cleanup then treats invalid data as valid,
leading to RCE.

From the attacker's side the concrete primitive is a **use-after-free in the upload-progress
unserialiser**, which has a side effect:

- **Freed worker memory is returned to the client inside the `PHPSESSID` response cookie**
  (Sansec's analysis). A Heartbleed-like disclosure that can contain other requests' passwords,
  session tokens, API keys and TLS private keys.
- It works even in applications that never call `session_start()`, because the handler runs before
  application code.

### CVE-2026-109619 — stale global state reused

PHP keeps several pieces of global state pointing into request memory. In some scenarios that state
is not reset, or is repopulated after being reset, leaving it **pointing at freed memory**. When the
same worker handles the next request, reading that stale state before normal initialisation
overwrites it gives RCE. OPcache type confusion is involved.

## 3. So mitigation has to work at feature level

Pattern filtering does not help. **Every known trigger is a `multipart/form-data` request body**
(Sansec). Rules that inspect paths never see it.

| Target | PHP's stated mitigation | Limit of the mitigation |
|---|---|---|
| 109618 | `memory_limit = -1` set where applications **cannot override it** (FPM pool `php_admin_value`, Apache config). Plus a small `post_max_size` (8M without uploads, 32M with), `upload_max_filesize` below it | Removes the controllable memory-limit failure. **An underlying allocation failure can still reach the vulnerable path** |
| 109619 | `session.upload_progress.enabled = 0` via `php.ini` / FPM pool / server config. On PHP 8.5 also `fatal_error_backtraces = 0` | **Confirmed paths only.** Other variants remain |
| Both | Reject `multipart/form-data` at the web server (Sansec's recommendation) | Breaks file uploads. May be unusable depending on the app |

Put the settings in a `conf.d` drop-in or the FPM pool. **`.user.ini` and `ini_set()` are not
acceptable** — PHP says so explicitly: the former is read after request parsing, the latter cannot
override admin-level settings.

Example FPM pool configuration:

```ini
; /etc/php/8.3/fpm/pool.d/www.conf
php_admin_value[memory_limit] = -1
php_admin_value[post_max_size] = 8M
php_admin_flag[session.upload_progress.enabled] = off
; PHP 8.5 only
php_admin_value[fatal_error_backtraces] = 0
```

`memory_limit=-1` **trades away availability**: one request can consume all server memory. Put a
cgroup / container memory limit alongside it so only the affected worker dies. PHP explicitly warns
against substituting `RLIMIT_AS` or `RLIMIT_DATA`, because those can trigger the vulnerable
allocation failure.

## 4. Gaps in the ecosystem

- **The Remi repository** (common on RHEL-family systems) published no update on 10-21. PHP's
  advisory unusually tells users to switch to distribution packages or build from source.
- **8.1 and older** get no official fix. There is no "fixed version", so the choice is: mitigate,
  turn it off, or upgrade.
- **PHP embedded in appliances and management interfaces** cannot be patched by the administrator.
  You wait for the vendor. NCSC-NL maintains a product list in SPDX.
- Scale (VirusTotal, via The Record): ~5.1M IPs run PHP, ~758k on EOL versions, ~85k on the newest
  release available before the fix.

## 5. Detection signals (no exploit code needed)

| Signal | Meaning |
|---|---|
| New or modified `.php` file | A web shell. The most direct evidence |
| A `.php` file under an upload directory | Indistinguishable from a legitimate file by sight. **Treat as a finding even if it is in the baseline** |
| A burst of 5xx | A crashing php-fpm worker — what the UAF looks like from outside |
| Unexpected child processes / egress from a php-fpm worker | Post-exploitation |

ATT&CK: T1190 (exploit public-facing application) → T1505.003 (web shell) → T1059.004 (Unix shell) →
T1041 (exfiltration over C2 channel).

## 6. Sources

- PHP advisory: <https://www.php.net/archive/2026.php#2026-10-21-5>
- NVD: <https://services.nvd.nist.gov/rest/json/cves/2.0?cveId=CVE-2026-109618>
- Sansec: <https://sansec.io/research/php2shell> (attack chain, multipart, memory disclosure)
- NCSC-NL: <https://github.com/NCSC-NL/php2shell> (CERT-EU operational info, affected products)
- Cloudflare: <https://blog.cloudflare.com/php-vulnerabilities-waf-protection>
- The Record: <https://therecord.media/php-foundation-statement-critical-vulnerabilities> (discovery history)
