# Ticket 39 — post-POC UX-delta proxy-evidence gate

**Date:** 2026-08-14
**Ticket:** [39 — Ratify the post-POC UX-delta acceptance corpus and proxy-evidence gate](../tickets/39-ratify-post-poc-ux-delta-acceptance-corpus.md)
**Scope:** `PS-POC-SYNTHETIC-V1` local synthetic fixture only.
**Decision:** **PROXY PASS — bounded synthetic acceptance corpus.**
**Qualified approval:** **OPEN / NOT SUPPLIED.**

## Evidence boundary

Every finding below is **proxy evidence**. It supports only the stated synthetic POC rules and claim boundaries. It is not qualified engineering approval, mechanical correctness, product identity, standards conformance, manufacturer validation, equivalence, interchangeability, suitability, supplier status, or commercial status.

No named reviewer signed this. Independent subagents performed adversarial review; their output is a challenge input, not an approval or independent qualified review.

The gate permits the next internal synthetic implementation ticket only. It does not authorize deployment, publication, source ingestion, real catalog claims, supplier/BOM flow, comparison workspace, or external action.

## Method and source classes

1. **Public standards scope — proxy evidence.** Public ISO abstract/scope pages were checked. No protected tables, dimensions, or conformance requirements were copied or inferred.
2. **Manufacturer technical data — proxy evidence.** Accu measurement guidance and the Unbrako Engineering Guide were used only to test whether family/datum distinctions should be retained. They do not validate a PartSource record.
3. **Independent adversarial challenge — proxy evidence.** Three isolated subagents separately assessed points 1–2, points 3–5, and red-teamed the proposed gate. The controller reviewed their conclusions against the fixture and the public source metadata below. Agreement is not treated as stronger evidence than its source class.
4. **Repository observation — deterministic evidence.** The current synthetic fixture defines the three families, family-specific datum, record provenance, and mapping provenance. It is evidence of the present fixture contract only.

## Source ledger

| Source | Class | What was actually used | Limit |
|---|---|---|---|
| [ISO 4762:2004](https://www.iso.org/standard/34460.html) | public standards scope | Public abstract identifies hexagon socket head cap screws and metric coarse-pitch scope. | Does not validate a synthetic row, mapping, datum value, or conformance. |
| [ISO 7380-1:2022](https://www.iso.org/standard/78699.html) | public standards scope | Public abstract identifies hexagon socket button-head screws, metric coarse-pitch M3–M16, and reduced loadability due to head design. | Does not establish product suitability or shared behavior with other families. |
| [ISO 10642:2026](https://www.iso.org/standard/90795.html) | public standards scope | Public abstract identifies hexagon socket countersunk-head screws, metric coarse-pitch M2–M20, and reduced loadability due to head design. | Does not validate a synthetic row, mapping, or universal length rule. |
| [W3C PROV-DM](https://www.w3.org/TR/prov-dm/) | public standards/model | Public material separates entities, activities, and agents and their attribution/association relationships. | Does not prescribe PartSource schema or prove implementation. |
| [Accu — How To Measure A Screw](https://www.accu.co.uk/p/123-how-to-measure-a-screw) | manufacturer technical guidance | Measurement-convention reference for cap-head and countersunk forms. | Product/convention guidance only; not universal standards conformance. |
| [Unbrako Engineering Guide](https://unbrako.com/docs/engguide.pdf) | manufacturer technical data | Distinguishes socket-head, button-head, and flat/countersunk socket screw forms. | Does not approve PartSource labels or validate any row. |

## Five acceptance points

### 1. Exact-ID state wording

**Synthetic rule:**

- `unique`: exactly one active synthetic mapping in `PS-POC-SYNTHETIC-V1`.
- `unknown`: no active synthetic mapping in that fixture.
- `non_unique`: more than one active synthetic mapping in that fixture.

`unique` can highlight mapping evidence only. It cannot select, open, recommend, confirm, or mechanically validate a record. `unknown` and `non_unique` cannot infer a family, result, selection, or preferred mapping.

**Proxy evidence:** Standards sources distinguish fastener families but do not create a global PartSource namespace. The independent challenge confirmed that cardinality wording is defensible only when explicitly bounded to the synthetic fixture. Fixture inspection confirms synthetic mappings, including a deliberate collision, are separately represented from records.

**Required claim boundary:** Use “One synthetic catalog mapping was found,” “No mapping was found in this synthetic catalog,” or “Multiple synthetic mappings were found; no mapping was chosen.” Never use “exact/correct/confirmed part,” “verified identifier,” “approved mapping,” or equivalent wording.

**Disagreement / limit:** “Unique exact identifier” can be misread as engineering identity. The gate resolves this by requiring fixture scope in the state copy. No source can establish real-world part identity from this synthetic mapping.

**Result:** **PROXY PASS.**

### 2. Family length datum

**Synthetic rule:** `shcs` and `bhss` use `under_head`; `css` uses `overall`. Every displayed or filterable length must retain millimetres and its family datum. Cross-family output cannot erase, normalize, or equate those datums.

**Proxy evidence:** Public ISO scope pages identify three separate fastener families. Manufacturer guidance supports retaining an under-head convention for cap/button forms and an overall convention for countersunk forms. Fixture inspection confirms the current family contract declares `shcs`/`bhss` `under_head` and `css` `overall`.

**Required claim boundary:** Say “Synthetic fixture length: 20 mm, under head” or “Synthetic fixture length: 20 mm, overall.” Never say measured, standards-correct, dimensionally verified, directly comparable, or suitable for a stated requirement.

**Disagreement / limit:** Direct first-party manufacturer wording for button-head measurement was weaker than for cap-head and countersunk measurement. The rule therefore remains a fixture-level convention, not a universal real-world claim. ISO public abstracts do not expose all datum definitions or protected tables.

**Result:** **PROXY PASS.**

### 3. Typed filter applicability by family

**Synthetic rule:** `family`, diameter, pitch, length, material, and finish are only exact, typed, AND-only filters when explicitly populated in the active synthetic family scope. `drive` and `head_profile` are descriptive facts, not selection filters. Unsupported terms, units, ranges, OR, negation, and inferred conversions stop rather than mutate into filters. A valid impossible combination returns `catalog_empty` with all constraints visible.

**Proxy evidence:** ISO 4762, ISO 7380-1, and ISO 10642 identify distinct families and non-identical published size scopes. ISO 7380-1 and ISO 10642 also explicitly flag reduced loadability due to head design. The independent challenge found that shared nominal fields must not imply shared mechanical behavior or substitutability.

**Required claim boundary:** Say “Filters match declared synthetic fields exactly” and “No synthetic records match active constraints.” Never say compatible, mechanically compatible, all matching parts, standards-compliant, or “no such part exists.”

**Disagreement / limit:** “Filters apply to all three schemas” is unsafe if it means identical engineering semantics. This gate interprets it only as field applicability explicitly modeled per synthetic family; length remains a typed field with different datum.

**Result:** **PROXY PASS.**

### 4. Record, fact, and mapping provenance

**Synthetic rule:** A record has fixture origin; every displayed fact is labelled fixture-authored synthetic or deterministically derived from a named synthetic input and versioned rule; every exact-ID mapping has separate synthetic namespace, mapping fixture/version, and cardinality/state provenance. Missing required provenance stops the affected state.

**Proxy evidence:** W3C PROV-DM distinguishes entities, activities, agents, and derivation relationships. This supports preserving record, fact, and mapping as distinct claims. Fixture inspection confirms the present contract carries separate `provenanceBundleId` and provenance kinds for records and mappings; it does not yet prove field-level UI behavior.

**Required claim boundary:** Use “Synthetic fixture origin,” “Synthetic fact provenance,” and “Synthetic identifier-mapping provenance.” Never use verified, trusted, certified, authoritative, approved, validated, or high-confidence labels.

**Disagreement / limit:** Three labels pointing to the same generic fixture would still be misleading. Provenance must state claim type and support relationship. Synthetic origin cannot prove manufacturer source, revision, test evidence, conformance, or human adjudication.

**Result:** **PROXY PASS.**

### 5. Comparison-ready rows without selection claims

**Synthetic rule:** Rows may expose synthetic ID, family, nominal diameter/pitch, datum-bearing length, material, finish, drive, head profile, and provenance access for first-pass inspection of declared synthetic attributes. A row activation opens synthetic detail only. There is no auto-open, auto-select, shortlist, compare workspace, alternate/replacement claim, supplier, BOM, offer, price, availability, procurement, or export action.

**Proxy evidence:** Standards and manufacturer material show that the three forms are distinct, including reduced-loadability caveats for button/countersunk forms. That supports visible descriptive differentiation, not comparison of suitability. The independent challenge identified missing selection-critical factors such as tolerance, fit, head geometry, thread extent, strength/property basis, and use conditions.

**Required claim boundary:** Say “Inspect declared synthetic attributes” and “Rows are not engineering comparisons or approval.” Never say compare compatible parts, alternatives, interchangeable, equivalent, replacement, approved alternate, recommended, supplier option, orderable, or BOM-ready.

**Disagreement / limit:** “Comparison-ready” can be read as a compatibility claim. This gate narrows it to visually inspecting synthetic fields while preserving family and datum differences. The field set is not sufficient for engineering selection.

**Result:** **PROXY PASS.**

## Disagreement register

| Issue | Challenge finding | Resolution in this gate |
|---|---|---|
| `unique` wording implies correct part | A unique local mapping can be mistaken for global or engineering identity. | State copy must name the synthetic fixture and prohibit confirmation-like terms. |
| Shared length field implies equivalence | Under-head and overall datums cannot be silently combined across forms. | Datum is mandatory in schema, UI, filtering, trace, and accessible names; the rule is fixture-level only. |
| Common filters imply common mechanical semantics | Shared nominal fields do not make SHCS, BHSS, and CSS substitutable. | Filters are typed, exact, family-scoped, and non-advisory. |
| Generic synthetic provenance is enough | One fixture label does not explain record/fact/mapping support. | Preserve separate claim types and require explicit labels. |
| Comparison-ready implies selection-ready | Visible rows omit many selection-critical facts. | Limit rows to first-pass synthetic inspection; prohibit comparison/selection/supplier controls and claims. |
| Agent agreement equals review | Independent agents are not qualified signatories. | Results remain proxy evidence only; qualified approval stays open. |

## Gate decision

**PROXY PASS — bounded synthetic acceptance corpus.** All five points have a bounded fixture rule, source-limited proxy evidence, explicit non-implication wording, and a recorded disagreement resolution. The gate does not pass any qualified-review, product-validation, standards-conformance, or release claim.

**Formal qualified approval remains OPEN / NOT SUPPLIED.**
