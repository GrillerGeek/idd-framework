# Router and distribution assessment

Authoring assessment during the approved unattended migration, September13. This does not authorize implementation before archival acceptance or replace a gated integration Spec. Current completed commits: cba0ea9 review stages,190abb0 Forge; exploration is in progress and archival remains gated draft.

## Complete standalone router

The current orchestration bundle is explicitly legacy-claude, with legacy tool/alias names and references. Every standalone stage must be accepted before converting it. A portable router should select the stage, resolve available context without eager directory creation, explain missing prerequisites, then load that stage's complete local procedure. It must preserve real stakeholder and lifecycle gates and not duplicate policy into another independently maintained procedure.

A router installed alone needs its own complete stage resources. Proposed assembly: copy each accepted stage into a namespaced subtree under the router, renaming that subtree's entry from SKILL.md to workflow.md and preserving its relative references/scripts/vendor paths. This prevents nested entrypoint discovery and resource-name collisions. Root SKILL.md links to those local workflow files. The existing catalog supports explicit destination mappings; no new public installer/package is required. Test this proposal through actual pinned skills discovery before committing to the layout.

The fifteen direct stage skills remain separately installable. The router would be a sixteenth portable bundle, not a sixteenth legacy command. Keep stage inventory and bundle inventory distinct. Existing installer probes iterate each bundle individually; they are not an actual all-skills-at-once installation. Integration must add true bulk install/discovery/update/remove probes and document this distinction, without retroactively calling earlier individual catalog probes bulk acceptance.

Any removal of legacy router outputs must be an explicitly enumerated migration owned by the integration Spec: the assembler correctly refuses unrecognized files rather than silently deleting them. Preserve source licensing and any legacy reference consumers until the new adapter/source impact is accounted for.

## Native packaging

Previously consulted official OpenAI plugin guidance supports a root plugin.json with skills declaration and a Codex marketplace at .agents/plugins/marketplace.json; optional .codex-plugin compatibility is separate. Verify current schema against the installed CLI and primary documentation before authoring final manifest fields. Keep Claude's .claude-plugin/plugin.json and all fifteen command/fourteen agent frontmatters compatible. Models remain host-adapter policy.

Installed local CLI inspection: Codex0.153.4 supports plugin marketplace add/list/upgrade/remove and plugin add/list/remove; add accepts plugin@marketplace and has no scope flag. Claude2.1.269 supports marketplace/install/update/uninstall, manifest validation and component inspection. CLI option inspection is not actual install or alias evidence. Native tests require explicitly isolated disposable client configuration/cache roots and a local marketplace; do not modify personal installations or publish remote listings.

The final Spec should own manifest/marketplace validation, inventory/version assertions and associated fixtures explicitly. Current validators intentionally require version1.6.0 and reviewed original metadata. A planned1.7.0 release preparation may change those reviewed versions together, but must not tag/push/release without separate authorization. Verify current repository identity rather than silently renaming the plugin or moving external marketplace ownership.

## Required acceptance

- Real individual and full-catalog discovery/installation for both hosts, copy and symlink where supported; self-contained router with its source removed.
- Actual update and removal preserve consumer artifacts and an unrelated installed skill. Avoid duplicate native and standalone installations in one host and explain migration choices.
- Native Codex installation exposes expected skills; native Claude local plugin exposes expected aliases and policy metadata. Manifest-only validation is insufficient.
- Bounded real-host routing cases show stage selection, missing prerequisite refusal and complete local resource handoff. Reuse stage evidence rather than claiming every native alias fully certified by discovery alone.
- All offline tests, minimum/current Node, deterministic assembly, exact owned removals, licenses, docs links and report reread pass. Hosted CI and final remote shorthand remain unverified until an authorized push; local branch contents cannot be tested through an unchanged remote default branch.

## Evidence collection learned during stage migration

Codex JSON stdout can omit the partial tool return for a continuing background process. The Forge evaluator now captures bounded original tool records from the exact owned normal rollout, validating UUID/project and hashes; this leaves ordinary owned session history, not personal configuration changes. A final native evaluation should choose its evidence path deliberately before running.

Source/oracle hashes must reflect modules at load time. Earlier long-lived matrix runners could read a newer on-disk file hash while still executing an imported older module. Preserve those original receipts, label them as disk observations, separately revalidate with a frozen current oracle and rely on actual copied bundle/prompt/trace evidence. New exploration tooling captures its module hashes once at load time. This is a contributor evidence issue, not a change to shipped workflow approval rules.

## Refreshed primary-source and local CLI check

The September 13 [official packaging guidance](https://developers.openai.com/plugins/build/plugins) still supports a portable manifest at the plugin root and `.codex-plugin/plugin.json` as compatibility fallback. A repository marketplace's local source path resolves from the repository root, so this project's entry should use `./plugin`, not a path relative to `.agents/plugins`. Keep this distinction in validation fixtures. The documented marketplace policies and category belong in each entry; CLI installation options were confirmed locally rather than inferred from the desktop instructions.

The [official Claude migration guide](https://developers.openai.com/plugins/guides/submit-claude-plugin) calls for reusable commands/agents to become skills and host-specific installation inputs to become explicit workflow context. Preserve the existing Claude `userConfig` only in the Claude manifest; portable stages already resolve actual context explicitly. No MCP integration is needed for these local workflows.
