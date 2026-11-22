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
| A mechanical mistake (fixed pattern, banned API, file location, import shape) | An automated check in the project | A follow-on Spec proposal, authored with quick-spec |
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
- A follow-on Spec for a check is proposed here and authored with quick-spec,
  never executed here; it goes through the normal review and gap-check gates.

## 3. Present and decide

Present candidates ranked by severity (cost if it happens again, times how
likely it is), each with: evidence citation, problem, proposed fix, destination
and who applies it. The human approves, edits or rejects each one. Silence is
not approval. No candidates is a valid outcome; say so plainly.

## 4. Apply approved fixes

- An approved retro may edit these Product fields and nothing else:
  `context.conventions`, `context.patterns`, `context.stack`, `context.auth`,
  and the grilling records (`glossary`, `decisions`, `open_questions`) described
  in [the Product template](product-template.md). Existing glossary terms and
  decisions are appended to, never rewritten.
- Product edit safety: parse with a duplicate-key-rejecting YAML parser; keep the
  Product's original bytes from step 1; re-read immediately before writing and
  stop without writing if anything changed; use a localized edit that preserves
  every byte outside the edited fields; validate the result against the Product
  template; reread after saving. If any of this cannot be assured, stop and
  report.
- After a Product edit, re-render its brief following
  [the brief template](brief-template.md).
- Approved mechanical checks become **proposals for a follow-on Spec**, not
  files: record the proposed Intention, Expectation (with two edge cases) and
  check in the report, and recommend running the quick-spec workflow to author
  them through the normal confirmation, review and gap-check gates.
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
