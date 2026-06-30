---
description: Validate AI-generated output against a Spec's Expectations and Boundaries
argument-hint: "[spec-id]"
allowed-tools: "Read Write Glob Grep Bash(mkdir *) Bash(ls *)"
---

!`mkdir -p docs/products docs/intentions docs/expectations docs/specs docs/reviews`

Available Specs:
!`ls docs/specs/*.yaml 2>/dev/null | head -20 || echo "No specs found. Run /idd-framework:write-spec first."`

Launch the `idd-spec-reviewer` subagent to validate implementation against a Spec.

**Model directive:** When dispatching this subagent, you MUST explicitly pass `model: "sonnet"` to the Agent/Task tool call. This subagent is tuned for the current Sonnet generation (validation across Expectations, Boundaries, and Deliverables with codebase verification) and must not inherit the main session's model. Do NOT skip this parameter.

If `$ARGUMENTS` contains a spec ID (e.g., SPEC-d12e), pass it to the agent so it can load the correct Spec from `docs/specs/`.

If no spec ID is provided, the agent will list available Specs in `docs/specs/` and identify those in "in-progress" or "review" status.
