---
description: Work exactly one decision ticket on an Exploration map — claim it, resolve it (HITL or AFK by type), record the decision, graduate fog
argument-hint: "[EXPL-id] [ticket-basename]"
allowed-tools: "Read Write Edit Glob Grep Bash(grep *) Agent AskUserQuestion"
---

Open Explorations:
!`grep -l 'status: \(charting\|resolving\)' docs/explorations/EXPL-*/map.md 2>/dev/null | head -10 || echo "No open explorations. Run /idd-framework:chart first."`

Launch the `idd-exploration-resolver` subagent. Pass `$ARGUMENTS` through: the first token (if present) is the Exploration id, the second (if present) the ticket basename. If no Exploration id was given and more than one is open, ask the user which (one AskUserQuestion, max).

**Model directive:** When dispatching this subagent, you MUST explicitly pass `model: "sonnet"` to the Agent/Task tool call. Do NOT skip this parameter.

**After the resolver returns**, read its final lines:

- `new-research-tickets:` — if not `none`, dispatch one `general-purpose` research subagent per basename, all in a SINGLE message (parallel), each with `model: "sonnet"`, using the same research prompt shape as `/idd-framework:chart` (read Question + map context → investigate → write ## Resolution, set status: resolved). This happens at the command layer because subagents cannot reliably dispatch. Parallel agents must not edit the shared map file themselves — that risks lost updates. **After all research dispatches return**, the command layer itself appends one line per resolved ticket to the map's `## Decisions so far`: `- [<ticket title>](tickets/<basename>) — <one-line gist>`.
- `exploration-status:` — if `clear`, tell the user the way is clear and point them at `/idd-framework:interview` or `/idd-framework:quick-spec`, seeding it with the map path and reminding them downstream artifacts carry `exploration: EXPL-<id>`.

**Hard rule, enforced here too:** one non-research ticket per invocation. If the user asks to "keep going", the answer is another `/idd-framework:resolve` in a fresh session.
