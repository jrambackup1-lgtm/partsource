# PartSource MP-1.6 Primary User Research Plan

**Status:** Prepared; execution not started

**Current evidence:** 0 qualifying moderated sessions

This plan tests whether target users understand the current PartSource boundary, experience the problem it addresses, and identify a monetization path worth testing. It does not treat secondary quotes, surveys, unmoderated tests, recruitment calls, or hypothetical participants as moderated sessions.

## Recruitment screener

Recruit adults who have sourced or specified mechanical fasteners within the last 12 months. A session qualifies only when it is live, moderated, at least 20 minutes, covers the required tasks and comprehension questions, has consent recorded, and can be assigned to exactly one quota segment.

Ask before scheduling:

1. What role best describes your current work or study?
2. In the last 12 months, how often have you specified, maintained, sourced, or bought mechanical fasteners?
3. Describe the most recent fastener search or purchase you personally handled.
4. Which tools, catalogs, supplier sites, approved-vendor systems, or BOM formats did you use?
5. Do you make the technical selection, the purchasing decision, both, or neither?
6. Approximate organization size and whether procurement is centralized. Do not record the organization name.
7. Are you 18 or older, available for a 30–45 minute moderated session, and willing to use a screen-shared prototype?
8. Do you work on PartSource or have privileged knowledge of its design? If yes, exclude.

Assign one segment from the participant's primary current responsibility. Do not double-count a person across quotas. The enterprise procurement segment is separate from the general procurement quota.

### Segment quotas

| Segment | Required | Qualifying criteria |
|---|---:|---|
| Engineer | 3 | Specifies or selects fasteners for current mechanical design, manufacturing, or prototyping work. |
| Procurement user | 3 | Sources or purchases mechanical hardware in a non-enterprise or non-centralized procurement role. |
| Maintenance user | 2 | Identifies or replaces fasteners for maintenance, repair, operations, or field service work. |
| Small-company buyer | 2 | Personally buys mechanical hardware for an organization with fewer than 100 employees. |
| Student/hobbyist | 1 | Sources fasteners for current coursework, a student team, a makerspace, or a personal build. |
| Enterprise procurement user | 1 | Works in centralized procurement or an approved-vendor process at an organization with at least 1,000 employees. |

Recruit alternates, but stop counting when the exact 12-session quota set is complete. Additional qualifying sessions may be retained as supplemental evidence and must still meet every evidence rule.

## Consent and privacy script

Read this before collecting research data:

> This voluntary research session evaluates PartSource, not you. It should take 30–45 minutes. We will record task outcomes and anonymized notes under an anonymized evidence ID. The research ledger contains no names or contact details. You may skip any question or stop at any time without penalty. Screen or audio recording is optional and requires a separate explicit opt-in; declining recording does not prevent participation. Please avoid showing confidential supplier terms, employer data, credentials, personal data, or controlled technical information. Do you consent to the moderated session and anonymized notes? Separately, do you opt in to recording?

Record the two answers independently. If session consent is absent or withdrawn, stop and do not count the session. If recording is declined, take anonymized notes only. If accidental identifying or confidential information appears, exclude it from the ledger and redact it from any retained research artifact.

## Moderator protocol

1. Before the call, verify the assigned segment, prepare a clean prototype state, choose one known bundled catalog identifier, and create the next unused evidence ID.
2. Read the consent script. Record session consent and the separate recording choice before proceeding.
3. Explain that this is an early product evaluation. Do not explain the product boundary before the comprehension probe.
4. Ask the participant to think aloud. Use neutral prompts such as “What do you expect?” and “What tells you that?” Do not teach, sell, or rescue unless the participant is fully stuck.
5. Run all realistic tasks in order. Record outcome, errors, confidence, and direct observations; distinguish observation from interpretation.
6. Ask the unaided comprehension probe: “In your own words, what does PartSource do, and what does it not verify?” Score before correcting misunderstandings.
7. Ask problem and monetization questions. Never quote a proposed price first.
8. Close by explaining the actual boundary, invite final corrections, and confirm whether anonymized evidence may be retained.
9. Within 24 hours, complete the evidence row and detailed note template. Do not count a partial or non-consented session.

## Realistic tasks

1. **First-use explanation:** From the landing page, explain what you think PartSource is for, who it serves, and what you would try first.
2. **Known identifier:** Search the moderator-selected bundled identifier, inspect its detail, and explain which facts you would trust versus verify elsewhere.
3. **Supplier handoff:** Find a plausible fastener configuration, open a supplier-search handoff, and explain what the destination does and does not prove about listing, price, stock, equivalence, or approval.
4. **Local BOM:** Add a candidate to the browser-local BOM, change quantity or user-entered cost, export it, and explain where the data lives and whether PartSource placed an order.
5. **Work fit:** Show how you would handle the same job today. Identify the step with the most risk or wasted effort and whether PartSource changes it.

A task is complete only when the participant reaches the intended end state without the moderator performing the action. Record “partial” or “failed” rather than inferring success.

## Comprehension rubric

Score the unaided explanation once per qualifying session.

**Pass:** The participant communicates all of these ideas in their own words:

- PartSource supports standards-first fastener discovery or inspection of known catalog identifiers.
- It provides a browser-local BOM and export workflow.
- A supplier link is a search handoff requiring independent verification.
- It is not a supplier catalog, not a marketplace, and not a price-comparison engine.
- It does not verify live price, inventory, availability, supplier listing, exact equivalence, organizational approval, or an order.

**Fail:** Any required idea is missing, or the participant claims PartSource verifies an excluded commercial or engineering fact. Record the mistaken belief verbatim or as a close anonymized paraphrase before correcting it.

The exit threshold is at least **10 of 12** passes, which meets the required **80%** threshold. If more than 12 sessions are included in the decision set, at least 80% of that set must pass.

## Monetization questions

Ask after the tasks, without presenting prices or promised features:

1. What is the last sourcing problem like this that cost you time, money, or rework? What happened?
2. Who owns that cost and who could approve spending to reduce it?
3. Which current PartSource step is useful enough to repeat? Which is not useful?
4. If sourcing help reliably acknowledged a qualified request, when would you use it and what outcome would justify paying?
5. Would a supplier-search referral change your trust or behavior? What disclosure would you expect?
6. What repeated team workflow might justify future software spend? Who would pay, and what evidence or controls would be mandatory?
7. What would make you refuse to pay or stop using the product?
8. If you had to choose one path to test next—quote lead, disclosed referral, future team software, or none—which would you choose and why?

Interview answers are directional evidence only. They do not validate a price, conversion rate, affiliate program, SaaS demand, supplier offer, or brokerage transaction.

## Session note template

Complete one detailed note under the matching ledger evidence ID:

- Date; assigned segment; moderated duration and mode.
- Eligibility summary with no employer or personal identity.
- Consent status; recording opted in or not recorded.
- Current workflow and most recent relevant event.
- Task 1–5 outcomes: complete, partial, or failed; observed behavior; neutral quote/paraphrase.
- Unaided comprehension verdict: Pass or Fail; reason; mistaken boundary if any.
- Problem evidence: frequency, severity, existing workaround, and disconfirming evidence.
- Monetization evidence: buyer, trigger, selected path or none, refusal conditions, and whether any amount was volunteered without prompting.
- Researcher interpretation, explicitly separated from observations.
- Follow-up question or protocol issue; no feature commitment.

## Evidence IDs and handling

- Use sequential IDs `PS-UR-001`, `PS-UR-002`, and so on. An ID is evidence only after a qualifying session is completed.
- The repository ledger contains anonymized research only: no identity, employer, email, phone, account, calendar link, IP address, or confidential procurement data.
- If recontact data is needed, the research owner keeps it separately from the repository and does not expose it in the evidence ID.
- Optional recordings require the separate opt-in. Store any approved recording outside the repository in access-controlled storage; the ledger records only “opted in” or “not recorded.”
- Secondary quotes may guide recruiting or prompts, but receive no `PS-UR` ID and never count toward quota, comprehension, problem, or monetization gates.
- A session missing any required ledger field, consent, or detailed note remains non-qualifying until corrected from real evidence.

## Synthesis method

1. Freeze the qualifying decision set and verify quotas before calculating results.
2. Tabulate task completion and comprehension by segment. Report numerator and denominator; do not hide failures in averages.
3. Code problem evidence as frequency, severity, workaround, and consequence. Keep disconfirming cases.
4. Code monetization evidence by buyer, trigger, path selected, refusal condition, and volunteered willingness to pay. Do not convert words into revenue forecasts.
5. Call a theme “cross-segment” only when supported by at least three qualifying sessions across at least two segments. Otherwise label it isolated.
6. Compare findings with secondary research only after primary coding. Secondary quotes cannot fill missing primary cells.
7. Publish a decision table: survive, revise/retest, or kill, with supporting evidence IDs and contrary IDs.

## Stop and kill criteria

Stop a session immediately if consent is absent or withdrawn, the participant exposes confidential or controlled information, the moderator cannot maintain a safe neutral protocol, or the prototype would require a false price, stock, equivalence, approval, or order claim. Exclude sessions under 20 moderated minutes or missing required tasks, evidence, or consent.

Keep MP-1.6 and the Phase 1 exit gate blocked until 12 qualifying sessions meet every quota and at least 10 pass comprehension.

After the quota set is complete:

- **Core problem survives:** at least 8/12 describe a recent relevant discovery, verification, supplier-handoff, or local-BOM problem with a concrete consequence. **Revise/retest:** 5–7. **Kill the current problem thesis:** 0–4.
- **A monetization path survives for a later experiment:** at least 4/12 independently select the same path and give a real workflow trigger plus buyer. **Revise/retest:** 2–3. **Kill that path:** 0–1. Interview evidence never authorizes implementation or a price claim.
- **Comprehension:** pass at 10–12/12. At 0–9, revise product communication and rerun enough fresh qualifying sessions to evaluate the revised wording; do not relabel failed sessions.
