---
description: Implement a Spec end-to-end — reads SPEC-ID.yaml, acknowledges Boundaries, writes deliverables, self-verifies, and emits an execution report to docs/reviews/
argument-hint: "[spec-id]"
allowed-tools: "Read Write Glob Grep Bash(mkdir *) Bash(ls *) Bash(git status *)"
---

!`mkdir -p docs/products docs/intentions docs/expectations docs/specs docs/reviews`

Available Specs:
!`ls docs/specs/*.yaml 2>/dev/null | head -20 || echo "No specs found. Run /idd-framework:write-spec first."`

Before dispatching the agent, perform the following status-transition sequence:

1. **Verify the Spec is ready.** Read the Spec YAML at `docs/specs/[spec-id].yaml` and confirm `status: "ready"` and `gap_check.status: "passed"`. If either condition is not met, stop and report to the user — do not transition status or dispatch the agent.

2. **Transition status to in-progress.** Once the ready-check passes, update the Spec YAML's `status` field from `"ready"` to `"in-progress"`.

3. **Dispatch the agent with a note that the ready-check is already done.** Pass the note `"ready-check: passed by command layer — skip redundant ready-status check"` along with the spec ID so the agent does not attempt to transition the Spec back or re-verify ready status against the now-transitioned file.

Launch the `idd-spec-implementer` subagent to implement the Spec.

**Model directive:** When dispatching this subagent, you MUST explicitly pass `model: "sonnet"` to the Agent/Task tool call. This subagent is tuned for the sonnet class (structured synthesis with codebase scanning and file modification) and must not inherit the main session's model. Do NOT skip this parameter.

If `$ARGUMENTS` contains a spec ID (e.g., SPEC-8776), pass it to the agent along with the ready-check note so it can load the correct Spec from `docs/specs/`.

If no spec ID is provided, the agent will list available Specs in `docs/specs/` and identify those in "ready" status with `gap_check.status: "passed"`.

**After the agent writes its execution report**, transition the Spec YAML's `status` field from `"in-progress"` to `"review"`. The agent itself must not perform this transition — status transitions are the command layer's responsibility.
