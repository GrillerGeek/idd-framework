---
description: Conduct a stakeholder interview to define an IDD Product artifact
argument-hint: [product-name]
---

Initialize the IDD workspace by running the init script:

!`bash ${CLAUDE_PLUGIN_ROOT}/scripts/init-idd.sh`

Load and follow the orchestration workflow defined in `${CLAUDE_PLUGIN_ROOT}/skills/idd-orchestration/SKILL.md`.

Launch the `idd-product-interviewer` agent to conduct the stakeholder interview. Pass any arguments provided by the user as context for the product name or domain.

The agent will:
1. Interview the stakeholder about the problem space, audience, value proposition, and technical context
2. Generate a Product YAML artifact
3. Save it to `docs/products/`

If `$ARGUMENTS` contains a product name, pass it to the agent as initial context.
