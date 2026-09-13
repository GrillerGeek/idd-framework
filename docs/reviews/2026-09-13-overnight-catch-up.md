# Overnight migration catch-up — September 13, 2026

This is the running catch-up report for the authorized unattended implementation on `codex/portable-skills`. It distinguishes completed implementation, measured host behavior, remaining integration and actual human review. No push, tag or release has occurred.

## Current status after the usage reset

The complete router is implemented with all fifteen stages and318 generated
files across sixteen standalone entrypoints. All five required routing/controller
observations have independent full-trace acceptance. Full455-test regression runs
passed on both Node versions;127 targeted Archive/router checks passed after nine
new regressions (464 current total).68 individual installation combinations pass.
Four hardened actual bulk install/update/refresh/remove observations pass, with
independent review accepted all four.

Archive source is committed as `fe46d55`. Seven of eight required host cases are
accepted. The1200-second medium-effort Claude apply trial timed out after partial
approved archival; the recovery tag preserves every original selected byte/mode,
and the exact partial state is retained. The freshly gated low-effort diagnostic also timed out after resource reads
only; its entire fixture remains unchanged. Further unchanged retries are paused.
Archive is still in-progress. Router may not enter review until Archive acceptance and closure are
committed; native packaging is being scheduled from the verified Router source checkpoint,
while final acceptance remains dependent on the unresolved Archive observation.

Decisions based on actual installer evidence:

- Keep local `skills update` explicitly documented as a no-op; use the original
  host/mode-specific `add` command for a local refresh.
- Host-scoped removal can retain `.agents/skills` for other detected agents.
  Retained copies remain installed, including for Codex. Preserve those exact
  bytes and do not silently broaden removal or report complete uninstallation.
- Pinned single-host installs force copy even without `--copy`. Bulk checks now
  distinguish requested explicit-copy/default from actual copy mode. Genuine
  Claude symlink coverage remains the separate dual-host individual probes.
- Independent review found and fixed verification holes in root resource bytes,
  dangling/root-symlink checks and failed installer receipts. Earlier weaker
  observations remain retained and are superseded by hardened reruns.

See [router host evidence](SPEC-ab84-host-evaluation.md) and
[Archive host evidence](SPEC-57b4-host-evaluation.md) for hashes, failures and limits.
The following sections retain milestone-by-milestone history; the status above is
current. No actual-repository push, tag, release or personal installation occurred.

## Completed milestones

| Commit | Outcome | Review state |
|---|---|---|
| `fe46d55` | Archive source/offline/install checkpoint; host acceptance pending | SPEC-57b4 in-progress |
| `e8b4c8e` | Independently gated router, native distribution and local release-preparation packets | Draft; implementation remains serialized behind Archive acceptance |
| `f92b4ee` | Portable Exploration chart/resolve with twelve accepted traces and verified claims | SPEC-c11a in review |
| `54d134f` | Installed Claude execution controller: actual read-only acknowledgments, guarded write transition, explicit output/check metadata, report verification, preservation and bounded process transport | SPEC-c45b in review; configured-policy terminal lane independently accepted |
| `190abb0` | Portable Forge launcher with four accepted controlled host traces | SPEC-e1d4 in review |
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

Exploration SPEC-c11a is implemented and in review: chart/resolve, four exact-metadata adapters, full standalone resources and the terminal predicate correction. All twelve required observations now pass independent full-trace review and separate oracle revalidation. Five original Claude failures remain documented: weak preservation guards, pre-claim source inspection, unselected-ticket context loading and an extra human question. Reinforced retries preserve the actual failed receipts. Verification: 335 full tests on both Nodes followed by 53 targeted after two added regressions (337 final total), 60 individual installations, 156 generated files. See [exploration host evidence](SPEC-c11a-host-evaluation.md) and [Execution Report](SPEC-c11a-20260913T072446Z-execution.md).

Decisions: exact original plus intended owned state is required before every Exploration write; claimed human-input work resumes in its existing conversation, with verified expected state; missing dependencies/cycles prevent clear even when fog is empty. These do not certify real concurrent sessions or later-answer continuation. Archive SPEC-57b4 is now in progress after Exploration commit f92b4ee. All fifteen stages have complete source/bundles (162 generated files); Archive has 434 full tests on both Node versions, then103 final targeted after six additional regressions (440 final total), and 64 individual installation combinations passing. Seven of eight required actual-host cases have independent acceptance. Claude apply remains in progress, now with a freshly gated explicit1200-second/medium-effort trial after repeated600-second preparation failures; failed and usage-interrupted originals are retained. No actual-project archival occurs. See [remaining-workflow assessment](../plans/2026-09-13-remaining-workflow-assessment.md).

Remaining migration work includes archival, complete router integration, native Codex packaging/marketplace discovery, native Claude aliases, update/removal verification, documentation and release preparation. Actual human review remains necessary. Remote publication and personal installations remain separate actions.

## Evidence and practical limits

Detailed reports include local disposable evidence directory identifiers and source/oracle provenance. OS temporary files may eventually be removed by the operating system; checked-in reports retain conclusions and limitations. No credentials are copied into reports. Actual model observations are stronger than package tests but remain bounded observations, not universal reliability claims.

Installation evidence clarification: the48/52/60-combination probes install every catalog bundle individually in both hosts/modes plus the synthetic probe. Earlier “all-catalog” shorthand must not be read as a bulk install of every skill at once; that behavior has not yet been observed and remains a router/distribution acceptance gate. See [router/distribution assessment](../plans/2026-09-13-router-distribution-assessment.md).

Source provenance clarification: some earlier long-lived matrix runners read on-disk source hashes per case after module import. Those hashes may describe a later file revision, not the exact loaded verifier. Original copied bundles/prompts/traces are retained, final results are separately revalidated, and new exploration tooling captures module hashes at load time. No original receipt is rewritten.

Router SPEC-ab84 is authored as a follow-on draft with an independent passed gap-check: zero unresolved findings and 55 coverage candidates dispositioned. Implementation waits for the accepted Archive commit. Decision: preserve six historical bundled reference paths by mapping portable equivalents, avoiding broken contributor/history links while namespacing all fifteen complete stage bundles inside the router. Native packaging remains a separate integration step.

Native distribution SPEC-aa60 is now authored with an independent passed gap-check: zero unresolved findings and17 resolved coverage candidates. It owns portable/compatibility manifests, repository-local catalogs, strict metadata/path checks and isolated native client install/refresh/remove evidence. Author corrections distinguish the portable root schema from its compatibility overlay, specify isolated child-process client/Git/XDG state and keep the unrelated preservation fixture in its own marketplace. No native packaging implementation or personal installation has begun.

Release-preparation SPEC-3671 has passed independent gap-check with zero unresolved findings and82 resolved coverage candidates; implementation follows native distribution. Best-judgment decision: use framework1.7/plugin1.7.0 for the local migration candidate, preserving historical versions and every nonversion identity. Implementation waits for the accepted native commit. The packet owns final release notes and this comprehensive handoff; it expressly excludes push/tag/release, remote marketplace changes and personal installation.

This running report will be updated as further packets complete.

Scheduling recovery: Archive source/offline/install work is being checkpointed as in-progress. A fresh Router author review permits implementation from that stable committed source while the final Archive trial runs from a frozen copy; final Router review still requires all Archive evidence and a closure commit. This changes scheduling, not workflow safeguards or acceptance outcomes.
