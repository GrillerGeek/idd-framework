---
description: Review a Spec for architectural feasibility and pattern compliance
argument-hint: [spec-id]
allowed-tools: "Read Write Glob Grep Bash(mkdir *) Bash(ls *)"
---

Available Specs:
!`ls docs/specs/*.yaml 2>/dev/null | head -20 || echo "No specs found. Run /idd-framework:write-spec first."`

Launch the `idd-tech-lead-reviewer` subagent to review a Spec.

**Model directive:** When dispatching this subagent, you MUST explicitly pass `model: "opus"` to the Agent/Task tool call. This subagent requires Opus 4.7 for architectural feasibility reasoning and pattern compliance judgment — do not downgrade or inherit. Do NOT skip this parameter.

If `$ARGUMENTS` contains a spec ID (e.g., SPEC-d12e), pass it to the agent so it can load the correct Spec from `docs/specs/`.

If no spec ID is provided, the agent will list available Specs in `docs/specs/` and identify those in "ready" or "review" status.
