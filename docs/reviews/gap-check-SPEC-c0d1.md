# Gap-Check Report: SPEC-c0d1 (Gap-Check Pipeline Stage)

**BLOCKED — 4 blockers, 5 warnings**

Precondition (completeness checklist) PASSES: all five blocks present; context stack/patterns/conventions/auth non-empty; each of EXP-b1ed/EXP-d3ae/EXP-89a0 has validation criteria and 2-3 edge cases; 10 Boundaries; 5 Deliverables; validation has 6 automated + 6 human-review items. The Spec is structurally complete, so content analysis proceeded.

All cited `existing_code_refs` exist on disk. Two of them, however, do not say what the Spec claims (see GC-1 and GC-2).

---

## GC-1 — Blocker — Context (existing_code_refs) + Deliverables (plugin.json) + Boundaries + Validation

**Quoted text (Deliverable 3):** "plugin/.claude-plugin/plugin.json — Updated to register the new command (gap-check) and agent (idd-gap-checker) entries."
**Quoted text (automated validation #5):** "Verify plugin/.claude-plugin/plugin.json registers both \"gap-check\" in the commands section and \"idd-gap-checker\" in the agents section."

**Why an implementer would have to guess:** The actual manifest (read in full, 24 lines) has no `commands` section and no `agents` section — it contains only `name`, `version`, `description`, `author`, `homepage`, `repository`, `license`, `keywords`, and `userConfig`. The existing `tech-review` command and `idd-tech-lead-reviewer` agent — which the Spec holds up as the patterns to imitate — are NOT registered in plugin.json; they are auto-discovered from `plugin/commands/` and `plugin/agents/`. An implementing agent told to "register both in the commands/agents section" will either (a) fabricate two new array sections that don't match this plugin's convention and that the rest of the plugin doesn't use, or (b) recognize the instruction is impossible and silently skip it — and then automated validation #5 can never pass because there is nothing structured to grep for. The Deliverable and a validation criterion both demand an action that the codebase shows is neither necessary nor conventional.

**Question for the Spec author:** Given that this plugin auto-discovers commands and agents from their directories and no existing command/agent is listed in plugin.json, what exactly should change in plugin.json — and if the answer is "nothing," should this Deliverable and automated validation item #5 be removed?

## GC-2 — Blocker — Context (existing_code_refs) vs Boundaries vs Validation (version hardcoding)

**Quoted text (existing_code_refs, tech-review.md note):** "The model directive paragraph style must be preserved verbatim (including the injunction not to downgrade or inherit and not to skip the parameter)."
**Quoted text (Boundary):** "Do not hardcode model version numbers in command or agent prose (e.g., 'Opus 4.7') — refer to model tiers version-agnostically ('current Opus generation')."

**Why an implementer would have to guess:** The model-directive paragraph in tech-review.md that the Spec says to "preserve verbatim" reads: "This subagent requires **Opus 4.7** for architectural feasibility reasoning..." It hardcodes the exact version string the Boundary and human_review item explicitly forbid. "Preserve verbatim" and "never hardcode a version number" cannot both be satisfied. An implementer copying the paragraph verbatim violates the Boundary; an implementer rewording it to be version-agnostic violates the "verbatim" instruction. Two reasonable agents will resolve this opposite ways.

**Question for the Spec author:** Should the gap-check command adapt the tech-review directive's structure and tone but substitute version-agnostic phrasing (overriding "verbatim"), and should "verbatim" be struck from the existing_code_refs note to remove the conflict?

## GC-3 — Blocker — Deliverables vs Expectations (EXP-d3ae) — annotation vs byte-for-byte immutability

**Quoted text (Deliverable 2, step 6):** "append a gap_check annotation to the Spec YAML (additive only)".
**Quoted text (EXP-d3ae validation, PASS condition A):** "verify the Spec YAML on disk is byte-for-byte identical before and after gate execution (diff produces no output)."
**Quoted text (automated validation #3):** "After running gap-check on a Blocker-level Spec, diff the Spec YAML before and after; diff must produce no output (byte-for-byte identical)."

**Why an implementer would have to guess:** The Deliverable instructs the agent to write a `gap_check` annotation into the Spec YAML. EXP-d3ae and automated validation #3 require the Spec YAML to be byte-for-byte identical before and after the run. Writing an annotation necessarily changes the bytes, so the diff cannot be empty. These directly contradict: an agent that appends the annotation fails validation #3; an agent that honors byte-for-byte immutability fails to produce Deliverable 2 step 6. It is also unclear whether "byte-for-byte identical" is scoped only to the Blocker case (agent halts before writing) while the annotation is written only in the clean/Warning case — the Spec never states this scoping, so the implementer must guess when the annotation is and isn't written.

**Question for the Spec author:** Under what exact conditions does the agent write the `gap_check` annotation, and how is that reconciled with the byte-for-byte-identical requirement — is the annotation written only when there are zero Blockers (agent halts and writes nothing on a Blocker), and if so should EXP-d3ae's validation say "no modification to the five content blocks" rather than "byte-for-byte identical"?

## GC-4 — Blocker — Expectations (EXP-89a0) / precondition checklist is partly unverifiable by an agent

**Quoted text (Deliverable 2, step 1):** "verify completeness checklist passes (read spec-reference.md; early-exit with \"completeness check required first\" if not)".
**Quoted text (Boundary / conventions):** "Completeness checklist is a precondition to gap-check; a Spec failing it must not be gap-checked".

**Why an implementer would have to guess:** The completeness checklist the agent is told to read and verify (spec-reference.md, 11 items) ends with item 11: "Spec has been peer-reviewed by at least one other person." That is a human social fact with no machine-detectable signal in the Spec YAML. An implementing agent told to "verify the completeness checklist passes" must decide whether item 11 is in scope. If it treats item 11 as a gate, every Spec fails the precondition (no agent can confirm a human peer-reviewed it) and gap-check can never run. If it silently ignores item 11, it is no longer verifying "the completeness checklist" as written. Two agents will draw the line in different places, producing a gate that either always blocks or quietly redefines its own precondition.

**Question for the Spec author:** Which checklist items constitute the machine-verifiable precondition the gate enforces — specifically, is the human peer-review item (#11) excluded from the agent's automated check, and should the Spec enumerate the exact subset the agent evaluates rather than pointing at the full 11-item list?

---

## GC-5 — Warning — Validation (EXP-b1ed PASS condition B) — "zero findings on a clean Spec" is an unfalsifiable acceptance bar for the fixture

**Quoted text (Deliverable 5):** "docs/specs/SPEC-test-clean.yaml ... must produce zero findings (Blockers or Warnings) when the gap-checker runs against it."
**Quoted text (EXP-b1ed validation, FAIL):** "clean fixture produces any finding at any severity level."

**Why this is reviewable-but-messy:** An adversarial gate whose whole purpose is to surface ambiguity that "two reasonable agents would resolve differently" is being asked to return exactly zero findings on a non-trivial hand-authored Spec. Any sufficiently aggressive adversarial reviewer can almost always find at least a Warning in real prose. The same agent run twice (Opus, effort high, temperature/nondeterminism) may emit a stray Warning once and not the next time, making the clean-fixture test flaky. The acceptance of "clean" is therefore partly a function of how the fixture is tuned to the gate rather than an independent quality bar, and a single spurious Warning fails the gate. This is acceptance-by-construction.

**Question for the Spec author:** Is "exactly zero findings" the right bar for the clean fixture, or should it be "zero Blockers and at most N low-confidence Warnings," and how should run-to-run nondeterminism in an Opus adversarial pass be accounted for so the test isn't flaky?

## GC-6 — Warning — Expectations (EXP-b1ed / EXP-89a0) — severity rules are partly prescribed and may collide with the agent's own judgment

**Quoted text (EXP-b1ed edge case 1):** "The gate must classify these as Blocker severity — not Warning."
**Quoted text (EXP-b1ed edge case 3):** "The gate must classify this as a Blocker ... rather than a Warning."

**Why this is reviewable-but-messy:** The Spec hardcodes the severity of three specific defect classes (filler edge cases, boundary/deliverable contradiction, unmeasurable validation criterion) as always-Blocker. But the taxonomy definition (conventions) is judgment-based: "Blocker (would cause wrong implementation) | Warning (would cause inconsistent implementation)." A real adversarial agent will sometimes encounter a borderline instance — e.g., a slightly-thin edge case that is reviewable-but-messy, not wrong-implementation-causing — and the per-instance judgment ("would this actually diverge implementations?") will conflict with the blanket "always Blocker for this category" rule. The implementing agent must decide whether category membership or case-by-case impact governs. This produces inconsistent reports across Specs.

**Question for the Spec author:** When a defect belongs to one of the three named always-Blocker categories but the agent judges its actual implementation impact to be Warning-level, which rule wins — the category override or the impact-based taxonomy definition?

## GC-7 — Warning — Validation (automated #1) — "severity: blocker" string format is asserted but the report schema is never defined

**Quoted text (automated validation #1):** "contains at least one line matching severity: blocker (case-insensitive) or \"## Blockers\" section with at least one entry."
**Quoted text (Deliverable 2, step 5):** "emit the finding report to docs/reviews/<spec-id>-gap-check.md".

**Why this is reviewable-but-messy:** The validation checks grep for either a `severity: blocker` line or a `## Blockers` heading, but no Deliverable or block actually specifies the report's Markdown schema — there is no canonical structure given (unlike deep-review-lead.md and spec-reviewer.md, which both embed a full report template). The implementer must invent the report format, and only afterward hope it happens to contain a string the grep matches. Two implementers will produce differently-structured reports (table vs. list vs. per-finding sections), and the human_review item "a human Spec author could act on each finding" cannot be evaluated against an undefined target. The Spec references deep-review-lead.md "for report format" but its own report fields (ID like GC-1, severity, block, quoted text, why-guess, resolving question) are richer than that template and never written down.

**Question for the Spec author:** What is the exact Markdown schema for the gap-check report (heading structure and the required per-finding fields), so the implementer doesn't invent it and the grep-based and readability validations have a defined target?

## GC-8 — Warning — Expectations (EXP-89a0 edge case 2) vs precondition early-exit — "identify which checklist items are missing" requires content the agent can't fully see

**Quoted text (EXP-89a0 edge case 2 / Spec edge case 2):** "reject the invocation with a clear, actionable message identifying which checklist items are missing".

**Why this is reviewable-but-messy:** The early-exit message is required to identify *which* checklist items are missing. For block-presence items the agent can detect this. But the checklist also contains "All Expectations have at least 2 edge cases" and "Validation block has at least one automated and one human review item" — these are content-counting checks that overlap with what the gap-check stage itself does, and item 11 (peer review, see GC-4) cannot be detected at all. The implementer must decide how granular the "missing items" message is and whether it reports on items it structurally cannot evaluate, leading to inconsistent early-exit messages.

**Question for the Spec author:** Which specific checklist items must the early-exit message enumerate as present/missing, and how should it handle items the agent cannot machine-verify (e.g., peer review)?

## GC-9 — Warning — Deliverables (SPEC-test-flawed) — fixture acceptance is partly circular / subjective

**Quoted text (Deliverable 4):** "contain at least three injected content defects ... This fixture must produce at least one Blocker when the gap-checker runs against it."
**Quoted text (human_review #6):** "confirm the three injected defects are genuinely ambiguous — not so obviously broken that a structural linter would catch them."

**Why this is reviewable-but-messy:** The flawed fixture's pass condition is defined by the behavior of the very agent under test (it must "produce at least one Blocker when the gap-checker runs against it"), and its quality bar ("genuinely ambiguous," "not so obviously broken") is a subjective human judgment with no objective threshold. An implementer can tune the fixture until the gate happens to flag it, which validates the pair-as-built rather than the gate's general capability. This is the classic test-written-to-pass risk; it is a Warning rather than a Blocker because the human_review item does ask a person to sanity-check the fixture's subtlety.

**Question for the Spec author:** What objective property makes an injected defect "genuinely ambiguous" rather than "obviously broken," so fixture quality is judged independently of whether this particular gate implementation happens to catch it?

---

## Findings index

| ID | Severity | One-line |
|----|----------|----------|
| GC-1 | Blocker | plugin.json has no commands/agents sections to register into; existing command/agent aren't registered there — Deliverable 3 and automated validation #5 ask for an impossible/non-conventional edit. |
| GC-2 | Blocker | "Preserve the model directive verbatim" conflicts with the Boundary forbidding hardcoded version numbers — the cited paragraph contains "Opus 4.7". |
| GC-3 | Blocker | Deliverable says append a `gap_check` annotation to the Spec YAML; EXP-d3ae + automated validation #3 require the Spec be byte-for-byte identical after the run. |
| GC-4 | Blocker | The completeness checklist the agent must verify includes item #11 (human peer review) which no agent can confirm — precondition is partly unverifiable and scope is unstated. |
| GC-5 | Warning | "Clean fixture must produce zero findings of any severity" is a flaky/unfalsifiable bar for an adversarial Opus pass. |
| GC-6 | Warning | Three defect classes are hardcoded as always-Blocker, conflicting with the impact-based Blocker/Warning taxonomy for borderline cases. |
| GC-7 | Warning | The gap-check report's Markdown schema is never defined, yet automated and human-review validations depend on its structure. |
| GC-8 | Warning | Early-exit "identify which checklist items are missing" requires reporting on items the agent can't fully evaluate (peer review, content counts). |
| GC-9 | Warning | Flawed-fixture acceptance is circular (defined by the agent under test) and "genuinely ambiguous" is a subjective bar. |

---

## Round 2 Verification

**Verdict: RESOLVED.** All four Blockers and all five Warnings are genuinely fixed in the current Spec text; no new Blocker-grade issues introduced. Repo facts re-verified on disk.

Per-finding status:

| ID | R1 Severity | R2 Status | Evidence the fix is genuine (not a reword) |
|----|-------------|-----------|--------------------------------------------|
| GC-1 | Blocker | RESOLVED | The plugin.json Deliverable is **removed** entirely (deliverables are now exactly five: gap-check.md, idd-gap-checker.md, report schema, SPEC-test-flawed, SPEC-test-clean — no plugin.json item). The old automated #5 (grep plugin.json for commands/agents sections) is gone; new automated #5 checks idd-gap-checker.md frontmatter instead. existing_code_refs note for plugin.json now states "Claude Code auto-discovers commands... and agents... there are no commands or agents arrays in this file and none should be added... This file does NOT need to be modified." Verified on disk: plugin.json keys are name/version/description/author/homepage/repository/license/keywords/userConfig — no commands or agents array. The impossible edit is gone. |
| GC-2 | Blocker | RESOLVED | The "preserve verbatim" injunction is struck. tech-review.md existing_code_refs note now reads "Imitate the STRUCTURE... Do NOT copy any prose verbatim from tech-review.md" and the command "must write its OWN dispatch directive with version-agnostic prose ('the current Opus generation' — never a hardcoded version string)." Deliverable 1 repeats "do not copy any prose verbatim from tech-review.md." The verbatim-vs-version-agnostic contradiction no longer exists. |
| GC-3 | Blocker | RESOLVED | EXP-d3ae rewritten into an explicit **two-layer design**: Layer (a) the agent is strictly report-only and the Spec must be byte-for-byte unchanged *by the agent run*; Layer (b) the command layer writes the additive gap_check annotation *after* the agent returns. Validation PASS condition A scopes byte-for-byte to "immediately after the agent returns, before the command layer writes the annotation," and explicitly states "this annotation write is expected and is not a violation." Automated #3 matches that scoping. Deliverable 2 step 5 and Deliverable 1 step 5 both assign the annotation write to the command layer only. The contradiction is fully reconciled and the scoping is now explicit, not left to the implementer. |
| GC-4 | Blocker | RESOLVED | A new convention states "Completeness checklist items 1–10 are the machine-verifiable precondition... item 11 (peer review)... is explicitly excluded from the agent's automated gate." EXP-89a0 description/validation, Deliverable 2 step 1, automated #4, and the existing_code_refs spec-reference.md note all consistently say "items 1–10" and exclude item 11. The precondition is now machine-verifiable and the scope is enumerated, not pointed at the full 11-item list. |
| GC-5 | Warning | RESOLVED | EXP-b1ed and Deliverable 5 now state "Warnings are not a hard failure"; FAIL is defined only as "flawed fixture produces no Blockers, OR clean fixture produces a Blocker." Each Warning is triaged. The flaky/unfalsifiable zero-of-any-severity bar is removed. |
| GC-6 | Warning | RESOLVED | The three edge cases no longer hardcode "always Blocker." They now read "the impact-based taxonomy supports this because the defect would cause divergent... implementations" and "this defect class is presumptively Blocker but final severity follows the impact-based judgment." Deliverable 2 step 4 echoes "presumptively Blocker but final severity follows the impact-based judgment." Category-vs-impact conflict is reconciled in favor of impact with a stated presumption. |
| GC-7 | Warning | RESOLVED | A dedicated Deliverable (docs/reviews/<spec-id>-gap-check.md) now defines the report Markdown schema: line-1 summary format plus per-finding fields (ID GC-n, severity, Spec block(s), exact quoted text, why-an-implementer-must-guess, resolving question), stated as "the definition of record; automated validation greps depend on it." Automated #1 and human-review #2 now have a defined target. |
| GC-8 | Warning | RESOLVED | EXP-89a0 edge case 2, validation PASS condition A, and Deliverable 2 step 1 all now scope the early-exit message to "the status of items 1–10 (present/missing for each)" and state "Item 11 (peer review) must not appear in the early-failure report." The agent is no longer asked to report on items it cannot evaluate. |
| GC-9 | Warning | RESOLVED | Deliverable 4 now requires a planted-defect manifest — "a top-level YAML comment block (or a dedicated planted_defects field) that enumerates each injected defect, names the defect class... and identifies the specific Spec block and field." Acceptance now maps each reported Blocker to a planted defect (or triages it as a genuine new find with reasoning). Human-review #6 retains the subtlety check. The circularity is mitigated by an objective defect-to-finding mapping. |

**Cross-Spec consistency (c0d1 ↔ 8776):** c0d1's gap-check report is `<spec-id>-gap-check.md` (command/agent layer split: agent report-only, command writes annotation); 8776's execution report is `[SPEC-ID]-[timestamp]-execution.md` (agent self-verifies and writes the report). The two report formats are distinct artifacts with no overlapping schema, so no collision. Both use the same severity intent (Blocker/blocker-grade for "would cause/​halt a wrong implementation"); no contradiction. c0d1's command-layer-writes-annotation vs agent-report-only division is internally consistent and does not conflict with 8776's command-layer-writes-status-transition division.

**New issues introduced by the fixes:** None Blocker-grade. No new findings.
