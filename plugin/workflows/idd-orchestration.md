---
name: idd-orchestration
license: Apache-2.0
description: Select and run an Intent-Driven Development workflow from product discovery through authoring, review, implementation, exploration and archival. Use when starting IDD or choosing the next IDD stage.
---

# Choose an IDD workflow

IDD connects Product purpose to Intentions, measurable Expectations and a buildable
Spec. Start at the stage the user needs. Resolve this router's installed directory
from its loaded SKILL.md path; every stage below is included in this installation.

Use the user's supplied stage, scope, artifact IDs and confirmed context. Inspect
only relevant existing project artifacts or the archive ledger to resolve names
and prerequisites. Do not create directories or scratch files just to discover or
route. If the next stage is ambiguous, ask one focused question in the current
conversation. Do not restart an interview or invent missing stakeholder answers.

Load the selected **complete workflow.md**, then its required local references,
before acting. Its parent directory is that stage's bundle root: resolve its
relative templates, scripts, vendor files and license from there, not from the
router root. Installed resources are read-only; no sibling skill, global helper
or plugin-root environment variable is required. Preserve a route-only request:
explain the choice and required context, then stop before authoring or execution.

| User outcome | Complete local stage |
|---|---|
| Map uncertainty before product discovery | [Chart](stages/chart/workflow.md) |
| Resolve one Exploration decision | [Resolve](stages/resolve/workflow.md) |
| Define a Product with stakeholders | [Interview](stages/interview/workflow.md) |
| Define outcomes for an existing Product | [Intentions](stages/define-intentions/workflow.md) |
| Define measurable criteria for an Intention | [Expectations](stages/define-expectations/workflow.md) |
| Define Intentions and Expectations together | [Combined outcomes](stages/define-outcomes/workflow.md) |
| Create Intentions, Expectations and a Spec together | [Quick Spec](stages/quick-spec/workflow.md) |
| Build a Spec from existing Expectations | [Write Spec](stages/write-spec/workflow.md) |
| Assess technical feasibility | [Technical review](stages/tech-review/workflow.md) |
| Review architecture, boundaries and validation from multiple perspectives | [Deep review](stages/deep-review/workflow.md) |
| Find pre-execution content and coverage gaps | [Gap-check](stages/gap-check/workflow.md) |
| Implement a ready, cleanly gated Spec | [Implementation](stages/implement-spec/workflow.md) |
| Validate the implementation against a Spec | [Validation](stages/review-spec/workflow.md) |
| Launch the Forge artifact browser | [Forge](stages/forge/workflow.md) |
| Classify or explicitly apply reviewed archival | [Archive](stages/archive/workflow.md) |

The selected procedure owns confirmation, lifecycle, safe input checks, mutations
and reports. Routing itself grants no approval. Missing or ungated Specs receive
a truthful prerequisite refusal without setup writes or fabricated gate evidence.
Human peer review, implementation approval and archival apply approval remain
actual decisions. Keep stakeholder questions and authoritative writes in the main
conversation; use only genuinely available worker capabilities and the selected
procedure's ownership rules. Report capability limitations without inventing
model dispatch or successful tool calls.

The nested implementation stage includes its terminal controller at
[the bundled CLI](stages/implement-spec/scripts/idd-execute-spec.mjs). Its entry
is workflow.md within that stage root. Follow its complete execution and
nested-session rules; never start a nested controller by clearing a guard.

Historical reference paths remain available for existing consumers:
[Product](references/product-template.md),
[Intention](references/intention-template.md),
[Expectation](references/expectation-template.md),
[Spec](references/spec-reference.md),
[Exploration](references/exploration-template.md), and
[Archive ledger](references/ledger-reference.md).
