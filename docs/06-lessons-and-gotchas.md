# Traps we walked into, and judgement calls we got wrong

[**English**](06-lessons-and-gotchas.md) | [日本語](06-lessons-and-gotchas.ja.md)

This is not a tidy retrospective written after the fact. It is the record of **what went wrong while
doing the work**, kept so the next person (or agent) does not repeat it.

## 1. We called the mechanism before the primary source existed

**What we did**: leaked-stage public analyses converged on a `session.upload_progress` use-after-free,
so we concluded "disable that feature and the bug is closed" and implemented it as the main control.

**What was actually true**: PHP's advisory split it in two.

| CVE | Reality | Effective mitigation |
|---|---|---|
| CVE-2026-109618 | OOM handling (`longjmp`) corrupts request state; includes the upload-progress unserialiser UAF | `memory_limit=-1` + `post_max_size` cap |
| CVE-2026-109619 | Freed global state reused by the next request | `session.upload_progress.enabled=0` |

The ini we shipped closed **only the 109619 half**. The 109618 half needs `memory_limit`.

**Lesson**: leaked-stage analysis describes what an attack *looks like*, not what the *fix* is.
Mitigation is only settled when the vendor advisory lands. Until then, implement it as
**provisional**, and reconcile against the advisory on release day. We nearly missed that step.

**Generalised**: "we implemented a control" and "the control works" are different claims. When the
basis is an inference, write down that it is an inference — so it can be corrected later.

## 2. Settings applied with `docker exec` vanish silently at the next `up -d`

Rewriting `php.ini` inside a container is undone by the next `docker compose up -d`, because the
container is recreated from the image. **No error is raised.** You believe you are covered, and the
next restart removes it.

**Correct approach**: mount it read-only through a compose override.

```yaml
# docker-compose.override.yml (auto-loaded, so it survives recreation)
services:
  app:
    volumes:
      - ./zz-php2shell.ini:/usr/local/etc/php/conf.d/zz-php2shell.ini:ro
```

Name it `zz-…` so it is read **last** (overriding image defaults). Confirm the directory with
`php -i | grep 'Scan this dir'`; it differs between images.

## 3. compose does not notice a new mount

Adding a `volumes:` entry to `docker-compose.override.yml` and running `docker compose up -d` can
print **"Container ... Running" and change nothing** (depends on the compose version). A config file
change is not a recreation trigger.

**Correct approach**: force it, then verify **inside** the container.

```bash
docker compose up -d --force-recreate --no-deps <service>
docker exec <c> php -r 'echo ini_get("session.upload_progress.enabled");'
```

"It is running" from the outside is not evidence of anything.

## 4. The tag does not necessarily match the contents

`image: latest` with a binary several generations old is normal. In particular, **you cannot tell
from a tag whether the vendor rebuilt on a fixed runtime**.

**Correct approach**: ask the running binary.

```bash
docker exec <c> php -v          # 8.3.36-style version, or not
docker inspect <c> --format '{{.Image}}'
docker images --digests | grep <image>
```

Publication times come from the Docker Hub API:

```bash
curl -s "https://hub.docker.com/v2/repositories/<owner>/<repo>/tags?page_size=5&ordering=last_updated" \
  | jq -r '.results[]|"\(.name)\t\(.last_updated)\t\(.digest[0:19])"'
```

## 5. Never report a rule you could not install as installed

On Cloudflare's Free plan you cannot inspect request bodies ( `http.request.body.raw` is a WAF
Advanced field). The API refuses:

```
not entitled: the use of field http.request.body.raw is not allowed,
a WAF Advanced plan is required
```

**Do not**: write the rule, fail to apply it, and report "mitigated".
**Do**: report "path-based rules are in place; the body rule is blocked by the plan; the origin-side
control is the real one."

This kind of partial success is **most dangerous when it is reported as success**. When handing over
a list of controls, always separate what landed from what did not.

## 6. Distribution packages lag. The runtime is fixed, `/usr/bin/node` is not

Fixing container and user-local runtimes still leaves the distribution's `/usr/bin/node` behind,
waiting for the repo to catch up. systemd services run as root pick up `/usr/bin/node`, so that one
runtime stays exposed.

**Lesson**: when you say "we updated Node", say **which** node. Include `which -a node` and the
`nodefix-audit` output (host and containers).

## 7. The derived-image method has ABI limits

`COPY --from=node:<fixed> /usr/local/bin/node` works **within the same major line** (matching ABI).
But:

- Wolfi / Alpine bases may lack shared libraries (`libatomic` etc.)
- **Native modules such as `better-sqlite3` must be recompiled against the new ABI.** Swapping the
  binary will not work — rebuild from source
- The derived image **pins the app version**. When upstream rebuilds, drop the derived tag; forget
  and the app stops being updated

## 8. The vendor says not to rely on `.user.ini` or `ini_set()`

PHP's advisory explicitly warns against both for these mitigations. `.user.ini` is read after request
parsing; `ini_set()` cannot override admin-level settings. On shared hosting where `.user.ini` is all
you have, **that is not a mitigation** — know that.

## 9. "End of life" is not a safety argument

PHP 8.1 and older get no official fix. That is not "out of scope" — it is **no fix exists, so
exposure continues**. Those hosts face a three-way choice: mitigate, take it down, or upgrade. The
moment you write "EOL, therefore not affected", that host becomes invisible.

## 10. Dates drift by a day. Match on version numbers

The blog date, the `dist/index.json` build date and the changelog date for the same release can
disagree by a day (timezone plus publication timing). **Matching by date produces confusion.
Matching by version number does not.**

## 11. A stopped image is inventory, and future vulnerability

Images that never appear in `docker ps` — a multi-year-old PHP image, an unused CMS — **restore a
vulnerable runtime the moment someone starts them**. One such image was still sitting there four
years on. Review the image inventory periodically: delete what you do not need, and re-pull before
starting anything you have not run in a while.

## 12. Verification has to survive a restart

A setting that works right after you apply it proves nothing (§2, §3). "Mitigated" only becomes true
once the container has been **recreated and the setting is still there**.
`tools/php2shell/tests/selftest.sh` ends with exactly that check.

## Summary: next time

1. During the leak window, implement as **provisional** and reconcile on release day
2. Apply settings through a **compose override mount**, not `docker exec`
3. Change with `--force-recreate`, verify **inside** the container
4. Read versions from the **running binary** (do not trust tags)
5. Do not report a control you **could not install** as installed
6. Record **which runtime** you updated, specifically
