---
name: IDD Orchestration
description: This skill should be used when the user asks to "start IDD", "use intent-driven development", "set up IDD workflow", "define a product", "write intentions", "create expectations", "author a spec", "review a spec", "run the IDD process", or invokes any /idd:* command. Orchestrates the Intent-Driven Development workflow for AI-augmented teams.
---

# IDD Orchestration

Intent-Driven Development decomposes purpose into four levels — Product, Intention, Expectation, and Spec — giving developers and AI agents the context they need to make implementation decisions independently.

## Workflow Phases

| Phase | Command | Agent | Artifact | Output Path |
|-------|---------|-------|----------|-------------|
| 1. Interview | `/idd-framework:interview` | product-interviewer | Product definition | `docs/products/` |
| 2. Intentions | `/idd-framework:define-intentions` | intention-author | Intention artifacts | `docs/intentions/` |
| 3. Expectations | `/idd-framework:define-expectations` | expectation-author | Expectation artifacts | `docs/expectations/` |
| 4. Spec | `/idd-framework:write-spec` | spec-author | Spec artifact | `docs/specs/` |
| 5. Tech Review | `/idd-framework:tech-review` | tech-lead-reviewer | Review annotations | `docs/specs/` (updates) |
| 6. Validation | `/idd-framework:review-spec` | spec-reviewer | Validation report | `docs/reviews/` |

**Accelerated workflows:**
- `/idd-framework:define-outcomes` — Combines Intentions + Expectations in one session
- `/idd-framework:quick-spec` — Produces Intentions + Expectations + Spec in one session
- `/idd-framework:deep-review` — Multi-perspective review using Agent Teams

## Entry Points

Users can enter the workflow at any phase:

- **Full pipeline:** Start with `/idd-framework:interview`
- **Already have a product?** Start at `/idd-framework:define-intentions`
- **Have intentions?** Start at `/idd-framework:define-expectations`
- **Have expectations?** Start at `/idd-framework:write-spec`
- **Have a spec to review?** Start at `/idd-framework:tech-review`
- **Have AI output to validate?** Start at `/idd-framework:review-spec`

## Agents

- **`idd-product-interviewer`** (blue) — Interviews stakeholder to capture Product artifact
- **`idd-intention-author`** (green) — Guides Product Owner to decompose Product into Intentions
- **`idd-expectation-author`** (yellow) — Defines verifiable Expectations with edge cases
- **`idd-spec-author`** (cyan) — Creates AI-ready Specs with all 5 mandatory blocks
- **`idd-tech-lead-reviewer`** (magenta) — Reviews Specs for architectural feasibility
- **`idd-spec-reviewer`** (red) — Validates AI output against Spec criteria
