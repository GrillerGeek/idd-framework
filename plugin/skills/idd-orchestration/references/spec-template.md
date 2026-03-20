# Spec Template

The Spec is the most important artifact in IDD. It translates human-authored Expectations into structured instructions an AI coding agent can execute. Every Spec must contain five mandatory blocks: Context, Expectations, Boundaries, Deliverables, and Validation.

## Template

```yaml
spec:
  id: "SPEC-000"
  product: ""                        # Parent Product name or ID
  intentions: []                     # List of Intention IDs this Spec addresses
  expectations: []                   # List of Expectation IDs this Spec implements
  status: "draft"                    # draft | ready | in-progress | review | validating | done

  # CONTEXT — everything the AI agent needs to know about your project
  context:
    stack: ""                        # Languages, frameworks, databases, versions
    patterns: ""                     # Architectural patterns (e.g., CQRS, MVC, vertical slice)
    conventions:                     # Coding standards and project-specific rules
      - ""
    existing_code_refs:              # Files or folders the AI should reference or follow
      - path: ""
        note: ""
    auth: ""                         # Authentication/authorization model

  # EXPECTATIONS — what must be true when this Spec is complete
  expectations:
    - id: ""
      description: ""                # What must be true
      validation: ""                 # How to verify (pass/fail or measurable)
      edge_cases:
        - ""
        - ""

  # BOUNDARIES — what the AI must NOT do
  boundaries:
    - ""

  # DELIVERABLES — concrete outputs the AI should produce
  deliverables:
    - ""

  # VALIDATION — how to verify the Spec is complete
  validation:
    automated:                       # Things tests can verify
      - ""
    human_review:                    # Things humans must evaluate
      - ""
```

## The Five Mandatory Blocks

### 1. Context
Everything the AI agent needs to know about your project. Inherited from the Product level; override only what's different for this Spec.

**Must include:** stack with versions, architectural patterns, coding conventions, auth model, references to existing code.

### 2. Expectations
What must be true when the Spec is complete. Each Expectation needs: description, validation criteria, and at least 2 edge cases.

### 3. Boundaries
What the AI must NOT do. Without boundaries, AI agents will modify files you didn't want touched, add unapproved dependencies, and implement adjacent features.

### 4. Deliverables
Concrete outputs the AI should produce. If it's not listed, the AI may not produce it.

### 5. Validation
How to verify the Spec is complete. Split into automated (tests, contract checks) and human review (UX, architecture, data accuracy).

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
- [ ] Spec has been peer-reviewed by at least one other person

## Status Lifecycle

```
draft → ready → in-progress → review → validating → done
```
