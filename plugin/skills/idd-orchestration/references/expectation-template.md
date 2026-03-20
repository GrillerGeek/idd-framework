# Expectation Template

An Expectation is a verifiable constraint that makes an Intention concrete. Every Expectation must have validation criteria and at least 2 edge cases. Edge cases are where quality lives — AI agents build the happy path well, but edge cases prevent bugs.

## Template

```yaml
expectation:
  id: "EXP-000"
  intention: "INT-000"               # Parent Intention
  description: ""                    # What must be true when this Expectation is met?
  validation_criteria: ""            # How to verify: pass/fail or measurable
  edge_cases:                        # Minimum 2 required
    - ""                             # Boundary condition 1
    - ""                             # Boundary condition 2
  complexity: ""                     # low | medium | high (risk indicator, not effort)
  owner: ""                          # Accountable individual
  status: "draft"                    # draft | ready | specced | validated | done
```

## Field Descriptions

| Field | Required | Description |
|-------|----------|-------------|
| `id` | Yes | Unique identifier scoped to Intention (e.g., EXP-001) |
| `intention` | Yes | Parent Intention ID |
| `description` | Yes | What must be true when this Expectation is met |
| `validation_criteria` | Yes | How to verify — must be pass/fail or measurable |
| `edge_cases` | Yes | Boundary conditions (minimum 2) |
| `complexity` | Yes | low, medium, or high — a risk indicator, not effort estimate |
| `owner` | Yes | Person accountable |
| `status` | Yes | Current state in the lifecycle |

## Edge Case Guidance

Every Expectation needs at least 2 edge cases. Think about:

- **Boundary values:** What happens at min/max? At zero? At the limit?
- **Empty/null states:** What happens with no data? Missing fields?
- **Error conditions:** What happens when the external dependency fails?
- **Concurrent access:** What if two users do this at the same time?
- **Role boundaries:** What if someone without permission tries this?

### Do vs. Don't

| Do | Don't |
|----|-------|
| "Score on boundary (40, 70) → include in higher band" | "Handle edge cases appropriately" |
| "No data for customer → show 'Insufficient Data' state" | "Handle errors" |
| "Template modified after instantiation → existing checklists not affected" | "Make it work correctly" |

## Status Lifecycle

```
draft → ready → specced → validated → done
```

- **Draft:** Being authored
- **Ready:** Validation criteria and edge cases complete
- **Specced:** Included in a Spec
- **Validated:** Verified against criteria
- **Done:** Accepted by Product Owner
