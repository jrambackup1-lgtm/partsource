# Mechanical-component discovery problem evidence and POC wedge

**Research date:** 2026-08-09  
**Wayfinder question:** What credible user and market evidence supports PartSource as a mechanical-component discovery platform, and which initial user/problem wedge is strongest for a convincing POC without making equivalence claims?

## Executive conclusion

There is credible evidence for a **mechanical-component discovery problem**, but not yet enough evidence to claim that the proposed product or business is validated.

The strongest evidence is that:

1. McMaster identifiers escape into CAD files, BOMs, assembly instructions, and internal workflows, sometimes without a useful description.
2. Industrial distribution and supplier information are fragmented across many catalogs and firms.
3. Terminology and field meanings vary, while a technically meaningful fastener configuration has many attributes that cannot safely be collapsed into “looks similar.”
4. Supplier discovery is a real, formal activity, and some engineers are forced to source outside McMaster because of production economics, employer policy, geography, shipping, or customs.
5. Search quality is uneven across ecommerce and industrial sites—but **McMaster itself is strong counterevidence to any blanket claim that industrial search is bad**.

The strongest POC wedge is:

> **A prototype or mechanical engineer starts with a McMaster-numbered BOM/CAD line or a plain fastener description, recovers a supported standards-first configuration, and launches clearly labeled searches on supplier sites for independent verification.**

The known identifier is the high-intent entry hook, not the whole product. Generic search and guided selection should remain fallback paths. The POC should say “configuration,” “candidate,” and “search this configuration on…”—never “equivalent,” “replacement,” “same item,” “approved alternate,” or “available.”

This wedge fits the current no-scraping, no-price, no-inventory, no-purchasing contract. It is more convincing than a bulk-sourcing or procurement wedge because those problems are economically stronger but cannot be solved credibly without offers, manufacturer/listing identity, MOQ, lead time, certifications, quote workflows, or organizational approval data.

**Important qualification:** public evidence supports the problem shape, not its incidence, willingness to use PartSource, or willingness to pay. Those remain assumptions requiring direct task-based interviews.

## Scope and method

This review used:

- first-party technical and government sources;
- public-company regulatory disclosure;
- direct observations of supplier naming;
- public open-hardware/CAD workflows;
- firsthand community reports, labeled as anecdotal and selection-biased;
- counterevidence, especially McMaster’s unusually good catalog and delivery experience.

A source can prove that a workflow or problem exists without proving that it is common. Likewise, a market being fragmented does not by itself prove that users want a new aggregator.

### Evidence-strength scale

- **High:** primary/authoritative evidence directly supports the stated fact; important limitations may still remain.
- **Medium:** several credible or firsthand signals triangulate the claim, or a strong source is adjacent rather than directly on fasteners.
- **Low:** isolated anecdote, vendor positioning, search-index excerpt, or inference that needs direct validation.

## Evidence by problem

### 1. Finding parts from known McMaster identifiers

#### Evidence

- Intel’s open SAWR hardware assembly guide says its BOM part numbers are from McMaster, while also saying links are for reference and users may find other suppliers. This is direct evidence that McMaster identifiers are used as durable design/BOM references outside the checkout context ([Intel SAWR assembly guide](https://github.com/intel/sawr/blob/master/sawr_hardware/ASSEMBLY.md)).
- Other public hardware projects expose the same pattern: a BOM organized around McMaster part numbers ([Tapster BOM](https://github.com/hugs/tapsterbot/blob/master/hardware/tapster-2/BOM.md)) and a project with a dedicated “McMaster-Carr Part Number” field ([Apisuru](https://github.com/RobotZwrrl/Apisuru)). These examples establish existence, not prevalence.
- An Autodesk Fusion user reports that inserted McMaster CAD parts carried only a part number and no useful description into the BOM ([Autodesk forum](https://forums.autodesk.com/t5/fusion-design-validate-document/am-i-missing-something-bom-descriptions-for-mcmaster-parts/td-p/6858553)). This is a concrete “identifier needs decoding” case, but it is one user report from 2017.
- An Eng-Tips user explicitly asks whether McMaster numbers are stable enough to use as organizational part numbers ([Eng-Tips](https://www.eng-tips.com/threads/part-numbers-amp-mcmaster-carr.267843/)). That shows the identifier can become embedded in company data, while also raising lifecycle/stability risk.
- A manufacturing user asks for a tool that accepts a McMaster number and helps investigate the item at other suppliers ([Reddit r/manufacturing](https://www.reddit.com/r/manufacturing/comments/lq6w31/price_compare_to_mcmaster_carr/)). The original request is price-comparison/equivalence-oriented, which PartSource must **not** claim to fulfill; it still supports the narrower observation that users begin with a McMaster identifier and want to continue research elsewhere.
- McMaster’s own API retrieves product information by part number, but only for approved customers using credentials/certificates, with product-subscription and daily limits. It therefore confirms that identifier-to-product-information retrieval is a real workflow while also showing why the public POC cannot assume an unrestricted API ([McMaster Product Information API](https://www.mcmaster.com/help/api/)).

#### What this supports

A known McMaster number is a real and crisp input in CAD/BOM and sourcing workflows. Recovering a human-readable, supported configuration can remove a first step before broader research.

#### What it does not support

- It does not quantify how often descriptions are missing.
- It does not establish that users want a third-party decoder rather than opening McMaster.
- It does not authorize use of McMaster data or prove identifier stability.
- It does not establish cross-supplier product identity, interchangeability, or equivalence.

**Assessment: Medium.** The workflow is triangulated, but frequency and product demand are unmeasured.

### 2. Bulk and production sourcing

#### Evidence

- An engineer looking for production machine screws says McMaster’s convenience is no longer necessary in this context and asks for bulk manufacturers/suppliers, with cost as the deciding factor ([Reddit r/AskEngineers](https://www.reddit.com/r/AskEngineers/comments/132yx4j/mcmastercarr_bulkproduction_machine_screw/)).
- In a separate discussion about what larger companies use for production, a participant says that at significant quantities the time spent shopping and negotiating with suppliers becomes worthwhile ([Reddit r/MechanicalEngineering](https://www.reddit.com/r/MechanicalEngineering/comments/goyba1/what_do_bigger_companies_use_to_get_parts_for/)).
- The McMaster-number price-comparison request also points toward an economic motive for sourcing outside McMaster ([Reddit r/manufacturing](https://www.reddit.com/r/manufacturing/comments/lq6w31/price_compare_to_mcmaster_carr/)).

These are firsthand statements, but they are a small, self-selected sample and are not procurement-spend data.

#### What this supports

Prototype-to-production transition creates a different sourcing job: direct suppliers, quantity economics, negotiation, packaging, consistency, and possibly custom fasteners matter more than same-day convenience.

#### What it does not support

A configuration decoder plus supplier search links does not solve bulk sourcing. A credible bulk product would usually need manufacturer identity, pack/MOQ, price breaks, lead time, capacity, quality/certification evidence, quote handling, and listing-level verification—all outside the POC.

**Assessment: Medium-low for the pain; Low for POC fit.** The economic logic is strong, but the public evidence is anecdotal and the proposed POC omits the decisive fields.

### 3. Fragmented supplier catalogs and market structure

#### Evidence

- MSC Industrial’s FY2024 Form 10-K calls industrial distribution and MRO supply a large, highly fragmented market ([SEC filing](https://www.sec.gov/Archives/edgar/data/1003078/000100307824000107/msm-20240831.htm)). A regulatory filing is strong evidence for market structure, although MSC has an investor interest in portraying consolidation opportunity.
- McMaster advertises more than 700,000 products ([McMaster](https://www.mcmaster.com/)); MSC, Grainger, Fastenal, MISUMI, Bolt Depot, Zoro, local distributors, and manufacturers each maintain separate product and taxonomy surfaces. Market fragmentation plus large catalogs makes cross-catalog research structurally plausible.
- Thomasnet positions itself specifically as a product-sourcing and supplier-discovery platform for procurement professionals, engineers, plant/facility managers, and business owners ([Thomasnet](https://www.thomasnet.com/)). The existence and longevity of a specialized discovery service supports demand for supplier discovery, but vendor positioning is not independent proof of user pain.

#### What this supports

No single supplier catalog is the whole market. A user may need to identify a configuration first and then investigate multiple supplier ecosystems.

#### What it does not support

- “Fragmented market” does not mean every buyer suffers materially.
- It does not mean catalogs can be legally or technically aggregated.
- It does not show that outbound search handoffs are sufficient value.

**Assessment: High for fragmentation as market structure; Medium-low for the implied PartSource opportunity.**

### 4. Terminology differences

#### Evidence

NIST found, in industrial product data-sheet exchange, that document images still required human interpretation/transcription and that spreadsheet-based exchanges often involved disagreement over terminology and intended field meaning ([NIST Product Data Sheet Ontology, NISTIR 8035](https://www.nist.gov/publications/product-data-sheet-ontology)). The report covers pumps, pressure transmitters, and valves rather than fasteners, so it is strong adjacent evidence—not direct proof about screw search.

A simple cross-catalog observation shows naming variation around one familiar standard family:

- McMaster uses “DIN 912 Socket Head Cap Screws” and also describes “socket head screws” ([McMaster](https://www.mcmaster.com/products/din-912-socket-head-cap-screws/)).
- Fastenal uses “Metric, Socket Head Cap Screw, ISO 4762” and distinguishes class, threading, and finish in its product-standard title ([Fastenal PDF](https://www.fastenal.com/content/product_specifications/M.SHCS.4762.12.9.FT.BO.04.pdf)).
- Bolt Depot uses “Metric socket cap (smooth)” and organizes by material and coarse/standard thread ([Bolt Depot](https://boltdepot.com/Metric_socket_cap_(smooth)_Chrome_plated_steel_6mm_x_1.0mm)).
- MISUMI search surfaces “Hex Socket Head Cap Screw” and DIN/ISO wording ([MISUMI](https://uk.misumi-ec.com/vona2/detail/221005681487/)).

This demonstrates vocabulary and merchandising differences. It does **not** prove that those pages describe identical products or that users fail because of the differences.

#### What this supports

A standards-first vocabulary, aliases, and explicit attributes can help users form better searches across catalogs. The system should preserve distinctions rather than silently normalizing away pitch, standard, material, strength, finish, or threading.

**Assessment: Medium.** Authoritative adjacent evidence plus direct catalog observation; user impact remains unquantified.

### 5. Poor industrial search

#### Evidence

- Baymard’s 2026 ecommerce benchmark reports 10,000+ performance ratings across 170+ sites/apps and says 56% fail to adequately support users’ search needs ([Baymard search benchmark](https://baymard.com/blog/ecommerce-search-query-types)). This is strong ecommerce UX evidence but is not limited to industrial catalogs.
- Baymard separately maintains B2B electronic-components-and-machinery research based on large-scale testing of 15 sites, with 275+ guidelines, 4,800+ performance scores, and dedicated topics for on-site search and product-table filtering ([Baymard B2B research](https://baymard.com/research/b2b-electronic-components-machinery)). This confirms that industrial/B2B catalog search has specialized usability needs; the public page does not expose a simple failure-rate conclusion for mechanical suppliers.
- A Canadian prototyping user describes local industrial suppliers relying on paper/PDF catalogs, phone/email quotes, and back-and-forth to find in-stock replacements ([Hacker News comment via official HN API](https://hacker-news.firebaseio.com/v0/item/32981728.json)). It is detailed firsthand evidence, but only one person’s local market.

#### Essential counterevidence

McMaster is repeatedly praised for exactly the opposite. One experienced user calls its UI intuitive, says it helps even when they do not know exactly what they need, and uses the catalog as an engineering reference ([Hacker News comment via official HN API](https://hacker-news.firebaseio.com/v0/item/29356403.json)). McMaster’s own site supports catalog browsing, text search, and image search.

Therefore the defensible claim is:

> **Industrial search quality is uneven, and research becomes fragmented across catalogs.**

The indefensible claim is:

> “Industrial search is bad,” or “PartSource is better than McMaster search.”

**Assessment: Medium.** Strong general UX evidence and direct industrial signals, with a major category-leading counterexample.

### 6. Identifying the correct configuration

#### Evidence

NASA’s *Fastener Design Manual* was written so design engineers could choose appropriate fasteners. Its scope includes material selection, platings, lubricants, corrosion, locking methods, washers, inserts, thread types/classes, fatigue loading, torque, grip length, head styles, and strengths ([NASA Technical Reports Server record](https://ntrs.nasa.gov/citations/19900009424); [public PDF](https://ntrs.nasa.gov/api/citations/19900009424/downloads/19900009424.pdf)). This is authoritative evidence that fastener choice is multidimensional and technically consequential.

The Fastenal ISO 4762 product-standard title independently exposes several configuration dimensions—metric system, family, standard, property class, full threading, and black-oxide finish ([Fastenal PDF](https://www.fastenal.com/content/product_specifications/M.SHCS.4762.12.9.FT.BO.04.pdf)).

#### What this supports

A useful result must make key attributes explicit and preserve ambiguity. A size-only or visual-similarity result is not enough for technical selection.

#### What it does not support

- It does not measure how often buyers choose incorrectly.
- A standards-defined configuration is not proof that a product is manufactured, stocked, certified, suitable for an application, or the same as another supplier’s product.
- Application engineering, fit/form/function review, certification, and organizational approval remain outside the POC.

**Assessment: High for technical complexity/importance; Low for the unmeasured frequency of user error.**

### 7. Supplier discovery

#### Evidence

NIST’s Manufacturing Extension Partnership operates a formal Supplier Scouting process to connect needs with manufacturers having relevant production capacity and capability. It was originally created to help federal agencies locate U.S.-made items, components, and assemblies, and it relies on technical expertise and a national partner network ([NIST Supplier Scouting](https://www.nist.gov/blogs/manufacturing-innovation-blog/supplier-scouting-provides-solutions)). NIST also describes scouting as identifying manufacturers with the capability, capacity, and business interest to satisfy difficult sourcing issues ([NIST supplier-scouting guide](https://www.nist.gov/system/files/documents/2023/10/23/How+to+Engage+with+Supplier+Scouting+102023+508.pdf)).

Thomasnet’s supplier-discovery positioning provides a separate market signal ([Thomasnet](https://www.thomasnet.com/)).

#### What this supports

Supplier discovery is a legitimate workflow, not a fabricated category. Capability and business interest matter in addition to matching words in a catalog.

#### What it does not support

NIST scouting often concerns manufacturing capability and difficult sourcing, not a commodity fastener search. PartSource’s supplier-site links do not scout, qualify, vet, or confirm a supplier.

**Assessment: High that supplier discovery is real; Low-medium that the POC meaningfully solves the deeper job.**

### 8. Contexts where McMaster is unsuitable, inconvenient, or unavailable

The evidence supports **context-specific limits**, not a blanket “McMaster is unavailable” claim.

#### Supported contexts

1. **Production quantities and cost optimization.** Engineers report moving toward bulk suppliers and negotiation when quantities justify the work ([bulk machine-screw thread](https://www.reddit.com/r/AskEngineers/comments/132yx4j/mcmastercarr_bulkproduction_machine_screw/); [production-sourcing thread](https://www.reddit.com/r/MechanicalEngineering/comments/goyba1/what_do_bigger_companies_use_to_get_parts_for/)).
2. **Employer/vendor policy.** A machinist reports being told that McMaster would be phased out and that alternate sourcing was required, despite relying on it for most purchases ([Practical Machinist](https://www.practicalmachinist.com/forum/threads/is-there-a-good-alternative-to-mcmaster-carr.420276/)). An Eng-Tips user separately says their company no longer allows McMaster or Grainger ([Eng-Tips](https://www.eng-tips.com/threads/mcmaster-carr-grainger-alternative.437801/)). These are credible firsthand cases, not evidence of how common the policy is.
3. **Small-order or price sensitivity.** A highly positive McMaster user still calls it expensive relative to other suppliers and frames the premium as payment for convenience ([HN](https://hacker-news.firebaseio.com/v0/item/29356403.json)). This can motivate research elsewhere, but the POC has no price data and cannot promise savings.
4. **Cross-border friction.** An EU user says ordering is possible but inconvenient because of customs/taxes ([HN](https://hacker-news.firebaseio.com/v0/item/32980210.json)); the Canadian prototyper reports two-day delivery and a roughly USD 30 minimum shipping experience for tiny orders ([HN](https://hacker-news.firebaseio.com/v0/item/32981728.json)). These are historical individual experiences, not current policy.
5. **Programmatic access.** McMaster’s Product Information API is restricted to approved customers with certificates, authentication, subscription limits, and rate limits ([McMaster API](https://www.mcmaster.com/help/api/)). This makes it unsuitable as an assumed public data dependency for PartSource.

#### Counterevidence and correction

- McMaster currently publishes an International Orders route and Canada-delivery information; its delivery search result says standard Canadian delivery can include customs clearance, while collect options can make the customer importer of record ([International Orders](https://www.mcmaster.com/international/); [Delivery](https://www.mcmaster.com/info/delivery/)).
- McMaster’s site claims more than 700,000 products and that 98% of orders ship from stock for same- or next-day delivery ([McMaster](https://www.mcmaster.com/)).
- Users strongly praise its selection, search, descriptions, and speed ([HN](https://hacker-news.firebaseio.com/v0/item/29356403.json)).

Accordingly, PartSource should never market itself on “McMaster is unavailable everywhere outside the U.S.” The defensible opportunity is helping in the specific moments when a user **cannot or does not want to finish the research with one distributor**.

**Assessment: Medium for context-specific limits; Low/contradicted for blanket unavailability.**

## Evidence-strength table

| Claim | Best supporting evidence | Strength | Important limitation |
|---|---|---:|---|
| McMaster identifiers become inputs in external BOM/CAD workflows | Intel SAWR, other open BOMs, Autodesk user report, McMaster API | Medium | No incidence data; API/data rights are restricted; identifier is not a generic standard |
| Users sometimes want to continue sourcing from a McMaster-number starting point | Reddit price-compare request, employer-policy threads, open BOM instructions | Medium-low | Small, self-selected anecdotes; many requests actually seek price/equivalence, which the POC excludes |
| Bulk/production sourcing differs from prototype purchasing | Two direct engineering community discussions | Medium-low | No representative sample or transaction data; decisive commercial fields are out of scope |
| Industrial/MRO distribution is fragmented | MSC FY2024 SEC filing; separate large supplier ecosystems | High for structure | A fragmented market does not automatically create demand for PartSource |
| Industrial product terminology/field meaning is inconsistent | NISTIR 8035; observed socket-cap naming across suppliers | Medium | NIST examples are pumps/valves; naming variation is not proof of failed fastener searches |
| Ecommerce and B2B catalog search often has usability problems | Baymard 170+ site benchmark and 15-site B2B research; HN industrial anecdote | Medium | General benchmark is not mechanical-only; public B2B page gives no mechanical failure rate; McMaster is strong counterevidence |
| Correct fastener selection requires multiple explicit attributes | NASA Fastener Design Manual; Fastenal ISO 4762 specification | High | Proves technical complexity, not frequency of buyer mistakes |
| Supplier discovery is a real specialist workflow | NIST MEP Supplier Scouting; Thomasnet | High for existence | Deeper supplier qualification is not solved by search URLs |
| McMaster can be unsuitable in some workflows | Production, employer-policy, cost, and cross-border firsthand reports; restricted API | Medium | Context-dependent and anecdotal; current McMaster supports international ordering and Canada delivery |
| McMaster is generally unavailable outside the U.S. | Countered by current International Orders/Delivery pages | Low / contradicted | Do not use this claim |
| A standards-first decoder plus supplier handoffs will be valuable | Inference from the evidence above | Low-medium | No direct usability test, repeat-use evidence, or willingness-to-pay evidence yet |
| A configuration match identifies an equivalent supplier product | None; explicitly outside evidence and product contract | Unsupported | Requires listing identity, complete technical evidence, permissions, and review |

## Persona and wedge comparison

| Initial persona / job | Evidence of pain | POC fit | Likely demo value | Main counterargument | Decision |
|---|---:|---:|---:|---|---|
| **Prototype/mechanical engineer with a McMaster-numbered BOM/CAD line** needs to understand the item and continue research | Medium | **High** | **High**: crisp input → configuration → supplier searches → local BOM | If McMaster is allowed and convenient, opening McMaster is faster; mapping coverage/rights are hard | **Strongest POC wedge** |
| **Prototype engineer starting with plain text or uncertain terminology** needs guided fastener configuration | Medium | High | High: filters make complexity visible | Competes with excellent McMaster search and existing supplier filters; broad ontology can sprawl | Keep as fallback/expansion, not sole hook |
| **Small hardware company moving a prototype BOM into production** needs bulk sources | Medium-low | **Low** | Low under current scope | Price breaks, MOQ, lead time, manufacturer identity, quality and RFQ are the actual value | Do not lead with this POC; validate for a later commercial-data phase |
| **Procurement buyer forced onto approved vendors** needs alternatives | Medium-low | Low | Low under current scope | Requires approved-vendor policy, listings, auditability, ERP/punchout, and often equivalence/approval review | Validation audience only |
| **Non-U.S. builder** needs a locally practical path | Medium-low | Low-medium | Medium | Current McMaster has international ordering; geography, landed cost and local availability are absent | Do not use as primary wedge |
| **Maintenance/MRO technician with an unknown installed part** needs identification | Low in this review | Low | Potentially high if image/application identification existed | Often safety-critical; requires richer identification, application, and asset context | Out of POC |
| **Supplier-discovery/procurement specialist** needs qualified manufacturers | High that the job exists; low for commodity fastener specificity | Low | Low | Search links do not qualify capability, capacity, business interest, certifications, or offers | Do not claim to solve supplier scouting |

## Recommended POC wedge

### Persona

A mechanical/prototype engineer or small hardware builder working from a BOM, CAD assembly, build instruction, or colleague’s request. They have either:

- a known McMaster number;
- a plain fastener phrase such as `M4 socket head screw`; or
- enough attributes to use guided selection.

They are doing **research and local BOM preparation**, not approving a substitute or placing an order.

### Job to be done

> “Help me turn this identifier or rough description into a clear, supported fastener configuration, preserve the details I must verify, and let me continue searching on supplier sites without retyping the whole specification.”

### POC promise

1. Accept a supported known identifier as a **search clue**.
2. Show a standards-first `configuration-match`, with provenance and visible coverage/ambiguity limits.
3. Allow generic text and guided filtering over family, size, pitch, length, head, drive, material, finish, grade, and standard.
4. Generate supplier-site **search destinations**, labeled `Search this configuration on <supplier>`.
5. Require the user to verify destination results.
6. Save a configuration snapshot to a browser-local BOM and export it.
7. Fail closed for unsupported or ambiguous inputs.

### Why this is the strongest wedge

- **Crisp demonstration:** an opaque identifier becomes an inspectable set of technical facts.
- **Matches observed workflow:** McMaster numbers are embedded in real BOM/CAD artifacts.
- **Uses the product’s actual strength:** standards-first normalization and guided configuration—not unsupported product identity.
- **Fits current data and legal boundaries:** no supplier scraping, live listing, offer, or API dependency is required.
- **Creates a bridge to broader discovery:** once decoded, the same configuration can power generic search, guided exploration, search handoffs, and local BOM work.
- **Keeps optionality:** later research can test whether users most value bulk quotes, sanctioned supplier feeds, or team procurement, without pretending those features exist now.

### Why the known identifier should not be the whole positioning

The McMaster number is a proprietary catalog clue, not a standard. A product framed only as a “McMaster lookup” is vulnerable to data-rights/coverage limits, has little value when McMaster itself is available, and invites users to assume cross-supplier equivalence. Plain-text and guided flows make the durable center of gravity the **configuration**, not the distributor identifier.

## Explicit counterarguments against the recommendation

1. **McMaster already solves discovery extremely well.** For a U.S. prototype engineer allowed to buy from McMaster, PartSource can add an unnecessary step. This is the strongest counterargument.
2. **A supplier search handoff may be only a query generator.** Without inspecting listings, price, stock, MOQ, or lead time, the POC may save little time.
3. **Identifier coverage is the wedge’s bottleneck.** The approved local dataset is limited, metric coverage is incomplete, imperial is partial, and unsupported input must fail closed. A tiny success set can look staged.
4. **Configuration is not product identity.** A standards label and dimensions may omit manufacturer-specific material condition, tolerance, thread coverage, coating performance, certifications, country of origin, or application requirements. Supplier results cannot be called replacements.
5. **Supplier terminology can make generated searches noisy.** The very vocabulary variation that motivates normalization can reduce handoff quality unless search templates are tested manually.
6. **Evidence is selection-biased.** Forum users with a problem are more likely to post; open-source BOMs are not representative of commercial engineering organizations.
7. **The more valuable problems are excluded.** Bulk economics, approved-vendor compliance, international landed cost, listing freshness, and purchasing may drive urgency, but the POC does not address them.
8. **A fastener-only start may feel narrow.** It is operationally sensible, but users may compare it with much broader catalogs before the interaction proves the configuration model.
9. **BOM export may not differentiate.** Local BOM storage is useful connective tissue, not independently validated demand.

These objections do not overturn the recommendation; they mean it should be presented as the **best learning wedge**, not a proven business.

## Assumptions that remain unvalidated

- Enough target engineers receive McMaster-number-only inputs frequently enough to care.
- They cannot simply open McMaster, or doing so does not complete their job.
- A supported configuration contains enough information to formulate productive supplier searches.
- Users understand and accept the distinction between configuration, candidate, listing, and equivalent.
- Search handoffs save meaningful time despite landing-site taxonomy differences.
- Local BOM/export creates repeat use.
- The approved dataset can support a credible, non-staged task set.
- Users will trust provenance notes while independently verifying supplier results.
- The wedge can acquire users without being marketed as price comparison or equivalence.

## Minimum validation before claiming product-market evidence

Run 5–8 moderated task sessions with target mechanical/prototype engineers, using **their own redacted BOM/CAD lines** where possible. Include three tasks:

1. a supported McMaster identifier;
2. a generic phrase with missing attributes;
3. a configuration that produces imperfect supplier-site results.

Record:

- whether this job occurred in the participant’s last month;
- current method and elapsed time;
- whether PartSource reaches a correctly understood configuration faster;
- attributes the participant says are missing;
- whether the participant can explain that results are not equivalents;
- usefulness of each supplier handoff after inspecting the destination;
- whether they save/export the local BOM;
- whether they would use it again, and for which component families.

A convincing POC result is not click-through alone. It is: users recover a useful configuration, identify what still requires verification, and continue research with fewer query reformulations **without making an unsupported product-identity decision**.

## Final answer to the Wayfinder question

The mechanical discovery problem is supported at three levels:

- **Structural:** fragmented distribution, separate catalogs, and specialist supplier-discovery services.
- **Technical:** multidimensional configurations and inconsistent terminology/field meanings.
- **Behavioral:** real BOMs carry McMaster identifiers; engineers report decoding, bulk-sourcing, policy, local-catalog, and cross-border friction.

The behavioral evidence is qualitative and does not yet establish frequency or product demand. The strongest honest POC is therefore a **standards-first configuration recovery and supplier-search workflow for prototype/mechanical engineers, led by known McMaster identifiers but not limited to them**. Bulk sourcing, approved-vendor replacement, international availability, price comparison, and equivalence should be treated as later research questions—not implied capabilities.

PartSource must preserve the line between:

- a configuration fact;
- a supplier search destination;
- a supplier listing;
- a candidate match;
- a cross-reference;
- an exact equivalent; and
- an organization-approved alternate.

Only the first two are in the present POC.
