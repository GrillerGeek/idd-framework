# Next migration packet: portable artifact authoring

Status: assessed and drafted as [SPEC-8406](../specs/SPEC-8406.yaml), including exact scenario oracles; not an execution gate. Bulk conversion waits for acceptance of
SPEC-b2e3's three-workflow pilot. This document records decisions made under the
2026-09-12 unattended-work authorization.

## Outcome and scope

The next focused Spec should cover `define-intentions`, `define-expectations`,
`define-outcomes`, `quick-spec` and `write-spec`. These five stages share artifact
selection, parent context, ID allocation, stakeholder confirmation and YAML writes.
Technical review, exploration, archival, Forge and distribution remain separate
contracts with different failure modes.

## Source assessment

| Stage | Existing behavior to preserve | Porting issue to resolve |
|---|---|---|
| define-intentions | Product context, outcome wording, rationale, priority, dependencies, owner and exploration lineage | Resolve internal IDs in descriptive filenames; bundle helper/template; reuse supplied decisions; remove eager directory initialization. |
| define-expectations | Parent Intention and Product, measurable criteria, explicit confirmation of at least two edge cases, parent backlink | Do not delegate stakeholder questions into an isolated worker; preserve rejected-edge replacement loop; update only the parent's expectations list. |
| define-outcomes | Cohesive Intentions and Expectations in one session, bidirectional links | Apply the same explicit edge-case confirmation rule as standalone Expectations; confirm the batch before writing it. |
| quick-spec | Product through all five Spec blocks, actual-code context, boundaries, deliverables and validation | Current prose saves intermediate artifacts before later confirmation. Prepare the complete proposed batch first, and distinguish confirmed artifact content from actual Spec peer review. |
| write-spec | Selected Expectations and inherited Product context, accurate code references, five blocks, completeness report | Reject mixed Product parents or conflicting exploration lineage until resolved; copy linked validation/edge details faithfully; never infer readiness from mechanical completeness. |

## Proposed decisions

1. Keep one main-conversation orchestration owner for selection, missing stakeholder
   questions, confirmation and all project writes. A host may delegate bounded
   drafting with explicit supplied answers; the returned proposal grants no save
   permission. Preserve existing Claude model metadata and use its model directive
   only in the adapter's draft-role dispatch.
2. Reuse explicit confirmation already present in the conversation. Do not ask users
   to repeat known facts, and do not treat silence, generated proposals, urgency or
   a worker's assertion as confirmation. New substantive edge cases require explicit
   confirmation before the batch is saved. Ordinary shipped human approval rules
   stay intact; this migration's unattended exception is authoring evidence only.
3. Generate new artifacts as `draft`. Present completeness items 1–10 separately
   from human peer review. Do not create a passed gap-check annotation or promote
   parent lifecycle states while authoring. Later reviewed orchestration owns those
   transitions.
4. Install each stage alone with a complete copy of its shared authoring procedure,
   required templates, Spec reference where needed and executable ID helper. Keep
   canonical resources once, with generated copies declared in the catalog. No
   parser or package dependency is added to the consuming project.
5. Validate candidate YAML safely, with duplicate-key rejection and parent/link
   checks, before making project writes. Resolve existing artifacts by their internal
   IDs, including descriptive filenames, and consider the archive ledger. Ask for
   recovery instead of recreating an archived parent or choosing an ambiguous match.
6. Reserve all newly generated IDs in the batch as well as checking disk and ledger.
   Recheck file and parent baselines immediately before the first write. Preserve
   existing parent bytes outside the expectations list, including comments, modes
   and concurrent user edits. Refuse when a safe field-only update cannot be made.
7. Save only the directories and artifacts required by the selected stage. Multi-file
   writes cannot honestly promise a filesystem transaction: preflight the whole
   batch, report exact partial writes if interrupted, and do not automatically undo
   user changes. A recovery attempt reconciles existing IDs rather than generating
   duplicate child artifacts.
8. Inherit Product context by reference and describe only meaningful overrides.
   Explicitly confirm conflicts between declared Product context and observed code.
   Copy validation criteria and confirmed edge cases into Spec details without
   silently changing their meaning. Propagate one resolved exploration lineage to
   every new artifact; omit optional lineage when none exists.

## Focused verification to specify before execution

- Individual bundle closure and installer probes for five skills × two hosts × two
  modes, in addition to the existing pilot coverage.
- A supplied-context authoring fixture with descriptive parent filenames and a dirty
  unrelated note. Check exact identity/linkage, draft statuses, context inheritance,
  nonempty lineage and allowed mutations after real host runs.
- A missing-confirmation fixture that asks for Expectation proposals but does not
  confirm them: require a concrete question and no YAML or directory creation.
- A rejection fixture leaving fewer than two confirmed edge cases: require the
  replacement question, no saving, and no progression to a different Expectation.
- Existing Expectations → draft Spec, including multiple compatible Intentions;
  reject cross-Product links, conflicting lineage and duplicate-key parent YAML.
- Parent update preservation, stale baseline detection and a partial-save recovery
  exercise in disposable workspaces. Do not claim a prose instruction itself proves
  atomic writes or concurrency safety.
- Preserve all existing command/role frontmatter, old router bytes, historical
  artifacts, helpers, plugin identity/version and personal installations.

The next Spec must own exact source, generated bundle, adapter, fixture, evaluator
and documentation paths. Its independent gap-check should explicitly inspect
confirmation semantics, the batch-save failure contract and coverage overlap with
future router integration before any bulk implementation begins.
