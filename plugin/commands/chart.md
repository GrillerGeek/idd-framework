---
description: Chart a phase-0 Exploration map from a loose idea too foggy for /interview — name the destination, sketch the fog, create decision tickets
argument-hint: "<loose idea>"
allowed-tools: "Read Write Glob Grep Bash(mkdir *) Bash(ls *) Agent AskUserQuestion"
---

!`mkdir -p docs/explorations`

Existing Explorations:
!`ls -d docs/explorations/EXPL-* 2>/dev/null | head -20 || echo "No explorations yet. This will be the first."`

Launch the `idd-exploration-charter` subagent to chart the Exploration. Pass `$ARGUMENTS` as the loose idea.

**Model directive:** When dispatching this subagent, you MUST explicitly pass `model: "sonnet"` to the Agent/Task tool call. Naming the destination is the highest-leverage act of the effort — do not let it inherit a cheaper or dearer session model. Do NOT skip this parameter.

**After the charter returns**, read its final `research-tickets:` line.

- If it is `none` (or the charter took the no-fog escape hatch), report and stop.
- Otherwise, for EACH listed ticket, dispatch one `general-purpose` research subagent — all in a SINGLE message so they run in parallel, each with `model: "sonnet"` — with this prompt shape:

```
Resolve the research ticket at docs/explorations/<EXPL-dir>/tickets/<basename>.
1. Read the ticket's ## Question and the map's ## Destination and ## Notes (docs/explorations/<EXPL-dir>/map.md) for context.
2. Investigate using Read/Glob/Grep/WebFetch/WebSearch as the question demands. Facts, not opinions.
3. Write your findings into the ticket's ## Resolution section, set frontmatter status: resolved, and link any created assets under ## Assets.
Do NOT touch any other ticket, and do NOT resolve anything beyond this one question.
```

This dispatch happens HERE, at the command layer, because the `Agent` tool is not reliably available inside a subagent's tool context — the charter cannot fan out on its own. Parallel agents must not edit the shared map file themselves — that risks lost updates.

**After all research dispatches return**, the command layer itself appends one line per resolved ticket to the map's `## Decisions so far`: `- [<ticket title>](tickets/<basename>) — <one-line gist>`.

When the research dispatches return, report: map path, decisions landed, and the remaining frontier.
