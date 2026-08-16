---
title: Real catalog becomes the active dev product experience
status: open
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

## Verification

- `npm run dev` + open `/`: real catalog active by default (PN-titled rows; `M4 screw` → 79-family chooser); `?catalog=synthetic` still works.
- `npm run build && npm run preview`: synthetic default, no real fetch attempt, no error card.
- With artifact deleted: labeled synthetic fallback, no crash, no raw error text.
