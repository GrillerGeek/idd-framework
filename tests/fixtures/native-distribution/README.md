# Native distribution fixtures

The helper creates a copied repository-local marketplace, consumer notes and an
unrelated standalone skill. An unrelated native plugin lives in a separate local
marketplace so IDD marketplace removal cannot legitimately remove it.

Only spawned CLI children receive owned CODEX_HOME, CLAUDE_CONFIG_DIR, XDG and Git
configuration paths. Credentials and personal configuration are not copied; the
parent environment and HOME remain unchanged. Each command is bounded to60seconds
and4MiB; the complete host run to ten minutes. All receipts and partial fixtures
are retained. No models or native client changes run in default tests.

Optional `node scripts/evaluate-native-distribution.mjs --host codex|claude`
checks actual inventory, full cached bytes/modes, fixture-only version refresh,
source removal, installed helper behavior and named IDD removal while retaining
the unrelated plugin/skill/consumer. Codex local refresh uses explicit re-add;
its marketplace upgrade command only supports Git sources. Claude details reports
31skills:15legacy commands plus16portable skills, alongside14agents.

CLI inventory is separate from native workflow execution, desktop discovery,
remote publication, upstream acceptance and actual human review.
