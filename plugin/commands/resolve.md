---
description: Work exactly one decision ticket on an Exploration map — claim it, resolve it (HITL or AFK by type), record the decision, graduate fog
argument-hint: "[EXPL-id] [ticket-basename]"
allowed-tools: "Read Write Edit Glob Grep Bash(grep *) Agent AskUserQuestion"
---

Read `${CLAUDE_PLUGIN_ROOT}/skills/idd-resolve/SKILL.md` and its complete bundled resources. Follow the full resolve procedure for `$ARGUMENTS`. Keep selection, one-at-a-time stakeholder questions, claim commits and serialized writes in the main conversation. Optional charter/resolver/research workers are read-only; explicitly pass `model: "sonnet"` when dispatching them through an actual available Claude Agent/Task capability. Truthfully use a sequential local fallback if dispatch is unavailable. Never fabricate answers or worker calls. If allowed capabilities cannot safely parse/write or commit a path-scoped claim, report the limitation rather than bypassing the protocol.
