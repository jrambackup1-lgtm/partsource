# Socket-Head Prototype Catalog Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make all validated socket-head CSV rows available as searchable prototype configurations without changing commercial or equivalence claims.

**Architecture:** A build conversion script reads the repository CSV and writes a typed catalog artifact consumed by the decoder. The decoder adds the artifact to its search/indexed catalog but static metadata generation filters out prototype entries.

**Tech Stack:** TypeScript, tsx, Vite, React, Fuse.js, Node assert.

## Global Constraints

- Import only `data/socket-head-cap-screws.csv`.
- Prototype rows have stable `PROTO-SHCS-<mcmaster_pn-or-sku>` application IDs and retain McMaster numbers as optional reference fields.
- No price, stock, listing, offer, supplier, or equivalence data may be added.
- Prototype rows must not create static part or embed pages.
- Keep all existing catalog behavior intact.

---

### Task 1: Convert and validate the socket CSV

**Files:**
- Create: `web/scripts/generate-socket-head-prototype-catalog.ts`
- Create: `web/src/data/socketHeadPrototypeCatalog.ts`
- Create: `web/scripts/test-socket-head-prototype-catalog.ts`
- Modify: `web/package.json`

**Interfaces:**
- Produces `SocketHeadPrototypeRecord` and `SOCKET_HEAD_PROTOTYPE_CATALOG` from `web/src/data/socketHeadPrototypeCatalog.ts`.
- The record contains `partNumber`, optional `mcmaster`, `title`, `thread`, `pitch`, `length`, `material`, `finish`, `drive`, `standard`, `sourceSku`, and `isPrototype: true`.

- [ ] **Step 1: Write the failing catalog-conversion test**

```ts
import assert from 'node:assert/strict';
import { SOCKET_HEAD_PROTOTYPE_CATALOG } from '../src/data/socketHeadPrototypeCatalog';

assert.equal(SOCKET_HEAD_PROTOTYPE_CATALOG.length, 7864);
const row = SOCKET_HEAD_PROTOTYPE_CATALOG.find(item => item.mcmaster === '93615A110');
assert.ok(row);
assert.equal(row.partNumber, 'PROTO-SHCS-93615A110');
assert.equal(row.type, 'Socket Head Cap Screw');
assert.equal(row.isPrototype, true);
assert.equal(row.offers, undefined);
```

- [ ] **Step 2: Run the test and verify it fails because the module is absent**

Run: `npx tsx scripts/test-socket-head-prototype-catalog.ts`

Expected: failure resolving `socketHeadPrototypeCatalog`.

- [ ] **Step 3: Implement the build converter and generated artifact**

Use `node:fs` to parse quoted CSV rows with the existing `papaparse` dependency, reject rows missing `mcmaster_pn`, `thread_size`, `length`, or `material`, and generate the TypeScript artifact. Map fields without inventing commercial data. Add `generate:socket-catalog` and run it before tests/build so the artifact is deterministic.

The validated source has 56 rows with no `mcmaster_pn`; retain them using `PROTO-SHCS-<sku>`, without inventing a McMaster number. Reject only rows missing `sku`, `thread_size`, `length`, or `material`.

- [ ] **Step 4: Run the targeted test and regenerate the artifact**

Run: `npm run generate:socket-catalog && npx tsx scripts/test-socket-head-prototype-catalog.ts`

Expected: pass with 7,864 records and no offers.

### Task 2: Add prototype records to decoder search and lookup

**Files:**
- Modify: `web/src/lib/decoder.ts`
- Modify: `web/scripts/test-decoder.ts`

**Interfaces:**
- `db` includes standards and prototype rows.
- `resolvePartIdentity('93615A110')` returns `{ state: 'exact', part }` where `part.partNumber === 'PROTO-SHCS-93615A110'`.

- [ ] **Step 1: Write failing decoder tests**

```ts
test('prototype socket record resolves exact McMaster reference without an offer', () => {
  const result = resolvePartIdentity('93615A110');
  assertEqual(result.state, 'exact', 'prototype MPN exact lookup');
  assertEqual(result.part.partNumber, 'PROTO-SHCS-93615A110', 'stable prototype identity');
  assertEqual(result.part.offers, undefined, 'prototype record has no supplier offer');
});

test('prototype socket record is discoverable by its technical title', () => {
  const result = fuse.search('low profile 18-8 stainless socket head 4-40');
  assert(result.some(hit => hit.item.partNumber === 'PROTO-SHCS-93615A110'), 'prototype spec search result');
});
```

- [ ] **Step 2: Run the decoder test and verify the new tests fail**

Run: `npx tsx scripts/test-decoder.ts`

Expected: the new exact lookup and search assertions fail.

- [ ] **Step 3: Implement the minimum decoder integration**

Extend `Part` with the optional prototype fields required by the artifact. Convert each record into a `Part`, retain its `mcmaster` field, and append it after the existing standards catalog. Add `title` and `sourceSku` to Fuse keys only when the fields exist. Do not alter the decoder fallback or commercial fields.

- [ ] **Step 4: Run the decoder test and verify it passes**

Run: `npx tsx scripts/test-decoder.ts`

Expected: all decoder checks pass, including exact prototype lookup.

### Task 3: Preserve prototype truth and static-route containment

**Files:**
- Modify: `web/src/pages/PartDetail.tsx`
- Modify: `web/scripts/generate-static-part-pages.ts`
- Modify: `web/scripts/test-static-metadata.ts`
- Modify: `web/scripts/test-product-truth.ts`

**Interfaces:**
- Prototype part detail shows `Prototype configuration — verify before sourcing`.
- `generateStaticPartPages()` excludes `part.isPrototype === true`.

- [ ] **Step 1: Write failing truth and static-route tests**

```ts
assert.match(read('src/pages/PartDetail.tsx'), /Prototype configuration.*verify before sourcing/i);
assert.doesNotMatch(read('src/pages/PartDetail.tsx'), /prototype.*(?:offer|equivalent|in stock)/i);

const prototype = db.find(part => part.partNumber === 'PROTO-SHCS-93615A110')!;
generateStaticPartPages(distDir);
assert.equal(fs.existsSync(path.join(distDir, 'parts', encodeURIComponent(prototype.partNumber))), false);
```

- [ ] **Step 2: Run targeted tests and verify they fail**

Run: `npx tsx scripts/test-static-metadata.ts && npx tsx scripts/test-product-truth.ts`

Expected: prototype notice and static-route assertions fail.

- [ ] **Step 3: Implement bounded UI and generator behavior**

Show the prototype notice only for `item.isPrototype`. Filter prototype rows before generating part/embed route shells. Do not change sitemap behavior.

- [ ] **Step 4: Run targeted tests and verify they pass**

Run: `npx tsx scripts/test-static-metadata.ts && npx tsx scripts/test-product-truth.ts`

Expected: both scripts pass.

### Task 4: Full verification

**Files:**
- Modify only files required by Tasks 1-3.

- [ ] **Step 1: Regenerate deterministic catalog artifact**

Run: `npm run generate:socket-catalog`

- [ ] **Step 2: Run typecheck and full checks**

Run: `npm run lint && npm test && npm run build`

Expected: every command exits 0.

- [ ] **Step 3: Run browser suite**

Run: `npm run test:browser`

Expected: all browser tests pass.

- [ ] **Step 4: Review the diff**

Run: `git diff -- web/package.json web/scripts/generate-socket-head-prototype-catalog.ts web/scripts/test-socket-head-prototype-catalog.ts web/src/data/socketHeadPrototypeCatalog.ts web/src/lib/decoder.ts web/src/pages/PartDetail.tsx web/scripts/generate-static-part-pages.ts web/scripts/test-decoder.ts web/scripts/test-static-metadata.ts web/scripts/test-product-truth.ts`

Expected: only socket prototype ingestion/search, truth label, static containment, and tests changed.
