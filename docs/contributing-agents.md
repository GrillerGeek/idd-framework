# Contributing with AI agents

Start with [AGENTS.md](../AGENTS.md) for artifact schemas and generation rules,
[framework.md](framework.md) for the canonical process, and
[autonomy.md](autonomy.md) for the reasoning behind it. This guide applies to
Codex, Claude Code, Copilot, Cursor, and human contributors.

## Maintaining IDD versus executing a Spec

This repository contains framework documentation, YAML artifacts and templates,
JSON plugin metadata, and Bash helpers. It has no application build, dependency
manifest, automated test suite, or CI workflow at this baseline.

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
There are no working repository `npm run check` or skill assembly commands yet.

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
| `plugin/commands/`, `plugin/agents/` | Claude orchestration and role procedures; frontmatter owns names and models |
| `plugin/skills/idd-orchestration/` | Router and bundled Markdown references available to installed agents |
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
must stand alone after installation. When changing the lifecycle, reconcile it
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

## Validation available now

Run these from the repository root; Git, Bash and Python 3 suffice:

```bash
git diff --check
bash -n plugin/bin/idd-next-id plugin/bin/idd-archive-scan plugin/scripts/init-idd.sh
python3 -m json.tool plugin/.claude-plugin/plugin.json > /dev/null
python3 -m json.tool plugin/hooks/hooks.json > /dev/null
bash plugin/bin/idd-archive-scan
```

The archive scan is read-only. It is an inventory, not artifact validation.
`bash -n` checks syntax without running initialization or creating artifacts.
For content changes, inspect the diff, follow changed local links, compare command
and agent inventories against [plugin/README.md](../plugin/README.md), and walk
the affected workflow's success and failure cases. Check YAML with a parser that
rejects duplicate keys when one is available; Python's standard library has no
YAML parser. Separate live artifacts, templates, and intentionally flawed fixtures
so a negative example is not mistaken for a broken production artifact.
These checks do not exercise host behavior or establish human peer review.

## Licensing and versioning

Framework documentation, templates, and examples use
[CC BY-SA 4.0](../LICENSE). Plugin contents use [Apache 2.0](../plugin/LICENSE).
Preserve attribution; do not copy framework prose into the plugin and silently
relicense it. Author equivalent plugin instructions independently.

Framework versions use major.minor Git tags. The plugin's major.minor matches
the framework; its patch component is for plugin-only iterations. A framework
version change resets the plugin patch to zero. Keep the README badge and
manifest aligned with the release being prepared. Tagging and publishing are
release actions, not implicit consequences of editing documentation.
