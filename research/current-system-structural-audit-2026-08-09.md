# Current PartSource structural audit

**Status:** Wayfinder evidence. Current implementation facts, not a target specification.

## Confirmed product problems

1. **The product starts from rows, not engineering intent.** Search results are flat `Part` cards. Every submitted query routes to `/parts/:id`; no family or requirement workspace exists (`web/src/pages/Home.tsx:55-88, 172-177`).
2. **Identity is unclear.** Detail calls one string `Part Number`; the model mixes PartSource-generated identifiers, McMaster references, source SKUs, and decoded input (`PartDetail.tsx:280-304`; `decoder.ts:505-546`).
3. **BOM stores a selected row, not an unresolved requirement.** Its schema still assumes `originalMcmasterNumber`, `alternativePartNumber`, `selectedCrossReferenceRecordId`, and one verification state (`bomStorage.ts:9-30`). This inherited cross-reference language conflicts with the current product boundary.
4. **One `verified` state overclaims trust.** Any indexed row becomes `origin: verified` and `verificationStatus: verified`, although family classification, technical facts, identifier mapping, and supplier evidence are separate claims (`PartDetail.tsx:310-337`).
5. **Supplier handoff is safe but weak.** It only emits supplier-site search destinations. No evidence yet shows this beats a normal search.
6. **The dashboard gives cost and queue metrics before the discovery job.** These are user-entered values, but they imply a procurement product earlier than the evidence supports (`Home.tsx:224-260`).
7. **“Related configurations” is not engineering-safe relevance.** It includes rows sharing either thread or type. It is not labelled equivalent, but the grouping is too weak to guide selection (`PartDetail.tsx:588-617`).

## Confirmed UX problems

1. Part identifier dominates the result card and detail hierarchy. Family, geometry, unresolved choices, and constraint interpretation do not lead.
2. The detail page spreads trust across status pills, warnings, source notes, application notes, specs, supplier copy, and BOM copy. Users must assemble confidence themselves.
3. Search autocomplete returns configurations only. It cannot explain query interpretation, family alternatives, unsupported terms, or valid-but-unindexed configurations.
4. Required choices and secondary facets are not separated.
5. The static schematic is useful, but no dimension callouts are tied to the selected configuration.
6. Mobile inherits the document sequence. It has no deliberate configure-versus-inspect composition.
7. The visual shell is clean but generic admin SaaS: permanent sidebar, large empty search card, dashboard labels, and uniform white cards. It does not yet feel like an engineering instrument.
8. Currency appears globally although the catalog has no supplier price. It adds commercial noise without helping discovery.
9. A local runtime with no configured Supabase endpoint still showed `Index Active` and the exact-ID shortcut `91290A115`; selecting it then showed `Configuration search temporarily unavailable`. The state label and shortcut promise more than the runtime can deliver.
10. Entering `M4 screw` in that state showed `Failed to fetch` while the default M2 configuration cards remained visible. Stale cards can look like search results for the failed query.
11. On the public deployment, `M4 screw` returned a flat list of M4 hex-head configurations while the default M2 cards stayed below it. Broad intent was silently narrowed to one family and one row order.
12. The public deployment offers EUR, GBP, and CAD display despite the authoritative USD-only contract. This is unsupported commercial chrome, not discovery value.
13. The public footer showed `Catalog:` with no release value. Release identity is not visible when trust depends on reviewed data versions.

## Confirmed mechanical-data problems

1. Database `family` is restricted to ingestion buckets: `socket`, `hex`, `rounded`. These are not valid product families (`supabase/migrations/20260809_configuration_catalog_contract.sql:26-31`).
2. Dimensions and engineering values are stored as display strings. Search uses substring matching. Numeric range, unit conversion, exact pitch, and dimensional ordering are unsafe.
3. The 27,009-row input has 26,953 unique McMaster identifiers and no duplicate identifier keys.
4. The current import signature has **1,591 repeated groups / 3,502 rows**. In **1,311 groups / 2,863 rows**, supplied technical fields omitted from the projection differ. The current projection therefore creates false duplicate candidates. Automatic canonical merging is unsafe. Full method: `research/mechanical-data-trust-opportunities-2026-08-09.md`.
5. Missing/placeholder counts: 56 McMaster identifiers, 47 materials, 56 drives, 56 head types, 4,353 standards.
6. Generated browser fallback rows and parsed unknown inputs coexist with imported source rows. Their evidence types differ but share one broad `Part` model.
7. Standards-derived fallback records claim dimensions and material classes. Their source/version evidence is not attached to each public record.

## Confirmed search problems

1. Exact reference lookup is sound as the first branch.
2. Non-exact search concatenates fields into a haystack and requires substring token matches. It has no explicit family rank, terminology graph, unit parser, typo strategy, negative constraints, or query explanation.
3. Filters use `%ILIKE%` on display strings. Existing B-tree indexes on `lower(field)` do not support these leading-wildcard predicates.
4. Results have no stable `ORDER BY`, total, cursor, release ID, facet counts, or match explanation. They stop at 25 rows (`20260809_configuration_catalog_contract.sql:74-119`).
5. Client fallback parsing can infer family, material, finish, pitch, and standard from text or known series prefixes. It marks outputs unindexed, but the generated configuration can still look authoritative (`decoder.ts:153-324`).
6. Search keystrokes call the public Edge Function after 250 ms. Each call also writes/checks a database rate-limit record.

## Confirmed architecture problems

1. The current schema has one flat configuration table. It has no first-class family, identifier namespace, publication release, withdrawal, or requirement entity.
2. The Edge Function keeps the service-role key server-side and hides raw tables. This boundary is useful.
3. The public DTO still exposes implementation-shaped provenance strings. It does not include release identity or field-level evidence.
4. Allowed browser origins include localhost and the GitHub Pages account, not the future public PartSource domain (`supabase/functions/catalog-search/index.ts:3-7`).
5. Requests without an `Origin` are allowed. The endpoint is intentionally public; CORS is not access control.
6. If the platform does not supply a trusted forwarded IP, clients share the `unknown` 60-request/minute bucket. This must be verified before demo use.
7. Static metadata pages are generated from the small browser fallback catalog, not the Supabase release. They use `Product` structured data for configuration records while adding `noindex` (`generate-static-part-pages.ts:17-45, 76-114`).

## Strong opportunities

- **Requirement workspace:** preserve what the engineer asked for before a catalog row is selected.
- **Configuration passport:** family, geometry, normalized specs, identifiers, evidence, coverage, and change state in one record.
- **Query explanation:** show understood family, constraints, synonyms, omissions, and conflicts.
- **Coverage-aware search:** distinguish impossible, valid but not indexed, not understood, and unavailable service.
- **Dimension-led configuration:** family drawing with selected dimensions and only valid next choices.
- **Delta compare:** compare selected configurations by changed fields, not full repeated tables.
- **Supplier query compiler:** translate one reviewed configuration into supplier-specific search language. Validate value before treating it as core.
- **BOM cleanup:** paste/import rough lines, resolve known lines, preserve unresolved requirements, and export canonical requirement snapshots. High-value hypothesis; not POC scope yet.
- **Trust as product:** field-level source/evidence, coverage limits, review date, and correction route. Could be a defensible advantage if data operations can support it.

## Rejected now

- Treating ingestion buckets as families.
- Treating indexed as universally verified.
- Automatic equivalence from matching dimensions.
- Automatic collapse of duplicate-looking rows.
- LLM-generated engineering facts.
- Price or availability language without supplier evidence.
- Scaling the current flat substring search as-is.
