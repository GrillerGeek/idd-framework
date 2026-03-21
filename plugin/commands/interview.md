---
description: Conduct a stakeholder interview to define an IDD Product artifact
argument-hint: [product-name]
---

Ensure the IDD directory structure exists (create any missing directories):
`docs/products/`, `docs/intentions/`, `docs/expectations/`, `docs/specs/`, `docs/reviews/`

Read `${CLAUDE_PLUGIN_ROOT}/skills/idd-orchestration/SKILL.md` for the full IDD workflow context and phase details.

Launch the `idd-product-interviewer` agent to conduct the stakeholder interview. Pass any arguments provided by the user as context for the product name or domain.

The agent will:
1. Interview the stakeholder about the problem space, audience, value proposition, and technical context
2. Generate a Product YAML artifact
3. Save it to `docs/products/`

If `$ARGUMENTS` contains a product name, pass it to the agent as initial context.
