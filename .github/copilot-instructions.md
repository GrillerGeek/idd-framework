# GitHub Copilot Instructions — IDD Framework

This is a documentation-only repository for the Intent-Driven Development (IDD) framework. There is no application code, build system, or tests.

## IDD Workflow Knowledge

Read `AGENTS.md` at the repository root for the complete IDD artifact schemas, workflow phases, completeness checklist, and generation rules. That file is the canonical reference for all AI agents working with this framework.

## When Generating IDD Artifacts

- Use the YAML schemas defined in `AGENTS.md`
- Save artifacts to `docs/` subdirectories (products/, intentions/, expectations/, specs/, reviews/)
- Check existing artifact IDs before assigning new ones
- Every Expectation needs at least 2 edge cases
- Every Spec needs all 5 blocks: Context, Expectations, Boundaries, Deliverables, Validation
- Run the completeness checklist before marking a Spec as Ready

## When Editing Framework Documentation

- Use clear, practitioner-oriented language — audience is product owners and developers
- Be opinionated but grounded — IDD takes specific positions (flow over sprints, specs over stories)
- Tables use `|---|` separator style
- YAML templates include inline comments explaining each field
- The framework docs are licensed CC BY-SA 4.0
