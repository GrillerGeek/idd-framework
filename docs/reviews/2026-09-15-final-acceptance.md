# Final migration acceptance — September 15, 2026 UTC

Baseline: `bb2f9e8` on `codex/portable-skills`, framework 1.7 / plugin 1.7.0.
This is additive verification evidence; earlier failed runs and checkpoint reports
remain unchanged. Human review and publication are not inferred from these tests.

Current outcome: all eight required Archive cases have independent acceptance;
both final complete suites pass 499/499. Archive, router, native and release
implementation closures are complete and in review. Human review and publication
remain pending. The chronological sections below preserve earlier checkpoint
states; the final addendum records the accepted trace and closure commits.

## Uninterrupted full-suite verification

Both supported test runtimes completed all 497 existing cases without failures,
skips or cancellations. These are complete single runs, not aggregate reruns.

| Runtime | Passing tests | Duration | Original log SHA-256 |
|---|---|---|---|
| Node 25.8.1 | 497 / 497 | 85.206 s | `10a733b542073ac54a8412ee3a0dd3df9c23b89ad1203605fc6edc26075e7c80` |
| Node 22.20.0 | 497 / 497 | 81.337 s | `e07664f7adbcbe50d945d7453e2789a977f8404312f45ca65bb05864cc92b0b0` |

Commands ran from the repository root with `--test-concurrency=1` and the existing
`tests/*.test.mjs` selection. Local loopback capability permits the unchanged
controlled Forge test to bind, respond to HTTP inspection and clean up its owned
process. A temporary `caffeinate -is` assertion accompanied each command while
the host reported AC power and active user input; no persistent power setting
was changed. No test timeout, assertion, workflow or dependency changed.

Original logs: `/tmp/idd-acceptance-current-full.txt` and
`/tmp/idd-acceptance-node22-full.txt`. Both process exit codes are zero. Package
checks pass; deterministic assembly verifies 318 files with zero changes. The
pre-run snapshot contains 730 tracked files and unchanged Git refs, saved in
`/tmp/idd-final-acceptance-baseline.json`.

Final-candidate installation evidence remains the independently reviewed 68
individual combinations per runtime from the
[release checkpoint](SPEC-3671-20260914T034930Z-execution.md). No production package bytes have changed since those probes. Four bulk standalone lifecycle
cases and both native lifecycle cases remain separate accepted observations,
linked from the [catch-up report](2026-09-13-overnight-catch-up.md).

## Historical Archive checkpoint — superseded by final acceptance below

A fresh Claude apply trial uses an owned disposable fixture, configured model and
output style, explicit low effort and the independently gated 1200-second / 4 MiB
bounds. The fixture is `ltRP7Q`. It completed in 262.4 seconds but failed after staging because its generated
script incorrectly required empty status before commit. Independent review
confirmed exact recovery and preserved survivors; no repair was made. A narrow,
independently gated evaluation-only recovery makes the UTC fixture date explicit
and clarifies exact staged-index checks. Two new regression cases bring the suite
to 499; both fresh complete suites now pass, as recorded below. The original 497-case passes above
remain valid historical evidence. No Archive success or closure is inferred.
Previous partial and interrupted fixtures remain preserved without repair.

## Historical pending gates — superseded by final closures below

Complete and independently accept the Claude Archive apply observation, then
commit Archive, router, native and release closures in that order. Actual human
review, fresh desktop/native alias checks, hosted CI and published-ref installation
remain separate. No actual-repository push, tag, release, personal installation
or external marketplace change has occurred.


## Complete verification after date/index recovery

Both unchanged test commands ran again after the two contributor-only regression
cases were added. All 499 cases pass in each single run, with zero failures,
skips or cancellations. Production bundles and all strict acceptance-oracle code
remain unchanged; the prompt/date-call changes are covered by independent review
and the [Archive recovery gate](SPEC-57b4-gap-check.md).

| Runtime | Passing tests | Duration | Original log SHA-256 |
|---|---|---|---|
| Node 25.8.1 | 499 / 499 | 75.575 s | `70f4558ac78242411899ca2a2e73623656dcadbe072f8cb2f60ae28708243c9f` |
| Node 22.20.0 | 499 / 499 | 76.291 s | `1f7a336cf1b8e3e3a4eec7bf2c4ce75b3a495194d9b50dcc5c8d7e1a616ae904` |

Logs: `/tmp/idd-acceptance-recovery-current-full.txt` and
`/tmp/idd-acceptance-recovery-node22-full.txt`. Earlier 497-case passes and
ltRP7Q partial failure remain preserved; neither is retrospectively changed.


The final combined-baseline/per-operation/hook-policy prompt clarification was
independently reviewed at helper SHA-256
`f2240b53f02a072969eabb6f398e98b6490e6afb1a010d8a049604bc4a5825f9`.
Both full suites again pass 499/499, zero failures/skips/cancellations. This is the
final prompt revision used by the next bounded trial; oracle/production bytes
remain unchanged.

| Runtime | Duration | Final log SHA-256 |
|---|---|---|
| Node 25.8.1 | 82.530 s | `8e594a1d377903bc39f6be470e98fa3665606a925d249a560b15d65fc5a19505` |
| Node 22.20.0 | 84.414 s | `3c8a16145041d0ea7c38ada61f88dd9ac44cd5472fb64f3ec865c9a993b6ab7f` |

Final logs: `/tmp/idd-acceptance-composite-current-full.txt` and
`/tmp/idd-acceptance-composite-node22-full.txt`. These full passes do not certify
UIZWcO, whose completed output was rejected by independent procedural review.


## Accepted final trace and ordered closures

QqBauk passes independent full-trace review, completing all eight required Archive
cases. Its output pass is backed by actual first-combined-digest equality,
filesystem/Git guards at every mutation, persisted reconciliation before deletion,
exact staged blobs/modes/status, one correct commit and complete tag recovery.
Harmless read-only preparation corrections and all previous failures remain in the
[Archive evidence](SPEC-57b4-host-evaluation.md). The explicit low-effort Claude
lane completed in582.137seconds under1200seconds/4MiB; no default-effort or native
alias claim is inferred.

| Closure | Local commit | Final report |
|---|---|---|
| Archive | 2970f3d | [SPEC-57b4-20260915T014331Z-execution.md](SPEC-57b4-20260915T014331Z-execution.md) |
| Router | 68836de | [SPEC-ab84-20260915T014456Z-execution.md](SPEC-ab84-20260915T014456Z-execution.md) |
| Native | 2fe5180 | [SPEC-aa60-20260915T014613Z-execution.md](SPEC-aa60-20260915T014613Z-execution.md) |
| Release | Commit containing this final addendum | [SPEC-3671-20260915T014756Z-execution.md](SPEC-3671-20260915T014756Z-execution.md) |

All four Specs are in review, with human implementation review pending. Original
source-checkpoint Execution Reports remain unchanged. Only separately owned
contributor evaluation prompts/date plumbing/tests changed after the version-only
candidate; production bundles, metadata identities and adapters remain intact.
No actual-repository tag, remote push, publication, personal installation or
external marketplace change occurred.

Final preservation audit verifies 712 protected tracked files, all 318 generated
files, 130 local links, exact nonversion metadata and unchanged strict oracle and
original checkpoint reports. Only the local branch ref changed. Details are in
`/tmp/idd-final-migration-audit.json` and the final release execution report.
