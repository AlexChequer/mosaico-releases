# SPDX-License-Identifier: GPL-3.0-or-later
# Copyright (C) 2026 Alex Chequer
#
# Installs Mosaico on Windows: downloads the latest installer from
# https://github.com/AlexChequer/mosaico-releases and runs it for the current
# user (no administrator needed).
#
#   irm https://alexchequer.github.io/mosaico-releases/install.ps1 | iex
#
# Downloaded by PowerShell, the installer doesn't get the "from the internet"
# mark a browser adds, so SmartScreen doesn't stop it; Mosaico isn't signed by
# Microsoft yet. Nothing else on the computer is changed.

# Everything runs from Install-Mosaico, called on the last line, so a download
# cut halfway through runs nothing. Errors use throw, never exit, which would
# close the window this was pasted in.
function Install-Mosaico {
    $ErrorActionPreference = 'Stop'
    # Windows PowerShell 5.1 shows a slow progress bar and may not offer TLS 1.2 by default.
    $ProgressPreference = 'SilentlyContinue'
    [Net.ServicePointManager]::SecurityProtocol = [Net.ServicePointManager]::SecurityProtocol -bor [Net.SecurityProtocolType]::Tls12

    $url = 'https://github.com/AlexChequer/mosaico-releases/releases/latest/download/Mosaico-Windows-Setup.exe'

    if (-not [Environment]::Is64BitOperatingSystem) {
        throw "Mosaico wasn't installed: it needs 64-bit Windows."
    }
    if ([Environment]::OSVersion.Version.Build -lt 17763) {
        throw "Mosaico wasn't installed: it needs Windows 10 version 1809 or later."
    }
    if (Get-Process -Name mosaico -ErrorAction SilentlyContinue) {
        throw "Mosaico wasn't installed: it's open. Close it and run this again; your panes come back when you reopen it."
    }

    $setup = Join-Path ([IO.Path]::GetTempPath()) 'Mosaico-Windows-Setup.exe'
    Write-Host 'Downloading Mosaico...'
    try {
        Invoke-WebRequest -Uri $url -OutFile $setup -UseBasicParsing
    } catch {
        throw "Mosaico wasn't installed: the download failed. Check your connection and try again. ($($_.Exception.Message))"
    }

    Write-Host 'Installing...'
    $process = Start-Process -FilePath $setup -ArgumentList '/S' -Wait -PassThru
    Remove-Item $setup -ErrorAction SilentlyContinue
    if ($process.ExitCode -ne 0) {
        throw "Mosaico wasn't installed: the installer stopped with code $($process.ExitCode)."
    }

    $app = Join-Path $env:LOCALAPPDATA 'Mosaico\mosaico.exe'
    if (Test-Path $app) {
        Write-Host 'Mosaico is installed. It is in the Start menu too.'
        Start-Process -FilePath $app
    } else {
        Write-Host 'Mosaico is installed. Open it from the Start menu.'
    }
}

Install-Mosaico
