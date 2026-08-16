# Mechanical search and discovery frontier

**Date:** 2026-08-09  
**Wayfinder ticket:** 21 — Explore the full mechanical search and discovery frontier  
**Status:** Research recommendation. Not an implementation spec or release promise.  
**Boundary:** No equivalence, replacement, approved alternate, supplier scraping, supplier listing, price, stock, availability, or LLM-generated mechanical facts.

## Executive decision

PartSource should not try to win by being a broader keyword box.

It can be meaningfully better than a supplier-site search by doing five things together:

1. resolve a reviewed identifier exactly;
2. turn rough language into an inspectable search interpretation without dropping constraints or claiming a full engineering requirement;
3. rank coherent product families before near-duplicate configurations;
4. distinguish `invalid`, `not in this release`, `unknown`, and `service unavailable`;
5. preserve the resolved configuration, evidence, release, quantity, and unresolved fields for later reuse.

That is useful product behavior.

The POC does **not** need semantic search, a hosted search cluster, CAD similarity, image recognition, or an AI chat surface. At the current 27,009-row scale, a conservative parser, reviewed aliases, typed fields, exact indexes, PostgreSQL full-text search, narrowly used trigrams, and family-scoped facets are enough to test the product hypothesis.[R3][R4][R5]

The current search is not that system. It exact-checks two row fields, then performs substring token checks over display strings, filters with leading-wildcard `ILIKE`, returns at most 25 rows without stable ranking, and treats import buckets as families.[R3][R10][R11]

### Classification summary

- **Confirmed:** exact reviewed identifier lookup is the strongest current path. The approved data has 26,953 nonblank, unique identifiers across 27,009 rows.[R4]
- **Confirmed:** hard dimensional, standard, material, and drive requirements must filter or abstain. They must never be silently changed for relevance.[R1]
- **Confirmed:** family, configuration, identifier, provenance, supplier destination, and BOM snapshot are different objects.[R1][R2]
- **Strong hypothesis:** an explained requirement-to-family-to-configuration path will beat flat supplier-style result cards on broad and partial queries.
- **Strong hypothesis:** family-scoped facets and explicit absence states are a more defensible advantage than another fuzzy search box.
- **Open question:** whether target users agree with the proposed three-family taxonomy and whether neutral supplier handoffs save meaningful work.[R4][R6]
- **Nice-to-have:** batch BOM-line resolution, geometry-led discovery, visual comparison, saved searches, and multilingual terminology.
- **Rejected:** embeddings or LLMs as the authority for identifiers, dimensions, standards, validity, equivalence, or automatic configuration selection.

## 1. What the search interpretation is allowed to mean

A query produces a **search interpretation**, not a part and not a full engineering requirement.

The search interpretation retains:

- the original input;
- exact identifier clues;
- parsed constraints and their source spans;
- units and comparison operators;
- unresolved terms;
- conflicting terms;
- candidate families;
- the catalog release and parser version used.

A result may then become one of these states:

| State | Meaning | Safe next action |
|---|---|---|
| `exact-identifier` | One reviewed identifier maps to one published configuration. | Show that configuration first, inside its family. |
| `family-candidates` | More than one family plausibly satisfies the understood requirement. | Show a short family list. Preserve every hard constraint. |
| `family-requirement` | One family is clear, but required choices or multiple configurations remain. | Open the family workspace and refine. |
| `unique-configuration` | Exactly one published configuration satisfies all supplied hard constraints. | Review family-required facts and conflicts before BOM capture or handoff. |
| `conflicting-input` | Two supplied constraints cannot both hold or use incompatible interpretations. | Point to the conflict and ask the user to remove or correct one. |
| `invalid-by-reviewed-rule` | A reviewed family or standard rule proves the combination invalid. | Explain the rule. Do not show the nearest configuration. |
| `not-in-release` | The search interpretation is plausible, but no published configuration satisfies it. | Preserve the unresolved input. Do not call it unavailable. |
| `unknown-validity` | PartSource lacks enough reviewed rules or field coverage to decide validity. | Say what is missing. Do not infer. |
| `identifier-not-found` | An identifier-shaped input has no reviewed mapping. | Do not infer from its format or prefix. |
| `unsupported-input` | The component family, unit, operator, or terminology is outside supported scope. | Offer supported family browsing without rewriting the request. |
| `search-unavailable` | Parser, catalog, release, or API required for a safe answer failed. | Clear stale results, preserve input, and offer retry. |

These states follow the current product truth contract and correct its present tendency to collapse errors into empty results or stale cards.[R1][R3]

## 2. Recommended query pipeline

### Step 0 — Bound and preserve

- Preserve the raw string exactly.
- Normalize Unicode, whitespace, case, multiplication signs, and unit spelling only into separate working fields.
- Limit bytes, tokens, lines, and operators before database work.
- Do not globally strip hyphens, slashes, decimal points, quotes, or `#`. Those characters distinguish identifiers, threads, fractions, ranges, and standards.

### Step 1 — Exact identifier branch

Probe normalized values in reviewed identifier namespaces before generic text retrieval.

Rules:

- normalization is namespace-specific;
- aliases are explicit rows, not a global punctuation-stripping trick;
- one active reviewed mapping returns `exact-identifier`;
- more than one mapping returns an ambiguity state;
- a withdrawn mapping stays withdrawn and must not route to another configuration;
- a not-found identifier-only query stops as `identifier-not-found`.

`LIMIT 1` is not collision handling. The current data is unique, but that is a packet observation, not a permanent domain rule.[R4][R5]

### Step 2 — Deterministic mechanical parsing

Use family-aware grammars and reviewed dictionaries to extract:

- family and category terms;
- head, drive, feature, and function terms;
- thread system, nominal size, pitch, and thread class where supplied;
- length and other named dimensions;
- material, condition/grade/strength, finish, and coating;
- standard issuer, number, part, and edition where supplied;
- quantity when explicitly marked as BOM quantity;
- equality, range, minimum, maximum, and tolerance operators;
- negation only where the grammar explicitly supports it.

Every parsed value carries:

```text
field, raw span, normalized value, unit, operator,
source = explicit-input | reviewed-alias,
parser rule/version, and interpretation warnings
```

No field is added merely because it is common. In particular, do not default coarse pitch, finish, material, strength class, standard, or drive when the user omitted it.[R1][R4]

### Step 3 — Detect conflicts before retrieval

Examples:

- `M4 1/4-20 socket screw` supplies metric and Unified thread identities;
- `M4 x 0.7 x 12, pitch 1.0` supplies two pitches;
- `Phillips Allen screw` supplies conflicting drive intent if `Allen` was interpreted as internal hex;
- `DIN 912 pan head` combines a standard/family clue with a conflicting head form;
- `length 10 mm and at least 12 mm` has an empty numeric interval.

Show both source spans. Never pick the later token, the more common value, or the value with more catalog rows.

### Step 4 — Rank families

Retrieve only published families.

Use reviewed family names, aliases, descriptions, applicable standard designations, and family-changing attributes. Generic terms such as `screw` or `fastener` contribute little and must not force one family.

POC auto-open rule:

- auto-open on an exact reviewed family alias or a unique reviewed standard-to-family rule **only if** all parsed family-changing terms agree;
- otherwise show 3–7 family candidates;
- broad `M4 screw` must remain broad even if one family has many more rows.

Catalog row count is a final tie-breaker at most. It must not turn coverage bias into intent.

### Step 5 — Apply hard constraints inside a family

Hard constraints are predicates, not score boosts.

A row that violates any explicit thread, dimension, material, finish, drive, strength, or standard requirement is excluded.

A row with `unknown` in a queried field is not a satisfying match. It may be counted separately as `field unknown in release` so the user can see the coverage gap.

Only soft context terms may affect ordering among hard-compatible results.

### Step 6 — Return explanation, facets, and stable order

Every response should include:

```json
{
  "rawQuery": "...",
  "intentState": "family-requirement",
  "parsedConstraints": [],
  "familyCandidates": [],
  "unresolvedSpans": [],
  "conflicts": [],
  "suggestions": [],
  "coverageWarnings": [],
  "assumptions": [],
  "releaseId": "...",
  "parserVersion": "...",
  "searchVersion": "..."
}
```

For the POC, `assumptions` should normally be empty.

The user-facing explanation can be concise:

> Understood: metric M4, socket-head family, 12 mm nominal length.  
> Unresolved: pitch, material, strength, finish, standard.  
> Not used: “for robot bracket”.

Debug responses may expose score components. Public responses should expose reasons, not a pseudo-scientific confidence percentage.

## 3. Exact identifiers

### Confirmed POC behavior

- Case-normalize only for namespaces known to be case-insensitive.
- Retain raw input and matched namespace.
- Route the exact mapping to its reviewed family and select the configuration.
- Display identifier-mapping evidence separately from configuration evidence.
- Regression-test every published active identifier for uniqueness and target stability on each release.

### Concrete cases

| Query | Expected behavior |
|---|---|
| `91290A115` | Exact reviewed mapping; open Socket Head Cap Screws with the M3 × 0.5 × 10 mm configuration selected.[R6] |
| ` 91290a115 ` | Same result only because that namespace's reviewed normalizer permits trim/case folding. |
| a reviewed internal configuration key | Exact internal namespace lookup; do not label it a supplier number. |
| an identifier present in two namespaces | Show namespace/family choices; do not choose first. |
| unknown `12345A999` | `identifier-not-found`; no series-prefix inference. |
| malformed identifier-like `91290-A-115?` | `invalid-input` or literal text search only if other meaningful text exists. |
| withdrawn identifier | Show withdrawal note and prior family context; no supplier destination. |

### Rejected

- guessing family/material/finish from a supplier-number prefix;
- fuzzy matching identifiers;
- stripping all punctuation and hoping the remainder is unique;
- treating an accepted external number as canonical identity or equivalence.

The current browser decoder contains known-series and standards inference that can make an unindexed result look more authoritative than the database response. That is unsuitable for the target search contract.[R3][R12]

## 4. Family and intent resolution

A family is valid only if it has one functional type and one coherent attribute schema.[R2]

The import labels `socket`, `hex`, and `rounded` fail that test. The rounded slice alone contains at least seven head styles and fourteen drive styles. The current leading POC candidates are Socket Head Cap Screws, Hexagon Socket Button Head Screws, and Pan Head Machine Screws; their boundaries still need domain and task validation.[R4]

### Family resolution rules

1. Family aliases identify candidates; they do not prove a configuration.
2. Geometry-changing terms outrank generic nouns.
3. A drive term may define one family, be a facet in another, or be inapplicable. Family metadata decides.
4. Standards may constrain a family only through reviewed mappings or supplied standard fields.
5. If two families remain plausible, show both. Do not use popularity to hide ambiguity.
6. A future bearing, spring, gear, seal, extrusion, or actuator must have its own grammar and facets. The fastener grammar is not a universal mechanical ontology.[R8]

### Concrete cases

| Query | Expected behavior |
|---|---|
| `M4 screw` | Preserve M4; show multiple screw families. |
| `M4 socket head screw` | Exact reviewed family alias; open Socket Head Cap Screws with M4 applied. |
| `Allen screw M4` | Interpret `Allen` as a reviewed colloquial clue to internal-hex drive/family; show that interpretation. |
| `M4 button head screw` | Button-head family candidates; keep drive unresolved. |
| `M4 Phillips pan head screw` | Pan Head Machine Screws; Phillips is a drive facet. |
| `low-profile socket screw M4` | Route only if low-profile has a reviewed family boundary; otherwise show the standard-profile and low-profile distinction. |
| `hex M4 screw` | Ask whether `hex` means external-hex head or internal-hex drive unless surrounding terms resolve it. |
| `M4 bearing` | Unsupported family in current release; do not leak fastener rows. |

## 5. Terminology, synonyms, and abbreviations

PostgreSQL supports dictionaries, synonym dictionaries, and thesauri; these normalize words into lexemes. Its documentation also warns through its design that dictionary behavior is configuration-specific, which is appropriate here.[E1][E2]

Use a versioned terminology registry with relation types:

| Relation | Example | Search treatment |
|---|---|---|
| canonical family alias | `SHCS` → `Socket Head Cap Screws` | Exact family clue. |
| spelling/format alias | `socket-head` ↔ `socket head` | Safe normalization. |
| colloquial clue | `Allen screw` → internal hex/socket candidate | Candidate plus visible explanation; not an equivalence fact. |
| attribute alias | `Phillips` → reviewed drive key | Apply only in families where drive is valid. |
| material/finish alias | `SS` | Ambiguous; ask whether stainless steel is intended unless the domain context is reviewed. |
| standard designation alias | `ISO4762` ↔ `ISO 4762` | Safe formatting normalization; edition remains separate. |
| broader/narrower term | `screw` → several families | Candidate expansion, never direct selection. |
| prohibited relationship | `same as`, `equivalent to`, `replacement for` | Do not create from terminology. |

Rules:

- keep singular/plural and punctuation aliases explicit;
- do not stem technical tokens such as `M4`, `A2`, `DIN`, `UNF`, `#10-24`, or identifier fragments;
- prefer PostgreSQL's `simple` text configuration for technical family documents;
- apply multi-word aliases before single-word terms;
- record who reviewed each alias, its scope, and its version;
- never let an alias silently add material, grade, standard, or suitability.

Elasticsearch can apply multi-word synonym graphs and search-time synonym updates without reindexing. That is useful at much larger terminology scale, but three reviewed families do not justify a separate cluster.[E4]

## 6. Quantities and units

Quantity is not a mechanical dimension.

These must remain separate:

- **BOM quantity:** `qty 20`, `20 ea`, or a CSV quantity column;
- **pack quantity:** future supplier-listing fact, outside the POC;
- **dimension count or notation:** the `20` in `M4 × 20` is normally length in a screw grammar;
- **range endpoint:** the `20` in `10–20 mm`;
- **thread count:** `20 TPI`.

POC rule: parse quantity only from a dedicated field or explicit markers such as `qty`, `quantity`, or a trailing `ea/pcs` segment. Do not interpret a bare leading or trailing integer as quantity in free text.

For units:

- preserve raw notation;
- normalize to a typed canonical value, normally SI, plus the original display value;
- store dimension kind (`length`, `angle`, `force`, `mass`, and so on), not only a unit string;
- reject unit/dimension mismatches;
- retain conversion provenance and precision;
- never compare formatted strings.

UCUM exists to make quantities and units unambiguous in machine communication and distinguishes case-sensitive from case-insensitive symbols.[E7] NIST describes conversion as multiplication/division plus selection of significant digits and rounding, and points to SP 811 for exact conversion factors.[E6] PartSource does not need to expose UCUM syntax, but it should adopt the same discipline: canonical code, dimensional type, original notation, and controlled conversion.

### Concrete cases

| Query | Expected parse |
|---|---|
| `M4 x 12 mm qty 20` | thread M4; nominal length 12 mm; BOM quantity 20. |
| `20 M4 x 12 screws` | ambiguous quantity; ask or leave `20` unresolved unless input mode defines a quantity column. |
| `1/4-20 x 1 in, 50 pcs` | Unified thread 1/4-20; nominal length 1 in; quantity 50. |
| `M4 x .472 in` | Convert length for comparison, preserve `.472 in`; do not imply exact 12 mm equality beyond conversion/rounding policy. |
| `M4 x 12` | Family grammar may interpret 12 as length, but explain that the unit was inferred only if the UI/input contract explicitly permits metric shorthand; otherwise ask for unit. |
| `M4 20 TPI` | Conflict or unsupported mixed thread notation; do not treat 20 as quantity. |

## 7. Dimensions, ranges, and tolerances

The POC data stores many engineering values as display strings. Numeric comparison, unit conversion, and dimensional ordering are unsafe until promoted fields are typed.[R3][R5]

### Minimum typed model

```text
dimension_key
nominal_value
canonical_unit
operator (=, <, <=, >, >=, between, plus_minus)
lower_bound
upper_bound
original_text
precision/rounding note
source state
```

### Search semantics

- `length = 12 mm` matches the normalized nominal length exactly under the declared conversion policy.
- `length 10..20 mm` means inclusive bounds unless the operator says otherwise.
- `under 20 mm` and `at most 20 mm` are not the same; preserve `<` versus `<=`.
- `10 ± 0.1 mm` is an interval requirement, not a request for nominal 10 only.
- A record with only a nominal value cannot prove it satisfies a tolerance interval.
- `fits a 10 mm hole` is application context, not permission to infer a screw diameter, clearance class, or tolerance.
- Named family dimensions matter. `10 mm` could mean screw length, bearing bore, spring outside diameter, gear face width, or shoulder diameter.

ISO 1101 covers geometrical tolerances of form, orientation, location, and run-out; ASME Y14.5 establishes symbols, rules, definitions, requirements, and defaults for GD&T.[E8][E9] A scalar keyword search cannot safely flatten those semantics. Until PartSource has sanctioned tolerance/GD&T data and family-specific operators, it should preserve tolerance text as an unsupported requirement rather than claim a match.

### POC boundary

Support exact nominal thread, pitch, and length plus a basic nominal length range **after** typed normalization. Preserve but do not resolve general tolerances, fits, surface finish, or GD&T.

## 8. Standards

Parse a standard into separate fields where supplied:

```text
issuer, designation number, part, edition/year,
raw text, normalized display, source field, review state
```

Rules:

1. A standard is a hard requirement when the user explicitly supplies it.
2. Match only configurations whose approved source field supports that designation.
3. Do not infer a standard from dimensions, title, identifier prefix, or common practice.
4. Do not treat two standards as equivalent because one display string contains both.
5. Preserve edition/year. If catalog data lacks edition, say so.
6. A malformed or unknown designation becomes an unresolved term, not a close standard.

Current supplied `specifications_met` coverage is 83.9%. Missing standards must stay missing.[R4]

### Concrete cases

| Query | Expected behavior |
|---|---|
| `DIN 912 M4 x 12` | Parse designation, size, nominal length; return only rows whose supplied standard field supports DIN 912. |
| `ISO4762 M4x12` | Formatting alias to ISO 4762; do not add DIN 912 unless evidence explicitly supports it. |
| `ISO 4762:2004` | Retain edition/year; if release records only designation, report edition coverage unknown. |
| `DIN 912 pan head` | Conflict between reviewed family/standard scope and head term, if that scope is supported. |
| `DIN 912 or ISO 4762` | Preserve explicit OR; do not rewrite as equivalence. |
| `ISO 7380-2 button flange` | Route only to a reviewed flange/collar family, not the plain button-head family.[R4] |

## 9. Partial, ambiguous, and conflicting requirements

Partial input is normal, not failure.

Examples:

- `stainless M5 screw, 20 mm long` has thread, material family, and length but no head/drive family;
- `M4 socket head` has a family and thread but not enough for one configuration;
- `DIN 912 M4 × 12` may still leave material, strength, finish, pitch evidence, and edition unresolved;
- `black M4 screw` may mean finish, color, or informal description.

Rules:

- retain unresolved required choices;
- show how many published configurations remain;
- do not add a partial search interpretation to a BOM as a selected configuration;
- offer a future `Save requirement` state separately;
- never relax an explicit hard constraint to avoid zero results;
- allow users to remove one interpreted chip and rerun without rewriting the raw query.

Ambiguity types should be named:

- lexical: `hex`, `SS`, `cap`, `pin`;
- structural: which number is pitch, length, quantity, or diameter;
- namespace: identifier exists in multiple systems;
- family: several families fit the words;
- coverage: the catalog lacks the queried field;
- validity: no reviewed rule proves possible or impossible.

## 10. Family validity and configuration validity

Do not use one Boolean `valid`.

Use this ladder:

1. `grammar-applicable` — the attribute belongs to this family schema;
2. `rule-valid` or `rule-invalid` — reviewed constraints prove the combination allowed or forbidden;
3. `published-configuration` — an exact released record exists;
4. `not-in-release` — no released record exists, without claiming impossibility;
5. `unknown-validity` — rules or evidence are incomplete.

A blank matrix cell cannot communicate this distinction.[R8]

Family rules require evidence and versioning. They must not be mined from current row absence. Otherwise an incomplete dataset turns “we have not indexed it” into “it cannot exist.”

For future families:

- bearings need bore/outside diameter/width, load and clearance concepts;
- springs need free length, rates, loads, wire/coil geometry, and ranges;
- gears need module/DP, tooth count, pressure angle, bore, face width, and geometry relations;
- seals need cross-section, material, pressure/temperature context, and gland geometry;
- configurable components may have continuous dimensions rather than enumerable rows.

These examples prove only that family grammars must vary. They do not define those future schemas.

## 11. Faceting

### Confirmed POC direction

- facets are declared by family;
- equality facets use normalized keys;
- numeric facets use typed ranges;
- OR applies within one facet and AND across different facets unless clearly shown otherwise;
- every value reports count and state;
- `unknown/not reported` is a visible bucket when relevant;
- active query-derived chips are visually distinct from user-selected facets;
- result and facet counts refer to configurations in the PartSource release, never supplier availability.

For the POC, conjunctive counts are sufficient. Self-excluding/disjunctive counts are useful later if testing proves users need to explore alternatives without clearing the selected facet.[R5]

Stable selector states:

- selected;
- available under current constraints;
- unavailable under current constraints;
- invalid by reviewed rule;
- not applicable to family;
- unknown/not reported.

OpenSearch's official faceted-search guidance describes facets as value/range counts that help users understand result distributions.[E13] PostgreSQL can compute the required POC counts without an external engine at current scale.[R5]

## 12. Full text and typo tolerance

PostgreSQL provides forgiving `websearch_to_tsquery`, weighted `tsvector` fields, ranking functions, and GIN indexes. `pg_trgm` provides similarity plus GIN/GiST index support for similarity and `LIKE`/`ILIKE` searches.[E1][E3]

Use them in this order:

1. exact reviewed aliases and structured parsing;
2. full-text retrieval over family documents;
3. trigrams only as a suggestion fallback for unrecognized natural-language terms.

### Safe typo policy

- no fuzzy matching for identifiers, numeric tokens, fractions, thread designations, units, property classes, or standard numbers;
- no corrections for tokens of four or fewer characters (`M4`, `DIN`, `A2`, `UNF`);
- at most edit distance 1 for family words of 5–8 characters and 2 for 9+ characters, subject to corpus tuning;
- require one clear reviewed family/alias candidate;
- show `Did you mean …?`; do not silently alter the query;
- a typo-only match never auto-selects a configuration;
- preserve the original token and corrected suggestion in the explanation.

Algolia's documentation notes that typo tolerance finds close spellings and ranks exact matches above typo matches.[E5] That general UX is useful, but mechanical tokens need much narrower protection than ordinary commerce text.

Cases:

| Query | Expected behavior |
|---|---|
| `soket head screw M4` | Suggest `socket head screw`; retain M4; no silent correction. |
| `stainles M5 pan head` | Suggest `stainless`; family resolution remains inspectable. |
| `M5` mistyped as `M6` | No typo detection; both are valid technical tokens. |
| `DIN 921` near `DIN 912` | No fuzzy standard correction. |
| `91290A116` near a known identifier | Not found, not “close enough.” |

## 13. Ranking rules

Ranking is lexicographic by match class before any numeric score.

### Identifier branch

1. exact active reviewed mapping;
2. exact ambiguous/withdrawn mapping state;
3. not found.

No text score competes with an exact identifier state.

### Family branch

Order candidates by:

1. exact reviewed family alias phrase;
2. all family-changing terms matched in one family;
3. unique reviewed standard-to-family clue;
4. exact reviewed attribute aliases applicable to the family;
5. weighted full-text score over canonical label, aliases, then description;
6. prefix match;
7. trigram suggestion, clearly labelled;
8. stable family key.

Hard-constraint compatibility is a gate. It is not a popularity boost.

For debug tests, a transparent score can be used within a match class:

```text
400 exact canonical label
350 exact reviewed alias phrase
160 all family-changing terms matched
80  applicable standard clue
40  each applicable head/drive/function term, capped
20  weighted FTS score, normalized
5   prefix match
0–4 trigram fallback
```

Do not auto-open because the total exceeds an arbitrary number. POC auto-open remains limited to exact reviewed alias or unique reviewed standard mapping with no conflict.

### Configuration branch

1. exclude every explicit hard-constraint violation;
2. separate queried-field unknowns from satisfying rows;
3. rank exact explicit-value matches above soft-context matches;
4. order engineering axes deterministically: nominal diameter, pitch, length, material/strength, finish, drive, standard, public key;
5. use keyset pagination from that same tuple;
6. enable BOM/supplier actions only when one published configuration is selected.

Never rank by supplier, price, stock, row import order, identifier presence, or inferred equivalence.

## 14. BOM-line parsing

### Strong hypothesis, not current POC scope

Batch line cleanup may create more repeat value than one-at-a-time search, but it should be tested only after interviews show recurring multi-line recovery work.[R6][R7]

A safe BOM resolver would:

1. parse CSV/TSV columns deterministically before free text;
2. preserve original headers, cells, row number, and entire line;
3. detect explicit identifier fields and quantity fields first;
4. run each line through the same identifier/requirement pipeline;
5. assign a visible per-line state;
6. allow manual correction without discarding raw input;
7. freeze only uniquely selected configurations;
8. export unresolved requirements as unresolved, not fake part rows.

Per-line states:

- exact identifier selected;
- unique configuration selected;
- family known, choices remain;
- ambiguous identifier;
- conflict;
- not in release;
- unsupported;
- malformed;
- search unavailable.

### Concrete lines

| Input line | Expected behavior |
|---|---|
| `10, 91290A115, cap screw` | Quantity 10 only if column mapping says so; exact mapping wins; description remains source text. |
| `M4 x 12 SHCS A2, qty 24` | Requirement with explicit quantity; select only if one published configuration satisfies all parsed fields. |
| `20 M4 x 12 screw` | Do not assume 20 is quantity without a column/header or explicit marker. |
| `DIN 912 M4 x 12, black, 100 pcs` | Preserve standard, finish clue, and quantity; unresolved strength/material stay visible. |
| `91290A115 / use equivalent` | Resolve the identifier clue but reject the equivalence instruction as unsupported. |
| two identical-looking lines with different notes | Do not merge automatically. Offer explicit consolidation only after the same frozen configuration and compatible user fields are confirmed. |

The current CSV importer validates positive whole-number quantities, but it still uses inherited cross-reference and one-`verified` language. A future resolver should not reuse that identity model unchanged.[R3][R13]

### LLM boundary for BOMs

An LLM may later propose column mappings or text spans in shadow mode. Its output must pass the deterministic parser and catalog validator. It may not resolve an identifier, invent a missing unit, select a standard, merge lines, or create a mechanical fact.

## 15. Geometry, CAD, sketch, and image search

CADENAS documents shape search from a reference part or rough 3D sketch and returns a ranked list of geometrically similar CAD parts. It also combines shape, 2D sketch, topology, color, and other methods.[E10]

That proves the mode is real. It does not prove it belongs in this POC.

### Useful future modes

- family silhouette chooser for head/drive/flange/shoulder distinctions;
- 2D sketch or image as a family candidate generator;
- topology/dimension query for bore count, hole pattern, envelope, or mating features;
- 3D shape similarity against a sanctioned, normalized CAD corpus;
- CAD metadata and geometry combined with exact identifiers and typed constraints.

### Safety and data requirements

- sanctioned geometry rights and provenance;
- format, model unit, coordinate frame, revision, and configuration identity;
- isolated parsing for untrusted CAD files, file/triangle limits, malware and archive-bomb controls;
- explicit retention/deletion policy for potentially confidential customer CAD;
- prefilter by family/category before similarity ranking where possible;
- geometry result labelled `shape-similar candidate` only;
- material, grade, tolerance, thread class, standard, certification, and fit remain separate constraints;
- no equivalence or interchangeability claim from visual or geometric similarity.

### Image boundary

A photo may suggest family-changing visible features. It generally cannot safely establish hidden thread pitch, exact dimensions without scale/calibration, material grade, strength, tolerance, standard, or identifier.

A decorative 3D viewer, generic screw rendering, or image-to-exact-SKU demo would be theatre. A small source-backed family silhouette that measurably reduces head/drive mistakes is useful.

### Gate before investment

Do not build geometry search until:

- at least 20% of observed target tasks begin with a physical/CAD/sketch input;
- sanctioned geometry covers at least 80% of the target test families/configurations;
- a 100-query geometry corpus can define relevant-family and relevant-configuration judgments;
- top-10 relevant-family recall is at least 95%;
- geometry reduces median family-identification time or wrong-family choices by at least 25%;
- zero test participants interpret similarity as equivalence after the proposed labels.

## 16. Failure recovery

Recovery must preserve intent, not manufacture success.

| Failure | Required recovery |
|---|---|
| exact identifier absent | Keep identifier and namespace guess visible; offer manual namespace choice or supported family browse. Do not fuzzy-match. |
| multiple identifier mappings | Show bounded choices with namespace and family evidence. |
| unparsed term | Highlight the raw span; let the user map/remove it. Do not discard it. |
| conflicting constraints | Show both chips and the conflict. Re-run only after user correction. |
| no configuration after hard filters | State `not in this release` unless a reviewed rule proves invalid. Never show a near miss as the answer. |
| queried field largely missing | Report coverage and separate unknown-field rows; do not pretend zero matches means impossible. |
| typo candidate | Offer a labelled suggestion and preserve original query. |
| unsupported family/unit/operator | Preserve a requirement snapshot; show supported boundaries. |
| API timeout/error | Remove stale result cards, retain query/facets, display release/service state, offer retry. |
| facet yields zero | Explain which active constraint caused zero and offer one-click removal; do not auto-relax. |
| partial BOM batch failure | Keep successful and failed lines independently; never drop or rewrite failed lines. |
| AI helper unavailable | Deterministic search continues unchanged. AI is never a required safe path. |

## 17. Technology comparison

| Approach | Good at | Mechanical-search weakness | POC decision |
|---|---|---|---|
| Deterministic parser + PostgreSQL | Exact namespaces, typed predicates, ranges, joins, release scoping, stable facets, explainability, one source of truth. | Grammar and terminology need deliberate curation; cross-family free text is not automatic. | **Use as core.** |
| PostgreSQL full-text + trigram | Family text recall, weighted fields, phrase/web-style input, spelling suggestions, indexed execution.[E1][E3] | Token ranking does not understand dimension roles; trigrams can dangerously blur technical tokens. | **Use narrowly after parsing.** |
| External lexical engine: Elasticsearch/OpenSearch/Algolia class | Rich analyzers, multi-word synonyms, typo controls, high-scale faceting, relevance tooling, horizontal search scaling.[E4][E5][E13] | Duplicated release/index lifecycle, eventual consistency, operations, and easy overuse of fuzzy relevance on hard requirements. | **Defer until measured thresholds.** |
| Embeddings/vector search | Recall for long descriptions, use/application language, multilingual or unfamiliar phrasing; pgvector supports exact/approximate nearest-neighbor and hybrid FTS/vector retrieval.[E11] | Numerically close vectors do not enforce exact identifiers, dimensions, units, standards, negation, or validity. Explanations are weak. | **Defer; possible candidate-family recall only.** |
| LLM assistance | Proposing spans, terminology candidates, column mappings, explanations, and offline curation queues. Structured output can enforce a JSON schema.[E12] | Schema-valid output can still contain mistakes; nondeterminism, latency, privacy, cost, and prompt/model drift remain. It can invent facts or silently resolve ambiguity.[E12] | **No authority. Offline/shadow suggestions only after a gate.** |

### Why PostgreSQL is enough now

- only three proposed POC families;
- 11,973 candidate rows inside those boundaries and 27,009 total input rows;
- exact identifier and family routing are small indexed relations;
- common fastener facets fit typed columns;
- PostgreSQL already supplies FTS, ranking, GIN, range predicates, and trigram indexes;
- the architecture report's targets are well within one tuned relational service.[R4][R5]

### External engine trigger

Introduce a release-stamped external lexical index only if one of these persists for two measured releases after query/index correction:

- more than 5 million active configurations and ranked search p95 remains above 250 ms at target load;
- facet p95 remains above 300 ms on families over 50,000 configurations;
- a reviewed corpus shows family top-3 recall below 98% or typo-suggestion top-1 below 90%, and a tested external analyzer improves the affected metric by at least 5 percentage points without any hard-constraint or identifier regression;
- multilingual analysis, click-learning, cross-index federation, or independent horizontal search scaling becomes an approved requirement;
- sustained search exceeds 20 requests/second or 100 concurrent requests and measured database saturation remains after caching/read scaling.[R5]

PostgreSQL remains the canonical source. Exact identifier resolution should remain deterministic even if family documents move to another index.

### Embedding trigger

Test embeddings only when:

- at least 10% of real, high-value queries remain unresolved after terminology curation;
- those queries are descriptive/contextual rather than identifier- or dimension-led;
- lexical family top-3 recall on that subset is below 90%;
- hybrid retrieval improves top-3 recall by at least 10 percentage points and overall recall by at least 3 points;
- hard constraints are still parsed and enforced outside the vector score;
- p95 added latency is at most 100 ms and the model/index version is release-stamped;
- zero vector-only result is auto-selected as a configuration.

### LLM trigger

A production-adjacent LLM parser experiment is justified only when:

- deterministic parsing abstains on at least 10% of repeated, supported-family queries;
- a frozen 500-query shadow corpus shows at least a 10-point recall gain;
- precision on identifiers and hard constraints is at least 99.5%;
- conflict detection is 100% on the safety corpus;
- every proposed value must match raw text or a reviewed alias and pass deterministic type/unit/catalog validation;
- the model is not required for exact lookup, normal search, or failure recovery;
- raw BOM/CAD privacy, retention, cost, latency, version pinning, and outage behavior are approved.

Even after that gate, the LLM may propose an interpretation. It may not generate a mechanical fact or final match.

## 18. What is genuinely better than supplier-site search

### Strong opportunities

1. **Constraint ledger.** Show exactly what was understood, unresolved, ignored, or conflicting.
2. **Family neutrality.** Preserve a broad requirement across several coherent families instead of forcing one seller taxonomy.
3. **Coverage-aware absence.** Distinguish invalid, not indexed, unknown, and unavailable service.
4. **Identifier context.** Resolve a known clue to a configuration while keeping identifier evidence separate from product identity.
5. **Family-specific validity.** Disable or explain impossible choices using reviewed rules, not row absence.
6. **Compact frozen record.** Combine normalized facts, original notation, identifiers, evidence, release, unknowns, and corrections without dashboard theatre or commercial claims.
7. **Specification-state reuse.** Preserve incomplete and complete catalog constraints for BOM work, comparison, or supplier handoff without claiming application suitability.
8. **Batch triage.** Resolve many rough BOM lines with explicit per-line states and no silent merges.
9. **Supplier query compiler.** Translate one selected configuration into supplier-specific search wording and show the outgoing query. Keep only if task testing shows it beats manual Google/supplier entry.
10. **Honest geometry assistance.** Use a visual input to narrow family/shape while preventing geometry from standing in for material, tolerance, standard, or equivalence.

### Theatre or unsafe shortcuts

- an `AI search` badge over the same flat rows;
- opaque `93% match` or `confidence` scores;
- semantic nearest neighbors that violate a dimension;
- chat as the primary interface;
- an LLM filling missing pitch, finish, standard, or material;
- fuzzy identifier or standard matching;
- a rotating 3D hero with no sourced selected geometry;
- image-to-exact-part claims;
- tolerance filters when records contain only nominal display strings;
- automatic family creation from import titles;
- supplier logo cards that only reproduce a generic query;
- `similar`, `alternate`, `equivalent`, `replacement`, or `available` based on search relevance.

## 19. POC boundary

### Build/test in the POC

- exact, namespace-aware reviewed identifier lookup;
- three reviewed families, not three import buckets;
- reviewed family aliases and terminology explanation;
- deterministic metric thread/pitch/length parsing for supported syntax;
- exact nominal dimensions and one nominal length-range operator after typed normalization;
- material, finish, drive, strength, and supplied-standard constraints where data coverage permits;
- partial requirement and conflict states;
- family-specific conjunctive facets with counts and unknown states;
- stable ranking and pagination;
- narrowly scoped typo suggestions for family words;
- query explanation and release/parser/search versions;
- explicit invalid/not-in-release/unknown/unavailable recovery;
- one unique selected configuration plus explicit support for every family-required fact, with no critical conflict, as the gate to frozen BOM capture and supplier searches.

### Defer

- general BOM inbox and line parser;
- saved incomplete requirements;
- imperial completeness;
- general tolerance/GD&T, fit, and application-suitability reasoning;
- geometry/CAD/sketch/photo search;
- multilingual terminology;
- external search engine;
- embeddings and vector index;
- LLM-assisted parsing;
- learning-to-rank or personalization.

### Reject

- equivalence, replacement, approved alternate, or interchangeability inference;
- supplier scraping, listings, price, stock, availability, or purchase ranking;
- fuzzy technical identifiers/numbers;
- guessed standards/default dimensions;
- LLM-generated facts or auto-selected matches;
- a universal fastener-derived schema for all mechanical families.

## 20. Golden query corpus

The first frozen corpus should have at least 150 reviewed queries:

- 30 exact identifier cases: active, formatting variants, unknown, malformed, ambiguous fixture, withdrawn fixture;
- 35 family and terminology cases: exact names, abbreviations, colloquial terms, broad nouns, head/drive collisions;
- 35 dimension/unit/standard cases: metric, imperial fixture, multiplication signs, ranges, missing units, editions, mixed systems;
- 20 partial/conflicting/invalid/not-in-release cases;
- 15 typo cases, including protected technical tokens;
- 15 failure/coverage/API and stale-result cases.

The corpus must include the 18 benchmark tasks already defined plus at least these additions:[R6]

1. `M4 screw`
2. `stainless M5 screw, 20 mm long`
3. `Allen screw M4`
4. `low-profile socket screw M4`
5. `M4 socket head screw`
6. `M4 × 0.7 × 12 mm socket head, alloy steel`
7. `DIN 912 M4 × 12`
8. `M4 socket head, black oxide`
9. `M4 button head screw`
10. `M4 Phillips pan head screw`
11. `91290A115`
12. unknown identifier-shaped value
13. `hex M4 screw`
14. `M4 1/4-20 socket screw`
15. `M4 × 0.7 × 12, pitch 1.0`
16. `ISO 4762:2004 M4 × 12`
17. `ISO 7380-2 button flange M4`
18. `M4 × 12 mm qty 20`
19. `20 M4 × 12 screws`
20. `length 10–20 mm M4 socket head`
21. `10 ± 0.1 mm shoulder diameter`
22. `soket head screw M4`
23. `DIN 921 M4` near a known `DIN 912` corpus case
24. plausible but absent configuration
25. reviewed-rule invalid configuration
26. supported family with queried finish missing from a record
27. unsupported bearing query
28. API failure with prior results on screen
29. two identifier namespaces sharing a fixture value
30. withdrawn identifier fixture

Expected output must name the intended state, parsed spans, candidate/relevant families, hard predicates, unresolved terms, conflicts, coverage warning, and whether selection is allowed.

## 21. Measurement gates

### Search correctness

| Measure | Gate |
|---|---:|
| published active identifier routing | 100% across the full release |
| unknown/malformed identifier guessed as a match | 0 |
| family-specific queries with correct family rank 1 | ≥ 95% |
| broad queries with every reviewed relevant family in top 3 | ≥ 98% |
| hard-constraint parse precision | ≥ 99% |
| hard-constraint parse recall on supported syntax | ≥ 95% |
| conflict detection on safety corpus | 100% |
| auto-selections violating a supplied hard constraint | 0 |
| standards inferred without supplied/reviewed evidence | 0 |
| typo suggestion top-1 on eligible words | ≥ 90% |
| false typo suggestion on protected technical tokens | 0 |
| facet count and state correctness | 100% against SQL fixtures |
| deterministic ordering/cursor for same release/request | 100% |
| explanation reproduces all parsed, unresolved, conflicting, and ignored spans | 100% |
| public DTO boundary leaks | 0 |

### Task value

Keep the family-first hypothesis only if the benchmark shows:[R6]

- exact identifier tasks are no slower than the current flow;
- broad and family-specific tasks produce fewer wrong-family turns;
- users can explain requirement versus configuration versus identifier mapping versus supplier destination;
- a majority of engineer participants prefer the family workspace for task reasons;
- supplier handoff creates a concrete next step in at least half of workflow tasks.

Add two sharper comparison gates:

- median time to the correct family improves by at least 20% versus the participant's normal supplier/Google method on broad queries;
- wrong configuration selections fall by at least 30% versus the current flat PartSource flow, with no increase in false certainty.

With 3–5 engineers, these are directional POC gates, not statistically significant product claims.

### Performance at 27,009–100,000 configurations

Use the architecture report's measured targets:[R5]

- exact identifier DB p95 under 20 ms warm, p99 under 50 ms;
- family search DB p95 under 50 ms;
- configuration plus facet RPC p95 under 100 ms;
- browser-to-Edge p95 under 250 ms in the target US region, excluding first cold sample;
- p99 under 750 ms;
- compressed response at most 100 KiB and at most 25 configurations;
- 20 concurrent searches for five minutes with under 1% 5xx and no pool exhaustion;
- index scans for exact lookup and zero public fields outside the allowlist.

### Future BOM parser gate

Before automatically resolving a batch line:

- at least 500 real or safely de-identified reviewed lines;
- exact identifier precision and recall 100%;
- quantity precision at least 99.5%;
- zero dimension/thread values misread as quantity in the safety corpus;
- unique-configuration auto-resolution precision at least 99.5%;
- every unresolved/conflicting line preserved;
- no automatic merge without explicit user confirmation.

## 22. Classification register

### Confirmed

- Exact reviewed identifiers are a core POC path; current identifier coverage is 99.8%.[R4]
- Current non-exact search is substring-based, row-first, unranked, and mechanically unsafe for numeric filtering.[R3][R10]
- Family, configuration, identifier, search interpretation, engineering requirement, provenance, supplier destination, and BOM snapshot must remain distinct.[R1][R2]
- Hard requirements cannot be silently substituted or down-ranked.[R1]
- Import buckets are not safe families; missing fields and absent rows do not prove invalidity.[R3][R4]
- Standards may be filtered from supplied evidence but must not be inferred from dimensions or identifiers.[R4]
- PostgreSQL provides sufficient exact, full-text, trigram, typed-filter, and facet primitives for the POC.[R5][E1][E3]
- Search failure must fail closed and stale results must disappear.[R1][R3]
- Geometry similarity is a real search mode, but it establishes shape similarity only.[E10]
- Structured LLM output can satisfy a schema and still contain mistakes.[E12]

### Strong hypotheses

- Inspectable query interpretation will reduce silent constraint loss.
- Family-first ranking will reduce near-duplicate row scanning for broad fastener intent.
- Exact-identifier inspector-first behavior can preserve family context without slowing lookup.
- Family-specific facets and explicit invalid/not-indexed/unknown states are meaningfully better than ordinary supplier search.
- A compact source-independent frozen record and specification-state history may create repeat value.
- BOM-line triage could become a stronger repeat-use wedge than one-at-a-time search.
- A supplier query compiler could help, but only if benchmark participants find it materially better than manual search.

### Open questions

- Do engineers agree with the three proposed family names and boundaries?
- Is drive a facet or family boundary for each rounded-head group?
- Which attribute order best matches real specification tasks?
- How should shorthand without units be treated in each family and locale?
- Which reviewed validity rules are available without copying restricted standards content?
- How should standards editions and source conflicts be represented when current data lacks them?
- What proportion of real queries contain ranges, tolerances, application language, or BOM quantities?
- Do users want to save incomplete requirements?
- Does neutral supplier search save enough work to remain in the core promise?
- Is CAD/photo-led discovery frequent enough to justify sanctioned geometry operations?
- At what future family diversity does the four-relation POC bridge need governed attribute definitions?

### Nice-to-have

- self-excluding facet counts;
- keyboard expert syntax and saved searches;
- multilingual reviewed aliases;
- differences-only configuration comparison;
- barcode/camera identifier entry that returns candidates;
- batch BOM resolver after task evidence;
- source-backed drawings and geometry overlays;
- hybrid lexical/vector candidate-family recall after measured need.

### Rejected

- automatic equivalence, replacement, approved alternate, or interchangeability;
- LLM-generated dimensions, standards, material, validity, or identity;
- embeddings as a substitute for hard predicates;
- fuzzy identifiers, standard numbers, dimensions, or thread tokens;
- silent defaults for missing pitch, finish, material, strength, drive, or standard;
- row absence as an invalidity rule;
- automatic merging of duplicate-looking configurations or BOM lines;
- one global filter schema for all mechanical components;
- supplier scraping, unsanctioned data, price, stock, offers, or availability;
- AI chat, confidence percentages, generic 3D, or image-to-SKU as POC spectacle.

## Sources

### Repository evidence

- **[R1]** `research/product-contract.md` — authoritative current public claims, result states, prohibited substitutions, source and commercial boundaries.
- **[R2]** `CONTEXT.md` — requirement, family, configuration, identifier, provenance, supplier destination, and BOM snapshot definitions.
- **[R3]** `research/current-system-structural-audit-2026-08-09.md` — current row-first UI, flat schema, substring search, stale/error behavior, and mechanical-data risks.
- **[R4]** `research/poc-family-taxonomy-audit-2026-08-09.md` — 27,009-row counts, field coverage, identifier coverage, family boundaries, exclusions, and standards coverage.
- **[R5]** `research/poc-family-search-architecture-2026-08-09.md` — exact/family/configuration search model, PostgreSQL design, performance gates, and infrastructure triggers. Its maximal schema is superseded for the POC by the four-relation bridge in `research/product-frontier-synthesis-2026-08-09.md`; its search and measurement evidence remains useful.
- **[R6]** `research/poc-discovery-benchmark.md` — benchmark tasks, participants, measures, and decision thresholds.
- **[R7]** `research/modern-engineering-ux-opportunities-2026-08-09.md` — intent-adaptive hierarchy, query explanation, BOM inbox, geometry, and anti-theatre UX boundaries.
- **[R8]** `research/family-first-reference-patterns-2026-08-09.md` — official-site comparison across Octopart, McMaster, MISUMI, TraceParts, 3Dfindit, Grainger, Zoro, Bolt Depot, Fastenal, and DigiKey.
- **[R9]** `research/data-source-register.md` — approved technical data and blocked scraping/supplier sources.
- **[R10]** `supabase/migrations/20260809_configuration_catalog_contract.sql` — current exact checks, token haystack, wildcard filters, import-family constraint, 25-row cap, and public RPC shape.
- **[R11]** `supabase/functions/catalog-search/index.ts` and `web/src/hooks/useCatalogSearch.ts` — current validation, public Edge call, debounce, errors, and client result handling.
- **[R12]** `web/src/lib/decoder.ts` and `web/src/lib/catalogApi.ts` — current fallback inference, Fuse search, identifier format handling, and supplier-query generation.
- **[R13]** `web/src/lib/bom.ts` and `web/src/lib/bomStorage.ts` — current quantity parsing, frozen snapshots, and inherited cross-reference/verification model.

### Primary/official external sources

External pages were checked on 2026-08-09.

- **[E1]** PostgreSQL 18 documentation, “Controlling Text Search” — query parsers including `websearch_to_tsquery`, weighted vectors, `ts_rank`, and `ts_rank_cd`: https://www.postgresql.org/docs/current/textsearch-controls.html
- **[E2]** PostgreSQL 18 documentation, “Dictionaries” — stop words, normalization, synonym dictionary, and thesaurus dictionary: https://www.postgresql.org/docs/current/textsearch-dictionaries.html
- **[E3]** PostgreSQL 18 documentation, `pg_trgm` — similarity functions and GIN/GiST index support: https://www.postgresql.org/docs/current/pgtrgm.html
- **[E4]** Elastic documentation, “Search with synonyms” and synonym graph filter — index-time versus search-time synonyms and multi-word synonym handling: https://www.elastic.co/guide/en/elasticsearch/reference/8.19/search-with-synonyms.html and https://www.elastic.co/guide/en/elasticsearch/reference/8.19/analysis-synonym-graph-tokenfilter.html
- **[E5]** Algolia documentation, “Typo tolerance” — close-spelling retrieval and ranking exact matches above typo matches: https://www.algolia.com/doc/guides/managing-results/optimize-search-results/typo-tolerance/
- **[E6]** NIST, “Unit Conversion” and SP 811 conversion-factor guidance — numerical conversion, significant digits, and rounding: https://www.nist.gov/pml/owm/metric-si/unit-conversion and https://www.nist.gov/pml/special-publication-811/nist-guide-si-appendix-b-conversion-factors
- **[E7]** Unified Code for Units of Measure, official specification — unambiguous machine communication and case-sensitive/case-insensitive unit symbols: https://ucum.org/ucum
- **[E8]** ISO, ISO 1101:2017 — geometrical tolerancing of form, orientation, location, and run-out: https://www.iso.org/standard/66777.html
- **[E9]** ASME, Y14.5 Dimensioning and Tolerancing — official description of GD&T symbols, rules, definitions, requirements, and defaults: https://www.asme.org/codes-standards/find-codes-standards/y14-5-dimensioning-tolerancing
- **[E10]** CADENAS, official PARTsolutions geometric and combined search descriptions — reference/rough-sketch shape search, 2D sketch, topology, and combined methods: https://www.cadenas.de/en/products/partsolutions/finding-information/intelligent-finding/geometric-search-3d and https://www.cadenas.de/en/products/partsolutions/finding-information/intelligent-finding/combination-of-search-methods
- **[E11]** pgvector official README — exact and approximate nearest-neighbor search and hybrid use with PostgreSQL full-text search: https://github.com/pgvector/pgvector/blob/master/README.md
- **[E12]** OpenAI API documentation, “Structured model outputs” — JSON Schema conformance and explicit warning that structured outputs can still contain mistakes: https://platform.openai.com/docs/guides/structured-outputs
- **[E13]** OpenSearch documentation, “Implementing faceted search” — value/range facet counts and result refinement: https://docs.opensearch.org/latest/tutorials/faceted-search/
