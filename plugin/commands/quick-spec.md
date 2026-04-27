---
description: Produce Intentions + Expectations + Spec in a single guided session from a Product and feature description
argument-hint: [product-id] [feature-description]
allowed-tools: "Read Write Glob Grep Bash(mkdir *) Bash(ls *) AskUserQuestion"
---

Available Products:
!`ls docs/products/*.yaml 2>/dev/null | head -20 || echo "No products found. Run /idd-framework:interview first."`

Existing Specs:
!`ls docs/specs/*.yaml 2>/dev/null | head -20 || echo "No specs yet."`

Launch the `idd-quick-spec-author` subagent to produce Intentions, Expectations, and a Spec in one session.

**Model directive:** When dispatching this subagent, you MUST explicitly pass `model: "sonnet"` to the Agent/Task tool call. This subagent is tuned for Sonnet 4.6 (compressed full-pipeline synthesis with codebase scanning) and must not inherit the main session's model. Do NOT skip this parameter.

If `$ARGUMENTS` contains a product ID and feature description (e.g., `PROD-a3f8 "Users can view their onboarding checklist"`), pass both to the agent.

If no arguments are provided, the agent will list available Products and ask the user for a feature description.
