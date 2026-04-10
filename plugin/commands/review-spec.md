---
description: Validate AI-generated output against a Spec's Expectations and Boundaries
argument-hint: [spec-id]
allowed-tools: "Read Write Glob Grep Bash(mkdir *) Bash(ls *)"
---

Available Specs:
!`ls docs/specs/*.yaml 2>/dev/null | head -20 || echo "No specs found. Run /idd-framework:write-spec first."`

Launch the `idd-spec-reviewer` agent to validate implementation against a Spec.

If `$ARGUMENTS` contains a spec ID (e.g., SPEC-001), pass it to the agent so it can load the correct Spec from `docs/specs/`.

If no spec ID is provided, the agent will list available Specs in `docs/specs/` and identify those in "in-progress" or "review" status.
