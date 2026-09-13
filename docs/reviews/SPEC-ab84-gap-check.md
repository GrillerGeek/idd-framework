PASS — 0 blockers, 0 warnings

# Gap-check: SPEC-ab84

Initial review BLOCKED — 2 blockers, 11 warnings. Independent reviewer: gap_check_bffd, September 13. Original reviewed SHA-256: 9bb8195bb59655b5f4948bf0513bbd86863cfbdc0be26cedfafccd5179658f9b. Completeness 1–10 and linked/detail parity passed. Human peer review remains pending. The author has revised the Spec; the fresh independent review below passes the revised contract.

## GC-1

**Severity:** Blocker
**Spec block(s):** layout, Expectations, Boundaries and Deliverables
**Quoted text:** “with only its SKILL.md destination renamed workflow.md”
**Why an implementer must guess:** The guarded runner constructs a SKILL.md path and interview derives its directory from that filename. The proposed renamed nested entry cannot satisfy those assumptions while runtime/direct edits are prohibited.
**Resolving question:** What explicit supported nested entry/root contract makes both paths valid, and how will it be tested within owned Deliverables?

Author revision: narrowly own interview entry-root wording and runner safe SKILL.md/workflow.md resolution, generated direct copies, synthetic full-protocol/path tests and a fifth actual nested controller observation. Preserve every other gate and behavior. Resolved in the fresh independent review.

## GC-2

**Severity:** Blocker
**Spec block(s):** installer contract, EXP-88ea, Validation and Boundaries
**Quoted text:** “Four independent bulk/update/remove host-mode combinations pass”
**Why an implementer must guess:** Pinned skills1.5.25 skips local sources for project updates. Its Git-backed update child also omits explicit host/copy arguments, so the assumed local update and mode-preservation evidence cannot be obtained as written.
**Resolving question:** Which supported source/update invocation and host/mode expectations define these passes?

Author revision: measure and document the real project-scoped update no-op for local sources, then separately verify an explicit local re-add refresh with host/name/copy arguments. Do not claim successful update from the no-op or remote update from refresh. Resolved in the fresh independent review.

## Initial coverage

Seventeen initial candidates: six independently accepted omissions and eleven unresolved warnings. The author now explicitly accepts all eleven omissions, pending independent verification: .github/copilot-instructions.md, .github/pull_request_template.md, .cursor/rules/idd.mdc, CONTRIBUTING.md, tests/authoring.test.mjs, tests/helpers/archive-workflows.mjs and five dated migration/authoring/recovery assessments. Shared links remain valid, direct tests and unrelated fixture README semantics remain unchanged, and historical planning is distinct from separately owned progress tracking.

The six initially accepted omissions were AGENTS.md, scripts/lib/assembly.mjs, scripts/lib/packages.mjs, scripts/test-install.mjs, tests/pilot.test.mjs and docs/superpowers/plans/2026-07-28-exploration-phase-0.md. Generic mappings/validation and fifteen-stage assertions remain valid; compatibility reference paths are preserved. The revised runner/interview paths are explicitly owned, not omissions. Artifact/review trees were excluded from the sweep; templates, examples and hidden host entry points were included. Fresh review must verify the revised impact surface before passing the gate.

## Fresh independent verdict

Reviewer gap_check_bffd; September 13. Reviewed revised Spec SHA-256 before gate upsert: 6d38042404a18e779766a3f667ffa6c2b4e3fb6f683ab41c4faf08fc58eb979d. Completeness 1–10 and all linked/detail parity pass. GC-1 and GC-2 resolved; no new content findings. Human peer review remains pending under session authorization; accepted and committed Archive remains prerequisite.

## Coverage

Fresh sweep: 55 candidates, all independently resolved with reasoned author dispositions. Artifact/review trees excluded; templates, examples and hidden entry points included. No unmet validation dependency.

| File | Evidence term and line | Severity | Disposition | Resolution |
|---|---|---|---|---|
| AGENTS.md | CLAUDE.md, line 3 | Warning | accept-omission | resolved — Shared guide links or generic catalog-driven implementation remain valid. |
| CONTRIBUTING.md | contributing-agents.md, line 38 | Warning | accept-omission | resolved — Shared guide links or generic catalog-driven implementation remain valid. |
| .cursor/rules/idd.mdc | contributing-agents.md, line 8 | Warning | accept-omission | resolved — Shared guide links or generic catalog-driven implementation remain valid. |
| .github/copilot-instructions.md | contributing-agents.md, line 3 | Warning | accept-omission | resolved — Shared guide links or generic catalog-driven implementation remain valid. |
| .github/pull_request_template.md | contributing-agents.md, line 15 | Warning | accept-omission | resolved — Shared guide links or generic catalog-driven implementation remain valid. |
| scripts/lib/assembly.mjs | skill-catalog.json, line 6 | Warning | accept-omission | resolved — Shared guide links or generic catalog-driven implementation remain valid. |
| scripts/lib/packages.mjs | skill-catalog.json, line 49 | Warning | accept-omission | resolved — Shared guide links or generic catalog-driven implementation remain valid. |
| scripts/test-install.mjs | skill-catalog.json, line 24 | Warning | accept-omission | resolved — Shared guide links or generic catalog-driven implementation remain valid. |
| scripts/evaluate-exploration.mjs | SKILL.md, line 8 | Warning | accept-omission | resolved — Standalone entry remains; nested evaluation newly owned. |
| scripts/evaluate-forge.mjs | SKILL.md, line 18 | Warning | accept-omission | resolved — Standalone entry remains; nested evaluation newly owned. |
| scripts/evaluate-reviews.mjs | SKILL.md, line 8 | Warning | accept-omission | resolved — Standalone entry remains; nested evaluation newly owned. |
| scripts/evaluate-archive.mjs | SKILL.md, line 6 | Warning | accept-omission | resolved — Standalone entry remains; nested evaluation newly owned. |
| scripts/evaluate-pilot.mjs | SKILL.md, line 35 | Warning | accept-omission | resolved — Standalone entry remains; nested evaluation newly owned. |
| scripts/evaluate-authoring.mjs | SKILL.md, line 19 | Warning | accept-omission | resolved — Standalone entry remains; nested evaluation newly owned. |
| tests/pilot.test.mjs | skill-catalog.json, line 20 | Warning | accept-omission | resolved — Existing independent fixtures/protocol assertions remain; new tests own alternate layout. |
| tests/authoring.test.mjs | SKILL.md, line 27 | Warning | accept-omission | resolved — Existing independent fixtures/protocol assertions remain; new tests own alternate layout. |
| tests/installed-execution.test.mjs | runner.mjs, line 10 | Warning | accept-omission | resolved — Existing independent fixtures/protocol assertions remain; new tests own alternate layout. |
| tests/checkpoint.test.mjs | SKILL.md, line 34 | Warning | accept-omission | resolved — Existing independent fixtures/protocol assertions remain; new tests own alternate layout. |
| tests/assembly.test.mjs | SKILL.md, line 31 | Warning | accept-omission | resolved — Existing independent fixtures/protocol assertions remain; new tests own alternate layout. |
| tests/helpers/archive-workflows.mjs | README.md, line 24 | Warning | accept-omission | resolved — Existing independent fixtures/protocol assertions remain; new tests own alternate layout. |
| tests/fixtures/plugin-inventory.json | interview.md, line 12 | Warning | accept-omission | resolved — Existing independent fixtures/protocol assertions remain; new tests own alternate layout. |
| tests/fixtures/pilot/project/docs/specs/SPEC-a1b2.yaml | SKILL.md, line 134 | Warning | accept-omission | resolved — Existing independent fixtures/protocol assertions remain; new tests own alternate layout. |
| tests/fixtures/installed-execution/docs/specs/SPEC-c0de-greeting.yaml | SKILL.md, line 134 | Warning | accept-omission | resolved — Existing independent fixtures/protocol assertions remain; new tests own alternate layout. |
| plugin/runtime/idd-execute-spec.mjs | runner.mjs, line 5 | Warning | accept-omission | resolved — CLI root derivation and runtime API unchanged. |
| plugin/skills/idd-implement-spec/scripts/idd-execute-spec.mjs | runner.mjs, line 5 | Warning | accept-omission | resolved — CLI root derivation and runtime API unchanged. |
| plugin/agents/quick-spec-author.md | SKILL.md, line 31 | Warning | accept-omission | resolved — Direct entry and native metadata remain valid. |
| plugin/agents/idd-archivist.md | SKILL.md, line 33 | Warning | accept-omission | resolved — Direct entry and native metadata remain valid. |
| plugin/agents/exploration-resolver.md | SKILL.md, line 31 | Warning | accept-omission | resolved — Direct entry and native metadata remain valid. |
| plugin/agents/exploration-charter.md | SKILL.md, line 31 | Warning | accept-omission | resolved — Direct entry and native metadata remain valid. |
| plugin/agents/spec-author.md | SKILL.md, line 31 | Warning | accept-omission | resolved — Direct entry and native metadata remain valid. |
| plugin/agents/product-interviewer.md | SKILL.md, line 31 | Warning | accept-omission | resolved — Direct entry and native metadata remain valid. |
| plugin/agents/outcome-author.md | SKILL.md, line 31 | Warning | accept-omission | resolved — Direct entry and native metadata remain valid. |
| plugin/agents/intention-author.md | SKILL.md, line 31 | Warning | accept-omission | resolved — Direct entry and native metadata remain valid. |
| plugin/agents/expectation-author.md | SKILL.md, line 31 | Warning | accept-omission | resolved — Direct entry and native metadata remain valid. |
| plugin/commands/write-spec.md | SKILL.md, line 7 | Warning | accept-omission | resolved — Direct entry and native metadata remain valid. |
| plugin/commands/quick-spec.md | SKILL.md, line 7 | Warning | accept-omission | resolved — Direct entry and native metadata remain valid. |
| plugin/commands/chart.md | SKILL.md, line 7 | Warning | accept-omission | resolved — Direct entry and native metadata remain valid. |
| plugin/commands/define-outcomes.md | SKILL.md, line 7 | Warning | accept-omission | resolved — Direct entry and native metadata remain valid. |
| plugin/commands/forge.md | SKILL.md, line 7 | Warning | accept-omission | resolved — Direct entry and native metadata remain valid. |
| plugin/commands/interview.md | SKILL.md, line 7 | Warning | accept-omission | resolved — Direct entry and native metadata remain valid. |
| plugin/commands/resolve.md | SKILL.md, line 7 | Warning | accept-omission | resolved — Direct entry and native metadata remain valid. |
| plugin/commands/deep-review.md | SKILL.md, line 7 | Warning | accept-omission | resolved — Direct entry and native metadata remain valid. |
| plugin/commands/gap-check.md | SKILL.md, line 7 | Warning | accept-omission | resolved — Direct entry and native metadata remain valid. |
| plugin/commands/implement-spec.md | SKILL.md, line 7 | Warning | accept-omission | resolved — Direct entry and native metadata remain valid. |
| plugin/commands/tech-review.md | SKILL.md, line 7 | Warning | accept-omission | resolved — Direct entry and native metadata remain valid. |
| plugin/commands/define-intentions.md | SKILL.md, line 7 | Warning | accept-omission | resolved — Direct entry and native metadata remain valid. |
| plugin/commands/review-spec.md | SKILL.md, line 7 | Warning | accept-omission | resolved — Direct entry and native metadata remain valid. |
| plugin/commands/archive.md | SKILL.md, line 7 | Warning | accept-omission | resolved — Direct entry and native metadata remain valid. |
| plugin/commands/define-expectations.md | SKILL.md, line 7 | Warning | accept-omission | resolved — Direct entry and native metadata remain valid. |
| docs/superpowers/plans/2026-07-28-exploration-phase-0.md | interview.md, line 17 | Warning | accept-omission | resolved — Historical evidence and compatibility paths remain; current tracking separately owned. |
| docs/plans/2026-09-13-remaining-workflow-assessment.md | router, line 41 | Warning | accept-omission | resolved — Historical evidence and compatibility paths remain; current tracking separately owned. |
| docs/plans/2026-09-12-portable-authoring-contract.md | router, line 78 | Warning | accept-omission | resolved — Historical evidence and compatibility paths remain; current tracking separately owned. |
| docs/plans/2026-09-12-claude-checkpoint-recovery.md | router, line 9 | Warning | accept-omission | resolved — Historical evidence and compatibility paths remain; current tracking separately owned. |
| docs/plans/2026-09-13-router-distribution-assessment.md | router, line 1 | Warning | accept-omission | resolved — Historical evidence and compatibility paths remain; current tracking separately owned. |
| docs/plans/2026-09-12-codex-skills-migration.md | router, line 34 | Warning | accept-omission | resolved — Historical evidence and compatibility paths remain; current tracking separately owned. |

## Fresh scheduling recovery gate

Independent PASS0/0 on revised Spec hashfe34fc1f5749bb8712fa50f56625fec4374a8c30fd19083b6547e6f6179759ad before annotation. Completeness1–10, linked membership and embedded parity pass. All55 original coverage candidates independently rechecked and resolved; scheduling terms add none. A committed Archive source/offline/install checkpoint permits Router implementation during frozen-copy host evaluation, with one canonical/catalog writer. Required Archive production changes pause affected integration. Router review still requires all8 accepted Archive cases and committed closure. Human review remains pending under session authorization. Archive source checkpoint fe46d55 now satisfies the revised implementation prerequisite; it does not establish Archive acceptance.

## Fresh installer retention recovery gate

PASS — 0 blockers, 0 warnings. Independent reviewer: checkpoint_contract_review; September 13, 2026. Reviewed Spec SHA-256 before gate annotation: `ddfc26c2a026e6772f85cde120545ceeebcd81d747539706a5f167ba4754c204`. Completeness items 1–10 and all three linked Expectation/detail comparisons pass, including the author-aligned EXP-88ea validation. Human peer review remains pending.

The correction is supported by the actual pinned skills 1.5.25 removal receipt in `idd-router-codex-installer-N50ypU/receipts.json` and local `node_modules/skills/dist/cli.mjs` lines 6325–6366. The CLI skips canonical paths during selected-agent cleanup and retains the canonical directory when another detected agent still resolves an installed path. Its success message therefore does not establish complete uninstallation.

The revised contract independently requires removal of separate selected-host aliases/copies and either actual canonical removal or exact preservation of its original bytes/modes with explicit still-installed reporting. Retained IDD skills, unrelated skills and consumer files remain protected. Selected names and explicit host scope are mandatory; neither broader `--all` removal nor manual canonical deletion is authorized. Local update remains a separately reported no-op, explicit re-add remains local refresh, and no remote update, native discovery or complete host-isolated uninstall is inferred.

### Coverage of the recovery revision

All 55 prior candidate omissions remain visible in the Coverage table above and have matching reasoned author dispositions; their shared links, direct workflows/adapters, generic installer/assembly behavior, independent fixtures and historical references remain valid. The removal-observation delta is owned by `tests/helpers/router-distribution.mjs`, `tests/router-distribution.test.mjs` and `scripts/evaluate-router.mjs`. Retention guidance and outcome reporting are owned by README.md, plugin/README.md, docs/contributing-agents.md, CLAUDE.md and the Spec's execution/host reports. No new unowned impact-surface file or unmet ownership dependency was found.

This is a content/coverage recovery gate only. The four actual host/mode installer combinations, required routing/controller observations and final Archive acceptance/closure prerequisite remain required; this report does not declare those validations complete or reset the in-progress lifecycle.

## Fresh installer mode recovery gate

PASS — 0 blockers, 0 warnings. Independent reviewer: checkpoint_contract_review; September 13, 2026. Reviewed Spec SHA-256 before gate annotation: `dc08103373ca039c5c300aa7dd8ad43f542b6129def3932de6ed1b11d67b3721`. Completeness items 1–10, linked parent membership and all three linked Expectation/detail comparisons pass. The stale copy/symlink matrix sentence is now aligned with the explicit-copy/default requested-mode contract. Human peer review remains pending.

The correction is supported by pinned skills 1.5.25 source in `node_modules/skills/dist/cli.mjs` lines 4980–5001 and the original `idd-router-claude-installer-Nq29GJ/receipts.json`. That run requested only claude-code without --copy; the CLI reported all sixteen skills copied, and independent lstat inspection confirms all sixteen installed Claude skill roots are directories rather than symlinks. Single-host default mode must therefore be recorded as actual copy under this pin. Requested mode and actual filesystem mode remain separate facts, and refresh must preserve actual mode. The unchanged individual installation probe targets both hosts and explicitly checks Claude symlinks; its separate coverage is not inferred from these bulk copies. No additional host is authorized merely to force a different mode.

### Coverage of the mode recovery revision

All 55 existing candidate omissions retain matching reasoned accept-omission dispositions and remain resolved. The optional --default-mode flag, requested/actual mode records, full bundle-byte/root-path checks and failed subprocess receipts are owned by the existing router helper, tests, fixture and evaluator Deliverables. Current mode and retention guidance is owned by the existing documentation and report Deliverables. The generic dual-host individual installer probe remains valid and unchanged. No new unowned impact-surface file or unmet validation dependency was found.

This content/coverage gate does not certify the pending helper/oracle corrections or actual bulk reruns. All four revised host/requested-mode combinations, separate individual symlink verification, routing/controller full-trace acceptance and Archive closure remain required. Original failed receipts remain unchanged; no lifecycle reset or human approval is inferred.
