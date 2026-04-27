---
description: Define Intentions and Expectations together in a single session — combines define-intentions + define-expectations
argument-hint: [product-id]
allowed-tools: "Read Write Glob Bash(mkdir *) Bash(ls *) AskUserQuestion"
---

Available Products:
!`ls docs/products/*.yaml 2>/dev/null | head -20 || echo "No products found. Run /idd-framework:interview first."`

Launch the `idd-outcome-author` subagent to guide the user in defining both Intentions and Expectations for a Product in one session.

**Model directive:** When dispatching this subagent, you MUST explicitly pass `model: "sonnet"` to the Agent/Task tool call. This subagent is tuned for Sonnet 4.6 (dual-artifact synthesis across 25 turns) and must not inherit the main session's model. Do NOT skip this parameter.

If `$ARGUMENTS` contains a product ID (e.g., PROD-a3f8), pass it to the agent so it can load the correct Product artifact from `docs/products/`.

If no product ID is provided, the agent will list available Products and ask the user to select one.
