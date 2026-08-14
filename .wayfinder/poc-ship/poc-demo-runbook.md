# PartSource POC demo and pilot runbook

Status: **historical and superseded — NO-GO; do not demo, ship, deploy, or use as current evidence.**
Controlling records: `research/proxy-poc-ticket25-results-2026-08-10.md`, Wayfinder Tickets 24/25, and `research/production-readiness-checklist.md`.

## Historical demo goal — not currently approved

This section records the earlier local demo hypothesis. Later audits rejected its release, selection, and supplier-action assumptions. Do not execute or present this script as a current product flow.

## Demo setup

1. Open the final demo URL.
   - Local: `http://localhost:4173/partsource/` after `npm run preview`.
   - Production: `N/A — local POC candidate evidence only`.
2. Clear browser storage for a clean demo if needed.
3. Use a browser width that also works on mobile. Minimum smoke target: 320px.
4. Keep this script visible. Do not improvise product claims.

## Historical demo script — do not execute

### 1. McMaster-number input

1. Click the main search box.
2. Enter `91290A115`.
3. Submit search.
4. Expected result:
   - App recognizes it as a McMaster-style number.
   - App does not claim an exact match, equivalent, price, stock, or offer.
   - App says no supported configuration yet / unsupported input.

Say: "A McMaster number is accepted as a clue. If we have not reviewed it, we fail closed."

### 2. Search `M4 screws`

1. Return to the home/search view.
2. Enter `M4 screws`.
3. Submit search.
4. Expected result:
   - App shows supported M4 screw configurations.
   - Example expected configuration: `DIN912-M4X12` if present in the final build.
   - Results are configuration research, not supplier offers.

Historical script line withdrawn: the pilot facts do not have qualified mechanical review or release approval.

### 3. Guided screw selection

1. Use the guided screw controls.
2. Select a screw type, size, material, and finish that exists in the pilot catalog.
3. Open a resulting configuration detail page.
4. Expected result:
   - Detail page shows configuration attributes.
   - It does not show price, stock, checkout, or equivalent claims.

Say: "The app helps narrow a configuration. The user still verifies the supplier item."

### 4. Historical supplier search handoff — prohibited by the current gate

1. Do not execute this step.
2. Supplier handoff remains blocked until release identity, lifecycle, required facts, conflicts, and qualified review pass.
3. Expected result:
   - Link opens a supplier search URL.
   - User chooses and verifies the supplier result on the supplier site.
   - PartSource does not claim the supplier result is the same part.

Say: "These are search handoffs only. No scraping, no API, no offers."

### 5. Add to named BOM

1. Return to the configuration detail page.
2. Create or select a named BOM.
   - Demo name: `POC Demo BOM`.
3. Add the configuration to that BOM.
4. Expected result:
   - The named BOM contains a saved configuration snapshot.
   - Any cost fields are user-entered only, if visible.

Say: "BOM data is local to this browser for the POC."

### 6. Reload persistence

1. Reload the page.
2. Open the named BOM manager.
3. Expected result:
   - `POC Demo BOM` is still present.
   - The added configuration is still present.

Say: "The POC persists named BOMs locally in the browser."

### 7. CSV and JSON export

1. Export the named BOM as CSV.
2. Export or back up the named BOM as JSON.
3. Optional: open the files and confirm they contain the configuration snapshot.
4. Expected result:
   - CSV export is for spreadsheet review.
   - JSON export is for backup/restore.
   - Exports do not become supplier offers or quotes.

Say: "Export is portability, not procurement."

## Historical claim list — not currently approved

The earlier claims below are preserved for audit only. Do not present them as current claims.

- "This is a sourcing-research POC."
- "It has a limited pilot catalog."
- "It shows hardware configurations."
- "McMaster numbers are input clues only."
- "Supplier links are search handoffs."
- "The user verifies the supplier result on the supplier site."
- "Named BOMs are saved locally in the browser."
- "CSV and JSON export help with portability and backup."
- "User-entered costs, if any, are user data."

## Banned claims

Do not say or imply:

- "Equivalent", "same as", "interchangeable", "approved alternate", or "replacement".
- "Verified supplier part" unless a future approved source explicitly supports it.
- "Live price", "best price", "savings", "in stock", "available", or "offer".
- "Buy", "checkout", "quote", "order", or "procurement platform".
- "Connected to McMaster/Zoro/Grainger APIs".
- "Scraped supplier catalog".
- "Full catalog coverage".
- "Production-ready commercial launch".

## Known limitations

- No supplier API.
- No scraping.
- No equivalents.
- No prices.
- No stock.
- No checkout.
- No quotes.
- No supplier offers.
- No account or cloud sync.
- Limited pilot catalog only.
- Supplier links are search destinations only.
- User must verify every supplier result on the supplier site.

## Release evidence

Historical evidence captured on 2026-08-09. Ticket 12 later reopened and Ticket 25 failed; this table is not current release evidence.

| Evidence | Value |
|---|---|
| Release commit SHA | `09e030a449e0aa0e44d9c929607cb20589a93e75` |
| Branch/tag | `master` / no release tag yet |
| `npm ci` | Not rerun in final audit; existing install used. Run before external ship. |
| `npm run lint` | Passed inside `npm run release:audit` (`tsc --noEmit`). |
| `npm test` | Passed inside `npm run release:audit`; prohibited public-claim scan passed. |
| `npm run test:catalog-search` | Passed inside `npm run release:audit`. |
| `npm run build` | Passed inside `npm run release:audit`; generated 589 static metadata pages. |
| `npm run test:catalog-boundary` | Passed inside `npm run release:audit`; warning: live API rate-limit check did not trip within 70 requests. Verify deployed limiter separately. |
| `npm run test:browser` | Passed inside `npm run release:audit`; 16/16 browser tests passed. |
| `npm run release:audit` | Passed locally from `web/` on 2026-08-09. |
| Browser smoke | Local browser suite passed; local preview URL should be `http://localhost:4173/partsource/` after `npm run preview`. |
| `release.json` URL | Local file: `web/dist/release.json`. Production URL: N/A until deploy. |
| `release.json` content | `{ "sha": "09e030a449e0aa0e44d9c929607cb20589a93e75", "builtAt": "2026-08-09T10:18:14.000Z" }` |
| Production URL | N/A — local POC candidate evidence only. |
| Local URL | `http://localhost:4173/partsource/` after `npm run preview`. |
| CI/deploy run | N/A — not deployed in this session. |

Expected release audit command from `web/`:

```sh
npm run release:audit
```

Expected local demo commands from `web/`:

```sh
npm ci
npm run release:audit
npm run preview
```

If a release metadata file is generated separately, capture:

```sh
RELEASE_SHA=<full-40-char-sha> npx tsx scripts/generate-release-metadata.ts
```

## Stop-demo procedure

Stop immediately if any of these happen:

1. The app shows price, stock, offer, buy, checkout, quote, or affiliate language.
2. The app says or implies equivalent, same as, replacement, interchangeable, or approved alternate.
3. A McMaster-number input resolves to an unreviewed supplier item as if verified.
4. Supplier handoff opens anything other than a search destination.
5. Named BOM data does not reload or export during the demo.
6. The presenter cannot answer without making a banned claim.

Then say:

"We are stopping the demo because the POC guardrail did not hold. We will fix and re-run the release audit before showing it again."

## Rollback procedure

For production:

1. Stop sharing the demo URL.
2. Identify the bad release SHA and last known-good SHA.
3. Revert with a normal Git revert. Do not rewrite history.
4. Run the release audit again from `web/`.
5. Deploy only after the audit and browser smoke pass.
6. Record bad SHA, revert SHA, known-good SHA, audit output, deploy URL, and smoke result.

For local demo:

1. Stop the preview/dev server.
2. Close browser tabs showing the bad build.
3. Switch to a known-good checkout only if approved by the repo owner.
4. Reinstall and rerun the release audit.
5. Restart preview only after checks pass.

## Historical pre-demo checklist — not current evidence

- [x] All release evidence placeholders replaced or explicitly marked local-only.
- [x] McMaster-number input fails closed for unreviewed numbers.
- [x] `M4 screws` search works.
- [x] Guided screw selection works.
- [x] Supplier search handoff works.
- [x] Add to `POC Demo BOM` works.
- [x] Reload persistence works.
- [x] CSV export works.
- [x] JSON export/backup works.
- [x] No banned claims in UI or presenter script.
