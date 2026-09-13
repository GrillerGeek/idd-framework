# Portable review procedure

This resource is authoritative for the three review stages. The loaded entry point names the stage. Resolve this resource and the Spec reference from the installed skill directory, and project paths from the consuming project. Use available native tools and existing safe YAML tooling; do not install dependencies or depend on another IDD skill. If safe duplicate-key-rejecting parsing is unavailable, stop with an actionable limitation before writes.

## Ownership and selection

The main conversation is orchestration and the sole project writer. Optional technical/validation reviewers and deep perspectives return read-only findings. If delegation is unavailable, explicitly separate orchestration and reviewer phases locally. Honor host adapter model policy only when using that adapter; otherwise use the configured model without cross-vendor equivalences. Do not fabricate tools, worker results or human decisions.

Select one exact internal Spec ID from docs/specs, accepting descriptive filenames. Empty input lists draft/ready/review candidates for technical/deep review, or in-progress/review for validation, then requests selection. Never pick the first or silently bulk-review. Missing, ambiguous, archived-only, unreadable or duplicate-key YAML targets produce a concrete question/recovery instruction and no writes. Reject aliases or formatting that prevents safe annotation isolation; never repair malformed content here. Read linked Product/Intention/Expectation context and actual existing code as needed, using safe parsing and exact identity. Resolve conflicting or missing context visibly rather than guessing.

At the first context load, bind the original selected Spec and relevant context bytes/type/mode to the parsed values. Capture the whole project inventory and bytes/types/modes, including hidden files, installed skills and dirty notes, excluding .git contents; separately record Git HEAD/branch/index. Keep this baseline in memory or captured tool output. SHA-256 hashes represent byte identity for unowned-file comparisons; retain original raw text only for context binding and localized annotation/report edits that need it. Do not repeatedly embed entire installed-resource contents in command literals when their original hashes suffice. Retain or emit the original date-safe byte/hash/type/mode inventory before parsing/serialization can fail. Keep raw snapshot data separate from parsed YAML values: timestamps may become date objects, so safely encode them if exporting parsed values. A lost first parsed baseline cannot be replaced with a newly adopted baseline; stop for a fresh review if original-context equality cannot be established. Do not write scratch files, including under /tmp. Git status/diff alone is not byte-preservation evidence. Stop if reliable capture/comparison is unavailable. Before every project write, compare against the expected full current state; account only for your already-owned writes. Re-read the target immediately before updating it; preserve concurrent changes. No atomic multi-file transaction is promised: on late interference retain prior owned outputs, name exact paths and incomplete operations, and request recovery without rollback or overwriting user edits.

For every stage, resolve the consuming project root canonically. Immediately before each directory creation, annotation write or report save/replacement, check every ancestor beneath that root: existing ancestors must be real directories, never symlinks; existing output targets must be regular files with one hard link, never symlinks or special files. Verify absent targets remain absent and create them exclusively without following links. Preserve existing regular-file modes on replacement. Reject unsafe or changed paths before writing; do not follow a canonical report link into another file. Keep these checks bound to the baseline and use no-follow/descriptor-based operations when available. This is conservative coordination, not hostile-race containment.

## Technical/deep review preparation

Before reviewer work, orchestration replaces or inserts exactly one spec.review annotation with reviewer, today's ISO date, status needs-changes, and one blocker finding (block validation) saying the current technical review is operationally incomplete. Its recommendation is to rerun the interrupted review. This sentinel invalidates old approval; it is not a completed substantive judgment. Leave any previous report unchanged until a current completed review replaces it. Preserve lifecycle, five content blocks, gap_check, human facts, comments and all other bytes and modes.

Use a safe YAML parser's node/text range to edit only the review mapping. Do not parse/dump the whole file. Refuse unsupported indentation, aliases, duplicate keys, unsafe paths, symlink/hardlink output targets or any layout where an isolated edit cannot preserve outside bytes. When inserting an absent mapping, choose a valid location inside spec without moving other fields. Validate one complete candidate document before writing and compare original outside-annotation bytes afterward. Hold the original review text and all outside bytes through the run; a newer baseline must not silently replace original evidence. Operational error, interruption, missing perspectives or malformed current output retains needs-changes sentinel and an explicit failure message. Do not reuse old findings as this invocation's result.

## Technical analysis

Review completeness items 1–10 from the bundled Spec reference; enumerate each result. Record item 11 only from attributable actual human evidence, otherwise pending. Check stack, patterns, conventions, actual code-reference existence and authentication against the repository. Compare every Boundary with Deliverables and Expectations for contradictions; check every Deliverable's contribution to an Expectation and its edges. Assess implicit dependencies, scope and meaningful error/boundary cases. Keep internal reasoning private; surface concise findings, exact block/field or code evidence, severity and recommended author action.

The review annotation uses the existing schema:

~~~yaml
review:
  reviewer: "Tech Lead (AI-assisted)" # or Deep Review Lead (AI-assisted)
  date: "YYYY-MM-DD"
  status: "approved" # approved | needs-changes | rejected
  findings:
    - severity: "blocker" # blocker | warning | suggestion
      block: "context" # context | expectations | boundaries | deliverables | validation
      description: "Specific issue and evidence"
      recommendation: "Concrete author action"
~~~

Use approved only if all ten mechanical items pass and no blockers remain. Otherwise needs-changes; rejected is reserved for demonstrated infeasibility/out-of-scope intent. Findings may be empty after a complete clean review. Warnings are not permission to bypass the execution gate. Technical approval is content advice, not lifecycle readiness or human review. Recommend author fixes and actual human review/readiness followed by gap-check; recommend implementation only with ready and a current passed gate with zero unresolved findings. Preserve current lifecycle and gap annotation in this workflow.

For tech-review, orchestration validates the current complete result, compares preservation and upserts the final annotation. In the visible final response include current outcome, ten-item checklist, human pending/recorded, evidence/findings and next actions. No separate technical report is created.

## Deep review

Cover all three named perspectives: Architecture; Boundaries & Edge Cases; Deliverables & Validation. Architecture checks context against code; boundaries checks cross-block contradictions and every edge; deliverables checks scoped outputs and verifiable automated/human validation. Prefer parallel native read-only perspective dispatch where actually available. Hand each worker original Spec/context, scope and explicit no-write instruction. Only orchestration owns sentinel, report and final annotation.

If a worker fails or times out, keep completed results, review failed perspectives yourself, and record Parallel dispatch with partial degradation — <perspective> self-reviewed. If dispatch is unavailable, explicitly conduct all three locally and record Sequential fallback — dispatch unavailable. Successful dispatch alone is not completed coverage. Do not publish a complete review until every perspective has actual current findings or an explicit reviewed/no-findings result. If local fallback also fails, retain sentinel and report the failure, not a complete result.

Save docs/reviews/<SPEC-ID>-deep-review.md with these six sections in order:

- Summary: current Spec ID and ISO date, Overall Status Approved/Needs Changes/Rejected, X/10 mechanical completeness, human peer review recorded/pending, and truthful Review Approach (Parallel dispatch, partial degradation or Sequential fallback).
- Architecture Findings: severity, specific field/code evidence and recommendation, or explicitly reviewed/no findings.
- Boundaries & Edge Case Findings: same structure, covering all boundaries and edges.
- Deliverables & Validation Findings: same structure, covering all outputs and validation items.
- Completeness Checklist Results: every item 1–10 individually pass/fail, human 11 separately recorded/pending.
- Recommendation: concrete author actions; approval does not authorize execution.

Validate current report against returned findings and original Spec before saving. Create docs/reviews only when saving an actual result; do not initialize the whole hierarchy. Re-read and validate the saved report, compare full expected state, then upsert final review annotation consistent with report status/findings. If report saved but annotation failed, leave sentinel and explicitly report the partial state. Keep prior report intact until a complete candidate is ready; never read an old report as today's result.

## Implementation validation

review-spec is report-only: leave the entire Spec, all artifacts/code/tests, installed resources, Git state and dirty user files unchanged. Inspect the actual implementation and each linked Expectation. Explicitly assess each edge rather than inferring it from a happy path. Audit each Boundary and Deliverable against available evidence. A baseline captured now proves only that this review preserved files; it does not prove whether the preceding implementer changed off-limits files. Without a reliable historical baseline or attributable evidence, mark that historical claim Unverified.

Inspect every automated validation item before running it. Only execute explicitly specified, safe local read-only checks with existing tools, each bounded to at most 60 seconds and 1 MiB output. Do not execute network/install/destructive commands, invent commands from arbitrary prose, or repair test/code failures. Explain unavailable, unsafe or non-executable criteria as Unverified. For checks that can be inspected without running, state that evidence and its limits. Compare full state before and after checks; a check's unowned mutation is a failure, not a new accepted baseline. Report partial state without deleting or repairing changed files.

Write only docs/reviews/<SPEC-ID>-review.md after a complete candidate is prepared and preservation preflight passes. Create only its needed directory. Preserve an existing report until a valid current candidate replaces it, using an original-byte/mode comparison. Re-read saved report and compare full expected project state. Required sections in order:

- Summary: current Spec ID/date, Overall Status, expectation/boundary/deliverable counts, confidence and evidence limitations. Overall Fail for demonstrated failed requirement, Boundary violation or missing Deliverable; Needs Changes for any Partial/Unverified/pending human item; Pass only when every required item passes and actual human evidence is recorded.
- Expectation Results: rows for each linked ID and every edge labeled <ID> edge case N; description, Pass/Partial/Fail/Unverified, concrete file/line or test evidence, confidence.
- Boundary Results: exact Boundary text, Clean/Violation/Unverified, evidence and confidence. Never present absence of a historical baseline as Clean.
- Deliverable Results: exact Deliverable, Present/Missing/Incomplete/Unverified, evidence and confidence.
- Automated Validation: exact check, Pass/Fail/Unverified, actual command/exit/output or explanation, confidence. Do not claim executed tests from source inspection alone.
- Human Review Required: every original item pending or recorded with attributable actual evidence; never substitute your own judgment.
- Recommendations: concrete next actions and unresolved evidence, with no automatic lifecycle transition.

Confidence is High for directly observed evidence, Medium for inference, Low for unavailable evidence. Report aggregate counts from item rows. Surface test failures prominently. Do not fabricate historical boundary success or an unqualified Pass from correct code alone.
