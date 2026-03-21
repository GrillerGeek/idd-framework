---
description: Review a Spec for architectural feasibility and pattern compliance
argument-hint: [spec-id]
---

Ensure the IDD directory structure exists (create any missing directories):
`docs/products/`, `docs/intentions/`, `docs/expectations/`, `docs/specs/`, `docs/reviews/`

Read `${CLAUDE_PLUGIN_ROOT}/skills/idd-orchestration/SKILL.md` for the full IDD workflow context and phase details.

Launch the `idd-tech-lead-reviewer` agent to review a Spec.

If `$ARGUMENTS` contains a spec ID (e.g., SPEC-001), pass it to the agent so it can load the correct Spec from `docs/specs/`.

If no spec ID is provided, the agent will list available Specs in `docs/specs/` and identify those in "ready" or "review" status.

The agent will:
1. Run the completeness checklist
2. Verify Context block against the actual codebase
3. Evaluate architectural feasibility and pattern compliance
4. Assess risk based on Expectation complexity
5. Annotate the Spec with review findings (blocker/warning/suggestion)
6. Update the Spec file with a review section
7. Make a go/no-go recommendation
