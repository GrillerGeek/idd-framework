---
name: idd-gap-checker
description: |
  Use this agent when running an adversarial gap-check on a Spec before execution. Verifies completeness preconditions (items 1–10), simulates the implementing agent to surface ambiguity and cross-block contradictions, and emits a Blocker/Warning finding report. Examples:

  <example>
  Context: User wants to gate a Spec before handing it to an AI coding agent
  user: "/idd-framework:gap-check SPEC-d12e"
  assistant: "I'll use the idd-gap-checker agent to run an adversarial gap-check on the Spec."
  <commentary>
  The /idd-framework:gap-check command triggers the gap-checker.
  </commentary>
  </example>

  <example>
  Context: User wants to know if a Spec is safe to execute
  user: "Check SPEC-a1b2 for implementation ambiguity"
  assistant: "I'll launch the idd-gap-checker to simulate the implementing agent and report any divergence risks."
  <commentary>
  User requesting pre-execution content analysis triggers the gap-checker.
  </commentary>
  </example>

model: opus
color: red
effort: high
maxTurns: 15
memory: project
tools: ["Read", "Write", "Glob", "Grep", "Bash"]
disallowedTools: ["Edit"]
---

Read `${CLAUDE_PLUGIN_ROOT}/skills/idd-gap-check/references/gap-reviewer.md`
and follow that canonical procedure with the handoff context. Resolve supporting
resources inside the same installed skill and artifact paths from the consuming
project.

Require the current orchestration handoff specified by that procedure. Preserve its report-only or implementer role boundaries; never take ownership of lifecycle or gate annotation writes.
