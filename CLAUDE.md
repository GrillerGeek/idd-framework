# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Repository Is

This is the **Intent-Driven Development (IDD) Framework** — a process framework (documentation, not software) for teams building software with AI coding agents. It replaces traditional agile's Epic-Feature-Story hierarchy with a purpose-oriented model: **Product → Intention → Expectation → Spec**.

There is no application code, no build system, no tests, and no dependencies. The repo consists entirely of Markdown docs, YAML templates, and worked examples.

## Repository Structure

- `docs/framework.md` — Complete process definition (the canonical reference)
- `docs/artifacts.md` — Field-level definitions for Product, Intention, Expectation, Spec
- `docs/spec-authoring.md` — How to write AI-ready Specs (schema, five blocks, completeness checklist)
- `docs/roles.md` — Role definitions (Product Owner, Spec Author, Tech Lead, Developer, AI Agent, Reviewer)
- `docs/metrics.md` — Primary/secondary metrics and anti-patterns
- `docs/adoption.md` — Phased adoption guide (Pilot → Refine → Expand → Standardize)
- `docs/faq.md` — Common objections and answers
- `examples/` — Worked examples using the full hierarchy
- `templates/` — YAML starter templates for each artifact type

## Key Concepts to Preserve

When editing this repo, maintain these foundational positions:

- **Purpose-decomposition over work-decomposition.** The hierarchy decomposes *why*, not *what to build*.
- **Continuous flow with WIP limits** replaces time-boxed sprints. No story points, no velocity.
- **The Spec is the unit of work.** It has five required blocks: Context, Expectations, Boundaries, Deliverables, Validation.
- **Boundaries are first-class.** Every Spec must explicitly state what the AI must NOT do.
- **Edge cases are mandatory.** Minimum 2 per Expectation — this is where quality lives.
- **Context inheritance.** Context is defined at the Product level and inherited/overridden by child Specs.
- **Spec Author is a new role** — hybrid of business analyst and senior developer.
- **The completeness checklist** gates Specs from Draft to Ready (see `docs/spec-authoring.md`).

## Artifact Hierarchy and IDs

```
Product (PROD-xxx)  →  Why does this exist?
  └─ Intention (INT-xxx)  →  What should it accomplish?
      └─ Expectation (EXP-xxx)  →  How do we know it's right?
          └─ Spec (SPEC-xxx)  →  How does AI build it?
```

## Spec Five-Block Structure

Every Spec must contain: **Context** (stack, patterns, conventions, auth, code refs), **Expectations** (with validation criteria + edge cases), **Boundaries** (explicit prohibitions), **Deliverables** (concrete outputs), **Validation** (automated + human review).

## Writing and Editing Conventions

- Use clear, practitioner-oriented language. Audience is product owners and developers, not process consultants.
- Be opinionated but grounded. IDD takes specific positions (flow over sprints, specs over stories) — don't dilute them.
- Tables use `|---|` separator style consistently throughout.
- YAML templates include inline comments explaining each field.
- Worked examples in `examples/` should demonstrate the full hierarchy from Product through Spec.
- The framework is licensed CC BY-NC-SA 4.0 (NonCommercial).
