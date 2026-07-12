# Data Sourcing Decision Record — partsource.io

This document records the legal and technical investigation into obtaining **real product data** for partsource.io, the dead-ends evaluated, and the chosen path. It supersedes any earlier ambiguity about whether to scrape McMaster-Carr or use a third-party scraper.

**Status:** Final (Phase 3 planning, 2026-07-07).
**Risk posture:** Fully clean / PRD-compliant. No McMaster-Carr scraping, no gray-area third-party scrapers.

---

## 1. The Question

> "When someone types a McMaster-Carr part number, can we get the real data from McMaster — prices, specs, stock, images, CAD?"

Short answer: **No free, legal, reliable path exists.** McMaster-Carr is a privately held company that actively walls its catalog behind a login, blocks automated access at the network edge, and offers programmatic access only to approved business customers via a certificate-authenticated API. Every alternative that looks "easy" either doesn't do what it appears to, or offloads legal risk onto us without removing it.

---

## 2. What McMaster-Carr's Own Rules Say

### 2.1 Terms & access enforcement
McMaster-Carr's Terms of Use treat site usage as governed by their conditions, and they **enforce** those conditions technically:
- Documented block message served to heavy/automated users: *"Your use exceeds typical patterns of our visitors, so we have restricted access. Your access will be restored in ~24 hours."* ([Garage Journal](https://www.garagejournal.com/forum/threads/mcmaster-carr-is-me-off.178514/), [Practical Machinist](https://www.practicalmachinist.com/forum/threads/are-mcmaster-carrs-web-site-admins-a-bit-strange.250102/)).
- Product detail pages now **require an account login** to view full specs, pricing, and CAD downloads ([r/engineering](https://www.reddit.com/r/engineering/comments/prltwn/mcmaster_carr_now_requires_login_to_view_product/)).
- Scraping attempts are detected by behavioural fingerprinting and session/UA analysis ([Stack Overflow](https://stackoverflow.com/questions/61883051/issue-when-scraping-data-on-mcmaster-carr-website)).

### 2.2 Official McMaster-Carr Product Information API
[McMaster-Carr Product Information API](https://www.mcmaster.com/help/api/) — *"The McMaster-Carr Product Information API provides an external method for programmatically retrieving our publicly available product information."*

- **Auth model:** Certificate-based — `.pfx` client certificate + API password + account login ([SO](https://stackoverflow.com/questions/73395492/how-to-login-to-mcmaster-carr-api), [dltHub](https://dlthub.com/context/source/mcmaster-carr)).
- **Access is gated:** You must **apply** with an existing McMaster-Carr business relationship. There is **no self-service signup and no free tier**.
- **Verdict:** Legitimate and sanctioned, but **not an MVP option.** Logged as a *future* phase, contingent on partsource having (or a customer having) a McMaster-Carr account in good standing.

---

## 3. Dead-Ends Investigated

### 3.1 `part-number.info`
**Not a McMaster data source.** Despite the domain name, the site is a **National Stock Number (NSN) parts supplier** serving the aerospace/military/locomotive/maritime procurement market. It carries aircraft and military NSN parts data — unrelated to McMaster-Carr's commercial part-number scheme. Discounted.

### 3.2 Apify `parseforge/mcmaster-carr-scraper` (and equivalent scrapers)
These services technically work by rotating residential proxies, defeating captchas, and replaying browser fingerprints. **But they do not change the legal position:** consuming the data still constitutes use of McMaster-Carr's TOS-protected catalog by us, the operator. Apify's existence does not confer a license; it merely offloads the captcha-solving. For a public, indexed, commercial product this is squarely in the gray-to-red zone and we will not use it.

### 3.3 Fair use / "facts aren't copyrightable"
`Feist v. Rural` (facts alone are not copyrightable) does **not** rescue a TOS-protected, login-walled catalog. Two problems:
1. The **login wall** moves McMaster's data outside "publicly accessible" — the protection `hiQ Labs v. LinkedIn` relied on for LinkedIn *public* profiles. McMaster is a harder target than LinkedIn was.
2. Post-*Van Buren* (2021), unauthorized access to a system governed by a TOS you've agreed to (or circumvented a gate to reach) carries **CFAA and breach-of-contract** exposure independent of copyright.

So even if individual spec facts are uncopyrightable, the *operational act of obtaining them at scale from McMaster* is the risk, not the facts themselves.

---

## 4. Current Data Boundary

The production MVP uses public technical standards and a static catalog. Supplier destinations are search handoffs; commercial data is verified on the supplier site.

### 4.1 Legacy Zoro scraper
- Zoro publishes `schema.org/Product` JSON-LD microdata on its product pages, emitted **for search-engine consumption** (Google Shopping). Reading machine-readable metadata a publisher deliberately emits is a far stronger position than scraping HTML.
- The legacy scraper at `web/scripts/scraper_server.py` is not used by the production UI. Production exposes supplier searches without rendering prices or availability.
- The scraper is isolated from the production buyer flow. Reintroducing supplier data requires a sanctioned source and provenance controls in a later phase.

### 4.2 Public fastener standards (freely redistributable facts)
ISO / ASME / DIN dimensional standards (e.g. DIN 912, ISO 4762, ASME B18.3) define thread, pitch, head, and length parameters for standard fasteners. **These dimensions are facts.** We can build and redistribute a catalog derived from them and from supplier-published spec sheets without any TOS exposure.
- **Action:** Grow the static catalog from ~11 → 50-60 high-traffic parts, so the **catalog hit-rate** (not the regex guesser) carries most lookups.

### 4.3 Better regex fallback decoder
For part numbers not in the catalog, decode as much as possible from the number structure itself: pitch from thread via a coarse-pitch table, material/finish from the McMaster series prefix, standards alignment from detected type.
- **Action:** Improve `parseCustomPart` to reduce "Unknown" fields.

### 4.4 Honest UI labelling
- Supplier rows are labeled as searches, not offers, listings, or confirmed matches.
- Users verify identity, price, availability, and specifications on the supplier site.
- No supplier price, inventory, availability, or match is invented.

---

## 5. What Is Explicitly Out of Scope This Phase
- ❌ McMaster-Carr scraping (TOS + login wall + IP-ban risk).
- ❌ Apify / `parseforge` or any gray-area scraper (offloads captcha, does not remove legal risk).
- ❌ Nexar / Octopart API (electronics-focused, weak fastener coverage; adds quota complexity for marginal MVP value).
- ❌ McMaster official API integration (gated; revisit only when a McMaster business relationship exists).

---

## 6. Summary Table

| Source | Real data? | Legal? | Free? | MVP? |
|---|---|---|---|---|
| McMaster-Carr scraping | ✅ | ❌ TOS/CFAA/blocked | ✅ | ❌ |
| Apify McMaster scraper | ✅ | ⚠️ Gray→red (TOS) | ⚠️ Paid | ❌ |
| McMaster official API | ✅ | ✅ | ❌ (gated) | ❌ (future) |
| `part-number.info` | ❌ (unrelated NSN data) | — | — | ❌ |
| **Zoro JSON-LD (deploy + harden)** | ✅ | ✅ Published metadata | ✅ | ✅ |
| **Public fastener standards (catalog)** | ✅ (facts) | ✅ Redistributable | ✅ | ✅ |
| **Regex decoder** | ⚠️ Inferred | ✅ | ✅ | ✅ (fallback) |

## 7. References
- [McMaster-Carr Product Information API](https://www.mcmaster.com/help/api/)
- [McMaster-Carr Integration Support](https://www.mcmaster.com/integrationsupport/)
- [dltHub – McMaster-Carr Python API Docs](https://dlthub.com/context/source/mcmaster-carr)
- [SO – Login to McMaster-Carr API (.pfx auth)](https://stackoverflow.com/questions/73395492/how-to-login-to-mcmaster-carr-api)
- [SO – Issue scraping McMaster-Carr](https://stackoverflow.com/questions/61883051/issue-when-scraping-data-on-mcmaster-carr-website)
- [Practical Machinist – usage pattern throttling](https://www.practicalmachinist.com/forum/threads/are-mcmaster-carrs-web-site-admins-a-bit-strange.250102/)
- [Garage Journal – 24h access restriction message](https://www.garagejournal.com/forum/threads/mcmaster-carr-is-me-off.178514/)
- [r/engineering – login now required](https://www.reddit.com/r/engineering/comments/prltwn/mcmaster_carr_now_requires_login_to_view_product/)
- [Nexar API](https://nexar.com/api) · [Octopart→Nexar transition](https://octopart.com/business/api/v4/api-transition)
