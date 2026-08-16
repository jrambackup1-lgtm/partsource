---
title: Real catalog becomes the active dev product experience
status: resolved
resolved: 2026-08-16
label: wayfinder:ticket
created: 2026-08-16
updated: 2026-08-16
audit: ../live-product-root-cause-2026-08-16.md
fixes: RC2
depends: f1
---

## Problem (user perspective)

Even with the recovered code, opening the product shows the 30-record synthetic catalog. The 27k real catalog requires three manual developer actions (build artifact, dev server, hand-edited `?catalog=real` URL) and ~34 s to appear, mislabeled "SYNTHETIC DATA" when it does. The owner's requirement — "the real 27k catalog is the active product catalog" — has no ticket.

## Root cause

Four stacked gates (gitignored artifact → dev-server-only middleware → URL param, no UI affordance → synthetic module-load default). Three are the deliberate u1 decision D5 ("synthetic remains the module-load default"), which chose pipeline safety over product activation. Publication gates do **not** block dev/local activation (audit decision D2 authorizes it; only public deployment requires mechanical review, field adjudication, publication approval).

## Scope

1. **Decision first (D5 amendment, recorded before code):** in the dev server (`import.meta.env.DEV` and artifact reachable), the real release becomes the default catalog; production build and preview keep the synthetic default until publication approval. `?catalog=synthetic` becomes the explicit opt-out for dev. Update `decisions/u1-real-catalog-data-decisions.md` and the plan.
2. `web/src/dev-catalog-source.ts` — make `requestedCatalogSelection` environment-aware (never auto-fetch real in production); fail closed to a clearly labeled synthetic fallback if the artifact is absent or fails verification.
3. `web/src/catalog/ui/CatalogApp.tsx` — pill + notice must describe the **active** catalog (kill the hardcoded "Synthetic data" strong label at line ~370); loading state honest about expected duration (~110 MB, tens of seconds); error card copy without `npm run` commands in user-facing text.
4. Known cost accepted and recorded: ~34 s first load (~24.5 s parse, ~800 MB heap). Perf work (chunked/streamed artifact, cache) is explicitly deferred — not this ticket.

## Out of scope

Shipping real data in the production build (blocked by `research/data-source-register.md` until the external gates clear); artifact size/perf optimization; any catalog-content change.

## Verification (resolved 2026-08-16)

- Dev server default: real release active with no URL parameter (swap 34–81 s measured; pill "Dev catalog — cofounder data"; notice "Development data | Cofounder-provided dataset…"; "View all 26953 parts"; `M4 screw` → 79-family chooser).
- Dev deep link (`?v=3&release=…&digest=…&q=M4+screw&f_nominal_diameter_mm=4`): loads real in 39.9 s, **zero** warning cards, 79-family chooser, URL constraint preserved as removable chip.
- `?catalog=synthetic` opt-out: synthetic active, param round-trips across search.
- Production mode (`vite build` + `vite preview`): default synthetic; `?catalog=real` → synthetic, 0 warnings, real fetch never attempted; duplicated `catalog` param still rejected; `utm_source`-only still inert.
- Engine: `hydrateCatalogUrl` treats app-owned parameters (`catalog`, `page`, `sort`, `dir`) alone as empty state (f2 fix for the bare-param warning); regression assertions added (`test-engine-url-history.ts`); engine suites green.
- Suites: lint green; `test-engine`, `test-engine-url-history` green; browser 16/16 after stabilizing the load-flaked mobile scroll-lock test (timeout 30 s → 90 s with comment; f5 scope, fixed early because it blocked repeatable green runs).
