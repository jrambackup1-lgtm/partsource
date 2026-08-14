# Wayfinder runtime audit — 2026-08-05

## Verdict

**Phase 4 blocker:** the 27,009 prototype records are production-client data in practice. They are imported synchronously by `src/lib/decoder.ts`, included in `db` and Fuse, searchable, and directly routable. `noindex`/static-page exclusion does not prevent browser download or runtime publication.

## Evidence

- `db`: 27,598 records = 27,009 prototype + 589 standards records. `decoder.ts:480-524` concatenates all three generated catalogs then constructs one Fuse index.
- Catalog source is 9.45 MB (`socket` 3.49 MB, `hex` 2.25 MB, `rounded` 3.71 MB). Production Vite build emits one application JS asset: **8,386,341 B raw / 591,450 B gzip** (`assets/index-Dlc5ZvDf.js`); build warns over 500 kB and took 32.24 s.
- In a local Node measurement, 10 common Fuse searches took **2.562 s** (~256 ms/search); 100 failed `db.find` exact lookups took 121 ms. Home invokes `fuse.search` synchronously on every input event (`Home.tsx:110-127`), and `resolvePartIdentity` scans `db` before another Fuse query (`decoder.ts:531-548`). This will cause keystroke jank on modest devices.
- `PartDetail.tsx:441-458` executes the same whole-`db` filter twice per detail render for related configurations. It is secondary today but scales linearly and is avoidable.
- Static generation correctly excludes prototypes (`generate-static-part-pages.ts:79`) and produced only 589 part + 589 embed shells. But `App.tsx:23-26` accepts every `/parts/:partNumber` and `/embed/:partNumber`; `PartDetail` resolves from the full DB. Prototype direct URLs can therefore render through the GitHub Pages SPA fallback despite no generated static page.
- Tests explicitly require runtime prototype exposure: `test-decoder.ts:171-224` asserts prototype exact McMaster resolution and title-search discoverability. `test-static-metadata.ts:41-43` only asserts their static files are absent. No test budgets initial JS, catalog count, input latency, direct prototype-route containment, or compressed asset size.

## Phase 4 actions (ordered)

1. **Remove prototype records from the shipped runtime.** Keep raw/prototype artifacts outside `src/`; do not import them into `decoder.ts`. The production catalog must contain only approved records. Add a bundle assertion that `PROTO-`, source SKUs, and prototype catalog modules are absent.
2. **Use an exact lookup index.** Build `Map<normalizedPartNumber, Part>` and `Map<normalizedMcMaster, Part>` once; replace `db.find` in identity resolution. Preserve decoding only after exact lookup misses.
3. **Make search bounded.** Debounce input (~150–250 ms) and search a compact approved search index. If prototype exploration remains needed, isolate it behind a non-production local tool or opt-in lazy-loaded dataset; never main-bundle it.
4. **Pre-index related parts.** Derive thread/type lookup maps once or compute related results once per route; do not filter 27k records twice during render.
5. **Contain routes.** Reject prototype/unapproved identities in `/parts` and `/embed`, including direct loads; retain the static exclusion test and add browser assertions for both paths.
6. **Add performance gates.** CI should parse `dist` asset sizes (initial app JS budget), assert approved runtime catalog count, assert no prototype literals in assets, and test a search interaction latency budget on a built app. Include an end-to-end test that a prototype identifier yields Not Found/unindexed, not a published configuration.

## Checks run

- `npm exec vite build` — passed; warning for 8.39 MB main chunk.
- `tsx scripts/test-decoder.ts` — 27/27 passed (also demonstrates current prototype exposure).
- `tsx scripts/test-static-metadata.ts` — passed; 589 generated part routes and 589 embed routes.
- `npm run lint` — passed.
