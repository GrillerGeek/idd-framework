# Migration catch-up — September 15, 2026 UTC

**September 19 update:** Jason approved the completed local implementation with
“Looks good.” The four final Specs have moved from review to validating. See the
[approval record](2026-09-19-migration-implementation-approval.md) for scope and
remaining validation. Publication is still pending. The September 15 handoff
below is retained as its dated checkpoint.


**The local migration implementation is complete and verified**, on
`codex/portable-skills`. All fifteen stages, the full portable router, native
Codex/Claude packaging and framework 1.7 / plugin 1.7.0 candidate are implemented.
All eight Archive cases now have independent acceptance, including complete Claude
apply. Both final full suites pass 499/499. Archive (`2970f3d`), router
(`68836de`), native (`2fe5180`) and release preparation are in **review**.
Actual human implementation review remains pending; no Spec is marked done from
unattended work. Nothing was pushed, tagged, published or installed personally.

## What you can use and review

The [contributor guide](../contributing-agents.md) explains working on IDD with
Codex. The [installation guide](../installation.md) covers native Codex, native
Claude, a single self-contained router and selected standalone skills installed
through pinned `npx skills@1.5.25`. The generated distribution has sixteen public
skills, fifteen complete stages and 318 files. Native Claude preserves fifteen
legacy commands, fourteen agents and its two optional configuration fields.

The [candidate notes](../releases/v1.7.md) summarize the changes and remaining
publication sequence. Production versions and strict version assertions are now
1.7.0; the README framework badge is 1.7. Version preparation preserves all other
manifest data, generated/workflow/runtime bytes, adapter bodies/frontmatter,
dependencies, templates, examples and historical evidence.

## Accomplishments and evidence

| Local checkpoint | Outcome | Acceptance state and evidence |
|---|---|---|
| `2f9c1d8` | Shared contributor instructions and lifecycle ownership | [Foundation execution](SPEC-5113-20260912T130127Z-execution.md); human review remains distinct |
| `ea0c878` | Deterministic skill assembly, catalog, package checks, CI and installation probes | [Packaging execution](SPEC-bffd-20260912T152817Z-execution.md) |
| `86e096a` and `54d134f` | Interview/gap-check/implementation pilot and guarded installed Claude controller | [Pilot acceptance](2026-09-13-pilot-acceptance.md), [controller evidence](SPEC-c45b-host-evaluation.md); configured terminal lane accepted, Sonnet full-procedure lane experimental |
| `5b78b78` | Five authoring workflows and exact-metadata thin adapters | Sixteen actual-host observations accepted; [evidence](SPEC-8406-host-evaluation.md), [execution](SPEC-8406-20260913T052450Z-execution.md); Spec in review |
| `cba0ea9` | Technical review, deep review and review-spec | Ten observations accepted; [evidence](SPEC-44b9-host-evaluation.md), [execution](SPEC-44b9-20260913T064000Z-execution.md); Spec in review |
| `190abb0` | Controlled portable Forge launcher | Four observations accepted; [evidence](SPEC-e1d4-host-evaluation.md), [execution](SPEC-e1d4-20260913T065500Z-execution.md); Spec in review |
| `f92b4ee` | Exploration chart/resolve, actual claims and preservation guards | Twelve observations accepted; [evidence](SPEC-c11a-host-evaluation.md), [execution](SPEC-c11a-20260913T072446Z-execution.md); Spec in review |
| `fe46d55` | Archive implementation, guarded apply protocol and fixture oracles | Eight required observations accepted; [evidence](SPEC-57b4-host-evaluation.md), [execution](SPEC-57b4-20260915T014331Z-execution.md); final closure `2970f3d`, in review |
| `4c27a23` | Complete router with all fifteen stage resources | Five host observations and four bulk lifecycle cases accepted; [evidence](SPEC-ab84-host-evaluation.md), [execution](SPEC-ab84-20260915T014456Z-execution.md); final closure `68836de`, in review |
| `234199c` | Native manifests/catalogs, strict validation, isolated lifecycle evaluator and installation guide | Both native cases independently accepted, 35 successful command receipts; [evidence](SPEC-aa60-native-evaluation.md), [execution](SPEC-aa60-20260915T014613Z-execution.md); final closure `2fe5180`, in review |
| `bb2f9e8` | Version-only 1.7 candidate and comprehensive handoff | [Final release execution](SPEC-3671-20260915T014756Z-execution.md); in review, no release event |

Earlier detailed chronology remains in the
[September 12 report](2026-09-12-unattended-migration-report.md) and the linked
milestone reports. Their historical versions, failed receipts and conclusions
remain unchanged.

## Claude execution checkpoint and Archive distinction

The requested installed Claude execution checkpoint was completed in `54d134f`.
The controller uses reviewed `execution_contract` output paths and validation
argv, preserves configured model/style by default, verifies real read-only
acknowledgments before writes, restricts writable paths and validates the report.
Orchestration owns lifecycle transitions. The accepted trace preserves its
baseline and confirms all controlled deliverables; this is stronger than a package
loading test. Missing/unsafe prerequisites refuse before host execution. Native
alias certification remains separate from terminal-controller success.

Archive is a later, separate workflow acceptance checkpoint. Its source implements
reviewed classification, clean committed manifest binding, full raw-byte/type/mode
preservation, annotated pre-delete recovery tags, ledger reconciliation before
first deletion and explicit partial-failure reporting. Codex apply and both-host
classification/dirty/malformed cases are accepted.
Complete Claude apply now also has independent acceptance in QqBauk.

Earlier trial `6FhPEF` reported computer sleep before any apply command, with its
fixture unchanged. Awake-host trial `ltRP7Q` later reached exact staging but failed
on an incorrect generated check requiring empty Git status before commit. Its
annotated recovery tag and exact partial state remain preserved. A reviewed
contributor-only correction made the fixture UTC date explicit and clarified
staged-index checks; production workflows and the strict oracle did not change.

The next case, `UIZWcO`, completed its commit and passed the final-state oracle,
but independent review found incomplete original Git binding and missing Git
checks around individual mutations. Its original output-pass receipt remains
intact; it does **not** count as procedural acceptance. A further reviewed prompt
clarification requires an actual combined-baseline equality assertion, complete
filesystem/Git guards at each mutation and preservation of hook/signing policy.
The fresh QqBauk trial subsequently passed independent full-trace review. It
asserts the first complete combined baseline, checks filesystem and Git state
before/after every mutation, reconciles the actual persisted ledger before
deletion and verifies exact staging/commit/recovery. It completed in 582.137
seconds with explicit low effort and a 1200-second bound. Harmless read-only
preparation corrections remain recorded. No failed fixture was repaired or
silently accepted.

The [Archive evidence](SPEC-57b4-host-evaluation.md) records exact state, hashes,
recovery proof and limitations for every attempt. Persistent power settings were
not changed; bounded tests used temporary process-only assertions.

## Final candidate verification

Both Node 25.8.1 and minimum Node 22.20.0 pass package checks. Deterministic assembly
reports 318 files and zero changes. The final version-only audit compares against
`234199c`, checks every protected tracked file and executable bit, requires exact
nonversion manifest/fixture data and confirms unchanged repository refs before
commit. Reports and local links are checked separately.

The candidate's individual installer probes pass all 68 combinations on each
runtime: sixteen real bundles plus one synthetic package, two hosts and two
requested modes. Copy-source removal is real. These are individual installations;
the four previously accepted bulk lifecycle cases are separate evidence.

The original candidate passed both uninterrupted **497/497** suites. After two
contributor-only regressions were added, both expanded suites passed **499/499**,
with zero failures, skips or cancellations: current Node in 75.575 seconds and
minimum Node in 76.291 seconds. The final prompt clarification also passes both
complete 499-case suites (82.530 and 84.414 seconds). See the
[final acceptance record](2026-09-15-final-acceptance.md) for
commands, hashes and environment details. Earlier Git timeouts, sandbox Forge
failures, targeted reruns and the failed 496/497 serial run remain unchanged in
the [release checkpoint report](SPEC-3671-20260914T034930Z-execution.md). The new
full passes supply additional evidence; they do not rewrite those old outcomes.

The native lifecycle observations were made on version 1.6.0 plus disposable
fixture refresh versions. This version-only preparation does not claim a new
actual native lifecycle run at production 1.7.0. Native static regression cases
are included in the candidate suite, and nonversion package data remains exact.

## Decisions made under unattended authorization

1. Keep one canonical workflow source and generate closed portable bundles. Keep
   Claude adapters and model assignments compatible rather than duplicate logic.
2. Ship native plugins alongside the pinned standalone installer. Keep development
   dependencies out of consumer projects; the installed controller includes its
   pinned YAML runtime.
3. Preserve configured Claude policy. Optional Sonnet selection is verified, but
   its full-procedure failure keeps that lane experimental.
4. Preserve real human confirmation, readiness and peer-review rules. Unattended
   authorization applies to this migration; it is not a shipped bypass.
5. Correct oracle deficiencies through reviewed authoring/recovery packets and
   independent review. Preserve weaker/failed original receipts and record later
   revalidation separately, with source/hash provenance limitations disclosed.
6. Permit serialized source checkpoints while frozen Archive evaluation proceeds,
   retaining every final acceptance gate. Final closure was then committed in
   dependency order after full acceptance; evaluation-only recovery left all
   production resource bytes intact.
7. Use 1.7/1.7.0 as the next local minor candidate under contributor versioning.
   Verified local implementation does not imply publication or human review.
8. Use explicit re-add for local standalone refresh: `skills update` skips local
   sources. Single-host default mode is copy; actual Claude symlinks were observed
   in dual-host probes. Host-scoped removal may retain shared canonical copies,
   which remain installed. No broad deletion is inferred from installer output.
9. Use changed-version re-add for local Codex native refresh; its marketplace
   upgrade is Git-only. Claude named local update works. Codex removes observed
   cached versions; Claude unregisters and retains orphaned caches. Verify both
   plugin and catalog removal separately while preserving unrelated registrations.
10. Treat sleeping-host timeouts and sandbox networking restrictions as evidence
    limitations to diagnose, not reasons to weaken safeguards or test assertions.
    Do not keep spending model trials while the computer repeatedly sleeps.

## Practical limits and remaining work

The installation probes used Codex 0.153.4, Claude Code 2.1.269 and skills 1.5.25.
Model observations are bounded traces, not universal reliability guarantees.
Native aliases, fresh desktop discovery, arbitrary project execution, public Forge
UI behavior, real concurrent Exploration writes and later-answer continuation
have not been certified. Some successful traces required reinforced prompts;
original failures and narrow trace limitations remain in their reports.

Raw receipts live in owned temporary directories and can eventually be removed by
the operating system. Checked-in reports retain case identifiers, hashes,
conclusions and limitations; no credentials are copied. An older matrix sometimes
reported on-disk hashes after module import, so final independent revalidation is
separate evidence and does not rewrite original receipts.

The remaining sequence is:

1. Complete maintainer review of the candidate and installation choices, then the
   remaining validation lifecycle. No artifact becomes done or human-reviewed
   merely because local implementation and AI review passed.
2. With publication authorization, push/open a PR, inspect hosted CI and test
   installation from the actual intended published ref/default branch.
3. With final release authorization, merge/tag/publish and coordinate the separately
   owned external `GrillerGeek/skills` marketplace. Personal installation remains
   a separate choice.

Implementation acceptance is no longer blocked on Archive or full-suite tests.
The remaining native alias/desktop and published-ref limits are described above.

The [candidate notes](../releases/v1.7.md) provide the concise release-facing view.
