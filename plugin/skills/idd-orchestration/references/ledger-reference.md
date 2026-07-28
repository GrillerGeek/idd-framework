# Archive Ledger Reference

The archive ledger is the historical source of truth for IDD artifacts that have reached a terminal state. Archiving an artifact **distills it to a compact ledger record and deletes the YAML file** — the active directories then contain only live work, and discovery globs, gap-checks, and counts stay honest. The full artifact text is never lost: every archive run is preceded by a git tag, so any archived artifact is one command away:

```bash
git show <archive_tag>:<source_path>
# e.g. git show idd-archive-2026-06:docs/specs/SPEC-030.yaml
```

There is **no `archived` status** in any lifecycle. Archived artifacts cease to exist on disk by design.

## Ledger location and shape

One ledger per repo: `docs/idd-ledger.yaml` — a sibling of the artifact directories, deliberately **outside** every discovery glob (`docs/<type>/*.yaml`). Never place the ledger inside `docs/products/`, `docs/intentions/`, `docs/expectations/`, or `docs/specs/`.

```yaml
# IDD Archive Ledger — historical source of truth for completed/retired artifacts.
# Full text of any record: git show <archive_tag>:<source_path>
ledger:
  version: 1
  product: PROD-001
  updated_at: "2026-06-12"
  archives:                      # one entry per archive run
    - tag: idd-archive-2026-06
      date: "2026-06-12"
      count: 153
      note: "Initial consolidation: 248 -> 95 active artifacts"
  records:
    - id: SPEC-030
      type: spec                 # product | intention | expectation | spec | review
      title: "Workflow state tracking: provenance metadata + cascade invalidation"
      disposition: completed     # completed | superseded | deferred | abandoned
      final_status: done         # canonical lifecycle status at archive time
      verified: code             # code | frontmatter | n/a
      evidence: "workflow-state-store.ts, db queries, invalidation trigger verified present; tests green"
      links:
        intention: INT-012       # parent, if any
        expectations: [EXP-04fa, EXP-de3f]
        superseded_by: null      # ID, when disposition is superseded
        reports: [docs/reviews/SPEC-030-gap-check.md]   # co-archived review paths (valid at tag)
      source_path: docs/specs/SPEC-030.yaml
      archive_tag: idd-archive-2026-06
      archived_at: "2026-06-12"
```

Field notes:

| Field | Rule |
|---|---|
| `title` | One line, distilled from `statement` (INT), `description` (EXP), or the Spec's context/deliverables. Write it so the record is meaningful without the source file. |
| `disposition` | `completed` (terminal success) \| `superseded` (replaced — set `links.superseded_by`) \| `deferred` (intentionally parked; capture the reason in `evidence`) \| `abandoned` (orphaned draft, never finished) |
| `verified` | `code` when completion was spot-verified against the codebase; `frontmatter` when the status field was trusted; `n/a` for abandoned/review records |
| `evidence` | One sentence. For `code`-verified records, name what was checked. For `deferred`, restate the deferred_reason. |
| `links.reports` | Review files deleted alongside this artifact; their content is recoverable at the same tag. |

Review files moved (not deleted) get a minimal record: `id` = filename stem, `type: review`, `disposition: completed`, and the new path in `evidence`.

## Status normalization

Classification operates on **canonical** statuses. Map raw values first (case-insensitive match, quoted values unquoted). Normalize on disk **only for surviving artifacts** — never churn files that are about to be deleted.

| Raw (any casing) | Canonical |
|---|---|
| InProgress, in-progress | in-progress |
| implemented, Complete, Fulfilled (INT) | fulfilled |
| implemented, Done (EXP) | done |
| Ready, "Ready" | ready |
| Validated | validated |
| Pending | deferred |
| implemented (SPEC) | done |
| approved (SPEC) | ready |

Unknown values: flag in the manifest as `status-unknown`, propose `keep`, and let the human decide.

## Classification rules

| Canonical status | Type | Disposition |
|---|---|---|
| fulfilled / done / validated | INT / EXP | archive: completed (`verified: frontmatter`) |
| done | SPEC | archive: completed **only if code spot-verify passed**; otherwise keep + status-correction row |
| superseded | any | archive: superseded (set `links.superseded_by`) |
| deferred | any | archive: deferred — but flag `KEEP-RECOMMENDED?` when `deferred_reason` states a hard future obligation (e.g. a production blocker) |
| draft / ready, parent Intention archived | EXP / SPEC | archive: abandoned (auto-flagged orphan — human confirms at the manifest checkpoint) |
| draft / defined / ready / in-progress / review / specced | any | keep |
| duplicate / variant pair member | any | archive both halves, cross-linked via `links` |
| clear | EXPL | archive: completed — distill the map's Destination, each resolved ticket's gist, and the Out of scope list into the record's evidence |
| abandoned | EXPL | archive: abandoned |

> **Explorations are directories.** The unit of archival is the whole `docs/explorations/EXPL-<id>-<slug>/` directory: one ledger record per Exploration (never per ticket), and deletion removes the directory recursively. `charting` and `resolving` Explorations are live work — always `keep`. An Exploration whose id is still referenced by a live artifact's `exploration:` field gets a dangling-reference warning in the manifest, same as the Intention cluster rule.

Cluster rule: if an Intention is terminal and ALL of its children are proposed for archive, archive the whole family together so no dangling-reference warning fires for it.

## The never-annotate-active principle

Active artifacts are **never** edited to note that something they reference was archived. The ledger is the resolution mechanism: active artifact → referenced ID → ledger record → git tag. The apply step greps survivors for archived IDs and **warns** about danglers; it does not rewrite them.

## Review file disposition

| Pattern | Rule |
|---|---|
| Review keyed to an artifact being archived (e.g. `SPEC-xxxx-gap-check.md`) | Delete; record path in the subject's `links.reports` |
| Review keyed to an artifact that stays active | Keep in place |
| Review linked from published docs | Keep in place (it is completion evidence) |
| Dated cross-cutting artifacts (audits, PR findings, coverage matrices) | Move to `docs/archive/` with a `type: review` ledger record |
