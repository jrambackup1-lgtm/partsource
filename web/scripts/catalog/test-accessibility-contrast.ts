import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const css = fs.readFileSync(path.resolve(scriptDirectory, '../../src/index.css'), 'utf8');

function luminance(hex: string): number {
  const channels = hex.replace('#', '');
  const [red, green, blue] = [0, 2, 4]
    .map(offset => Number.parseInt(channels.slice(offset, offset + 2), 16) / 255)
    .map(channel => (channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4));
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

function contrastRatio(foreground: string, background: string): number {
  const [lighter, darker] = [luminance(foreground), luminance(background)].sort((left, right) => right - left);
  return (lighter + 0.05) / (darker + 0.05);
}

function ruleColor(selector: string): string {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = new RegExp(`${escaped}\\s*\\{[^}]*color:\\s*(#[0-9a-f]{6})`, 'i').exec(css);
  assert.ok(match, `selector ${selector} with a color declaration must exist in index.css`);
  return match[1];
}

function ruleFontSize(selector: string): number {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = new RegExp(`${escaped}\\s*\\{[^}]*font-size:\\s*(\\d+(?:\\.\\d+)?)px`, 'i').exec(css);
  assert.ok(match, `selector ${selector} with a px font-size declaration must exist in index.css`);
  return Number(match[1]);
}

// u6 audit pairs: focus indicator >= 3:1; grey metadata text >= 4.5:1.
const focusRule = /button:focus-visible[^{]*\{[^}]*outline:\s*3px solid (#[0-9a-f]{6})/i.exec(css);
assert.ok(focusRule, 'focus-visible outline rule must exist');
for (const background of ['#ffffff', '#f7f8f5', '#f3f5f2']) {
  const ratio = contrastRatio(focusRule[1], background);
  assert.ok(ratio >= 3, `focus outline ${focusRule[1]} on ${background} is ${ratio.toFixed(2)}:1, must be >= 3:1`);
}

const textPairs: readonly (readonly [string, string, string])[] = [
  ['.browse-panel small', '#f3f5f2', 'browse tree counts'],
  ['.facet-title span', '#f8faf8', 'facet hint text'],
  ['.family-card-copy small', '#fafbf9', 'family card category'],
  ['details small', '#f5f7f5', 'evidence detail text'],
];
for (const [selector, background, description] of textPairs) {
  const color = ruleColor(selector);
  const ratio = contrastRatio(color, background);
  assert.ok(ratio >= 4.5, `${description} ${selector} ${color} on ${background} is ${ratio.toFixed(2)}:1, must be >= 4.5:1`);
}

// u6 size floors: the exact-match label and table headers must be >= 11px.
assert.ok(ruleFontSize('.match-label') >= 11, 'match label must render at >= 11px');
assert.ok(ruleFontSize('th') >= 11, 'table headers must render at >= 11px');

// u6 layout mechanics: sticky topbar must not be defeated by an ancestor
// overflow scrollbar container.
assert.ok(!/(html|body)\s*\{[^}]*overflow-x:\s*hidden/.test(css), 'html/body must not use overflow-x: hidden (breaks sticky)');
assert.ok(/html\s*\{[^}]*overflow-x:\s*clip/.test(css), 'html must clip horizontal overflow without a scroll container');

console.log('accessibility contrast and layout regression tests: ok');
