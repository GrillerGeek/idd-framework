# Archive manifest contract

Manifests are reviewable internal planning artifacts, not a new IDD lifecycle/schema. Choose a fresh path before capturing inputs. Preserve source text, dates, unknown metadata and duplicate-ID provenance. The usual structure is:

```yaml
manifest:
  date: "YYYY-MM-DD"
  scan_totals: {products: 0, intentions: 0, expectations: 0, specs: 0, explorations: 0, reviews: 0}
  proposed: {archive: 0, keep: 0}
  artifacts:
    - id: INT-a1b2
      path: docs/intentions/INT-a1b2-purpose.yaml
      type: intention
      raw_status: Fulfilled
      canonical_status: fulfilled
      disposition: archive
      disposition_class: completed
      reason: terminal
      verified: frontmatter
      flags: []
      notes: "Concrete reviewed evidence and warnings."
  orphans: []                     # entries: {id, orphaned_by}
  reviews: []                     # entries: {path, action, subject?, reason?}
  reviewed_inputs:
    version: 1
    excluded_manifest: docs/reviews/idd-archive-manifest-YYYY-MM-DD.yaml
    files: []                    # sorted entries: {path, kind: file, mode: 420, sha256: <64 hex>}
```

Artifact types are product, intention, expectation, spec and exploration (accept the existing EXPL type spelling as an alias only). An exploration path is its map.md; the entire directory is the archival unit. Artifact disposition is archive or keep; disposition_class uses ledger completed/superseded/deferred/abandoned when archival is proposed. Review action is keep, delete or move-to-archive. Move targets are `docs/archive/<original-basename>`. Validate uniqueness and no overlaps. Every discovered artifact/review has a disposition or an explicitly surfaced malformed-input limitation. Counts reflect actual source files (one map per Exploration), not records. Review-action counts are separate; proposed counts cover artifact rows only.

`reviewed_inputs` binds classification to content. Capture the union of Git tracked and untracked nonignored file paths, excluding `.git` internals and **only this manifest's exact own path**. Use NUL-safe Git/path enumeration and reject unsafe paths/links/nonregular files. Include all artifact, review, ledger, installed-skill and supporting-code inputs that are Git-visible. Each sorted record stores relative path, kind=file, numeric permission bits and SHA-256 of exact bytes. Empty directories and Git index/HEAD bookkeeping are excluded. Capture before classification and require exact equality immediately before publication and again through the pre-tag apply preflight. After the verified recovery tag, compare retained original plus exact already verified owned changes before each operation; never recapture or rewrite the manifest binding after owned mutations.

An unchanged tree may be committed with the manifest without invalidating it. Changed membership, mode or bytes—even already committed changes to a Spec, code or old ledger—invalidate it. A manifest cannot authenticate its own human approval; explicit session approval and a committed manifest are still required. Human edits to the manifest are allowed after review and commitment. Legacy manifests without this additive binding remain readable history but must be reclassified into a new bound manifest before apply.

Review precedence: a published-doc link or any active same-ID subject variant keeps the review. A delete operation requires one or more archived subjects with that exact ID and no kept variant; link its path in every matching archived record's links.reports. A moved review adds one record; a deleted subject review adds none. Disallow duplicate/conflicting operations and occupied move targets before tagging.

## Known lifecycle values

These existing canonical values identify states; archival eligibility still follows the ledger classification rules. Preserve the raw status separately and normalize only in memory.

| Type | Known canonical states |
|---|---|
| product | discovery, active, maintenance, sunset |
| intention | draft, defined, in-progress, fulfilled, deferred |
| expectation | draft, ready, specced, validated, done, deferred |
| spec | draft, ready, in-progress, review, validating, done |
| exploration | charting, resolving, clear, abandoned |

Legacy normalization aliases and historical superseded/deferred dispositions remain readable under the ledger rules. A genuinely unknown value remains keep with status-unknown; canonical_status may be null (no valid canonical value) or the unchanged unrecognized string. Never turn a known active Product into an unknown status simply because it has no archival rule. Known states without an archival rule stay keep.
