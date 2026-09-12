BLOCKED — 1 blockers, 23 warnings

Completeness items 1–10 pass. This is an authoring-phase review of the selected draft Spec; human peer review is not inferred or scored. Counts include one content Blocker and 23 coverage candidate Warnings. The coverage suggestions are proposed dispositions for the Spec Author, not decisions made by the reviewer.

## GC-1

**Severity:** Blocker

**Spec block(s):** Expectations (EXP-37d5), implementation_contract.gap_check, implementation_contract.execution

**Quoted text:** "Otherwise the reviewer writes the current report at docs/reviews/<SPEC-ID>-gap-check.md; orchestration upserts one annotation using that invocation's result, never a leftover report."

**Why an implementer must guess:** The contract defines invalidation when completeness fails, but gives no state/evidence disposition when completeness passes and the reviewer then fails, is interrupted, returns no report, or produces a malformed report. An implementation can obey "never a leftover report" by declining to update the annotation, leaving the earlier `passed` annotation and PASS report executable by the next implementation invocation. Another implementation invalidates the previous annotation before dispatch or on the unsuccessful result. These differ on EXP-37d5's requirement that unsuccessful invocations cannot authorize builds from stale evidence. This is a substantive failure-policy choice affecting the execution gate, not a formatting preference or a demand for automatic detection of manual edits.

**Resolving question:** When a gap-check invocation passes completeness but fails or is interrupted before returning a valid current result, what must happen to any previous annotation and report, what annotation shape/counts should represent that outcome, and when should invalidation occur so a later implementation invocation cannot consume the earlier success?

## Coverage

Method: searched repository text, including hidden contributor configuration, templates and examples, excluding `.git/` and the five artifact/review trees. Terms included Deliverable basenames and the explicitly affected concepts `gap_check`, lifecycle, strict gate, exploration, archival, and human peer review. The execution-report filename is a generated Deliverable pattern. No portfolio is implied.

- **file:** .github/pull_request_template.md
  **evidence:** CLAUDE.md — line 15 directs contributors to its "Key Concepts to Preserve" section, which the contributor-guidance extraction can remove or relocate.
  **severity:** Warning
  **suggested disposition:** add-to-deliverables

- **file:** .github/ISSUE_TEMPLATE/bug_report.yml
  **evidence:** spec-authoring.md — line 25 uses the documentation path as a bug-location example.
  **severity:** Warning
  **suggested disposition:** accept-omission (the path remains valid; no workflow assertion changes)

- **file:** docs/adoption.md
  **evidence:** framework.md — line 17 links the gap-check process; line 109 says the gate proves the input was ready.
  **severity:** Warning
  **suggested disposition:** add-to-deliverables

- **file:** docs/plans/2026-09-12-codex-skills-migration.md
  **evidence:** AGENTS.md, CLAUDE.md and contributing-agents.md — lines 19 and 32–33 describe this milestone's shared-guidance changes.
  **severity:** Warning
  **suggested disposition:** accept-omission (the proposed plan already separates future work from current capabilities)

- **file:** docs/superpowers/plans/2026-07-28-exploration-phase-0.md
  **evidence:** spec-reference.md — lines 580 and 597 describe exploration metadata changes; SKILL.md and README.md are also referenced.
  **severity:** Warning
  **suggested disposition:** accept-omission (Boundary 2 explicitly preserves this historical plan)

- **file:** examples/self-hosted-v13.md
  **evidence:** onboarding-portal.md and gap_check — lines 7 and 59 reference the worked example and historical gate annotation.
  **severity:** Warning
  **suggested disposition:** accept-omission (EXP-4720 explicitly preserves the historical v1.3 case study; its evidence is not a current execution authorization)

- **file:** plugin/agents/spec-author.md
  **evidence:** spec-reference.md — lines 50 and 57 load the schema and completeness checklist.
  **severity:** Warning
  **suggested disposition:** accept-omission (the author consumes the owned reference and recommends technical review; it does not itself grant execution permission)

- **file:** plugin/agents/quick-spec-author.md
  **evidence:** spec-reference.md — line 69 loads the schema and checklist for accelerated authoring.
  **severity:** Warning
  **suggested disposition:** accept-omission (the author consumes the updated reference and recommends technical review without overriding the gate)

- **file:** plugin/agents/intention-author.md
  **evidence:** exploration — line 60 copies optional exploration lineage when authoring an Intention.
  **severity:** Warning
  **suggested disposition:** accept-omission (discovery documentation changes do not change lineage semantics)

- **file:** plugin/agents/product-interviewer.md
  **evidence:** exploration — line 73 preserves originating exploration lineage on the Product.
  **severity:** Warning
  **suggested disposition:** accept-omission (the existing lineage behavior needs no modification for contributor discovery)

- **file:** plugin/agents/exploration-charter.md
  **evidence:** exploration — frontmatter and workflow describe the existing Exploration charter role.
  **severity:** Warning
  **suggested disposition:** accept-omission (milestone 1 documents existing exploration discovery; it does not change charter behavior)

- **file:** plugin/agents/exploration-resolver.md
  **evidence:** exploration — frontmatter and workflow describe ticket resolution.
  **severity:** Warning
  **suggested disposition:** accept-omission (portable exploration execution belongs to a later milestone)

- **file:** plugin/agents/idd-archivist.md
  **evidence:** explorations and lifecycle — line 54 classifies Exploration terminal states, and subsequent ledger construction records final status.
  **severity:** Warning
  **suggested disposition:** accept-omission (this milestone changes discovery guidance and retains existing lifecycle state values)

- **file:** plugin/commands/chart.md
  **evidence:** exploration — lines 7–12 discover Exploration directories and dispatch the charter role.
  **severity:** Warning
  **suggested disposition:** accept-omission (the command remains an existing discoverable entry point without behavior changes)

- **file:** plugin/commands/resolve.md
  **evidence:** exploration — lines 8–17 discover maps and propagate resolved exploration context.
  **severity:** Warning
  **suggested disposition:** accept-omission (resolution portability is outside this milestone)

- **file:** plugin/commands/archive.md
  **evidence:** lifecycle — line 47 prohibits the nonexistent `archived` lifecycle value; line 41 handles directory archival.
  **severity:** Warning
  **suggested disposition:** accept-omission (the proposed contract preserves lifecycle values and does not change archive apply behavior)

- **file:** plugin/bin/idd-next-id
  **evidence:** exploration — lines 4–5 and 22 describe and map the Exploration ID type.
  **severity:** Warning
  **suggested disposition:** accept-omission (Boundary 3 explicitly prohibits helper changes; existing support is documented without modification)

- **file:** plugin/bin/idd-archive-scan
  **evidence:** gap_check and lifecycle — lines 54–55 explain selecting the artifact's own status before later annotations.
  **severity:** Warning
  **suggested disposition:** accept-omission (Boundary 3 preserves this helper; upserting an annotation does not change the top-level lifecycle field it reads)

- **file:** plugin/skills/idd-orchestration/references/expectation-template.md
  **evidence:** lifecycle — line 33 describes the Expectation status field.
  **severity:** Warning
  **suggested disposition:** accept-omission (the milestone changes Spec lifecycle ownership, not Expectation state values)

- **file:** plugin/skills/idd-orchestration/references/intention-template.md
  **evidence:** exploration and lifecycle — lines 18 and 33–34 describe lineage and Intention status.
  **severity:** Warning
  **suggested disposition:** accept-omission (Intention lineage and state values are unchanged)

- **file:** plugin/skills/idd-orchestration/references/product-template.md
  **evidence:** exploration — lines 13 and 49 document optional originating Exploration metadata.
  **severity:** Warning
  **suggested disposition:** accept-omission (existing Product lineage is being made discoverable, not redefined)

- **file:** plugin/skills/idd-orchestration/references/exploration-template.md
  **evidence:** exploration — lines 7–23 define the directory layout and map metadata.
  **severity:** Warning
  **suggested disposition:** accept-omission (the existing reference supplies the layout for new discovery guidance)

- **file:** plugin/skills/idd-orchestration/references/ledger-reference.md
  **evidence:** lifecycle — line 10 prohibits `archived`; line 33 documents final_status; line 40 references a per-Spec gap-check report.
  **severity:** Warning
  **suggested disposition:** accept-omission (archival consumes unchanged terminal state values and stores historical report paths rather than authorizing execution)
