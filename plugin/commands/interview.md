---
description: Conduct a stakeholder interview to define an IDD Product artifact
argument-hint: [product-name]
allowed-tools: "Read Write Glob Bash(mkdir *) Bash(ls *) AskUserQuestion"
---

!`mkdir -p docs/products docs/intentions docs/expectations docs/specs docs/reviews`

Existing Products:
!`ls docs/products/*.yaml 2>/dev/null | head -20 || echo "No products defined yet. This will be the first."`

Launch the `idd-product-interviewer` subagent to conduct the stakeholder interview. Pass any arguments provided by the user as context for the product name or domain.

**Model directive:** When dispatching this subagent, you MUST explicitly pass `model: "haiku"` to the Agent/Task tool call. This subagent is tuned for the current Haiku generation (template-guided Q&A) and must not inherit the main session's model. Do NOT skip this parameter.

If `$ARGUMENTS` contains a product name, pass it to the agent as initial context.
