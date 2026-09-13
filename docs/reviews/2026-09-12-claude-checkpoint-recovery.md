# Claude execution checkpoint recovery

Started: 2026-09-12 local. Finalized: 2026-09-13 local; host evidence collected on 2026-09-13 UTC.
Branch: `codex/portable-skills`.

**The staged Claude checkpoint passed two fresh configured-model evaluations.**
The controller obtains and validates both visible acknowledgments while mutation
capabilities are unavailable, resumes the same implementing conversation to build,
and advances lifecycle only after independent output/report/preservation checks.
This resolves the checkpoint for this optional evaluation path. It does not turn
an ordinary standalone or native Claude invocation into a guarded run.

## What changed

- Added `--claude-checkpoint staged` to the optional evaluator and a controller in
  `scripts/lib/claude-checkpoint.mjs`. Direct mode is unchanged.
- Added read-only orchestration and implementation checkpoints in one saved Claude
  session. Each checkpoint has only Read, Glob and Grep; no shell, skill expansion,
  delegation, hooks or MCP. Acknowledgments are genuine assistant messages, not
  controller-generated quotations or tool echoes.
- The controller safely parses the fixture/gate, preserves exact Spec bytes and
  owns ready → in-progress → review. It verifies actual deliverables while status
  is still in-progress. A model-written lifecycle change fails without being
  silently repaired; partial evidence is preserved.
- Required report rows must all pass with evidence. Missing, duplicate, failed,
  provisional or non-human unverifiable rows prevent advancement; a recorded
  blocker-grade gap requires recovery.
- Resume preserves the exact model observed in first-init evidence and validates
  the actual model, output style, session identity and exposed tools per phase.
  The observed Claude resume quirk otherwise dropped the `[1m]` suffix.
- Updated the canonical implementation workflow/reference and generated skill to
  recognize explicit controller handoffs, with ordinary lifecycle rules intact.
- Added 13 focused offline tests and documented usage, persistence and limitations.

Run from this source checkout:

```bash
node scripts/evaluate-pilot.mjs --host claude --scenario implement-clean --claude-checkpoint staged --output /tmp/idd-checkpoint-evidence
```

## Decisions and scope

The user's explicit checkpoint request and earlier delegated decision-making
permission authorize this focused recovery. The
[contract](../plans/2026-09-12-claude-checkpoint-recovery.md) records the choices and
[independent review](2026-09-12-claude-checkpoint-review.md) records resolved findings.
No human peer approval was invented; SPEC-b2e3 remains in-progress.

The new mode saves one normal Claude session so it can resume automatically across
capability changes. Its owned history remains in Claude runtime storage. Personal
settings, credentials and installations were not edited; no hooks were installed.
Initial model choice remains configured. Resume's explicit model argument restores
that same observed identity, rather than selecting another tier. ELI5 is preserved;
no Default-style override was needed for the successful staged run.

The three model phases share the existing ten-minute and 4 MB limits. Independent
code/test verification keeps separate ten-second bounds. This coordinates an
honest workflow; writable shell tools are not an OS security sandbox. Project
snapshots exclude Git internals as before, and transcript review covers actual
external scratch operations. No rollback deletes user work.

## Verification

| Check | Result |
|---|---|
| Offline suite, Node 25.8.1 | 101/101 pass. |
| Offline suite, Node 22.20.0 | 101/101 pass on rerun. Initial run had three subprocess timeouts during an approximately 210-second shared pause; retained as failed evidence. No timeout was relaxed. |
| Installer matrix | All 16 selected-skill/synthetic, Codex/Claude, copy/symlink combinations pass. |
| Assembly | 19 generated files verified; only the two implementation procedure copies change. |
| Skill metadata | `idd-implement-spec` quick validator passes. |
| Independent implementation review | Four findings corrected; final re-review clear. |
| Actual Claude staged build | Two passes with independent trace acceptance, including final source hashes; details below. |
| Warning-gate staged refusal | Controller refused before any Claude workflow invocation; not a Claude refusal observation. |
| Ordinary Codex regression | Automatic output checks and acknowledgment ordering pass. Host report count wording has a qualification below. |
| Hosted CI/native installations | Not run or certified in this recovery. |

## Host evidence

Claude version: 2.1.269. Successful staged phases observed `claude-opus-5[1m]`
and ELI5 in the same session. Codex version is recorded in its result JSON; no
Codex model identity is inferred from the version.

| Run | Outcome and meaning |
|---|---|
| `/tmp/idd-checkpoint-host/claude-implement-clean-jqhX3G` | Failed first checkpoint format validation; no lifecycle or project mutation, no later phase. Claude quoted boundaries but used a different numbered-block form and added a gate summary. The final contract/parser make the complete response shape explicit and accept either supported indexed block form. Old failure remains failed. |
| `/tmp/idd-checkpoint-host/claude-implement-clean-Qn74WB` | All three phases passed. Actual acknowledgments, model/style/session preservation, six passing tests, report self-check and scratch cleanup reviewed independently. The model returned in-progress and the controller advanced to review after verification. |
| `/tmp/idd-checkpoint-final/claude-implement-clean-YMd7yu` | Second fresh pass using final controller/evaluator/helper/skill source hashes. Independent trace review found no acceptance gaps; configured model/ELI5/session preserved, six actual tests pass, report and scratch verified, model returns in-progress. |
| `/tmp/idd-checkpoint-refusal/claude-implement-refuse-G0MFhj` | Controller-refused warning gate; zero workflow invocations; project unchanged. CLI version lookup is not a model run. |
| `/tmp/idd-checkpoint-codex/codex-implement-clean-nn6gF5` | Direct evaluator pass and manually verified role ordering. The host's test command exited zero but did not show runner counts in recorded output. Its report claimed reported counts; independent evaluator counts support actual behavior, not that specific host-evidence claim. |

Each evidence directory keeps original baseline, per-run source hashes, actual
invocations, transcripts and final project. Qn74WB preceded the final extra
candidate-snapshot comparison and malformed-stream classification; those are
covered by offline verification and final confirmation YMd7yu. All four source hashes recorded by YMd7yu match the committed implementation inputs; installed bundle bytes were also verified by the installer matrix.
Raw temporary logs may be cleaned by the OS and can contain incidental local
metadata; sanitized findings are preserved here.

## Recovery execution accounting

| Contract obligation | Evidence |
|---|---|
| Preflight without workflow calls on invalid gate | Warning fixture refused, zero workflow invocations, baseline unchanged; duplicate-key offline case also refuses. |
| Orchestration acknowledgment before lifecycle mutation | Both real runs expose only read tools, validate the visible final message, then perform controller status transition. |
| Implementer acknowledgment before any implementation write | Same session identity and meaningful paraphrases reviewed in both actual traces; first scratch/source writes occur in the later build phase. |
| Verification precedes review | Both model returns explicitly retain in-progress; controller validates code, report and snapshot before its own exact status edit. |
| Failures cannot become controller success | Tests cover missing/partial/quoted acknowledgments, changed project/session/model/style, unexpected tools, unfinished reports, operational errors and model lifecycle writes. |
| Original protected content remains intact | No changes to command/agent frontmatter, legacy router, manifests, hooks, live Spec content, templates, examples or historical reports. |
| Packaging remains self-consistent | Two generated implementation copies rebuilt; nineteen total files verified; all sixteen installer combinations pass. |
| Reviewable delivery | Contract, independent findings/resolutions, actual evidence and documentation are saved; source/test changes committed locally. |
| Authorization boundaries | No push, release, tag, external marketplace change, global skill installation or personal settings edit. |

## spec_gaps_encountered

| Gap | Severity | Resolution |
|---|---|---|
| A free-running model could omit acknowledgment and later self-certify it. | blocker-grade for original direct acceptance | Explicit controller checkpoint recovery; original direct/native acceptance is not waived. |
| Existing output oracle required review before verification. | blocker-grade for controller design | Verify while in-progress, transition afterward. |
| Row presence alone allowed failed report rows. | blocker-grade for controller design | Require complete pass/evidence rows before advancing. |
| Same-session resume lost configured model suffix. | minor implementation detail | Restore exact observed initial model on resume and verify actual identity. |
| A quoted example could satisfy a loose acknowledgment search. | blocker-grade for controller implementation | Validate the whole phase-local final message; regression tested. |
| Codex report claimed runner counts absent from its tool output. | evidence limitation in regression | Record qualification; do not treat automated output verification as proof of the host's claimed observation. |

## Remaining work

This controller is development tooling tied to the disposable pilot fixture; it
is not copied into an `npx skills` bundle or wired into native Claude aliases.
The next implementation decision is how to expose this validated checkpoint
mechanism in the supported installed execution path, including dependency/session
management and Claude's adapter model policy. That needs an explicit distribution
contract; simply installing the current skill does not enable the controller.
The broader pilot and bulk conversion gate remain open until the advertised
installed path meets acceptance. No release, push, tag or marketplace change was
performed during this recovery.
