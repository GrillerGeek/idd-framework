# IDD Framework Plugin for Claude Code

A Claude Code plugin that automates the [Intent-Driven Development](https://github.com/GrillerGeek/idd-framework) workflow with role-specific tools for stakeholder interviews, artifact generation, and structured documentation.

## Installation

**Option 1: Via the GrillerGeek marketplace** (recommended)

```bash
claude plugin marketplace add https://github.com/GrillerGeek/skills.git
claude plugin install idd-framework
```

**Option 2: Local testing**

```bash
git clone https://github.com/GrillerGeek/idd-framework.git
claude --plugin-dir ./idd-framework/plugin
```

## What Is IDD?

Intent-Driven Development replaces traditional sprint-based agile with a "chain of context" model designed for AI-augmented teams. It decomposes purpose into four levels:

```
Product          ->  "Here's why this exists and who it's for."
  Intention      ->  "Here's what we're trying to accomplish and why it matters."
    Expectation  ->  "Here's how we'll know it's right, including the edge cases."
      Spec       ->  "Here's everything you need to build it."
```

Each layer gives developers and AI agents the context they need to make implementation decisions independently.

## Commands

| Command | Purpose | Artifact |
|---------|---------|----------|
| `/idd:interview` | Conduct a stakeholder interview | Product definition in `docs/products/` |
| `/idd:define-intentions` | Decompose a Product into outcomes | Intentions in `docs/intentions/` |
| `/idd:define-expectations` | Define verifiable constraints with edge cases | Expectations in `docs/expectations/` |
| `/idd:write-spec` | Create an AI-ready Spec with all 5 mandatory blocks | Spec in `docs/specs/` |
| `/idd:tech-review` | Review a Spec for architectural feasibility | Review annotations on Spec |
| `/idd:review-spec` | Validate AI output against Spec criteria | Validation report in `docs/reviews/` |

Each command can be used independently. You don't have to run the full pipeline.

## Agents

| Agent | Role | Color |
|-------|------|-------|
| **idd-product-interviewer** | Interviews stakeholders to capture Product artifacts | Blue |
| **idd-intention-author** | Guides decomposition of Products into testable Intentions | Green |
| **idd-expectation-author** | Defines verifiable Expectations with edge cases | Yellow |
| **idd-spec-author** | Creates AI-ready Specs with Context, Expectations, Boundaries, Deliverables, Validation | Cyan |
| **idd-tech-lead-reviewer** | Reviews Specs for architectural feasibility and pattern compliance | Magenta |
| **idd-spec-reviewer** | Validates AI output against Spec Expectations and Boundaries | Red |

## Quick Start

1. **Define your product:**
   ```
   /idd:interview My Dashboard Project
   ```

2. **Break it into intentions:**
   ```
   /idd:define-intentions PROD-001
   ```

3. **Define expectations with edge cases:**
   ```
   /idd:define-expectations INT-001
   ```

4. **Write the spec:**
   ```
   /idd:write-spec EXP-001 EXP-002
   ```

5. **Review for architectural fit:**
   ```
   /idd:tech-review SPEC-001
   ```

6. **After AI builds the code, validate:**
   ```
   /idd:review-spec SPEC-001
   ```

## Output

All artifacts are saved to `docs/` in your project root:

```
docs/
  products/       # Product definitions (YAML)
  intentions/     # Intention artifacts (YAML)
  expectations/   # Expectation artifacts with edge cases (YAML)
  specs/          # AI-ready Specs with 5 mandatory blocks (YAML)
  reviews/        # Validation reports (Markdown)
```

## IDD Roles

The framework defines six roles. Each maps to a plugin agent:

- **Product Owner** -- Defines Products and Intentions; validates outcomes
- **Spec Author** -- Translates Intentions into AI-ready Specs (new role in IDD)
- **Tech Lead** -- Reviews for architectural fit; manages Boundaries
- **Developer** -- Partners with AI agents; makes autonomous decisions within Spec context
- **AI Agent** -- Executes against Specs; produces Deliverables
- **Reviewer** -- Validates output against Expectations and Boundaries

## License

Apache 2.0 -- see [LICENSE](LICENSE).
