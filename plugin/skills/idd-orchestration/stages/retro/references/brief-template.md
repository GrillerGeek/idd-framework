# Product brief template

The brief is the readable handoff for a Product: what a developer, tech lead or
build team reads before writing or executing Specs. It is **rendered from the
YAML artifacts**; the YAML stays canonical.

## Rules

- Path: `docs/products/<Product YAML filename without .yaml>.md`, beside the
  Product YAML.
- Render only from saved, validated artifacts: the Product and its live
  Intentions and Expectations. Never add facts that are not in them.
- Re-render after every successful save that changes the Product or one of its
  Intentions or Expectations. Overwrite only a brief that carries the generated
  header below; if a file at the path lacks it, stop and ask rather than
  overwrite someone's document.
- Nobody edits the brief by hand. Corrections are requested in conversation,
  saved to the YAML, and the brief is re-rendered.
- When the host offers a document publishing capability, you may offer to
  publish the rendered brief there as well. The repository file remains the
  source others build from.

## Skeleton

```markdown
<!-- Generated from <product yaml path> and its live Intentions/Expectations on <YYYY-MM-DD>. Do not edit; ask for changes and re-render. -->
# <Product name> (<PROD-id>)

**Status:** <status> · **Owner:** <owner>

## Problem
<problem_statement>

## Who it serves
<target_audience>

## Value
<value_proposition>

## Strategic alignment
<strategic_alignment>

## Vocabulary
| Term | Meaning | Avoid |
|---|---|---|
| <term> | <definition> | <avoid, comma-separated> |

## Decisions
- **<D-id>** <decision> — <decided_by>, <decided_at>
  - Alternatives: <alternatives> · Why: <rationale>   (full entries only)

## Outcomes
### <INT-id> — <statement> (<priority>, <status>)
<rationale>

#### <EXP-id> — <description> (<status>)
- **Passes when:** <validation_criteria>
- **Edge cases:**
  - <edge case>

## Technical context (inherited by Specs)
- **Stack:** <context.stack>
- **Patterns:** <context.patterns>
- **Conventions:** <context.conventions>
- **Auth:** <context.auth>

## Open questions
### Needs tech lead
- **<Q-id>** <question> (affects: <relates_to or "whole Product">)
### Needs stakeholder
- **<Q-id>** <question> (affects: <relates_to or "whole Product">)
```

Omit a section whose source list is empty, except **Open questions**: write
"None." so readers know nothing is pending.
