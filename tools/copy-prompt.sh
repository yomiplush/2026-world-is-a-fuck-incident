#!/usr/bin/env bash
# copy-prompt.sh [en|ja] [intel] — put the AI handoff prompt on the clipboard.
#
#   bash tools/copy-prompt.sh              # remediation prompt, English
#   bash tools/copy-prompt.sh ja           # remediation prompt, Japanese
#   bash tools/copy-prompt.sh intel        # source-catalog prompt, English
#   bash tools/copy-prompt.sh intel ja     # source-catalog prompt, Japanese
#
# Works from a clone (reads prompts/) or standalone (fetches from GitHub).
# Falls back to printing on stdout when no clipboard tool is available, so it is
# still useful over ssh.
set -euo pipefail

HERE="$(cd "$(dirname "$(readlink -f "$0")")" && pwd)"
ROOT="$(dirname "$HERE")"
RAW="https://raw.githubusercontent.com/yomiplush/2026-world-is-a-fuck-incident/main/prompts"

# Two prompts exist, each in two languages:
#   agent-prompt.*  fixes this week's PHP / Node.js / Java exposures
#   intel-prompt.*  decides what to patch, from the dated source snapshot
KIND='agent'
case "${1:-en}" in
  en|'')       LANG_SUFFIX=''      ;;
  ja|jp)       LANG_SUFFIX='.ja'   ;;
  intel)       KIND='intel'; LANG_SUFFIX=''
               case "${2:-en}" in ja|jp) LANG_SUFFIX='.ja' ;; en|'') ;; *)
                 printf 'usage: %s [en|ja] [intel|ja]\n' "${0##*/}" >&2; exit 2 ;; esac ;;
  *)           printf 'usage: %s [en|ja] [intel]\n' "${0##*/}" >&2; exit 2 ;;
esac
NAME="${KIND}-prompt${LANG_SUFFIX}.txt"

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
  case "$KIND" in
    intel) printf 'It tells the agent to: re-fetch the data first, keep affected and fixed\n'
           printf 'versions apart, cite a retrieval date per claim, and never fill a gap\n'
           printf 'from memory.\n' ;;
    *)     printf 'It tells the agent to: stay read-only first, branch on README section 2-3,\n'
           printf 'verify against the running binary, and never call a partial mitigation a fix.\n' ;;
  esac
else
  printf 'no clipboard tool found (wl-copy / xclip / xsel / pbcopy) — printing instead\n\n' >&2
  cat "$FILE"
fi
