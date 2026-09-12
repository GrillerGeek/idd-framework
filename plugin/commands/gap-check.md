---
description: Run an adversarial gap-check on one or more Specs before execution — verifies completeness preconditions, simulates the implementing agent, reports Blocker/Warning findings, and performs a coverage/omission sweep
argument-hint: "[spec-id | spec-id spec-id ... | all]"
allowed-tools: "Read Write Glob Grep Bash(mkdir *) Bash(ls *)"
---

Run the `idd-gap-checker` reviewer using the lifecycle contract in
`${CLAUDE_PLUGIN_ROOT}/skills/idd-orchestration/references/spec-reference.md`.
The command owns selection and annotations; the reviewer owns report contents.

**Model directive:** Dispatch `idd-gap-checker` with explicit `model: "opus"`.
Do not inherit or downgrade its adversarial review tier.

## Resolve the selection

| Input | Selection |
|---|---|
| One ID | That Spec |
| Space-separated IDs | Each named Spec |
| `all` | Every Spec whose lifecycle is ready or review |
| Empty | List available ready/review Specs and obtain a selection before writes |

Resolve files under `docs/specs/` and verify the internal Spec IDs. Report missing,
ambiguous or unreadable targets without inventing files. If none remain, stop.
Resolve selection here before dispatch; pass the explicit eligible IDs, not an
unresolved request for the reviewer to select different targets.

## Invalidate before review

Before assessing completeness or dispatching a reviewer, upsert this single
mapping under `spec` on every safely readable selected Spec. Preserve its lifecycle,
five content blocks, links, and other annotations. Never append duplicate keys.

```yaml
  gap_check:
    status: "blocked"
    blockers: 1                    # operational: this invocation has no valid result
    warnings: 0
    report: null
    date: "<YYYY-MM-DD>"
```

If parsing is unsafe, leave that Spec untouched and report failure; execution must
reject it. If invalidation cannot be written safely, do not dispatch that Spec.
Leave older report files in place; they are not authoritative for this invocation.
Create `docs/reviews/` only when a reviewer needs to save a report.

## Dispatch and consume current results

Pass the resolved selection and confirmation of invalidation to the reviewer.
It checks completeness items 1–10 per Spec; item 11 is a separate human fact.
Track a result for each selected Spec in this invocation:

- **Completeness failed:** require failed-item numbers; upsert blocked with
  blockers equal to the failed-item count, zero warnings, null report and today's
  date. The reviewer writes no finding report for it. Never read an old report as
  a substitute. Continue complete Specs; exclude incomplete ones from portfolio
  coverage and state the exclusions.
- **Review completed:** require successful return naming the Spec, its canonical
  `docs/reviews/<SPEC-ID>-gap-check.md`, and counts. Read that report, verify line 1
  and counts match the return, required GC fields are present for content findings,
  and `## Coverage` exists. Count unresolved content and coverage findings only;
  keep reviewer-confirmed resolved omissions visible. On valid evidence replace
  the sentinel with actual counts, path and date: blockers > 0 → blocked;
  zero blockers with warnings > 0 → warnings; both zero → passed.
- **Error, interruption, missing/malformed report or mismatched result:** leave the
  blocked operational sentinel with null report, surface failure and request a
  rerun. Existing files or modification times cannot prove a current result.

In multi-Spec selections, eligible Specs also receive a combined coverage report
at `docs/reviews/portfolio-coverage-<YYYY-MM-DD>.md` (use `-2`, `-3`, etc. when the
path exists). Per-Spec Coverage points to it. With fewer than two complete Specs,
use single-Spec coverage and explicitly name excluded targets; do not imply a
portfolio was reviewed. Per-Spec counts and annotations remain independent;
portfolio conflicts are reported separately and must be resolved before coordinated
execution of overlapping work.

The command never changes lifecycle status or Spec content. A warning-only report
may begin PASS but leaves `gap_check.status: warnings`, which cannot execute.
Recommend author revisions and a new check for outstanding findings; for a clean
result, execution still requires lifecycle ready and human readiness review.
