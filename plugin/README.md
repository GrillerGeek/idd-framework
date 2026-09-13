# IDD Framework Plugin for Claude Code

A Claude Code plugin that automates the [Intent-Driven Development](https://github.com/GrillerGeek/idd-framework) workflow with role-specific tools for stakeholder interviews, artifact generation, and structured documentation.

## Installation

**Option 1: Via the GrillerGeek marketplace** (recommended)

```bash
claude plugin marketplace add https://github.com/GrillerGeek/skills.git
claude plugin install idd-framework
```

**Option 2: Local testing**

```bash
git clone https://github.com/GrillerGeek/idd-framework.git
claude --plugin-dir ./idd-framework/plugin
```

## What Is IDD?

Intent-Driven Development replaces traditional sprint-based agile with a "chain of context" model designed for AI-augmented teams. It decomposes purpose into four levels:

```
Product          ->  "Here's why this exists and who it's for."
  Intention      ->  "Here's what we're trying to accomplish and why it matters."
    Expectation  ->  "Here's how we'll know it's right, including the edge cases."
      Spec       ->  "Here's everything you need to build it."
```

Each layer gives developers and AI agents the context they need to make implementation decisions independently.

## Commands

**Phase 0 — /chart + /resolve:** efforts too foggy to interview get an Exploration map of decision tickets, resolved one per session until the way is clear.

### Core Pipeline

| Command | Purpose | Artifact |
|---------|---------|----------|
| `/idd-framework:chart` | Chart a phase-0 Exploration map from a loose idea too foggy for /interview | Exploration map in `docs/explorations/` |
| `/idd-framework:resolve` | Work exactly one decision ticket on an Exploration map | Resolved ticket + updated map in `docs/explorations/` |
| `/idd-framework:interview` | Conduct a stakeholder interview | Product definition in `docs/products/` |
| `/idd-framework:define-intentions` | Decompose a Product into outcomes | Intentions in `docs/intentions/` |
| `/idd-framework:define-expectations` | Define verifiable constraints with edge cases | Expectations in `docs/expectations/` |
| `/idd-framework:write-spec` | Create an AI-ready Spec with all 5 mandatory blocks | Spec in `docs/specs/` |
| `/idd-framework:tech-review` | Review a Spec for architectural feasibility | Review annotations on Spec |
| `/idd-framework:gap-check` | Adversarial content and coverage review before execution | Report in `docs/reviews/` and one gate annotation |
| `/idd-framework:implement-spec` | Build a ready, cleanly gated Spec; self-verify | Deliverables and Execution Report in `docs/reviews/` |
| `/idd-framework:review-spec` | Validate AI output against Spec criteria | Validation report in `docs/reviews/` |
| `/idd-framework:archive` | Consolidate terminal artifacts into the roll-up ledger (classify → human review → apply) | Archive manifest in `docs/reviews/`, then `docs/idd-ledger.yaml` |

### Accelerated Workflows

| Command | Purpose | Artifact |
|---------|---------|----------|
| `/idd-framework:define-outcomes` | Define Intentions + Expectations in one session | Both in `docs/intentions/` and `docs/expectations/` |
| `/idd-framework:quick-spec` | Full pipeline — Intentions + Expectations + Spec in one session | All three artifact types |
| `/idd-framework:deep-review` | Multi-perspective review (uses Agent Teams when available) | Deep review report in `docs/reviews/` |

### Tooling

| Command | Purpose | Artifact |
|---------|---------|----------|
| `/idd-framework:forge` | Launch the [Forge](https://github.com/JasonRobey-Burke/Forge) web UI for browsing and editing IDD artifacts | Local server at `http://localhost:4000` |

Each command is an entry point with prerequisites; you do not have to start at interview. The inventory above contains all 15 commands.

## Agents

The plugin supplies these 14 role agents.

| Agent | Role | Color |
|-------|------|-------|
| **idd-product-interviewer** | Interviews stakeholders to capture Product artifacts | Blue |
| **idd-intention-author** | Guides decomposition of Products into testable Intentions | Green |
| **idd-expectation-author** | Defines verifiable Expectations with edge cases | Yellow |
| **idd-spec-author** | Creates AI-ready Specs with Context, Expectations, Boundaries, Deliverables, Validation | Cyan |
| **idd-tech-lead-reviewer** | Reviews Specs for architectural feasibility and pattern compliance | Magenta |
| **idd-spec-reviewer** | Validates AI output against Spec Expectations and Boundaries | Red |
| **idd-outcome-author** | Defines Intentions + Expectations together in one session | Green |
| **idd-quick-spec-author** | Full pipeline: Intentions + Expectations + Spec in one session | Cyan |
| **idd-deep-review-lead** | Multi-perspective review with Agent Teams support | Magenta |
| **idd-exploration-charter** | Charts phase-0 maps and decision tickets | Green |
| **idd-exploration-resolver** | Resolves one decision ticket per session | Orange |
| **idd-gap-checker** | Reports adversarial content and coverage findings without editing the Spec | Red |
| **idd-spec-implementer** | Builds within Boundaries and records self-verification evidence | Orange |
| **idd-archivist** | Consolidates terminal artifacts into `docs/idd-ledger.yaml` (classify + distill) | Purple |

## Quick Start

### Standard Pipeline (step-by-step)

1. **Define your product:**
   ```
   /idd-framework:interview My Dashboard Project
   ```

2. **Break it into intentions:**
   ```
   /idd-framework:define-intentions PROD-a3f8
   ```

3. **Define expectations with edge cases:**
   ```
   /idd-framework:define-expectations INT-7c21
   ```

4. **Write the spec:**
   ```
   /idd-framework:write-spec EXP-9b04 EXP-3f2a
   ```

5. **Review for architectural fit:**
   ```
   /idd-framework:tech-review SPEC-d12e
   ```

   Resolve technical findings and record actual human peer review plus all
   readiness items before marking ready. AI approval alone does not do this.

6. **Run the pre-build gap-check:**
   ```
   /idd-framework:gap-check SPEC-d12e
   ```
   Resolve outstanding findings and rerun until passed with zero unresolved
   blockers and warnings. The annotation and report must agree.

7. **Implement the gated Spec:**
   ```
   /idd-framework:implement-spec SPEC-d12e
   ```
   The command verifies evidence before writes, acknowledges Boundaries, and
   enters in-progress. A verified complete build enters review. Human
   implementation approval then permits validating.

8. **Validate the implementation against the Spec:**
   ```
   /idd-framework:review-spec SPEC-d12e
   ```

### Fast Track (after Product is defined)

```
/idd-framework:quick-spec PROD-a3f8 "Users can view their onboarding checklist and track progress"
/idd-framework:tech-review SPEC-d12e
```

This produces Intentions, Expectations, and a Spec in a single guided session. Continue through human readiness review, gap-check, implementation and validation as above; the accelerated authoring path does not bypass execution prerequisites.

## Execution contract

The [bundled lifecycle reference](skills/idd-orchestration/references/spec-reference.md#status-lifecycle)
is the installed workflow contract. Technical/deep review preserve lifecycle;
human peer review is needed for ready. Execution requires ready, a current
`gap_check.status: passed`, zero unresolved counts, and the matching per-Spec
report beginning `PASS — 0 blockers, 0 warnings` with `## Coverage`. A report
headed PASS with warnings is not executable.

Accepted coverage omissions remain visible; the reviewer must confirm the author's
reason leaves no unmet validation dependency before marking them resolved.
Substantive warnings require resolution. Repeated checks update one annotation;
failed completeness or unsuccessful review uses blocked and `report: null`, so an
old report cannot authorize a build. Failed or interrupted implementations remain
in-progress even if a partial report exists. These are agent protocol instructions,
not an executable state validator. Resume requires a recovery decision.

Native Codex packaging and complete standalone skills distribution are planned;
this release's documented installation routes above are for Claude Code.

## Output

All artifacts are saved to `docs/` in your project root:

```
docs/
  products/       # Product definitions (YAML)
  intentions/     # Intention artifacts (YAML)
  expectations/   # Expectation artifacts with edge cases (YAML)
  specs/          # AI-ready Specs with 5 mandatory blocks (YAML)
  reviews/        # Gap-check, execution, validation and archive reports
  explorations/   # EXPL-<id>-<slug>/map.md and decision tickets
  idd-ledger.yaml # Archive ledger: distilled records of completed/retired artifacts
```

Completed artifacts don't accumulate forever: `/idd-framework:archive` rolls terminal artifacts into `docs/idd-ledger.yaml` and deletes the originals, with a git tag per archive run so any artifact's full text remains one `git show <tag>:<path>` away.

## IDD Roles

The framework defines six roles. Each maps to a plugin agent:

- **Product Owner** -- Defines Products and Intentions; validates outcomes
- **Spec Author** -- Translates Intentions into AI-ready Specs (new role in IDD)
- **Tech Lead** -- Reviews for architectural fit; manages Boundaries
- **Developer** -- Partners with AI agents; makes autonomous decisions within Spec context
- **AI Agent** -- Executes against Specs; produces Deliverables
- **Reviewer** -- Validates output against Expectations and Boundaries

## Plugin Features

- **Lazy docs initialization** — Commands create directories when needed; implementation checks the gate and acknowledges Boundaries before creating any
- **User config** — Set `default_product_id` and `team_name` at plugin install for faster workflows
- **Helper scripts** — `idd-next-id` (in `bin/`) generates a unique short-hash artifact ID (e.g., `SPEC-a3f8`); checked against existing live paths (reconcile unseen branch collisions during integration)
- **Reviewer memory** — Tech lead and spec reviewer agents accumulate project-specific learnings across sessions
- **Agent Teams support** — `/idd-framework:deep-review` uses parallel Agent Teams when the experimental flag is enabled, with graceful fallback to sequential review

## Developing the plugin

The maintained router is `workflows/idd-orchestration.md`; its six maintained
references are in `references/`. From the repository root, run `npm ci` with
Node.js 22.20.0+, edit those sources, and run `npm run build:skills` to refresh the
committed copies in `skills/idd-orchestration/`. `skill-catalog.json` defines each
mapping and lists eight implemented portable stages plus seven planned stages.

Run `npm run check` and `npm test` before submitting changes. The optional
`npm run test:install` verifies the synthetic fixture and each pilot skill alone
in disposable Codex and Claude projects, in copy and symlink modes. Host workflow
evaluation is separate. The router remains Claude-only until its full catalog
has been ported.
See the [contributor guide](../docs/contributing-agents.md#setup-assembly-and-validation)
for check behavior, fixture profiles and CI.

## License

Apache 2.0 -- see [LICENSE](LICENSE).

## Portable workflow pilot

This branch includes eight complete standalone skill bundles. The original three-stage pilot has a documented supported-lane acceptance; the five authoring stages have separate host evaluation evidence:

| Skill | Purpose | Legacy Claude alias |
|---|---|---|
| `idd-interview` | Define a Product in the stakeholder conversation | `/idd-framework:interview` |
| `idd-gap-check` | Adversarial Spec review, coverage and gate annotation | `/idd-framework:gap-check` |
| `idd-implement-spec` | Gated implementation and execution evidence | `/idd-framework:implement-spec` |
| `idd-define-intentions` | Confirmed draft outcomes from a Product | `/idd-framework:define-intentions` |
| `idd-define-expectations` | Confirmed draft constraints and parent links | `/idd-framework:define-expectations` |
| `idd-define-outcomes` | Linked Intention/Expectation batch | `/idd-framework:define-outcomes` |
| `idd-quick-spec` | Confirmed draft Intention/Expectation/Spec batch | `/idd-framework:quick-spec` |
| `idd-write-spec` | Five-block draft Spec from selected Expectations | `/idd-framework:write-spec` |

The Claude aliases load these shared procedures. Their names and frontmatter stay
unchanged; reviewer/implementer model choices remain in the Claude adapter. Each
standalone bundle contains its own references and any required helper, with no
runtime npm dependency added to the consuming project. The interview helper needs
Bash, and artifact workflows need safe YAML parsing available in the host environment;
missing capabilities are reported before writes. The router and other seven
stages still use the legacy integration; a full-catalog standalone install is not
yet the supported migration path.

For a local pilot, build this checkout, then run the following from a **disposable
consuming project**, replacing the absolute source path with this checkout:

```bash
npx --yes skills@1.5.25 add /absolute/path/to/idd-framework/plugin/skills/idd-interview --agent codex claude-code --skill idd-interview
```

Use any skill in the table in both source path and `--skill` to
install that stage alone. Add `--copy` to test a source-independent copy.
Select just `--agent codex` or `--agent claude-code` if you want one host. These
commands are project-scoped; avoid installing duplicate native-plugin and standalone
copies in the same host. This branch is unpushed, so GitHub shorthand would still
fetch the earlier repository state rather than these changes.

Start a fresh session in that consuming project and request the installed skill
by name (for example, `$idd-gap-check` in Codex or `/idd-gap-check` in Claude Code),
or provide its installed SKILL.md path explicitly. The unattended evaluator uses
explicit paths; selector discovery and native alias UX still need interactive
review. Full native Codex plugin installation is a later milestone.

Run `npm run test:install` for deterministic package checks. Optional host scenarios
and evidence handling are described in the [contributor guide](../docs/contributing-agents.md#setup-assembly-and-validation).
See the [pilot evaluation report](../docs/reviews/SPEC-b2e3-host-evaluation.md) for
actual tested behavior and limitations. Installation success does not certify
model behavior, human review or release readiness.

The optional host evaluator can diagnose Claude output-style conflicts with
`--claude-output-style default`. This affects only the test process, preserves the
configured model, and is recorded separately from runs with the configured style.
Styles that suppress intermediate messages may conflict with IDD's required
pre-write Boundary acknowledgments; a final execution report cannot replace them.


The implementation pilot also has an optional staged evaluation controller. It
validates two read-only acknowledgment turns in one Claude session before enabling
the build, and verifies evidence before changing lifecycle to review. See the
[controller instructions](../docs/contributing-agents.md#setup-assembly-and-validation)
and [recovery evidence](../docs/reviews/2026-09-12-claude-checkpoint-recovery.md).
This is development tooling in the source checkout. Installing the standalone
skill does not install that controller or certify ordinary/native Claude execution.

### Installed guarded execution pilot

The `idd-implement-spec` bundle now includes a self-contained Node >=22.20.0 terminal runner for existing Claude authentication. It requires reviewed `execution_contract` output/check metadata and recorded readiness approval. Use `node <installed-skill>/scripts/idd-execute-spec.mjs --project <project> --spec <SPEC-ID> --check` for read-only preflight; omit `--check` to execute from a separate terminal. Never bypass the nested-session guard. The default preserves the configured model/style; optional `--implementer-model sonnet` requires an observed matching implementation model. The Sonnet option has verified model selection but remains experimental after a failed full workflow trace review. Native alias certification remains separate.

The bundle carries the pinned YAML parser and ISC license; consuming projects need no dependency installation. Failures preserve partial work and controller evidence, and require author recovery. See [guarded execution](references/pilot/guarded-execution.md) for ownership, limits and report rules. Optional contributor host evaluation: `node scripts/evaluate-installed-execution.mjs` (or `--negative`, `--sonnet`). Offline tests use simulated host receipts and do not replace actual host evidence.

## Portable authoring

The five authoring skills share `references/authoring/authoring.md` as their maintained procedure and each bundles its required templates, references and executable ID helper. Selection, confirmation, validation and saves stay in the stakeholder conversation. Optional Claude drafting preserves existing model policy and returns read-only proposals. Accelerated modes save no intermediate YAML until every proposed Expectation has at least two explicitly confirmed edge cases. All new artifacts remain draft; content confirmation never supplies human Spec peer review.

Parent context baselines begin when loaded, and only an existing Intention expectations list may be changed. Concurrent edits or interrupted saves are reported with exact partial state; there is no automatic rollback or atomic multi-file guarantee. See the [authoring evidence](../docs/reviews/SPEC-8406-host-evaluation.md) for observed cases and limitations.
