# CLAUDE.md

Read [AGENTS.md](AGENTS.md) for shared IDD schemas and generation rules, and
[Contributing with AI agents](docs/contributing-agents.md) for repository
structure, source ownership, conventions, licensing, versioning, and checks.
Assessments and planning do not automatically start managed Spec execution.

## Claude Code integration

The distributable plugin lives in `plugin/`. Its [README](plugin/README.md)
lists all 15 `/idd-framework:*` commands and 14 role agents, including phase-0
`chart`/`resolve`, the eight core stages, accelerated workflows, `archive`, and
`forge`. Commands own orchestration; role agents perform the dispatched work.

**Model assignment strategy** (in each agent's frontmatter `model:` field):

- **opus** — reasoning-heavy synthesis: `deep-review-lead`, `tech-lead-reviewer`, `idd-gap-checker` (adversarial cross-block analysis)
- **sonnet** — structured synthesis with codebase scanning: `spec-author`, `quick-spec-author`, `spec-reviewer`, `outcome-author`, `idd-spec-implementer`, `exploration-charter`, `exploration-resolver`, `idd-archivist`
- **haiku** — template-guided decomposition metadata: `product-interviewer`, `intention-author`, `expectation-author`

Portable authoring keeps selection, stakeholder questions, confirmation, validation and saving in the main conversation. Optional `intention-author`/`expectation-author` drafting uses Haiku; `outcome-author`/`quick-spec-author`/`spec-author` drafting uses Sonnet. These roles return read-only proposals. Interview also stays in the stakeholder conversation. Existing role metadata is preserved; it does not authorize background agents to save unconfirmed artifacts.

Assignments are explicit (not `inherit`) so a user running Opus in their main session doesn't pay Opus rates for a stakeholder interview. When editing agents, preserve the model assignment unless the agent's responsibilities materially change tier.

## Resources and configuration

- Edit the router in `plugin/workflows/idd-orchestration.md` and the six references
  in `plugin/references/`; `npm run build:skills` assembles their exact copies into
  `plugin/skills/idd-orchestration/`. The catalog records these mappings.
  Installed agents use these resources through `CLAUDE_PLUGIN_ROOT`; they cannot
  assume this repository's `docs/` is present in the consuming project.
- `plugin/bin/idd-next-id` generates artifact IDs; `plugin/bin/idd-archive-scan`
  provides read-only archive inventory. Create output directories lazily.
- `plugin/hooks/hooks.json` currently defines no hooks.
- `plugin/.claude-plugin/plugin.json` owns plugin identity, version, and
  `userConfig` entries `default_product_id` and `team_name`.

Run `npm run check` and `npm test` for contributor validation. The shared guide
describes setup and the isolated `npm run test:install` probe; it does not establish
that real IDD workflows are portable yet.

## Review and execution

Follow the [canonical lifecycle](docs/framework.md#spec-lifecycle-contract) when
maintaining the framework and the self-contained
[plugin contract](plugin/skills/idd-orchestration/references/spec-reference.md#status-lifecycle)
when running an installed workflow. Technical/deep review annotate outcomes while
preserving lifecycle status. Actual human peer review is required for ready;
execution also requires a current passed gap-check with zero unresolved findings.
Claude model aliases and dispatch directives are specific to this adapter; they
do not select a model for Codex or other hosts.
