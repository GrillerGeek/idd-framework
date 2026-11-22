# Retro procedure

A retro turns what went wrong while delivering one Spec into concrete,
approved improvements, so the next Spec goes better. It **proposes**; nothing
changes until a human approves a candidate. Run it after validation and before
archive, because archive distills the evidence away.

## 1. Select and gather evidence (read-only)

Input: one Spec ID. Resolve it among live Specs; if it exists only in the
archive ledger, say so and stop. Read, in this order, and keep a citation
(file and section) for everything you use:

1. Execution reports for the Spec in `docs/reviews/`:
   `spec_gaps_encountered`, deviations, blockers.
2. Gap-check reports for the Spec: findings, and any gap found later that the
   gap-check did not raise.
3. The validation (review-spec) report: failures, unverified items, pending
   human checks.
4. Build-team plans that name the Spec, such as `docs/guildhall/plans/` quest
   plans: their Not yet specified, Decisions, Lessons and reviewer findings.
5. Optionally, a host session log the user points to.
6. The Spec, its Expectations and Intentions, and the parent Product (context,
   glossary, decisions, open questions), to judge where a fix belongs.

Write nothing during this step. Missing evidence is reported, not invented.

## 2. Build candidates

A candidate is one problem, traced to evidence, with one proposed fix. Drop any
candidate you cannot cite. Do not pad the list with generic advice.

Route each candidate by what went wrong:

| What went wrong | Fix lands in | Applied by |
|---|---|---|
| The Spec lacked a fact the implementer needed | Product context, glossary or decisions | This conversation, after approval |
| Vocabulary confusion | Product glossary | This conversation |
| A judgement-call mistake the reviewer missed | Product `context.conventions` (inherited by Specs, read in review) | This conversation |
| A mechanical mistake (fixed pattern, banned API, file location, import shape) | An automated check in the project | A follow-on draft Spec |
| Slow to find a file or fact | A navigation pointer from a file the agent already reads, or Product context code references | This conversation |
| The gap-check should have caught it | Gap-checker attack list | Upstream feedback |
| A template or completeness-checklist gap | IDD template or checklist | Upstream feedback |
| Process friction (WIP, hand-offs, waiting) | The periodic process retro | Report only |

Rules:

- Prefer a failing check over a sentence for anything mechanical.
- Never propose rules or instructions for CLAUDE.md or AGENTS.md. A single
  navigation pointer line is allowed when that file is the one the agent
  already reads.
- Installed IDD files are read-only in a consuming project. Improvements to
  IDD itself are written up as **upstream feedback** for the framework's
  maintainers, not applied.
- A follow-on Spec for a check is drafted, never executed here; it goes through
  the normal review and gap-check gates.

## 3. Present and decide

Present candidates ranked by severity (cost if it happens again, times how
likely it is), each with: evidence citation, problem, proposed fix, destination
and who applies it. The human approves, edits or rejects each one. Silence is
not approval. No candidates is a valid outcome; say so plainly.

## 4. Apply approved fixes

- Product edits follow the shared authoring rules: safe duplicate-rejecting
  YAML parsing, baseline comparison immediately before the write, localized
  edits, stop on concurrent change. Re-render the Product brief afterwards.
- Draft follow-on Specs only for approved mechanical checks, with a new ID from
  the bundled ID helper and status draft.
- Edit nothing else.

## 5. Report

Write `docs/reviews/SPEC-<id>-retro.md` (a second retro for the same Spec uses
`SPEC-<id>-retro-<YYYYMMDD>.md`; never overwrite an existing report):

```markdown
---
spec: SPEC-<id>
date: <YYYY-MM-DD>
lessons:
  - <one line a future Spec author should know>
---
# Retro — SPEC-<id>

## Candidates
| # | Severity | Problem | Evidence | Fix | Destination | Decision |
|---|---|---|---|---|---|---|

## Applied changes
## Upstream feedback
## Deferred to the process retro
```

`lessons` holds one to three lines. Archive copies them into the ledger record
so they survive after the reports are distilled away.
