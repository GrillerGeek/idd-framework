---
description: Multi-perspective Spec review using Agent Teams — reviews architecture, boundaries, and deliverables in parallel
argument-hint: [spec-id]
allowed-tools: "Read Write Glob Grep Bash(mkdir *) Bash(ls *)"
---

Available Specs:
!`ls docs/specs/*.yaml 2>/dev/null | head -20 || echo "No specs found. Run /idd-framework:write-spec first."`

Launch the `idd-deep-review-lead` subagent to conduct a multi-perspective review of a Spec.

**Model directive:** When dispatching this subagent, you MUST explicitly pass `model: "opus"` to the Agent/Task tool call. This subagent requires Opus 4.7 for parallel multi-perspective synthesis (architecture, boundaries, deliverables) and cannot be downgraded. Do NOT skip this parameter. If the deep-review-lead itself spawns sub-reviewers for the parallel perspectives, those may use Sonnet — but the lead agent must be Opus.

If `$ARGUMENTS` contains a spec ID (e.g., SPEC-d12e), pass it to the agent so it can load the correct Spec from `docs/specs/`.

If no spec ID is provided, the agent will list available Specs and identify those in "ready" or "review" status.

This command uses Agent Teams (experimental) for parallel review when available. If Agent Teams are not enabled, the agent conducts a thorough sequential review covering all three perspectives.
