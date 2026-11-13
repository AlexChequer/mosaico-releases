# Mosaico downloads

Mosaico runs your Claude Code and Codex sessions side by side and shows the state of each one (Working, Needs you, Done, Ready), for macOS and Windows.

**Download it from the page: https://alexchequer.github.io/mosaico-releases/**

This repository holds only that page, the install scripts and the [releases](https://github.com/AlexChequer/mosaico-releases/releases); the app's source code isn't public yet.

## Install

macOS 14 or later, Apple silicon, in Terminal:

```bash
curl -fsSL https://alexchequer.github.io/mosaico-releases/install.sh | bash
```

Windows 10 (1809 or later) or 11, 64-bit, in PowerShell:

```powershell
irm https://alexchequer.github.io/mosaico-releases/install.ps1 | iex
```

Mosaico isn't signed by Apple or Microsoft yet. These commands download without the browser, so the first-launch warning doesn't appear; read [install.sh](install.sh) and [install.ps1](install.ps1) to see what they do. A file downloaded in the browser works too, after allowing it once (the page explains how).

## License

Free software under the GPL-3.0-or-later ([LICENSE](LICENSE)); third-party notices in [THIRD-PARTY-NOTICES.md](THIRD-PARTY-NOTICES.md). The name and the icon are covered by [TRADEMARKS.md](TRADEMARKS.md). Claude Code is made by Anthropic and Codex by OpenAI; Mosaico isn't affiliated with either.
