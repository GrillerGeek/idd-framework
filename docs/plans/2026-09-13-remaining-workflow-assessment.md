# Remaining workflow assessment — September 13

This is authoring preparation under the user's unattended implementation authorization. It does not gate implementation or change shipped contracts. SPEC-44b9 currently owns review-stage catalog integration; the following packets must serialize their catalog/inventory changes after it.

## Exploration: chart and resolve

The existing charter/resolver and template preserve a useful distinction: stakeholder decisions require actual interaction, while bounded research may be delegated. Main-conversation orchestration should own questions, claims and shared-map writes. Role adapters can retain Sonnet policy while returning proposals/results; no isolated worker may invent the human half of a discussion. A no-fog chart should create nothing and offer interview/quick-spec. One non-research ticket remains the per-invocation limit.

Before writing an executable Spec, resolve these observed gaps explicitly:

- Named ticket selection must still respect dependencies and existing claims; it must not silently steal another session's ticket.
- The current `git add <ticket>; git commit` wording can include unrelated staged user changes. Claims need a path-scoped commit with selected-ticket cleanliness and preserved unrelated index/worktree evidence. A failed claim commit must not be treated as ownership.
- “Frontier empty and fog empty” alone can mark a map clear while tickets remain claimed, blocked, or part of a dependency cycle. Preserve the frontier definition; author a precise terminal-state decision and own any corresponding template/framework references rather than silently changing one copy.
- Research dispatch needs the same dependency checks and failure handling as ordinary resolution. Failure must not produce resolved status or a map decision. One writer updates the map after validated results.
- Fog graduation, new ticket numbering and dependency wiring must be prepared as a validated batch, with no overwriting existing ticket names and no copied resolution text in the map.

Required evidence should include chart with confirmed context, no-fog/no-write, one-ticket claim/resolve, missing stakeholder answer, claimed/blocked selection refusal, actual research success/failure handling and preserved unrelated staged work. Host tests should use local factual research fixtures; external searches remain optional question-dependent evidence.

## Archive

The existing architecture deliberately separates classification from reviewed apply. Classification writes a manifest; it does not delete. Apply requires a clean tree and committed reviewed manifest, then an annotated recovery tag before distillation/deletion. Keep these ordinary gates intact and perform destructive tests only in disposable repositories.

Observed contract issues to resolve before implementation:

- Command-layer reconciliation says ledger additions equal artifact archive rows, while the ledger reference additionally requires one record for each moved cross-cutting review. Define artifact and moved-review counts separately and reconcile their sum; otherwise a valid review move can be mistaken for a mismatch.
- Validate manifest paths/types/internal identities against the actual tree, reject traversal, symlinks, unexpected directories and duplicate operations, and explicitly cover every file under an Exploration directory before recursive deletion. The manifest's EXPL map path represents the entire directory; the recovery tag must contain every removed asset.
- Existing ledger records must remain byte/semantically preserved as promised. Duplicate/variant IDs need distinct source-path provenance; do not silently deduplicate records by ID alone.
- Existing tag names require a new numeric suffix, never force replacement. Failure after tag or ledger write preserves partial state and reports exact recovery; no deletion occurs before complete reconciliation.
- The “never annotate active” rule wins over the older normalization wording that mentions normalizing survivors. Classification normalizes in memory; surviving files remain unchanged.

Required evidence includes no-argument classify, failed code spot-check kept active, dirty/uncommitted-manifest refusals, reviewed apply with terminal artifact plus entire exploration and review move, exact ledger counts, preserved survivors and lossless recovery via the annotated tag. No real project archive or remote push belongs to migration testing.

## Forge

The existing wrapper launches `npx --yes @jasonrobey/idd-forge` from the consuming project root as a background process, passes supported flags, captures the actual printed URL and reports a usable stop handle. Preserve this behavior using available host process tools; do not hardcode Claude's BashOutput/run_in_background APIs in the portable source.

Treat flags as argv, not interpolated shell source. Validate supported arguments and numeric port while preserving a docs path with spaces. A long-running server is a successful launch, not a timeout waiting for exit. Startup errors and missing background-process capability must remain concrete failures; never invent a URL, handle or successful launch. Do not stop an unrelated server or edit project artifacts to launch a viewer.

Use controlled disposable launcher fixtures to verify argv/cwd/startup/error/cancellation behavior in actual hosts. Any separate real Forge package/browser smoke test must record its actual version and prerequisites; a fake server does not certify the published application.

## Router and native distribution

The Claude-only legacy router still references plugin-root resources and cannot be advertised as a portable Codex entry point. Complete stage coverage and its routing contract before replacing it. Codex packaging must avoid exposing a misleading legacy router alongside standalone skills.

The approved distribution direction remains `npx skills` for standalone skills, native Claude compatibility, and repository-owned native Codex manifest/marketplace metadata. Personal installation/configuration, external marketplace edits, push/tag/release are separate actions. Local manifest validation is not native interactive alias or install/update/remove certification. GitHub shorthand discovery of the final source cannot be claimed from an unpublished local branch.
