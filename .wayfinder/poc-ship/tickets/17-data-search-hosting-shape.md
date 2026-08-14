---
title: Resolve the POC data, search, public-boundary, and hosting shape
status: closed
label: wayfinder:research
created: 2026-08-09
updated: 2026-08-10
---

## Question

What minimum domain model, Supabase schema/projection, search and ranking architecture, larger-dataset strategy, and frontend hosting route can support the family-first PartSource POC safely and credibly without overbuilding the future platform?

## Resolution

Use a four-relation POC bridge:

1. `catalog_families`
2. `catalog_configurations`
3. `catalog_identifiers`
4. `catalog_releases`

Keep secondary family-specific attributes in reviewed JSONB. Keep aliases and supplier search templates in versioned code/config. Keep raw source lineage private. Return only allowlisted release-bound DTOs through a Supabase Edge Function.

Search order: exact normalized identifier → family alias/terminology → supported constraint parsing → family ranking → family-scoped configuration filtering. Add stable pagination and dominant-facet indexes. Defer embeddings, vector search, LLM parsing, revision graphs, and supplier-offer models.

GitHub Pages is technically suitable for a static, non-transactional public POC with Supabase. Move to Vercel or equivalent before commercial SaaS operation or when runtime middleware, SSR, preview environments, or stricter deployment controls are needed.

The catalog Edge Function is an intentionally public, read-only endpoint. Deploy it with JWT verification disabled. The browser receives only the function URL; a publishable key is not an access-control boundary. Keep the service-role key inside the Edge runtime. Enforce request validation, allowlisted release-bound DTOs, quotas/rate limits, and logging. Treat CORS as browser policy, not authentication.

Evidence: `research/poc-family-search-architecture-2026-08-09.md` and `research/product-frontier-synthesis-2026-08-09.md`.

## Audit resolution — 2026-08-10

Retain closed as an architecture/research decision only. Runtime release controls, performance, security, and deployment acceptance remain unproven and are not implied by this closure.

Audit: `research/wayfinder-ticket-audit-2026-08-10.md`.
