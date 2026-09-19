# Archive host evaluation — SPEC-57b4

Implementation in progress. Default tests and disposable fixture oracles are separate from the eight required actual-host observations and independent full-trace reviews. No actual project archival, human peer review or remote publication is inferred.

## Offline verification and source review

434 full tests passed on Node 25.8.1 and minimum 22.20.0, followed by 103 final targeted Archive tests after six added regressions (440 final total; final103 tests pass on both runtimes). All 64 individual catalog/probe installer combinations pass; four additional Archive-only probes actually run the scan helper after installation, including copy-source removal, with no hierarchy creation. Deterministic assembly produces 162 files and all fifteen stages have standalone bundles. The first sandboxed full-suite attempt hit the existing Forge loopback restriction; rerunning the authorized suite with local socket capability passed on both runtimes. This was environment capability, not an Archive code failure.

Independent review corrected acceptance-oracle weaknesses before trials: exact classification/review inventory, unknown/deferred/orphan dispositions, binary Git blob recovery, directory removal, safe move ancestors/dangling targets, published-review precedence, single-link owned outputs, preserved old tag object IDs, valid numeric suffixes and invocation-bound dates. Synthetic verifier checks are not a production archival engine. Source clarifies separate Git metadata accounting and pre-tag original binding versus later exact expected owned state. Apply refuses file modes that Git cannot recover, preserving unrelated files with other modes; it does not promise arbitrary directory-metadata recovery.

## Actual observations in progress

Seven required cases have independently accepted complete traces: Claude classify `QOzmH3`, Codex classify `R8acFA`, Codex apply `MExnmk`, Claude dirty refusal `dxxUBU`, Codex dirty refusal `0hI3HD`, Claude malformed-source refusal `RRFUZU`, and Codex malformed-source refusal `mJ7mYf`. A successful Claude apply observation is still pending. Output-oracle success alone does not establish procedural acceptance.

The evidence directory prefix is the OS temporary directory followed by `idd-archive-<host>-<scenario>-<suffix>`. Original `result.json`, baseline, copied installed bundle, prompt and host traces remain intact. The Codex apply trace created an annotated fixture tag and owned commit `7a16f66976921f369785446dcae5d4a3dcdbd97d`; all selected binary bytes and executable modes were independently recovered. Its older copied bundle predates the subsequent explicit lifecycle/root/deferred-policy clarifications. The Codex malformed-source retry's initial Git capture command exited successfully but its printed JSON is absent from the visible receipt, so the later literal cannot be directly matched to that output; later assertions and independent exact baseline preservation passed. This is a specific evidence limit, not proof of that missing literal match.

## Retained failures and interruptions

| Trial | Actual result and disposition |
|---|---|
| Claude apply `tcUCw4` | Failed after six approved unlinks: the model's directory loop indexed entries already removed from its mutable expected inventory and raised `KeyError`. Annotated recovery tag and updated, reconciled ledger remain; no commit occurred. Preserved for recovery inspection. |
| Codex classify `eTzD02` | Failed active Product classification. An older resource lacked the complete existing lifecycle table; source now supplies that table without changing schema values. |
| Claude classify `oR5qId` | Failed active/unknown status classification. First incomplete capture and candidate errors were corrected before writes, but final classifications still failed. |
| Codex malformed-source `brzTDU` | Usage exhaustion before the deliberate malformed-source validation; preserved baseline, not accepted refusal evidence. |
| Claude classify `xFoIVD` | Failed deferred-obligation disposition and root preservation recheck. Source now distinguishes a keep recommendation from an actual human keep decision and explicitly includes root type/mode in guards. |
| Claude apply `mYgei5` | Timeout before any project mutation. Exact complete snapshot/root mode, Git state and tags match the original baseline. No tag or apply success. |
| Claude classify `BI5IJM` | Timeout after parsing and code checks but before any project mutation. Exact snapshot/root mode, Git state and tags match the original baseline. No new manifest. |

For `tcUCw4`, the retained annotated tag object is `0f4243099f494acc258932db9d1d6d9c0452b332`, pointing to unchanged HEAD `04776deda8536e6435729abe0058505707be8b22`; the index remains unstaged. The terminal Intention, subject review, Exploration map/ticket, executable script and binary asset were removed. Three empty Exploration directories, the cross-cutting review and approved manifest remain; the ledger contains the reconciled additions. Independent inspection recovered every selected file's bytes/mode from the tag. The incomplete fixture is not repaired or silently retried in place. A fresh prompt now requires immutable operation lists prepared before mutation.

Automatic approval review rejected one retry because account usage was exhausted. The user explicitly reset the limit and requested continuation; the same authorized disposable-fixture retry then launched. No guard or usage restriction was bypassed, and no personal settings or credentials were changed.

Original receipt SHA-256 values: `tcUCw4` — `1922cfdd6ca31688a5f8e79a86f5039e66eeb6e9a97e909b6e3b9e78127283a4`; `oR5qId` — `52cb7506b8bec7b8cf108dd59843916beddcec0d68dacc3e6bb812fbc2ff037e`; `xFoIVD` — `52e53c54cdcbd2360d81ed4bc6df203e572eed1fabfe84c8cd5764fd242ea653`; `mYgei5` — `f41c2aa5867904e5a2eadbdedd5b26b1db05896132773f396971dd1d0d3a3b28`; `BI5IJM` — `d0a3ddb59a6fd95bbd1d815d82e4da258717a23b16e6980b0a3e545824c49b7c`.

## Separate current-oracle revalidation

Current oracle SHA-256: `9a267bd509b55b8bbaf9cd672cfa20964dcc5d7ddb611896394427f3f11e2b53`. Six independently accepted cases were rechecked against retained original baselines without rewriting their receipts. Remaining successes will be added after independent trace acceptance.

| Case | Host/scenario | Original receipt SHA-256 | Result |
|---|---|---|---|
| `R8acFA` | codex / classify | `1d6a75500f2074994580a6a8c7e33c78b84bcbd2b96921a4013390f2ee5b9ed9` | pass |
| `MExnmk` | codex / apply | `fdbe64b4b1d41800456a807f93d5a18340a8ca076c2b3ae3016512feac5778a2` | pass |
| `dxxUBU` | claude / dirty | `ecf72350b2f752d73dfc26b0ec8275f943f9586d6dbf9536b6de10558b767b80` | pass |
| `0hI3HD` | codex / dirty | `812c3e2c01778c3429230297cdeee02f2c1a35348e1603a3c6e9ccf7be2c6b79` | pass |
| `RRFUZU` | claude / undistillable | `7217b1105712c8d69f1287fcfff2b8f0a885490cb1e330faf45b8ed64f95a7f0` | pass |
| `mJ7mYf` | codex / undistillable | `1fa8e3ff4a2239d245831de517d382da1a584c6e95ffdf5016a01673afcf17c8` | pass |

Claude classify `QOzmH3` passed independent full-trace review: both retained baseline literals match the first 40-entry inventory and root0755; all 25 bound inputs precede actual code checks; the sole fresh manifest uses exclusive no-follow creation with complete pre/post preservation and separate Git checks. Correct active/unknown/deferred/orphan/review dispositions and no apply were observed. Original receipt SHA-256 `8615038e16d9921b5b394223d6a3bfe71a99003ce03e64bd802d997f3c710dfd`; stdout SHA-256 `f8904b897cfedd540905c283bb49f171256ff81d557c868bdc8cc05d64271acf`. This is configured Claude ELI5 evidence; original failures remain unchanged.

Claude apply `a1bnBx` also timed out during read-only preparation. Its complete root/descendant snapshot, Git state and empty tag list match the original baseline; no actual apply preflight, YAML binding validation, tag, ledger edit, deletion or commit ran. Receipt SHA-256 `19e149ffc1b00f54e46df0688eb347230ffc511a559446167d23455b0587c754`. The trace reported roughly 40,800 estimated thinking tokens; this supports a latency/preparation diagnosis rather than a tool exception. A fresh trial requires one visible inline process retaining original state in memory throughout; no gate, model or 600-second bound was changed.

Claude apply `ijtvMb` timed out without issuing the required retained-baseline process. It read source content before a complete original hash/byte capture, so even its proposed organization is not procedural evidence. Harness snapshots/root mode/Git/tags remain exact; no mutation occurred. Original receipt SHA-256 `fd868dfaf3a09bf949b68d67950db1a7a867394534c6193ea9c13317c8060578`; final thinking telemetry about28,650 estimated tokens. A contributor-only opt-in `--claude-effort medium` now permits a separate latency experiment with the same configured model/style and unchanged gates/bounds. The default invocation remains unchanged; two new tests verify that distinction and reject invalid/ambiguous/cross-host options before fixture creation. This is an explicit experiment setting, not a personal configuration edit or changed workflow requirement.

The medium-effort `sKMCpp` trial failed during capture on unsupported `git for-each-ref -z` (exit129), then timed out before a correction. It also inspected consumer context before the required complete original capture. Exact harness snapshots/root/Git/tags remain unchanged. Original receipt SHA-256 `5f89ba9167b8ef758290276569d86ff7cd32f46dc8dfde7cc1c5d4115ea8f4e0`. This is a real command failure plus timeout, not pure latency or accepted procedural evidence.

A fresh independent author recovery gate passed for optional1200-second Claude apply evaluation only. Default600 seconds, configured model/style, all mutation/phase/receipt requirements and4MiB cap remain. The new prompt requires emitting retained raw originals before fallible Git/parser work, uses supported for-each-ref formatting and forbids reading consumer context before capture. A new frozen fixture is running; no failed fixture is repaired. The Spec remains in-progress. The implementation source can be checkpointed locally without calling its incomplete host matrix accepted.


Claude apply V9Z3Qa timed out at1200seconds with explicit medium effort. Original receipt SHA-256 `f27c1891f30f4bbe0c230226279b2095a09cd6a907ca7e8c2aab33f81c82bf72`. The single apply tool returned exit137 without phase stdout; this does not establish completed postguards. HEAD/index/branch/config remain at6d2b1aa0018d0c8c5085df726fb0f23d5870692b. Annotated idd-archive-2026-09 tag objectd52cf4cc4a4ff5f1bc310f3a9b2adbc2ab2bde2a points there. Ledger preserves original records/custom metadata plus3planned records/count3. INT-a111, subject review and all4Exploration files/3directories were removed; docs/archive is empty. Crosscut review and manifest remain exact originals; no staging/commit. Independent review recovered all selected originals, binary bytes,0755 executable and old ledger/manifest from the tag; unowned entries/root mode remain exact. No repair performed. Missing phase stdout limits exact last-guard certification.

No deterministic stopping-point script error was found; deadline termination is the supported diagnosis. A separate Git baseline adoption weakness was found: later G0 did not compare to the first retained Git capture. The fresh optional low-effort diagnostic reinforces that comparison and flushed phase output, keeping configured model/style,1200apply/4MiB and all required acceptance. The fresh recovery gate is recorded separately; V9Z3Qa remains a partial failure.


Claude apply vL5F2u remains blocked by a1200-second low-effort preparation/transport
timeout (exit143). It issued only installed-resource listing and fiveReads, no
consumer capture, parser/binding/preflight, inline apply process or mutation.
Telemetry reached roughly24,000 preparation tokens followed by an unknown API
retry/stream-resume request; a rate-limit event said allowed. No shell exception
or usage exhaustion is established. Low effort alone did not resolve the latency.

Independent root and34-entry snapshots, modes/links/bytes, Git HEAD
`ef80ebaa21cc01fe7cd3c62542ed4d4745e87e4b`, branch/index/config/status and empty tags
remain exact. All ledger/manifest/reviews/Exploration assets remain original. No
repair or recovery was performed. Separate oracle correctly fails for no recovery
tag. Receipt SHA-256 `020cf2c78fb5cd1d84208f01f6266218d12a6b9a53ae9b7a565fb3060d38ea91`;
stdout `bae28810f389300ae0f321c7a90fdcf5dd593d3eb68be9176f0eb0acb62b7f4a`.
Model claude-opus-5[1m], ELI5, Claude2.1.269. Bundle hash
`666f7ec111000e6b7658d240bfe3bd11efeb326cce8afb2f3c9c5a3db9b05dd5`;
evaluator `d6a05f9dcb4bf9757b6bf67b3806e1bf4b20b08c06a6e1fcff8f31a48e08ce6d`;
module-loaded/current helper `b84922a4fba4126bcc52dc7b9af5debd9e3e3ba34de8b4487c0465ed4cf38a5f`.
Further unchanged retries are paused. Seven required cases remain accepted; full
Claude apply and Archive lifecycle closure are not complete.


Fresh low-effort1200second trial6FhPEF under a process-scoped idle-sleep assertion also timedout(exit143). Its actualClaude APIevent says the computer wentto sleepmid-response. Powerlogs independentlycorroborate MaintenanceSleep intervals117,768and878seconds coveringmostelapsedwalltime; the temporarycaffeinate assertion didnotestablishanuninterruptedawakerun. Only5installedresourcetoolcallscompleted; no consumer capture orapplycommandran. This isnotanapply-script orBash-timeouterror.

Originalroot+34descendants,HEAD80d4fc8968518a4d9b231c40badde004b104a80d,master,index/status/config andemptytagsremainexact. Ledger,manifest,reviews,Explorationbinary/executablebytes/modesarepreserved; no recoveryneeded. ReceiptSHA-256498a351591984c84995f117d8267b874d679cb6195b742c09a5d9c365af2e86a; stdout679f26b1fe2d6c38ea8ef8963b9597937fe4e28496b7d69d387628981f54e0af. Bundle/evaluator/oraclehashesmatchvL5F2u. Separatecurrentoraclecorrectlyfails0versus1recoverytag. Waitforreliablyawakehoststatebeforeanothertrial; preserveallpreviousactualprocedurefailuresandqualifypreparation-latencyclaims,withoutretroactivelycallinganytimeoutaccepted.


## September 15: awake-host apply trial and narrow recovery

Fresh low-effort trial `ltRP7Q` completed in 262.4 seconds with process exit zero,
Claude Code 2.1.269, configured Opus 5[1m]/ELI5, and the explicit 1200-second bound.
It is **failed partial implementation evidence**, not an accepted apply or timeout.
All earlier observations and original receipts remain unchanged.

The visible script staged the approved changes and then asserted that overall Git
status was empty before committing. Staged changes correctly make that status
nonempty. Independent inspection established this deterministic defect from the
complete script and final state; the literal error traceback was truncated in the
host tool result, which mostly repeated raw base64. No commit occurred. The first
complete filesystem/Git capture remained bound through its combined digest,
`75e3536aabf7d65cc6fa52575724b0fe2137365963969935dc40fa57b32b8bac`.
A read-only binary-display decoding error did not replace that original baseline.

Annotated tag `idd-archive-2026-09`, object
`210dbe29fbce452b1efe5ac255a5d5453ebf2660`, points to unchanged HEAD
`221719f7e9ce4e2116bffa7287a1896f68421739`. Root mode, master and configuration are
preserved. The persisted ledger retains all previous data plus exactly two
artifact records and one moved-review record, with count three. Approved artifact,
subject-review, entire Exploration and manifest deletions completed; the audit
review moved with exact bytes/mode. Ten staged paths match the intended A/M/D
changes, and independently checked index blobs/modes match the expected content.
No unstaged or unowned changes exist. All nine recovery files, including the old
ledger, manifest, seven-byte binary and 0755 executable, recover exactly from the
tag. The partial fixture was not repaired or restarted.

The first automated assertion instead reported September 14 versus September 15.
The workflow does not prescribe a timezone: September 14 local and September 15
UTC were both actual invocation dates. The original verifier requires its UTC
fixture date. A separate in-memory local-date diagnostic proceeded through
recovery/ledger/preservation checks and then correctly failed for uncommitted
changes. Neither the baseline nor original receipt was altered or accepted.

The independently gated recovery makes the existing UTC fixture date explicit in
the contributor prompt, without changing production date semantics or loosening
any verifier assertion. It also explains full expected index/blob/mode/status
deltas before one guarded staging operation, and clean status after commit.
First raw capture before fallible work, full per-operation guards and concise
error-first output remain required. Independent trace review checks updated_at;
the unchanged oracle checks archive-entry and new-record dates, not that field.

Original receipt SHA-256:
`77a8b7d5ddf17d54fc6b79e2fe1f2b2313a81cd16f2b34f3419d10891b707093`;
stdout: `0b081273c1a472af4c79fb444948fdeb2689a31373e9b6b6e4f4426b9344f335`;
baseline: `d599e553c47b8a0ae05f4198af7af709d1bb5d312aa6470f2ff2b082b6936a8a`.
Bundle/evaluator/oracle hashes match the earlier low-effort originals. A fresh
fixture, not repair of this one, is required for the next full observation.


The date/index recovery was independently reviewed after implementation: only
archivePrompt and its evaluator call changed; reconcile, verifyArchive, shared
transport and all production plugin files are byte-identical. The two added
regressions pass, with all 106 Archive tests passing on both runtimes. A final
review clarification explicitly includes new manifest.date in the supplied-date
fields. Existing original source-checkpoint reports remain unchanged.

Recovered evaluator SHA-256:
`26f11c87b79fb694ae17e6d9b9a02f2bc53661d3eac8341a7aaa065fdf0cf891`;
helper/module hash: `4df3098d35c86002e5d1619c4e67ad25e1908ca405c90d8db0a21eb02039c3db`.
All seven previously accepted cases independently revalidate against this module
without modifying original receipts; separate output is
`/tmp/idd-acceptance-archive-seven-recovery.json`. The installed Archive bundle hash
remains `666f7ec111000e6b7658d240bfe3bd11efeb326cce8afb2f3c9c5a3db9b05dd5`.


## UIZWcO: output passes, procedural review fails

The next low-effort case `UIZWcO` completed in 229.214 seconds. Its original
receipt records output-oracle **passed**, and that receipt remains unchanged.
Independent procedural review **did not pass**. This case does not supply the
eighth required acceptance.

The second complete filesystem inventory and raw bytes match the harness and
first filesystem digest. However, the script only printed its new Git digest;
it never asserted equality with the complete original Git capture. Comparing
HEAD/branch/status/refs left original config/index binding incomplete. Git guards
ran around batches rather than each filesystem mutation. An intervening consumer
read used current files rather than retained originals. A per-command hooksPath
override also failed to demonstrate honoring the existing hook policy. These
are actual procedural gaps, not a failure merely because two processes were used.

Independent final-state checks do pass: one commit
`7b65c9697943b0622f7ce6b69c19ac654e0d9a62`, parent
`97c6a36efdaea60f8f3e42e1c0c7730f953f33ac`, annotated recovery tag object
`e3cedc1e0a7889728a7a4caea5a1ec04ad7f91dc`, three new records and one count-three
entry, exact previous ledger data, approved full Exploration removals, exact moved
review, recoverable removed bytes/modes, preserved survivors/root/config, and a
clean index/worktree. ledger.updated_at was independently verified as the supplied
2026-09-15, matching archive-entry and new-record dates. No repair was performed.

Receipt SHA-256: `67a84f8f14ece4f1a44a64bc8f8431fc5a4e30151b1e356e4ea32b37bedf45fa`;
stdout: `12d73290ab9a8194e41ca3bbae89bf4be5d6db6bb19a73d5cb81276aded7e4b4`;
baseline: `6559f1ed3fdc67888109ff3d07463e0e0d78744c5929b16099c25d016d0c269b`.
Bundle/evaluator/helper hashes are the date/index recovery hashes above. Separate
`/tmp/idd-acceptance-archive-eight.json` verifies eight output states only; it is
not eight independent procedural acceptances.

The optional prompt now reiterates an actual equality assertion against the first
combined filesystem/full-Git digest, semantic reads from retained originals, a
full filesystem-plus-Git guard at each mutation, and source self-review before
invocation. Existing hook/signing policy must be honored without a command-level
override. These restate current safety requirements; no production source or
acceptance-oracle assertion is changed. Prior failures remain intact.


## Final acceptance — September 15: QqBauk

**All eight required cases now have independent procedural acceptance.** The
final Claude apply case is `QqBauk`, not the output-only `UIZWcO`. It completed in
582.137 seconds with configured Claude Code 2.1.269 / Opus 5[1m] / ELI5, explicit
low effort, a 1200-second allowance and the unchanged 4 MiB cap. Acceptance applies
to this measured lane; default effort, native aliases and arbitrary projects are
not inferred from it.

Independent review reconstructed all 35 first filesystem entries including root,
21 raw files and nine original Git observations, matching every baseline
byte/type/mode/link and recomputing the combined digest
`7d6c1a729179faae9b42f7dc271b375d8bda8548b351719163c248da6eef098c`.
The successful script actually asserts equality with that first digest before
parsing or adopting state; the untruncated result records the assertion.

The same complete filesystem-and-Git guard runs before and after each tag,
ledger write, six file unlinks, three directory removals, mkdir, move, manifest
unlink, one explicit-path staging operation and commit. Expected states derive
from the original plus exact intended changes. All corresponding guard/step
markers are retained. Candidate and persisted ledger reconciliation precede any
deletion. The full 14-entry staged index is prederived with modes, blobs and stage
zero, plus exact diff/status, and checked after staging and before commit.
Existing hooks/signing policy is respected without bypass.

An earlier read-only preflight stopped on an overly strict environment predicate;
the retry allowed only the actual harmless values GIT_PAGER=cat and
GIT_EDITOR=true. It reasserted the exact original combined digest before proceeding,
proving no intervening fixture/Git mutation. Retained-output extraction and binary
display corrections were also read-only and used original captured data. These
preparation corrections remain visible; no destructive partial state was repaired.

Final commit `11830efb8dcbb714f0c6718e4e07ccf3c8079f8a` has parent
`54311bea9b40f2b0661223743a6c0506bdccbc59`. Annotated tag `idd-archive-2026-09`,
object `f46aa278d5e743439e507e80cfef7e04d630ed90`, points to that parent. Every
approved removed/moved byte and Git mode recovers from the tag, including the
seven-byte binary, 0755 script and old ledger. Two artifact records plus one moved
review yield count three while preserving all previous ledger data. updated_at was
independently checked as 2026-09-15, matching new archive/record dates. Only approved
changes exist; survivors/root/config and moved-review bytes/mode are preserved.
Commit tree/parent/message/index/refs and clean status pass. No operation remains
unfinished, and the unchanged live reference is explicitly reported.

Receipt SHA-256: `5bca6fd656d6f9cadb3fec987ffd4dc87403dfaf3475c4d244a8a29638bd1812`;
stdout: `140a2f0177c7e06d0673a44c517efb84921c385fd188a89dcd7a6a97c921b239`;
baseline: `b5168eb8baeaf6147624fea7fa4800222f9e1a860b7aa2e212a9161e7f7e7ce7`.
Evaluator: `26f11c87b79fb694ae17e6d9b9a02f2bc53661d3eac8341a7aaa065fdf0cf891`;
helper/module: `f2240b53f02a072969eabb6f398e98b6490e6afb1a010d8a049604bc4a5825f9`;
bundle: `666f7ec111000e6b7658d240bfe3bd11efeb326cce8afb2f3c9c5a3db9b05dd5`.
Separate `/tmp/idd-acceptance-archive-final-eight.json` revalidates the eight accepted
original cases without rewriting receipts. Both final full suites pass 499/499;
see [final verification](2026-09-15-final-acceptance.md). Actual human review and
publication remain pending.
