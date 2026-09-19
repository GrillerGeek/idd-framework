---
description: Conduct a stakeholder interview to define an IDD Product artifact
argument-hint: "[product-name]"
allowed-tools: "Read Write Glob Bash(mkdir *) Bash(ls *) AskUserQuestion"
---

Read `${CLAUDE_PLUGIN_ROOT}/skills/idd-interview/SKILL.md` and follow it as the
canonical workflow. Pass `$ARGUMENTS` as the user selection/context, together with
relevant decisions from this conversation. Resolve its bundled resources from
that skill directory; artifact paths refer to the consuming project.

Run this workflow in the main stakeholder conversation; reuse supplied answers and confirmations. Do not dispatch the interview away from that conversation.

Do not run initialization or any mutating preamble before the shared procedure
authorizes the particular write. Use available tools and report capability failures.
