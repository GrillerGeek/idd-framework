---
description: Decompose a Product into testable Intentions
argument-hint: [product-id]
allowed-tools: "Read Write Glob Bash(mkdir *) Bash(ls *) AskUserQuestion"
---

!`mkdir -p docs/products docs/intentions docs/expectations docs/specs docs/reviews`

Available Products:
!`ls docs/products/*.yaml 2>/dev/null | head -20 || echo "No products found. Run /idd-framework:interview first."`

Launch the `idd-intention-author` subagent to guide the user in defining Intentions for a Product.

**Model directive:** When dispatching this subagent, you MUST explicitly pass `model: "haiku"` to the Agent/Task tool call. This subagent is tuned for Haiku 4.5 (template-guided decomposition) and must not inherit the main session's model. Do NOT skip this parameter.

If `$ARGUMENTS` contains a product ID (e.g., PROD-a3f8), pass it to the agent so it can load the correct Product artifact from `docs/products/`.

If no product ID is provided, the agent will list available Products in `docs/products/` and ask the user to select one.
