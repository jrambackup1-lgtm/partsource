# Family discovery sketch comparison

**Status:** Superseded static-layout experiment. Cross-review found contradictory filter/selection states and no real mobile or exact-identifier behavior. Keep only as visual evidence; do not use it to choose the interaction model.

## Question

Should the core family page lead with a dense faceted catalog or a progressive guided configurator?

## Variants

- `001-family-faceted-catalog/index.html`
- `001-family-guided-configurator/index.html`

Both use the current PartSource visual foundation and simulate:

- `M4 socket head screw` resolving to the Socket Head Cap Screws family;
- the M4 intent being retained as a family constraint;
- `91290A115` resolving to the same family with the exact M3 × 10 mm configuration selected;
- provenance/trust copy;
- local BOM capture;
- supplier search destinations without supplier-listing or equivalence claims.

## Head-to-head

| Dimension | Faceted catalog | Guided configurator |
|---|---|---|
| Expert scanning | Strong | Weak |
| Compare nearby configurations | Strong | Medium |
| Help with imperfect descriptions | Medium | Strong |
| Explain valid choices | Medium | Strong |
| Scale to hundreds of variants | Strong with server pagination | Strong only if it eventually exposes result rows |
| Known-ID highlighted state | Strong | Strong, but easier to hide family context |
| Mobile path | Requires filter drawer + card/compact rows | Naturally stacks |
| Risk | Becomes a legacy filter wall | Becomes a slow wizard |

## Visual verification

Both rendered cleanly at desktop width. The faceted table made the family/configuration distinction clearest and supported direct comparison. The guided variant made intent parsing and valid-choice narrowing easier to understand.

The prototypes intentionally avoided gradients, decorative dashboards, fake CAD, prices, inventory, and generic SaaS hero layouts.

## Provisional conclusion

Do not choose either extreme.

Test a hybrid next:

1. family identity and parsed intent at the top;
2. a small row of high-value guided controls for system, thread, material, and length;
3. a compact faceted configuration table for remaining attributes and comparison;
4. a stable selected-configuration inspector;
5. exact identifiers prefill the controls and highlight the matching row;
6. mobile uses a filter drawer and selected-configuration sheet.

This is provisional until reference UX and data/search research are challenged.
