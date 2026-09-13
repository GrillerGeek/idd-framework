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
