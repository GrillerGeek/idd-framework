---
description: Validate AI-generated output against a Spec's Expectations and Boundaries
argument-hint: [spec-id]
---

Initialize the IDD workspace by running the init script:

!`bash ${CLAUDE_PLUGIN_ROOT}/scripts/init-idd.sh`

Load and follow the orchestration workflow defined in `${CLAUDE_PLUGIN_ROOT}/skills/idd-orchestration/SKILL.md`.

Launch the `idd-spec-reviewer` agent to validate implementation against a Spec.

If `$ARGUMENTS` contains a spec ID (e.g., SPEC-001), pass it to the agent so it can load the correct Spec from `docs/specs/`.

If no spec ID is provided, the agent will list available Specs in `docs/specs/` and identify those in "in-progress" or "review" status.

The agent will:
1. Read the Spec and all linked Expectations
2. Examine the actual code/output produced
3. Validate each Expectation (including edge cases) against the implementation
4. Check for Boundary violations
5. Verify all Deliverables were produced
6. Run automated validation checks where possible
7. Produce a validation report
8. Save it to `docs/reviews/[spec-id]-review.md`
