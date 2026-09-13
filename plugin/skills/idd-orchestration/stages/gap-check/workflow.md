---
name: idd-gap-check
license: Apache-2.0
description: Adversarially review one or more IDD Specs for implementation ambiguity, contradictions and unowned impact-surface files before execution. Produces finding reports and gate annotations without rewriting Spec content.
---

# Gap-check IDD Specs

Read the bundled [Spec contract](references/spec-reference.md) and
[reviewer procedure](references/gap-reviewer.md). Resolve resources relative to
this installed skill, and project artifacts relative to the consuming project.
Use only available native tools; there is no required plugin environment variable,
model vendor, external agent package or globally installed helper.

This entry point is the **orchestrator**. The reviewer is report-only. If native
subagent delegation is available, delegate this bounded review with explicit
selected IDs, project path, installed reference paths and invalidation evidence.
Honor a host adapter's explicit reviewer policy; otherwise use the host's configured
model. If delegation is unavailable, announce sequential orchestration and reviewer
phases and execute the same procedure locally; the reviewer phase must not edit
Specs or grant itself permission to execute. A tool failure is not a clean review.

## Select before writes

- One ID selects one Spec; multiple IDs select that exact set, deduplicated.
- `all` selects Specs with lifecycle ready or review.
- Empty input lists available ready/review Specs and requests selection.

Resolve exact IDs under docs/specs, including descriptive filenames; require one
file per selected internal ID. Report missing/ambiguous/unreadable targets and
continue only unambiguously selected ones. No eligible target means stop without
writes. Parse one YAML document with duplicate keys rejected before converting
values. Use existing safe YAML tooling; if no safe parser is available, stop with
an actionable limitation. Never repair malformed YAML as part of this review.

## Invalidate, then review

For each safely readable selected Spec, replace or insert exactly one spec.gap_check
mapping with status blocked, blockers 1, warnings 0, report null and today's ISO
date. Preserve every other byte, including lifecycle, comments and all five
blocks. Use a parser to identify the mapping; replace only its text span. A whole
file parse/dump can reformat content and is not an acceptable annotation update.
If the document's formatting prevents a safe isolated edit, stop that target and
report the limitation; do not dispatch it with an old passed annotation.

Keep previous reports until a current completed review replaces them. Pass the
explicit selected IDs and successful invalidation to the reviewer. It checks
completeness 1–10, performs adversarial analysis and the required Coverage sweep,
and returns one current result per selected Spec. Human peer review is a separate
fact, never an inference from the review result.

## Consume current results

- Completeness failure returns item numbers, writes no finding report and never
  reads a previous report as its result. Replace the sentinel with blocked,
  blockers equal to the failed-item count, warnings 0 and report null. Leave any
  old report bytes untouched; continue the complete targets.
- Completed review returns ID, canonical docs/reviews/<SPEC-ID>-gap-check.md and
  unresolved counts. Read this invocation's report and verify the summary counts,
  all required finding fields, and mandatory Coverage. Confirm the quoted Spec
  content is still current. Both counts zero gives passed; blockers zero and
  warnings positive gives warnings; any blocker gives blocked. Update only the
  single annotation and preserve all other Spec bytes.
- Errors, interruption, missing/malformed output, count mismatches or an unverified
  current result retain the blocked operational sentinel with null report. Report
  the failure and rerun; old files and their timestamps are not evidence of a new
  successful review. Do not infer a zero from missing results.

With two or more complete Specs, require the reviewer's combined coverage report
and surface ownership conflicts before coordinated execution. Incomplete targets
are named and excluded. With fewer than two complete Specs use single-Spec
coverage and do not claim portfolio review. Canonical reports have fixed per-Spec
names; portfolio names receive a numeric suffix on collision. No lifecycle change
occurs in this skill. A clean result still requires ready and actual human review
before implementation; a report headed PASS with warnings does not authorize it.
