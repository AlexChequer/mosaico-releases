#!/bin/bash
# SPDX-License-Identifier: GPL-3.0-or-later
# Copyright (C) 2026 Alex Chequer
#
# Installs Mosaico on macOS: downloads the latest release from
# https://github.com/AlexChequer/mosaico-releases and puts Mosaico.app in
# /Applications (or ~/Applications when /Applications isn't writable).
#
#   curl -fsSL https://alexchequer.github.io/mosaico-releases/install.sh | bash
#
# Downloaded with curl, the app doesn't get the quarantine mark a browser
# adds, so macOS opens it without the "can't be checked" warning; Mosaico
# isn't signed by Apple yet. Nothing else on the Mac is changed.
#
# MOSAICO_INSTALL_DIR=<folder> installs somewhere else; MOSAICO_NO_OPEN=1
# doesn't open the app at the end.

set -euo pipefail

# Everything runs from main, called on the last line, so a download cut
# halfway through runs nothing.
main() {
    local url="https://github.com/AlexChequer/mosaico-releases/releases/latest/download/Mosaico-macOS.zip"
    local site="https://alexchequer.github.io/mosaico-releases/"

    [ "$(uname -s)" = "Darwin" ] || fail "This installs the macOS app. For Windows, see $site"
    [ "$(uname -m)" = "arm64" ] || fail "Mosaico needs a Mac with Apple silicon (M1 or later)."
    local major
    major=$(sw_vers -productVersion | cut -d. -f1)
    [ "$major" -ge 14 ] || fail "Mosaico needs macOS 14 Sonoma or later (this Mac has $(sw_vers -productVersion))."
    if pgrep -xq Mosaico; then
        fail "Mosaico is open. Quit it (⌘Q) and run this again; your panes come back when you reopen it."
    fi

    local destination="${MOSAICO_INSTALL_DIR:-/Applications}"
    if [ -z "${MOSAICO_INSTALL_DIR:-}" ] && [ ! -w /Applications ]; then
        destination="$HOME/Applications"
    fi
    mkdir -p "$destination"

    # Global, so the cleanup on exit still finds it after main returns.
    temporary=$(mktemp -d)
    trap 'rm -rf "${temporary:-}"' EXIT

    echo "Downloading Mosaico…"
    curl -fL --progress-bar -o "$temporary/Mosaico.zip" "$url" || fail "The download failed. Check your connection and try again."
    ditto -x -k "$temporary/Mosaico.zip" "$temporary/unzipped"
    [ -d "$temporary/unzipped/Mosaico.app" ] || fail "The download doesn't have Mosaico.app in it."

    rm -rf "$destination/Mosaico.app"
    ditto "$temporary/unzipped/Mosaico.app" "$destination/Mosaico.app"
    # Only in case something on the way added it.
    xattr -dr com.apple.quarantine "$destination/Mosaico.app" 2>/dev/null || true

    echo "Mosaico is in $destination."
    if [ "${MOSAICO_NO_OPEN:-}" != "1" ]; then
        open "$destination/Mosaico.app"
    fi
}

fail() {
    echo "Mosaico wasn't installed: $1" >&2
    exit 1
}

main "$@"
