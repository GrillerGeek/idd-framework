# AGENTS.md — Intent-Driven Development Framework

This file provides AI coding agents with the knowledge needed to create, use, and validate IDD artifacts. It is the universal reference — agent-specific config files (CLAUDE.md, `.cursor/rules/`, `.github/copilot-instructions.md`) extend it with tool-specific details.

For full documentation, see `docs/framework.md`. For the philosophy behind IDD, see `docs/autonomy.md`.

---

## What Is IDD?

Intent-Driven Development replaces agile's work-decomposition (Epic > Feature > Story) with purpose-decomposition. Each layer provides the context developers and AI agents need to make implementation decisions autonomously.

## Artifact Hierarchy

```
Product (PROD-a3f8)  →  Why does this exist?
  └─ Intention (INT-7c21)  →  What should it accomplish?
      └─ Expectation (EXP-9b04)  →  How do we know it's right?
          └─ Spec (SPEC-d12e)  →  How does AI build it?
```

IDs are short random hashes (e.g., `PROD-a3f8`) — typically 4 hex characters, extending to 6 or 8 if a collision is detected at generation time. Use `idd-next-id <type>` to generate a new ID; the script guarantees uniqueness against existing artifacts. IDs are immutable once assigned.

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
  id: "PROD-a3f8"                 # run `idd-next-id product`; or generate a random 4-char hex suffix — never sequential
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
  id: "INT-7c21"                  # run `idd-next-id intention`; or generate a random 4-char hex suffix — never sequential
  product: "PROD-a3f8"             # Parent Product
  statement: ""                   # What should the product accomplish? (outcome, not task)
  rationale: ""                   # Why does this Intention matter?
  priority: ""                    # critical | high | medium | low
  dependencies: []                # Other Intention IDs that must be fulfilled first
  expectations: []                # Expectation IDs that belong to this Intention
  owner: ""
  status: "draft"                 # draft | defined | in-progress | fulfilled | deferred
```

### Expectation

```yaml
expectation:
  id: "EXP-9b04"                  # run `idd-next-id expectation`; or generate a random 4-char hex suffix — never sequential
  intention: "INT-7c21"            # Parent Intention
  description: ""                 # What must be true when this is met?
  validation_criteria: ""         # How to verify: pass/fail or measurable
  edge_cases:                     # MINIMUM 2 REQUIRED
    - ""                          # Boundary condition 1
    - ""                          # Boundary condition 2
  complexity: ""                  # low | medium | high (risk indicator, not effort)
  owner: ""
  status: "draft"                 # draft | ready | specced | validated | done | deferred
  deferred_reason: ""             # optional: required when status is "deferred"; explain why and when it will be revisited
```

### Spec (The Unit of Work)

Every Spec has **five mandatory blocks**. A Spec cannot be marked Ready until all five are complete.

```yaml
spec:
  id: "SPEC-d12e"                 # run `idd-next-id spec`; or generate a random 4-char hex suffix — never sequential
  product: ""                     # Parent Product name or ID
  intentions: []                  # Intention IDs this Spec addresses
  expectations: []                # Linked Expectation IDs this Spec implements
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

  # BLOCK 2: EXPECTATIONS DETAIL — embedded detail objects for the linked Expectation IDs
  expectations_detail:
    - id: "EXP-9b04"
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

5. **Specs should be focused.** Prefer Specs that address a cohesive set of Expectations. If a Spec covers an entire feature with unrelated concerns, split it. Tightly-coupled deliverables can stay together.

6. **IDs are random short hashes.** Use `idd-next-id <type>` (in `plugin/bin/`) to generate a new ID — it produces a 4-hex-char suffix like `SPEC-a3f8` and ensures uniqueness against existing files in the working tree. IDs are immutable once assigned. Pre-existing sequential IDs in the form `SPEC-001`, `INT-002`, etc. remain valid; mixed format is supported indefinitely.

7. **Status lifecycle.** Artifacts progress through their status values in order. Don't skip states.

## Workflow Phases

The IDD workflow has 8 phases. You can enter at any phase:

| Phase | Input | Output | Directory |
|-------|-------|--------|-----------|
| 1. Interview | Stakeholder conversation | Product YAML | `docs/products/` |
| 2. Intentions | Product artifact | Intention YAMLs | `docs/intentions/` |
| 3. Expectations | Intention artifact | Expectation YAMLs | `docs/expectations/` |
| 4. Spec | Expectation artifacts | Spec YAML | `docs/specs/` |
| 5. Tech Review | Spec artifact | Review annotations | Updates spec in `docs/specs/` |
| 6. Gap-Check | Spec artifact | Gap-check report + `gap_check` annotation | `docs/reviews/` + annotation in `docs/specs/` |
| 7. Implementation | Gated Spec | Deliverables + Execution Report | Codebase + `docs/reviews/` |
| 8. Validation | Spec + implementation | Validation report | `docs/reviews/` |

### The Gap-Check Gate (Phase 6)

Before execution, every Spec passes an adversarial gap-check: a reviewing agent simulates being the implementing agent and reports every point where it would have to guess — ambiguous Expectations, contradictions between blocks, filler edge cases, vague Context, unverifiable validation criteria. Findings are classified **Blocker** (implementations would diverge wrongly) or **Warning** (implementations would be inconsistent). The completeness checklist (items 1–10; item 11, peer review, is a human fact outside the gate) is a machine-verifiable *precondition* — the gap-check attacks content, not presence.

Rules: the gap-checker is report-only and never edits the Spec's content blocks; gaps are fixed in the Spec by its author, never improvised around; a Spec with unresolved Blockers cannot proceed to execution. Results are recorded in an additive, optional `gap_check` annotation on the Spec:

```yaml
  gap_check:                      # optional; written by orchestration after a gap-check run
    status: "passed"              # passed | blocked | warnings
    blockers: 0
    warnings: 0
    report: "docs/reviews/<spec-id>-gap-check.md"
    date: "YYYY-MM-DD"
```

Pre-existing Specs without this field remain valid.

**Coverage analysis.** In addition to the adversarial content check, the gap-check stage performs an omission sweep. The reviewing agent derives each Spec's *impact surface* — the set of repository files that reference the concepts, terms, or file names that the Deliverables change — and reports every impact-surface file owned by no Deliverable as a candidate omission. The impact surface excludes the artifact YAML trees (which legitimately reference the changed concepts) but includes `templates/` and `examples/`. Omissions are reported as **Warning** by default; the only **Blocker** path is when an Expectation's validation criteria depend on a file no Deliverable owns. Deliberate scoping is legitimate — the disposition field (`add-to-deliverables`, `assign-to-<spec-id>`, or `accept-omission`) lets the Spec Author record the decision. The `## Coverage` section is mandatory in every gap-check report even when no omissions are found — its absence is a schema violation. When multiple Specs are gap-checked together (portfolio mode), the omission sweep runs against the union of all Deliverables and the results are saved to a combined portfolio coverage report; files owned by any Spec in the set are not omissions, and files owned by two or more Specs are flagged as CONFLICT findings (Warning) in the portfolio report only.

### Managed Execution (Phase 7)

The implementing agent executes a gated Spec under a fixed protocol: (1) confirm the Spec is ready with `gap_check.status: passed`; (2) restate every Boundary verbatim before the first file modification; (3) implement within Context and Boundaries — if a gap is found mid-build, apply the blocker-grade test (would alternative resolutions change validation outcomes, cross a Boundary, or change a Deliverable's shape?): blocker-grade → stop and report; minor → best-effort choice, documented; (4) self-verify with a table covering every edge case, Boundary, and Deliverable; (5) emit an **Execution Report** to `docs/reviews/` with a mandatory `spec_gaps_encountered` section — the signal that feeds future Spec quality. Status transitions (`ready → in-progress → review`) belong to the orchestration layer, not the implementing agent.

### Accelerated Workflows

Phases 2-4 can be combined for faster iteration:

- **Outcomes (phases 2+3):** Define Intentions and Expectations together in one session.
- **Quick Spec (phases 2+3+4):** Produce Intentions, Expectations, and a Spec in one session from a Product ID and feature description.
- **Deep Review (alternative phase 5):** Multi-perspective review covering architecture, boundaries/edge cases, and deliverables/validation in parallel.

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
