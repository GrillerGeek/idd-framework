# Contributing with AI agents

Start with [AGENTS.md](../AGENTS.md) for artifact schemas and generation rules,
[framework.md](framework.md) for the canonical process, and
[autonomy.md](autonomy.md) for the reasoning behind it. This guide applies to
Codex, Claude Code, Copilot, Cursor, and human contributors.

## Maintaining IDD versus executing a Spec

This repository contains framework documentation, YAML artifacts and templates,
JSON plugin metadata, and Bash helpers. Private Node.js development tooling now
assembles plugin resources and validates artifacts/packages; it is not an IDD npm
package or a dependency added to consuming projects.

Repository assessment, planning, and routine maintenance do not automatically
start the managed execution workflow. Use the user's requested scope and existing
authorization to make routine decisions. When executing an IDD Spec, follow the
[Spec lifecycle contract](framework.md#spec-lifecycle-contract): completeness,
actual human peer review, and a clean gap-check precede implementation. AI review
is not evidence of human approval. Record a human decision when it is given;
do not repeatedly ask for the same approval.

Codex can maintain this checkout through AGENTS.md and this guide. Native Codex
and Claude plugins and portable skills have verified local implementation. See
the [installation guide](installation.md) and current
[catch-up report](reviews/2026-09-13-overnight-catch-up.md) for choices and limits.
Fifteen standalone stages have complete bundles, covering interview, authoring, technical/deep
review, gap-check, guarded implementation, validation, Forge, exploration and archival. Archive
host acceptance is complete for all eight required cases; the complete router has accepted integration evidence, with native Codex/Claude packaging and its isolated lifecycle checks complete. See the [pilot instructions](../plugin/README.md#portable-workflow-pilot)
for local installation and recorded host-evaluation limits.

## Source ownership and discovery

| Location | Responsibility |
|---|---|
| `docs/framework.md` | Canonical process and lifecycle contract |
| `docs/artifacts.md`, `docs/spec-authoring.md` | Field definitions and authoring guidance |
| `docs/roles.md`, `docs/adoption.md`, `docs/faq.md`, `docs/metrics.md` | Roles, adoption, questions, and process health |
| `AGENTS.md` | Shared artifact-generation reference and links to contributor guidance |
| `CLAUDE.md`, `.github/copilot-instructions.md`, `.cursor/rules/idd.mdc` | Host entry points; Claude-specific dispatch details remain in CLAUDE.md |
| `templates/` | Commented YAML starters for people |
| `examples/` | Worked hierarchies; historical cases remain historical evidence |
| `plugin/commands/`, `plugin/agents/` | Claude entry points; all stage bodies are thin adapters; frontmatter owns names and models |
| `plugin/workflows/`, `plugin/references/` | Canonical router, portable stage procedures and reference sources; edit these |
| `plugin/skill-catalog.json` | Explicit source/destination mappings, fifteen stages and sixteen bundles |
| `plugin/skills/` | Committed generated complete router and standalone stage bundles; rebuild rather than edit |
| `scripts/`, `tests/`, `.github/workflows/validate.yml` | Assembly, validation, regression tests and CI |
| `plugin/bin/`, `plugin/scripts/` | ID generation, archive inventory, and directory initialization helpers |
| `plugin/.claude-plugin/plugin.json`, `plugin/hooks/hooks.json` | Plugin identity/configuration and currently empty hooks |
| `docs/plans/`, `docs/reviews/` | Plans, gap-checks, execution evidence, and validation reports |

Live hierarchy artifacts are in `docs/products/`, `docs/intentions/`,
`docs/expectations/`, and `docs/specs/`. Phase-0 Explorations use
`docs/explorations/EXPL-<id>-<slug>/map.md` plus decision tickets; they are not
flat YAML files. Archived artifacts are represented in `docs/idd-ledger.yaml`
when that ledger exists. Recover full archived text from its archive Git tag;
do not treat a missing live file as permission to reuse its ID or recreate it.
Create artifact directories only when a workflow needs to write them.

The plugin's [Spec reference](../plugin/skills/idd-orchestration/references/spec-reference.md)
must stand alone after installation. Its maintained source is
`plugin/references/pilot/spec-reference.md`; `npm run build:skills` updates the bundled
copy. When changing the lifecycle, reconcile it
with the canonical contract and affected commands/agents in the same change.
Keep the two license domains independently authored. Schema changes also require
checking AGENTS.md, templates, current examples, and other bundled references.
Do not silently rewrite completed artifacts or historical reports.

## Concepts and editing conventions

- Decompose purpose through Product → Intention → Expectation → Spec. Preserve
  continuous flow, WIP limits, and autonomy through context; avoid story points
  and velocity as substitutes for outcomes.
- Keep all five Spec blocks, explicit Boundaries, at least two edge cases per
  Expectation, and Product-level context inheritance. Reviewers report gaps;
  authors resolve them. Minor execution choices follow the lifecycle contract.
- Generate new IDs with `bash plugin/bin/idd-next-id <type>` from the project root.
  IDs are immutable random hashes; existing sequential IDs remain valid. Check
  collisions against live artifacts and archive records when integrating branches;
  independent branches cannot guarantee uniqueness against each other's unseen work.
- Write for product owners and developers. Use concrete language, `|---|` table
  separators, inline YAML field comments, and examples spanning the hierarchy.
- Preserve command/agent names, model assignments, helper interfaces, and existing
  artifact IDs unless the approved change specifically owns their migration.

## Setup, assembly and validation

Use Node.js **22.20.0 or newer**, npm, Git and Bash. Install the locked development
dependencies with `npm ci`. Versions are pinned in package.json/package-lock.json;
there are no install hooks or runtime dependencies for consuming projects.

```bash
npm ci
npm run build:skills
npm run check
npm test
npm run test:install
```

- `build:skills` copies declared canonical sources into committed skill directories,
  preserving bytes and declared executable modes. A second build makes no changes.
  It preflights inputs and rejects unrecognized output files instead of deleting
  them. Edit `plugin/workflows/` or `plugin/references/`, then rebuild and commit
  both the source and generated changes.
- `check` is read-only: it detects generated drift, invalid metadata/resources,
  invalid live artifacts, fixture-profile drift, inventory/model changes, missing
  executable bits, malformed JSON/CI, Bash syntax errors and whitespace errors.
  `node scripts/build-skills.mjs --check` checks only assembly drift. Both scripts
  locate the checkout relative to themselves, independent of the caller's cwd.
- `test` runs offline behavior tests after installation, using temporary projects
  with spaces in their paths. It covers rejected package inputs, preserved unknown
  files, artifact errors, helper collisions/exhaustion and exploration references.
- `test:install` uses pinned `skills@1.5.25` to install the synthetic fixture and
  each portable pilot skill individually into disposable Codex/Claude projects in
  symlink and copy modes. It verifies every resource byte and executable mode,
  helper behavior and copy-source removal. It uses no global flags, disables
  telemetry/audit calls and cleans only its temporary directories. Failures fail
  the command; it does not invoke models.

CI runs `npm ci`, `check` and `test` on Linux/macOS at the minimum Node version,
plus a separate isolated package-installation job. A local pass does not establish hosted
CI success; inspect the actual run after pushing. Dependency acquisition requires
network access; normal checks and tests are offline after `npm ci`.

The historical `SPEC-test-clean.yaml` and `SPEC-test-flawed.yaml` have explicit
path/hash profiles in `tests/fixtures/artifact-profiles.json`. The flawed fixture
must fail duplicate-key validation; the clean fixture has fictional parent links.
No other test-named file is exempt. Templates permit blanks but require schema
shape; ready-or-later live Specs require mechanical completeness and matching
linked/detail IDs. Archived identities resolve through the ledger when present.
Checks never rewrite artifacts, infer human peer review, detect every semantic
gap, or grant execution permission.

The orchestration skill remains an explicit `legacy-claude` bundle with unchanged
resources. Fifteen catalog stages are `pilot` and require matching portable bundles;
all fifteen stages now emit complete bundles; no placeholder stage remains. Pilot
references are maintained in `plugin/references/pilot/`; retain parity with the
legacy contract when future changes affect both. Installation evidence alone
does not prove real workflow behavior.

Optional fresh-session evaluation uses existing Codex/Claude authentication and
model settings, and may consume account usage. It is never run by `npm test` or CI:

```bash
node scripts/evaluate-pilot.mjs --host codex --scenario gap-flawed --output /tmp/idd-pilot-evidence
node scripts/evaluate-pilot.mjs --host claude --scenario implement-refuse --output /tmp/idd-pilot-evidence
```

Scenarios: `interview`, `gap-clean`, `gap-flawed`, `gap-incomplete`,
`implement-clean`, `implement-refuse`. Each creates a fresh temporary Git project,
installs one skill in copy mode and checks output plus permitted mutations. Host
runs are bounded to ten minutes; generated code/test verification uses separate
ten-second subprocess limits. Permission, authentication or service failures
remain blocked evidence; scenario assertion failures remain failed. No global
installation or model override is performed. Claude hooks and MCP connections
are disabled for evaluation. Host settings and installed personal skills are
not edited. Claude subagent text is forwarded into the local transcript.

To diagnose a custom output style that suppresses required workflow messages, add
`--claude-output-style default` to a Claude evaluation invocation. This overrides
only that process's output style, preserves the configured model and does not
change a settings file. The default remains `configured`; evidence explicitly
records which mode was used. A pass in the isolated mode does not certify the
custom style.

For the Claude implementation pilot, an opt-in staged controller establishes
both acknowledgments in read-only turns before enabling build tools:

```bash
node scripts/evaluate-pilot.mjs --host claude --scenario implement-clean --claude-checkpoint staged --output /tmp/idd-checkpoint-evidence
```

The controller safely checks the fixture gate, validates the orchestration
acknowledgment, changes only status to in-progress, validates the implementing
role's own acknowledgment, then resumes that same conversation to build. The two
checkpoint turns expose only Read, Glob and Grep; shell execution, skill expansion,
delegation, hooks and MCP are unavailable. The build uses the ordinary file/shell
tools without delegation. The controller checks actual outputs, required report
rows and preservation before it alone advances to review. Missing acknowledgments,
changed session/settings, failed checks or unexpected lifecycle writes fail the
run; there is no automatic repair or fabricated acknowledgment.

Staged mode keeps one saved Claude session so it can resume without asking the
user to continue. Its normal session history remains in Claude's runtime storage;
this mode does not edit personal settings or install skills globally. It preserves
the configured output style and passes the exact model identifier observed in the
first phase to subsequent resumes, avoiding Claude's observed context-window-suffix
loss on resume. Direct evaluation retains its existing no-persistence/no-model-flag
behavior. The three phases share one ten-minute and 4 MB budget; output/test checks
keep their separate ten-second limits.

Use `--scenario implement-refuse --claude-checkpoint staged` to test controller
refusal. This starts **zero Claude workflow invocations**, so it is not evidence of
Claude itself refusing the Spec. Other scenarios and Codex reject staged mode.
This controller is repository development tooling for disposable fixtures, not a
bundled launcher for arbitrary projects or certification of native Claude aliases.
It coordinates the workflow; writable shell tools are not an OS security sandbox.
See the [checkpoint recovery report](reviews/2026-09-12-claude-checkpoint-recovery.md)
for actual outcomes and remaining distribution work.

With `--output`, each invocation creates a unique evidence subdirectory containing
logs, its result, the pre-run baseline and the final fixture project. Treat those logs as local debugging
material; they can include incidental personal environment metadata. Without it,
all temporary evidence is removed and the JSON result is printed. The evaluator
checks outputs, content preservation and several report fields; transcript ordering,
semantic review quality and human approval still need review. See
[the pilot evaluation report](reviews/SPEC-b2e3-host-evaluation.md) for actual runs.

For a quick dependency-free check, `git diff --check` and
`bash -n plugin/bin/idd-next-id plugin/bin/idd-archive-scan plugin/scripts/init-idd.sh`
remain available. `bash plugin/bin/idd-archive-scan` produces read-only inventory,
including references from exploration maps and nested decision Markdown; it does
not validate YAML or execute archival.

## Licensing and versioning

Framework documentation, templates, and examples use
[CC BY-SA 4.0](../LICENSE). Plugin contents use [Apache 2.0](../plugin/LICENSE).
New code in `scripts/` and `tests/` also uses Apache-2.0 SPDX headers and the
[Apache license text](../plugin/LICENSE); existing framework fixtures retain their
original license. Preserve attribution; do not copy framework prose into the plugin and silently
relicense it. Author equivalent plugin instructions independently.

Framework versions use major.minor Git tags. The plugin's major.minor matches
the framework; its patch component is for plugin-only iterations. A framework
version change resets the plugin patch to zero. Keep the README badge and
manifest aligned with the release being prepared. Tagging and publishing are
release actions, not implicit consequences of editing documentation.

### Installed guarded execution pilot

The `idd-implement-spec` bundle now includes a self-contained Node >=22.20.0 terminal runner for existing Claude authentication. It requires reviewed `execution_contract` output/check metadata and recorded readiness approval. Use `node <installed-skill>/scripts/idd-execute-spec.mjs --project <project> --spec <SPEC-ID> --check` for read-only preflight; omit `--check` to execute from a separate terminal. Never bypass the nested-session guard. The default preserves the configured model/style; optional `--implementer-model sonnet` requires an observed matching implementation model. The Sonnet option has verified model selection but remains experimental after a failed full workflow trace review. Native alias certification remains separate.

The bundle carries the pinned YAML parser and ISC license; consuming projects need no dependency installation. Failures preserve partial work and controller evidence, and require author recovery. See [guarded execution](../plugin/references/pilot/guarded-execution.md) for ownership, limits and report rules. Optional contributor host evaluation: `node scripts/evaluate-installed-execution.mjs` (or `--negative`, `--sonnet`). Offline tests use simulated host receipts and do not replace actual host evidence.

### Authoring stage evaluation

Five standalone authoring bundles now share `plugin/references/authoring/authoring.md`; edit sources and rebuild. They preserve existing command/agent frontmatter while keeping stakeholder interaction and saving in the main conversation. The catalog drives individual copy/symlink installation checks for both hosts (64 individual combinations including the synthetic probe and all fifteen stages). The ID helper is exercised after copy-source removal and creates no artifact directories.

Use `node scripts/evaluate-authoring.mjs --host codex --stage quick-spec` or select `--host claude`. Optional `--variant missing-confirmation` applies to define-expectations; `--variant accelerated-rejected-edge` applies to define-outcomes/quick-spec. Each case creates a fresh copied installation, removes its copy source, preserves dirty notes, bounds one configured-model session to ten minutes/4 MiB and retains evidence under its reported OS-temp directory. Default tests and CI invoke no models.

Acceptance requires five happy stages plus missing-confirmation and both accelerated rejections in each host: 16 actual trace-reviewed successes. Other negative/concurrency cases have deterministic acceptance-oracle coverage; that is not production-writer or actual interleaving evidence. The oracle requires exact supplied fixture strings and rejects operational errors masquerading as workflow refusals. See [authoring host evidence](reviews/SPEC-8406-host-evaluation.md). Native aliases and human peer review remain separate.

### Review stage evaluation

The canonical sources for tech-review, deep-review and review-spec are in `plugin/workflows/` and `plugin/references/review/`. Rebuild all three bundles together. `node scripts/evaluate-reviews.mjs --host codex --stage tech-review` (or Claude) uses a fresh copied installation with source removal, configured models, ten-minute/4 MiB bounds and retained original evidence. `--variant contradiction` applies to tech-review; `--variant broken` applies to review-spec.

Acceptance requires those two negative cases plus all three happy stages in each host, with current output checks and independent full-trace review. The deep fixture uses explicitly unavailable dispatch and must truthfully cover all three perspectives sequentially. Offline receipt simulations do not certify real parallel/partial delegation. The good validation fixture intentionally returns Needs Changes because human wording and historical preservation remain unverified. See [review evidence](reviews/SPEC-44b9-host-evaluation.md).

### Forge process evaluation

`node scripts/evaluate-forge.mjs --host codex --variant success` (or Claude, or `failure`) exercises a copied standalone launcher with its copy source removed. The purpose-built npx shim records exact argv/cwd and owned process identity outside the consumer, serves loopback for a live inspection, and supports a deterministic startup failure. Child-only PATH leaves personal settings unchanged; tests never execute the public package. Loopback binding needs an environment that permits local listening. Each host run is bounded to600seconds/4MiB; startup inspection to30seconds. Cleanup targets only recorded processes after verifying command identity, with any remaining process reported as failure.

Default tests include a real controlled local process but no models or public package installs. Offline argument/receipt oracles are not the production model launcher. Read [Forge host evidence](reviews/SPEC-e1d4-host-evaluation.md) for measured cases and remaining native/UI/persistence limits.

Codex controlled evaluation enables network per invocation while retaining filesystem sandboxing; it is not a loopback-only policy. It saves normal owned session history to collect background tool returns, checks exact UUID/project provenance, and copies only bounded tool records into evidence. Personal configuration is unchanged.

### Exploration evaluation

Canonical chart/resolve procedures and format live in `plugin/references/exploration/`; edit and rebuild both standalone bundles. The legacy Exploration reference receives only the explicit terminal correction. Optional `node scripts/evaluate-exploration.mjs --host codex --scenario task` (or Claude) creates a disposable project with unrelated staged and further dirty notes, configured fixture Git identity and local factual sources. Cases: chart, no-fog, task, hitl, blocked, research-failure.

Twelve actual observations and independent full traces are required. Codex resolve receives a per-invocation writable root only for that fixture’s Git metadata, enabling the authorized path-scoped claim while personal configuration stays unchanged. All research is local and worker dispatch is explicitly unavailable. Each configured-model case is bounded600seconds/4MiB with copy-source removal and original receipts. These observations do not certify native aliases, competing real sessions or every prototype/external tool. Default tests validate acceptance oracles and actual fixture Git behavior, without model calls. See [exploration evidence](reviews/SPEC-c11a-host-evaluation.md).

## Archive workflow verification

Canonical archival resources live in `plugin/references/archive/`. Rebuild after edits. `node scripts/evaluate-archive.mjs --host codex --scenario apply` (or Claude) runs an optional bounded model observation in a disposable Git repository. Cases are classify, apply, dirty and undistillable. The fixture supplies explicit fictional manifest approval; it never archives this project or certifies its human review.

Default offline tests exercise acceptance oracles, including binary tag recovery, reviewed-input staleness after committed changes, complete Exploration removal, old-ledger/tag preservation, exact review attribution and safe move destinations. Actual trials require independent full-trace review in addition to output oracles. Source hashes are captured at module load. Each host invocation retains copied-bundle/prompt/trace receipts, uses existing configured authentication and a 600-second/4-MiB bound; Codex apply receives only the disposable Git metadata as an additional writable root. No personal settings change or remote push occurs. See [Archive host evidence](reviews/SPEC-57b4-host-evaluation.md).

For Archive evaluator latency diagnosis only, `--host claude --claude-effort medium` sets reasoning effort for that one session while preserving the configured model and output style. The default remains configured. Receipts record the option; it does not change installed workflow behavior, personal settings, required phase checks or the600-second/4-MiB bound. Acceptance applies only to the measured effort lane.

After documented preparation timeouts, Archive evaluation additionally accepts `--host claude --scenario apply --timeout-seconds 1200`. This explicit twenty-minute lane retains the4-MiB output cap; all other cases and the default remain600seconds. Invalid host/case/value combinations fail before fixture creation. Requested/effective timeout and effort are recorded. This contributor experiment does not alter the shipped workflow.


## Router distribution verification

The router has all fifteen stage closures under `stages/<stage>/`, with nested
`workflow.md` entries and one public root `SKILL.md`. Catalog mappings reuse each
direct source exactly. The only direct workflow/runtime changes in this milestone
are interview's loaded-entry root clarification and guarded execution's safe
`SKILL.md`/`workflow.md` entry selection. All three handoffs use that resolved entry.

`npm run test:install` now covers68 individual combinations (sixteen bundles plus
the synthetic probe, two hosts, two modes). These are not bulk lifecycle tests.
Run `node scripts/evaluate-router.mjs --host codex --scenario installer` (or
`claude`, optional `--default-mode`) for actual pinned discovery, bulk installation,
list, local update no-op, explicit host/requested-mode-preserving refresh and selected
removal. Four separate combinations are required. Retained canonical directories
are compared byte-for-byte and reported still installed: skills1.5.25 may keep
shared `.agents/skills` content for other detected hosts despite a removal success
message. Do not manually remove shared skills to make a test pass.

Optional actual-host cases are `--scenario outcomes` and `--scenario missing` for
both hosts, and `--host claude --scenario controller` from an outer terminal.
They install only a copied router, remove its source and preserve unrelated dirty
notes. Routing cases stop before authoring. The controller copies the existing
gated fixture unchanged and exercises the original three-phase controller API
through its nested installation. Configured models,600seconds/4MiB and existing
credentials apply; no nested-session guard is cleared. Evidence is retained in
OS-temp and source hashes are captured when modules load. Independent full-trace
review is required beyond final-text/output oracles. These observations do not
certify native aliases, a desktop fresh session, remote updates, release or actual
human peer review. See [router evidence](reviews/SPEC-ab84-host-evaluation.md).

Pinned installer mode detail: targeting a single host forces copy, even without `--copy`. The four bulk observations compare explicit copy and default requests while recording actual copy mode. Genuine Claude symlinks are tested separately by the individual probe, which targets Codex and Claude together. Refresh retains actual mode; no additional host is silently selected to force a symlink.

Archive contributor diagnostics also permit explicit `--claude-effort low` after recorded medium-effort timeouts. This retains the configured model/style and existing bounds, with lane-qualified evidence. First Git HEAD/index/config/refs must remain bound to the original capture; later checks cannot silently adopt a replacement baseline.


## Native distribution verification

`plugin/plugin.json` follows the portable root schema and fixed `skills/`
discovery. `plugin/.codex-plugin/plugin.json` supplies separate compatibility and
interface fields. The original Claude manifest, userConfig, adapters and generated
skills stay exact. Repository-owned catalogs in `.agents/plugins/` and
`.claude-plugin/` resolve `./plugin` from repository root. Normal package checks
validate their distinct field sets, path safety and metadata agreement.

Run `node scripts/evaluate-native-distribution.mjs --host codex` or `claude` for
isolated native lifecycle observations. Children receive owned client/XDG/Git
state, no copied credentials, explicit project scope where supported,60seconds
per command/4MiB and ten minutes per host. No model runs or personal installations
occur. Unrelated plugins use their own retained marketplace. Default tests run
only offline fixtures and a harmless child-environment probe.

The evaluator checks actual installed inventories and complete cached bytes/modes,
fixture-only cache-buster/marker refresh, source removal, installed helper behavior
and selected plugin/marketplace removal. Codex uses local re-add; marketplace
upgrade is Git-only. Claude details combines15commands+16skills as31skills and
retains cache directories after uninstall. Receipts and failed partial fixtures
are retained, with independent review separate from output checks. See
[native evidence](reviews/SPEC-aa60-native-evaluation.md) and the
[installation guide](installation.md). Archive/Router acceptance and native
implementation closures are complete. Fresh desktop sessions, actual native alias
execution, human review and publication are not inferred from CLI inventory.

## Skills installer compatibility

The documented installer remains `skills@1.5.25`. CI tests that pin and runs a
separate, advisory `latest` check in `skills-compatibility.yml`; a future upstream
failure does not silently change the supported pin or block unrelated work.
The workflow records the resolved version and disables acquisition lifecycle
scripts and installer telemetry. It can also be run through workflow_dispatch.
These are package installation checks, not model execution certification.

Acquire a candidate installer explicitly into a disposable directory:

```bash
npm install --prefix /tmp/skills-candidate --ignore-scripts --no-audit --no-fund --package-lock=false skills@1.7.0
```

Test it without modifying the repository lockfile:

```bash
SKILLS_CLI_PATH=/tmp/skills-candidate/node_modules/skills/bin/cli.mjs SKILLS_EXPECTED_VERSION=1.7.0 node scripts/test-install.mjs
```

The default remains the locked local dependency. Alternate package identity and
version must match explicitly. The suite covers all bundles and repository-root
discovery of the complete router for Codex and Claude.

See [the onboarding verification](reviews/2026-09-20-skills-onboarding.md) for
remote refresh/removal evidence and the separate directory-discovery limitation.
