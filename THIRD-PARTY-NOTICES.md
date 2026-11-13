# Third-party notices

Mosaico is licensed under the GNU General Public License v3.0 or later (see [LICENSE](LICENSE)). It includes or is based on the work below, used under each one's own license. All of them are compatible with the GPL-3.0.

## Code

### SwiftTerm

The terminal emulator in every pane. https://github.com/migueldeicaza/SwiftTerm, linked as a Swift package (pinned in `project.yml`). MIT License:

```
Copyright (c) 2019-2026 Miguel de Icaza (https://github.com/migueldeicaza)
Copyright (c) 2017-2019, The xterm.js authors (https://github.com/xtermjs/xterm.js)
Copyright (c) 2014-2016, SourceLair Private Company (https://www.sourcelair.com)
Copyright (c) 2012-2013, Christopher Jeffrey (https://github.com/chjj/)
Copyright (c) 2016 Ryan L McIntyre (Powerline Extra Symbols flame silhouette, https://github.com/ryanoasis/powerline-extra-symbols)
```

The full text of the MIT License is at the end of this file.

### The Windows app (windows/, in progress)

The Windows version is built on these projects; before its first public release, the full list of Rust crates and npm packages it ships will be generated here (for example with `cargo about`).

| Project | License | Copyright |
|---|---|---|
| [Tauri](https://github.com/tauri-apps/tauri) | MIT or Apache-2.0 | The Tauri Programme within The Commons Conservancy |
| [xterm.js](https://github.com/xtermjs/xterm.js) | MIT | The xterm.js authors |
| [portable-pty](https://github.com/wezterm/wezterm/tree/main/pty) (from WezTerm) | MIT | Wez Furlong |
| [interprocess](https://github.com/kotauskas/interprocess) | 0BSD or Apache-2.0 | Copyright (c) 2020-2026 Goat |
| [sysinfo](https://github.com/GuillaumeGomez/sysinfo) | MIT | Copyright (c) 2015 Guillaume Gomez |
| Tauri's dialog and notification plugins | MIT or Apache-2.0 | The Tauri Programme within The Commons Conservancy |
| WebView2Loader.dll, in the Windows test builds | Microsoft's WebView2 SDK license (redistributable) | Microsoft Corporation |

## Color themes

The terminal colors of the classic themes in [themes.json](themes.json) are the original projects' palettes; the interface colors were derived from them for Mosaico. Each project and its copyright line, as in its license file:

| Theme in Mosaico | Project | License | Copyright |
|---|---|---|---|
| Dracula | [dracula/dracula-theme](https://github.com/dracula/dracula-theme) | MIT | Copyright (c) 2023 Dracula Theme |
| Solarized Dark, Solarized Light | [altercation/solarized](https://github.com/altercation/solarized) | MIT | Copyright (c) 2011 Ethan Schoonover |
| Nord | [nordtheme/nord](https://github.com/nordtheme/nord) | MIT | Copyright (c) 2016-present Sven Greb |
| Gruvbox Dark | [morhetz/gruvbox](https://github.com/morhetz/gruvbox) | MIT | Pavel Pertsev (the project states "MIT/X11" in its README and has no license file; the community fork [gruvbox-community/gruvbox](https://github.com/gruvbox-community/gruvbox) has "Copyright (c) 2018 Pavel Pertsev") |
| One Dark | [atom/one-dark-syntax](https://github.com/atom/one-dark-syntax) | MIT | Copyright (c) 2016 GitHub Inc. |
| Tokyo Night | Designed by enkia in [tokyo-night/tokyo-night-vscode-theme](https://github.com/tokyo-night/tokyo-night-vscode-theme); the terminal palette is the "night" style of [folke/tokyonight.nvim](https://github.com/folke/tokyonight.nvim) | MIT; Apache-2.0 | Copyright (c) 2018-present Enkia; Folke Lemaitre (tokyonight.nvim, licensed under the Apache License 2.0, https://www.apache.org/licenses/LICENSE-2.0) |
| Catppuccin Mocha, Catppuccin Latte | [catppuccin/catppuccin](https://github.com/catppuccin/catppuccin) | MIT | Copyright (c) 2021 Catppuccin |
| Monokai | Monokai by Wimer Hazenberg (https://monokai.nl), as the base16 scheme in [tinted-theming/schemes](https://github.com/tinted-theming/schemes) | MIT | Copyright (c) 2022 Tinted Theming |

## The MIT License

The text the MIT-licensed projects above share:

```
Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
```
