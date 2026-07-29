# Exploration Phase-0 Implementation Plan (IDD-framework)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a phase-0 "Exploration" artifact type to IDD — a wayfinder-style fog-of-war map with decision tickets — plus `/chart` and `/resolve` commands, so efforts too foggy to survive `/interview` have a formal home.

**Architecture:** One directory per foggy effort under `docs/explorations/`, holding an index-only `map.md` and per-decision ticket files. Two new Sonnet agents run the HITL sessions; the *command layer* (not the subagents) dispatches AFK research subagents, because the `Agent` tool is not reliably available inside a subagent's tool context — the same lesson that put Guildhall's orchestrator in `/quest`. Downstream artifacts carry an optional `exploration:` lineage field; cleared/abandoned Explorations archive to the existing ledger.

**Tech Stack:** Markdown-only Claude Code plugin (agents + commands + skill references), one bash script (`bin/idd-next-id`). No build step; verification is `bash -n`, direct script runs, and grep assertions.

**Spec:** `docs/superpowers/specs/2026-07-28-fog-of-war-design.md` in the **guildhall** repo (`D:\Source\repos\guildhall`) — this plan implements Part 1 (IDD). Part 2 (Guildhall) is a separate plan in that repo and ships second.

## Global Constraints

- Repo: `D:\Source\repos\idd-framework`. All plugin files live under `plugin/`.
- The local clone is BEHIND its remote (local plugin.json says 1.4.0; the published plugin is 1.5.2). Task 0 syncs first; every "Modify" step below uses grep anchors, not line numbers, because file contents will have moved.
- Both new agents are **Sonnet**. Every command that dispatches them must include the explicit **Model directive** paragraph (copy the pattern from `plugin/commands/interview.md`) — frontmatter `model:` alone is not trusted at dispatch time.
- Hard rule from the spec, verbatim in both the resolver agent and command: **one non-research ticket per session**.
- The map is an index, not a store: a decision's detail lives only in its ticket file.
- The sharpness test ships verbatim wherever fog vs. ticket is decided: *ticket when you can phrase the question precisely (even if blocked); fog when you can't.*
- No `archived` status for Explorations — terminal artifacts are ledger-distilled and deleted, like every other IDD type.
- Commit style (from `git log`): `feat: ...` / `docs: ...` / `chore: ...`, no scope parens. Version bump to **1.6.0** happens once, in Task 9.

---

### Task 0: Sync the repo and branch

**Files:** none (git only)

**Interfaces:**
- Produces: an up-to-date `main` and a `feat/exploration-phase-0` branch every later task commits to.

- [ ] **Step 1: Fetch and fast-forward main**

```bash
cd /d/Source/repos/idd-framework
git checkout main && git pull --ff-only
```

Expected: pulls commits (local was at `e62cd7f`, v1.4.0; remote has the 1.5.x work). If `git pull` reports "Already up to date" AND `grep '"version"' plugin/.claude-plugin/plugin.json` still shows `1.4.0`, STOP — the remote for the published 1.5.2 plugin is elsewhere; ask the user which remote/branch holds current main.

- [ ] **Step 2: Verify version and create branch**

```bash
grep '"version"' plugin/.claude-plugin/plugin.json
git checkout -b feat/exploration-phase-0
```

Expected: version is `1.5.x`; branch created. The untracked `plugin.zip` at repo root is pre-existing — leave it alone, never `git add` it.

---

### Task 1: Teach `bin/idd-next-id` the exploration type

**Files:**
- Modify: `plugin/bin/idd-next-id`

**Interfaces:**
- Produces: `idd-next-id exploration` → prints `EXPL-<4hex>` (e.g., `EXPL-a3f8`). Collision check is against **directories** matching `docs/explorations/EXPL-<id>-*` (explorations are dirs with a slug suffix, not `.yaml` files).

- [ ] **Step 1: Verify current failure mode**

```bash
cd /d/Source/repos/idd-framework && plugin/bin/idd-next-id exploration; echo "exit=$?"
```

Expected: `Usage: idd-next-id <product|intention|expectation|spec>` and `exit=1`.

- [ ] **Step 2: Add the type and a directory-aware collision check**

In `plugin/bin/idd-next-id`, make two edits.

(a) Add a case arm and update the usage line. The `case` block becomes:

```bash
case "$TYPE" in
  product|products)         PREFIX="PROD"; DIR="docs/products" ;;
  intention|intentions)     PREFIX="INT";  DIR="docs/intentions" ;;
  expectation|expectations) PREFIX="EXP";  DIR="docs/expectations" ;;
  spec|specs)               PREFIX="SPEC"; DIR="docs/specs" ;;
  exploration|explorations) PREFIX="EXPL"; DIR="docs/explorations" ;;
  *)
    echo "Usage: idd-next-id <product|intention|expectation|spec|exploration>" >&2
    exit 1
    ;;
esac
```

(b) The existing collision loop tests `[ ! -e "$DIR/${PREFIX}-${ID}.yaml" ]`, which never matches an exploration directory (`EXPL-<id>-<slug>/`). Replace that single test line with a type-aware check:

```bash
    if [ "$PREFIX" = "EXPL" ]; then
      # Explorations are directories named EXPL-<id>-<slug>/
      if ! compgen -G "$DIR/${PREFIX}-${ID}-*" > /dev/null; then
        printf "%s-%s\n" "$PREFIX" "$ID"
        exit 0
      fi
    elif [ ! -e "$DIR/${PREFIX}-${ID}.yaml" ]; then
      printf "%s-%s\n" "$PREFIX" "$ID"
      exit 0
    fi
```

- [ ] **Step 3: Verify syntax and behavior, including the collision path**

```bash
bash -n plugin/bin/idd-next-id && echo SYNTAX-OK
plugin/bin/idd-next-id exploration
plugin/bin/idd-next-id spec
# collision test in a sandbox:
TMP=$(mktemp -d) && cd "$TMP" && mkdir -p docs/explorations/EXPL-beef-taken
for i in $(seq 1 50); do ID=$(/d/Source/repos/idd-framework/plugin/bin/idd-next-id exploration); [ "$ID" = "EXPL-beef" ] && echo "COLLISION BUG" && break; done; echo done
cd /d/Source/repos/idd-framework && rm -rf "$TMP"
```

Expected: `SYNTAX-OK`; an `EXPL-<4hex>` id; a `SPEC-<4hex>` id (regression); `done` with no `COLLISION BUG` line (a random 4-hex id equal to `beef` is ~50/65536 likely across the loop — if it prints once, re-run; repeated hits mean the compgen guard is wrong).

- [ ] **Step 4: Commit**

```bash
git add plugin/bin/idd-next-id
git commit -m "feat: idd-next-id learns the exploration type (EXPL prefix, directory-aware collision check)"
```

---

### Task 2: Exploration reference doc (templates + rules)

**Files:**
- Create: `plugin/skills/idd-orchestration/references/exploration-template.md`

**Interfaces:**
- Produces: the canonical map/ticket templates and rule text that Tasks 3–6 quote. Agents refer to it as `references/exploration-template.md`.

- [ ] **Step 1: Write the reference file**

Create `plugin/skills/idd-orchestration/references/exploration-template.md` with exactly this content:

````markdown
# Exploration Template

The Exploration is IDD's **phase-0** artifact — for efforts too foggy to survive `/idd-framework:interview`. It is a wayfinder-style map of **decision tickets**: questions whose resolution is a decision, not slices of a build. The effort is done when the way is clear — `status: clear` — and the map seeds `/interview` or `/quick-spec`.

## Layout

One directory per effort (explorations are directories, not single YAML files — the one deliberate deviation from the other artifact types):

```
docs/explorations/EXPL-<id>-<slug>/
  map.md
  tickets/
    01-<slug>.md
    02-<slug>.md
```

**The map is an index, not a store.** A decision lives in exactly one place — its ticket file. The map gists and links, never restates.

## map.md template

```markdown
---
id: EXPL-<id>                 # from bin/idd-next-id exploration
title: <short name>
status: charting               # charting | resolving | clear | abandoned
created: <ISO8601>
updated: <ISO8601>
---

## Destination

<what reaching the end of this map looks like — the spec, decision, or change
this effort is finding its way to. One or two lines; every session orients to
it before choosing a ticket. Naming it is the first act of charting and fixes
the scope.>

## Notes

<domain; skills every session should consult; standing preferences>

## Decisions so far

<!-- index only — one line per resolved ticket: gist + relative link.
     The detail lives in the ticket file, never here. -->

- [<ticket title>](tickets/NN-<slug>.md) — <one-line gist of the answer>

## Not yet specified

<!-- the fog: in-scope questions not yet sharp enough to ticket.
     Sharpness test: ticket when you can phrase the question precisely
     (even if blocked); fog when you can't. Don't pre-slice fog into
     ticket-sized pieces — one patch may graduate into several tickets,
     or none, once the frontier reaches it. -->

## Out of scope

<!-- work consciously ruled beyond the destination: gist + why + link to any
     closed ticket. Never graduates — returns only if the destination is
     redrawn, and then as a fresh effort. -->
```

## Ticket template (`tickets/NN-<slug>.md`)

```markdown
---
type: grilling                 # research | prototype | grilling | task
status: open                   # open | claimed | resolved | out_of_scope
claimed_by:                    # a git-committed name IS the claim; empty = unclaimed
blocked_by: []                 # ticket file basenames, e.g. ["01-pick-datastore.md"]
---

## Question

<the decision or investigation this ticket resolves — sized to one agent session>

## Resolution

<!-- filled at close; the ONLY place the full answer lives -->

## Assets

<!-- links to artifacts created while resolving — never pasted in -->
```

## Ticket types

Every ticket is **HITL** (human in the loop — the agent never stands in for the human's side) or **AFK** (agent-driven):

- **research** (AFK) — surface a fact a decision waits on. Resolved by a research subagent dispatched from the command layer.
- **prototype** (HITL) — raise discussion fidelity with a cheap concrete artifact to react to. May hand to Guildhall's `prototype-builder` when installed.
- **grilling** (HITL, the default) — conversation, one question at a time.
- **task** (HITL or AFK) — manual work that must happen before a decision *can* be made (provision access, move data). The one type that does rather than decides; it earns its place by unblocking a decision.

## Frontier and claims

The **frontier** = tickets with `status: open`, empty `claimed_by`, and every `blocked_by` entry resolved. It is mechanically computable from ticket frontmatter.

To **claim**: set `status: claimed` AND `claimed_by: <name>`, and commit, *before any work*. A race produces a merge conflict — that IS the conflict-detection mechanism (acceptable for a repo-reading dev audience).

## Hard rules

- **One non-research ticket per session.** Research tickets may fan out in parallel.
- Load only `map.md` at session start; zoom into ticket bodies on demand.
- Graduated fog is REMOVED from `## Not yet specified` — it lives only as its new ticket.
- A mis-scoped ticket is closed as `out_of_scope` with a one-line map entry; it does NOT appear in `## Decisions so far` (that section records the route actually walked).

## Lineage

When an Exploration reaches `clear` and seeds downstream work, the Product (and every Intention/Spec descended from it) carries `exploration: EXPL-<id>` in its frontmatter. Guildhall's `fog-cartographer` keys on this field to write quest-discovered unknowns back into the map.

## Terminal states and archival

`clear` (frontier empty + fog empty) and `abandoned` are terminal. The archivist distills the map and each ticket's Resolution into `docs/idd-ledger.yaml` and deletes the whole directory (full text recoverable via the archive git tag). There is no `archived` status.
````

- [ ] **Step 2: Verify structure**

```bash
grep -c '^## ' plugin/skills/idd-orchestration/references/exploration-template.md
grep -n 'One non-research ticket per session' plugin/skills/idd-orchestration/references/exploration-template.md
```

Expected: `8` section headings; the hard rule found once.

- [ ] **Step 3: Commit**

```bash
git add plugin/skills/idd-orchestration/references/exploration-template.md
git commit -m "docs: exploration-template reference — phase-0 map/ticket format, frontier, claims, lineage"
```

---

### Task 3: `exploration-charter` agent

**Files:**
- Create: `plugin/agents/exploration-charter.md`

**Interfaces:**
- Consumes: `references/exploration-template.md` (Task 2); `plugin/bin/idd-next-id exploration` (Task 1).
- Produces: agent name `idd-exploration-charter`, model **sonnet** — Task 4's command dispatches it. Returns to the parent a final line `research-tickets: <comma-separated ticket basenames or "none">` so the command layer knows what to fan out.

- [ ] **Step 1: Write the agent file**

Create `plugin/agents/exploration-charter.md` with exactly this content:

````markdown
---
name: idd-exploration-charter
description: |
  Use this agent when charting a phase-0 Exploration map from a loose idea too foggy for a product interview. Examples:

  <example>
  Context: User has a loose idea, no clear destination
  user: "/idd-framework:chart migrate our reporting stack somewhere cheaper"
  assistant: "I'll use the idd-exploration-charter agent to name the destination and chart the fog."
  <commentary>
  The /idd-framework:chart command triggers the exploration charter.
  </commentary>
  </example>

  <example>
  Context: User can't answer interview questions yet
  user: "I want to define a product but honestly we don't know what we're building yet"
  assistant: "That's pre-interview fog — I'll launch the idd-exploration-charter to chart an Exploration map first."
  <commentary>
  An effort that can't survive /interview triggers charting instead.
  </commentary>
  </example>

model: sonnet
color: green
effort: high
maxTurns: 40
tools: ["Read", "Write", "Glob", "Bash", "AskUserQuestion"]
---

You are the IDD Exploration Charter. A loose idea has arrived — too big for one session and wrapped in fog: the way to the destination isn't visible yet. Your job is to chart it as an Exploration map, NOT to charge at the destination. Read `references/exploration-template.md` in this plugin's idd-orchestration skill for the canonical formats before writing anything.

**Your session, in order:**

1. **Name the destination.** One question at a time (AskUserQuestion; open-ended is fine), pin down what this map is finding its way to — a spec to hand off, a decision to lock, a change made in place. The destination fixes the scope, so it is settled first. Do not proceed until you can state it in one or two lines.
2. **Map the frontier — breadth-first.** Fan out across the whole space rather than deep on any one thread: surface the open decisions and the first steps takeable now. One question per message.
3. **The escape hatch.** If the sweep surfaces no fog — the way is already clear, the journey small enough for one session — you do NOT need a map. Say so plainly, recommend `/idd-framework:interview` (or `/idd-framework:quick-spec` if the destination is a spec), and STOP. The absence of fog is a successful charting outcome, not a failure.
4. **Create the map.** Run `bin/idd-next-id exploration` (via Bash; the script lives in this plugin's `bin/`) for the id. Create `docs/explorations/EXPL-<id>-<slug>/map.md` per the template: Destination and Notes filled, `status: charting`, Decisions-so-far empty, the fog written into `## Not yet specified` as loosely or fully as the view allows.
5. **Create the tickets you can specify now** under `tickets/`, numbered `01-`, `02-`, … — apply the sharpness test from the template: ticket when the question can be phrased precisely (even if blocked); fog when it can't. Then wire `blocked_by` in a SECOND pass (tickets need filenames before they can reference each other). Set `status: resolving` on the map once tickets exist.
6. **Stop.** Charting is one session's work; you hand-resolve nothing. Report the map path, the frontier (open, unblocked, unclaimed tickets), and end your reply with the machine-readable line:

```
research-tickets: <comma-separated ticket basenames with type: research, or "none">
```

The command layer — not you — dispatches research subagents. You do not have a working `Agent` tool; do not attempt dispatch.

**Hard rules:**

- Plan, don't do. Every ticket resolves a decision; none delivers the destination.
- One question per message during HITL steps. Never answer your own questions — you are not the stakeholder.
- The map is an index. Never restate a ticket's content in the map.
- Don't pre-slice fog into ticket-sized pieces.
````

- [ ] **Step 2: Verify frontmatter parses and key content is present**

```bash
awk '/^---$/{n++} n==1' plugin/agents/exploration-charter.md | grep -E '^(name|model):'
grep -c 'research-tickets:' plugin/agents/exploration-charter.md
```

Expected: `name: idd-exploration-charter` and `model: sonnet`; count `2` (contract description + the literal output line).

- [ ] **Step 3: Commit**

```bash
git add plugin/agents/exploration-charter.md
git commit -m "feat: exploration-charter agent — phase-0 charting session with no-fog escape hatch"
```

---

### Task 4: `/chart` command

**Files:**
- Create: `plugin/commands/chart.md`

**Interfaces:**
- Consumes: `idd-exploration-charter` (Task 3).
- Produces: `/idd-framework:chart` command; command-layer research fan-out contract used identically by Task 6.

- [ ] **Step 1: Write the command file**

Create `plugin/commands/chart.md` with exactly this content:

````markdown
---
description: Chart a phase-0 Exploration map from a loose idea too foggy for /interview — name the destination, sketch the fog, create decision tickets
argument-hint: "<loose idea>"
allowed-tools: "Read Write Glob Grep Bash(mkdir *) Bash(ls *) Bash(*/idd-next-id *) Agent AskUserQuestion"
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
4. Append one line to the map's ## Decisions so far: - [<ticket title>](tickets/<basename>) — <one-line gist>.
Do NOT touch any other ticket, and do NOT resolve anything beyond this one question.
```

This dispatch happens HERE, at the command layer, because the `Agent` tool is not reliably available inside a subagent's tool context — the charter cannot fan out on its own.

When the research dispatches return, report: map path, decisions landed, and the remaining frontier.
````

- [ ] **Step 2: Verify**

```bash
grep -n 'model: "sonnet"' plugin/commands/chart.md | head -2
grep -c 'command layer' plugin/commands/chart.md
```

Expected: two `model: "sonnet"` mentions (charter directive + research subagents); `command layer` found once.

- [ ] **Step 3: Commit**

```bash
git add plugin/commands/chart.md
git commit -m "feat: /chart command — dispatch charter, fan out research tickets from the command layer"
```

---

### Task 5: `exploration-resolver` agent

**Files:**
- Create: `plugin/agents/exploration-resolver.md`

**Interfaces:**
- Consumes: `references/exploration-template.md` (Task 2).
- Produces: agent name `idd-exploration-resolver`, model **sonnet** — Task 6's command dispatches it. Returns a final line `new-research-tickets: <basenames or "none">` (freshly graduated research tickets for the command layer to fan out) and, when terminal, the line `exploration-status: clear`.

- [ ] **Step 1: Write the agent file**

Create `plugin/agents/exploration-resolver.md` with exactly this content:

````markdown
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

You are the IDD Exploration Resolver. You advance an Exploration map by exactly one decision. Read `references/exploration-template.md` in this plugin's idd-orchestration skill for the canonical formats.

**Your session, in order:**

1. **Load only `map.md`** — the low-resolution view. Orient to `## Destination` before anything else. Zoom into ticket bodies on demand, never all at once.
2. **Choose the ticket.** If the dispatch named one, use it. Otherwise compute the frontier (`status: open`, empty `claimed_by`, all `blocked_by` resolved) and take its first ticket by filename order. If the frontier is empty but fog remains, say so and stop — the human decides what sharpens next.
3. **Claim it FIRST**: set `status: claimed` and `claimed_by: <the user's name, or "agent-session">` in the ticket frontmatter and commit (`git add <ticket> && git commit -m "chore(EXPL-<id>): claim <basename>"`) before any work. Concurrent sessions skip claimed tickets.
4. **Resolve by type:**
   - **grilling** (default): HITL — one question at a time via AskUserQuestion. You never answer your own questions.
   - **prototype**: HITL — build the cheapest concrete artifact the discussion can react to (an outline, a stub, rough code); link it under `## Assets`. If the Guildhall plugin is installed, you may recommend the user run its prototype-builder instead for code prototypes.
   - **task**: do the work if you can (AFK); otherwise hand the human a precise checklist and wait. The Resolution records what was done and any resulting facts later tickets depend on.
   - **research**: you should rarely see one — the command layer fans these out. If dispatched on one anyway, investigate and resolve it directly.
5. **Record the resolution:** write the answer into the ticket's `## Resolution`, set `status: resolved`, and append the one-line gist + link to the map's `## Decisions so far`. The detail lives ONLY in the ticket.
6. **Advance the map:**
   - **Graduate fog** the answer sharpened: create new tickets (next `NN-` numbers, then wire `blocked_by` in a second pass) and REMOVE the graduated text from `## Not yet specified`.
   - **Rule out of scope** any ticket the answer exposed as past the destination: set its `status: out_of_scope` and add a one-line entry (gist + why + link) to the map's `## Out of scope`. It does NOT go in Decisions so far.
   - Update or delete tickets the decision invalidated. Touch `updated:` in the map frontmatter.
7. **Check for terminal state:** if the frontier is empty AND `## Not yet specified` is empty, set `status: clear` and tell the user the way is clear — next step is `/idd-framework:interview` or `/idd-framework:quick-spec` seeded with this map path, and downstream artifacts should carry `exploration: EXPL-<id>`.
8. **Report**, ending with the machine-readable lines:

```
new-research-tickets: <comma-separated basenames of research tickets created in step 6, or "none">
exploration-status: <charting | resolving | clear | abandoned>
```

**Hard rules:**

- **One non-research ticket per session.** After step 7, you are done — do not take a second ticket, however tempting the frontier looks. The pull to keep going is the signal to stop.
- Claim before work. Always.
- Never resolve a HITL ticket without the human — an agent that answers its own grilling questions has broken the artifact.
- The map never restates a resolution.
````

- [ ] **Step 2: Verify**

```bash
awk '/^---$/{n++} n==1' plugin/agents/exploration-resolver.md | grep -E '^(name|model):'
grep -c 'One non-research ticket per session' plugin/agents/exploration-resolver.md
```

Expected: `name: idd-exploration-resolver`, `model: sonnet`; count `1`.

- [ ] **Step 3: Commit**

```bash
git add plugin/agents/exploration-resolver.md
git commit -m "feat: exploration-resolver agent — claim-first, one decision per session, fog graduation"
```

---

### Task 6: `/resolve` command

**Files:**
- Create: `plugin/commands/resolve.md`

**Interfaces:**
- Consumes: `idd-exploration-resolver` (Task 5); the research fan-out contract from Task 4.
- Produces: `/idd-framework:resolve [EXPL-id] [ticket]` command.

- [ ] **Step 1: Write the command file**

Create `plugin/commands/resolve.md` with exactly this content:

````markdown
---
description: Work exactly one decision ticket on an Exploration map — claim it, resolve it (HITL or AFK by type), record the decision, graduate fog
argument-hint: "[EXPL-id] [ticket-basename]"
allowed-tools: "Read Write Edit Glob Grep Bash Agent AskUserQuestion"
---

Open Explorations:
!`grep -l 'status: \(charting\|resolving\)' docs/explorations/EXPL-*/map.md 2>/dev/null | head -10 || echo "No open explorations. Run /idd-framework:chart first."`

Launch the `idd-exploration-resolver` subagent. Pass `$ARGUMENTS` through: the first token (if present) is the Exploration id, the second (if present) the ticket basename. If no Exploration id was given and more than one is open, ask the user which (one AskUserQuestion, max).

**Model directive:** When dispatching this subagent, you MUST explicitly pass `model: "sonnet"` to the Agent/Task tool call. Do NOT skip this parameter.

**After the resolver returns**, read its final lines:

- `new-research-tickets:` — if not `none`, dispatch one `general-purpose` research subagent per basename, all in a SINGLE message (parallel), each with `model: "sonnet"`, using the same research prompt shape as `/idd-framework:chart` (read Question + map context → investigate → write ## Resolution, set status: resolved → append the map index line). This happens at the command layer because subagents cannot reliably dispatch.
- `exploration-status:` — if `clear`, tell the user the way is clear and point them at `/idd-framework:interview` or `/idd-framework:quick-spec`, seeding it with the map path and reminding them downstream artifacts carry `exploration: EXPL-<id>`.

**Hard rule, enforced here too:** one non-research ticket per invocation. If the user asks to "keep going", the answer is another `/idd-framework:resolve` in a fresh session.
````

- [ ] **Step 2: Verify**

```bash
grep -c 'model: "sonnet"' plugin/commands/resolve.md
grep -n 'one non-research ticket' plugin/commands/resolve.md
```

Expected: count `2`; the hard rule found once (case-insensitive variant appears in the closing paragraph).

- [ ] **Step 3: Commit**

```bash
git add plugin/commands/resolve.md
git commit -m "feat: /resolve command — one decision per session, command-layer research fan-out, clear-state handoff"
```

---

### Task 7: Thread the `exploration:` lineage field

**Files:**
- Modify: `plugin/skills/idd-orchestration/references/product-template.md`
- Modify: `plugin/skills/idd-orchestration/references/intention-template.md`
- Modify: `plugin/skills/idd-orchestration/references/spec-reference.md`
- Modify: `plugin/agents/product-interviewer.md`
- Modify: `plugin/agents/intention-author.md`
- Modify: `plugin/agents/spec-author.md`
- Modify: `plugin/agents/quick-spec-author.md`

**Interfaces:**
- Produces: an optional `exploration: EXPL-<id>` frontmatter field on Product, Intention, and Spec artifacts, inherited parent → child at creation. Guildhall's `fog-cartographer` (separate plan) reads this field on Specs.

The local files will have drifted since this plan was written, so every edit below is anchored by grep, not line number.

- [ ] **Step 1: Add the field to each template's frontmatter docs**

For each of the three reference files, locate the frontmatter/field table (e.g. `grep -n 'status' plugin/skills/idd-orchestration/references/product-template.md`) and add one field row/line alongside the other optional fields, using this exact wording (adjust only the inheritance clause per level):

- product-template.md: `exploration: ""              # optional — EXPL-<id> of the phase-0 Exploration this Product was seeded from (see references/exploration-template.md)`
- intention-template.md: `exploration: ""              # optional — inherited from the parent Product's exploration field at creation`
- spec-reference.md (in the Template section's frontmatter/metadata block): `exploration: ""              # optional — inherited from the parent Intention/Product; Guildhall's fog-cartographer keys on this`

If a file documents fields in a `| Field | Required | ... |` table, also add: `| exploration | No | EXPL id of the originating phase-0 Exploration; inherited at creation |`

- [ ] **Step 2: Teach the four authors to carry it**

In each agent file, find the section that describes writing the artifact's YAML (grep for `docs/products/`, `docs/intentions/`, `docs/specs/` respectively) and add this sentence to the artifact-writing instructions:

> If the seeding context names an Exploration (an `EXPL-<id>`, a map path under `docs/explorations/`, or a parent artifact whose frontmatter has `exploration:`), set `exploration: EXPL-<id>` in the new artifact's frontmatter. Omit the field entirely when there is no such lineage — never write it empty.

- [ ] **Step 3: Verify all seven files mention the field**

```bash
grep -l 'exploration:' plugin/skills/idd-orchestration/references/product-template.md plugin/skills/idd-orchestration/references/intention-template.md plugin/skills/idd-orchestration/references/spec-reference.md plugin/agents/product-interviewer.md plugin/agents/intention-author.md plugin/agents/spec-author.md plugin/agents/quick-spec-author.md | wc -l
```

Expected: `7`.

- [ ] **Step 4: Commit**

```bash
git add plugin/skills/idd-orchestration/references plugin/agents
git commit -m "feat: optional exploration lineage field on Product/Intention/Spec, carried at creation"
```

---

### Task 8: Archivist support for Explorations

**Files:**
- Modify: `plugin/skills/idd-orchestration/references/ledger-reference.md`
- Modify: `plugin/agents/idd-archivist.md`

**Interfaces:**
- Consumes: terminal statuses `clear` / `abandoned` (Tasks 2, 5).
- Produces: EXPL rows in the classification table; archivist scans `docs/explorations/EXPL-*/map.md` and deletes whole directories.

- [ ] **Step 1: Extend the classification table**

In `ledger-reference.md`, find the classification table (`grep -n 'Canonical status | Type | Disposition' plugin/skills/idd-orchestration/references/ledger-reference.md`) and add two rows:

```markdown
| clear | EXPL | archive: completed — distill the map's Destination, each resolved ticket's gist, and the Out of scope list into the record's evidence |
| abandoned | EXPL | archive: abandoned |
```

Below the table, add this paragraph:

> **Explorations are directories.** The unit of archival is the whole `docs/explorations/EXPL-<id>-<slug>/` directory: one ledger record per Exploration (never per ticket), and deletion removes the directory recursively. `charting` and `resolving` Explorations are live work — always `keep`. An Exploration whose id is still referenced by a live artifact's `exploration:` field gets a dangling-reference warning in the manifest, same as the Intention cluster rule.

- [ ] **Step 2: Extend the archivist's scan**

In `plugin/agents/idd-archivist.md`, find the classify-mode artifact discovery instructions (`grep -n 'docs/specs\|glob\|scan' plugin/agents/idd-archivist.md | head`) and add `docs/explorations/EXPL-*/map.md` to the scanned set, with type `EXPL` read from the map frontmatter and the terminal-status rules above. In the apply-mode instructions, state that an approved EXPL row deletes the whole directory (`git rm -r docs/explorations/EXPL-<id>-<slug>/`).

- [ ] **Step 3: Verify**

```bash
grep -n 'EXPL' plugin/skills/idd-orchestration/references/ledger-reference.md | head -5
grep -n 'explorations' plugin/agents/idd-archivist.md | head -5
```

Expected: both files mention EXPL/explorations at least once.

- [ ] **Step 4: Commit**

```bash
git add plugin/skills/idd-orchestration/references/ledger-reference.md plugin/agents/idd-archivist.md
git commit -m "feat: archivist classifies and distills terminal Explorations (directory-unit archival)"
```

---

### Task 9: Orchestration skill, README, version bump

**Files:**
- Modify: `plugin/skills/idd-orchestration/SKILL.md`
- Modify: `plugin/README.md` and repo-root `README.md`
- Modify: `plugin/.claude-plugin/plugin.json`

**Interfaces:**
- Consumes: everything above.
- Produces: v1.6.0.

- [ ] **Step 1: SKILL.md — phase-0 row, entry point, agent rows, description**

Four edits to `plugin/skills/idd-orchestration/SKILL.md`:

(a) In the **Workflow Phases** table, add a first row (and renumber is NOT needed — use phase `0`):

```markdown
| 0. Chart (optional) | `/idd-framework:chart` | exploration-charter | Exploration map + decision tickets | `docs/explorations/` |
```

(b) In **Entry Points**, add as the FIRST bullet: `- **Too foggy to interview?** Start with `/idd-framework:chart` — chart the fog, then `/idd-framework:resolve` one decision per session until the way is clear`

(c) In the **Agents** table, add:

```markdown
| `idd-exploration-charter` | green | **sonnet** | Charts phase-0 Exploration maps from loose ideas |
| `idd-exploration-resolver` | orange | **sonnet** | Resolves one Exploration decision ticket per session |
```

(d) In the frontmatter `description:`, extend the trigger list: after `"start IDD"`, insert `"chart an exploration", "too foggy to interview", `.

(e) Add a short section after **Workflow Phases** titled `## Phase 0 — Explorations` with:

> Efforts too foggy for `/interview` start as an **Exploration** (`docs/explorations/EXPL-<id>-<slug>/`): a map of decision tickets worked one per session via `/resolve` until `status: clear`, then seeded into `/interview` or `/quick-spec`. Downstream artifacts carry the `exploration:` lineage field. Format and rules: `references/exploration-template.md`.

- [ ] **Step 2: READMEs**

In `plugin/README.md` and repo-root `README.md`, locate the workflow/features overview (`grep -n 'interview' README.md plugin/README.md | head`) and add one line introducing phase 0 (same sentence as the SKILL.md Phase 0 section, condensed): `**Phase 0 — /chart + /resolve:** efforts too foggy to interview get an Exploration map of decision tickets, resolved one per session until the way is clear.`

- [ ] **Step 3: Version bump**

In `plugin/.claude-plugin/plugin.json`, set `"version"` to `"1.6.0"` (from whatever 1.5.x Task 0 found).

- [ ] **Step 4: Verify and commit**

```bash
python -c "import json; json.load(open('plugin/.claude-plugin/plugin.json'))" && echo JSON-OK
grep -n 'chart' plugin/skills/idd-orchestration/SKILL.md | head -5
git add plugin/skills/idd-orchestration/SKILL.md plugin/README.md README.md plugin/.claude-plugin/plugin.json
git commit -m "feat: IDD v1.6 — phase-0 Explorations: fog-of-war charting and one-decision-per-session resolution"
```

Expected: `JSON-OK`; chart mentioned in SKILL.md.

---

### Task 10: Dogfood gate (manual, fresh sessions)

**Files:** none in this repo (exercise runs in `D:\Source\repos\testidd` or `demoidd`)

**Interfaces:**
- Consumes: the full v1.6.0 plugin, installed via `claude --plugin-dir D:\Source\repos\idd-framework\plugin`.

This task cannot be automated — each step is a fresh Claude Code session (command content snapshots at session start).

- [ ] **Step 1:** Fresh session in testidd: `/idd-framework:chart` a genuinely foggy effort. Verify: map + tickets created, blocking wired, research tickets fanned out from the command layer, charter stopped without resolving anything.
- [ ] **Step 2:** Fresh session: `/idd-framework:chart` a deliberately SHARP effort. Verify the escape hatch fires: no map created, routed to `/interview`.
- [ ] **Step 3:** Two fresh sessions: `/idd-framework:resolve` twice. Verify claim-commit lands before work, exactly one non-research ticket resolved per session, fog graduates and is removed from Not-yet-specified, out-of-scope handling works.
- [ ] **Step 4:** Drive to `clear`; run `/idd-framework:quick-spec` seeded with the map. Verify the resulting Spec frontmatter carries `exploration: EXPL-<id>`.
- [ ] **Step 5:** Run `/idd-framework:archive` (classify, then apply). Verify one EXPL ledger record, directory deleted, git tag recoverable.
- [ ] **Step 6:** Record any prompt fixes needed, apply them, and merge `feat/exploration-phase-0` via PR (`gh pr create`).
