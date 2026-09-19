---
description: Multi-perspective Spec review using Agent Teams — reviews architecture, boundaries, and deliverables in parallel
argument-hint: "[spec-id]"
allowed-tools: "Read Write Glob Grep Bash(mkdir *) Bash(ls *)"
---

Load ${CLAUDE_PLUGIN_ROOT}/skills/idd-deep-review/SKILL.md and follow its canonical procedure for $ARGUMENTS. Main-conversation orchestration owns selection, original-context/preservation checks and all output writes. Do not initialize directories during discovery.

When delegating the bounded read-only review to idd-deep-review-lead, explicitly pass model: "opus" and the selected Spec, project root, installed references, captured original context and (technical/deep only) successful sentinel invalidation. The role returns findings; orchestration validates and publishes them. The Opus lead may use Sonnet read-only perspectives with actual parallel dispatch, explicit partial failure handling or a truthful sequential fallback. If delegation is unavailable, announce local reviewer/orchestration phases; do not fabricate a dispatch. Review outcome never supplies human peer review or lifecycle permission.
