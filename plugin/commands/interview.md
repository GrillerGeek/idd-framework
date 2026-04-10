---
description: Conduct a stakeholder interview to define an IDD Product artifact
argument-hint: [product-name]
allowed-tools: "Read Write Glob Bash(mkdir *) Bash(ls *) AskUserQuestion"
---

Existing Products:
!`ls docs/products/*.yaml 2>/dev/null | head -20 || echo "No products defined yet. This will be the first."`

Launch the `idd-product-interviewer` agent to conduct the stakeholder interview. Pass any arguments provided by the user as context for the product name or domain.

If `$ARGUMENTS` contains a product name, pass it to the agent as initial context.
