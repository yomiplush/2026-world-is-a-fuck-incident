#!/usr/bin/env bash
# install.sh [ssh-target]   — put the toolkit and its timer on a host.
#
#   deploy/install.sh            # this machine
#   deploy/install.sh <ssh-host>     # over ssh (no root needed: user units + docker group)
#
# Installs to ~/php2shell-defense, links the tools into ~/.local/bin, and enables
# php2shell-watch.timer as a *user* unit. Nothing here needs root; the only
# privileged piece in this toolkit is the nginx realip drop-in, installed
# separately (see runbooks/php2shell.md).
set -euo pipefail

SRC="$(cd "$(dirname "$(readlink -f "$0")")/.." && pwd)"
TARGET="${1:-local}"
DEST='~/php2shell-defense'   # ~ is expanded by the remote shell

sync_and_install() {
  mkdir -p "$HOME/php2shell-defense" "$HOME/.config/systemd/user" "$HOME/.local/bin"
  rsync -a --delete --exclude state --exclude .git "$SRC/" "$HOME/php2shell-defense/"
  chmod +x "$HOME"/php2shell-defense/bin/*
  for t in "$HOME"/php2shell-defense/bin/p2s-*; do
    ln -sf "$t" "$HOME/.local/bin/$(basename "$t")"
  done
  install -m 644 "$HOME/php2shell-defense/deploy/php2shell-watch.service" \
    "$HOME/.config/systemd/user/php2shell-watch.service"
  install -m 644 "$HOME/php2shell-defense/deploy/php2shell-watch.timer" \
    "$HOME/.config/systemd/user/php2shell-watch.timer"
  systemctl --user daemon-reload
  systemctl --user enable --now php2shell-watch.timer
  echo "installed in $HOME/php2shell-defense; timer:"
  systemctl --user list-timers php2shell-watch.timer --no-pager | sed -n '1,3p'
  echo
  echo "first run:"
  "$HOME/php2shell-defense/bin/p2s-watch" || true
}

if [ "$TARGET" = "local" ]; then
  sync_and_install
else
  rsync -a --exclude state --exclude .git "$SRC/" "$TARGET:$DEST/"
  ssh -o BatchMode=yes "$TARGET" "bash -s" <<'REMOTE'
set -euo pipefail
D="$HOME/php2shell-defense"
chmod +x "$D"/bin/*
mkdir -p "$HOME/.local/bin" "$HOME/.config/systemd/user"
for t in "$D"/bin/p2s-*; do ln -sf "$t" "$HOME/.local/bin/$(basename "$t")"; done
install -m 644 "$D/deploy/php2shell-watch.service" "$HOME/.config/systemd/user/php2shell-watch.service"
install -m 644 "$D/deploy/php2shell-watch.timer"   "$HOME/.config/systemd/user/php2shell-watch.timer"
systemctl --user daemon-reload
systemctl --user enable --now php2shell-watch.timer
echo "installed; timer:"
systemctl --user list-timers php2shell-watch.timer --no-pager | sed -n '1,3p'
echo
echo "first run:"
"$D/bin/p2s-watch" || true
REMOTE
fi
