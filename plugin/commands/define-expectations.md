---
description: Define verifiable Expectations with edge cases for Intentions
argument-hint: [intention-id]
allowed-tools: "Read Write Glob Bash(mkdir *) Bash(ls *) AskUserQuestion"
---

!`mkdir -p docs/products docs/intentions docs/expectations docs/specs docs/reviews`

Available Intentions:
!`ls docs/intentions/*.yaml 2>/dev/null | head -20 || echo "No intentions found. Run /idd-framework:define-intentions first."`

Launch the `idd-expectation-author` subagent to help the user define Expectations for an Intention.

**Model directive:** When dispatching this subagent, you MUST explicitly pass `model: "haiku"` to the Agent/Task tool call. This subagent is tuned for Haiku 4.5 (pattern-based edge case Q&A) and must not inherit the main session's model. Do NOT skip this parameter.

If `$ARGUMENTS` contains an intention ID (e.g., INT-7c21), pass it to the agent so it can load the correct Intention artifact from `docs/intentions/`.

If no intention ID is provided, the agent will list available Intentions in `docs/intentions/` and ask the user to select one.
