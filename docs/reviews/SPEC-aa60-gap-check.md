PASS — 0 blockers, 0 warnings

# Native distribution gap-check — SPEC-aa60

Initial independent review hash: 75b76c1ddb948b8c69b16567e11b00973ddea37b7e4bf11bb86244669cfd39ef. Completeness1–10 and linked parity pass; actual human review pending. Initial finding history is retained below. Fresh independent review passed all corrections at hash b7ed40eead7f890e1e4651d8dc3b59de83c0ed25374fd10d4989f08a83887ca7 before orchestration annotation. Completeness1–10, linked parity and all17 coverage dispositions pass; human review and accepted Router commit remain prerequisites.

## Findings

GC-1, Blocker, metadata/Deliverables/Validation: the original contract required skills in the portable root and omitted mandatory $schema. Current portable schema rejects that root field and discovers fixed skills/. Author revision now specifies separate exact portable versus compatibility field sets and validation, resolved by fresh independent recheck. Sources: [portable schema](https://agent-plugins.org/schemas/1.0.0/plugin.schema.json), [OpenAI packaging](https://developers.openai.com/plugins/build/plugins).

Twelve coverage Warnings received explicit reasoned author accept-omission dispositions below, resolved by independent recheck. Implementation remains prohibited before accepted Router commit; the fresh clean gate is recorded here.

Author notes applied: only child-process configuration overrides, separate Git/XDG state, explicit Claude project scope, unrelated plugin in its own retained marketplace. These clarify preservation requirements rather than waive actual native testing.

## Coverage

All seventeen candidates are independently resolved. Templates/examples/hidden entry points included; artifact/review trees excluded.

| File | Evidence | Severity | Author disposition | Resolution |
|---|---|---|---|---|
| CLAUDE.md | guide link | Warning | accept-omission; preserved delegation/behavior/history | Independently resolved; no unmet dependency |
| AGENTS.md | guide link | Warning | accept-omission; preserved delegation/behavior/history | Independently resolved; no unmet dependency |
| package.json | existing check entry | Warning | accept-omission; preserved delegation/behavior/history | Independently resolved; no unmet dependency |
| plugin/workflows/forge.md | native plugin limit | Warning | accept-omission; preserved delegation/behavior/history | Independently resolved; no unmet dependency |
| plugin/skills/idd-forge/SKILL.md | generated limit | Warning | accept-omission; preserved delegation/behavior/history | Independently resolved; no unmet dependency |
| CONTRIBUTING.md | linked guide, existing validator API, fixture or dated history | Warning | accept-omission; preserved delegation/behavior/history | Independently resolved; no unmet dependency |
| .github/pull_request_template.md | linked guide, existing validator API, fixture or dated history | Warning | accept-omission; preserved delegation/behavior/history | Independently resolved; no unmet dependency |
| .github/copilot-instructions.md | linked guide, existing validator API, fixture or dated history | Warning | accept-omission; preserved delegation/behavior/history | Independently resolved; no unmet dependency |
| .cursor/rules/idd.mdc | linked guide, existing validator API, fixture or dated history | Warning | accept-omission; preserved delegation/behavior/history | Independently resolved; no unmet dependency |
| tests/pilot.test.mjs | linked guide, existing validator API, fixture or dated history | Warning | accept-omission; preserved delegation/behavior/history | Independently resolved; no unmet dependency |
| tests/assembly.test.mjs | linked guide, existing validator API, fixture or dated history | Warning | accept-omission; preserved delegation/behavior/history | Independently resolved; no unmet dependency |
| tests/helpers/archive-workflows.mjs | linked guide, existing validator API, fixture or dated history | Warning | accept-omission; preserved delegation/behavior/history | Independently resolved; no unmet dependency |
| docs/superpowers/plans/2026-07-28-exploration-phase-0.md | linked guide, existing validator API, fixture or dated history | Warning | accept-omission; preserved delegation/behavior/history | Independently resolved; no unmet dependency |
| docs/plans/2026-09-12-codex-skills-migration.md | linked guide, existing validator API, fixture or dated history | Warning | accept-omission; preserved delegation/behavior/history | Independently resolved; no unmet dependency |
| docs/plans/2026-09-12-claude-checkpoint-recovery.md | linked guide, existing validator API, fixture or dated history | Warning | accept-omission; preserved delegation/behavior/history | Independently resolved; no unmet dependency |
| docs/plans/2026-09-13-router-distribution-assessment.md | linked guide, existing validator API, fixture or dated history | Warning | accept-omission; preserved delegation/behavior/history | Independently resolved; no unmet dependency |
| docs/plans/2026-09-13-remaining-workflow-assessment.md | linked guide, existing validator API, fixture or dated history | Warning | accept-omission; preserved delegation/behavior/history | Independently resolved; no unmet dependency |

## Fresh review disposition

Distinct portable/compatibility field sets, required Read/Write capabilities, exact child-process isolation, only supported scope flags and separate retained unrelated marketplace passed. All17 coverage candidates are resolved with no unmet validation dependencies. No implementation or actual native lifecycle success is inferred from this authoring gate.

## Fresh scheduling recovery gate

PASS — 0 blockers, 0 warnings. Independent reviewer: checkpoint_contract_review; September 13, 2026. Freshly reread Spec SHA-256 before gate annotation: `8ea2f2a62d67c6c87a0ace7071824c1a95c56ae46155f1d1cff36c1d82d4f434`. Completeness items 1–10, both linked Expectation/detail comparisons and parent membership pass. Actual human peer review remains pending.

Boundary 1, distribution_contract.integration and migration_authorization.scope now consistently permit implementation only after a committed Router source checkpoint with passing offline, installation and all five required host observations. Native packaging consumes frozen generated bytes while remaining required Archive evaluation and upstream report/lifecycle closure continue. This scheduling revision supersedes the earlier accepted-Router-commit implementation prerequisite; it does not declare either upstream Spec accepted.

One canonical source/catalog writer remains. A required upstream production change pauses affected native integration until canonical and generated bytes are reconciled and reverified. Native owns its current installation guides; upstream closure records milestone evidence without concurrently rewriting those guides. Final Native review still requires full Archive and Router acceptance plus both closure commits. Native isolation, preservation, actual lifecycle observations and all other acceptance requirements remain unchanged.

### Coverage of the scheduling revision

All 17 existing candidate omissions remain visible above, exist in the repository and match explicit reasoned accept-omission dispositions. Their unchanged guide delegation, validator APIs, direct behavior and historical references retain no unmet validation dependency. The scheduling impact adds only current contributor guidance already owned by Native Deliverables and migration tracking separately owned by orchestration. No new unowned impact-surface file or unresolved omission was found.

This is a content/coverage gate. It does not certify a checkpoint commit, actual native installation or pending upstream acceptance, and does not invent human approval or change lifecycle status.
