# Overnight migration catch-up — September 13, 2026

This is the running catch-up report for the authorized unattended implementation on `codex/portable-skills`. It distinguishes completed implementation, measured host behavior, remaining integration and actual human review. No push, tag or release has occurred.

## Completed milestones

| Commit | Outcome | Review state |
|---|---|---|
| `54d134f` | Installed Claude execution controller: actual read-only acknowledgments, guarded write transition, explicit output/check metadata, report verification, preservation and bounded process transport | SPEC-c45b in review; configured-policy terminal lane independently accepted |
| `cba0ea9` | Three review stages with ten strict host observations; follow-on authoring packets | SPEC-44b9 in review |
| `5b78b78` | Five authoring stages: intentions, expectations, combined outcomes, quick Spec and existing Expectations to Spec | SPEC-8406 in review; sixteen required actual-host observations independently accepted |

Earlier contributor/lifecycle, assembly and three-workflow pilot work remains in the branch. The framework and plugin remain version 1.6.0 while distribution/release work is incomplete.

## Claude execution checkpoint

The installed `idd-implement-spec` skill includes a generic Node terminal controller and its complete pinned YAML runtime. A consuming project does not need an npm dependency. A reviewed `execution_contract` explicitly names writable outputs and executable validation argv; the controller never guesses these from prose.

The final configured-policy run completed actual orchestration and implementation acknowledgments before writes, verified its deliverables and Execution Report, preserved its baseline, and let orchestration alone advance lifecycle to review. The actual full trace was independently reviewed. Sonnet model selection worked, but its full workflow trace omitted required procedural evidence, so that lane remains experimental. Native Claude aliases have not been certified by terminal-runner success.

See [installed host evidence](SPEC-c45b-host-evaluation.md), [Execution Report](SPEC-c45b-20260913T044008Z-execution.md), and [pilot acceptance](2026-09-13-pilot-acceptance.md). Historical failed runs remain documented.

## Portable authoring

Eight stages now have standalone bundles: interview, gap-check, implementation, define-intentions, define-expectations, define-outcomes, quick-spec and write-spec. Five new stages share one canonical authoring procedure and generated resources. Claude aliases remain thin adapters with original frontmatter and model assignments.

Authoring retains selection and confirmation in the main conversation. Optional drafting workers are read-only. New artifacts remain draft; confirmed content is not human peer review. Accelerated workflows prepare the whole proposed batch before saving and require at least two explicitly confirmed edges per Expectation. Existing parent updates are restricted to the expectations list, with byte/type/mode preservation and explicit partial-save recovery rather than a false atomic-transaction claim.

Verification at the authoring commit:

- 185 tests pass on Node 25.8.1 and minimum Node 22.20.0.
- 36 installation combinations pass for Codex/Claude, copy/symlink and individual/catalog cases; copy-source removal is real.
- All sixteen required actual-host observations pass final oracle and independent full-trace review.
- Deterministic assembly emits 132 files. Protected sources and ten modified adapter frontmatter blocks retain their required bytes.
- Synthetic concurrency tests validate an acceptance oracle; they do not prove a production transaction mechanism or actual interleaved host writes.

See [authoring host evidence](SPEC-8406-host-evaluation.md) and [Execution Report](SPEC-8406-20260913T052450Z-execution.md).

## Decisions made while unattended

1. Accepted the three-stage pilot for the specific measured standalone/terminal lanes, allowing broader migration. This does not certify every model, output style, native alias or release path.
2. Preserved the configured Claude execution lane as supported; kept the failed Sonnet full-procedure lane experimental instead of silently relaxing the gate.
3. Allowed safe descriptive filenames for newly authored artifacts after an explicit author revision and independent fresh gap-check. The original contract did not require bare-ID basenames; old failed receipts were preserved and revalidation recorded separately.
4. Corrected overly narrow oracle formatting checks for candidate tables and equivalent two-edge-minimum wording, with regression tests. No stakeholder confirmation rule was weakened.
5. Retained two actual authoring procedural failures. Claude outcomes used unowned scratch files and weak baseline handling; Codex Quick Spec initially missed current filename enumeration in its final ID sweep. Reinforced-prompt retries passed independent review, with this limitation disclosed.
6. Kept actual human peer review pending. The user's unattended authorization permits this migration work; it is not shipped as an exception to ordinary IDD gates.

## Work in progress and remaining work

SPEC-44b9 is complete and in review: eleven portable stages, four planned. All ten required host cases now have strict independent acceptance. The first Codex passes were withdrawn after deeper audit found loss of the initial baseline; those failures, hidden-script limitations and a ten-minute timeout remain documented. Final verification: 248 tests on both runtimes, 48 installation combinations and 144 generated files. See [review host evidence](SPEC-44b9-host-evaluation.md) and [Execution Report](SPEC-44b9-20260913T064000Z-execution.md).

Forge SPEC-e1d4 is now implemented and in review. Four controlled host traces are accepted;283 full tests on both runtimes plus36 final targeted tests after one extra regression (284 final total),52 installations and146 generated files pass. See [Forge host evidence](SPEC-e1d4-host-evaluation.md) and [Execution Report](SPEC-e1d4-20260913T065500Z-execution.md). The Codex evaluator enables network per invocation for the controlled fixture and saves normal owned history to capture actual background returns; no personal configuration is edited. This does not certify the public Forge UI or native aliases.

Exploration SPEC-c11a and archive SPEC-57b4 retain independently passed authoring gates and remain draft behind their implementation dependencies. See [remaining-workflow assessment](../plans/2026-09-13-remaining-workflow-assessment.md) for archive and exploration issues found before implementation. The exploration draft explicitly resolves new-research ownership and bounded prototype/task assets; these decisions are not yet shipped.

Remaining migration work includes exploration chart/resolve, archival, complete router integration, native Codex packaging/marketplace discovery, native Claude aliases, update/removal verification, documentation and release preparation. Actual human review remains necessary. Remote publication and personal installations remain separate actions.

## Evidence and practical limits

Detailed reports include local disposable evidence directory identifiers and source/oracle provenance. OS temporary files may eventually be removed by the operating system; checked-in reports retain conclusions and limitations. No credentials are copied into reports. Actual model observations are stronger than package tests but remain bounded observations, not universal reliability claims.

This running report will be updated as further packets complete.
