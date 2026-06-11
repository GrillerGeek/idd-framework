# Gap-Check Report: SPEC-8776 (implement-spec plugin command/agent)

**Result: PASS (completeness checklist) — but 4 Blockers, 5 Warnings on adversarial review.**

The completeness checklist passes: all five blocks are present and populated, every Expectation carries validation criteria plus ≥2 edge cases, there are 8 Boundaries, 4 Deliverables, and Validation has 7 automated + 5 human items. However, an implementing agent picking this up cold would produce a wrong implementation on at least four points — most critically because the Spec's central mechanism for command registration (a `commands` array in `plugin.json`) does not exist in this codebase, and the Spec's own boundary-enforcement validation (`git diff`) is structurally broken because the artifact files it must check are untracked.

---

## Precondition: Completeness Checklist

| Gate | Status | Evidence |
|---|---|---|
| All 5 blocks present | PASS | context, expectations, boundaries, deliverables, validation all present |
| Context stack non-empty | PASS | lines 15–19 |
| Context patterns non-empty | PASS | lines 20–33 |
| Context conventions non-empty | PASS | lines 34–44 (9 entries) |
| Context auth non-empty | PASS | lines 83–85 ("N/A — public open-source repository...") |
| Every Expectation has validation criteria | PASS | EXP-bbe6, EXP-02f3, EXP-9d63 each have a `validation:` field |
| Every Expectation has ≥2 edge cases | PASS | each has exactly 2 |
| ≥1 Boundary | PASS | 8 boundaries |
| ≥1 Deliverable | PASS | 4 deliverables |
| Validation ≥1 automated + ≥1 human | PASS | 7 automated, 5 human |

Checklist passes. Proceeding to adversarial review (not stopping).

---

## Findings

### GC-1 — Blocker — Context (existing_code_refs), Deliverables, Validation

**Quoted text (Deliverables):** "plugin/.claude-plugin/plugin.json — updated to register the new command. Add implement-spec to the commands array using the same object shape as existing command entries."

**Quoted text (Context, plugin.json ref):** "The new command must be registered here. Check existing command registration pattern (commands array, name/path fields) and add implement-spec using the same pattern."

**Why an implementer would have to guess / go wrong:** `plugin/.claude-plugin/plugin.json` has no `commands` array. Its keys are `name, version, description, author, homepage, repository, license, keywords, userConfig`. None of the nine existing commands are registered in any array, in this file or anywhere else in the repo (a repo-wide grep for a `commands` JSON key returns nothing). Claude Code plugins auto-discover commands from `plugin/commands/*.md`; registration is by file placement, not by a manifest array. The Spec instructs the agent to follow a "pattern" and "object shape" that do not exist. An implementing agent will either (a) invent a `commands` array — adding a non-additive, convention-breaking structure to the manifest and possibly breaking plugin loading — or (b) silently skip the deliverable. Either way the result diverges from intent, and Deliverable 3 plus two Validation items (file-existence and JSON-lint of the "updated" plugin.json) are built on a false premise.

**Question for the Spec author:** Given that this plugin's commands are auto-discovered from `plugin/commands/` and `plugin.json` contains no `commands` array, what exactly should Deliverable 3 change in `plugin.json` — or should creating `plugin/commands/implement-spec.md` alone constitute registration, making the plugin.json deliverable unnecessary?

---

### GC-2 — Blocker — Validation (automated #3)

**Quoted text:** "No existing file mutations: run git diff --name-only and confirm only plugin/commands/implement-spec.md, plugin/agents/idd-spec-implementer.md, plugin/.claude-plugin/plugin.json, and docs/reviews/SPEC-8776-*.md appear in the diff. Any other modified file is a Boundary violation."

**Why an implementer would have to guess / go wrong:** `git diff --name-only` reports only tracked, modified files. The three newly *created* files are untracked, so they will never appear in `git diff --name-only` (they need `git status` / `--untracked` or `git add` first). Worse, the entire `docs/` tree in this repo is currently untracked (`git status` shows `?? docs/products/ docs/intentions/ docs/expectations/ docs/specs/ docs/reviews/`), so the execution report and the Spec itself are invisible to `git diff` as well. The check as written would report an empty diff regardless of what the agent created, making it pass vacuously — it cannot detect the boundary violations it claims to detect. An agent told this is the boundary-enforcement gate has no working way to self-verify Boundaries 1, 5, and 6.

**Question for the Spec author:** Since the new files are untracked and the whole `docs/` tree is untracked in this repo, what git command should the agent actually use to enumerate all created and modified paths (e.g., `git status --porcelain` over `git diff --name-only`), and should the allowlist explicitly include the Spec file and any other docs touched during the run?

---

### GC-3 — Blocker — Boundaries (#5, #6), Deliverables (all)

**Quoted text (Boundary 5):** "do not alter the existing nine command files." **(Boundary 6):** "do not alter the existing nine agent files."

**Why an implementer would have to guess / go wrong:** The repo contains exactly ten command files (`deep-review, define-expectations, define-intentions, define-outcomes, forge, interview, quick-spec, review-spec, tech-review, write-spec`) and nine agent files (`deep-review-lead, expectation-author, intention-author, outcome-author, product-interviewer, quick-spec-author, spec-author, spec-reviewer, tech-lead-reviewer`). So "the existing nine command files" is off by one (there are ten), while "the existing nine agent files" is correct. An implementer who trusts the count will be confused about which set is frozen, and the Validation automated check that whitelists modified files depends on an accurate inventory. More importantly, this signals the Spec's environment snapshot is stale, which undermines confidence in the file-count-based validation items (GC-2, plus automated #5 which counts "all eight Boundary entries" and "all four Deliverable entries").

**Question for the Spec author:** The repo has ten command files and nine agent files, not "nine command files" — which files precisely are in the frozen set, and should the boundary reference the directory ("do not modify any file in plugin/commands/ except the new implement-spec.md") rather than a hardcoded count that drifts?

---

### GC-4 — Blocker — Validation (human #2, #3), Boundaries (#4), Expectations (EXP-bbe6 edge case 2)

**Quoted text (Boundary 4):** "If the gap is Blocker-level (prevents correct implementation), the agent must stop and emit a gap report rather than making a judgment call. Minor gaps may receive a documented best-effort choice." **(Human review #2):** "Pay special attention to the Blocker vs. minor gap distinction: is it operationally defined, or does the agent have to guess?"

**Why an implementer would have to guess / go wrong:** The Spec defines Blocker as "prevents correct implementation" and minor as everything else, but gives the agent no operational test to classify a gap at runtime — the very thing human-review item #2 flags as the risk. The agent must decide, mid-run, whether an ambiguity it hits is "Blocker" (stop) or "minor" (best-effort and continue). Two reasonable agents will draw this line differently: one stops on GC-1 (no commands array), another improvises a commands array and calls it a minor gap. The Spec's own doctrine ("agents surface gaps, never improvise") hinges entirely on this classification, yet the classification rule is circular ("Blocker = prevents correct implementation" — but whether a guess is "correct" is exactly what's unknown at build time). EXP-bbe6 edge case 2 hardcodes one example (missing Boundaries block = Blocker, halt), but a single example is not a decision procedure.

**Question for the Spec author:** What concrete, agent-checkable test distinguishes a Blocker gap from a minor gap at build time (e.g., "if more than one materially different implementation satisfies the Spec text, it is a Blocker") — and where in the agent system prompt should that test live so the agent does not have to rely on the self-referential "prevents correct implementation" definition?

---

### GC-5 — Warning — Deliverables #2, Conventions

**Quoted text:** "color (choose any unused color from the existing agents)"

**Why implementations would be inconsistent:** The existing agents use yellow, magenta (x2), green (x2), cyan (x2), blue, red. "Any unused color" is under-determined — the set of valid Claude Code agent colors isn't enumerated in the Spec, and several listed colors are already reused (magenta, green, cyan appear twice), so "unused" is itself ambiguous (unused among the standard palette, or simply not-yet-used here?). Two implementers will pick different colors. This is cosmetic, so it is a Warning, not a Blocker, but it makes the deliverable's acceptance subjective and the human "side-by-side" review noisier.

**Question for the Spec author:** Should the Spec name a specific color (e.g., `orange`) for `idd-spec-implementer`, or is any color from the supported palette acceptable and the choice explicitly left to the implementer?

---

### GC-6 — Warning — Validation (human #5), Boundaries (#8)

**Quoted text (Human review #5):** "confirm the executing agent transitions Spec status from ready → in-progress at start and in-progress → review at completion."

**Why implementations would be inconsistent:** This human-review item assumes the agent performs Spec status transitions (editing the Spec YAML's `status:` field), but no Deliverable instructs the agent to do so, and EXP-bbe6/EXP-02f3/EXP-9d63 never mention status transitions. Meanwhile Boundary 1 requires that existing artifacts "must remain valid under the current schema after this Spec is implemented" and the agent is told not to hand-edit immutable fields. An implementer reading only the Deliverables will not write status-transition logic; a reviewer running human-review #5 will then fail the implementation for a behavior the Deliverables never asked for. There is a coverage gap between the validation criteria and the deliverables.

**Question for the Spec author:** Is "transition the Spec status ready → in-progress → review" an actual required behavior of the idd-spec-implementer (and if so, which Deliverable and Expectation cover it), or is human-review item #5 describing a behavior that belongs to a different Spec and should be removed here?

---

### GC-7 — Warning — Expectations (EXP-02f3) vs. Validation (automated #5)

**Quoted text (EXP-02f3 validation):** "a self-verification table with one row per Expectation (including its edge cases)..." **(Automated #5):** "grep the execution report for all three Expectation IDs (EXP-bbe6, EXP-02f3, EXP-9d63), all eight Boundary entries (by index or first unique phrase), and all four Deliverable entries — each must appear in the verification table."

**Why implementations would be inconsistent:** EXP-02f3 and EXP-02f3 edge case 1 require a row per Expectation *including each edge case* (so 3 Expectations × at-least-the-edge-cases would be more rows than 3). But automated check #5 only greps for the three Expectation IDs, not for the six edge cases. An agent optimizing to pass the automated grep will emit 3 Expectation rows and skip edge-case rows, technically failing EXP-02f3's "including its edge cases" while passing the gate. The two requirements disagree on table granularity, so two implementers produce tables of different shape and both believe they passed.

**Question for the Spec author:** Should the self-verification table have one row per Expectation, or one row per Expectation *plus one row per edge case* — and should automated check #5 be updated to grep for the edge cases too so the gate matches EXP-02f3?

---

### GC-8 — Warning — Context (patterns / execution report format) vs. EXP-9d63

**Quoted text (EXP-9d63 source expectation):** "written to docs/reviews/ as a structured YAML or Markdown file." **(SPEC-8776 EXP-9d63 + Deliverables):** "written to docs/reviews/ as a Markdown file" / filename "[SPEC-ID]-[ISO8601-timestamp]-execution.md."

**Why implementations would be inconsistent:** The parent Expectation EXP-9d63 allows "YAML or Markdown," but the Spec narrows to Markdown — which is fine (Specs may narrow). However, the Spec then requires a `spec_gaps_encountered` *section* with snake_case naming inside a Markdown file, and the automated grep accepts either "spec_gaps_encountered" or "spec gaps encountered." The agent must decide whether the report is prose-Markdown with a `## Spec Gaps Encountered` heading, or Markdown wrapping a YAML block with a literal `spec_gaps_encountered:` key, or a Markdown table. The structure of gap entries ("field reference + description + suggested resolution") is specified as content but not as format. Two agents will produce structurally different reports that a `grep` passes but a retro reviewer parses inconsistently — directly weakening the retro-loop reliability EXP-9d63 exists to guarantee.

**Question for the Spec author:** What is the exact required structure of the `spec_gaps_encountered` section (a Markdown heading + bullet list, a Markdown table with named columns, or an embedded YAML block), so every execution report is machine-parseable for the retro loop rather than only grep-matchable?

---

### GC-9 — Warning — Context (existing_code_refs: review-spec.md) vs. Deliverables #1

**Quoted text (Deliverable 1):** "Must follow the exact frontmatter and structural pattern of plugin/commands/review-spec.md: ... !`bash` preamble for mkdir -p and ls of docs/specs/ ... The allowed-tools list must include Write (the implementer writes files) and Bash(git diff *) for self-verification."

**Why implementations would be inconsistent:** review-spec.md's actual `allowed-tools` is `"Read Write Glob Grep Bash(mkdir *) Bash(ls *)"` — it grants no `Bash(git diff *)`. The Deliverable says to copy review-spec.md's frontmatter "verbatim as the template" (Context ref note) while simultaneously requiring `Bash(git diff *)` and `Write` additions and forbidding tools "beyond what the agent frontmatter declares." But the command-file `allowed-tools` governs the *command's own* preamble tools, not the dispatched agent's tools — yet the Spec conflates the two ("it may not grant tools beyond what the agent frontmatter declares"). An implementer cannot tell whether `allowed-tools` on the command should mirror review-spec's narrow list, or expand to include git diff and Write, and whether it must be a subset of the agent's tools (a constraint that does not apply to how Claude Code command/agent tool scoping actually works). The result: divergent, possibly over-permissioned command frontmatter.

**Question for the Spec author:** Should the command file's `allowed-tools` exactly mirror review-spec.md's list, or include `Write` and `Bash(git diff *)`; and is the intended constraint really that the command's allowed-tools be a subset of the agent's `tools` (given those govern different execution contexts)?

---

## Summary

PASS (completeness) / BLOCKED on adversarial review — **4 Blockers, 5 Warnings**.

- **GC-1 (Blocker):** plugin.json has no `commands` array; the registration "pattern/object shape" the Spec tells the agent to follow does not exist — agent will invent a non-additive structure or skip the deliverable.
- **GC-2 (Blocker):** `git diff --name-only` boundary check is vacuous — new files are untracked and the whole `docs/` tree is untracked, so the check passes regardless of violations.
- **GC-3 (Blocker):** "existing nine command files" is wrong (there are ten); stale file-count snapshot undermines the file-allowlist validation.
- **GC-4 (Blocker):** Blocker-vs-minor gap classification is circular and has no agent-checkable test, yet the entire stop-and-report doctrine depends on it.
- **GC-5 (Warning):** "choose any unused color" is under-determined (palette not enumerated; some colors already reused).
- **GC-6 (Warning):** human-review #5 requires status transitions that no Deliverable or Expectation asks the agent to perform.
- **GC-7 (Warning):** EXP-02f3 wants table rows "including edge cases" but automated check #5 only greps the 3 Expectation IDs — table granularity disagrees.
- **GC-8 (Warning):** `spec_gaps_encountered` section format is unspecified (heading vs. table vs. embedded YAML); grep-matchable but not reliably parseable for the retro loop.
- **GC-9 (Warning):** Deliverable 1 requires `Bash(git diff *)` in command `allowed-tools`, but review-spec.md (the "copy verbatim" template) grants no such tool; command-vs-agent tool scoping is conflated.

---

## Round 2 Verification

**Verdict: RESOLVED.** All four Blockers and all five Warnings are genuinely fixed; no new Blocker-grade issues. Repo facts re-verified on disk (10 command files, 9 agent files, plugin.json has no commands array, review-spec.md allowed-tools has no git, orange unused).

Per-finding status:

| ID | R1 Severity | R2 Status | Evidence the fix is genuine (not a reword) |
|----|-------------|-----------|--------------------------------------------|
| GC-1 | Blocker | RESOLVED | The plugin.json Deliverable is **removed** (deliverables are now exactly three: implement-spec.md, idd-spec-implementer.md, execution report). A new patterns comment and the plugin.json existing_code_refs note both state "Plugin commands are auto-discovered from plugin/commands/*.md by filename; there is no commands array in plugin.json and none is needed. Creating plugin/commands/implement-spec.md is sufficient registration." Automated #1 and #2 now *confirm plugin.json is unchanged* rather than "updated." The false premise is gone. Verified: plugin.json has no commands array. |
| GC-2 | Blocker | RESOLVED | The vacuous `git diff --name-only` check is replaced with a `git status --porcelain` PRE/POST snapshot protocol (agent steps 3a–3d, automated #3): capture porcelain before, capture after, diff the two listings to "enumerate every path that was created or modified (tracked or untracked)." This correctly captures untracked new files and the untracked docs/ tree. The command allowed-tools adds `Bash(git status *)`. The check is now functional. |
| GC-3 | Blocker | RESOLVED | Boundary now reads "there are ten existing command files" and enumerates all ten (deep-review, define-expectations, define-intentions, define-outcomes, forge, interview, quick-spec, review-spec, tech-review, write-spec); the agent boundary lists the nine agent files explicitly. Verified on disk: exactly 10 command files, 9 agent files. Off-by-one corrected, and the frozen set is now enumerated rather than relying on a drifting count. |
| GC-4 | Blocker | RESOLVED | Boundary #4 now supplies a concrete three-part operational test: a gap is Blocker-grade "if and only if reasonable alternative resolutions would (a) change whether any Expectation's validation criteria pass, (b) risk crossing any Boundary, or (c) change the externally visible shape of any Deliverable." This test is repeated verbatim in Deliverable 2's "Gap classification test (verbatim in the agent prompt)," referenced by EXP-bbe6 edge case 2, EXP-9d63's severity field, and human-review #2. The classification is no longer self-referential. |
| GC-5 | Warning | RESOLVED | Deliverable 2 now specifies `color: orange` with rationale ("orange is the one standard color not used by any of the nine existing agents"). Verified: existing colors are yellow, magenta×2, green×2, blue, red, cyan×2 — orange is unused. Deterministic. |
| GC-6 | Warning | RESOLVED | Status transitions are now explicitly assigned to the COMMAND layer. Human-review #5 reads "confirm that the COMMAND layer (implement-spec.md) sets the Spec status... the implementing agent itself must not perform status transitions... the agent's system prompt does not instruct it to edit the Spec YAML's status field." Deliverable 2 frontmatter/protocol does not ask the agent to transition status. The coverage gap is closed and ownership is unambiguous. |
| GC-7 | Warning | RESOLVED | EXP-02f3 now requires "one row per Expectation edge case" and enumerates all six (EXP-bbe6 ec1/ec2, EXP-02f3 ec1/ec2, EXP-9d63 ec1/ec2), plus one row per Boundary and per Deliverable. Automated #5 now greps for all six edge-case identifiers (not just the three Expectation IDs), plus all eight Boundary entries and all three Deliverable entries. Table granularity and the gate now agree. |
| GC-8 | Warning | RESOLVED | EXP-9d63 validation now fixes the format: each gap entry is "a Markdown sub-list or table row with four named fields: gap_description, spec_location (block and field name), severity ('blocker-grade' or 'minor'...), and resolution." The structure is specified, not merely grep-matchable. |
| GC-9 | Warning | RESOLVED | Deliverable 1 now states the command allowed-tools as "Read Write Glob Grep Bash(mkdir *) Bash(ls *) Bash(git status *)" and adds: "the agent's own tool permissions are declared separately in the agent frontmatter... and are independent of this command-level allowed-tools list." The command/agent tool-scoping conflation is resolved, and the tool is `git status` (consistent with the GC-2 porcelain fix) rather than the round-1 `git diff`. review-spec.md's narrow list is no longer presented as a "copy verbatim then forbid additions" contradiction. |

**Cross-Spec consistency (8776 ↔ bc1c):** SPEC-bc1c's `execution_report_definition` claims it "must match SPEC-8776's execution report definition." Verified alignment: both use the **blocker-grade / minor** severity vocabulary for spec gaps (8776 EXP-9d63 line 173; bc1c Spec Gaps Encountered line 276). Both gap entries carry four equivalent fields — description/what-was-unclear, spec_location (block + field), severity, and a resolution-taken field. Section coverage matches (Boundary acknowledgment, self-verification table, spec-gaps section). **Minor non-blocking drift (not a regression):** field/section *labels* differ slightly — 8776 uses `gap_description`/`resolution` and the section "Boundaries Acknowledged"; bc1c uses `description`/`resolution_taken` and "Boundary Acknowledgment." These are the same concepts and the same severity vocabulary, so a retro reviewer parses both consistently; the divergence is cosmetic, not a contradiction. Flagged as a low-severity observation only.

**New issues introduced by the fixes:** None Blocker-grade. No new findings.
