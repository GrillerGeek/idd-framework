---
description: Create an AI-ready Spec from Expectations with all 5 mandatory blocks
argument-hint: [expectation-ids...]
---

Ensure the IDD directory structure exists (create any missing directories):
`docs/products/`, `docs/intentions/`, `docs/expectations/`, `docs/specs/`, `docs/reviews/`

Read `${CLAUDE_PLUGIN_ROOT}/skills/idd-orchestration/SKILL.md` for the full IDD workflow context and phase details.

Launch the `idd-spec-author` agent to create an AI-ready Spec.

If `$ARGUMENTS` contains expectation IDs (e.g., EXP-001 EXP-002), pass them to the agent so it can load the correct Expectation artifacts from `docs/expectations/`.

If no expectation IDs are provided, the agent will list available Expectations in `docs/expectations/` and ask the user which ones to include in the Spec.

The agent will:
1. Read parent artifacts (Product, Intentions, Expectations) for full context
2. Scan the actual codebase to populate the Context block accurately
3. Author all 5 mandatory blocks: Context, Expectations, Boundaries, Deliverables, Validation
4. Run the completeness checklist
5. Generate the Spec YAML artifact
6. Save it to `docs/specs/`
