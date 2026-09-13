# Forge host evaluation — SPEC-e1d4

Four controlled installed observations pass the strengthened output oracle; all four have independent full-trace acceptance. These establish literal argv, cwd, startup/failure observation and owned cleanup. They do not execute or certify the published Forge UI, native aliases or cross-session persistence.

## Measured matrix

| Host | Variant | Evidence directory suffix | Original outcome | Separate final oracle |
|---|---|---|---|---|
| claude | success | Y53s9s | passed | passed |
| codex | success | VB90Ov | passed | passed |
| claude | failure | HsUWKz | passed | passed |
| codex | failure | nEZfTi | passed | passed |

Evidence is retained under OS-temp directories named idd-forge-<host>-<variant>-<suffix>. Original result.json, baseline.json, prompt.txt, stdout.log, stderr.log, installed consumer and launcher evidence/events.jsonl remain unchanged. Separate revalidation: /tmp/idd-forge-accepted-revalidation.json. Each skill installed alone in copy mode; its source was removed. Exact supported tokens were --no-open --port43123 --docs followed by one literal “docs with spaces” argument (the actual argv uses separate --port and43123 tokens).

Success fixtures serve a local HTTP response and record a request while alive, within30seconds of launch. Actual printed URL and PID match user-visible output. Failure fixtures emit CONTROLLED_FORGE_STARTUP_FAILURE and exit23, with no claimed running server or retry. Consumer bytes/types/modes, dirty notes, Git HEAD/index and installed bundles remain unchanged. Recorded PIDs were independently inspected after evaluation and were absent. No public package execution occurred.

## Failures, environment and oracle decisions

Initial Codex success27JtAI reached the correct controlled launcher but its nested workspace sandbox rejected the local listening socket with EPERM. It truthfully reported failure; that original failed receipt is retained. The retry adds only a per-invocation `-c sandbox_workspace_write.network_access=true` to the optional evaluator, preserving filesystem sandbox and personal configuration. This enables network access generally, not a loopback-only network boundary. Avoiding public package fallback remains a procedure and trace requirement. The setting is documented in the [official configuration reference](https://developers.openai.com/codex/config-reference).

Initial offline server tests likewise needed loopback/process-inspection access from the outer sandbox. Fixture synthetic messages were corrected to use actual captured event envelopes. Independent source review then found three oracle gaps: late live inspection, invented native handles and treating failed ps inspection as confirmed absence. All were fixed and regression-tested. The oracle now requires an independently recorded PID, actual live inspection within30seconds and confirmed process absence; unknown cleanup fails. A final saved-JSON-baseline regression normalizes object prototypes without changing byte/type/mode comparisons. Original model receipts are never rewritten to match later oracles.

## Provenance

| Case | UTC invocation | Bundle SHA-256 | Evaluator SHA-256 | Original oracle SHA-256 |
|---|---|---|---|---|
| Y53s9s | 2026-09-13T06:44:14.662Z | cada5c46027103d96967ccb1415f249a6b5979017f97b6ab28d24eb4e21f3c37 | 34ed075a0abebade5d17bec532265ea410e33a45fa87782541c06b28f2ed45a4 | ac213e61806f6d1c30f3b31123df625c332432f2d3761e5d5a231016bc63c0f9 |
| kNUqnK | 2026-09-13T06:47:30.614Z | cada5c46027103d96967ccb1415f249a6b5979017f97b6ab28d24eb4e21f3c37 | 6e3f23a96a41c1f47ec4fd871e53eb6392048c2bde08f4590fabb233617a362d | 5220d093600aa555e77bd84393498322fbbda4e07ed89aba54517d2e42730f40 |
| HsUWKz | 2026-09-13T06:47:35.073Z | cada5c46027103d96967ccb1415f249a6b5979017f97b6ab28d24eb4e21f3c37 | 6e3f23a96a41c1f47ec4fd871e53eb6392048c2bde08f4590fabb233617a362d | 5220d093600aa555e77bd84393498322fbbda4e07ed89aba54517d2e42730f40 |
| nEZfTi | 2026-09-13T06:47:41.856Z | cada5c46027103d96967ccb1415f249a6b5979017f97b6ab28d24eb4e21f3c37 | 6e3f23a96a41c1f47ec4fd871e53eb6392048c2bde08f4590fabb233617a362d | 5220d093600aa555e77bd84393498322fbbda4e07ed89aba54517d2e42730f40 |

Claude observed version2.1.269 with configured model/style retained. Codex version and full argv are in original receipts. Each host invocation is bounded600seconds/4MiB. No npm test/CI invokes a model. The controlled fixture and readonly npm metadata observation (0.6.1, Node>=20 on2026-09-13) are distinct; this migration preserves the existing unpinned public launcher policy.

## Verification and limits

283 full-suite tests passed on Node25.8.1 and22.20.0, followed by36 Forge-specific tests on both after one additional persisted-baseline regression (284 total tests in the final source). All52 installation combinations passed. Assembly has146 generated files, twelve portable stages/three planned; the Forge command frontmatter is byte-identical. Source/oracle review found no remaining concrete issue. Actual human peer review, native alias behavior, published application UI and client-close survival remain open.

## Independent final trace decisions

Claude success Y53s9s has native handleblxwem8v5, PID32030 and live HTTP inspection8.479seconds after launch. Claude failure HsUWKz has native handleb73foc356 and exact error/exit23. Codex failure nEZfTi proves exact error/exit23 and no retry; its final PID matches fixture events but the claimed print is absent from stdout, so that print is not certified.

Codex success kNUqnK remains limited: its stdout omitted the partial native background return even though exactargv/cwd/liveHTTP and cleanup were proven. It does not satisfy the final success trace gate. Fresh VB90Ov includes eight original tool call/output records selected from the exact owned normal Codex rollout. The reviewer verified sourcehash/thread/project and native session96408, actual printed PID65043/URL, continued live session polling and HTTP inspection6.158seconds after launch. A supplemental ps check was blocked and honestly disclosed; the native handle/direct exec chain establish ownership. No model-issued stop or consumer/scratch/public-package action was observed. Cleanup found recorded processes absent; this establishes neither client-close survival nor which runtime component terminated them.

The optional evaluator now retains normal owned Codex history instead of ephemeral mode to capture original background results that stdout omits. It does not edit personal configuration; it copies only tool records from a matching UUID/cwd, checks8MiB source and combined4MiB evidence bounds, and records hashes. Missing evidence remains blocked. Earlier failure receipts remain unchanged.

Final success provenance: VB90Ov bundle cada5c46027103d96967ccb1415f249a6b5979017f97b6ab28d24eb4e21f3c37, evaluator 23f13fc7ebbedb213ed99c7e85ae4cf2ac5f2847dae0de7e18ee7cb03779c84d, original oracle 770ae7f7790edfff7d105f7e3c7053bdfdafe78203d6f0cf2ee3abfc0ffb7997; original receipt SHA-2563e94bae36f15e8467c7b4327825bc598584d0c032b5b03b61f7011a18dfe9d27. Native filtered records SHA-256daa46ad721a58cc5478d0015f0dd1e7510b3fc2c25a53873a8ab49fa5c815c1a.
