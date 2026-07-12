# Bootstraps the PartSource dev environment on Windows.
#   1. Installs Node dependencies
#   2. Creates a dedicated Python venv (so the scraper doesn't depend on
#      whatever Python happens to be on PATH)
#   3. Installs the scraper's Python dependencies
#
# Usage (from web/):  powershell -ExecutionPolicy Bypass -File scripts/setup.ps1
$ErrorActionPreference = "Stop"
Set-Location -Path (Join-Path $PSScriptRoot "..")

Write-Host "==> Installing Node dependencies" -ForegroundColor Cyan
npm install
if ($LASTEXITCODE -ne 0) { throw "npm install failed" }

Write-Host "==> Locating a usable Python (>=3.10)" -ForegroundColor Cyan
$py = $null
foreach ($candidate in @("py", "python", "python3")) {
    $cmd = Get-Command $candidate -ErrorAction SilentlyContinue
    if ($cmd) {
        $ver = & $candidate -c "import sys; print('%d.%d' % sys.version_info[:2])" 2>$null
        if ($ver) {
            $parts = $ver.Trim() -split '\.'
            if ($parts.Length -eq 2 -and [int]$parts[0] -eq 3 -and [int]$parts[1] -ge 10) {
                $py = $candidate; break
            }
        }
    }
}
if (-not $py) {
    throw "Could not find Python >= 3.10 on PATH. Install Python 3.10+ from https://python.org and re-run."
}
$pyVersion = & $py --version
Write-Host "    Using: $py  ($pyVersion)"

Write-Host "==> Creating Python virtual environment at .venv" -ForegroundColor Cyan
if (-not (Test-Path ".venv")) {
    & $py -m venv .venv
}

$venvPython = ".venv\Scripts\python.exe"
Write-Host "==> Installing Python dependencies" -ForegroundColor Cyan
& $venvPython -m pip install --upgrade pip | Out-Null
& $venvPython -m pip install -r requirements.txt
if ($LASTEXITCODE -ne 0) { throw "pip install failed" }

Write-Host ""
Write-Host "==========================================================" -ForegroundColor Green
Write-Host "  Setup complete."
Write-Host ""
Write-Host "  Run the app (frontend + scraper) with:"
Write-Host "      npm run dev:all"
Write-Host ""
Write-Host "  Or run pieces individually:"
Write-Host "      npm run dev          # frontend only"
Write-Host "      npm run scraper      # scraper only"
Write-Host "==========================================================" -ForegroundColor Green
