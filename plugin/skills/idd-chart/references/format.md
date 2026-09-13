# Exploration Template

The Exploration is IDD's **phase-0** artifact — for efforts too foggy to survive `idd-interview`. It is a wayfinder-style map of **decision tickets**: questions whose resolution is a decision, not slices of a build. The effort is done when the way is clear — `status: clear` — and the map seeds `idd-interview` or `idd-quick-spec`.

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
id: EXPL-<id>                 # from scripts/idd-next-id exploration
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

<!-- Add one Markdown link to the actual ticket basename, followed by its one-line gist. -->

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

- **research** (AFK) — surface a fact a decision waits on. Investigated with available read-only tools or an optional read-only research worker; orchestration alone publishes validated findings.
- **prototype** (HITL) — raise discussion fidelity with a cheap concrete artifact to react to. May hand to Guildhall's `prototype-builder` when installed.
- **grilling** (HITL, the default) — conversation, one question at a time.
- **task** (HITL or AFK) — manual work that must happen before a decision *can* be made (provision access, move data). The one type that does rather than decides; it earns its place by unblocking a decision.

## Frontier and claims

The **frontier** = tickets with `status: open`, empty `claimed_by`, and every `blocked_by` entry resolved. It is mechanically computable from ticket frontmatter.

To **claim**: set `status: claimed` AND `claimed_by: <name>`, and commit, *before any work*. Use a path-scoped commit and preserve unrelated staged changes; this coordinates Git history but is not a lock between unmerged clones. See the bundled coordination procedure for unpublished research proposals.

## Hard rules

- **One non-research ticket per session.** Research tickets may fan out in parallel.
- Load only `map.md` at session start; zoom into ticket bodies on demand.
- Graduated fog is REMOVED from `## Not yet specified` — it lives only as its new ticket.
- A mis-scoped ticket is closed as `out_of_scope` with a one-line map entry; it does NOT appear in `## Decisions so far` (that section records the route actually walked).

## Lineage

When an Exploration reaches `clear` and seeds downstream work, the Product (and every Intention/Spec descended from it) carries `exploration: EXPL-<id>` in its frontmatter. Guildhall's `fog-cartographer` keys on this field to write quest-discovered unknowns back into the map.

## Terminal states and archival

`clear` (fog empty AND every ticket resolved or out_of_scope AND no missing dependencies or cycles; an empty frontier alone is insufficient) and `abandoned` are terminal. The separate archive workflow distills the map and each ticket's Resolution into `docs/idd-ledger.yaml` and deletes the whole directory (full text recoverable via the archive git tag). There is no `archived` status.
