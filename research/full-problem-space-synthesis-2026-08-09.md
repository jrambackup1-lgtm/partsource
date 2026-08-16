# PartSource full-problem-space synthesis

**Date:** 2026-08-09  
**Phase:** Wayfinder exploration  
**Decision:** Desk exploration is complete. Do not start `/to-spec` yet. Run the bounded evidence gate below or explicitly accept its risks.

## 1. What the product currently is

PartSource is an early public fastener research POC.

It currently supports:

- text and exact-identifier search;
- flat result rows and part detail;
- local BOM snapshots;
- supplier search handoffs;
- a Supabase Edge Function over imported catalog rows;
- a static GitHub Pages frontend.

Its intended boundary is research and handoff. It does not prove equivalence, suitability, manufacture, stock, availability, or price.

The current implementation is not safe or credible enough for a public pitch demo.

## 2. Confirmed findings

### Product

- Engineers move between rough descriptions, known identifiers, specifications, BOMs, suppliers, manufacturing, and quality records.
- Supplier catalogs are useful reference tools but do not preserve a neutral engineering state through those handoffs.
- Family-first is an interaction model. It is not a proven value proposition.
- Exact identifiers are the strongest current entry path.
- No target-user validation exists. The recorded study remains 0/12 sessions.
- Three screw families cannot prove a general mechanical-parts platform.

### Current UX

- The current UI is row-first and dashboard-like.
- It repeats facts, hides important distinctions, and overstates confidence.
- It does not cleanly distinguish search interpretation, engineering requirement, family, configuration, identifier mapping, evidence, supplier destination, or BOM snapshot.
- Local search failure can surface raw fetch errors rather than preserving input and failing closed.
- One universal result page is a poor fit for broad text, family-specific text, and exact identifiers.

### Data

- Source rows: 27,009.
- Nonblank unique identifiers: 26,953.
- Imperial rows: 18,232. All carry TPI-like thread information, but the importer leaves pitch null and the API renders `N/A`.
- Repeated current import-signature groups: 1,591 across 3,502 rows.
- In 1,311 groups across 2,863 rows, omitted supplied fields differ. Automatic deduplication would lose mechanical distinctions.
- Important fields are dropped, including head dimensions, drive size, thread fit/direction, threading extent, and minimum thread length.
- Finish is absent as a dedicated field on 75% of rows. At least 9,728 rows appear to combine finish with material.
- `strength` mixes grade/class, tensile strength, and hardness.
- Import buckets are not product families.
- Standards coverage is 83.9%, but editions and relationship semantics are absent.
- Current rows mutate in place. There is no immutable release, correction, supersession, or withdrawal lifecycle.
- BOMs freeze display strings but not durable configuration revision or mapping identity.

### Search

- Current non-exact search is substring-based, row-first, unranked, and mechanically unsafe for numeric filtering.
- Explicit dimensions, units, standards, material, finish, drive, and strength must filter or cause abstention. They must never become relevance boosts.
- PostgreSQL exact indexes, typed predicates, FTS, and narrow trigram suggestions are enough at current scale.
- Missing rows do not prove invalidity.
- An unknown identifier must not be fuzzed into a nearby identifier.
- Search failure must remove stale answers while preserving input.

### Architecture and deployment

- The proposed four public relations can work only as immutable, release-stamped serving records backed by private durable evidence and family-specific schemas.
- A universal EAV/ontology is unnecessary.
- Raw RPC rows and private lineage must not reach the browser.
- The no-JWT Edge Function is a fully public API. It is acceptable only with a narrow allowlist, request limits, timeouts, abuse budgets, and release/request IDs.
- The public frontend is stale.
- The proposed family deep link returns 404.
- Sampled exact API calls took about 1.4–2.6 seconds. Controlled latency is not yet proved.
- GitHub Pages is adequate for a non-transactional POC after deep-link, cache, and deployment-state handling are fixed.

### Exploration correction

The first exact-identifier prototype showed `91290A115` with the wrong configuration. The permitted source row is M3 × 0.5 × 10 mm. The prototype was corrected. This proves the need for a frozen truth corpus before implementation.

## 3. Leading direction — strong hypothesis, not validated truth

The bounded POC claim should be:

> Fastener specification recovery and safe handoff.

PartSource should:

1. preserve the raw input;
2. expose the search interpretation and unresolved facts;
3. resolve an exact identifier or coherent family without guessing;
4. apply family-specific hard constraints and facets;
5. distinguish `invalid`, `not in release`, `unknown`, and `service unavailable`;
6. permit selection only after every family-required fact is explicit or supported and no critical conflict remains;
7. freeze a compact release-aware record for local BOM reuse or an inspectable supplier query.

It must not claim full application requirement capture or suitability.

## 4. UX direction

Use an intent-adaptive engineering workspace:

- **Broad input:** preserve input and show a small family candidate set.
- **Family-specific input:** show selected and unresolved family facts, candidate records, and safe facets.
- **Exact identifier:** show the supplied mapping, configuration facts, gaps, and evidence. No dashboard statistics.
- **Comparison:** show differences first and state that comparison is not equivalence.
- **BOM snapshot:** freeze release/configuration identity and unresolved warnings.

Minimalism means less chrome, not less engineering truth.

Geometry is optional. Keep it only if accurate, text-equivalent geometry measurably reduces wrong choices.

## 5. Data and public architecture direction

Use:

- private source records and lineage;
- reviewed family-specific identity profiles;
- reviewed public families, configurations, identifiers, and releases;
- typed promoted fields for search/facets;
- bounded reviewed JSON for the long tail;
- field-group evidence for the POC;
- append-only releases with whole-release rollback;
- allowlisted Edge DTOs only;
- deterministic release/parser/search versions;
- browser-local BOM snapshots tied to public configuration revision and release.

Do not:

- auto-merge duplicate-looking rows;
- infer standards, pitch, finish, strength, material, equivalence, or suitability;
- expose source identities or private lineage;
- mutate released truth in place;
- build a universal ontology before another family proves need.

## 6. Search direction

Pipeline:

1. bound and preserve raw input;
2. exact namespace-aware identifier branch;
3. deterministic family-aware parsing;
4. conflict detection before retrieval;
5. family ranking from reviewed aliases and family-changing terms;
6. hard predicates inside the family;
7. stable results, facets, explanations, and failure states.

Safe typo suggestions apply only to eligible family words. Never fuzz identifiers, dimensions, units, thread tokens, material classes, or standards.

Defer embeddings, LLM parsing, and external search engines until measured corpus and scale triggers are met. They can propose candidates later. They cannot create truth.

## 7. Agent disagreements and decisions

### Wedge

- Product audit: broader requirement continuity.
- Skeptical review: this overclaims the data and job.
- **Decision:** narrow to fastener specification recovery and safe handoff. Treat full requirement continuity as future research.

### Family-first

- UX/search audits: leading workspace pattern.
- Skeptical review: clean demo, not validated product.
- **Decision:** preserve it as the leading interaction hypothesis, not the product promise.

### Passport and provenance

- Data/UX audits: evidence can differentiate.
- Skeptical review: a large passport is bureaucracy, and confidential provenance can be unauditable.
- **Decision:** durable private evidence plus compact public fact-level explanations. Reject evidence-count dashboards and one `verified` badge.

### Geometry

- UX audit: useful family aid.
- Skeptical review: generic geometry creates false authority.
- **Decision:** nice-to-have only after accurate data and measured task benefit.

### Architecture

- Initial design: four public relations are enough.
- Red team: only with immutable releases, private evidence, typed promoted fields, and family schemas.
- **Decision:** keep the bridge with those conditions. Reject both dangerous flatness and premature EAV.

### Repeat-use wedge

- One-at-a-time recovery is easy to demonstrate.
- Product and skeptical audits identify a 5–15-line BOM readiness audit as the strongest challenger.
- **Decision:** test both manually before choosing the final product wedge.

## 8. Open questions that desk research cannot resolve

1. Do engineers repeatedly perform this recovery/handoff job?
2. Does family-first reduce time or wrong-family turns versus their normal tools?
3. Is a compact frozen record useful enough to reuse?
4. Does supplier-specific query translation save meaningful work?
5. Does a BOM readiness audit create more repeat value than one-at-a-time recovery?
6. Which family boundaries and required fields are mechanically correct?
7. Should the first release be metric-only or mixed metric/imperial?
8. How many source rows can receive credible family and identity review?
9. Can public evidence stay useful when source identity is confidential?
10. Does a contrasting sanctioned category break the proposed bridge and interaction model?

## 9. Explicitly defer

- application suitability and engineering calculations;
- equivalence, replacement, or approved alternates;
- price, stock, availability, offers, checkout, quote routing, and affiliate claims;
- supplier scraping and unsanctioned catalog ingestion;
- accounts, cloud BOMs, teams, ERP, and punchout;
- automatic BOM-line resolution;
- general tolerances, fits, GD&T, and standard-equivalence logic;
- CAD/photo/geometry search;
- external search engines, embeddings, LLM parsing, and AI chat;
- multilingual search, personalization, learning-to-rank, and pSEO;
- broader mechanical-platform claims.

## 10. Recommended next gate

Do not run another desk-ideation loop. Do not start `/to-spec` yet.

Run five high-information tests:

1. **Recent-work study:** 6–8 engineers; use their own redacted fastener lines and current workflow.
2. **Blind truth/composition benchmark:** freeze at least 150 reviewed query cases before comparing current, family-first, and exact-inspector flows.
3. **Manual BOM challenger:** resolve 5–15 real redacted lines manually; compare value and repeat intent against one-at-a-time recovery.
4. **Supplier-query test:** test one preserved configuration across three destinations; measure edits and false confidence.
5. **Platform falsification:** use one sanctioned contrasting category only to test whether the bridge and interaction model break—not to expand POC scope.

Domain review must also approve:

- initial families;
- family-required fields;
- identity and normalization rules;
- metric/imperial boundary;
- first reviewed release size.

After those results, decide one of three paths:

- specify and build the recovery/handoff POC;
- pivot the POC to BOM readiness;
- stop because the job or data cannot support a credible product.

## Evidence

The durable evidence is indexed in `.wayfinder/poc-ship/poc-ship-map.md`. Primary reports:

- `research/full-problem-space-product-opportunities-2026-08-09.md`
- `research/modern-engineering-ux-opportunities-2026-08-09.md`
- `research/mechanical-data-trust-opportunities-2026-08-09.md`
- `research/mechanical-search-discovery-frontier-2026-08-09.md`
- `research/poc-architecture-risk-red-team-2026-08-09.md`
- `research/full-problem-space-skeptical-review-2026-08-09.md`
- `research/current-system-structural-audit-2026-08-09.md`
