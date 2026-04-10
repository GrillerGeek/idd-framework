---
description: Define verifiable Expectations with edge cases for Intentions
argument-hint: [intention-id]
allowed-tools: "Read Write Glob Bash(mkdir *) Bash(ls *) AskUserQuestion"
---

Available Intentions:
!`ls docs/intentions/*.yaml 2>/dev/null | head -20 || echo "No intentions found. Run /idd-framework:define-intentions first."`

Launch the `idd-expectation-author` agent to help the user define Expectations for an Intention.

If `$ARGUMENTS` contains an intention ID (e.g., INT-001), pass it to the agent so it can load the correct Intention artifact from `docs/intentions/`.

If no intention ID is provided, the agent will list available Intentions in `docs/intentions/` and ask the user to select one.
