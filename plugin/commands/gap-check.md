---
description: Run an adversarial gap-check on a Spec before execution — verifies completeness preconditions, simulates the implementing agent, and reports Blocker/Warning findings
argument-hint: [spec-id]
allowed-tools: "Read Write Glob Grep Bash(mkdir *) Bash(ls *)"
---

!`mkdir -p docs/products docs/intentions docs/expectations docs/specs docs/reviews`

Available Specs:
!`ls docs/specs/*.yaml 2>/dev/null | head -20 || echo "No specs found. Run /idd-framework:write-spec first."`

Launch the `idd-gap-checker` subagent to run an adversarial content analysis of a Spec.

**Model directive:** When dispatching this subagent, you MUST explicitly pass `model: "opus"` to the Agent/Task tool call. The gap-checker requires the current Opus generation for adversarial reasoning — simulating an implementing agent and detecting cross-block contradictions and semantic ambiguity requires deep inference that lighter model tiers cannot reliably perform. Do not downgrade or inherit. Do NOT skip this parameter.

If `$ARGUMENTS` contains a spec ID (e.g., SPEC-d12e), pass it to the agent so it can load the correct Spec from `docs/specs/`.

If no spec ID is provided, the agent will list available Specs in `docs/specs/` and identify those in "ready" or "review" status.

**After the agent returns:**

Read the gap-check report saved to `docs/reviews/<spec-id>-gap-check.md`. Then append the following `gap_check` annotation to the end of the Spec YAML — this is the ONLY write the command layer makes to the Spec YAML, and it must never touch the five content blocks (context, expectations, boundaries, deliverables, validation):

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
