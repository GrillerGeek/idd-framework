---
description: Produce Intentions + Expectations + Spec in a single guided session from a Product and feature description
argument-hint: "[product-id] [feature-description]"
allowed-tools: "Read Write Glob Grep Bash(mkdir *) Bash(ls *) AskUserQuestion"
---

Load the installed canonical workflow at `${CLAUDE_PLUGIN_ROOT}/skills/idd-quick-spec/SKILL.md` and pass `$ARGUMENTS` as its selection/context. Keep selection, missing questions, confirmation, validation and saves in the main stakeholder conversation. Do not create directories during startup or while awaiting confirmation.

Optional drafting delegation uses `idd-quick-spec-author` with explicit `model: "sonnet"`. Supply already confirmed facts and the resolved workflow/resource paths; request read-only proposals, never stakeholder interaction or project writes. If delegation or required tools are unavailable, follow the canonical main-conversation procedure with existing capabilities or explain the missing capability; never fabricate a tool call or bypass permissions. Model policy stays in this adapter.
