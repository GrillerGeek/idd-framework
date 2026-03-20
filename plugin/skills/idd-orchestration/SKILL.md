---
name: IDD Orchestration
description: This skill should be used when the user asks to "start IDD", "use intent-driven development", "set up IDD workflow", "define a product", "write intentions", "create expectations", "author a spec", "review a spec", "run the IDD process", or invokes any /idd:* command. Orchestrates the Intent-Driven Development workflow for AI-augmented teams.
---

# IDD Orchestration

Orchestrate the Intent-Driven Development workflow — a "chain of context" model that decomposes purpose into four levels: Product, Intention, Expectation, and Spec. This skill guides users through each phase or helps them start at any point.

## Framework Overview

IDD replaces traditional agile's work-decomposition with purpose-decomposition:

```
Product          →  "Here's why this exists and who it's for."
  └─ Intention   →  "Here's what we're trying to accomplish and why it matters."
      └─ Expectation  →  "Here's how we'll know it's right, including the edge cases."
          └─ Spec      →  "Here's everything you need to build it."
```

Each layer gives developers and AI agents the information they need to make implementation decisions independently, without waiting for someone above them.

## Workflow Phases

The IDD workflow proceeds through 6 phases. Each phase has a dedicated command and agent.

| Phase | Command | Agent | Artifact | Output Path |
|-------|---------|-------|----------|-------------|
| 1. Interview | `/idd:interview` | product-interviewer | Product definition | `docs/products/` |
| 2. Intentions | `/idd:define-intentions` | intention-author | Intention artifacts | `docs/intentions/` |
| 3. Expectations | `/idd:define-expectations` | expectation-author | Expectation artifacts | `docs/expectations/` |
| 4. Spec | `/idd:write-spec` | spec-author | Spec artifact | `docs/specs/` |
| 5. Tech Review | `/idd:tech-review` | tech-lead-reviewer | Review annotations | `docs/specs/` (updates) |
| 6. Validation | `/idd:review-spec` | spec-reviewer | Validation report | `docs/reviews/` |

## Agents

This workflow uses six co-located agents defined in the plugin's `agents/` directory:

- **`idd-product-interviewer`** (blue) — Interviews stakeholder to capture Product artifact
- **`idd-intention-author`** (green) — Guides Product Owner to decompose Product into Intentions
- **`idd-expectation-author`** (yellow) — Defines verifiable Expectations with edge cases
- **`idd-spec-author`** (cyan) — Creates AI-ready Specs with all 5 mandatory blocks
- **`idd-tech-lead-reviewer`** (magenta) — Reviews Specs for architectural feasibility
- **`idd-spec-reviewer`** (red) — Validates AI output against Spec criteria

## Entry Points

Users can enter the workflow at any phase:

### Full Pipeline
Start from scratch with a new product idea:
1. Run `/idd:interview` to capture the Product definition
2. Run `/idd:define-intentions` to decompose into Intentions
3. Run `/idd:define-expectations` to define verifiable Expectations
4. Run `/idd:write-spec` to produce AI-ready Specs
5. Run `/idd:tech-review` to validate architectural feasibility
6. Execute the Spec with an AI coding agent
7. Run `/idd:review-spec` to validate the output

### Mid-Pipeline Entry
- **Already have a product defined?** Start at `/idd:define-intentions`
- **Have intentions but need expectations?** Start at `/idd:define-expectations`
- **Have expectations and need a spec?** Start at `/idd:write-spec`
- **Have a spec that needs review?** Start at `/idd:tech-review`
- **Have AI output to validate?** Start at `/idd:review-spec`

## Initialization

Before first use, run the init script to create the docs directory structure:

```bash
bash ${CLAUDE_PLUGIN_ROOT}/scripts/init-idd.sh
```

This creates:
```
docs/
├── products/
├── intentions/
├── expectations/
├── specs/
└── reviews/
```

## The Artifact Hierarchy

### Product (Stable, Rarely Changes)
- Defines the business problem, audience, value proposition
- Sets the technical context inherited by all Specs
- Template: `references/product-template.md`

### Intention (Outcome-Oriented)
- What the Product should accomplish
- Focus on outcomes, not implementation
- Template: `references/intention-template.md`

### Expectation (Verifiable)
- How we know an Intention is fulfilled
- Must have validation criteria and minimum 2 edge cases
- Template: `references/expectation-template.md`

### Spec (AI-Ready)
- Everything an AI agent needs to execute
- Five mandatory blocks: Context, Expectations, Boundaries, Deliverables, Validation
- Template: `references/spec-template.md`
- Authoring guide: `references/spec-authoring-guide.md`

## Roles

IDD defines six roles. See `references/roles-reference.md` for details:

- **Product Owner** — Defines Products and Intentions; validates outcomes
- **Spec Author** — Translates Intentions into AI-ready Specs (new role)
- **Tech Lead** — Reviews for architectural fit; manages Boundaries
- **Developer** — Partners with AI agents; makes autonomous decisions within Spec context
- **AI Agent** — Executes against Specs; produces Deliverables
- **Reviewer** — Validates output against Expectations and Boundaries

## Key Principles

1. **Context is inherited.** Product-level context flows down to all Specs. Only override what's different.
2. **Edge cases are mandatory.** Minimum 2 per Expectation. AI builds the happy path well; quality lives in edge cases.
3. **Boundaries prevent scope creep.** Without explicit boundaries, AI agents modify anything they want.
4. **Specs must be self-contained.** If an AI agent needs to guess, the Spec is incomplete.
5. **Each command stands alone.** Users don't have to run the full pipeline.

## Artifact Path Conventions

All artifacts are relative to the project root:

```
docs/
├── products/
│   └── PROD-001.yaml
├── intentions/
│   └── INT-001.yaml
├── expectations/
│   └── EXP-001.yaml
├── specs/
│   └── SPEC-001.yaml
└── reviews/
    └── SPEC-001-review.md
```

## Reference Files

- **`references/product-template.md`** — Product artifact YAML template with field descriptions
- **`references/intention-template.md`** — Intention artifact YAML template
- **`references/expectation-template.md`** — Expectation artifact YAML template with edge case guidance
- **`references/spec-template.md`** — Spec artifact YAML template with all 5 mandatory blocks
- **`references/spec-authoring-guide.md`** — Best practices for writing AI-ready Specs
- **`references/roles-reference.md`** — Role definitions and responsibilities
