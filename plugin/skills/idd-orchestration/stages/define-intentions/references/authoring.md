# Shared artifact authoring procedure

The entry point chooses exactly one mode. Keep stakeholder interaction and all project writes in the main conversation. Optional drafting roles receive confirmed context and return read-only proposals; they cannot manufacture confirmation. Use native questions or plain conversation for missing information. If an interactive question tool is unavailable, ask conversationally and stop without writes until answered.

## 1. Resolve selection and context without writes

- `define-intentions`, `define-outcomes`, `quick-spec`: select one live Product by internal ID, including descriptive filenames. Quick Spec also needs the intended outcome/feature scope. Do not force a fixed number of Intentions when the user has confirmed a smaller cohesive scope.
- `define-expectations`: select one live Intention and load its Product.
- `write-spec`: select one or more Expectations; trace each through its Intention to the Product. All must belong to one Product; multiple Intentions within that Product are valid when the Spec is cohesive.

Missing selection with several candidates needs a selection question; show available IDs/names without creating output directories. Ambiguous duplicate internal IDs require repair, never arbitrary filename selection. If an ID is only in docs/idd-ledger.yaml, explain its archived state and ask for recovery/another live parent; never silently recreate it. Empty or missing parents stop safely. Check actual internal IDs, not only exact filenames. Do not follow artifact symlinks or overwrite nonregular paths.

Use an available YAML parser that rejects duplicate keys (or an explicitly checked duplicate-key loader). When each parent is first loaded, retain its exact bytes/type/mode alongside the safely parsed value. Parse all relevant parents safely before using them. Keep this original parent baseline through candidate preparation; do not replace it with a later read that could silently adopt concurrent context changes. Malformed/duplicate YAML requires author repair without writes. Never silently keep the last duplicate key or install a parser into the consuming project. If safe parsing or Bash/file capabilities are unavailable, state the limitation and stop without inventing operations.

Read the Product's problem, audience, value, owner and context. Inherit stack, patterns, conventions and authentication. Spec-producing modes scan existing code/package/auth configuration to verify that context and gather real existing-code references; resolve contradictions with the stakeholder instead of guessing. Preserve Product context by reference/inheritance where the schema permits; a self-contained Spec context may state the inherited values, with justified overrides only. Do not invent nonexistent code references.

Resolve exploration lineage across explicitly supplied EXPL IDs/maps and all selected parents. A map under docs/explorations must identify the same Exploration as its metadata. Conflicting explicit/inherited IDs need a stakeholder decision before saving. Propagate one resolved nonempty exploration field to every new artifact; omit it entirely when absent. Never emit an empty field or choose one conflicting parent silently.

## 2. Confirm outcomes and edge cases before saving

Reuse facts and explicit confirmations already present in this conversation. Ask only about missing or ambiguous choices. Distinguish confirmed facts, proposed suggestions and explicitly delegated assumptions; do not infer stakeholder confirmation from silence, agent proposals or passing tests.

For each Intention, confirm its outcome statement, rationale, priority (critical/high/medium/low), real dependencies and accountable owner. Make outcomes independently demonstrable; separate unrelated concerns without splitting a user-confirmed cohesive scope mechanically. Good: callers receive a consistent greeting. Weak: build a greeting component. Dependencies must reference real existing or reserved candidate Intention IDs. New intentions start draft, with their exact child Expectation IDs (empty for define-intentions).

For every new Expectation, establish description, measurable/pass-fail validation, complexity (low/medium/high) and owner. Propose at least two concrete edge cases, each explaining how it differs from the base case. Ask the stakeholder to confirm/reject/add cases. Count only explicitly confirmed cases. If rejection leaves fewer than two, say that at least two are required and ask for a replacement; do not progress to a different Expectation or save anything until the minimum is met. Already supplied explicit confirmation needs no repeated question.

**Batch gate:** define-outcomes and quick-spec apply this rule before saving ANY proposed YAML, including intermediate Intentions. Never save the Intention first while its Expectation's edges are unconfirmed. Review the whole proposed batch and obtain missing content/save confirmation. A request for suggestions is not authorization to save them. Selection/confirmation stages create no directories, scratch files or project artifacts.

For write-spec, read the selected Expectations' existing descriptions, validation and edge cases. Reuse explicit confirmation provided in context; if whether edge content is agreed is unresolved, ask before authoring. Preserve exact selected text in embedded details. Existing artifacts' statuses do not become human peer review of the new Spec.

## 3. Prepare complete draft candidates

Read the mode's bundled templates. All new Intention, Expectation and Spec artifacts start **draft**; do not promote existing parents. Do not generate passed gap-check annotations or approved peer-review claims. Content/save confirmation is not readiness, and completeness is not human peer review. Specs have no required owner field; keep owner on Intentions/Expectations rather than extending the Spec schema.

Spec-producing modes build all five blocks:

1. Context: nonempty stack, patterns, auth, conventions and truthful existing-code references; inherited from the Product with only justified overrides.
2. Expectations: unique selected/generated ID list, plus matching expectations_detail objects containing exact descriptions, validation and at least two confirmed edge cases each.
3. Boundaries: confirmed explicit prohibitions on paths, dependencies, adjacent scope or other behavior.
4. Deliverables: concrete, cohesive outputs; do not implement them during authoring.
5. Validation: at least one meaningful automated check and one human-review item, with observable criteria.

Do not duplicate the expectations key: IDs belong under expectations, detail objects under expectations_detail. Check completeness items 1–10 separately from the human peer-review fact; draft output does not authorize execution. If scope cannot form a cohesive Spec, propose a split and obtain needed decisions before saving.

Generate each new immutable ID with `bash "<absolute-skill-directory>/scripts/idd-next-id" <intention|expectation|spec>` from the consuming project. The helper checks live filenames, not concurrent-branch reservations or ledger history. Check every proposed ID against safely parsed live internal IDs, the archive ledger and an in-memory set reserved across this entire candidate batch; regenerate any collision. Do not renumber existing IDs. Do not write scratch to the project simply to reserve an ID.

Prepare all candidate YAML in memory or conversation, with exactly one artifact root per file. Save as <ID>.yaml or <ID>-<descriptive-slug>.yaml in the matching artifact directory; the optional nonempty slug uses lowercase ASCII letters/digits separated by hyphens. The complete filename ID prefix must equal the internal immutable ID; a descriptive suffix is not part of that ID. Validate every candidate and cross-link before any project write: required fields/types, draft status, minimum confirmed edges, no duplicate keys/IDs, file/internal-ID match, correct parent Product/Intention and exact reciprocal child links. Every Spec's selected Intention set must match its selected Expectations' parents. Preserve existing child IDs when adding to a parent; do not duplicate them or remove unrelated children.

## 4. Save with preservation and explicit partial-state handling

Permitted output ownership by mode:

| Mode | New files | Existing edits |
|---|---|---|
| define-intentions | docs/intentions/INT-*.yaml | none |
| define-expectations | docs/expectations/EXP-*.yaml | only new child IDs in selected parent expectations list |
| define-outcomes | new Intention and Expectation YAML | none |
| quick-spec | new Intention, Expectation and Spec YAML | none |
| write-spec | docs/specs/SPEC-*.yaml | none |

Before the first save, capture bytes/types/modes for all existing project files (including dirty/untracked/hidden files and installed skills) and directory inventory, excluding only .git internals. Retain this baseline in memory or captured tool output. Include relevant parent bytes/types/modes and verify every target is absent and regular-path-safe. Preserve pre-existing dirty and untracked user work, comments, modes and installed resources. Compare every relevant parent against its original context-load baseline, and recheck reserved IDs/target absence immediately before starting writes. The wider pre-write snapshot must agree with those original parent bytes/types/modes. If a parent changed or a target appeared, stop without workflow writes and report the conflict.

Only after complete validation and confirmation create the directories actually needed by this batch, then create new files exclusively (fail if a target now exists). Do not bulk-initialize all artifact directories. Keep an exact list of successful writes and assigned IDs. Accelerated mode saves one already-confirmed, fully validated batch; it does not bypass the confirmation gate.

For an existing parent expectations-list update, re-read its bytes/type/mode **immediately before that particular update**, comparing against the retained parent baseline. Use an available safe localized edit that changes only the list value and preserves every byte/comment outside it. Re-serializing the whole parent is prohibited. If a localized edit cannot be assured, stop and report the capability gap; do not improvise a broad rewrite. The parent status and unrelated fields are immutable here.

This is not an atomic multi-file transaction or compare-and-swap. A late concurrent parent change may happen after children were saved. Stop the parent update, preserve those new children and the concurrently edited parent, and report exact partial writes/IDs, remaining operations and recovery needed. An interrupted save never automatically rolls back user work or generates replacement children to conceal partial progress.

If the user identifies an interrupted child and confirms recovery, validate that existing child's ID, content and parent before completing only the missing parent-list link. Reuse its ID; if already linked, report a no-op. Preserve every other byte/mode. A stale parent baseline still refuses; recovery is not authority to overwrite concurrent edits.

## 5. Verify and return

Reread every saved YAML with duplicate-key rejection and compare with the validated candidate. Verify reciprocal links, exact embedded details, resolved/omitted lineage and draft states. Compare parent bytes outside the owned list and all unrelated project/installed resources against the retained pre-write baseline; Git status alone cannot detect changes to already-dirty files. Do not claim preservation from a listing without content/mode evidence. Detect failures and report actual partial state.

Show created paths/IDs, confirmed facts/edge counts, context/lineage choices and any genuine unresolved questions. State that draft Spec content still needs technical review, human readiness facts and a current gap-check before execution. Suggest the entry point's next phase by name without depending on that skill being installed. Never mark incomplete saves, unconfirmed edges or unavailable checks successful.
