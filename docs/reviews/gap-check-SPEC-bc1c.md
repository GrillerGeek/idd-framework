# Gap-Check Report: SPEC-bc1c (Update published framework docs to v1.3)

**BLOCKED — 4 blockers, 5 warnings**

Precondition (completeness checklist): PASS. All five blocks present. Context stack/patterns/conventions/auth all non-empty. Each of the three Expectations (EXP-503a, EXP-4739, EXP-2241) has validation criteria and ≥2 edge cases. Boundaries: 11 entries. Deliverables: 8 entries. Validation: 5 automated + 6 human-review items. The checklist gate passes, so adversarial content analysis proceeds below.

Reference spot-check: the cited passages exist and say what the Spec claims. `docs/spec-authoring.md:180` is the `**Token warning:** ... approximately 8,000 tokens` line; the Anti-Patterns "One giant Spec" row is at line 191. `docs/autonomy.md:21` is the "guesses at machine speed" passage. `plugin/skills/idd-orchestration/references/spec-reference.md:113-115` is the duplicate `## Token Warning`. `docs/framework.md` Section 5 lifecycle table (109-116) and Flow Board diagram (152) are as described; a `## Glossary` exists at line 228. `docs/artifacts.md` Spec Required Fields table starts at line 105. `docs/roles.md` AI Agent role is at lines 73-82 (Spec says 74-82 — immaterial). `docs/metrics.md` primary table is lines 11-18, secondary 43-49. `examples/onboarding-portal.md` ends its Spec at line 208. Line-number citations are accurate.

---

## GC-1 — Automated validation greps scan sibling artifact YAML and will always fail

**Severity:** Blocker
**Blocks:** Validation (automated #1 and #4); Context (existing_code_refs); EXP-503a / EXP-4739 validation

**Quoted text (Validation automated #1):** "grep -r '8K\|8,000\|8000\|context window' docs/ returns zero matches in Spec-size guidance sections..."
**Quoted text (Validation automated #4):** "grep -ri 'claude code\|/idd-framework\|claude-code\|sonnet\|haiku\|opus' docs/ returns zero matches (tool-agnostic enforcement)."

**Why an implementer would have to guess:** `docs/` is not just the framework prose. It also contains `docs/specs/`, `docs/expectations/`, `docs/intentions/`, `docs/products/`, and `docs/reviews/`. Those sibling YAML/MD files already contain every forbidden string and are explicitly out of scope for this Spec. `grep -r '...8,000...' docs/` already returns hits in `PROD-f67b-idd-framework.yaml:10`, `SPEC-e547.yaml`, `EXP-503a.yaml`, `INT-294f.yaml`, and this very Spec. `grep -ri 'claude code\|sonnet\|haiku\|opus' docs/` returns dozens of hits in `docs/roles.md:65` ("Claude Code, Copilot, Kiro"), `docs/adoption.md:90`, and across `docs/specs/`. Run literally, both automated checks fail before the implementer changes anything, and they would still fail after a perfect implementation. An implementing agent cannot tell whether the Spec wants the grep scoped to the two named prose files only, scoped to `docs/*.md` excluding artifact subdirectories, or whether `roles.md:65`'s existing "Claude Code" reference is supposed to be scrubbed (which Boundary 7 and the "only files in existing_code_refs" boundary forbid). The pass/fail bar is therefore uncomputable as written.

**Question for the Spec author:** What is the exact grep scope for the tool-agnostic and token-count checks — the two specific prose files, `docs/*.md` top level only, or something else — and does the pre-existing "Claude Code, Copilot, Kiro" reference at `docs/roles.md:65` need to be removed, grandfathered, or is it simply outside the grep's intended scope?

---

## GC-2 — metrics.md Secondary table has no "target direction / why-it-matters" columns the Deliverable requires

**Severity:** Blocker
**Blocks:** Deliverables (metrics.md item); EXP-2241; Boundary "do not change table structure" tension

**Quoted text (Deliverable, metrics.md):** "Secondary metrics table gains 'Spec Gaps per Execution Report' as the lagging counterpart; both entries include definition, target direction, and why-it-matters consistent with existing table style."

**Why an implementer would have to guess:** The actual Secondary metrics table in `docs/metrics.md:43` has three columns: `| Metric | Definition | Purpose |`. It has no "Target Direction" and no "Why It Matters" column — those belong to the *Primary* table (`| Metric | Definition | Target Direction | Why It Matters |`). The Deliverable instructs the implementer to add a secondary-table row that "includes definition, target direction, and why-it-matters consistent with existing table style." That is self-contradictory: a row with target-direction and why-it-matters fields is *not* consistent with the existing three-column secondary table. The implementer must choose between (a) adding a 3-column row that drops the required fields, (b) adding a 4-column row that breaks the table's column count, or (c) restructuring the secondary table to 4 columns — but restructuring an existing table is arguably barred by the table-style and additive-change boundaries. Two reasonable agents resolve this three different ways, producing materially different metrics.md output.

**Question for the Spec author:** Should "Spec Gaps per Execution Report" be added to the existing three-column Secondary table (Metric / Definition / Purpose), or does the Spec intend the Secondary table to be widened to match the Primary table's four columns — and if the new metric needs a target direction, does it belong in the Primary table instead?

---

## GC-3 — "execution report" / "self-verification" mandated for all five docs, but the automated check only spot-tests presence, leaving acceptance subjective for several files

**Severity:** Warning
**Blocks:** EXP-2241 validation; Deliverables (artifacts.md, metrics.md)

**Quoted text (EXP-2241 validation):** "Pass: each of the five named docs contains v1.3-specific content verifiable by searching for 'gap-check' or 'self-verification' or 'execution report' in that file..."

**Why this is reviewable-but-messy:** The grep is satisfied by a *single* occurrence of any one of three tokens anywhere in the file. `docs/metrics.md` will contain "gap-check" the moment the "Gap-Check Findings per Spec" row is added, and `docs/artifacts.md` will contain "gap_check" from the field name — so both files pass the automated check with essentially zero v1.3 *narrative* content. The real Deliverable for artifacts.md (an optional field row plus a migration note) and for metrics.md (two specific new rows with defined semantics) is far richer than what the grep verifies. An implementer optimizing to the automated bar can produce a token-present-but-substantively-thin edit that passes grep but fails the Deliverable's intent, and the only backstop is human review item #5 (consistency cross-check), which does not check completeness of each file's edit. Acceptance of "did artifacts.md get a proper migration note" is left to subjective reviewer judgment with no stated bar.

**Question for the Spec author:** Beyond "the token appears," what is the minimum acceptance bar for each of the five files (e.g., artifacts.md must contain a named `gap_check` row AND a migration sentence; metrics.md must contain both named rows) so that a grep-passing-but-thin edit is rejected?

---

## GC-4 — Boundary forbids a standalone "Gap-Check" section, but framework.md must add an entirely new pipeline stage AND glossary terms

**Severity:** Warning
**Blocks:** Boundary (derived #2) vs. Deliverables (framework.md); Boundary (derived #1)

**Quoted text (Boundary):** "Do not create a new dedicated section titled 'Gap-Check' or 'v1.3 Changes' as a standalone section in any existing doc. New content integrates into the relevant existing sections..."
**Quoted text (Deliverable, framework.md):** "...the managed execution stage (implement + self-verify + execution report); the Flow Board Phases diagram updated correspondingly; Glossary updated with 'Gap-Check Gate' and 'Execution Report' if entries are added for other terms."

**Why this is reviewable-but-messy:** The "managed execution stage" is described as "implement + self-verify + execution report" — three sub-activities. Folding a brand-new gate row plus a multi-part managed-execution stage into the existing 6-row Lifecycle Phases table without (a) adding a row, (b) restructuring the table, or (c) introducing new prose that reads as a de-facto new section is a tight needle to thread, and the Spec gives no guidance on whether the gate is a *new row* in the phase table (changing it from 6 to 7+ phases), a sub-bullet under Specify/Execute, or a parenthetical. The Flow Board diagram (`Draft → Ready → In Progress → Review → Validating → Done`) must also be "updated correspondingly" with no statement of what the new node labels are or where the gate sits relative to "Ready" and "In Progress" — the same boundary the cross-check human review item (between 'Ready' and 'In Progress') depends on. The Glossary clause is conditional ("if entries are added for other terms") and the glossary already exists (line 228), so the implementer must decide whether adding entries is required or optional. Two agents will produce structurally different framework.md edits.

**Question for the Spec author:** Is the gap-check gate a new explicit phase/row in the Lifecycle table and a new node in the Flow Board diagram (and if so, what label and position), or a sub-activity within existing Specify/Execute phases — and are the Glossary entries for "Gap-Check Gate" and "Execution Report" required or genuinely optional?

---

## GC-5 — "Execution report" is a new artifact never defined anywhere; docs must describe it with no schema

**Severity:** Blocker
**Blocks:** Deliverables (framework.md, roles.md, metrics.md, examples/); EXP-2241; Boundary (tool-agnostic)

**Quoted text (Deliverable, roles.md):** "...produce an execution report noting any spec gaps..."
**Quoted text (Deliverable, examples/):** "...managed execution, and execution report. The example must explicitly show the gate running even when clean."
**Quoted text (Deliverable, metrics.md):** "'Spec Gaps per Execution Report' as the lagging counterpart."

**Why an implementer would have to guess:** "Execution report" is referenced in framework.md (a new stage output), roles.md (an AI Agent duty), metrics.md (the denominator of a metric: "per Execution Report"), and examples/ (must be shown end-to-end). Yet neither this Spec, the parent Intention, the Expectations, nor any existing doc defines what an execution report *is* — its fields, format, where it is stored, or what "spec gaps encountered" means within it. INT-294f lists a dependency on `INT-43b9` ("execution pipeline must be finalized before docs describe it"), and `INT-43b9` exists, but its content is not provided to the implementer as a reference, and no `existing_code_refs` entry points to an execution-report schema. The examples/ deliverable in particular requires *showing* a concrete execution report inline — the agent must invent its entire structure (sections, what a "clean" report looks like, how spec-gaps are tabulated), and metrics.md must define a metric counting something inside an artifact whose shape is unspecified. Two agents will invent incompatible execution-report formats, and the metric "Spec Gaps per Execution Report" will mean different things in metrics.md versus the example.

**Question for the Spec author:** What is the canonical structure of an "execution report" (its sections/fields, where it lives, and what "spec gaps encountered" counts), or which existing artifact/doc defines it — so framework.md, roles.md, metrics.md, and the worked example all describe the same thing?

---

## GC-6 — "Self-verify against all five blocks" duty is asserted but the mechanism/acceptance is undefined

**Severity:** Warning
**Blocks:** Deliverables (roles.md); EXP-2241

**Quoted text (Deliverable, roles.md):** "AI Agent role section updated with explicit self-verification duties (restate Boundaries at execution start, self-verify against all five blocks upon completion, produce an execution report noting any spec gaps)."

**Why this is reviewable-but-messy:** This is a doc-writing deliverable, so the bar is "did the role text say this." But "self-verify against all five blocks" is the kind of phrase two agents will expand very differently — one writes a single sentence, another writes a structured sub-list mirroring the completeness checklist, another invents a "self-verification checklist" sub-artifact (which would collide with Boundary derived #2's prohibition on new standalone sections). The Spec gives no acceptance bar for how much detail the role text must carry, so the deliverable's acceptance is subjective. This is the classic "update X to reflect Y" with no acceptance bar that doc Specs are prone to.

**Question for the Spec author:** Is a prose paragraph listing the three duties sufficient for roles.md, or must the AI Agent role enumerate a structured self-verification procedure — and what is the minimum that counts as "explicit"?

---

## GC-7 — examples/ deliverable cannot stay tool-agnostic while showing a runnable end-to-end pipeline, and Boundary forbids the obvious mechanism

**Severity:** Warning
**Blocks:** Boundary (tool-agnostic #1, no-Forge #11) vs. Deliverables (examples/); EXP-2241 edge case

**Quoted text (Boundary):** "Do not add any Claude Code, plugin command, or model name references to any file in docs/. The docs/ directory is 100% tool-agnostic." ... "Do not reference Forge (the web UI) anywhere in the updated docs or examples."
**Quoted text (Deliverable, examples/):** "...showing a gap-check gate run (clean, zero Blockers), managed execution, and execution report. The example must explicitly show the gate running even when clean."

**Why this is reviewable-but-messy:** `examples/` lives under the repository root, not under `docs/`, so the literal tool-agnostic boundary ("any file in docs/") does not name it — yet the no-Forge boundary explicitly extends to "examples," signaling the author intends examples to stay tool-neutral too. The deliverable requires *showing* a gap-check gate "run" and an execution report produced by an agent. A concrete, convincing worked example of an agentic pipeline almost inevitably wants to show *how* the gate is invoked (a command) and *what* produced the report (an agent/model) — exactly the plugin-specific detail the docs convention scrubs. The existing `examples/onboarding-portal.md` ends with a "Try It Yourself" section (line 224) that may already reference commands. The implementer must decide whether examples/ inherits the tool-agnostic rule (making the "show the gate running" requirement awkwardly abstract) or may show invocations (risking a boundary spirit-violation). Reasonable agents will land differently on how concrete the example may be.

**Question for the Spec author:** Does the tool-agnostic constraint apply to the `examples/` worked example as well as `docs/`, and if so, how should the example "explicitly show the gate running" without naming any command, agent, or model — i.e., what does a tool-agnostic depiction of a gate run and execution report look like?

---

## GC-8 — EXP-503a vs. Spec disagree on the second location of the token-count language (examples/ vs. plugin reference)

**Severity:** Warning
**Blocks:** Context (existing_code_refs) vs. EXP-503a edge case; EXP-503a validation

**Quoted text (EXP-503a edge case):** "The token-count language appears in both docs/spec-authoring.md and in an examples/ worked example. Both locations must be updated..."
**Quoted text (SPEC-bc1c existing_code_refs / Deliverable):** "plugin/skills/idd-orchestration/references/spec-reference.md: the '## Token Warning' section (lines 113-115) replaced..."

**Why this is reviewable-but-messy:** The parent Expectation EXP-503a says the duplicate token-count language lives in `docs/spec-authoring.md` AND "an examples/ worked example," and its own validation greps `docs/` for residual token counts. The Spec instead identifies the second location as `plugin/skills/idd-orchestration/references/spec-reference.md`. Verification confirms the Spec is correct (the duplicate is in the plugin reference at lines 113-115; `grep` of `examples/` for token/8000/context-window returns nothing). So the Spec corrected the Expectation's mislocated reference — good — but it did not reconcile the inherited Expectation text, which an implementer also reads as authoritative. An implementer faithfully following EXP-503a will hunt for a token-count string in `examples/` that does not exist and may either waste effort or wrongly conclude the example needs token-related edits. The conflicting source-of-truth between the Expectation and the Spec is a trust/consistency hazard even though the Spec's location is the accurate one.

**Question for the Spec author:** Should EXP-503a's edge case be corrected to point at `plugin/skills/idd-orchestration/references/spec-reference.md` instead of "an examples/ worked example," so the implementer is not sent to a location that contains no token-count language?

---

## GC-9 — Migration-note placement and the additive-only boundary leave the artifacts.md `gap_check` field acceptance ambiguous

**Severity:** Warning
**Blocks:** Deliverables (artifacts.md); Boundary (additive-only #4); EXP-2241 edge case

**Quoted text (Deliverable, artifacts.md):** "Spec section updated with the optional gap_check field in the Required/Optional fields table; a migration note added explaining that gap_check and any other new v1.3 fields are optional and pre-v1.3 artifacts remain valid."

**Why this is reviewable-but-messy:** The artifacts.md Spec table at line 105 is titled "**Required Fields**" — there is no "Optional" section or column. The deliverable says to add `gap_check` to "the Required/Optional fields table," but the existing table is Required-only and lists no optional fields at all. The implementer must decide whether to (a) add an "Optional" column to the Required table (a structural change that the additive-only boundary may or may not permit — that boundary governs artifact *schema*, not doc table shape, but the Spec's table-style boundary is adjacent), (b) add a separate "Optional Fields" table/sub-section (which risks reading as a new standalone section, brushing Boundary derived #2), or (c) append the field to the Required table and mark it optional in-row. Each yields a materially different artifacts.md. The "migration note" likewise has no specified location (under the table? a new callout?).

**Question for the Spec author:** Where exactly should the optional `gap_check` field be documented given the existing table is "Required Fields" only — add an Optional column, an Optional sub-table, or mark it inline — and where should the migration note sit so it does not read as a new standalone section?

---

## Findings summary

| ID | Severity | One-line description |
|---|---|---|
| GC-1 | Blocker | Automated greps scan all of `docs/`, including sibling artifact YAML that already contains the forbidden 8,000/context-window/Claude/sonnet/haiku/opus strings — both checks fail before and after a correct implementation. |
| GC-2 | Blocker | metrics.md Secondary table is `Metric/Definition/Purpose` (3 cols), but the Deliverable demands a row with "target direction and why-it-matters" — inconsistent with the existing table. |
| GC-3 | Warning | EXP-2241's grep bar passes on a single token occurrence, leaving the substantive artifacts.md/metrics.md edits' acceptance subjective. |
| GC-4 | Warning | Boundary forbids a standalone Gap-Check section, but framework.md must add a new gate stage + multi-part managed-execution stage + flow-board nodes with no stated placement. |
| GC-5 | Blocker | "Execution report" is a new artifact referenced in four deliverables but defined nowhere — no schema, fields, or storage; the example must show one and metrics.md must count inside one. |
| GC-6 | Warning | roles.md "self-verify against all five blocks" duty has no acceptance bar; expansions will differ and may collide with the no-new-section boundary. |
| GC-7 | Warning | examples/ must show a runnable gap-check + execution-report end-to-end while (per the no-Forge/tool-agnostic intent) staying tool-neutral — the obvious depiction needs a command/agent the boundaries scrub. |
| GC-8 | Warning | EXP-503a says the second token-count location is "an examples/ worked example"; the Spec (correctly) says it is the plugin reference — the unreconciled Expectation sends implementers to a nonexistent string. |
| GC-9 | Warning | artifacts.md table is "Required Fields" only; "add the optional gap_check field to the Required/Optional table" plus migration-note placement is underspecified. |

---

## Round 2 Verification

**Verdict: NOT RESOLVED.** Eight of nine round-1 findings are genuinely fixed, but **GC-1 is only half-resolved and remains a Blocker**: the tool-agnostic grep (automated #4) still cannot pass after a correct implementation because pre-existing tool references in in-scope and out-of-scope prose files were not addressed.

### Remaining / regressed findings

**GC-1 — Blocker — STILL OPEN (partial fix).** The directory-scope half of the round-1 finding was fixed (greps are now scoped to `docs/*.md` top-level and explicitly exclude artifact subdirectories `docs/products|intentions|expectations|specs|reviews`, so sibling artifact YAML no longer trips the check). The **token-count half is fully resolved** — at top level only `docs/spec-authoring.md` matches `8K|8,000|8000|context window`, and that file is fixed by this Spec, so automated #1 can pass. **But the tool-agnostic half (automated #4) is not resolved.** Verified on disk:
- `docs/roles.md:65` — "Execute Specs by orchestrating AI agents (**Claude Code**, Copilot, Kiro, etc.)". roles.md IS in scope, but the roles.md deliverable only edits the AI Agent role's self-verification bullets (and Spec Author / Reviewer notes) — it does not touch line 65, and Boundary 1 ("do not add Claude Code... references") plus the named-deliverable scope give no license to rewrite that existing line.
- `docs/adoption.md:90` — "...IDD works with any AI coding agent — **Claude Code**, Copilot, Kiro, Cursor...". adoption.md is **explicitly out of scope** (Boundary 7: "Do not modify docs/adoption.md"), so the agent cannot fix it even if it wanted to.

Run literally after a perfect implementation, `grep -riE 'claude code|/idd-framework|claude-code|sonnet|haiku|opus' docs/*.md` still returns hits on `roles.md:65` and `adoption.md:90`, so automated #4's "returns zero matches" bar is uncomputable — exactly the failure round-1 GC-1 flagged ("does the pre-existing 'Claude Code, Copilot, Kiro' reference at docs/roles.md:65 need to be removed, grandfathered, or is it simply outside the grep's intended scope?"). The carve-out language added in the fix only grandfathers the artifact *subdirectories*; it does not grandfather these prose tool-references. The Spec must either (a) narrow automated #4 to the specific edited files / specific new content, (b) add an explicit grandfather exclusion for the pre-existing multi-tool examples at `roles.md:65` and `adoption.md:90`, or (c) bring those lines into scope and neutralize them. As written, the gate fails before and after a correct implementation.

### Per-finding status

| ID | R1 Severity | R2 Status | Evidence |
|----|-------------|-----------|----------|
| GC-1 | Blocker | **NOT RESOLVED (Blocker)** | Token half fixed (greps scoped to `docs/*.md`, artifact subdirs excluded; only spec-authoring.md trips the token grep and it gets fixed). Tool-agnostic half still broken: `roles.md:65` (in-scope but unedited line) and `adoption.md:90` (out-of-scope file) both contain "Claude Code"; automated #4's `docs/*.md` zero-match bar cannot pass after a correct implementation. No grandfather carve-out for these prose references. |
| GC-2 | Blocker | RESOLVED | metrics.md deliverable now uses "the existing three-column shape (Metric \| Definition \| Purpose)" for the Secondary row, with "target-direction and why-it-matters content... woven into the Definition and Purpose cells as prose... no new columns added." Human-review #7 reconciled to "all three columns populated." Verified: Secondary table is 3-col, Primary is 4-col. The self-contradictory "secondary row with target-direction/why-it-matters columns" is gone. |
| GC-3 | Warning | RESOLVED | Substance bars added: automated #5 requires artifacts.md to contain `gap_check` AND `Optional Fields\|optional` AND `pre-v1\.3\|remain valid`; automated #6 requires both named metric rows. Human-review #7/#8 add explicit "a grep-passing but thin edit... does not satisfy this deliverable." |
| GC-4 | Warning | RESOLVED | framework.md deliverable now explicit: gap-check gate is "its own explicit row between the Specify row and the Execute row (making it a first-class process stage, not a sub-bullet)"; Flow Board gains a node "positioned between 'Ready' and 'In Progress'"; Glossary entries for "Gap-Check Gate" and "Execution Report" are "required — not conditional." Placement is no longer left to the implementer. |
| GC-5 | Blocker | RESOLVED | A first-class `execution_report_definition` block now defines the artifact: storage (docs/reviews/, named by Spec ID), tool-agnostic constraint, and six named sections (Header, Boundary Acknowledgment, Self-Verification Table, Deliverables Produced, Spec Gaps Encountered, Follow-Ups) with per-section field content. All four deliverables that reference "execution report" point to this single definition. The undefined-artifact problem is fixed. |
| GC-6 | Warning | RESOLVED | roles.md deliverable now specifies "exactly three explicit self-verification duty bullets," each enumerated. The "how much detail" ambiguity is removed; the structured-vs-prose question is settled (three bullets, referencing the execution_report_definition). |
| GC-7 | Warning | RESOLVED | examples/ deliverable now states it is "fully tool-agnostic: it narrates events at the process level... and shows report and artifact EXCERPTS inline — never command invocations, tool names, model names, or plugin references," and must show an inline Execution Report excerpt using the execution_report_definition sections. The "how concrete may it be" ambiguity is resolved (process-level narration + excerpts, no invocations). |
| GC-8 | Warning | RESOLVED | EXP-503a edge case now reads "appears in both docs/spec-authoring.md and in plugin/skills/idd-orchestration/references/spec-reference.md" — the mislocated "examples/" pointer is corrected to match the Spec's (verified-accurate) second location. The inherited-Expectation trust hazard is removed. |
| GC-9 | Warning | RESOLVED | artifacts.md deliverable now specifies "an 'Optional Fields' subsection added under the Spec artifact section (below the existing Required Fields table)" with all five sub-fields enumerated (status enum, blockers, warnings, report, date) and a "one-line migration note added in the Spec section prose." Placement of both the field doc and the migration note is now concrete. |

**Cross-Spec consistency (bc1c ↔ 8776):** The `execution_report_definition` aligns with SPEC-8776's execution report on the load-bearing points — **severity vocabulary matches (blocker-grade / minor)**, and gap entries carry the same four semantic fields (description, spec_location = block + field, severity, resolution_taken). Section coverage matches (boundary acknowledgment, self-verification table, spec-gaps section). One **minor, non-blocking label drift** (not a regression, and below the bar for a new finding): bc1c uses `description`/`resolution_taken` and the section title "Boundary Acknowledgment," while 8776 uses `gap_description`/`resolution` and "Boundaries Acknowledged." Same concepts, same vocabulary; a retro reviewer parses both consistently. bc1c's own cross-Spec note already commits to keeping the two in sync, so this is a tidy-up, not a contradiction.

**New issues introduced by the fixes:** None beyond the unresolved GC-1 half. No new contradictions.
