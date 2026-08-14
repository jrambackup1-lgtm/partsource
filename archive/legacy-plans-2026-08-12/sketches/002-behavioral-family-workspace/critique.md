# Behavioral workspace critique

**Status:** Challenge record. The interaction hypothesis is useful; the visual/product model is not approved.

## Confirmed

- Stronger than the current app: family context, required selectors, configuration list, selection gating, explicit truth states.
- The three-region workspace makes requirement → configuration → action visible.
- Exact identifier and broad query can share one family context.

## Problems

- Still looks like a prototype control panel. Example chips, coverage copy, phone toggle, test notes, and truth-state lab dominate.
- Family header consumes too much height but shows only a generic icon. No dimension callouts or selected geometry.
- The engineer’s unresolved requirement is fragmented across query chips and left filters. No compact requirement statement exists.
- Filters and table compete for attention. Nothing says which decision matters next.
- The selection inspector is mostly empty until a row is picked; the page wastes a full column.
- Four mock rows do not test real technical density, scanning, pagination, or long values.
- Exact-ID mode should be inspector-first. Reusing the same visual priority for broad and exact intent adds delay.
- Trust is described in copy, not attached to fields and mappings.

## Strong opportunities

- Persistent requirement strip: `Socket head cap screw · M4 × 0.7 · length unresolved · material unresolved`.
- Show “2 choices left” and guide the next high-information decision.
- Family diagram as an interaction surface. Hover/select a dimension to filter; row selection updates callouts.
- Compact delta compare for 2–3 configurations.
- Collapse or reuse the inspector region until a unique row exists.
- Two compositions from one model:
  - broad/family intent: requirement and family discovery first;
  - exact identifier: configuration passport and evidence first.
- Field-level evidence markers, not one page-level confidence message.

## Open

- Does guidance help experts or slow them down?
- Should filters, diagram, or table lead on desktop?
- Which three to five fields must remain visible in dense mode?
- Can mobile support configuration, or should it focus on lookup and inspection?
