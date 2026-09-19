---
description: Chart a phase-0 Exploration map from a loose idea too foggy for /interview — name the destination, sketch the fog, create decision tickets
argument-hint: "<loose idea>"
allowed-tools: "Read Write Glob Grep Bash(mkdir *) Bash(ls *) Agent AskUserQuestion"
---

Read `${CLAUDE_PLUGIN_ROOT}/skills/idd-chart/SKILL.md` and its complete bundled resources. Follow the full chart procedure for `$ARGUMENTS`. Keep selection, one-at-a-time stakeholder questions, claim commits and serialized writes in the main conversation. Optional charter/resolver/research workers are read-only; explicitly pass `model: "sonnet"` when dispatching them through an actual available Claude Agent/Task capability. Truthfully use a sequential local fallback if dispatch is unavailable. Never fabricate answers or worker calls. If allowed capabilities cannot safely parse/write or commit a path-scoped claim, report the limitation rather than bypassing the protocol.
