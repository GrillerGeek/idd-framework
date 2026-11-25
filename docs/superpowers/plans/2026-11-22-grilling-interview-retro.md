# Grilling Interview and Retro Stage Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship IDD v1.8: a grilling-style PM path (interview + authoring) that records glossary, decisions and open questions in the Product and renders a handoff brief, plus a propose-only per-Spec `retro` stage.

**Architecture:** Behaviour lives in prose workflows and references under `plugin/workflows/` and `plugin/references/`, assembled into bundles by `npm run build:skills` from `plugin/skill-catalog.json`. Machine-checkable parts (Product schema, ledger `lessons`, inventory counts, bundle closures, versions) are enforced by `scripts/lib/*.mjs` and `node --test` suites.

**Tech Stack:** Markdown workflows, YAML artifacts, Node 22 ESM tooling (`yaml` 2.8.3), `node:test`, Bash helpers.

**Spec:** `docs/superpowers/specs/2026-11-22-grilling-interview-retro-design.md`

## Global Constraints

- Edit canonical sources only (`plugin/workflows/`, `plugin/references/`, catalog); regenerate `plugin/skills/` with `npm run build:skills`; never hand-edit bundles.
- Portable bundle Markdown must not contain `CLAUDE_PLUGIN_ROOT`, `/idd-framework:`, `Agent(`/`Task(`, or model-tier names next to "model"/"tier" (HOST_SPECIFIC check).
- New Product fields are optional; every existing Product, fixture and template must stay valid.
- Decision/question IDs: `D-` or `Q-` + 4 lowercase hex, unique within the Product.
- `open_questions[].needs` ∈ `tech-lead | stakeholder`.
- Retro report path `docs/reviews/SPEC-<id>-retro.md` (second: `SPEC-<id>-retro-<YYYYMMDD>.md`), frontmatter `spec`, `date`, `lessons` (1–3 strings).
- Ledger `lessons`: optional array of at most 3 nonempty strings.
- Versions: framework v1.8, plugin 1.8.0. Stages 16, commands 16, agents 14, bundles 17.
- Agents `product-interviewer`, `intention-author`, `expectation-author` → `model: sonnet`.
- Confirmation doctrine unchanged: silence never confirms; retro applies nothing without approval.
- `npm run check` and `npm test` pass at every commit.

## Review Focus

1. A Product with `decisions` holding a duplicate ID (`D-3f2a` twice) — must fail validation, not silently pass.
2. A Product whose `open_questions[].needs` is misspelled (`techlead`) — must fail validation.
3. A brief `.md` beside Product YAML in `docs/products/` — must not be parsed as an artifact.
4. A ledger record with 4 lessons or an empty lesson string — must fail validation.
5. The retro bundle routed through `idd-orchestration` — its references must resolve inside the routed stage root (closure check).

---

### Task 1: Baseline

- [ ] **Step 1:** Run `npm ci && npm run check && npm test`. Expected: check prints "Package, artifact, inventory, CI and Bash checks passed."; tests 0 failures. Record any pre-existing failure in the report before changing anything.

### Task 2: Product schema — glossary, decisions, open_questions

**Files:**
- Modify: `scripts/lib/artifacts.mjs` (product branch of `validateArtifact`)
- Test: `tests/artifacts.test.mjs`

**Interfaces:**
- Produces: `validateArtifact(text,{kind:'product'})` rejects malformed optional `glossary`, `decisions`, `open_questions` with code `SCHEMA`.

- [ ] **Step 1: Write failing tests** in `tests/artifacts.test.mjs`:
  - `product accepts optional glossary, decisions and open questions`: product with `glossary:[{term:'Hold',definition:'A temporary claim.',avoid:['reservation']}]`, `decisions:[{id:'D-3f2a',decision:'Holds expire after 15 minutes.',decided_by:'Jane Doe',decided_at:'2026-11-22',alternatives:['No expiry'],rationale:'Scarce inventory.',resolves:'Q-91c0'}]`, `open_questions:[{id:'Q-1b2c',question:'Which provider?',needs:'tech-lead',relates_to:['INT-7c21']}]` → no throw.
  - `product rejects malformed grilling records`: each of these throws `/SCHEMA/`: glossary entry missing `definition`; `decisions` id `D1`; duplicate decision id; `open_questions` `needs:'techlead'`; question id `Q-ZZZZ`; `relates_to` not an array; `decision` empty string.
- [ ] **Step 2:** `node --test tests/artifacts.test.mjs` → new rejection test FAILS.
- [ ] **Step 3: Implement** in `artifacts.mjs`: when `kind==='product'`, for each present field require an array of mappings; glossary needs nonempty `term`,`definition`, optional `avoid` string array; decisions need id `/^D-[a-f0-9]{4,8}$/`, nonempty `decision`, optional string `decided_by`,`decided_at`,`rationale`,`resolves` (`/^Q-[a-f0-9]{4,8}$/`), optional `alternatives` string array; open_questions need id `/^Q-[a-f0-9]{4,8}$/`, nonempty `question`, `needs` in the enum, optional `relates_to` string array; IDs unique across both lists.
- [ ] **Step 4:** `node --test tests/artifacts.test.mjs` → PASS; `npm run check` passes.
- [ ] **Step 5:** Commit `feat: validate Product glossary, decisions and open questions`.

### Task 3: Product schema documentation and templates

**Files:** `templates/product-template.yaml`, `plugin/references/pilot/product-template.md`, `plugin/references/product-template.md`, `docs/artifacts.md` (Product section), `AGENTS.md` (Product schema).

- [ ] **Step 1:** Add the three optional blocks with inline comments exactly as in design §1.3 (empty lists in the YAML template: `glossary: []`, `decisions: []`, `open_questions: []`), field rows (Required: No), and guidance: glossary is vocabulary only; three-gate rule; answered questions move to decisions with `resolves`.
- [ ] **Step 2:** `npm run build:skills && npm run check && npm test` → pass (template validation covers the YAML template).
- [ ] **Step 3:** Commit `docs: document Product glossary, decisions and open questions`.

### Task 4: Grilling and brief references; interview rewrite

**Files:**
- Create: `plugin/references/authoring/grilling.md`, `plugin/references/authoring/brief-template.md`
- Modify: `plugin/workflows/interview.md`, `plugin/skill-catalog.json` (idd-interview bundle + router `stages/interview/` closure: add `references/grilling.md`, `references/brief-template.md`)
- Test: `tests/router-distribution.test.mjs` or new `tests/grilling.test.mjs`

**Interfaces:**
- Produces: bundle resource paths `references/grilling.md` and `references/brief-template.md` that Tasks 5 and 6 link to.

- [ ] **Step 1: Write failing test** `tests/grilling.test.mjs`: `PM-path bundles ship grilling and brief references` — for each of `idd-interview, idd-define-intentions, idd-define-expectations, idd-define-outcomes, idd-quick-spec` the bundle in `plugin/skill-catalog.json` has destinations `references/grilling.md` and `references/brief-template.md`, and the router has `stages/<stage>/references/grilling.md`; and `interview workflow links grilling` — `plugin/workflows/interview.md` contains `(references/grilling.md)` and `(references/brief-template.md)`.
- [ ] **Step 2:** `node --test tests/grilling.test.mjs` → FAIL.
- [ ] **Step 3:** Write `grilling.md` covering design §1.1 (rounds/frontier, recommended answers, yes-accepts, confirmation rule, facts vs decisions with read-only lookups, tech-lead flags, vocabulary challenge, scenarios/contradictions, decision gates, round size, stop rule). Write `brief-template.md` per design §1.4 (header text, section order, Markdown skeleton, re-render triggers, path rule `docs/products/<Product YAML stem>.md`, never hand-edit). Rewrite `interview.md` steps to: load both references; existing-Product gap mode; run grilling; build candidate including glossary/decisions/open_questions; existing ID/validation/save steps unchanged; render brief after save; optional publishing adapter sentence phrased host-neutrally ("if the host offers a document publishing capability"). Add catalog mappings for the interview bundle and router (interview only in this task).
- [ ] **Step 4:** `npm run build:skills && node --test tests/grilling.test.mjs` → interview assertions pass (authoring stage assertions still fail until Task 5).
- [ ] **Step 5:** Commit `feat: grilling interview with Product brief`.

### Task 5: Grilling in authoring stages, write-spec and gap-check

**Files:** `plugin/references/authoring/authoring.md` (§2 and save section), `plugin/workflows/define-intentions.md`, `define-expectations.md`, `define-outcomes.md`, `quick-spec.md`, `write-spec.md`, `plugin/references/pilot/gap-reviewer.md`, `plugin/skill-catalog.json` (add grilling + brief references to define-* and quick-spec bundles and router stage closures).

- [ ] **Step 1:** authoring.md §2: PM-path modes (define-intentions, define-expectations, define-outcomes) follow `references/grilling.md`; edge cases are proposed as recommended answers in rounds; decisions/questions/terms append to the Product per design §1.3 "Who writes the Product" (listed in the batch summary; baseline byte check; stop on change). Add relevance rule and write-spec obligation (resolve relevant `open_questions` or stop). quick-spec: rounds optional; appends and brief re-render required. After saving in any PM-path mode or quick-spec, re-render the brief.
- [ ] **Step 2:** gap-reviewer.md: unresolved relevant open question (rule from design §1.3) is a blocking finding.
- [ ] **Step 3:** Workflow files link `references/grilling.md`/`references/brief-template.md` where used. Add catalog mappings.
- [ ] **Step 4:** `npm run build:skills && npm run check && npm test` → all pass including `tests/grilling.test.mjs`.
- [ ] **Step 5:** Commit `feat: grilling rounds across PM-path authoring`.

### Task 6: Model tiers

**Files:** `plugin/agents/product-interviewer.md`, `intention-author.md`, `expectation-author.md` (`model: sonnet`), `tests/fixtures/plugin-inventory.json` (new frontmatter hashes), `CLAUDE.md` model list.

- [ ] **Step 1:** Change frontmatter; `npm run check` → FAIL `FRONTMATTER_CHANGED`.
- [ ] **Step 2:** Update the three hashes (sha256 of the text between the first two `---`). `npm run check && npm test` → pass.
- [ ] **Step 3:** Commit `feat: move PM-path drafting roles to sonnet`.

### Task 7: Retro stage

**Files:**
- Create: `plugin/workflows/retro.md`, `plugin/references/retro/retro.md`, `plugin/commands/retro.md`
- Modify: `plugin/skill-catalog.json` (stage `{legacyCommand:'retro',skill:'idd-retro',state:'pilot'}`, bundle `idd-retro` with workflow, retro reference, `references/spec-reference.md`, `scripts/idd-next-id`, LICENSE; router closure `stages/retro/...`), `plugin/workflows/idd-orchestration.md` (table row), `scripts/lib/packages.mjs` (commands 16, bundles 17), `tests/fixtures/plugin-inventory.json` (retro command hash), `tests/router-distribution.test.mjs` (16 stages / 17 entries), `tests/native-distribution.test.mjs` (17), `tests/helpers/router-distribution.mjs` (17 names), `scripts/test-install.mjs` (idd-retro → `spec`), `tests/grilling.test.mjs` → add retro assertions.

- [ ] **Step 1: Failing test** in `tests/grilling.test.mjs` (rename file to `tests/pm-path-and-retro.test.mjs`): `retro stage is catalogued and routed` — catalog stage `idd-retro` exists; bundle has `SKILL.md`, `references/retro.md`; router SKILL.md contains `stages/retro/workflow.md`; `plugin/workflows/retro.md` mentions `docs/reviews/SPEC-` and `lessons`.
- [ ] **Step 2:** Run → FAIL.
- [ ] **Step 3:** Write retro workflow + reference per design §2.1–2.4 (evidence order incl. `docs/guildhall/plans/`, routing table, flow, report contract, upstream feedback, no-candidate outcome, approvals, safe YAML). Command adapter mirrors `review-spec.md` style with `allowed-tools: "Read Write Glob Grep Bash(ls *) Bash(mkdir *)"`. Update counts and tests.
- [ ] **Step 4:** `npm run build:skills && npm run check && npm test` → pass.
- [ ] **Step 5:** Commit `feat: add propose-only retro stage`.

### Task 8: Nudges and ledger lessons

**Files:** `plugin/references/review/review.md` (review-spec closing suggestion), `plugin/references/archive/archive.md` (warning), `plugin/references/archive/ledger.md` + `plugin/references/ledger-reference.md` (`lessons` field), `scripts/lib/artifacts.mjs` (ledger lessons validation), `tests/artifacts.test.mjs`.

- [ ] **Step 1: Failing test** `ledger lessons are optional and bounded`: ledger record with `lessons:['a']` OK; `lessons:['a','b','c','d']` and `lessons:['']` → error containing `lessons`.
- [ ] **Step 2:** Run → FAIL.
- [ ] **Step 3:** Implement in the ledger branch of `validateArtifacts` (push error, don't stop other checks). Update prose references.
- [ ] **Step 4:** `npm run build:skills && npm run check && npm test` → pass.
- [ ] **Step 5:** Commit `feat: retro nudges and ledger lessons`.

### Task 9: Framework docs and v1.8

**Files:** `docs/framework.md` (lifecycle + Process Retro), `docs/roles.md` (PM path, tech-lead flags), `docs/metrics.md` (spec_gaps trend), `plugin/README.md`, `CLAUDE.md`, `docs/contributing-agents.md` (16 stages/17 bundles), `README.md` badges, `docs/installation.md` version line, `plugin/.claude-plugin/plugin.json`, `plugin/plugin.json`, `plugin/.codex-plugin/plugin.json`, `tests/fixtures/plugin-inventory.json` manifest, `scripts/lib/packages.mjs` version asserts, `docs/releases/v1.8.md`.

- [ ] **Step 1:** Bump versions to 1.8.0 in manifests and assertions; `npm run check` → pass.
- [ ] **Step 2:** Update docs; write release notes (what changed, migration: none required, new optional fields).
- [ ] **Step 3:** `npm run build:skills && npm run check && npm test` → pass.
- [ ] **Step 4:** Commit `docs: IDD v1.8 grilling and retro`.

### Task 10: Final verification

- [ ] **Step 1:** `npm run check && npm test` clean; `git status` clean.
- [ ] **Step 2:** Whole-branch review by a fresh reviewer against the design; fix findings; re-run checks.
