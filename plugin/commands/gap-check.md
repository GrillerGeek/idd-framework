---
description: Run an adversarial gap-check on one or more Specs before execution — verifies completeness preconditions, simulates the implementing agent, reports Blocker/Warning findings, and performs a coverage/omission sweep
argument-hint: "[spec-id | spec-id spec-id ... | all]"
allowed-tools: "Read Write Glob Grep Bash(mkdir *) Bash(ls *)"
---

Read `${CLAUDE_PLUGIN_ROOT}/skills/idd-gap-check/SKILL.md` and follow it as the
canonical workflow. Pass `$ARGUMENTS` as the user selection/context, together with
relevant decisions from this conversation. Resolve its bundled resources from
that skill directory; artifact paths refer to the consuming project.

Host reviewer policy: when the shared workflow delegates review, dispatch `idd-gap-checker` with explicit `model: "opus"`. Orchestration and annotation writes stay here; the reviewer is report-only.

Do not run initialization or any mutating preamble before the shared procedure
authorizes the particular write. Use available tools and report capability failures.
