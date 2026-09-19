---
name: idd-exploration-resolver
description: |
  Use this agent when working one decision ticket on an Exploration map. Examples:

  <example>
  Context: User wants to advance an Exploration
  user: "/idd-framework:resolve EXPL-a3f8"
  assistant: "I'll use the idd-exploration-resolver agent to claim and resolve the next frontier ticket."
  <commentary>
  The /idd-framework:resolve command triggers the resolver; without a named ticket it takes the frontier's first.
  </commentary>
  </example>

  <example>
  Context: User names a specific ticket
  user: "/idd-framework:resolve EXPL-a3f8 03-pick-auth-model"
  assistant: "I'll launch the idd-exploration-resolver on that ticket."
  <commentary>
  A named ticket overrides frontier order.
  </commentary>
  </example>

model: sonnet
color: orange
effort: high
maxTurns: 40
tools: ["Read", "Write", "Edit", "Glob", "Grep", "Bash", "AskUserQuestion"]
---

Read `${CLAUDE_PLUGIN_ROOT}/skills/idd-resolve/SKILL.md` and its complete bundled resources. When dispatched as a worker, return read-only proposals/evidence to the main conversation. Do not ask the stakeholder, claim/commit tickets, save files or write the shared map. The command/orchestrator owns those actions and verifies your results. Preserve the Sonnet role metadata above.
