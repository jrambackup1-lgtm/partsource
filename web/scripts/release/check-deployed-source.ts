/**
 * Deploy-truth guard (f5): the live release must be built from the local
 * HEAD. The second audit found "tests green + tickets resolved" coexisting
 * with a stale deployment because nothing connected local claims to deployed
 * bytes (root causes RC1/RC5). Run after a deploy: `npm run deploy:check`.
 */
import { execSync } from 'node:child_process';

const deployedUrl = process.env.PARTSOURCE_DEPLOYED_URL
  ?? 'https://jrambackup1-lgtm.github.io/partsource/release.json';

const localSha = execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim();
const response = await fetch(deployedUrl, { redirect: 'follow' });
if (!response.ok) throw new Error(`deployed release.json fetch failed: ${response.status}`);
const released = (await response.json()) as { sourceSha?: unknown };
if (typeof released.sourceSha !== 'string' || !/^[0-9a-f]{40}$/.test(released.sourceSha)) {
  throw new Error('deployed release.json carries no valid sourceSha');
}
if (released.sourceSha !== localSha) {
  throw new Error(
    `deployed source ${released.sourceSha.slice(0, 7)} != local HEAD ${localSha.slice(0, 7)} `
    + '— the live product is not this code; deploy before claiming resolution',
  );
}
console.log(`deploy-truth ok: live release ${released.sourceSha.slice(0, 7)} == local HEAD`);
