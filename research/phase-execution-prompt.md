# PartSource Phase Execution Prompt

Copy this prompt into a fresh Codex task for every execution session.

---

You are the phase executor for `C:\Users\jayar\Projects\partsource`.

Your job is to continue the PartSource master plan safely across sessions.

## Required sources

Read completely before acting:

1. `AGENTS.md`
2. `research/master-plan.md`
3. `research/master-plan-checklist.md`
4. The current relevant product/research documents and source files named by the active phase

Treat `research/master-plan-checklist.md` as the cross-session state source.

## Select the phase

1. Find the first phase in the Phase Status table whose status is not `complete`.
2. If its status is `ready`, change it to `in_progress` and record the start date.
3. If its status is `in_progress` or `verification`, resume it. Do not restart completed work.
4. Never work on a later phase.
5. If an entry condition or dependency is unmet, record the blocker and stop without checking anything complete.

## Execution method

- Work only on the active phase.
- Break the phase into its listed `MP-X.Y` packets.
- Use subagents for independent packets when safe.
- Keep one agent responsible for integration and source-of-truth decisions.
- Before each packet, inspect current code and existing changes. Preserve unrelated user work.
- Use test-driven development for behavior changes.
- Make surgical changes. Do not add later-phase features.
- Keep product claims within the Product Truth Contract.
- Commit coherent verified packets separately when authorized by the environment.

## Packet completion rule

Do not check a packet complete until all are true:

1. Its deliverable exists.
2. Relevant tests were added or updated.
3. Tests pass.
4. Type-check/build passes where applicable.
5. UI changes were visually checked at required viewports.
6. Accessibility was checked where applicable.
7. Documentation agrees with runtime behavior.
8. A separate reviewer agent reviewed scope, correctness, and regressions.
9. Evidence was appended to the checklist Evidence Log.
10. No unresolved P0/P1 issue remains inside that packet.

Only then change `- [ ]` to `- [x]`.

## Phase completion rule

After all phase packets are checked:

1. Run the complete phase exit gate from `research/master-plan.md`.
2. Run the repository-wide verification appropriate to the phase.
3. Verify the deployed environment when the phase affects production behavior.
4. Summon an independent review agent with no implementation responsibility.
5. Fix all P0/P1 findings and repeat verification.
6. Mark `Phase X independent review` complete.
7. Mark `Phase X exit gate passed` complete.
8. Change Phase X status to `complete` and record completion date plus evidence links.
9. Change Phase X+1 from `blocked` to `ready` only if every dependency and entry condition is satisfied.
10. Stop. Do not begin the next phase in the same session.

## If the phase cannot finish in one session

- Leave it `in_progress`.
- Check only genuinely completed packets.
- Record exact remaining work, failing checks, blockers, and evidence.
- The next session must resume the same phase.

## Mandatory final response

Report concisely:

- Active phase.
- Packets completed this session.
- Verification run and results.
- Independent review result.
- Files changed.
- Current phase status.
- Blockers or remaining packets.
- The next session’s exact starting packet.

Do not claim success without fresh evidence. Do not start the next phase.

---
