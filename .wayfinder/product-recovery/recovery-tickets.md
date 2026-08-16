# Product recovery tickets — execution closeout

**Date:** 2026-08-16 (updated from 2026-08-15)
**Authority:** Status ledger only; `research/product-contract.md` remains the sole product contract.

| Ticket | Recovery phase | Status | Closed/proxy evidence | Remaining gate |
|---:|---|---|---|---|
| R1 | 0 — authority and release truth | **CLOSED LOCALLY** | Authority hierarchy retained; closed app release schema, artifact manifest, deploy-byte verification contract, separate visible catalog identity; release tests pass | Actual production deployment and canonical live-byte verification are not claimed |
| R2 | 1 — UX recovery | **PROXY-CLOSED** | UX decision plus implemented Home/Catalog shell and browser scenarios | Practicing-engineer and assistive-technology observations remain open |
| R3 | 2 — catalog contracts | **CLOSED — SYNTHETIC SCOPE** | Closed parser, finalized SHA-256 package digest, identity/revision/provenance/trusted-approval and adversarial tests | Real facts, mappings, permission packet, and qualified review absent |
| R4 | 3 — deterministic engine | **CLOSED — SYNTHETIC SCOPE** | Query, exact revision, filter/facet, URL v2/history, projection, regression, and boundary tests | External mechanical/domain review absent |
| R5 | 4 — product shell/catalog UI | **CLOSED — SYNTHETIC CANDIDATE** | Home + Catalog, explicit family step, facets/table, exact highlight-not-select, user detail selection, failure states, responsive/keyboard Playwright coverage; spec-contradicting alias test fixed 2026-08-16 | Human usability/accessibility validation absent |
| R6 | 5 — lawful real-family pilot | **PROXY-CLOSED / EXTERNAL-BLOCKED** | Aggregate-only permission-attested audit and pilot-boundary tests; synthetic schema proxy; **real bounded aggregate audit 2026-08-16** — 27,009 records, 3 families, one structural blocker (blank identifiers), mixed units flagged for review | No family has passed field map, mechanical review, exact-digest approval, or publication-boundary approval; remain synthetic |
| R7 | 6 — direct engineer validation | **PROXY-CLOSED / EXTERNAL-BLOCKED** | `evidence/engineer-validation-proxy.md` maps automated scenarios/results | No external participants; human gate OPEN |
| R8 | 7 — Workspace/BOM hypothesis | **EXTERNAL-BLOCKED / DEFER** | Explicit no-build decision in `evidence/workspace-bom-decision.md` | Requires real-family + engineer evidence and explicit contract change |

## Shared verification

`cd web && npm run release:audit` is the executable repository gate: TypeScript lint; POC, catalog, and release tests; document guard; Vite build; eight Playwright tests; and runtime boundary. A pass closes local candidate work only. It does not create mechanical truth, source permission, engineer validation, Workspace/BOM authority, or production deployment evidence.
