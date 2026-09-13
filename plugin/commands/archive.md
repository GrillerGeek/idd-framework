---
description: Consolidate terminal IDD artifacts into the roll-up ledger — classify mode produces a reviewable archive manifest; apply mode tags, distills to docs/idd-ledger.yaml, and deletes the archived files
argument-hint: "[--apply manifest-path]"
allowed-tools: "Read Write Glob Grep Bash(ls *) Bash(mkdir *) Bash(git status *) Bash(git rm *) Bash(git tag *) Bash(git add *) Bash(git commit *) Bash(git mv *) Bash(${CLAUDE_PLUGIN_ROOT}/bin/idd-archive-scan *)"
---

Read `${CLAUDE_PLUGIN_ROOT}/skills/idd-archive/SKILL.md` and all bundled resources. Follow the complete procedure for `$ARGUMENTS`. Keep manifest review, all writes, tag/ledger reconciliation, deletion and commits in the main conversation. Optional read-only archivist/verifier workers must receive explicit `model: "sonnet"` through an actually available Agent/Task capability; otherwise use truthful sequential review. Never let a worker mutate the ledger or delete. Missing safe parsing/Git/write capabilities require a clear limitation. Default classify stops at a reviewable manifest; only explicit concrete apply approval proceeds.
