---
description: Create an AI-ready Spec from Expectations with all 5 mandatory blocks
argument-hint: [expectation-ids...]
allowed-tools: "Read Write Glob Grep Bash(mkdir *) Bash(ls *) AskUserQuestion"
---

Available Expectations:
!`ls docs/expectations/*.yaml 2>/dev/null | head -20 || echo "No expectations found. Run /idd-framework:define-expectations first."`

Existing Specs:
!`ls docs/specs/*.yaml 2>/dev/null | head -20 || echo "No specs yet."`

Launch the `idd-spec-author` agent to create an AI-ready Spec.

If `$ARGUMENTS` contains expectation IDs (e.g., EXP-001 EXP-002), pass them to the agent so it can load the correct Expectation artifacts from `docs/expectations/`.

If no expectation IDs are provided, the agent will list available Expectations in `docs/expectations/` and ask the user which ones to include in the Spec.
