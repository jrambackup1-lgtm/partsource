# PartSource Unit Economics and Monetization Decision Model

**Status:** MP-1.4 decision model; unvalidated

**Effective:** 2026-07-13

This document is subordinate to `research/product-contract.md`. If a model assumption conflicts with that contract or `research/master-plan.md`, the contract and phase gates win. This is a decision tool, not a forecast, valuation, or claim of product-market fit.

## Evidence and input policy

Every model input has one of three labels:

- **Observed** — measured in the current PartSource runtime, repository, or primary research. A recorded zero means no evidence is present; it does not mean the market value is zero.
- **External benchmark** — a current outside reference used only as a comparison, not as PartSource performance.
- **Hypothesis** — an unmeasured input to test. Scenario arithmetic does not promote a hypothesis into evidence.

### Observed inputs

| Input | Value and unit | Evidence | Model treatment |
|---|---:|---|---|
| Current attributable revenue | $0 observed | The current product contract records no commercial pricing, offer, checkout, account, or brokerage transaction. | No path is treated as validated. |
| Current sourcing-help action | 1 mailto/clipboard handoff | `research/product-contract.md` says it is a lead only, without dependable submission, acknowledgement, SLA, ownership, or status. | Enough to test demand qualitatively now; not a revenue event. |
| Primary monetization evidence | 0 completed PartSource user studies, 0 attributed purchases, 0 paid SaaS accounts, 0 fulfilled brokerage orders recorded in the reviewed research | `research/research-audit.md` identifies missing primary interviews, CAC, LTV, conversion, retention, and SOM evidence. | All numeric funnel inputs remain hypotheses. |
| Supplier offer data | 0 sanctioned production feeds | `research/product-contract.md` assigns sanctioned supplier data to Phase 9 only. | No live price, inventory, availability, or optimizer model. |

### External benchmark inputs

| Input | Value and unit | Direct source | Use and limit |
|---|---:|---|---|
| Affiliate disclosure requirement | Material commercial connections should be disclosed clearly | [FTC, Advertisement Endorsements](https://www.ftc.gov/news-events/topics/truth-advertising/advertisement-endorsements) (Retrieved: 2026-07-13) | Operational prerequisite only; not a conversion benchmark. |
| Zoro public program reviewed | Reseller program with rebates/discounts; no public affiliate commission or cookie terms on the page | [Zoro Reseller Program](https://www.zoro.com/resellers/) (Retrieved: 2026-07-13) | Does not verify the legacy 4.8% affiliate claim. Absence of terms on this page is not proof that no private program exists. |
| SaaS retention comparison | Dataset covers more than 2,500 SaaS businesses; the provider reports companies above 85% customer retention grow 1.5-3x faster | [ChartMogul Benchmarks](https://help.chartmogul.com/article/138-benchmarks) (Retrieved: 2026-07-13) | 85% annual retention is a later comparison point, not a PartSource forecast. The model uses explicit hypotheses until cohorts exist. |
| Marketplace comparison | 34.7% 2025 marketplace gross margin; Xometry states it is principal in the sale | [Xometry 2025 Form 10-K, SEC](https://www.sec.gov/Archives/edgar/data/1657573/000119312526066959/xmtr-20251231.htm) (Retrieved: 2026-07-13) | Not a thin-broker commission benchmark. It shows why the legacy brokerage analogy must not be copied. |
| Payment-cost structure | Standard processing includes percentage and fixed transaction fees that vary by country and method | [Stripe pricing](https://stripe.com/pricing) (Retrieved: 2026-07-13) | Confirms payment cost is non-zero and location-dependent. Obtain the applicable written price before any paid launch; scenario margins remain hypotheses. |

No supplier-owned page reviewed here verifies the legacy Zoro, MSC, Global Industrial, Grainger, Fastenal, McMaster-Carr, Misumi, or regional-supplier affiliate rates. Third-party network listings can change and are not base-case evidence. Any program must be confirmed in writing before links are monetized.

### Hypothesis inputs

All numerical funnel, price, rate, cost, margin, churn, and reachable-user inputs below are **Hypothesis** values in USD per year unless stated otherwise. They are deliberately simple test points, not estimates derived from TAM.

| Path | Scenario build for annual revenue per monetized user | Hypothesis |
|---|---|---:|
| Affiliate/referral | Conservative: $1,000 attributed annual GMV x 3% modeled rate | $30 |
| Affiliate/referral | Base: $2,000 attributed annual GMV x 3% modeled rate | $60 |
| Affiliate/referral | Upside: $3,000 attributed annual GMV x 3% modeled rate | $90 |
| Quote-lead | Conservative: 2 paid lead events x $50 | $100 |
| Quote-lead | Base: 2 paid lead events x $125 | $250 |
| Quote-lead | Upside: 2 paid lead events x $250 | $500 |
| SaaS | Conservative: $20 monthly test price x 12 months | $240 |
| SaaS | Base: $40 monthly test price x 12 months | $480 |
| SaaS | Upside: $80 monthly test price x 12 months | $960 |
| Brokerage | Conservative: $5,000 annual routed GMV x 6% modeled net revenue share | $300 |
| Brokerage | Base: $20,000 annual routed GMV x 5% modeled net revenue share | $1,000 |
| Brokerage | Upside: $40,000 annual routed GMV x 5% modeled net revenue share | $2,000 |

The modeled affiliate and brokerage percentages are test values, not verified public rates or negotiated terms.

## Definitions and formulas

| Metric | Definition and unit |
|---|---|
| CAC | Acquisition spend attributable to a path / new monetized accounts; USD per new monetized account. Founder time must be costed before a real decision. |
| ARPA | Annual path revenue / average monetized accounts; USD per account per year. It is net PartSource revenue, not supplier GMV. |
| contribution gross margin | (Revenue - variable payment, partner, fulfilment, support, refund, and transaction costs) / revenue; percent. It excludes fixed product development. |
| contribution profit | Revenue x contribution gross margin; USD per year. |
| LTV | Contribution value expected across an account lifetime; USD. The simple recurring model uses ARPA x contribution gross margin / annual logo churn. |
| payback | Months required for monthly contribution profit to recover CAC. |
| LTV:CAC | LTV / CAC; ratio. |

Model formulas:

- Active users = reachable qualified users x activation
- Monetized users = active users x monetized conversion
- Revenue SOM = monetized users x annual revenue per monetized user
- Contribution profit = revenue x contribution gross margin
- LTV = ARPA x contribution gross margin / annual logo churn
- Payback months = CAC / monthly contribution profit per account
- LTV:CAC = LTV / CAC
- Annualized churn = 1 - (observed 90-day logo retention)^4

Reachable qualified users means named or measurable people PartSource can plausibly reach through its owned product, approved communities, direct research recruitment, or a controlled cohort. It excludes arbitrary percentages of market TAM.

For the SaaS pass gate, the 90-day proxy compounds observed cohort survival across four equal periods. This is conservative relative to treating 90-day retention as annual retention. If a mature observed 12-month cohort has worse churn, use that worse observed value; hypothesis churn never qualifies.

## Bottom-up SOM scenarios

Every numeric input in this table is **Hypothesis**. Revenue SOM is annual net PartSource revenue, not GMV. Active and monetized users are calculated values.

| Path | Scenario | Reachable qualified users | Activation | Monetized conversion | Annual revenue / monetized user | Active users | Monetized users | Revenue SOM | Contribution gross margin | Contribution profit |
|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Affiliate/referral | Conservative | 1,000 | 20% | 2% | $30 | 200 | 4 | $120 | 70% | $84 |
| Affiliate/referral | Base | 2,500 | 30% | 4% | $60 | 750 | 30 | $1,800 | 80% | $1,440 |
| Affiliate/referral | Upside | 5,000 | 40% | 6% | $90 | 2,000 | 120 | $10,800 | 85% | $9,180 |
| Quote-lead | Conservative | 500 | 20% | 5% | $100 | 100 | 5 | $500 | 50% | $250 |
| Quote-lead | Base | 1,500 | 30% | 10% | $250 | 450 | 45 | $11,250 | 60% | $6,750 |
| Quote-lead | Upside | 3,000 | 40% | 15% | $500 | 1,200 | 180 | $90,000 | 70% | $63,000 |
| SaaS | Conservative | 500 | 10% | 2% | $240 | 50 | 1 | $240 | 70% | $168 |
| SaaS | Base | 1,500 | 20% | 5% | $480 | 300 | 15 | $7,200 | 80% | $5,760 |
| SaaS | Upside | 3,000 | 30% | 10% | $960 | 900 | 90 | $86,400 | 85% | $73,440 |
| Brokerage | Conservative | 100 | 10% | 10% | $300 | 10 | 1 | $300 | 20% | $60 |
| Brokerage | Base | 300 | 20% | 20% | $1,000 | 60 | 12 | $12,000 | 30% | $3,600 |
| Brokerage | Upside | 600 | 30% | 30% | $2,000 | 180 | 54 | $108,000 | 40% | $43,200 |

### Base-case unit-economics screen

Every value in this table is **Hypothesis**. Affiliate/referral and quote-lead are not subscriptions; their 100% annual loss proxy intentionally caps modeled LTV at one year until repeat behavior is observed.

| Path | CAC | ARPA | Contribution margin | Annual logo churn/loss proxy | LTV | Monthly contribution / account | Payback | LTV:CAC |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| Affiliate/referral | $40 | $60 | 80% | 100% | $48 | $4.00 | 10.0 months | 1.20 |
| Quote-lead | $100 | $250 | 60% | 100% | $150 | $12.50 | 8.0 months | 1.50 |
| SaaS | $240 | $480 | 80% | 30% | $1,280 | $32.00 | 7.5 months | 5.33 |
| Brokerage | $1,000 | $1,000 | 30% | 50% | $600 | $25.00 | 40.0 months | 0.60 |

Worked checks: affiliate LTV = $60 x 80% / 100% = $48; quote-lead payback = $100 / ($250 x 60% / 12) = 8 months; SaaS LTV = $480 x 80% / 30% = $1,280; brokerage LTV:CAC = ($1,000 x 30% / 50%) / $1,000 = 0.60. The attractive hypothetical SaaS ratio is not evidence that users will pay or stay. It cannot satisfy the SaaS pass gate without observed cohort retention and observed or conservatively annualized churn.

### Conservative/base/upside unit-economics scenarios

Every input and output below is **Hypothesis**. CAC and ARPA are USD per monetized account; contribution margin and annual churn/loss proxy are percentages; LTV is USD per account; monthly contribution is USD per account per month; payback is months; LTV:CAC is a ratio. For non-subscription affiliate/referral and quote-lead paths, the loss proxy represents loss of repeat annual value rather than subscription cancellation.

| Path | Scenario | CAC | ARPA | Contribution margin | Annual churn/loss proxy | LTV | Monthly contribution / account | Payback | LTV:CAC |
|---|---|---:|---:|---:|---:|---:|---:|---:|---:|
| Affiliate/referral | Conservative | $80 | $30 | 70% | 100% | $21.00 | $1.75 | 45.71 months | 0.26 |
| Affiliate/referral | Base | $40 | $60 | 80% | 100% | $48.00 | $4.00 | 10.00 months | 1.20 |
| Affiliate/referral | Upside | $20 | $90 | 85% | 80% | $95.63 | $6.38 | 3.14 months | 4.78 |
| Quote-lead | Conservative | $200 | $100 | 50% | 100% | $50.00 | $4.17 | 48.00 months | 0.25 |
| Quote-lead | Base | $100 | $250 | 60% | 100% | $150.00 | $12.50 | 8.00 months | 1.50 |
| Quote-lead | Upside | $50 | $500 | 70% | 70% | $500.00 | $29.17 | 1.71 months | 10.00 |
| SaaS | Conservative | $480 | $240 | 70% | 50% | $336.00 | $14.00 | 34.29 months | 0.70 |
| SaaS | Base | $240 | $480 | 80% | 30% | $1,280.00 | $32.00 | 7.50 months | 5.33 |
| SaaS | Upside | $120 | $960 | 85% | 15% | $5,440.00 | $68.00 | 1.76 months | 45.33 |
| Brokerage | Conservative | $2,000 | $300 | 20% | 100% | $60.00 | $5.00 | 400.00 months | 0.03 |
| Brokerage | Base | $1,000 | $1,000 | 30% | 50% | $600.00 | $25.00 | 40.00 months | 0.60 |
| Brokerage | Upside | $500 | $2,000 | 40% | 25% | $3,200.00 | $66.67 | 7.50 months | 6.40 |

## Sensitivity to the two largest drivers

Reachable qualified users and monetized conversion are co-dominant common revenue drivers because revenue is their product and PartSource has observed neither. Their test ranges differ: reachable users use -30%/+50%, reflecting a bounded controlled-cohort recruitment range; monetized conversion uses -50%/+100%, reflecting wider early-funnel uncertainty. These are **Hypothesis** ranges. Each row changes one driver from base while holding all other inputs constant.

| Driver | Test versus base | Affiliate/referral revenue | Quote-lead revenue | SaaS revenue | Brokerage revenue |
|---|---:|---:|---:|---:|---:|
| Reachable qualified users | -30% | $1,260 | $7,875 | $5,040 | $8,400 |
| Reachable qualified users | Base | $1,800 | $11,250 | $7,200 | $12,000 |
| Reachable qualified users | +50% | $2,700 | $16,875 | $10,800 | $18,000 |
| Monetized conversion | -50% | $900 | $5,625 | $3,600 | $6,000 |
| Monetized conversion | Base | $1,800 | $11,250 | $7,200 | $12,000 |
| Monetized conversion | +100% | $3,600 | $22,500 | $14,400 | $24,000 |

If reachable users miss by 30% and conversion misses by 50%, revenue is 35% of base because the effects multiply. Therefore no path should be funded from the upside case before measured reach and conversion exist.

## Path evidence, gates, and thresholds

Thresholds are experiment decision rules, not promises. A path cannot run merely because it clears a numeric threshold; its phase, legal, data, and operational prerequisites must also be satisfied.

### Affiliate/referral

- **Current evidence:** Secondary sources in the legacy research claim programs and rates, but no current supplier-owned affiliate terms, written acceptance, attribution test, or PartSource conversion data is recorded. Zoro's reviewed first-party page describes a reseller program, not public affiliate terms.
- **Missing evidence:** Written program eligibility, commission basis, excluded products, cookie/attribution rules, clawbacks, payout timing, permitted link placement, qualified clicks, attributed orders, and contribution cost.
- **Earliest eligible phase:** Phase 7, after the legal launch pack, disclosure, analytics, and controlled-cohort gates. Research and written program verification may occur earlier; monetized links may not.
- **Operational prerequisites:** Written acceptance and current terms; conspicuous FTC-aligned disclosure; click/order attribution; supplier-search handoffs still labeled for independent verification; refund/clawback reconciliation; no supplier offer data inferred from a link.
- **Pass:** After at least 100 qualified outbound clicks and 10 attributed orders, purchase conversion >=3%, contribution revenue per click >=$1.00, and CAC payback <=12 months.
- **Iterate:** With at least 100 qualified clicks, purchase conversion 1-2.99% or contribution revenue per click $0.25-$0.99; change one placement or audience variable and rerun once.
- **Kill:** After 250 qualified clicks, purchase conversion <1%, contribution revenue per click <$0.25, or CAC payback >18 months; also kill immediately if written program permission is absent or revoked.

### Quote-lead

- **Current evidence:** The current mailto/clipboard sourcing-help action exposes user intent but is not dependable submission or a commercial quote workflow. Secondary pain reports suggest sourcing friction; no paid PartSource lead exists.
- **Missing evidence:** Primary interviews, qualified-lead definition, consent, dependable capture, acknowledgement, owner, service level, frozen BOM snapshot, supplier capacity, accepted-lead definition, fee agreement, repeat use, CAC, and fulfilment cost.
- **Earliest eligible phase:** Phase 7 for a controlled quote-validation workflow. Demand interviews and concierge tests that make no quote, price, or fulfilment promise can run in Phase 1.
- **Operational prerequisites:** Legal launch pack; explicit consent; dependable lead capture and acknowledgement; named human owner; response SLA; auditable status; manually verified supplier outreach; no sanctioned supplier data implied before Phase 9.
- **Pass:** Among at least 20 qualified submitted leads, >=90% acknowledged within 2 business days, >=10% become accepted paid leads within 30 days, contribution >=$100 per accepted lead, and at least 3 users request a second sourcing event.
- **Iterate:** With at least 20 qualified leads, 5-9.99% become accepted paid leads or contribution is $1-$99 per accepted lead; fix one qualification or response-time issue and rerun.
- **Kill:** After 40 qualified leads, <5% become accepted paid leads, acknowledgement <70%, or contribution <=$0 per accepted lead.

### SaaS

- **Current evidence:** No account, company workspace, cloud BOM, paid feature, price test, paid account, churn cohort, or willingness-to-pay study exists. The old $19-49/month tier is only a historical assertion.
- **Missing evidence:** Repeated team workflow, buyer and user identity, feature demand, design partners, willingness to pay, billing owner, support load, security needs, activation, paid conversion, retention, churn, CAC, and expansion.
- **Earliest eligible phase:** Phase 8, after the secure backend trigger and company-workspace foundation. Price interviews and fake-door research without payment may occur earlier if clearly labeled.
- **Operational prerequisites:** Secure backend; organizations and roles; durable shared workflow; billing and cancellation; privacy and retention controls; support ownership; cohort analytics; no paywall that damages current anonymous local utility without evidence.
- **Pass:** In a cohort of at least 30 qualified design-partner accounts, >=20% activate the company workflow, >=10% pay, observed 90-day logo retention >=85%, and churn comes from either observed 12-month annual logo churn or Annualized churn = 1 - (observed 90-day logo retention)^4; recompute LTV with that observed or annualized churn, then require LTV:CAC >=3.0 and CAC payback <=12 months. Hypothesis churn can never satisfy this gate.
- **Iterate:** With at least 30 accounts, paid conversion 5-9.99%, observed 90-day retention 60-84.99%, LTV:CAC 1.0-2.99 after recomputation with observed/annualized churn, or CAC payback 12.01-24 months; change one package or workflow variable and retest.
- **Kill:** After 50 qualified accounts, activation <10%, paid conversion <5%, observed 90-day retention <60%, LTV:CAC <1.0 after recomputation with observed/annualized churn, or CAC payback >24 months.

### Brokerage

- **Current evidence:** Zero brokered PartSource orders, negotiated supplier terms, checkout, server-owned totals, payment, tax, fulfilment, return, or reconciliation operations. Xometry is a principal marketplace and is not evidence for a thin PartSource commission.
- **Missing evidence:** Legal/operator structure, supplier contracts, negotiated revenue share, quote accuracy, landed cost, order authority, payment risk, tax, insurance, traceability, fulfilment ownership, returns, disputes, working capital, support cost, repeat rate, and primary buyer demand.
- **Earliest eligible phase:** Phase 11 only, after Phase 9 sanctioned data and every Phase 11 commercial entry requirement passes.
- **Operational prerequisites:** Sanctioned supplier identities and offer data; server-owned quotes/totals; written supplier and customer terms; verified payment, tax, fulfilment, tracking, cancellation, returns, reconciliation, compliance, and human exception operations.
- **Pass:** Across at least 10 supervised fulfilled orders, >=95% line-item fulfilment accuracy, >=90% on-time shipment, contribution gross margin >=20%, exception/refund rate <=2%, and at least 3 repeat buyers.
- **Iterate:** Across 5-9 fulfilled orders, contribution gross margin 10-19.99%, on-time shipment 70-89.99%, or exception/refund rate 2.01-5%; remain supervised and do not scale.
- **Kill:** After 20 qualified quotes, accepted-order conversion <10%, contribution gross margin <10%, exception/refund rate >5%, any unbounded liability, or any negative-contribution order pattern.

Sanctioned supplier data remains Phase 9 only. SaaS and company features remain Phase 8 only. Brokerage remains Phase 11 only.

## Legacy-claim disposition

| Legacy claim | Disposition |
|---|---|
| public affiliate availability and rates | **Reject as current fact.** Supplier-owned terms and PartSource acceptance are unverified. Confirm in writing, then record the effective rate, exclusions, attribution, and date before any model uses it. |
| $19-49/month pricing | **Reject as validated pricing.** No willingness-to-pay or retention evidence exists. $20/$40/$80 are bounded hypotheses for later research, not current offers. |
| 10-20% brokerage commission | **Reject.** No negotiated term supports it, and principal marketplaces are not comparable. Use negotiated net platform revenue and full variable costs only in Phase 11. |
| 5-search/day paywall | **Reject.** No observed abuse, willingness-to-pay, or conversion evidence supports restricting the current anonymous discovery utility. |
| savings and optimizer claims | **Reject and block.** No sanctioned comparable offers, landed-cost model, fulfilment evidence, or optimization engine exists. User-entered costs cannot become PartSource savings claims. |

## Current decision

- **Primary validation now:** quote-lead demand, through Phase 1 interviews and clearly bounded concierge discovery. This is the shortest path from the existing sourcing-help intent to evidence without claiming supplier offers or building later-phase infrastructure.
- **Secondary experiments:** verify one affiliate program in writing and test SaaS willingness to pay in interviews/fake-door research. Neither is a live monetized product now.
- **Blocked:** monetized affiliate links until Phase 7 prerequisites; any SaaS/company feature until Phase 8; any sanctioned supplier feed or offer display until Phase 9; any brokerage transaction until Phase 11.

Primary user evidence is still required. This model does not validate monetization. It only states what must be measured, how the arithmetic works, and when to pass, iterate, or kill each path.
