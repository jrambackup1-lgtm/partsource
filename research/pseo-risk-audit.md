# pSEO Audit & Indexing Strategy — partsource.io

This document outlines the Programmatic SEO (pSEO) risk scoring, content quality compliance, index gating, and sitemap deployment timeline for **partsource.io**.

---

## 1. Google HCU & pSEO Risk Analysis

Under Google's **Helpful Content Update (HCU)** rules, bulk-generated programmatic pages must deliver real utility to searchers rather than just targeting keywords. 

### Risk Assessment Rubric

| Criterion | Evaluation | Risk Level | Mitigation / Strategy |
|---|---|---|---|
| **Content Uniqueness** | High. Each page decodes a distinct part number. | Low | Ensure the page dynamically outputs unique, specific metrics (threads, sizes, materials). |
| **Search Intent Match** | High. Solves exact search queries for equivalents. | Low | Map search parameters precisely to distributor catalog terms. |
| **Thin Content Risk** | High. Templates with only a few parameters look like spam. | **Medium-High** | Enforce a strict content floor of unique text and tools on every page. |
| **Domain Reputation** | High. Bulk indexing on main domain can penalize main brand. | **High** | Isolated domain strategy: keep pSEO on `partsource.io` completely separated from `afterconcept.com`. |
| **Link Authority** | New domains with 600K pages are ignored/sandboxed. | **High** | Earn 20+ organic backlinks for the interactive homepage tool before indexing any part pages. |
| **Crawl Budget** | Google won't index 600K new pages at once. | **Medium** | Phased index rollouts. Deploy in batches (5K -> 20K -> 100K -> 600K). |
| **Legal / Trademark** | Using competitor terms in title tags. | **Medium** | Safe comparative layouts. Avoid using "McMaster-Carr" in `<title>` tags; use generic terms like "McMaster Part equivalent". |

---

## 2. Page Content Floor (Anti-Thin Content Rules)

To prevent search engines from flagging auto-generated pages as "thin affiliate spam," every part page must contain **at least 5 of the following 7 elements**:

1. **Decoded Spec Table**: Complete mechanical properties (e.g., thread size, length, material, grade, drive type, finish).
2. **Standard Numbers**: Mapping to standard ISO, DIN, ANSI, or ASME specifications (e.g., "DIN 912 equivalent").
3. **Active Search Deep-Links**: Direct search links to at least 3 major distributors (Zoro, MSC, Fastenal, Misumi, Bolt Depot) built using precise keyword query strings.
4. **Supplier Searches**: Clearly labeled search handoffs, never offers, listings, or confirmed matches.
5. **Verification Boundary**: Identity, price, availability, and specifications must be verified on the supplier site.
6. **Internal Links Grid**: Links to at least 3 related part sizes (e.g., "Engineers also searched for: M4 x 16mm, M4 x 25mm").
7. **Technical/Application Note**: A brief functional note describing typical applications for that specific category of fastener (e.g., "M4 socket head screws are typically used in electronics enclosures and precision machinery assemblies").

---

## 3. Phased Rollout Strategy

```
Phase 1: Domain Trust (Month 1–2)
  ├── Launch single-page interactive decoder tool (homepage widget)
  ├── Publish 10 high-quality, hand-written SEO articles (blog/guides)
  └── Earn 20+ organic backlinks from engineering forums and directories
         │
         ▼
Phase 2: Controlled pSEO Rollout (Month 2–4)
  ├── Index the first 10,000 part pages (fasteners only)
  ├── Ensure all pages pass the content floor checklist
  └── Monitor search performance: CTR, bounce rate, average session duration
         │
         ▼
Phase 3: Scale (Month 4+)
  ├── Slowly expand sitemaps to 100,000 and eventually 600,000 parts
  └── Apply "noindex" tags to any part number where the regex fails to produce a full spec
```

---

## 4. Indexing Checklist Gate

Before any programmatic part page is permitted to be indexed by Google (placed in `sitemap.xml` without `noindex`), it must pass this audit checklist:

- [ ] Page lives on the dedicated `partsource.io` domain (not `afterconcept.com`).
- [ ] Root domain has accumulated at least **20 high-quality backlinks**.
- [ ] The regex decoder successfully decoded the part number (not labeled as "unknown").
- [ ] Page satisfies at least **5 out of the 7 content floor requirements**.
- [ ] At least 3 distributor search query URLs are generated and validated.
- [ ] Title tag is generic and descriptive (e.g., "M4 Socket Cap Screw Equivalents & Sourcing").
- [ ] Page contains internal links to related sizes to allow crawl bot navigation.
