---
description: Run an adversarial gap-check on one or more Specs before execution — verifies completeness preconditions, simulates the implementing agent, reports Blocker/Warning findings, and performs a coverage/omission sweep
argument-hint: [spec-id | spec-id spec-id ... | all]
allowed-tools: "Read Write Glob Grep Bash(mkdir *) Bash(ls *)"
---

!`mkdir -p docs/products docs/intentions docs/expectations docs/specs docs/reviews`

Available Specs:
!`ls docs/specs/*.yaml 2>/dev/null | head -20 || echo "No specs found. Run /idd-framework:write-spec first."`

Launch the `idd-gap-checker` subagent to run an adversarial content analysis of a Spec (or a set of Specs).

**Model directive:** When dispatching this subagent, you MUST explicitly pass `model: "opus"` to the Agent/Task tool call. The gap-checker requires the current Opus generation for adversarial reasoning — simulating an implementing agent and detecting cross-block contradictions and semantic ambiguity requires deep inference that lighter model tiers cannot reliably perform. Do not downgrade or inherit. Do NOT skip this parameter.

**Invocation forms:**

| Form | Example | Behavior |
|---|---|---|
| Single spec ID | `SPEC-d12e` | Gap-checks that Spec; produces one per-Spec report |
| Multiple space-separated IDs | `SPEC-d12e SPEC-a1b2` | Gap-checks each Spec; produces one per-Spec report plus a combined portfolio coverage report |
| `all` | `all` | Gap-checks every Spec in "ready" or "review" status; produces one per-Spec report plus a portfolio coverage report |
| No argument | _(blank)_ | Agent lists qualifying Specs and prompts for selection |

Pass `$ARGUMENTS` to the agent unchanged so it can resolve the invocation form.

**Per-Spec reports** are saved to `docs/reviews/<spec-id>-gap-check.md` — the filename convention is fixed and the command-layer annotation logic depends on it.

**Portfolio coverage report** (multi-Spec invocations only): after all per-Spec reports are written, the agent saves a combined coverage report to `docs/reviews/portfolio-coverage-<YYYY-MM-DD>.md`. If the file already exists for that date, a `-2`, `-3` … suffix is appended. Each per-Spec report's `## Coverage` section includes a one-line pointer to this portfolio report. No portfolio report is created for single-Spec invocations.

**After the agent returns:**

For each Spec in the working set, read its gap-check report at `docs/reviews/<spec-id>-gap-check.md`. Then append the following `gap_check` annotation to the end of that Spec YAML — this is the ONLY write the command layer makes to the Spec YAML, and it must never touch the five content blocks (context, expectations, boundaries, deliverables, validation):

```yaml
  gap_check:
    status: "passed" | "blocked" | "warnings"   # "passed" = 0 blockers; "blocked" = ≥1 blocker; "warnings" = 0 blockers but ≥1 warning
    blockers: <count>
    warnings: <count>
    report: "docs/reviews/<spec-id>-gap-check.md"
    date: "<YYYY-MM-DD>"
```

Set `status` based on the report's summary line:
- `"blocked"` — report line 1 begins with "BLOCKED"
- `"warnings"` — report line 1 begins with "PASS" and warning count > 0
- `"passed"` — report line 1 begins with "PASS" and warning count = 0

Do not set the Spec's top-level `status` field to "in-progress" if the gap_check status is "blocked" — a Spec with unresolved Blockers cannot proceed to execution.

This annotation behavior is identical for single-Spec and multi-Spec invocations — each Spec receives its own annotation independently.
