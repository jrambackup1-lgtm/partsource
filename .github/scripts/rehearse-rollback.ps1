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

function Invoke-Checked {
  param([string]$Label, [scriptblock]$Command)
  "`n== $Label ==" | Tee-Object -FilePath $evidencePath -Append
  & $Command 2>&1 | Tee-Object -FilePath $evidencePath -Append
  if ($LASTEXITCODE -ne 0) { throw "$Label failed with exit code $LASTEXITCODE" }
}

try {
  @(
    "PartSource rollback rehearsal (non-production)",
    "Revision: $resolvedRevision",
    "Started UTC: $([DateTime]::UtcNow.ToString('o'))",
    "Temporary checkout: $temporaryRoot",
    "No deploy or history rewrite is performed."
  ) | Set-Content $evidencePath

  Invoke-Checked "Archive known-good revision" { git archive --format=zip --output=$archivePath $resolvedRevision }
  Expand-Archive -LiteralPath $archivePath -DestinationPath $temporaryRoot
  Push-Location (Join-Path $temporaryRoot "web")
  Invoke-Checked "Deterministic install" { npm ci }
  Invoke-Checked "Typecheck" { npm run lint }
  Invoke-Checked "Tests" { npm test }
  Invoke-Checked "Production build" { npm run build }
  Invoke-Checked "Browser tests" { npm run test:browser }
  "`nPASS: known-good revision verified without deploying.`nCompleted UTC: $([DateTime]::UtcNow.ToString('o'))" |
    Tee-Object -FilePath $evidencePath -Append
} catch {
  "`nFAIL: $($_.Exception.Message)`nCompleted UTC: $([DateTime]::UtcNow.ToString('o'))" |
    Tee-Object -FilePath $evidencePath -Append
  throw
} finally {
  Pop-Location -ErrorAction SilentlyContinue
  Remove-Item -LiteralPath $temporaryRoot -Recurse -Force -ErrorAction SilentlyContinue
  Remove-Item -LiteralPath $archivePath -Force -ErrorAction SilentlyContinue
  Write-Host "Evidence: $evidencePath"
}
