PASS — 0 blockers, 33 warnings

# SPEC-bffd gap-check

Date: 2026-09-12
Spec: `docs/specs/SPEC-bffd.yaml`
Reviewed Spec SHA256: `f79b4ad8a07dae885dfda32fdd3582c0488c4c9c59a30d8a1546e6ab3bbb9ebb`

Completeness precondition: items 1–10 pass. Human peer approval is outside this review and is not established by this report. Orchestration's blocked sentinel was present before this review.

## Content findings

No unresolved content findings. The contract identifies the legacy-only production router exception, keeps existing output bytes and installed paths, defines preflight and nonmutating check behavior, separates live/template/fixture validation, and gives concrete helper and isolated-installer cases. Inspection of current hierarchy artifacts, template shapes, both helper scripts, the clean/flawed fixture roles and ledger identity schema found no contradiction requiring an implementation choice that changes a stated validation outcome or Boundary. Runtime dependencies, host behavior certification and real workflow portability are explicitly outside this foundation.

This is a content assessment of the Spec, not execution validation of tooling that has not been built. No package checks, installer tests or hosted CI outcomes are claimed here.

## Coverage

The sweep used Deliverable path basenames (including directory basenames such as `references`, `helpers`, and `lib`) and introduced/changed terms such as `MENTIONS`; matched whole tokens were used for generic words. It searched tracked repository text, including dotfiles, templates and examples, excluding the five artifact/review trees. Declared directory allowlists own their contained files. Broad directory-basename matches are retained as candidates even where their meaning is incidental. All 33 candidates below remain unresolved Warnings because the author has not yet supplied coverage dispositions; no candidate is an unmet validation dependency. Suggested acceptance is not recorded acceptance.

- **file:** `.cursor/rules/idd.mdc`
  **evidence:** `helpers` — found at line 8.
  **severity:** Warning
  **suggested disposition:** accept-omission (This entry point already delegates source ownership and runnable checks to the owned shared contributor guide; helper names and the linked conventions anchor remain stable.)

- **file:** `.github/copilot-instructions.md`
  **evidence:** `helpers` — found at line 3.
  **severity:** Warning
  **suggested disposition:** accept-omission (This entry point already delegates source ownership and runnable checks to the owned shared contributor guide; helper names and the linked conventions anchor remain stable.)

- **file:** `.github/pull_request_template.md`
  **evidence:** `contributing-agents.md` — found at line 15.
  **severity:** Warning
  **suggested disposition:** accept-omission (This entry point already delegates source ownership and runnable checks to the owned shared contributor guide; helper names and the linked conventions anchor remain stable.)

- **file:** `AGENTS.md`
  **evidence:** `idd-next-id` — found at line 22.
  **severity:** Warning
  **suggested disposition:** accept-omission (This entry point already delegates source ownership and runnable checks to the owned shared contributor guide; helper names and the linked conventions anchor remain stable.)

- **file:** `CONTRIBUTING.md`
  **evidence:** `contributing-agents.md` — found at line 38.
  **severity:** Warning
  **suggested disposition:** accept-omission (This entry point already delegates source ownership and runnable checks to the owned shared contributor guide; helper names and the linked conventions anchor remain stable.)

- **file:** `docs/artifacts.md`
  **evidence:** `references` — found at line 114.
  **severity:** Warning
  **suggested disposition:** accept-omission (The matched term describes existing IDD semantics rather than the new assembler API; the five-block schema, lifecycle and semantic review process remain unchanged.)

- **file:** `docs/faq.md`
  **evidence:** `references` — found at line 23.
  **severity:** Warning
  **suggested disposition:** accept-omission (The matched term describes existing IDD semantics rather than the new assembler API; the five-block schema, lifecycle and semantic review process remain unchanged.)

- **file:** `docs/framework.md`
  **evidence:** `references` — found at line 91.
  **severity:** Warning
  **suggested disposition:** accept-omission (The matched term describes existing IDD semantics rather than the new assembler API; the five-block schema, lifecycle and semantic review process remain unchanged.)

- **file:** `docs/plans/2026-09-12-codex-skills-migration.md`
  **evidence:** `references` — found at line 21.
  **severity:** Warning
  **suggested disposition:** accept-omission (The migration plan is author/orchestrator tracking outside this implementation allowlist; its milestone status can be maintained separately without affecting foundation validation.)

- **file:** `docs/spec-authoring.md`
  **evidence:** `references` — found at line 182.
  **severity:** Warning
  **suggested disposition:** accept-omission (The matched term describes existing IDD semantics rather than the new assembler API; the five-block schema, lifecycle and semantic review process remain unchanged.)

- **file:** `docs/superpowers/plans/2026-07-28-exploration-phase-0.md`
  **evidence:** `references` — found at line 9.
  **severity:** Warning
  **suggested disposition:** accept-omission (This is historical or worked-example context, protected by the Boundary; the new tooling does not change the example behavior or require historical text updates.)

- **file:** `examples/onboarding-portal.md`
  **evidence:** `references` — found at line 303.
  **severity:** Warning
  **suggested disposition:** accept-omission (This is historical or worked-example context, protected by the Boundary; the new tooling does not change the example behavior or require historical text updates.)

- **file:** `plugin/agents/deep-review-lead.md`
  **evidence:** `references` — found at line 77.
  **severity:** Warning
  **suggested disposition:** accept-omission (The existing Claude consumer keeps the same installed resource/helper paths and interfaces; command/agent edits are expressly excluded by the compatibility Boundary.)

- **file:** `plugin/agents/expectation-author.md`
  **evidence:** `references` — found at line 82.
  **severity:** Warning
  **suggested disposition:** accept-omission (The existing Claude consumer keeps the same installed resource/helper paths and interfaces; command/agent edits are expressly excluded by the compatibility Boundary.)

- **file:** `plugin/agents/exploration-charter.md`
  **evidence:** `references` — found at line 31.
  **severity:** Warning
  **suggested disposition:** accept-omission (The existing Claude consumer keeps the same installed resource/helper paths and interfaces; command/agent edits are expressly excluded by the compatibility Boundary.)

- **file:** `plugin/agents/exploration-resolver.md`
  **evidence:** `references` — found at line 31.
  **severity:** Warning
  **suggested disposition:** accept-omission (The existing Claude consumer keeps the same installed resource/helper paths and interfaces; command/agent edits are expressly excluded by the compatibility Boundary.)

- **file:** `plugin/agents/idd-archivist.md`
  **evidence:** `references` — found at line 35.
  **severity:** Warning
  **suggested disposition:** accept-omission (The existing Claude consumer keeps the same installed resource/helper paths and interfaces; command/agent edits are expressly excluded by the compatibility Boundary.)

- **file:** `plugin/agents/idd-gap-checker.md`
  **evidence:** `references` — found at line 56.
  **severity:** Warning
  **suggested disposition:** accept-omission (The existing Claude consumer keeps the same installed resource/helper paths and interfaces; command/agent edits are expressly excluded by the compatibility Boundary.)

- **file:** `plugin/agents/idd-spec-implementer.md`
  **evidence:** `references` — found at line 73.
  **severity:** Warning
  **suggested disposition:** accept-omission (The existing Claude consumer keeps the same installed resource/helper paths and interfaces; command/agent edits are expressly excluded by the compatibility Boundary.)

- **file:** `plugin/agents/intention-author.md`
  **evidence:** `references` — found at line 57.
  **severity:** Warning
  **suggested disposition:** accept-omission (The existing Claude consumer keeps the same installed resource/helper paths and interfaces; command/agent edits are expressly excluded by the compatibility Boundary.)

- **file:** `plugin/agents/outcome-author.md`
  **evidence:** `references` — found at line 66.
  **severity:** Warning
  **suggested disposition:** accept-omission (The existing Claude consumer keeps the same installed resource/helper paths and interfaces; command/agent edits are expressly excluded by the compatibility Boundary.)

- **file:** `plugin/agents/product-interviewer.md`
  **evidence:** `references` — found at line 69.
  **severity:** Warning
  **suggested disposition:** accept-omission (The existing Claude consumer keeps the same installed resource/helper paths and interfaces; command/agent edits are expressly excluded by the compatibility Boundary.)

- **file:** `plugin/agents/quick-spec-author.md`
  **evidence:** `package.json` — found at line 72.
  **severity:** Warning
  **suggested disposition:** accept-omission (The existing Claude consumer keeps the same installed resource/helper paths and interfaces; command/agent edits are expressly excluded by the compatibility Boundary.)

- **file:** `plugin/agents/spec-author.md`
  **evidence:** `package.json` — found at line 45.
  **severity:** Warning
  **suggested disposition:** accept-omission (The existing Claude consumer keeps the same installed resource/helper paths and interfaces; command/agent edits are expressly excluded by the compatibility Boundary.)

- **file:** `plugin/agents/spec-reviewer.md`
  **evidence:** `references` — found at line 54.
  **severity:** Warning
  **suggested disposition:** accept-omission (The existing Claude consumer keeps the same installed resource/helper paths and interfaces; command/agent edits are expressly excluded by the compatibility Boundary.)

- **file:** `plugin/agents/tech-lead-reviewer.md`
  **evidence:** `references` — found at line 55.
  **severity:** Warning
  **suggested disposition:** accept-omission (The existing Claude consumer keeps the same installed resource/helper paths and interfaces; command/agent edits are expressly excluded by the compatibility Boundary.)

- **file:** `plugin/commands/archive.md`
  **evidence:** `references` — found at line 12.
  **severity:** Warning
  **suggested disposition:** accept-omission (The existing Claude consumer keeps the same installed resource/helper paths and interfaces; command/agent edits are expressly excluded by the compatibility Boundary.)

- **file:** `plugin/commands/gap-check.md`
  **evidence:** `references` — found at line 8.
  **severity:** Warning
  **suggested disposition:** accept-omission (The existing Claude consumer keeps the same installed resource/helper paths and interfaces; command/agent edits are expressly excluded by the compatibility Boundary.)

- **file:** `plugin/commands/implement-spec.md`
  **evidence:** `references` — found at line 8.
  **severity:** Warning
  **suggested disposition:** accept-omission (The existing Claude consumer keeps the same installed resource/helper paths and interfaces; command/agent edits are expressly excluded by the compatibility Boundary.)

- **file:** `templates/expectation-template.yaml`
  **evidence:** `idd-next-id` — found at line 7.
  **severity:** Warning
  **suggested disposition:** accept-omission (The helper invocation and artifact schema remain unchanged; regression validation reads these templates without needing to rewrite them.)

- **file:** `templates/intention-template.yaml`
  **evidence:** `idd-next-id` — found at line 7.
  **severity:** Warning
  **suggested disposition:** accept-omission (The helper invocation and artifact schema remain unchanged; regression validation reads these templates without needing to rewrite them.)

- **file:** `templates/product-template.yaml`
  **evidence:** `idd-next-id` — found at line 7.
  **severity:** Warning
  **suggested disposition:** accept-omission (The helper invocation and artifact schema remain unchanged; regression validation reads these templates without needing to rewrite them.)

- **file:** `templates/spec-template.yaml`
  **evidence:** `idd-next-id` — found at line 10.
  **severity:** Warning
  **suggested disposition:** accept-omission (The helper invocation and artifact schema remain unchanged; regression validation reads these templates without needing to rewrite them.)

