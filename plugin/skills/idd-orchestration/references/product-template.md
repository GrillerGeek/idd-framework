# Product Template

The Product is the highest-level artifact in IDD. It defines the business problem, target audience, value proposition, and strategic alignment. Products are stable and rarely change.

## Template

```yaml
product:
  id: "PROD-000"
  name: ""                           # Working product name
  status: "discovery"                # discovery | active | maintenance | sunset
  owner: ""                          # Accountable individual

  # PROBLEM STATEMENT — what business problem does this solve?
  problem_statement: ""

  # TARGET AUDIENCE — who benefits from this product?
  target_audience: ""

  # VALUE PROPOSITION — why does this product matter?
  value_proposition: ""

  # STRATEGIC ALIGNMENT — which organizational priorities does this serve?
  strategic_alignment: ""

  # CONTEXT — inherited by all child Specs
  context:
    stack: ""
    patterns: ""
    conventions:
      - ""
    auth: ""
```

## Field Descriptions

| Field | Required | Description |
|-------|----------|-------------|
| `id` | Yes | Unique identifier (e.g., PROD-001) |
| `name` | Yes | Working product name |
| `status` | Yes | Lifecycle state: discovery, active, maintenance, sunset |
| `owner` | Yes | Accountable individual (named person) |
| `problem_statement` | Yes | The business problem this product solves |
| `target_audience` | Yes | Who benefits from this product |
| `value_proposition` | Yes | Why this product matters to the organization |
| `strategic_alignment` | Yes | Which organizational priorities this serves |
| `context` | Recommended | Tech stack, patterns, conventions, and auth — inherited by all child Specs |

## Guidance

- **Focus on the problem, not the solution.** The problem statement should describe the pain, not the fix.
- **Be specific about the audience.** "All users" is too broad. Name roles, teams, or persona types.
- **Value proposition should be measurable.** "Improves efficiency" is weak. "Reduces onboarding time from 3 weeks to 1 week" is strong.
- **Context is inherited.** Define it once here; Specs inherit and override as needed.
- **Products are stable.** If you're changing the Product frequently, the scope is probably too narrow (that's an Intention).

## Status Lifecycle

```
discovery → active → maintenance → sunset
```

- **Discovery:** Problem validated, solution being explored
- **Active:** Product is being built or enhanced
- **Maintenance:** Stable, only bug fixes and minor updates
- **Sunset:** Being decommissioned
