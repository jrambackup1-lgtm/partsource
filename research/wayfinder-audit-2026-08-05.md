# Wayfinder Audit — 2026-08-05

## Decision

Do not start the prototype search/filter workstream from the current shipped runtime. Remove unapproved prototype data from the main bundle first. The active source register blocks this data for PartSource storage, normalization, testing, and publication pending written permission.

## Evidence

- 27,009 records are loaded synchronously into the browser: 8.39 MB raw / 591 KB gzip; local Fuse search measured about 256 ms per query.
- Static pages exclude prototypes, but SPA fallback still renders direct prototype routes.
- Hex mapping loses populated source fields; it must be corrected or explicitly excluded.
- The authoritative v1 scope remains socket-head cap screws. The source register has no approved commercial source.

## Resolved work order

1. Restore a production runtime with only approved records; add bundle and direct-route containment tests.
2. Keep raw datasets quarantined outside `src/` until source clearance is recorded.
3. Correct and validate field mapping in an isolated non-production data-validation tool only after permission is approved.
4. Rename handoff workstreams to avoid collision with authoritative R4 named BOMs and R5 launch.
5. Resume external discovery only through R0 → R1 → R2 → R3, then R4 → R5 as defined by the production-readiness plan.

## Next-session entry point

Start with R0 recovery/reset evidence and R1 source clearance. Do not treat prototype catalog work as an R4/R5 completion.
