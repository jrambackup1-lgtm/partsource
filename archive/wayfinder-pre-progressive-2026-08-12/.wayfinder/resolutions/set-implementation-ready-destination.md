# Resolution comment — Set the implementation-ready destination and operating constraints

- Destination: an implementation-ready documentation handoff, not app implementation.
- `product-contract.md` retains product purpose, terminology, claims, and boundary authority.
- The plan owns sequence, dependencies, interfaces, and gates; the checklist owns status and evidence; the research README owns precedence and routing.
- Use the gate-driven rewrite while preserving R0-R5 names.
- R2-R3 may be built and tested with unmistakably synthetic fixtures while the production catalog remains empty.
- Required data flow: approved source → normalized record → validation → conflict check → independent review → versioned catalog → exact lookup → saved BOM.
- Unapproved, invalid, ambiguous, stale, or withdrawn mappings cannot publish; unsupported lookups are explicit; corrupt BOM storage is quarantined; analytics never collect BOM contents.
