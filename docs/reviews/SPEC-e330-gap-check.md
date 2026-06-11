# Gap-Check Report — SPEC-e330

BLOCKED — 3 blockers, 4 warnings

> Note on the completeness precondition gate (charter Step 2): the Spec's top-level
> `status` is `draft`, not `ready`/`review`. The charter Step 1 says to load the Spec
> when an ID is supplied (it was), and the precondition gate evaluates items 1–10 of
> the completeness checklist — all 10 pass (stack ✓, patterns ✓, conventions ✓, auth ✓,
> 3 Expectations linked ✓, all have validation ✓, all have ≥2 edge cases ✓, boundaries ✓,
> deliverables ✓, validation has automated+human ✓). The adversarial content analysis
> therefore proceeded. The `draft` status itself is a process flag for the human/command
> layer, not a content defect, so it is not scored as a finding here.

All seven `existing_code_refs` were spot-checked against the live repository and are
factually accurate: `idd-gap-checker.md` does contain "### 3b — Cross-Block Contradiction
Analysis" immediately before "## Step 4" (the claimed insertion point); `gap-check.md`
takes a single optional `[spec-id]`; AGENTS.md has "### The Gap-Check Gate (Phase 6)";
framework.md's lifecycle table has the "**3. Gap-Check Gate**" row describing "ambiguity,
contradictions, and missing context"; faq.md has the gap-check entry; plugin.json is at
"1.3.0"; `examples/self-hosted-v13.md` exists with no v1.4 postscript yet. The Spec's own
automated validation greps are executable and their stated baselines hold (docs/*.md
tool-ref count is exactly 2; the plugin tier grep is empty). The findings below are
content-level ambiguities and one cross-block contradiction, not factual errors.

## GC-1

**Severity:** Blocker
**Spec block(s):** Deliverables, Expectations (EXP-5c33), Validation (automated)
**Quoted text:** "writes the portfolio Coverage section into a combined coverage report (docs/reviews/portfolio-coverage-<date>.md) while per-Spec reports keep their own single-Spec Coverage sections" (EXP-5c33 validation) — combined with EXP-5c33 edge case "Portfolio invocation with a single Spec: degrades to single-Spec analysis; no portfolio coverage report is created."
**Why an implementer must guess:** Two implementing agents will resolve the per-Spec-report filename for a multi-Spec run differently. The portfolio report path is `portfolio-coverage-<date>.md`, but the per-Spec reports are still written — and nothing in the Spec states their filename in portfolio mode. The base gap-checker schema (charter Step 5) hard-codes per-Spec reports to `docs/reviews/<spec-id>-gap-check.md`. Implementer A keeps `<spec-id>-gap-check.md` for each Spec plus one `portfolio-coverage-<date>.md`; implementer B, reading "combined coverage report," folds everything into `portfolio-coverage-<date>.md` and skips per-Spec files. The command layer's annotation step greps `docs/reviews/<spec-id>-gap-check.md` per Spec, so the two interpretations produce divergent, partially-broken automation. `<date>` format (ISO `YYYY-MM-DD` vs. other) is a secondary unresolved choice that compounds the divergence.
**Resolving question:** In a multi-Spec (portfolio) run, what exact filename does each per-Spec report use, what is the exact format of `<date>` in `portfolio-coverage-<date>.md`, and does the existing command-layer per-Spec `gap_check` annotation still expect to find `docs/reviews/<spec-id>-gap-check.md`?

## GC-2

**Severity:** Blocker
**Spec block(s):** Boundaries vs. Expectations/Deliverables (cross-block); Commands (gap-check.md)
**Quoted text:** Boundary: "Do not modify anything Forge-related, the templates/ directory, or artifact YAMLs under docs/ other than this Spec's own status transitions (owned by the command layer)" — vs. EXP-f6f2 validation: "Step 3c ... (2) search the repository for those terms (Grep/Glob); (3) for each file that matches but is not a Deliverable, emit a Coverage entry" and the new command form "the literal 'all' (= every Spec in 'ready' or 'review' status)".
**Why an implementer must guess:** The coverage sweep searches the *whole repository* for impact-surface files, but the Spec never bounds what counts as a candidate-omission target. Two implementers will scope the impact surface differently: one includes other Specs' YAMLs, `templates/`, and `examples/` (every file referencing a changed concept); another excludes artifact YAMLs and templates because a Boundary forbids *modifying* them — conflating "may not modify" with "may not report as an omission." Since coverage analysis of *this very Spec* would surface other artifact files referencing "gap-check"/"coverage," the in-vs-out decision changes which omissions are reported. The Spec states the Blocker-only path (validation-dependency) and that Boundaried files are "still listed... Warning," but it never defines the *outer boundary of the search space*, so the two agents emit materially different Coverage sections.
**Why an implementer must guess (cont.):** The contradiction is real: the report-only sweep ("emit a Coverage entry" for any matching file) reaches files the Boundaries forbid *touching*. The Spec's EXP-f6f2 deliberate-omission edge case resolves the touch question (list + cite Boundary, don't modify) but not the *scope* question (is `templates/`, are sibling YAMLs, part of the searched impact surface at all?).
**Resolving question:** What is the file-set scope of the impact-surface search — does it include `templates/`, sibling artifact YAMLs under `docs/`, and `examples/`, or only prose/code files an implementer could plausibly own — and is reporting (not modifying) a Boundaried or YAML file always permitted regardless of the modify-prohibition?

## GC-3

**Severity:** Blocker
**Spec block(s):** Expectations (EXP-f6f2 validation), Deliverables, Validation (human_review)
**Quoted text:** "(1) extract search terms from the Spec — deliverable file paths, concept names introduced or modified, renamed/replaced terms" and human_review item: "impact-surface derivation is described concretely enough that two implementing agents would search for the same kinds of terms."
**Why an implementer must guess:** "Concept names introduced or modified" has no extraction rule. Given a Spec, implementer A extracts only literal new identifiers (e.g., "Coverage", "Step 3c", "portfolio-coverage"); implementer B extracts every domain noun the Deliverables touch ("gap-check", "omission", "impact surface", "Deliverable"). The first yields a near-empty impact surface; the second yields dozens of matches across the repo. The Spec's own human_review item flags this exact risk ("the same kinds of terms") but the validation text it points to does not supply the disambiguating rule — it names the term categories without saying how to derive concrete search strings from a Spec's prose. Two agents implementing Step 3c will therefore write Step 3c instructions that produce divergent omission sets on the same input, which is precisely the divergence the gap-check doctrine exists to prevent.
**Resolving question:** What concrete procedure converts a Spec's Deliverables/Context into the literal search strings for the sweep — e.g., "use each Deliverable file's basename plus any back-ticked identifier and any quoted term in the Deliverables/Expectations text," versus a broader semantic extraction — so two agents derive the same term set?

## GC-4

**Severity:** Warning
**Spec block(s):** Expectations (EXP-5c33 edge case), Deliverables
**Quoted text:** "Two Specs list the same file as a Deliverable: reported as a CONFLICT finding (Warning) in the portfolio section — two owners risk concurrent-execution collisions; distinct from an omission."
**Why an implementer must guess:** The conflict finding's location and field schema are underspecified relative to the omission schema. The Spec defines Coverage-entry fields (file, evidence, suggested disposition, severity) for omissions, but a CONFLICT finding has different natural fields (file, the ≥2 owning Spec IDs, recommended sole owner). An implementer must invent the CONFLICT entry's fields and decide whether it lives inside `## Coverage` or a sibling `## Conflicts` heading. A conscientious implementer will likely reuse the Coverage schema, but two could format conflicts differently. Not Blocker because the divergence is presentational (both surface the same fact), not a wrong implementation of behavior.
**Resolving question:** What fields and what report heading does a portfolio CONFLICT finding use — the same `## Coverage` entry schema with a severity/type marker, or a separate section?

## GC-5

**Severity:** Warning
**Spec block(s):** Expectations (EXP-f6f2 validation), Deliverables
**Quoted text:** "for each file that matches but is not a Deliverable, emit a Coverage entry with fields: file, evidence (term + where it appears), suggested disposition."
**Why an implementer must guess:** "suggested disposition" is unconstrained free text. One implementer writes a controlled vocabulary (e.g., "add to this Spec" / "new Spec" / "intentional — cite Boundary" / "no action"); another writes a prose sentence per entry. The Deliverables line lists the entry fields as "file, evidence, suggested disposition, severity" — adding `severity` to the EXP-f6f2 set of three, a minor field-set mismatch between the two locations that an implementer must reconcile. Inconsistent but not divergent-wrong; a conscientious implementer resolves it sensibly, so Warning.
**Resolving question:** Is "suggested disposition" a free-text field or a fixed enumeration, and is the canonical Coverage-entry field list three fields (EXP-f6f2) or four including severity (Deliverables)?

## GC-6

**Severity:** Warning
**Spec block(s):** Context (conventions), Deliverables (examples/self-hosted-v13.md), Validation (automated)
**Quoted text:** Convention: "All content ADDED to docs/*.md must be tool-agnostic ... tool/model reference count in top-level docs/*.md must not increase (baseline 2, grandfathered)" — vs. Deliverable: "examples/self-hosted-v13.md — '## Postscript: v1.4' section."
**Why an implementer must guess:** The regression grep in the Spec's own validation targets `docs/*.md` (top-level only), but `examples/self-hosted-v13.md` is under `examples/`, not `docs/`, and the convention says "docs/*.md." The existing example file is written tool-agnostically and the human_review item asks the postscript to "stay tool-agnostic," yet no automated check covers `examples/`. An implementer could reasonably (a) hold the postscript to the same tool-agnostic bar manually, or (b) treat `examples/` as outside the regression scope and use looser language. The intent (tool-agnostic everywhere) is clear from human_review, so Warning, not Blocker — but the automated guardrail does not reach the file the Deliverable adds.
**Resolving question:** Should the tool-agnosticism regression check also cover `examples/self-hosted-v13.md`, or is the postscript's tool-agnosticism enforced by human review only?

## GC-7

**Severity:** Warning
**Spec block(s):** Deliverables, Validation (automated), Context (existing_code_refs — AGENTS.md)
**Quoted text:** existing_code_refs AGENTS.md note: "Append a short 'Coverage analysis' paragraph documenting: impact surface derivation, Warning-by-default severity, the validation-dependency Blocker rule, portfolio mode, and the mandatory (even when empty) Coverage report section." Automated check: "grep -i 'coverage' docs/framework.md AGENTS.md docs/faq.md plugin/commands/gap-check.md — each file returns ≥1 match."
**Why an implementer must guess:** The automated gate only requires one case-insensitive "coverage" match per file, but the AGENTS.md note enumerates five distinct sub-topics that must all appear. An implementer optimizing to the automated check could satisfy it with a single sentence and omit, say, the validation-dependency Blocker rule or portfolio mode; the five-part requirement lives only in a Context note, which is guidance, not a gated criterion. Two implementers produce AGENTS.md paragraphs of materially different completeness. Warning because the human_review items ("Coverage severity rules read as Warning-by-default with the single validation-dependency Blocker path") catch the most important omissions, but coverage of all five sub-topics is not mechanically gated.
**Resolving question:** Must the AGENTS.md paragraph demonstrably contain all five enumerated sub-topics (and should a validation check assert that), or is a single coverage mention plus human review sufficient?

---

## Round 2 Verification

**Verdict: RESOLVED** — all 3 Blockers and all 4 Warnings are genuinely closed in the current Spec text (not merely reworded). The Spec Author's edits added a concrete term-extraction rule, an explicit impact-surface scope, a four-field entry schema applied consistently across EXP-f6f2 / EXP-5c33 / Deliverables, a disposition enumeration, a portfolio-vs-per-Spec filename split, and an `examples/` regression check. No new contradictions were introduced.

### Per-finding status

**GC-1 — RESOLVED (Blocker).** EXP-5c33 validation now pins all three unknowns: per-Spec reports "KEEP the existing filename convention `<spec-id>-gap-check.md` exactly — the command layer's annotation logic depends on it"; the portfolio report is `docs/reviews/portfolio-coverage-YYYY-MM-DD.md` with an explicit ISO-date format and a `-2, -3...` collision suffix; and the per-Spec annotation behavior is stated to be unchanged. Two implementers can no longer diverge on per-Spec filenames, date format, or annotation lookup path.

**GC-2 — RESOLVED (Blocker).** EXP-f6f2 now defines IMPACT-SURFACE SCOPE explicitly: "all repository text files EXCEPT the artifact YAML trees (docs/products/, docs/intentions/, docs/expectations/, docs/specs/, docs/reviews/) ... templates/ and examples/ ARE in scope." The report-vs-modify contradiction is resolved verbatim: "Listing a file in a Coverage entry is ALWAYS permitted regardless of Boundaries — coverage entries are report content, not modifications; Boundaries govern edits, not mentions." The outer boundary of the search space and the in-vs-out reporting rule are both now deterministic.

**GC-3 — RESOLVED (Blocker).** The previously-undefined "concept names introduced or modified" is replaced by a concrete three-part extraction rule: (a) basename of every Deliverable file path, (b) every section heading / field name / command-stage name / concept term a Deliverable's description states it adds-renames-removes (the quoted or capitalized names in the deliverable text), (c) any term an Expectation explicitly names as introduced or changed. This converts prose to literal search strings the same way for both agents; the human_review item ("same kinds of terms") is now backed by a derivation rule.

**GC-4 — RESOLVED (Warning).** EXP-5c33 now states CONFLICT findings "use the same four entry fields as omissions — file, evidence (naming both owning Specs), severity (Warning), suggested disposition — and appear only in the portfolio Coverage section." Both the field schema and the report location are fixed.

**GC-5 — RESOLVED (Warning).** EXP-f6f2 now specifies "EXACTLY four fields: file, evidence ..., severity, suggested disposition" and a disposition enumeration ("one of: add-to-deliverables, assign-to-<spec-id>, or accept-omission (with stated reason)"). The earlier three-vs-four field mismatch is gone: EXP-f6f2, EXP-5c33, and the Deliverables line all now list the identical four fields (file, evidence, severity, suggested disposition).

**GC-6 — RESOLVED (Warning).** A new automated check covers the previously-ungated file: "grep -iE 'claude|sonnet|haiku|opus|/idd-framework' examples/self-hosted-v13.md returns zero matches." The `examples/` postscript's tool-agnosticism is now mechanically gated, not human-review-only.

**GC-7 — RESOLVED (Warning), with residual note.** The automated gate was strengthened from a single case-insensitive "coverage" match to a substantive multi-term assertion: `grep -i 'impact surface'` ≥1 AND `grep -i 'portfolio'` ≥1 AND a Warning-by-default mention in the gap-check section. This now mechanically gates 3 of the 5 enumerated AGENTS.md sub-topics. The remaining two (the validation-dependency Blocker rule and the mandatory-even-when-empty Coverage section) are still asserted only via the Context note plus the human_review item "Coverage severity rules read as Warning-by-default with the single validation-dependency Blocker path." For a Warning this is acceptable closure — the most divergence-prone sub-topics are now gated and the rest are human-reviewed — but the gate is narrowing, not exhaustive.

### New-contradiction checks (per the Round-2 mandate)

- **Impact-surface scope vs. Boundaries:** No contradiction. The Boundary forbids *modifying* `templates/` and artifact YAMLs; EXP-f6f2 places `templates/` and `examples/` IN the *search* scope while excluding the artifact-YAML trees, and the explicit "Boundaries govern edits, not mentions" clause reconciles a Boundaried-but-in-scope file being *listed*. The EXP-f6f2 Boundary edge case (list + cite Boundary + Warning) is consistent with this split.
- **Self-referential sweep:** `docs/reviews/` is excluded from the search space, so the sweep cannot recursively flag its own output reports. Clean.
- **Four-field entry schema consistency:** Verified identical across EXP-f6f2 (line ~108), EXP-5c33 CONFLICT findings (line ~142), and Deliverables (line ~185): file, evidence, severity, suggested disposition. No drift.
- **Blocker-path consistency:** Boundary "the only Blocker path is the validation-dependency rule in EXP-f6f2" matches EXP-f6f2's stated rule ("Blocker only when an Expectation's validation criteria depend on a file no Deliverable owns"). Consistent.

No new Blockers or Warnings introduced. The Spec is ready to proceed.
