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

Codex can maintain this checkout through AGENTS.md and this guide. The currently
packaged workflow integration is the [Claude Code plugin](../plugin/README.md).
Native Codex packaging and complete standalone `npx skills` installation are
planned in the [migration plan](plans/2026-09-12-codex-skills-migration.md).
The three standalone pilot skills are `idd-interview`, `idd-gap-check` and
`idd-implement-spec`. The other twelve stages and native Codex distribution remain
pending. See the [pilot instructions](../plugin/README.md#portable-workflow-pilot)
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
| `plugin/commands/`, `plugin/agents/` | Claude entry points; pilot bodies are thin adapters, remaining stages retain their procedures; frontmatter owns names and models |
| `plugin/workflows/`, `plugin/references/` | Canonical router, portable pilot procedures and reference sources; edit these |
| `plugin/skill-catalog.json` | Explicit source/destination mappings and pending stage inventory |
| `plugin/skills/` | Committed generated legacy router and standalone pilot bundles; rebuild rather than edit |
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
`plugin/references/spec-reference.md`; `npm run build:skills` updates the bundled
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
resources. Three catalog stages are `pilot` and require matching portable bundles;
the other twelve remain `planned` and must not emit placeholder skills. Pilot
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
