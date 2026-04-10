---
description: Define Intentions and Expectations together in a single session — combines define-intentions + define-expectations
argument-hint: [product-id]
allowed-tools: "Read Write Glob Bash(mkdir *) Bash(ls *) AskUserQuestion"
---

Available Products:
!`ls docs/products/*.yaml 2>/dev/null | head -20 || echo "No products found. Run /idd-framework:interview first."`

Launch the `idd-outcome-author` agent to guide the user in defining both Intentions and Expectations for a Product in one session.

If `$ARGUMENTS` contains a product ID (e.g., PROD-001), pass it to the agent so it can load the correct Product artifact from `docs/products/`.

If no product ID is provided, the agent will list available Products and ask the user to select one.
