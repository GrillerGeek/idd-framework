---
description: Create an AI-ready Spec from Expectations with all 5 mandatory blocks
argument-hint: [expectation-ids...]
allowed-tools: "Read Write Glob Grep Bash(mkdir *) Bash(ls *) AskUserQuestion"
---

Available Expectations:
!`ls docs/expectations/*.yaml 2>/dev/null | head -20 || echo "No expectations found. Run /idd-framework:define-expectations first."`

Existing Specs:
!`ls docs/specs/*.yaml 2>/dev/null | head -20 || echo "No specs yet."`

Launch the `idd-spec-author` subagent to create an AI-ready Spec.

**Model directive:** When dispatching this subagent, you MUST explicitly pass `model: "sonnet"` to the Agent/Task tool call. This subagent is tuned for Sonnet 4.6 (5-block synthesis with codebase pattern scanning) and must not inherit the main session's model. Do NOT skip this parameter.

If `$ARGUMENTS` contains expectation IDs (e.g., EXP-001 EXP-002), pass them to the agent so it can load the correct Expectation artifacts from `docs/expectations/`.

If no expectation IDs are provided, the agent will list available Expectations in `docs/expectations/` and ask the user which ones to include in the Spec.
