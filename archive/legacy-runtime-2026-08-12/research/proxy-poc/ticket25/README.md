# Ticket 25 blocked-first proxy POC

**Final status: FAIL — C — rethink. Do not integrate or deploy this artifact.**

Controlling result: `../../proxy-poc-ticket25-results-2026-08-10.md`.

Throwaway local research instrument for Wayfinder Ticket 25.

Scope:

- one synthetic, non-authoritative metric coarse standard-profile internal-hex socket-head-cap-screw profile;
- deterministic abstention compiler;
- immutable synthetic candidate-review packets;
- no production app integration;
- no persistence;
- no BOM, copy, export, supplier, listing, offer, stock, price, or availability actions;
- no human-validation, qualified-review, standards-conformance, release-approval, or engineering-selection claim.

Run the compiler kill matrix:

```bash
node --test research/proxy-poc/ticket25/test-kill-matrix.mjs
```

Run the real-browser matrix:

```bash
node research/proxy-poc/ticket25/test-browser.mjs
```

Run the controlling adversarial matrix:

```bash
node --test research/proxy-poc/ticket25/test-adversarial-regressions.mjs
```

The adversarial matrix intentionally remains red at 0/11. Its failures control the Ticket 25 decision; the earlier green matrices do not override it.

The browser harness starts a controlled local server and verifies `ready.json`, base path, build identity, stale-state clearing, blocked states, browser-safe output, mobile overflow, console errors, network origin, and storage. These checks are insufficient to establish a safe trust boundary.
