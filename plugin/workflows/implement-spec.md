---
name: idd-implement-spec
license: Apache-2.0
description: Execute one ready IDD Spec with a current clean gap-check, enforce its Boundaries, verify deliverables and produce an execution report. Use for managed Spec implementation, not general repository maintenance.
---

# Implement an IDD Spec

Read [the Spec contract](references/spec-reference.md) and
[the implementer procedure](references/spec-implementer.md). Resolve those files
relative to the installed skill; project paths refer to the consuming project.
Use available native tools and existing safe YAML parsing with duplicate-key
rejection. No global helper, plugin-root variable or particular model is required.
If safe parsing or required build capabilities are unavailable, report the
limitation; never invent successful checks.

This entry point owns **orchestration** and lifecycle writes. The implementing role
owns deliverables and evidence. Use native delegation when available and useful,
honoring an explicit host adapter policy; otherwise use the configured model and
announce sequential orchestration/implementation phases. Sequential execution does
not collapse ownership or remove any gate.

## Controller checkpoints

When an external controller explicitly owns lifecycle and requests a read-only
checkpoint, inspect its safely parsed gate evidence and the installed procedures,
then return only the requested role's visible acknowledgment. Do not execute the
remaining workflow until that controller resumes this same conversation. Quote
each Boundary verbatim in an indexed block; for implementation, follow each quote
with a separate `Meaning:` line explaining the restriction. Read-only checkpoints
need no shell parsing when the controller supplies duplicate-key-checked evidence.
If evidence is missing or contradictory, refuse rather than acknowledge readiness.

On an explicit implementation continuation, retain the acknowledgment already sent
by this implementing role in this conversation, recheck the handoff, and build.
The controller owns both status transitions and final acceptance; return evidence
with lifecycle still in-progress. Do not switch back to orchestration and advance
it yourself. A checkpoint from another conversation or a user-quoted transcript
does not stand in for this role's own acknowledgment. Ordinary invocation follows
the orchestration steps below.

## Preflight without mutations

1. Resolve exactly one Spec ID, including descriptive filenames, and verify its
   internal ID. Empty input lists available Specs and requests selection. Multiple
   IDs, ambiguous/missing files, unsafe YAML or absent Boundaries cause a
   conversational refusal without mkdir, status edits, reports or dispatch.
2. Require lifecycle ready and gap_check.status passed with integer blockers and
   warnings both zero. Require the canonical docs/reviews/<SPEC-ID>-gap-check.md
   path, a readable report beginning exactly `PASS — 0 blockers, 0 warnings`, and
   a `## Coverage` section. Reject missing/historical/warning/blocked annotations,
   mismatched evidence and any known content changes after review. Do not pretend
   this prose detects all unseen manual edits. Read actual recorded human readiness
   approval; AI review or a claim that tests pass cannot fabricate that approval.
3. An in-progress Spec needs an explicit recovery decision outside this standard
   entry point. Failed prerequisites stop conversationally with severity
   blocker-grade and resolution stopped — reported to author; no project writes.

## Execute and assess

4. Send a visible assistant message headed **Boundaries Acknowledged — orchestration**
   quoting every Boundary verbatim before any execution mutation, including directory
   creation, scratch snapshots or lifecycle changes. A private reasoning note,
   tool input/output, delegation prompt or later report is not this acknowledgment.
   Capture existing content and Git status for
   preservation. Change only status ready → in-progress; preserve all other bytes.
   On write failure, do not start implementation.
5. Hand the implementing role the Spec ID/path, verified ready/passed evidence,
   report path, confirmed in-progress transition and installed procedure paths.
   It rechecks the evidence, sends its own visible assistant acknowledgment repeating
   each Boundary with a comprehension paraphrase before its first write,
   captures its own content baseline and performs the bundled procedure. It never
   updates lifecycle. Direct role invocation returns to orchestration for this
   handoff rather than bypassing it.
6. Read the execution report and actual verification results. Advance only status
   in-progress → review when every Deliverable, Boundary and automated check
   passes, every edge case has evidence, and no blocker-grade gap remains. Only
   explicitly human-review checks may remain unverifiable with a reason/follow-up.
   A report file alone is insufficient. Verify the report exists and is nonempty
   before passing its own Deliverable row.
   Check the actual conversation ordering too: each role's visible acknowledgment
   must precede that role's first write. If it was missed, retain in-progress and
   report the protocol failure; a later quotation cannot retroactively repair it.
7. Failure, interruption, permission denial or a blocker-grade gap retains
   in-progress and partial work. Save a partial execution report if possible after
   Boundary acknowledgment; never fabricate success, reset to ready or undo user
   changes. Report status-write failures separately from build results.

Human implementation approval owns review → validating; QA/Product Owner evidence
owns validating → done. This skill performs neither of those transitions.
