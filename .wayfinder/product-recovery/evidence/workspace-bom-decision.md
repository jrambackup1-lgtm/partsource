# Workspace/BOM recovery decision

**Date:** 2026-08-15
**Decision:** **DEFER — no implementation**
**Authority boundary:** `research/product-contract.md` is the sole product authority and currently excludes BOM/workspace workflows.

## Current decision

Do not add a Workspace/BOM route, navigation item, persistence model, storage, import/export, batch matcher, project dashboard, quantity/note workflow, or procurement implication. Historical prototypes and planning are evidence only. No runtime implementation is approved or present as part of this recovery closeout.

The current product remains Home + Catalog. A selected catalog record is not a saved BOM line, approved part, suitable choice, alternate, offer, or procurement-ready item.

## Reconsideration triggers

Reopen the hypothesis only when all are true:

1. One bounded real family has lawful publication permission, reviewed field/mapping provenance, qualified mechanical approval of an immutable digest, and lifecycle controls.
2. Direct sessions with practicing engineers pass the plan's completion, comprehension, false-selection, repeated-value, and next-artifact gates.
3. Observed users repeatedly need to return to or hand off explicit selections; evidence distinguishes saved discovery from batch/BOM preflight.
4. A separate test uses safely redacted participant-owned 5–15-line inputs and proves raw lines are retained, no line is silently substituted/dropped, and batch processing reduces meaningful work.
5. Privacy, local-data lifecycle, backup, migration, deletion, release mismatch, stale/withdrawn records, and export safety have approved designs.

## Approval gate

Implementation may begin only after a written product decision explicitly reviews and changes `research/product-contract.md`. That decision must name the bounded job, data boundary, non-approval language, acceptance corpus, storage/lifecycle design, and rollback/removal condition. Supplier, price, stock, quote, order, equivalence, suitability, and approval remain separate exclusions.

Until those triggers and approval exist, the ticket status is **external-blocked / DEFER**, not incomplete implementation work.
