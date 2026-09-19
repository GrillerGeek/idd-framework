# SPEC-5113: peer-review handoff

Human peer review: **approved by Jason Robey on 2026-09-12**. The user replied
“I approve” to this handoff and the proposed resolved-coverage policy. No
implementation files had been changed when approval was recorded.

Branch: `codex/portable-skills`

Spec: [SPEC-5113](../specs/SPEC-5113.yaml)

Plan: [Codex and portable skills migration](../plans/2026-09-12-codex-skills-migration.md)

## What this first milestone changes

Contributors starting in Codex, Claude Code, Copilot or Cursor will find the same
shared repository conventions. The documentation and existing Claude commands
will agree about readiness, gap-check outcomes and who changes a Spec's status.
Portable skills and new installation formats follow in later milestones.

## Decisions to review

1. **Shared guidance:** move repository conventions into a linked contributor
   guide; retain Claude model and tool details in Claude-specific instructions.
2. **Technical review:** record its review outcome without entering the post-build
   `review` lifecycle state. Human peer review remains required before `ready`.
3. **Strict gate:** preserve `ready` plus `gap_check.status: passed`, with zero
   blockers and warnings. Merely accepting a warning does not authorize execution
   under this milestone's approved contract. Counts represent unresolved findings;
   independently confirmed accepted coverage omissions remain visible as resolved.
4. **Failed reruns:** invalidate the old gate before review starts. An interrupted
   or malformed result leaves a blocked annotation with no authoritative report;
   an older passing report cannot authorize the next build. This adds an explicit
   `report: null` failure case without rewriting historical artifacts.
5. **Execution:** acknowledge Boundaries before any execution-related write;
   orchestration owns status transitions. Failed or interrupted builds stay
   `in-progress`. An execution report alone is insufficient to advance to `review`.
6. **Compatibility:** preserve current command names, agent names and models,
   artifact IDs, helper contents, plugin version and historical evidence. Update
   current examples and inventories to match the existing v1.6 plugin.

## Review evidence

The author checked YAML syntax with duplicate-key rejection, parent/child links,
minimum edge cases, code reference existence and completeness items 1–10.
Those checks do not establish human peer review.

The [initial gap-check](SPEC-5113-gap-check-initial.md) found one content blocker:
the first draft did not define invalidation after reviewer failure or interruption.
The revised Spec explicitly blocks old authorization before dispatch. The review
also identified the PR template and adoption guide as missing deliverables; both
are now included. Other coverage candidates have explicit author scoping decisions
in the Spec. The [current gap-check](SPEC-5113-gap-check.md) records the latest
independent verdict and any remaining warnings: **zero unresolved blockers and warnings** after approval and a fresh review. All
21 accepted omissions remain visible as independently confirmed resolved findings.

## Coverage policy decision

The current framework permits `accept-omission` dispositions but requires
`gap_check.status: passed` for execution. Counting a documented, intentional
omission as a warning forever makes those two rules conflict, even when the
omitted file is protected historical evidence.

Recommendation for review: an omission explicitly assessed and accepted by the
Spec Author should remain visible in Coverage as a resolved finding. Gate counts
should reflect unresolved findings; undispositioned omissions remain Warnings,
and a dependency needed for validation remains a Blocker until resolved. This
does not authorize ignoring substantive warnings or overwriting the initial
review history. The user approved this change on 2026-09-12. It is now applied to
the Spec contract; a fresh independent gap-check is required before implementation.

The approval confirms the contract choices and file allowlist for milestone 1.
This records Spec peer review, not approval of the as-yet-unbuilt implementation.
