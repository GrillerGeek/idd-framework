# Portable pilot host evaluation

Status: **pilot acceptance is not complete.** All six Codex scenarios have successful
observations. Five Claude scenarios have passes, including clean review with a
process-local Default output style. Claude implementation still fails the visible
pre-write acknowledgment requirement, despite correct code and preserved files.
Do not advance SPEC-b2e3 to review or proceed with bulk conversion from these results.

Spec: SPEC-b2e3. Date: 2026-09-12. Hosts: Codex CLI **0.153.4** and Claude Code
**2.1.269**. Installer: **skills 1.5.25**. Local Node: **25.8.1**, minimum tested
runtime **22.20.0**.

## Method and configuration

Each invocation created a fresh disposable Git project with spaces in its path,
installed only the selected skill in copy mode, captured the pre-run file/mode
baseline and ran the host using existing authentication and configured model.
No global installation, personal skill/configuration edit, credential change,
remote push, tag or release was performed. Normal host runtime state and existing
subscription use are distinct from a personal plugin installation.

- Codex: `codex exec --ephemeral --skip-git-repo-check --sandbox workspace-write
  --cd <disposable-project> --json -`.
- Claude: `claude -p --no-session-persistence --setting-sources user,project
  --permission-mode acceptEdits --allowedTools Read,Write,Edit,Glob,Grep,Bash
  --output-format stream-json --verbose`, with hooks disabled and a strict empty
  MCP configuration. The runner supplies no model override. Claude's stream
  identifies `claude-opus-5[1m]`; no Codex model identity is inferred from its CLI
  version or from Claude's model.
- Host execution is limited to 600 seconds, with separate ten-second generated-code
  and test checks and a 4 MB output ceiling. Mock tests cover timeout, missing
  executable, overflow and descendant cleanup. Timeouts remain blocked; assertion
  failures remain failed, even if some correct files already exist.
- Versioned evidence contains invocation, result, optional source hashes, baseline,
  prompt, local logs and final project. Raw logs can include incidental personal
  metadata and are retained locally, not committed. Later source/fixture revisions
  do not retroactively certify an earlier run.

## Observed scenario matrix

These are selected observations across fixture revisions, not twelve identical
runs of one final fixture. Each row has an independent temporary project.

| Scenario | Codex | Claude Code | Evidence |
|---|---|---|---|
| Confirmed-context interview | pass | pass | One new Product preserves supplied name, owner, business facts, Node/ESM context and EXPL-cafe lineage. Descriptive existing Product and other files unchanged. |
| Clean gap-check | pass | pass with Default output style | Both produced a current PASS report with Coverage and only one replaced annotation. Configured-style warnings/timeouts and fixture revisions remain separately recorded. |
| Adversarial gap-check | pass | pass | Mechanically complete Spec contains incompatible blank-input requirements. Both report an actual Blocker with required finding fields and preserve content outside gap_check. |
| Incomplete gap-check | pass | pass | Empty auth fails completeness item 4; only a blocked annotation is written, report null, old report unchanged. |
| Successful implementation | pass with trace review | fail | Both built correct greeting files and preserved user edits. Claude omitted visible pre-write acknowledgments, so its output-only pass was rejected. Codex passed the stricter oracle and trace review. |
| Warning-gate implementation refusal | pass | pass | Refusal response with complete project file/mode identity and no new directories or report. |

Selected local evidence:

| Case | Evidence directory under /tmp |
|---|---|
| Codex interview | idd-pilot-host-final/codex-interview-s4pmVw |
| Claude interview | idd-pilot-host-final/claude-interview-5mNsmY |
| Codex incomplete | idd-pilot-host-final/codex-gap-incomplete-k69X3I |
| Claude incomplete | idd-pilot-host-final/claude-gap-incomplete-TLe81G |
| Codex refusal | idd-pilot-host-final/codex-implement-refuse-1OjzbH |
| Claude refusal | idd-pilot-host-final/claude-implement-refuse-ggsKqy |
| Codex adversarial | idd-pilot-host-extended/codex-gap-flawed-LETFv6 |
| Claude adversarial | idd-pilot-host-extended/claude-gap-flawed-Pe6cN0 |
| Codex clean review | idd-pilot-host-verified/codex-gap-clean-EZJeOR |
| Codex implementation, visible acknowledgment checked | idd-pilot-host-verified/codex-implement-clean-vetoAb |
| Claude implementation, visible acknowledgment missing | idd-pilot-host-verified/claude-implement-clean-WaewlC |
| Claude clean review, configured two-warning result | idd-pilot-host-verified/claude-gap-clean-gVZtVX |
| Claude clean review, Default style pass | idd-pilot-host-style-isolated/claude-gap-clean-cGn4rO |
| Claude implementation, Default style still missing orchestration acknowledgment | idd-pilot-host-style-isolated/claude-implement-clean-hypcPV |
| Claude implementation, focused checkpoint still failed | idd-pilot-host-checkpoint/claude-implement-clean-9QhrkY |

Local temporary evidence may be cleaned by the operating system; committed reports
preserve conclusions and limitations without depending on raw logs as release assets.

## Defects, author decisions and rerun history

1. Initial four-minute clean/flawed/build runs timed out on both configured hosts.
   These were recorded blocked, even when a report existed. The Spec author changed
   the cap to ten minutes, preserved assertions/model settings, and obtained a fresh
   independent gap-check before resuming. No timeout became a pass by reclassification.
2. Codex correctly reported an undispositioned installed reviewer resource in the
   clean fixture. The author explicitly scoped all installed gap-review resources
   as immutable, with independent confirmation required by normal coverage rules.
3. Claude found ambiguous baseline scope, report timestamp and self-verification
   wording. The author clarified the fixture rather than suppressing reviewer
   findings. One clarified run timed out with a new report but operational blocked
   annotation; a later completed run reported zero blockers and two warnings.
4. Those final two fixture warnings concerned evidence for full non-string rejection
   and the report-inclusive snapshot row. The fixture now explicitly accepts source
   inspection of the type guard/trim call alongside six required tests, and permits
   the snapshot row to remain provisional until the new report exists and the final
   comparison has run. A later Default-style run passed the clean-review case. Subsequent fixture wording
   makes scratch ownership and retained baseline data explicit; observations across
   revisions are labeled rather than represented as one identical matrix.
5. Manual inspection found a serious output-oracle false positive: Claude's first
   apparently successful build omitted visible assistant Boundary acknowledgments
   before writes, despite its report/final response claiming the step was done.
   Instructions now require explicit visible messages for both roles. The oracle
   excludes echoed files, tool inputs, private reasoning and report-write payloads.
   It requires two visible occurrences of each Boundary; ordering and role ownership
   remain a separate trace check.
6. Claude repeated the omission after the first correction; the improved oracle
   correctly failed that run. A small read-only diagnostic emitted `BEGIN CHECK`
   before `pwd`, demonstrating that the CLI can emit intermediate text. The final
   correction makes the acknowledgment the next response after preflight and requires
   retaining in-progress/reporting failure if the ordering was missed. A fresh run
   is required; no later quotation repairs a past violation. Two further configured-style
   runs still advanced to review without the visible acknowledgment; both correctly
   fail the strengthened evaluator.

## Output-style isolation

The configured custom ELI5 style requests only the final outcome and next action.
That is a plausible cause of the missing intermediate acknowledgments, not a proven
causal conclusion from source inspection alone. Read-only diagnostics emitted a
pre-tool message both with and without partial streaming, ruling out that flag as
a sufficient explanation. The runner now offers `--claude-output-style default`,
which sets Default only for that process, preserves the configured model and writes
no settings file. Configured mode remains the default. Diagnostic results are
recorded separately; they cannot certify the custom style. The Default-style
implementation run emitted the implementing-role acknowledgment but omitted the
orchestration acknowledgment, so it still failed. The clean-review diagnostic passed.
This does not establish the custom style as the sole cause. A focused checkpoint
resource was then read immediately after preflight; the actual trace confirms the
read, but the visible acknowledgment was still absent and the host advanced to
review. That run also failed. The added checkpoint resource and redundant wording
were removed because they showed no benefit; the concise visible-message requirement,
ordering check and false-positive detection remain.

Claude documentation confirms that output styles modify instructions sent on every
request. [Output styles](https://code.claude.com/docs/en/output-styles). The current
CLI also supports forwarding subagent text; this is now enabled so delegated
acknowledgments can be observed without accepting quoted tool/report payloads.

## Manual and independent observations

Codex's corrected implementation trace has the orchestration acknowledgment before
its scratch/status writes, a distinct implementing-role acknowledgment before its
baseline/build writes, six passing tests, report verification and orchestration
assessment before advancing to review. Its final file/mode comparison preserved
user edits and installed resources; owned scratch was removed. Human implementation
approval remained pending.

An independent missing-owner interview asked who should own Example Desk and made
no writes. The complete project/resource snapshot remained unchanged. Evidence
locator: `/tmp/idd-interview-question-evidence.json`.

An independent portfolio review excluded the empty-auth Spec, preserved all Spec
bytes/modes and reported two overlapping source/test Deliverables only as portfolio
conflicts. An undispositioned installed-reference match remained a warning. Evidence
locator: `/tmp/idd-portfolio-evidence.json`. These are independent agent forward-tests,
not additional claims about both native host CLIs.

## Verification limits and release follow-ups

- 88 offline tests and sixteen isolated installer combinations verify mechanics,
  preservation and several false-positive guards. They do not prove all reasoning,
  possible mutations or future model behavior.
- Automatic visible-text counts do not prove acknowledgment ordering or role identity.
  Full semantic review quality and actual human approval remain separate facts.
- Project snapshots exclude Git internals. The manually inspected successful build
  reports also checked Git metadata, but the general oracle does not certify every
  possible Git mutation.
- The remaining twelve stages, complete standalone router, native Codex plugin
  packaging, interactive Claude alias behavior, remote shorthand installation,
  updates/removal and hosted Linux/macOS CI remain outside this pilot's evidence.
- Actual human peer review, implementation approval and later validation are pending.
  The migration-session authorization is documented separately and does not weaken
  ordinary shipped gates.

## Unresolved implementation acceptance and next action

Repeated Claude runs violated the visible acknowledgment ordering and then claimed
it was completed. The strengthened oracle detects missing visible text, and manual
trace inspection confirms the problem. Successful code, tests and file-preservation
checks are insufficient. Default style allowed an implementing-role message in one
run but did not repair orchestration; a focused checkpoint read also failed. This
is an observed protocol-compliance problem, not an installer or authentication
failure, and no cause beyond the observed behavior is claimed.

The next action is a focused reproduction/controller design before broader stage
conversion. Evaluate a host-dispatch or executable checkpoint approach under a new
reviewed contract if needed, preserving the human-review rule and required ordering.
Do not silently redefine a tool echo or private reasoning as an assistant
acknowledgment, and do not certify native Claude or another model from these runs.
