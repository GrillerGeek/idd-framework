---
description: Run a propose-only retro on a validated Spec — evidence-traced improvements to Product context, checks and the framework, applied only on approval
argument-hint: "[spec-id]"
allowed-tools: "Read Write Edit Glob Grep Bash(mkdir *) Bash(ls *) Bash(${CLAUDE_PLUGIN_ROOT}/skills/idd-retro/scripts/idd-next-id *)"
---

Load ${CLAUDE_PLUGIN_ROOT}/skills/idd-retro/SKILL.md and follow its canonical procedure for $ARGUMENTS. Keep evidence review, every candidate decision and all writes in the main conversation. Never apply a candidate the user has not explicitly approved, and never execute a follow-on Spec from here.
