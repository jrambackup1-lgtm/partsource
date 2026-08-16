# PartSource discovery benchmark

**Status:** Wayfinder test plan. Not acceptance criteria and not an implementation backlog.

## Purpose

Test whether the family-first hypothesis improves real mechanical-component discovery over the current PartSource list/detail flow and common external workarounds.

The benchmark should falsify the idea if it does not reduce wrong turns or configuration uncertainty.

## Compare

A. Current PartSource search/list/detail flow.  
B. Behavioral prototype: `sketches/002-behavioral-family-workspace/`.  
C. Participant's normal method: Google, McMaster, distributor search, internal history, or another tool.

Do not compare visual preference alone.

## Participants

Minimum useful round:

- 3-5 mechanical/product engineers who specify or reuse fasteners;
- 1-2 people who source or purchase those parts, if available;
- Jay as the first domain-expert dry run, not the only evidence.

No outreach or recruiting is performed without Jay's approval.

## Task set

Use actual reviewed records where an exact answer is required. Do not fabricate a catalog answer to make the prototype look successful.

### Broad intent

1. `M4 screw` — identify plausible families without losing the M4 requirement.
2. `stainless M5 screw, 20 mm long` — preserve known constraints while keeping head/drive unresolved.
3. `Allen screw M4` — test terminology normalization and whether the interpretation is visible.
4. `low-profile socket screw M4` — test whether low profile is a separate family or a family facet.

### Family-specific intent

5. `M4 socket head screw` — reach Socket Head Cap Screws with M4 applied.
6. `M4 × 0.7 × 12 mm socket head, alloy steel` — reduce to published records without silently choosing finish or strength.
7. `DIN 912 M4 × 12` — test standard parsing and family filtering against the supplied standard field.
8. `M4 socket head, black oxide` — test reviewed material/finish normalization and missing-field language.
9. `M4 button head screw` — keep drive unresolved instead of silently choosing the hexagon-socket button-head family.
10. `M4 Phillips pan head screw` — route to Pan Head Machine Screws with Phillips applied as a drive facet.

### Known identifier

11. `91290A115` — resolve one reviewed identifier mapping, open Socket Head Cap Screws, and show the M3 × 0.5 × 10 mm configuration first.
12. A reviewed identifier from each other proposed POC family — repeat exact mapping without standalone-product pages.
13. An identifier-shaped value absent from the test release — show not found; do not infer a family from format alone.

### Truth and failure states

14. A technically plausible configuration absent from the release — say `not indexed`, not `invalid` or `unavailable`.
15. A combination that violates a supported family rule — explain which constraint conflicts. Use only a rule backed by reviewed engineering evidence.
16. A query with unsupported terminology — preserve the raw query and show which terms were not understood.

### Workflow completion

17. Select one unique configuration, add a frozen snapshot to a named BOM, change quantity, and export it.
18. From the same selected configuration, search at two supplier destinations. Ask whether the handoff saves work or merely recreates a Google query.

## Measures

Capture per task:

- completion or failure;
- time to correct family;
- time to one unique configuration, when applicable;
- wrong-family selections;
- backtracks;
- unsupported assumptions made by the participant;
- participant confidence in the selected configuration, 1-5;
- whether trust/provenance wording changed the decision;
- whether supplier search added value;
- whether BOM capture felt natural or premature.

## Decision thresholds

These are exploration thresholds, not launch acceptance criteria.

Keep the family-first hypothesis only if:

- exact-identifier tasks are no slower than current PartSource;
- broad/family-specific tasks have fewer wrong turns than the current flow;
- users can explain the difference between a requirement, a published configuration, an identifier mapping, and a supplier destination;
- at least a majority of engineer participants prefer the family workspace for configuration recovery for task reasons, not aesthetics;
- supplier handoff produces a concrete next step in at least half of workflow tasks.

Reject or revise if:

- family selection adds ceremony to exact lookup;
- users repeatedly disagree with the family taxonomy;
- required facet order blocks experienced users;
- the product cannot explain missing pitch/finish or any row-level standard gaps without destroying trust;
- supplier links are judged equivalent to typing the query into Google.

## Evidence hygiene

- Record task failures, not only successful clicks.
- Preserve raw timing and observation notes separately from conclusions.
- Do not claim statistical significance from a small POC sample.
- Treat Jay's expert judgment as high-value domain input, not market validation.
- Any public supplier or identifier claim still passes `research/data-source-register.md`.

## Wayfinder close condition

Tickets 15 and 16 can close only after this benchmark or an equivalent test supplies direct evidence. If real participants are unavailable, do not pretend expert review is user validation; keep the tickets open and label the remaining risk.
