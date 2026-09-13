---
description: Implement a Spec end-to-end — reads SPEC-ID.yaml, acknowledges Boundaries, writes deliverables, self-verifies, and emits an execution report to docs/reviews/
argument-hint: "[spec-id]"
allowed-tools: "Read Write Glob Grep Bash(mkdir *) Bash(ls *) Bash(git status *)"
---

Read `${CLAUDE_PLUGIN_ROOT}/skills/idd-implement-spec/SKILL.md` and follow it as the
canonical workflow. Pass `$ARGUMENTS` as the user selection/context, together with
relevant decisions from this conversation. Resolve its bundled resources from
that skill directory; artifact paths refer to the consuming project.

Host implementer policy: after the shared workflow verifies the gate, acknowledges Boundaries and performs its transition, dispatch `idd-spec-implementer` with explicit `model: "sonnet"`. Orchestration and lifecycle writes stay here.

Do not run initialization or any mutating preamble before the shared procedure
authorizes the particular write. Use available tools and report capability failures.

## Optional guarded terminal route

An independently installed `idd-implement-spec` bundle includes `scripts/idd-execute-spec.mjs` and `references/guarded-execution.md`. The user can run it from a separate terminal with Node >=22.20.0 and a reviewed execution_contract. Do not spawn it inside this Claude session or clear CLAUDECODE. This native alias keeps its existing dispatch/model policy; terminal-controller evidence does not certify native alias execution.
