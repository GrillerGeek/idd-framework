# Router distribution fixtures

`tests/helpers/router-distribution.mjs` creates disposable Products and unrelated
dirty notes for route-only observations. Controller tests copy the existing
`tests/fixtures/installed-execution/` fixture unchanged. No consumer skeleton is
created by installing or routing.

Offline tests cover complete stage closure, deterministic shared-source assembly,
safe entry resolution and the full synthetic controller protocol in both layouts.
Synthetic executor receipts certify protocol behavior, not model capability.

Optional `scripts/evaluate-router.mjs --host claude|codex --scenario outcomes|missing`
installs only a copied router and removes its source. The optional Claude
`controller` case invokes the nested installed CLI from the outer Node process,
preserving the nested-Claude guard. These use configured models and600seconds/4MiB.
Output/preservation checks require separate independent full-trace review.

The `installer` case (optional `--default-mode`, otherwise copy) runs actual pinned
discovery, bulk add, list, project-scoped local update no-op, explicit local add
refresh and selected removal. It retains receipts and preserves an unrelated
skill and consumer file. No personal installs, remote updates or publication.

Pinned installer mode detail: targeting a single host forces copy, even without `--copy`. The four bulk observations compare explicit copy and default requests while recording actual copy mode. Genuine Claude symlinks are tested separately by the individual probe, which targets Codex and Claude together. Refresh retains actual mode; no additional host is silently selected to force a symlink.
