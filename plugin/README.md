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
mapping and lists the 15 pending portable stages.

Run `npm run check` and `npm test` before submitting changes. The optional
`npm run test:install` verifies a synthetic complete skill in disposable Codex and
Claude installations; it does not certify real IDD host workflows. The production
router remains explicitly Claude-only until the portable pilot is complete.
See the [contributor guide](../docs/contributing-agents.md#setup-assembly-and-validation)
for check behavior, fixture profiles and CI.

## License

Apache 2.0 -- see [LICENSE](LICENSE).
