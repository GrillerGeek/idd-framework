# Intention Template

An Intention describes what the Product should accomplish. It focuses on outcomes, not implementation. Intentions should be testable at a conceptual level — you should be able to ask "can we demonstrate this Intention is fulfilled?"

## Template

```yaml
intention:
  id: "INT-000"
  product: "PROD-000"               # Parent Product
  statement: ""                      # What should the product accomplish?
  rationale: ""                      # Why does this Intention matter?
  priority: ""                       # critical | high | medium | low
  dependencies: []                   # Other Intention IDs that must be fulfilled first
  owner: ""                          # Accountable individual
  status: "draft"                    # draft | defined | in-progress | fulfilled | deferred
```

## Field Descriptions

| Field | Required | Description |
|-------|----------|-------------|
| `id` | Yes | Unique identifier scoped to Product (e.g., INT-001) |
| `product` | Yes | Parent Product ID |
| `statement` | Yes | What the product should accomplish — outcome-oriented |
| `rationale` | Yes | Why this Intention matters to the Product |
| `priority` | Yes | critical, high, medium, or low |
| `dependencies` | No | Other Intention IDs that must be fulfilled first |
| `owner` | Yes | Person accountable for this Intention |
| `status` | Yes | Current state in the lifecycle |

## Writing Good Intentions

- **Focus on outcomes, not implementation.** Say "users can view health scores" not "build a React dashboard component."
- **Each Intention should be independently demonstrable.** If you can't show it working in isolation, it may be too coupled.
- **Avoid compound Intentions.** "Users can view scores AND export reports" should be two Intentions.
- **Include rationale.** Intentions without a clear "why" survive longer than they should.
- **Prioritize honestly.** If everything is "critical," nothing is.

## Status Lifecycle

```
draft → defined → in-progress → fulfilled
                               → deferred
```

## Examples

**Good:** "HR can define and manage onboarding checklist templates that automatically create task lists for each new hire."

**Bad:** "Build the checklist CRUD page with React and REST API."

The good example focuses on the outcome (HR can manage templates). The bad example prescribes implementation.
