# Final migration acceptance — September 15, 2026 UTC

Baseline: `bb2f9e8` on `codex/portable-skills`, framework 1.7 / plugin 1.7.0.
This is additive verification evidence; earlier failed runs and checkpoint reports
remain unchanged. Human review and publication are not inferred from these tests.

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
[release checkpoint](SPEC-3671-20260914T034930Z-execution.md). No implementation or
package bytes have changed since those probes. Four bulk standalone lifecycle
cases and both native lifecycle cases remain separate accepted observations,
linked from the [catch-up report](2026-09-13-overnight-catch-up.md).

## Archive acceptance

A fresh Claude apply trial uses an owned disposable fixture, configured model and
output style, explicit low effort and the independently gated 1200-second / 4 MiB
bounds. The fixture is `ltRP7Q`. Its completion and independent full-trace review
are pending; no success or closure is inferred from the clean test suites.
Previous partial and interrupted fixtures remain preserved without repair.

## Remaining gates

Complete and independently accept the Claude Archive apply observation, then
commit Archive, router, native and release closures in that order. Actual human
review, fresh desktop/native alias checks, hosted CI and published-ref installation
remain separate. No actual-repository push, tag, release, personal installation
or external marketplace change has occurred.
