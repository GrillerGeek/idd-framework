---
description: Define verifiable Expectations with edge cases for Intentions
argument-hint: [intention-id]
---

Ensure the IDD directory structure exists (create any missing directories):
`docs/products/`, `docs/intentions/`, `docs/expectations/`, `docs/specs/`, `docs/reviews/`

Read `${CLAUDE_PLUGIN_ROOT}/skills/idd-orchestration/SKILL.md` for the full IDD workflow context and phase details.

Launch the `idd-expectation-author` agent to help the user define Expectations for an Intention.

If `$ARGUMENTS` contains an intention ID (e.g., INT-001), pass it to the agent so it can load the correct Intention artifact from `docs/intentions/`.

If no intention ID is provided, the agent will list available Intentions in `docs/intentions/` and ask the user to select one.

The agent will:
1. Read the parent Intention and Product artifacts for context
2. Guide the user in defining what "done" looks like
3. Ensure every Expectation has validation criteria and at least 2 edge cases
4. Assess complexity (low/medium/high) for each Expectation
5. Generate Expectation YAML artifacts
6. Save them to `docs/expectations/`
