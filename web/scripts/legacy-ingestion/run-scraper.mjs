#!/usr/bin/env node
/**
 * Historical launcher for the isolated Zoro pricing experiment. It uses the
 * project venv when present and otherwise probes system Python installations.
 */
import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const safetyWarning = '[legacy ingestion] NON-PRODUCTION experiment; sanctioned-source use only.';
if (process.env.PARTSOURCE_ENABLE_LEGACY_INGESTION !== '1') {
  console.error(`${safetyWarning} Set PARTSOURCE_ENABLE_LEGACY_INGESTION=1 to opt in.`);
  process.exit(1);
}
console.warn(safetyWarning);

const __dirname = dirname(fileURLToPath(import.meta.url));
const webRoot = resolve(__dirname, '..', '..');
const script = resolve(__dirname, 'scraper_server.py');

// Candidate Python interpreters in priority order.
const venvPython = process.platform === 'win32'
  ? resolve(webRoot, '.venv', 'Scripts', 'python.exe')
  : resolve(webRoot, '.venv', 'bin', 'python');

const candidates = [
  ...(existsSync(venvPython) ? [venvPython] : []),
  ...(process.platform === 'win32' ? ['py', 'python', 'python3'] : ['python3', 'python']),
];

function trySpawn(python) {
  return new Promise((resolve) => {
    const probe = spawn(python, ['-c', 'import scrapling'], {
      stdio: 'pipe',
      shell: process.platform === 'win32',
    });
    probe.on('error', () => resolve(false));
    probe.on('exit', (code) => resolve(code === 0));
  });
}

(async () => {
  let chosen = null;
  for (const candidate of candidates) {
    // For the venv we trust it exists and has scrapling if requirements were installed.
    if (candidate === venvPython) { chosen = candidate; break; }
    if (await trySpawn(candidate)) { chosen = candidate; break; }
  }

  if (!chosen) {
    console.error('\n[scraper] No Python with `scrapling` available.');
    console.error('[scraper] See archive/legacy-ingestion for the historical setup files.');
    console.error('[scraper] Legacy ingestion was not started.\n');
    process.exit(1);
  }

  console.log(`[scraper] Using: ${chosen}`);
  const port = process.env.SCRAPER_PORT || '3001';
  const child = spawn(chosen, [script, port], {
    stdio: 'inherit',
    shell: process.platform === 'win32',
  });
  child.on('exit', (code) => process.exit(code ?? 0));
})();
