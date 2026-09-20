# Install IDD in Codex or Claude Code

This checkout contains sixteen portable skills: fifteen workflow stages and one
router with every stage resource included. Native packaging supports both clients
and preserves Claude's fifteen commands, fourteen agents and two optional
configuration fields. Installation does not create IDD artifacts or add npm
dependencies to a consuming project.

Plugin **1.7.1** is available on the repository's `main` branch. The commands
below use the repository-owned catalogs directly; their `-local` names are stable
identifiers and do not mean a local clone is required. IDD works independently;
Guildhall is optional. See [using IDD with Guildhall](../README.md#optional-use-with-guildhall)
if you want to add its coding workflow.

## Choose one installation

| Choice | What it provides |
|---|---|
| Native Codex plugin | All sixteen skills through Codex's plugin installation |
| Native Claude plugin | Sixteen portable skills plus the existing fifteen commands and fourteen role agents |
| Standalone router | One `idd-orchestration` skill containing every stage, template and helper |
| Individual standalone skills | Only the explicitly selected stages |

Avoid installing the same skills through both native and standalone routes in one
client. Native Claude's component display groups commands with skills: `Skills(31)`
means fifteen legacy commands plus sixteen portable skills, not 31 distinct stages.

## Prerequisites and optional local development

Consumers need their host CLI and Git for native installation. The `npx skills`
route also needs Node.js and npm. Generated bundles are committed; installing
from GitHub does not require building this repository.

Installed IDD helpers use Bash. Workflows that parse YAML need a safe parser
available in their host. The optional guarded implementation runner requires
Node.js **22.20.0+** and an authenticated Claude terminal. It is distinct from
Guildhall's execution route. Missing prerequisites must be reported before writes.

Only contributors preparing a local source checkout need:

```bash
npm ci
npm run build:skills
npm run check
npm test
```

Run these with Node.js 22.20.0+ in the source checkout. Consumers do not need its
development `node_modules`. To install local changes, replace the GitHub source
in a marketplace command with `/absolute/path/to/idd-framework`.

## Native Codex

In a terminal:

```bash
codex plugin marketplace add GrillerGeek/idd-framework --ref main --json
codex plugin add idd-framework@idd-framework-local --json
codex plugin list --marketplace idd-framework-local --json
```

The repository-owned `.agents/plugins/marketplace.json` resolves `./plugin` from
the repository root. Portable discovery uses `plugin/skills/`; the separate
`.codex-plugin/plugin.json` supplies compatibility/display metadata.

For a Git-backed installation, refresh the catalog and installed plugin:

```bash
codex plugin marketplace upgrade idd-framework-local --json
codex plugin add idd-framework@idd-framework-local --json
```

Start a new client session after updating. In Codex, invoke `$idd-orchestration`
to choose a workflow, or a stage such as `$idd-interview` directly.

For a local-path catalog, update/build the source and repeat `codex plugin add`;
`marketplace upgrade` applies to Git catalogs. All three package manifests must
agree on the version for installer-visible changes.

To remove this selected plugin and its local catalog:

```bash
codex plugin remove idd-framework@idd-framework-local --json
codex plugin marketplace remove idd-framework-local --json
```

The observed Codex CLI removes IDD's installed cache versions and preserves a
plugin registered through a different marketplace.

## Native Claude Code

From the consuming project:

```bash
claude plugin marketplace add https://github.com/GrillerGeek/idd-framework.git --scope project
claude plugin install idd-framework@idd-framework-local --scope project --json
claude plugin list --json
claude plugin details idd-framework@idd-framework-local
```

The repository's `.claude-plugin/marketplace.json` also resolves `./plugin` from
the root. Existing `/idd-framework:*` command names and role/model metadata remain
unchanged. The installer may note that `default_product_id` and `team_name` are
unset; configure them in Claude if desired. They are not credentials.

Restart Claude Code and try `/idd-framework:interview` to start a Product.
To refresh the catalog and installed plugin:

```bash
claude plugin marketplace update idd-framework-local
claude plugin update idd-framework@idd-framework-local --scope project --json
```

Restart the client to pick up changed components. Remove only IDD when finished:

```bash
claude plugin uninstall idd-framework@idd-framework-local --scope project --json
claude plugin marketplace remove idd-framework-local --scope project
```

The observed Claude CLI unregisters IDD and removes its project settings entries,
while cached version directories remain. This is uninstallation, not cache
purging. An unrelated plugin in a separate marketplace remains registered and
unchanged. Do not remove a marketplace shared by plugins you want to retain.

## Standalone skills through the pinned installer

From the consuming project, install only the complete router:

```bash
npx --yes skills@1.5.25 add https://github.com/GrillerGeek/idd-framework/tree/main --agent codex --skill idd-orchestration --copy --yes
```

Use `--agent claude-code` for Claude, or select both agents explicitly. Replace
`--skill idd-orchestration` with a direct stage to install it alone.
Use `npx --yes skills@1.5.25 add https://github.com/GrillerGeek/idd-framework/tree/main --list`
to discover all sixteen names. For bulk installation, select `--skill '*'` with the desired hosts.

Pinned 1.5.25 forces copy for a single host, even without `--copy`. When both Codex
and Claude are selected without `--copy`, Claude uses a symlink into the project's
canonical `.agents/skills`; it does not link to the source checkout. Installed
copies and router resources were verified after source removal.

Local sources are skipped by `skills update`. To refresh, repeat the original
`add` command with the same source, skill, host and copy options. Do not call the
local update no-op a successful content update. Remote update behavior has not
been inferred from the local refresh tests.

Remove a named standalone skill with:

```bash
npx --yes skills@1.5.25 remove idd-orchestration --agent codex --yes
```

Use `claude-code` for Claude and explicit names for other selected skills. Avoid
`--all` across unrelated skills. Verify paths afterward: the installer may report
success while retaining `.agents/skills/<name>` for other detected hosts sharing
that directory. Retained copies remain installed, including for Codex. Do not
silently broaden deletion to other hosts to force complete removal.

## Evidence and remaining checks

[Router evidence](reviews/SPEC-ab84-host-evaluation.md) separates 68 individual
installation combinations, four bulk lifecycle observations and five actual host
routing/controller observations. [Native evidence](reviews/SPEC-aa60-native-evaluation.md)
records isolated Codex/Claude install, refresh, source-removal and uninstall probes,
including the retained failed Codex Git-upgrade attempt. Those native checks invoke
no models and edit no personal client configuration or credentials.

Published-main installation was checked on 2026-09-20 in isolated profiles for
native Codex, native Claude and the standalone router on both hosts. Installed
contents and modes matched plugin 1.7.1 from main `6c7b6f9`. This is installation
evidence, not a new native-alias runtime evaluation. Actual human review, native
alias workflow execution and fresh desktop discovery retain their separate
verification requirements. Authoritative
manifest and client references are the [OpenAI plugin guide](https://developers.openai.com/plugins/build/plugins),
[portable plugin schema](https://agent-plugins.org/schemas/1.0.0/plugin.schema.json),
[Claude marketplace guide](https://code.claude.com/docs/en/plugin-marketplaces) and
[Claude plugin reference](https://code.claude.com/docs/en/plugins-reference).
