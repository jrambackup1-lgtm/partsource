# Behavioral family workspace prototype

**Status:** Exploration experiment. Not production UI and not an implementation spec.

## Question

Can one family-centered interaction handle broad description search and exact identifier lookup without making the exact path slow or overstating incomplete data?

## What this prototype exercises

- `M4 screw` → family chooser with the M4 constraint preserved.
- `M4 socket head screw` → Socket Head Cap Screws workspace with M4 applied.
- `DIN 912 M4 × 12` → family workspace with unresolved strength/material state.
- `91290A115` → inspector-first exact configuration with family controls collapsed.
- Unique, incomplete, invalid-by-rule, not-indexed, and unknown states.
- BOM and supplier actions disabled until one configuration is selected.
- Separate configuration provenance and identifier-mapping provenance.
- Desktop and an explicit phone-preview composition.
- URL hash and browser Back state.

## Deliberate limits

- It uses a tiny interaction-only mock record set. It is not catalog evidence.
- It does not validate the correct family taxonomy or attribute order.
- It does not prove supplier destinations are useful.
- It does not test real users.

## Run

Open `index.html` directly in a browser.

Use the preset queries first. Then change facets, select rows, open test states, toggle phone preview, and use browser Back.

## Decision gate

Do not choose this model because it looks polished. Test it against the current list/detail flow with real engineering tasks. Keep it only if broad queries become easier without making exact-identifier confirmation slower or less trustworthy.
