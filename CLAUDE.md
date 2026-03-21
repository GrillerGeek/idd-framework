# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Repository Is

This is the **Intent-Driven Development (IDD) Framework** — a process framework (documentation, not software) for teams building software with AI coding agents. It replaces traditional agile's Epic-Feature-Story hierarchy with a purpose-oriented model: **Product → Intention → Expectation → Spec**.

There is no application code, no build system, no tests, and no dependencies. The repo consists entirely of Markdown docs, YAML templates, worked examples, and a Claude Code plugin.

IDD builds on the Spec-Driven Development (SDD) movement but provides the **upstream layers** — what to spec and why — plus the process wrapper for how specs flow through a team. It is compatible with SDD tools like GitHub Spec Kit, Kiro, and Tessl.

**For the complete IDD artifact schemas, workflow phases, and generation rules, read `AGENTS.md`.** That file is the universal reference for all AI coding agents. This file (CLAUDE.md) covers Claude Code-specific context: repo structure, plugin docs, and editing conventions.

## Repository Structure

- `docs/autonomy.md` — Core philosophy: how the hierarchy enables developer autonomy (read this first)
- `docs/framework.md` — Complete process definition (the canonical reference)
- `docs/artifacts.md` — Field-level definitions for Product, Intention, Expectation, Spec
- `docs/spec-authoring.md` — How to write AI-ready Specs (schema, five blocks, completeness checklist)
- `docs/roles.md` — Role definitions (Product Owner, Spec Author, Tech Lead, Developer, AI Agent, Reviewer)
- `docs/metrics.md` — Primary/secondary metrics and anti-patterns
- `docs/adoption.md` — Phased adoption guide (Pilot → Refine → Expand → Standardize)
- `docs/faq.md` — Common objections and answers
- `examples/` — Worked examples using the full hierarchy
- `templates/` — YAML starter templates for each artifact type

## Claude Code Plugin

The `plugin/` directory contains a Claude Code plugin that automates the IDD workflow. It is a separate distributable component (Apache 2.0 licensed) with its own manifest at `plugin/.claude-plugin/plugin.json`.

### Commands (invoke via `/idd:*`)

| Command | Purpose | Output |
|---------|---------|--------|
| `/idd:interview` | Stakeholder interview → Product definition | `docs/products/` |
| `/idd:define-intentions` | Decompose Product into outcomes | `docs/intentions/` |
| `/idd:define-expectations` | Define verifiable constraints + edge cases | `docs/expectations/` |
| `/idd:write-spec` | Create AI-ready Spec with all 5 blocks | `docs/specs/` |
| `/idd:tech-review` | Architectural feasibility review | Review annotations |
| `/idd:review-spec` | Validate AI output against Spec criteria | `docs/reviews/` |

### Agents (in `plugin/agents/`)

Each agent maps to an IDD role: product-interviewer, intention-author, expectation-author, spec-author, tech-lead-reviewer, spec-reviewer. Commands dispatch to these agents.

### Skills and References

`plugin/skills/idd-orchestration/` contains the orchestration skill (SKILL.md) and reference templates that agents use to generate artifacts. These templates mirror but are distinct from the top-level `templates/` directory — the skill references are Markdown-formatted for agent consumption, while top-level templates are YAML for human use.

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
- **Autonomy through context** — the hierarchy is a context delivery system, not a management structure (see `docs/autonomy.md`).

## Artifact Hierarchy and IDs

```
Product (PROD-xxx)  →  Why does this exist?
  └─ Intention (INT-xxx)  →  What should it accomplish?
      └─ Expectation (EXP-xxx)  →  How do we know it's right?
          └─ Spec (SPEC-xxx)  →  How does AI build it?
```

## Spec Five-Block Structure

Every Spec must contain: **Context** (stack, patterns, conventions, auth, code refs), **Expectations** (with validation criteria + edge cases), **Boundaries** (explicit prohibitions), **Deliverables** (concrete outputs), **Validation** (automated + human review).

## Versioning

The repo uses semver git tags. The plugin version in `plugin/.claude-plugin/plugin.json` shares the same major.minor as the spec version, with patch reserved for plugin-only iterations:

- **Spec version** = major.minor (e.g., v1.1). Tagged on the repo when framework docs change.
- **Plugin version** = major.minor.patch (e.g., 1.1.0, 1.1.1, 1.1.2). Patch increments for plugin-only changes.
- When the spec bumps (e.g., v1.1 → v1.2), the plugin resets to `1.2.0`.

## Writing and Editing Conventions

- Use clear, practitioner-oriented language. Audience is product owners and developers, not process consultants.
- Be opinionated but grounded. IDD takes specific positions (flow over sprints, specs over stories) — don't dilute them.
- Tables use `|---|` separator style consistently throughout.
- YAML templates include inline comments explaining each field.
- Worked examples in `examples/` should demonstrate the full hierarchy from Product through Spec.
- The framework docs are licensed CC BY-SA 4.0. The plugin is licensed Apache 2.0.
