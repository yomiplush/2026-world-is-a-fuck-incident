#!/usr/bin/env bash
# selftest.sh [ssh-target] — prove the toolkit does what the README says.
#
#   tests/selftest.sh                          # local tooling only
#   CONTAINER=php-app APP_PORT=8080 \
#   COMPOSE_DIR=~/php-app tests/selftest.sh host   # plus live assertions
#
# Environment for the live half (all optional; live checks are skipped without
# CONTAINER):
#   CONTAINER    name of the PHP container to assert against
#   APP_PORT     loopback port the app answers on (default 8080)
#   COMPOSE_DIR  directory holding docker-compose.override.yml, on the remote host
#   HTTP_CODE    status the app should return on / (default 200; use 302 behind SSO)
#
# Read-only except for a container restart at the end, which is the point: the
# mitigation is supposed to survive it.
set -uo pipefail
HERE="$(cd "$(dirname "$(readlink -f "$0")")/.." && pwd)"
TARGET="${1:-}"
CONTAINER="${CONTAINER:-}"
APP_PORT="${APP_PORT:-8080}"
COMPOSE_DIR="${COMPOSE_DIR:-}"
HTTP_CODE="${HTTP_CODE:-200}"
pass=0; fail=0
ok()   { pass=$((pass+1)); printf '  ok    %s\n' "$*"; }
bad()  { fail=$((fail+1)); printf '  FAIL  %s\n' "$*"; }
check(){ if eval "$2" >/dev/null 2>&1; then ok "$1"; else bad "$1"; fi; }

echo "== local tooling =="
for f in "$HERE"/bin/p2s-* "$HERE"/deploy/install.sh; do
  check "syntax: ${f##*/}" "bash -n '$f'"
done
check "every tool is executable" "test -x $HERE/bin/p2s-audit -a -x $HERE/bin/p2s-mitigate -a -x $HERE/bin/p2s-hunt -a -x $HERE/bin/p2s-edge -a -x $HERE/bin/p2s-watch -a -x $HERE/bin/p2s-patch"
check "p2s-audit runs and exits 0|10" "out=\$($HERE/bin/p2s-audit --json); [ \$? -le 10 ]"
check "p2s-audit --json parses"       "$HERE/bin/p2s-audit --json | jq -e . >/dev/null"
check "p2s-edge --dry-run prints rules"  "$HERE/bin/p2s-edge --dry-run | grep -q 'p2s: php2shell'"
check "p2s-edge --json emits rules"      "$HERE/bin/p2s-edge --json | jq -e 'length >= 3' >/dev/null"
check "p2s-edge body rule present"   "$HERE/bin/p2s-edge --json | jq -e '[.[] | select(.expression | contains(\"php_session_upload_progress\"))] | length == 1' >/dev/null"
check "p2s-edge refuses to guess a zone" "! $HERE/bin/p2s-edge --apply"

echo
echo "== cloudflare token =="
envfile="${CF_ENV_FILE:-$HOME/.config/cloudflare/token.env}"
if [ -r "$envfile" ]; then
  set -a; . "$envfile"; set +a
  code=$(curl -sS -o /dev/null -w '%{http_code}' -m 10 \
    -H "Authorization: Bearer ${CF_API_TOKEN:-}" \
    "https://api.cloudflare.com/client/v4/user/tokens/verify")
  if [ "$code" = "200" ]; then ok "token verifies"
  else printf '  warn  token check returned HTTP %s (edge rules cannot be applied — runbooks/php2shell.md)\n' "$code"; fi
else
  printf '  warn  no cloudflare env file at %s\n' "$envfile"
fi

if [ -z "$TARGET" ] || [ -z "$CONTAINER" ]; then
  echo
  printf 'result: %d passed, %d failed (live checks skipped — pass an ssh target and set CONTAINER)\n' "$pass" "$fail"
  [ "$fail" -eq 0 ]
  exit $?
fi

echo
echo "== live: $TARGET ($CONTAINER) =="
S() { ssh -o BatchMode=yes -o ConnectTimeout=15 "$TARGET" "$@"; }

"$HERE/bin/p2s-audit" --target "$TARGET" >/dev/null 2>&1
case $? in
  0)  ok "audit reports nothing exposed" ;;
  10) bad "audit still reports an exposed runtime" ;;
  *)  bad "audit could not run (ssh/docker group?)" ;;
esac

up=$(S "docker exec $CONTAINER php -r 'echo ini_get(\"session.upload_progress.enabled\");'" 2>/dev/null)
if [ "$up" = "0" ]; then ok "upload_progress off inside the container"; else bad "upload_progress=${up:-unreadable}"; fi

strict=$(S "docker exec $CONTAINER php -r 'echo ini_get(\"session.use_strict_mode\");'" 2>/dev/null)
if [ "$strict" = "1" ]; then ok "strict mode on inside the container"; else bad "use_strict_mode=${strict:-unreadable}"; fi

if [ -n "$COMPOSE_DIR" ]; then
  if S "test -f $COMPOSE_DIR/docker-compose.override.yml"; then ok "override file exists"; else bad "override file missing"; fi
  if S "cd $COMPOSE_DIR && docker compose config | grep -q zz-php2shell.ini"; then
    ok "compose actually applies the mount"
  else
    bad "compose does not apply the mount"
  fi
fi

code=$(S "curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:$APP_PORT/" 2>/dev/null)
if [ "$code" = "$HTTP_CODE" ]; then ok "app answers over loopback ($code)"; else bad "loopback HTTP ${code:-none} (want $HTTP_CODE)"; fi

if "$HERE/bin/p2s-hunt" --container "$CONTAINER" --target "$TARGET" --scan 2>&1 | grep -q 'RESULT: clean'; then
  ok "integrity scan is clean"
else
  bad "integrity scan has findings"
fi

echo
echo "  -- persistence: restart the container, the ini must still be off --"
S "docker restart $CONTAINER" >/dev/null 2>&1
sleep 8
up=$(S "docker exec $CONTAINER php -r 'echo ini_get(\"session.upload_progress.enabled\");'" 2>/dev/null)
if [ "$up" = "0" ]; then ok "after restart: upload_progress still off"; else bad "after restart: upload_progress=${up:-unreadable}"; fi
code=$(S "curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:$APP_PORT/" 2>/dev/null)
if [ "$code" = "$HTTP_CODE" ]; then ok "after restart: app still answers"; else bad "after restart: HTTP ${code:-none}"; fi

echo
printf 'result: %d passed, %d failed\n' "$pass" "$fail"
[ "$fail" -eq 0 ]
