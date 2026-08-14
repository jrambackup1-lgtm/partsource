# 05 — Prepare pilot configuration packet

**Blocked by:** 04 — Build hardware configuration catalog

**Status:** closed — out of scope after C rethink 2026-08-10

**C boundary:** Closed without completion. No reviewed configuration packet is authorized before a paid job and qualified domain authority exist.

## What to build

Prepare a small pilot packet for common screws.

The packet must help the demo feel real.

It is configuration data, not part-to-part mapping.

## Acceptance criteria

- [x] Include common socket-head and M4 screw examples.
- [ ] Each record has reviewed configuration facts.
- [ ] Each record states source/provenance for technical facts.
- [x] Each record has a clear demo/real-data flag.
- [x] Zero supplier price, stock, availability, or offer data.
- [x] Zero equivalent, replacement, or approved alternate claims.

## Historical resolution

Closed on 2026-08-09.

- Added `web/src/data/pilotConfigurationPacket.ts` with common socket-head/M4/hex examples.
- Added `web/scripts/test-pilot-configuration-packet.ts` and wired it into `npm test`.

## Evidence

- `npm run lint` — passed.
- `npm test` — passed.
- `npm run build` — passed.
- `npm run test:browser` — 9 passed.

## Reopened audit — 2026-08-10

The packet passes structural checks, but “reviewed” is not supported by a real qualified mechanical review record and the technical facts lack source-level provenance. Proxy/synthetic review cannot satisfy those criteria. Ticket 05 is open again; no packet is release-approved.

Audit: `research/wayfinder-ticket-audit-2026-08-10.md`.
