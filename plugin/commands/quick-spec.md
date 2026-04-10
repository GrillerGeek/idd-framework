---
description: Produce Intentions + Expectations + Spec in a single guided session from a Product and feature description
argument-hint: [product-id] [feature-description]
allowed-tools: "Read Write Glob Grep Bash(mkdir *) Bash(ls *) AskUserQuestion"
---

Available Products:
!`ls docs/products/*.yaml 2>/dev/null | head -20 || echo "No products found. Run /idd-framework:interview first."`

Existing Specs:
!`ls docs/specs/*.yaml 2>/dev/null | head -20 || echo "No specs yet."`

Launch the `idd-quick-spec-author` agent to produce Intentions, Expectations, and a Spec in one session.

If `$ARGUMENTS` contains a product ID and feature description (e.g., `PROD-001 "Users can view their onboarding checklist"`), pass both to the agent.

If no arguments are provided, the agent will list available Products and ask the user for a feature description.
