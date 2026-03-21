---
description: Decompose a Product into testable Intentions
argument-hint: [product-id]
---

Ensure the IDD directory structure exists (create any missing directories):
`docs/products/`, `docs/intentions/`, `docs/expectations/`, `docs/specs/`, `docs/reviews/`

Read `${CLAUDE_PLUGIN_ROOT}/skills/idd-orchestration/SKILL.md` for the full IDD workflow context and phase details.

Launch the `idd-intention-author` agent to guide the user in defining Intentions for a Product.

If `$ARGUMENTS` contains a product ID (e.g., PROD-001), pass it to the agent so it can load the correct Product artifact from `docs/products/`.

If no product ID is provided, the agent will list available Products in `docs/products/` and ask the user to select one.

The agent will:
1. Read the parent Product artifact
2. Guide the user in identifying outcome-focused Intentions
3. Ensure each Intention is independently demonstrable
4. Generate Intention YAML artifacts
5. Save them to `docs/intentions/`
