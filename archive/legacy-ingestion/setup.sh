#!/usr/bin/env bash
# Bootstraps the PartSource dev environment.
#   1. Installs Node dependencies
#   2. Creates a dedicated Python venv (so the scraper doesn't depend on
#      whatever Python happens to be on PATH)
#   3. Installs the scraper's Python dependencies
#
# Usage:  bash scripts/setup.sh
echo "HISTORICAL_ONLY: archived legacy-ingestion setup is intentionally non-runnable." >&2
exit 1

set -euo pipefail

cd "$(dirname "$0")/.."   # -> web/

echo "==> Installing Node dependencies"
npm install

echo "==> Locating a usable Python (>=3.10)"
PY=""
for candidate in py python3.13 python3.12 python3.11 python3 python; do
  if command -v "$candidate" >/dev/null 2>&1; then
    # Make sure it can actually run and is >=3.10
    if ver="$("$candidate" -c 'import sys; print("%d.%d" % sys.version_info[:2])' 2>/dev/null)"; then
      major="${ver%%.*}"; minor="${ver##*.}"
      if [ "$major" -eq 3 ] && [ "$minor" -ge 10 ]; then
        PY="$candidate"; break
      fi
    fi
  fi
done

if [ -z "$PY" ]; then
  echo "ERROR: Could not find Python >= 3.10 on PATH." >&2
  echo "       Install Python 3.10+ from https://python.org and re-run." >&2
  exit 1
fi
echo "    Using: $PY  ($("$PY" --version))"

echo "==> Creating Python virtual environment at .venv"
if [ ! -d ".venv" ]; then
  "$PY" -m venv .venv
fi

# Activate for the rest of this script.
# shellcheck disable=SC1091
source .venv/Scripts/activate 2>/dev/null \
  || source .venv/bin/activate

echo "==> Installing Python dependencies"
pip install --upgrade pip >/dev/null
pip install -r requirements.txt

cat <<EOF

==========================================================
  Setup complete.

  Run the app (frontend + scraper) with:
      npm run dev:all

  Or run pieces individually:
      npm run dev          # frontend only
      npm run scraper      # scraper only
==========================================================
EOF
