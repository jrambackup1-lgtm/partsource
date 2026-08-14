# 13 — Write POC demo and pilot runbook

**Blocked by:** 12 — Align tests and release audit for POC ship

**Status:** complete

## What to build

Create the tiny operator packet for shipping.

It must say what to demo, what is true, what is not true, and how to stop or roll back.

## Output

- Runbook: [`../poc-demo-runbook.md`](../poc-demo-runbook.md)
- Evidence values were finalized with local POC candidate audit output, commit SHA, and `web/dist/release.json`.

## Acceptance criteria

- [x] Demo script covers McMaster-number input, `M4 screws` search, guided screw selection, supplier search handoff, add to named BOM, reload, CSV/JSON export.
- [x] Runbook states allowed claims and banned claims in plain English.
- [x] Release evidence links commit SHA, test commands, build, browser smoke, release.json, and production/local URL/local-only status.
- [x] Known limitations are explicit: no API, no scraping, no equivalents, no prices, no stock, no checkout, limited pilot catalog.
- [x] Rollback or stop-demo procedure is documented.

## Audit resolution — 2026-08-10

Retain `complete` as a historical runbook deliverable only. The runbook is not current ship permission because Ticket 12 is reopened, the runtime gate is FAIL, and human/domain gates remain open.

Audit: `research/wayfinder-ticket-audit-2026-08-10.md`.
