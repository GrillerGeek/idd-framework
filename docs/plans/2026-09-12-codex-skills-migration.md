# Codex and portable skills implementation plan

Date: 2026-09-12

Baseline: `bf0ec98` on `main`; Claude plugin version `1.6.0`

Status: milestone 1 implemented and verified; SPEC-5113 is in review; packaging milestones pending

Product: `PROD-f67b` — Intent-Driven Development Framework

## Outcome

Contributors can maintain IDD effectively in Codex, and users can run the complete IDD workflow in Codex or Claude Code through either native plugin installation or `npx skills`. Existing Claude `/idd-framework:*` commands continue to work. Workflow definitions have one maintained source, and installation includes everything needed to execute them.

The user accepted the shared-skills approach, requested this plan, and authorized starting work on branch `codex/portable-skills`. This document is a planning artifact, not a Ready Spec or evidence that implementation gates have passed.

## Current progress

- Branch created: `codex/portable-skills`.
- Milestone 1 drafted as `SPEC-5113`, linked to `INT-f2e6` and four Expectations (`EXP-7290`, `EXP-97c0`, `EXP-37d5`, `EXP-4720`).
- Authoring checks pass: valid YAML without duplicate keys, consistent links, minimum edge cases, valid code references, and completeness items 1–10.
- Human peer review approved by Jason Robey on 2026-09-12, including the resolved-coverage policy; recorded in the Spec and peer-review handoff.
- Fresh independent gap-check: `docs/reviews/SPEC-5113-gap-check.md` — zero unresolved blockers and warnings. All 21 accepted omissions remain visible with reviewer-confirmed resolutions.
- Milestone 1 implemented in `2f9c1d8`; `SPEC-5113` progressed ready → in-progress → review through orchestration.
- Verification passed: 63 checks covering inventories, introduced links/anchors, version alignment, protected files, frontmatter, allowlist and Bash syntax. Independent implementation review found one adoption-path inconsistency, now fixed and re-reviewed with no remaining findings.
- Execution evidence: [SPEC-5113 execution report](../reviews/SPEC-5113-20260912T130127Z-execution.md). Human implementation review and later validation remain pending; the earlier approval records Spec peer review.
- Packaging, portable stage workflows, native Codex installation and complete npx skills distribution remain future work. No remote changes were pushed.

## Baseline evidence

- The plugin contains 15 command files, 14 role agents, one orchestration skill, six reference documents, two executable helpers, and an initialization script.
- An isolated `skills@1.5.25` installation targeting Codex and Claude Code succeeded, but copied only the orchestration skill and its six references. Commands, role procedures, and helpers were absent.
- The Bash scripts passed syntax checks; ID generation and the archive inventory passed basic smoke checks. No automated project test suite or CI workflow currently exists.
- Shared contributor guidance is split between `AGENTS.md` and `CLAUDE.md`.
- Technical review currently sets a Spec to `review`, whereas implementation requires `ready`. Gap-check status terminology differs between the artifact reference and commands. Warnings are described as nonblocking in some places, but the implementation gate requires `passed`.
- The Claude marketplace entry is in the separate `GrillerGeek/skills` repository and points at this repository's `plugin/` subdirectory.

## Architecture decisions

### One source, complete installable skills

Keep `plugin/` as the distributable root so the existing marketplace path remains valid. Introduce a small deterministic assembly step: maintain procedures and resources once, then generate complete skill directories that installers can copy independently. Commit assembled output so installation from Git requires no build step.

Proposed layout:

```text
AGENTS.md                         shared contributor and IDD guidance
docs/contributing-agents.md        contributor workflow and validation commands
docs/plans/                       implementation planning
scripts/build-skills.mjs           deterministic package assembly
scripts/check.mjs                  contributor verification entry point
tests/                            fixtures, helper and packaging checks
.github/workflows/validate.yml     automated checks
.agents/plugins/marketplace.json   Codex repository marketplace
plugin/
  plugin.json                     portable plugin manifest for Codex
  .claude-plugin/plugin.json       existing Claude compatibility manifest
  workflows/                      canonical provider-neutral stage procedures
  references/                     canonical templates and workflow contracts
  bin/                            canonical helpers; existing paths retained
  adapters/claude/                 Claude-specific dispatch and command metadata
  skills/
    idd-orchestration/             generated router and bundled workflow references
    idd-interview/                 generated standalone workflow skill
    idd-gap-check/                 generated standalone workflow skill
    idd-implement-spec/            generated standalone workflow skill
    ...                           remaining workflow skills
  commands/                       thin compatibility wrappers for old commands
  agents/                         thin Claude role adapters where needed
```

Each stage skill bundles its procedure, required references, and required scripts. It must work when installed alone: no implicit dependency on another installed skill, the IDD source checkout, `PATH` additions, or `CLAUDE_PLUGIN_ROOT`. Resolve resources relative to the loaded skill and write artifacts relative to the consuming project. Keep library code inside a skill's bundle when a helper imports it.

The orchestration skill remains a natural-language entry point. Its bundle contains the procedures needed for the full workflow, loaded on demand; it does not require all stage skills to be installed. The generator supplies these copies from the same canonical sources. Avoid another full authored copy inside each wrapper or agent.

Use stable `idd-<stage>` skill names. Preserve all 15 old `/idd-framework:<stage>` commands as Claude aliases. Document exact invocation names observed in each host; do not promise that Codex reproduces Claude slash syntax. Keep the router's trigger description focused on choosing or navigating IDD workflows so it does not compete with every stage skill.

### Host behavior

- Interactive interviews and decision tickets run in the main conversation. Reuse supplied information; ask for missing stakeholder decisions rather than making the user repeat answers.
- Shared procedures specify roles, inputs, outputs, and gates. Claude model aliases, tool names, memory settings, and dispatch syntax stay in its adapter.
- Codex uses available native capabilities and the user's configured model by default. Do not encode guessed equivalences between Claude and OpenAI model tiers.
- Deep review and exploration research explicitly request bounded delegation when supported. Document sequential fallback and partial-failure handling. Keep shared Spec, map, and status writes with one orchestrator.
- In sequential execution, retain logical separation between review, authorship, and orchestration responsibilities. A fallback never permits the gap-check reviewer to change Spec content.
- Carry durable decisions in project artifacts and reports. Existing Claude agent memory may remain a convenience, but workflow correctness must not depend on it.
- Explicit invocation arguments override configured defaults. Use available native settings where supported; otherwise ask for missing product/owner information. Do not invent a cross-host settings system in this release.
- Retain lazy artifact-directory creation. The current empty hooks configuration does not justify adding startup hooks.

## Implementation sequence

### 1. Establish contributor guidance and a consistent workflow contract

Primary files: `AGENTS.md`, `CLAUDE.md`, `CONTRIBUTING.md`, `.github/copilot-instructions.md`, `.cursor/rules/idd.mdc`, relevant `docs/` references, templates, and affected review/implementation procedures.

- [x] Move shared repository structure, editing conventions, licensing, versioning, and verification guidance out of Claude-only instructions.
- [x] Clearly distinguish maintaining IDD from running IDD in a consuming project. Assessments and planning do not automatically invoke a gated implementation workflow.
- [x] Define the canonical lifecycle and mutation owner for every transition. Technical review records its outcome without prematurely entering post-implementation `review`; readiness still requires the completeness checklist and human peer review.
- [x] Use `passed`, `blocked`, and `warnings` consistently for new gap-check annotations. Document historical variants without silently rewriting completed artifacts.
- [x] Recommended first-release policy: preserve the strict `ready` plus `gap_check.status: passed` implementation gate. Resolve warnings and rerun gap-check before execution. The approved policy counts only unresolved findings: author-accepted coverage omissions with reviewer-confirmed reasons remain visible as resolved; substantive warnings cannot be waived by acknowledgment.
- [x] Specify behavior for missing IDs, missing reports, repeat gap-checks, precondition failure, interruption, and a blocked implementation. Update one annotation rather than appending duplicate YAML keys. Do not advance an incomplete build to `review` merely because it emitted a report.
- [x] Resolve boundary acknowledgment ordering: restate Boundaries before initialization or status mutations associated with execution, and preserve the implementer's own acknowledgment.
- [x] Identify authoritative schema/reference sources and make their copies verifiable. Add exploration and archival to shared discovery guidance; correct published version and command inventories.

Exit criterion: one reviewed lifecycle contract that can be followed without choosing between contradictory instructions. Human peer review is recorded as a human fact, never inferred from an automated check.

### 2. Build packaging and verification foundations

Primary files: new assembly/check scripts, minimal development package metadata and lockfile, `tests/`, canonical references, and CI configuration.

- [ ] Use Node.js for assembly and tests, with the built-in test runner and a pinned YAML parser for structured checks. This is development tooling, not publication of IDD as an npm package. Declare the minimum runtime after checking installer and tooling requirements.
- [ ] Introduce a catalog mapping each skill to its canonical procedure, required resources, and legacy command alias. Generate the resource copies and thin wrappers from that inventory.
- [ ] Provide `npm run build:skills`, `npm run check`, and `npm test`; check mode must detect stale generated output without modifying it.
- [ ] Check skill metadata, manifest paths, resource containment, executable permissions, standalone resource completeness, and accidental Claude-only instructions in shared procedures.
- [ ] Validate YAML duplicate keys, linked/detail Expectation agreement, required blocks, status values, and minimum edge cases using separate profiles for templates, live artifacts, and intentionally flawed fixtures.
- [ ] Add meaningful helper tests: empty project, malformed inputs, paths with spaces, ID collisions including filename suffixes, exploration directories, and archive inventory references. Scope helper fixes to failures demonstrated by these tests.
- [ ] Add CI using a pinned installer version for reproducible packaging tests. Reuse the same contributor check commands in CI.

Exit criterion: assembly is deterministic, a second build produces no diff, and the checks distinguish valid artifacts from intentionally invalid fixtures without altering history.

### 3. Pilot three portable workflows before bulk conversion

Workflows: `interview`, `gap-check`, and `implement-spec`.

- [ ] Extract reusable instructions from both command and role-agent files. Preserve orchestration steps currently implemented in command prose; moving only agent bodies would lose gates and status changes.
- [ ] Make interview create a Product from stakeholder input with a bundled ID helper and template.
- [ ] Make gap-check handle completeness failure, single-Spec and portfolio review, mandatory Coverage, and report-only reviewer behavior. The orchestrator alone writes annotations.
- [ ] Make implementation verify prerequisites, acknowledge boundaries, implement, self-verify, and emit `spec_gaps_encountered`; preserve blocker/minor distinctions and mutation ownership.
- [ ] Introduce a fixture project with a small executable deliverable and both clean and flawed Specs. Never exercise implementation or archival against this repository's historical artifacts.
- [ ] Install each pilot skill separately through `npx skills` into fresh temporary projects for both hosts. Verify the installed files without access to the original source paths.
- [ ] Run representative fresh-session scenarios in Codex and Claude Code and record tool versions, invocation, outputs, and observed failures.

Exit criterion: all three workflows operate from installed copies in both hosts, with evidence that invalid Specs are refused and the reviewer does not modify Spec content. File installation alone is insufficient.

### 4. Convert the remaining workflow catalog and preserve Claude compatibility

Remaining stages: `chart`, `resolve`, `define-intentions`, `define-expectations`, `define-outcomes`, `quick-spec`, `write-spec`, `tech-review`, `deep-review`, `review-spec`, `archive`, and `forge`.

- [ ] Port artifact authors with consistent context inheritance, ID linkage, confirmed edge cases, and exploration lineage. Apply the same substantive rules to accelerated paths.
- [ ] Port technical/deep review with the lifecycle contract from step 1. Test sequential and delegated review, including partial reviewer failure.
- [ ] Preserve exploration ticket claiming, one non-research decision per session, dependency/frontier rules, and parent-owned map updates. Explicitly document the limits of coordination across separate Git checkouts; do not claim a local commit provides a distributed lock.
- [ ] Preserve archive classify/review/apply separation, committed-manifest preflight, tag-before-delete ordering, record reconciliation, and whole-directory exploration archival. Test lossless recovery from the tag in a disposable Git repository.
- [ ] Adapt Forge process startup, URL capture, and shutdown instructions to each host. Keep Forge an optional external dependency; use a controlled fixture for automation and an actual launch for release verification.
- [ ] Replace substantive duplication in Claude commands/agents with adapters to the canonical procedures. Retain existing role names where useful and preserve documented Claude model behavior in the adapter.
- [ ] Rebuild the orchestration skill as a complete standalone bundle with progressive loading. Avoid installing both native-plugin and standalone copies into the same real environment during validation.

Exit criterion: every existing command has a tested portable counterpart and a working Claude alias. The catalog accounts for all 15 stages and the router.

### 5. Add native Codex packaging and installation documentation

Primary files: `plugin/plugin.json`, `plugin/.claude-plugin/plugin.json`, `.agents/plugins/marketplace.json`, `README.md`, `plugin/README.md`, and contributor documentation.

- [ ] Add the portable manifest for Codex; retain the Claude manifest and synchronize identity/version metadata. Use a Codex compatibility overlay only if required by the tested client.
- [ ] Add a repository marketplace entry pointing to `./plugin`. Verify actual Codex local installation and refresh behavior.
- [ ] Preserve Claude installation through the existing marketplace's `plugin/` path and local `--plugin-dir` development flow.
- [ ] Document project and global `npx skills` installation, selected-stage installation, updates, removal, and exact host invocation syntax. Explain how to choose one installation route per host and avoid duplicate skill discovery.
- [ ] Verify GitHub shorthand discovery as well as explicit plugin/subdirectory sources. Do not rely solely on local recursive discovery behavior.
- [ ] Prepare any required `GrillerGeek/skills` marketplace change as a separate, reviewable follow-up; this repository's release must not silently depend on an unpublished catalog edit.

Proposed project installation, to publish only after verification:

```bash
npx skills add GrillerGeek/idd-framework --agent codex claude-code --skill '*'
```

Exit criterion: native Codex, native Claude, and standalone skills installations resolve the intended skill inventory and all bundled resources from a clean environment.

### 6. Verify, document migration, and prepare the release

- [ ] Run the verification matrix below and record outcomes in `docs/reviews/`.
- [ ] Document behavior changes arising from lifecycle corrections separately from unchanged command compatibility.
- [ ] Reconcile README badges, both manifests, examples, and release notes. Proposed release: `1.7.0` under the repository's shared framework/plugin version policy; confirm against the release baseline before tagging.
- [ ] Prepare a reviewable release diff and migration instructions. Publishing, tagging, remote marketplace updates, and changes to personal installations are later release actions, not part of creating this plan.
- [ ] Document rollback to the prior plugin release and removal of only the newly installed skills. Never delete a user's complete skills directory or rewrite their IDD artifacts to roll back tooling.

Exit criterion: evidence supports both installation and workflow behavior on each advertised host. Any unavailable host test is explicitly outstanding, rather than reported as a pass.

## Verification matrix

| Area | Required evidence |
|---|---|
| Native installation | Codex plugin installation and Claude marketplace/local loading expose expected skills and aliases |
| Standalone installation | Each skill installs alone, plus complete-catalog installation, for both hosts; copy and symlink modes resolve resources |
| Project isolation | Run outside the source checkout; no writes into the installed bundle; no setup-time artifact directories |
| Skill resources | Templates, role procedures, scripts, and helper dependencies remain inside each installed unit |
| Authoring | Product through Spec link correctly; context inheritance works; at least two confirmed edge cases; no duplicate YAML keys |
| Gap-check | Clean and flawed fixtures, incomplete inputs, portfolio coverage/conflicts, repeat runs, and Spec-content byte identity during reviewer execution |
| Implementation | Refuse missing/blocked/warnings gate states; acknowledge Boundaries; distinguish minor and blocker gaps; verify deliverables; preserve pre-existing user changes |
| State ownership | Technical review does not enter post-build review; orchestrator changes statuses; failed or interrupted builds do not advance |
| Exploration | Claim and resolve one decision; respect dependencies; handle failed research; serialize map writes; preserve lineage |
| Archival | Classification causes no deletion; dirty tree/missing manifest fail safely; records reconcile; tag restores every removed file, including exploration assets |
| Host degradation | Missing delegation or optional tooling yields a documented fallback or actionable stop; no fabricated tool calls |
| Updates/removal | Only managed installation files change; project artifacts and unrelated skills survive; duplicate installation guidance is accurate |
| Documentation | Current inventory/version, install examples, helper commands, licensing boundaries, and contributor checks agree |

Deterministic checks validate packaging and mechanical contracts. Fresh agent sessions validate reasoning and interaction. Neither substitutes for the other or for required human peer review. Initial shell-supported targets are macOS and Linux; Windows claims require explicit testing, with WSL/Git Bash prerequisites documented if used.

## IDD execution handoff

Before implementation, author linked draft Intentions, Expectations, and focused Specs under `PROD-f67b`, using generated immutable IDs. Suggested Spec boundaries:

1. Contributor guidance and lifecycle contract — step 1.
2. Assembly, verification foundations, and pilot — steps 2–3.
3. Artifact authoring and review portability — corresponding portions of step 4.
4. Exploration portability — charting, resolving, research coordination, and lineage from step 4.
5. Archival portability — classification, review/apply, reconciliation, and recovery from step 4.
6. Forge launcher portability — process lifecycle and optional-tool behavior from step 4.
7. Router completion, distribution, migration guidance, and release verification — integration after the stage ports, then steps 5–6.

Each Spec needs measurable Expectations with at least two edge cases, explicit file ownership, Boundaries, deliverables, automated checks, and human review items. Identify overlapping generated outputs and assign their integration to one owner. Run portfolio coverage against the union of deliverables, including templates and examples. Establish readiness and peer review, run gap-check, fix blockers in the Specs, and execute only after the documented gate passes. This plan does not mark those future Specs Ready.

## Scope boundaries

- Preserve IDD's purpose hierarchy, five mandatory blocks, minimum edge cases, report-only gap-check, and human decision ownership.
- Keep legacy IDs and existing artifact content readable. Do not bulk-reformat or retroactively certify historical artifacts.
- Keep framework documentation under CC BY-SA 4.0 and plugin content under Apache 2.0. Preserve attribution and do not silently relicense framework text when moving resources into plugin bundles.
- Do not rewrite Forge or Guildhall, create an MCP server, build a custom installer, or publish an IDD npm package for this migration.
- Do not require account-wide permission changes, hard-coded personal paths, globally installed IDD helpers, or a specific model subscription.
- Do not add persistent background automation or hooks merely to install skills.

## Source basis

OpenAI directs Claude plugin authors to move reusable commands and agent procedures into skills; that is the basis for extracting workflow content rather than copying Claude agent definitions unchanged. [Migration guidance](https://developers.openai.com/plugins/guides/submit-claude-plugin).

Current OpenAI packaging guidance supports a portable root `plugin.json`, with `.codex-plugin/plugin.json` retained as a compatibility option. Marketplace packaging is separate from workflow authoring. Verify supported client versions during the pilot. [Plugin packaging](https://developers.openai.com/plugins/build/plugins).

The skills installer supports GitHub sources, explicit agent selection, individual skills, and project/global installation. The local assessment tested version `1.5.25`; pin the version used by CI and record later upgrades. [Installer source and usage](https://github.com/vercel-labs/skills).
