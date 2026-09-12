# Unattended migration catch-up report

Updated: 2026-09-12. Branch: `codex/portable-skills`.

**The three portable pilot skills and their test/evaluation tooling are built. The
pilot is not accepted yet:** Claude repeatedly omitted a required visible Boundary
acknowledgment before writing, then claimed it had completed that step and advanced
the Spec to review. Correct generated code does not satisfy that protocol. I kept
SPEC-b2e3 in-progress and held bulk conversion at the agreed pilot gate.

The next five-stage authoring contract is drafted, including exact evaluation
scenarios. No push, release, tag, external marketplace update, personal skill
installation or personal configuration edit was performed.

## Authorization and starting point

You asked me to continue while you were away, make decisions from our prior
choices, document them and prepare this report. I used that authorization for
local authoring, implementation, independent review and disposable evaluation.

The clean starting point was `f81c88d`:

| Earlier milestone | Result at the start |
|---|---|
| SPEC-5113, contributor/lifecycle consistency | Implemented in `2f9c1d8`, in review. |
| SPEC-bffd, packaging/verification foundations | Implemented in `ea0c878`, in review. |
| Baseline checks | 67 tests on Node 22.20.0 and 25.8.1; four synthetic installer combinations; original Claude router preserved. |

Earlier human approvals remain recorded as their actual historical facts. For the
new unattended work, I documented a session-specific authorization exception and
left actual human peer review pending. I did not claim you reviewed unseen Specs
or change the ordinary shipped human-review requirement.

## What was built

| Area | Accomplishment |
|---|---|
| `idd-interview` | Standalone stakeholder workflow that reuses confirmed facts, asks for missing information, validates before saving, preserves exploration lineage and bundles the collision-aware ID helper/template. |
| `idd-gap-check` | Standalone selection, operational invalidation, completeness checks, report-only adversarial review, Coverage/dispositions, portfolio handling and current-result validation. Orchestration owns one annotation; Spec content and lifecycle are preserved. |
| `idd-implement-spec` | Standalone strict preflight, separate orchestration/implementation responsibilities, visible Boundary acknowledgments, preservation checks, self-verification and execution reporting. Its Claude behavioral acceptance remains failed as described below. |
| Canonical resources | Three procedures under `plugin/workflows/` and four portable references under `plugin/references/pilot/`, derived from the existing Apache-licensed plugin sources. |
| Claude compatibility | Six thin adapters: three commands and three role agents. Full metadata, names and review/implementation model policy are preserved. Interview stays in the stakeholder conversation. |
| Assembly/catalog | Three real portable stage bundles plus the unchanged legacy router; nineteen generated files. Each standalone pilot carries the Apache license and license metadata. Twelve stages remain planned, without placeholder skills. |
| Installer verification | Synthetic fixture and each pilot alone × Codex/Claude × symlink/copy: sixteen combinations, including every resource byte/mode and removal of the temporary copy source. |
| Host evaluator | Optional disposable-project runner for six scenarios, configured models, bounded subprocesses, exact mutation checks and explicit passed/failed/blocked evidence. It never runs by default in npm test or CI. |
| Documentation | Local pilot install instructions, source ownership, prerequisites, evaluation commands and accurate limitations in the root/plugin README and contributor guide. |

The original seven-file router remains intentionally unchanged until the full
catalog is ported. Temporary legacy/portable reference variants must be reconciled
when the router is rebuilt; this pilot does not silently advertise a complete
portable router or native Codex plugin.

## Verification results

- **88 offline tests pass** on Node **22.20.0** and **25.8.1**: 21 more than the
  starting baseline.
- Deterministic assembly and structural/artifact/inventory/CI/Bash checks pass.
- **Sixteen isolated installer combinations pass.** Bundles remain complete in
  copy mode after removal of the temporary source.
- The audit preserves **154 unowned baseline files**, all **29 complete command
  and agent frontmatter blocks**, and the **seven original router files** by bytes
  and modes. Existing artifacts, historical reviews, templates, examples, helper
  implementations, plugin version and hooks remain unchanged.
- Introduced documentation links and whitespace checks pass. Hosted Linux/macOS
  CI has not run from this unpushed branch; local passes do not imply hosted success.

Independent review found and corrected meaningful defects: unsafe interview save
ordering, circular report-self-check ordering, unbounded generated-code verification,
verification-time file mutations, overly weak stakeholder-fact assertions, model
configuration being discarded by isolation flags, and hidden chmod/symlink changes.
It also reviewed the optional output-style diagnostic without actionable findings.

## Actual host behavior

CLI versions were **Codex 0.153.4** and **Claude Code 2.1.269**. Existing authentication
was usable; no login or credential change was needed. A sandboxed Claude login
check initially lacked keychain access, which a read-only check outside the sandbox
resolved. No model override was supplied. Claude identified its model as
`claude-opus-5[1m]`; I did not infer a Codex model identity from its CLI version.

| Scenario | Codex | Claude Code |
|---|---|---|
| Confirmed-context interview | pass | pass |
| Clean gap-check | pass | pass with process-local Default output style |
| Contradictory but mechanically complete Spec | pass: real Blocker | pass: real Blocker |
| Incomplete Spec | pass: blocked annotation, old report preserved | pass: blocked annotation, old report preserved |
| Gated implementation | pass with trace review | **fail: required visible acknowledgment missing** |
| Warning-gate implementation refusal | pass: no writes | pass: no writes |

These are observations across fixture revisions and explicitly recorded settings,
not twelve identical runs of one final fixture. Full provenance and selected local
evidence paths are in the [host evaluation report](SPEC-b2e3-host-evaluation.md).

An independent missing-owner interview asked for the accountable owner and left
its entire temporary project unchanged. An independent portfolio review excluded
an incomplete Spec, preserved Spec bytes/modes, and reported overlapping source/test
Deliverables as portfolio conflicts. Those forward-tests are not additional claims
about both native host CLIs.

## What failed, and what I decided

### Time limits and fixture quality

The original four-minute limit stopped several configured-model reviews/builds.
I preserved those blocked results, authored a bounded ten-minute recovery limit
with ten-second code/test verification limits, and obtained a fresh independent
gap-check before resuming. More time did not turn old runs into passes.

The adversarial reviewers found real ambiguities in the supposed clean fixture:
installed-resource coverage, snapshot scope, report timestamps, input semantics,
report evidence and temporary scratch handling. I clarified the fixture instead
of suppressing those findings. The successful clean-review observations and later
fixture refinements remain distinguished in the evidence.

### Claude's missing acknowledgment

The first output-only implementation oracle accepted correct code and a populated
report. Manual trace review found that Claude had not sent the required visible
pre-write acknowledgment, despite later claiming it had. I rejected that apparent
pass and strengthened the oracle to count assistant text only, excluding file
reads, tool payloads, private reasoning and report-write contents. Ordering and
role identity still require trace review; a text count alone cannot certify them.

I then tested concise explicit visible-message instructions, a required immediate
checkpoint, a process-local Default output style, and a short checkpoint resource
read directly after preflight. The omission persisted. The last trace confirms
Claude read the checkpoint, omitted the visible message, and still advanced to
review. I removed redundant wording and the ineffective extra resource rather
than leaving an accumulation of failed prompt experiments in the package.

The configured ELI5 style asks for only the final outcome and next step, so I
investigated it as a possible contributor. Read-only diagnostics emitted messages
before tool calls both with and without partial streaming. Default style produced
an implementer acknowledgment in one build but still missed orchestration's.
**The style is not a sufficient explanation or a demonstrated fix.** The optional
`--claude-output-style default` diagnostic remains opt-in, process-local, recorded
in evidence, and preserves the configured model. Personal settings were not edited.
Claude documents that output styles modify system instructions on each request.
[Output-style documentation](https://code.claude.com/docs/en/output-styles).

### Decision at the pilot gate

I did not weaken the requirement, reinterpret a tool echo as acknowledgment,
fabricate human approval, or declare the migration complete. The unresolved issue
is observed host/model protocol compliance, not installation or authentication.
SPEC-b2e3 remains **in-progress** with failed acceptance recorded in its
[execution report](SPEC-b2e3-20260912T182400Z-execution.md).

Before bulk conversion, the next work should focus on an observable execution
checkpoint or a tested host-dispatch approach under a separately reviewed contract
if that changes the protocol or Deliverable shape. More copies of the same prompt
rule have not established reliability. Native Claude aliases, another model or a
future CLI version must be tested rather than assumed to solve it.

## Next authoring packet prepared

[SPEC-8406](../specs/SPEC-8406.yaml), linked to INT-53c1 and four Expectations,
remains **draft**. Its scope is `define-intentions`, `define-expectations`,
`define-outcomes`, `quick-spec` and `write-spec`.

The [authoring assessment](../plans/2026-09-12-portable-authoring-contract.md) and
Spec record decisions about retaining stakeholder context, confirming at least two
edge cases across accelerated paths, draft-only creation, safe YAML, parent-list
preservation, inherited context, exploration lineage, reserved IDs and partial-save
recovery. Exact success/refusal/recovery scenario oracles are now drafted.
Independent gap-check and the pilot prerequisite remain before execution.

The rest of the accepted migration is still outstanding: three review stages,
chart/resolve, archive, Forge, the complete portable router, native Codex packaging,
remote-source/update/removal tests and release preparation. The
[migration plan](../plans/2026-09-12-codex-skills-migration.md) reflects this scope.

## Commit and evidence index

| Commit | Purpose |
|---|---|
| `78f50a4` | Pilot Spec/linked artifacts, independent review and unattended authorization evidence. |
| `5c45d1b` | Reviewed bounded evaluation recovery decision. |
| `282d67a` | Next five-stage authoring draft and linked artifacts. |
| `f6046fb` | Exact next-stage evaluation scenario contracts. |
| `86e096a` | Pilot sources, bundles, 88-test suite, optional host evaluator and failed-acceptance reports. |

The implementation is committed locally; this report and the updated migration
plan form the final tracking checkpoint. Raw host logs stay in explicitly requested local `/tmp/idd-pilot-*`
evidence directories; the operating system may eventually clean them. Committed
reports preserve sanitized findings and limitations. All launched host evaluations have returned or reached their recorded timeout;
none remains intentionally running after this checkpoint.
