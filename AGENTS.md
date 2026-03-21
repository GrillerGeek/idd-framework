# AGENTS.md — Intent-Driven Development Framework

This file provides AI coding agents with the knowledge needed to create, use, and validate IDD artifacts. It is the universal reference — agent-specific config files (CLAUDE.md, .cursorrules, etc.) extend it with tool-specific details.

For full documentation, see `docs/framework.md`. For the philosophy behind IDD, see `docs/autonomy.md`.

---

## What Is IDD?

Intent-Driven Development replaces agile's work-decomposition (Epic > Feature > Story) with purpose-decomposition. Each layer provides the context developers and AI agents need to make implementation decisions autonomously.

## Artifact Hierarchy

```
Product (PROD-xxx)  →  Why does this exist?
  └─ Intention (INT-xxx)  →  What should it accomplish?
      └─ Expectation (EXP-xxx)  →  How do we know it's right?
          └─ Spec (SPEC-xxx)  →  How does AI build it?
```

IDs are sequential within their type (PROD-001, INT-001, EXP-001, SPEC-001). Check existing artifacts in `docs/` before assigning new IDs.

## Output Directories

All artifacts are saved as YAML files in the project's `docs/` directory:

```
docs/
  products/       # Product definitions
  intentions/     # Intention artifacts
  expectations/   # Expectations with edge cases
  specs/          # AI-ready Specs with 5 mandatory blocks
  reviews/        # Validation reports (Markdown)
```

Create these directories if they don't exist before saving artifacts.

## Artifact Schemas

### Product

```yaml
product:
  id: "PROD-001"
  name: ""                        # Working product name
  status: "discovery"             # discovery | active | maintenance | sunset
  owner: ""                       # Accountable individual
  problem_statement: ""           # What business problem does this solve?
  target_audience: ""             # Who benefits?
  value_proposition: ""           # Why does this matter?
  strategic_alignment: ""         # Which organizational priorities does this serve?
  context:                        # Inherited by all child Specs
    stack: ""                     # Languages, frameworks, databases, versions
    patterns: ""                  # Architectural patterns (e.g., CQRS, vertical slice)
    conventions:
      - ""                        # Coding standards and project-specific rules
    auth: ""                      # Authentication/authorization model
```

### Intention

```yaml
intention:
  id: "INT-001"
  product: "PROD-001"             # Parent Product
  statement: ""                   # What should the product accomplish? (outcome, not task)
  rationale: ""                   # Why does this Intention matter?
  priority: ""                    # critical | high | medium | low
  dependencies: []                # Other Intention IDs that must be fulfilled first
  owner: ""
  status: "draft"                 # draft | defined | in-progress | fulfilled | deferred
```

### Expectation

```yaml
expectation:
  id: "EXP-001"
  intention: "INT-001"            # Parent Intention
  description: ""                 # What must be true when this is met?
  validation_criteria: ""         # How to verify: pass/fail or measurable
  edge_cases:                     # MINIMUM 2 REQUIRED
    - ""                          # Boundary condition 1
    - ""                          # Boundary condition 2
  complexity: ""                  # low | medium | high (risk indicator, not effort)
  owner: ""
  status: "draft"                 # draft | ready | specced | validated | done
```

### Spec (The Unit of Work)

Every Spec has **five mandatory blocks**. A Spec cannot be marked Ready until all five are complete.

```yaml
spec:
  id: "SPEC-001"
  product: ""                     # Parent Product name or ID
  intentions: []                  # Intention IDs this Spec addresses
  expectations: []                # Expectation IDs this Spec implements
  status: "draft"                 # draft | ready | in-progress | review | validating | done

  # BLOCK 1: CONTEXT — what the AI agent needs to know
  context:
    stack: ""                     # Languages, frameworks, databases, versions
    patterns: ""                  # Architectural patterns in use
    conventions:                  # Coding standards and project-specific rules
      - ""
    existing_code_refs:           # Files or folders the AI should reference
      - path: ""
        note: ""
    auth: ""                      # Authentication/authorization model

  # BLOCK 2: EXPECTATIONS — what must be true when done
  expectations:
    - id: "EXP-001"
      description: ""             # Required behavior
      validation: ""              # Pass/fail or measurable criteria
      edge_cases:
        - ""                      # At least 2 per Expectation
        - ""

  # BLOCK 3: BOUNDARIES — what the AI must NOT do
  boundaries:
    - ""                          # Explicit prohibitions

  # BLOCK 4: DELIVERABLES — concrete outputs to produce
  deliverables:
    - ""                          # Every expected output listed

  # BLOCK 5: VALIDATION — how to verify completeness
  validation:
    automated:                    # Things tests can verify
      - ""
    human_review:                 # Things humans must evaluate
      - ""
```

## Completeness Checklist

A Spec cannot enter **Ready** status until every item passes:

- [ ] Context: stack is non-empty
- [ ] Context: patterns is non-empty
- [ ] Context: conventions has at least one entry
- [ ] Context: auth is non-empty
- [ ] At least one Expectation is linked
- [ ] All Expectations have validation criteria
- [ ] All Expectations have at least 2 edge cases
- [ ] Boundaries block has at least one entry
- [ ] Deliverables block has at least one entry
- [ ] Validation block has at least one automated and one human review item
- [ ] Spec has been peer-reviewed

## Rules When Generating Artifacts

1. **Edge cases are mandatory.** Minimum 2 per Expectation. AI agents build the happy path well — quality lives in edge cases.

2. **Boundaries are first-class.** Without explicit boundaries, AI agents will modify files you didn't want touched, add unapproved dependencies, and implement adjacent features out of scope. Write boundaries as clear prohibitions: "Do not modify any files in `/src/auth/`".

3. **Context inheritance.** Context is defined at the Product level and inherited by child Specs. Only override in a Spec when that Spec needs something different. Don't copy-paste the same context into every Spec.

4. **Intentions describe outcomes, not tasks.** "Users can see their health score" not "Build a health score component." Focus on what the product should accomplish, not what to build.

5. **Specs should be small.** Each Spec should produce 1-3 deliverables. If a Spec covers an entire feature, split it.

6. **IDs are sequential.** Check `docs/products/`, `docs/intentions/`, `docs/expectations/`, and `docs/specs/` for existing IDs before assigning new ones.

7. **Status lifecycle.** Artifacts progress through their status values in order. Don't skip states.

## Workflow Phases

The IDD workflow has 6 phases. You can enter at any phase:

| Phase | Input | Output | Directory |
|-------|-------|--------|-----------|
| 1. Interview | Stakeholder conversation | Product YAML | `docs/products/` |
| 2. Intentions | Product artifact | Intention YAMLs | `docs/intentions/` |
| 3. Expectations | Intention artifact | Expectation YAMLs | `docs/expectations/` |
| 4. Spec | Expectation artifacts | Spec YAML | `docs/specs/` |
| 5. Tech Review | Spec artifact | Review annotations | Updates spec in `docs/specs/` |
| 6. Validation | Spec + implementation | Validation report | `docs/reviews/` |

## YAML Templates

Copy-paste starter templates are in `templates/`:
- `templates/product-template.yaml`
- `templates/intention-template.yaml`
- `templates/expectation-template.yaml`
- `templates/spec-template.yaml`

## Further Reading

- `docs/framework.md` — Complete process definition (canonical reference)
- `docs/autonomy.md` — Core philosophy: how the hierarchy enables developer autonomy
- `docs/artifacts.md` — Detailed field-level definitions
- `docs/spec-authoring.md` — Spec writing guide with anti-patterns
- `docs/roles.md` — Role definitions (Product Owner, Spec Author, Tech Lead, Developer, AI Agent, Reviewer)
- `docs/metrics.md` — Process health metrics
- `examples/` — Worked examples using the full hierarchy
