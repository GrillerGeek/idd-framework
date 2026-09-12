BLOCKED — 1 blockers, 26 warnings

# SPEC-b2e3 gap-check

Date: 2026-09-12
Spec: `docs/specs/SPEC-b2e3.yaml`
Reviewed Spec SHA256: `c10e6a06b21f3003715a1178888ac52186fafeeaa63c5736169431a665443268`

Completeness precondition: items 1–10 pass. The blocked operational sentinel is present. Human peer review is recorded as pending. The explicit unattended migration authorization is session-specific and is not treated as completed peer review or a change to the shipped lifecycle gate.

## GC-1

**Severity:** Blocker
**Spec block(s):** implementation_contract.evaluation; expectations_detail EXP-feff and EXP-016a; validation.automated; Deliverables tests/helpers/pilot.mjs, tests/fixtures/pilot/ and scripts/evaluate-pilot.mjs
**Quoted text:** "Define independent scenarios interview, gap-clean, gap-flawed, gap-incomplete, implement-clean, implement-refuse." "capture before/after fixture bytes excluding allowed outputs and host scratch." "A tiny greet(name) ESM fixture specifies exact outputs, invalid-input behavior and tests."
**Why an implementer must guess:** The evaluator is an acceptance instrument, but the Spec does not define scenario fixture preconditions, required outcomes or permitted mutations. One implementer could make gap-flawed unparseable or mechanically incomplete and count parser/completeness rejection as a pass, while another uses a parseable, complete Spec with an adversarial content contradiction and requires the reviewer to identify it. Only the latter exercises the promised semantic review. Likewise, excluding the entire Spec file as an allowed output to permit a gap_check annotation can hide an unauthorized content rewrite that another evaluator rejects. These choices change which host behavior is labelled successful and could certify a pilot without exercising its defining behavior; this is Blocker impact rather than a fixture naming preference.
**Resolving question:** What exact scenario inputs and expected outcome checks define interview, gap-clean, gap-flawed, gap-incomplete, implement-clean, implement-refuse and the independent reviewer sessions, including a mechanically complete adversarial flawed case and per-scenario permitted file/field mutations that preserve contract content?

## Coverage

The sweep searched tracked repository text using Deliverable basenames and explicitly changed pilot/stage/gate terms, excluding products, intentions, expectations, specs and reviews. Templates and examples were included. Each owned directory includes its contents. 26 unowned matches are listed below; no author dispositions exist yet, so all remain unresolved Warnings. None is currently an unmet validation dependency. Incidental matches on the common word `pilot` remain visible as required by the omission sweep; suggested acceptance does not itself resolve a finding.

- **file:** `.cursor/rules/idd.mdc`
  **evidence:** `contributing-agents.md` — found at line 8.
  **severity:** Warning
  **suggested disposition:** accept-omission (The entry point delegates current source ownership and setup to the owned contributor guide or plugin README; existing resource paths and frontmatter tiers remain valid.)

- **file:** `.github/copilot-instructions.md`
  **evidence:** `contributing-agents.md` — found at line 3.
  **severity:** Warning
  **suggested disposition:** accept-omission (The entry point delegates current source ownership and setup to the owned contributor guide or plugin README; existing resource paths and frontmatter tiers remain valid.)

- **file:** `.github/pull_request_template.md`
  **evidence:** `contributing-agents.md` — found at line 15.
  **severity:** Warning
  **suggested disposition:** accept-omission (The entry point delegates current source ownership and setup to the owned contributor guide or plugin README; existing resource paths and frontmatter tiers remain valid.)

- **file:** `AGENTS.md`
  **evidence:** `contributing-agents.md` — found at line 5.
  **severity:** Warning
  **suggested disposition:** accept-omission (The entry point delegates current source ownership and setup to the owned contributor guide or plugin README; existing resource paths and frontmatter tiers remain valid.)

- **file:** `CLAUDE.md`
  **evidence:** `README.md` — found at line 10.
  **severity:** Warning
  **suggested disposition:** accept-omission (The entry point delegates current source ownership and setup to the owned contributor guide or plugin README; existing resource paths and frontmatter tiers remain valid.)

- **file:** `CONTRIBUTING.md`
  **evidence:** `contributing-agents.md` — found at line 38.
  **severity:** Warning
  **suggested disposition:** accept-omission (The entry point delegates current source ownership and setup to the owned contributor guide or plugin README; existing resource paths and frontmatter tiers remain valid.)

- **file:** `docs/adoption.md`
  **evidence:** `pilot` — found at line 14.
  **severity:** Warning
  **suggested disposition:** accept-omission (Framework semantics and adoption guidance remain unchanged; the pilot does not replace the framework lifecycle or change these existing concepts.)

- **file:** `docs/artifacts.md`
  **evidence:** `gap_check` — found at line 138.
  **severity:** Warning
  **suggested disposition:** accept-omission (Framework semantics and adoption guidance remain unchanged; the pilot does not replace the framework lifecycle or change these existing concepts.)

- **file:** `docs/faq.md`
  **evidence:** `pilot` — found at line 19.
  **severity:** Warning
  **suggested disposition:** accept-omission (Framework semantics and adoption guidance remain unchanged; the pilot does not replace the framework lifecycle or change these existing concepts.)

- **file:** `docs/framework.md`
  **evidence:** `gap_check` — found at line 146.
  **severity:** Warning
  **suggested disposition:** accept-omission (Framework semantics and adoption guidance remain unchanged; the pilot does not replace the framework lifecycle or change these existing concepts.)

- **file:** `docs/plans/2026-09-12-codex-skills-migration.md`
  **evidence:** `pilot` — found at line 7.
  **severity:** Warning
  **suggested disposition:** accept-omission (Migration plan state belongs to author/orchestrator tracking outside the implementation allowlist.)

- **file:** `docs/superpowers/plans/2026-07-28-exploration-phase-0.md`
  **evidence:** `interview.md` — found at line 17.
  **severity:** Warning
  **suggested disposition:** accept-omission (Historical/example content is expressly protected by the first Boundary and does not define the new pilot evaluator contract.)

- **file:** `examples/onboarding-portal.md`
  **evidence:** `gap_check` — found at line 256.
  **severity:** Warning
  **suggested disposition:** accept-omission (Historical/example content is expressly protected by the first Boundary and does not define the new pilot evaluator contract.)

- **file:** `examples/self-hosted-v13.md`
  **evidence:** `gap_check` — found at line 59.
  **severity:** Warning
  **suggested disposition:** accept-omission (Historical/example content is expressly protected by the first Boundary and does not define the new pilot evaluator contract.)

- **file:** `package.json`
  **evidence:** `test-install.mjs` — found at line 12.
  **severity:** Warning
  **suggested disposition:** accept-omission (The existing test:install entry already invokes the owned installer script and the optional evaluator can be invoked directly; no new npm script is required.)

- **file:** `plugin/bin/idd-archive-scan`
  **evidence:** `gap_check` — found at line 56.
  **severity:** Warning
  **suggested disposition:** accept-omission (Existing helper and fixture contracts remain valid; new pilot tests own additional behavior and unchanged frontmatter is checked against the existing inventory.)

- **file:** `plugin/references/spec-reference.md`
  **evidence:** `gap_check` — found at line 149.
  **severity:** Warning
  **suggested disposition:** accept-omission (The pilot gets an independent canonical reference and complete stage bundles; the legacy router/reference bytes and shipped lifecycle semantics are intentionally preserved by the Boundaries.)

- **file:** `plugin/skills/idd-orchestration/SKILL.md`
  **evidence:** `gap_check` — found at line 20.
  **severity:** Warning
  **suggested disposition:** accept-omission (The pilot gets an independent canonical reference and complete stage bundles; the legacy router/reference bytes and shipped lifecycle semantics are intentionally preserved by the Boundaries.)

- **file:** `plugin/skills/idd-orchestration/references/spec-reference.md`
  **evidence:** `gap_check` — found at line 149.
  **severity:** Warning
  **suggested disposition:** accept-omission (The pilot gets an independent canonical reference and complete stage bundles; the legacy router/reference bytes and shipped lifecycle semantics are intentionally preserved by the Boundaries.)

- **file:** `plugin/workflows/idd-orchestration.md`
  **evidence:** `gap_check` — found at line 20.
  **severity:** Warning
  **suggested disposition:** accept-omission (The pilot gets an independent canonical reference and complete stage bundles; the legacy router/reference bytes and shipped lifecycle semantics are intentionally preserved by the Boundaries.)

- **file:** `scripts/build-skills.mjs`
  **evidence:** `assembly.mjs` — found at line 4.
  **severity:** Warning
  **suggested disposition:** accept-omission (Existing assembly exports, structural checks and catalog consumers retain their interfaces; the owned assembler implements the stage-state extension while current validators consume its result.)

- **file:** `scripts/lib/artifacts.mjs`
  **evidence:** `gap_check` — found at line 74.
  **severity:** Warning
  **suggested disposition:** accept-omission (Existing assembly exports, structural checks and catalog consumers retain their interfaces; the owned assembler implements the stage-state extension while current validators consume its result.)

- **file:** `scripts/lib/packages.mjs`
  **evidence:** `skill-catalog.json` — found at line 49.
  **severity:** Warning
  **suggested disposition:** accept-omission (Existing assembly exports, structural checks and catalog consumers retain their interfaces; the owned assembler implements the stage-state extension while current validators consume its result.)

- **file:** `tests/artifacts.test.mjs`
  **evidence:** `gap_check` — found at line 88.
  **severity:** Warning
  **suggested disposition:** accept-omission (Existing helper and fixture contracts remain valid; new pilot tests own additional behavior and unchanged frontmatter is checked against the existing inventory.)

- **file:** `tests/fixtures/plugin-inventory.json`
  **evidence:** `interview.md` — found at line 12.
  **severity:** Warning
  **suggested disposition:** accept-omission (Existing helper and fixture contracts remain valid; new pilot tests own additional behavior and unchanged frontmatter is checked against the existing inventory.)

- **file:** `tests/helpers.test.mjs`
  **evidence:** `gap_check` — found at line 39.
  **severity:** Warning
  **suggested disposition:** accept-omission (Existing helper and fixture contracts remain valid; new pilot tests own additional behavior and unchanged frontmatter is checked against the existing inventory.)
