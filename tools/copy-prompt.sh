#!/usr/bin/env bash
# copy-prompt.sh [en|ja] — put the AI handoff prompt on the clipboard.
#
#   bash tools/copy-prompt.sh        # English prompt
#   bash tools/copy-prompt.sh ja     # Japanese prompt
#
# Works from a clone (reads prompts/) or standalone (fetches from GitHub).
# Falls back to printing on stdout when no clipboard tool is available, so it is
# still useful over ssh.
set -euo pipefail

HERE="$(cd "$(dirname "$(readlink -f "$0")")" && pwd)"
ROOT="$(dirname "$HERE")"
RAW="https://raw.githubusercontent.com/yomiplush/2026-world-is-a-fuck-incident/main/prompts"

case "${1:-en}" in
  en|'')   NAME='agent-prompt.txt'     ;;
  ja|jp)   NAME='agent-prompt.ja.txt'  ;;
  *)       printf 'usage: %s [en|ja]\n' "${0##*/}" >&2; exit 2 ;;
esac

FILE="$ROOT/prompts/$NAME"
if [ ! -r "$FILE" ]; then
  # Running from somewhere else (a copied script, a pipe). Fetch instead.
  command -v curl >/dev/null 2>&1 || { printf 'no local %s and no curl\n' "$NAME" >&2; exit 1; }
  TMP="$(mktemp)"; trap 'rm -f "$TMP"' EXIT
  curl -fsSL "$RAW/$NAME" -o "$TMP" || { printf 'could not fetch %s\n' "$NAME" >&2; exit 1; }
  FILE="$TMP"
fi

copy() {
  # Redirect the tool's output: wl-copy forks a child that keeps inherited fds
  # open, which makes `copy-prompt.sh | head` hang forever. timeout is a second
  # guard for the cases where the tool waits on a compositor that never answers.
  if command -v wl-copy >/dev/null 2>&1 && [ -n "${WAYLAND_DISPLAY:-}" ]; then
    timeout 10 wl-copy < "$1" >/dev/null 2>&1
  elif command -v xclip >/dev/null 2>&1 && [ -n "${DISPLAY:-}" ]; then
    timeout 10 xclip -selection clipboard < "$1" >/dev/null 2>&1
  elif command -v xsel >/dev/null 2>&1 && [ -n "${DISPLAY:-}" ]; then
    timeout 10 xsel --clipboard --input < "$1" >/dev/null 2>&1
  elif command -v pbcopy >/dev/null 2>&1; then
    pbcopy < "$1" >/dev/null 2>&1
  else
    return 1
  fi
}

if copy "$FILE"; then
  printf 'copied: %s\n' "$NAME"
  printf 'paste it into your AI together with the repository URL.\n'
  printf 'It tells the agent to: stay read-only first, branch on README section 2-3,\n'
  printf 'verify against the running binary, and never call a partial mitigation a fix.\n'
else
  printf 'no clipboard tool found (wl-copy / xclip / xsel / pbcopy) — printing instead\n\n' >&2
  cat "$FILE"
fi
