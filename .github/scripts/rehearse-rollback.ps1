param(
  [Parameter(Mandatory = $true)]
  [string]$Revision,
  [string]$EvidenceDirectory = ".superpowers/evidence"
)

$ErrorActionPreference = "Stop"
$repoRoot = (git rev-parse --show-toplevel).Trim()
if ($LASTEXITCODE -ne 0) { throw "Run this script inside the PartSource repository." }

$resolvedRevision = (git rev-parse --verify "$Revision^{commit}").Trim()
if ($LASTEXITCODE -ne 0) { throw "Revision does not resolve to a commit: $Revision" }

$evidenceRoot = Join-Path $repoRoot $EvidenceDirectory
New-Item -ItemType Directory -Force $evidenceRoot | Out-Null
$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$evidencePath = Join-Path $evidenceRoot "rollback-rehearsal-$($resolvedRevision.Substring(0, 12))-$timestamp.log"
$temporaryRoot = Join-Path ([System.IO.Path]::GetTempPath()) "partsource-rollback-$timestamp"
$archivePath = "$temporaryRoot.zip"
$utf8NoBom = New-Object System.Text.UTF8Encoding($false)

function Write-Evidence {
  param([string]$Text)
  Write-Host $Text
  [System.IO.File]::AppendAllText($evidencePath, "$Text`r`n", $utf8NoBom)
}

function Invoke-Checked {
  param([string]$Label, [scriptblock]$Command)
  Write-Evidence ""
  Write-Evidence "== $Label =="
  & $Command 2>&1 | ForEach-Object { Write-Evidence $_.ToString() }
  if ($LASTEXITCODE -ne 0) { throw "$Label failed with exit code $LASTEXITCODE" }
}

[System.IO.File]::WriteAllText($evidencePath, "", $utf8NoBom)
try {
  Write-Evidence "PartSource rollback rehearsal (non-production)"
  Write-Evidence "Candidate revision: $resolvedRevision"
  Write-Evidence "Started UTC: $([DateTime]::UtcNow.ToString('o'))"
  Write-Evidence "Temporary checkout: $temporaryRoot"
  Write-Evidence "No deploy or history rewrite is performed."

  Invoke-Checked "Archive candidate revision" { git archive --format=zip --output=$archivePath $resolvedRevision }
  Expand-Archive -LiteralPath $archivePath -DestinationPath $temporaryRoot
  Push-Location (Join-Path $temporaryRoot "web")
  Invoke-Checked "Deterministic install" { npm ci }
  Invoke-Checked "Typecheck" { npm run lint }
  Invoke-Checked "Tests" { npm test }
  Invoke-Checked "Production build" { npm run build }
  Invoke-Checked "Browser tests" { npm run test:browser }
  Write-Evidence ""
  Write-Evidence "Completed UTC: $([DateTime]::UtcNow.ToString('o'))"
  Write-Evidence "PASS: candidate revision verified without deploying."
} catch {
  Write-Evidence ""
  Write-Evidence "Completed UTC: $([DateTime]::UtcNow.ToString('o'))"
  Write-Evidence "FAIL: $($_.Exception.Message)"
  throw
} finally {
  Pop-Location -ErrorAction SilentlyContinue
  Remove-Item -LiteralPath $temporaryRoot -Recurse -Force -ErrorAction SilentlyContinue
  Remove-Item -LiteralPath $archivePath -Force -ErrorAction SilentlyContinue
  Write-Host "Evidence: $evidencePath"
}
