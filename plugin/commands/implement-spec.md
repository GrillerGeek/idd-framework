---
description: Implement a Spec end-to-end — reads SPEC-ID.yaml, acknowledges Boundaries, writes deliverables, self-verifies, and emits an execution report to docs/reviews/
argument-hint: "[spec-id]"
allowed-tools: "Read Write Glob Grep Bash(mkdir *) Bash(ls *) Bash(git status *)"
---

Follow the bundled contract in
`${CLAUDE_PLUGIN_ROOT}/skills/idd-orchestration/references/spec-reference.md`.
This command owns lifecycle writes; the implementer owns build work and evidence.

## Preflight — no writes

1. Resolve exactly one Spec from `$ARGUMENTS`. With no ID, list available Specs
   and obtain a selection before continuing. Reject multiple IDs, missing files,
   ambiguous matches, unparseable YAML, or an internal ID that does not match the
   selection. Do not create output directories during this step.
2. Read the selected Spec and `gap_check`. Require lifecycle `ready`, gate status
   `passed`, and integer blocker and warning counts both zero.
3. Require the annotation to reference `docs/reviews/<SPEC-ID>-gap-check.md`.
   Read it and require first line `PASS — 0 blockers, 0 warnings` and `## Coverage`.
   A missing, unreadable or mismatched report fails the gate. Known content edits
   after review require a new gap-check; unnoticed manual edit detection is not
   automated by this prose workflow.
4. On any failed prerequisite, explain the refusal in the conversation and stop
   without writes, status transitions, directory creation or dispatch. Existing
   `in-progress` work needs a recovery decision; this command does not resume it.

## Start the verified build

5. Restate every Boundary **verbatim** in the conversation, before any execution
   write, including mkdir or status changes. Missing Boundaries prevent execution.
6. Change only lifecycle ready → in-progress. If that write fails, do not dispatch.
7. Launch `idd-spec-implementer` with the Spec ID/path and a current-invocation
   verified-gate note recording the ready/passed preflight, zero counts, matching
   report path and the transition to in-progress. This note is a handoff from this
   command's completed checks, not a reason to ignore contradictory evidence.

**Model directive:** Pass explicit `model: "sonnet"` when dispatching the
`idd-spec-implementer` subagent. Do not inherit the main session's model.

The implementer confirms the evidence against the in-progress Spec, repeats the
verbatim Boundary acknowledgment with comprehension paraphrases before its own
writes, captures a content baseline and Git status, builds and self-verifies.
It does not change lifecycle status.

## Decide the next state from evidence

Read the returned execution report and verification results. Advance in-progress
→ review only when the report exists, every Deliverable and Boundary passes,
every automated validation passes, and no blocker-grade gap remains. Every edge
case requires evidence; only those explicitly assigned to human review may be
unverifiable at build time with a reason and follow-up. Pending human-only checks
are not failed automation. Report existence alone does not prove completion.

Failed, blocked or interrupted builds retain in-progress. Summarize failure and
save/use a partial execution report if available; do not invent success, roll back
user work, or automatically reset to ready. Explain that resumption needs a recovery
decision outside this command. If the completion status write itself fails, report
that failure and leave the build evidence intact.

Human implementation approval gates review → validating; QA/Product Owner
validation gates validating → done. Neither transition is performed here.
