# Intent-Driven Development Framework

[![License: CC BY-SA 4.0](https://img.shields.io/badge/License-CC_BY--SA_4.0-lightgrey.svg)](LICENSE)
[![Framework](https://img.shields.io/badge/framework-v1.7-green.svg)](docs/framework.md)
[![Plugin](https://img.shields.io/badge/plugin-v1.7.1-blue.svg)](plugin/README.md)

**Turn an idea into a reviewed specification that developers and AI agents can build.**

Intent-Driven Development (IDD) is a planning and delivery framework with plugins
for **Codex and Claude Code**, plus portable Agent Skills. It guides you from a
stakeholder interview to linked Product, Intention, Expectation and Spec YAML
files in your project's `docs/` directory. Reviews check for missing decisions,
edge cases and unclear boundaries before implementation; validation checks the
result against the agreed outcome. You can also use the framework and templates
without installing a plugin.

**IDD works on its own. Guildhall is an optional companion, not a dependency.**

## Install

Install **IDD 1.7.1 from its published main branch**. Choose one route below for
your coding app. No source clone, contributor build or Guildhall installation is
required.

### Codex

Run in a terminal with the Codex CLI and Git installed:

```bash
codex plugin marketplace add GrillerGeek/idd-framework --ref main --json
codex plugin add idd-framework@idd-framework-local --json
```

Start a new Codex session in the project you want to work on. The catalog name
ends in `-local` for compatibility; these commands download from GitHub and do not
require a local clone.

### Claude Code

Run in a terminal from the project you want to work on, with Claude Code and Git installed:

```bash
claude plugin marketplace add https://github.com/GrillerGeek/idd-framework.git --scope project
claude plugin install idd-framework@idd-framework-local --scope project
```

Restart Claude Code in that project. These commands install the plugin for that
project using the catalog maintained in this repository.

### Alternative: `npx skills`

With **Node.js 22.20.0+**, npm and Git available, run this in your project:

```bash
npx skills@1.5.25 add GrillerGeek/idd-framework --skill idd-orchestration
```

The interactive installer lets you choose your coding app and installation scope.
Choose **project** to keep the skill with this project; choose **global** if you
want it available across projects. Version `1.5.25` is the tested installer pin,
not the IDD version.

**Start with `idd-orchestration`.** This single skill includes all fifteen IDD
workflow stages; you do not need to select or install each stage. Individual
stage skills remain available for users who want a narrower installation.

Standalone skills do not install Claude's native agents. After restarting your
app, ask it to use `idd-orchestration` to interview you about your product.
The `/idd-framework:*` examples below are native Claude plugin commands;
skill-only installs use the installed skill names instead.

Choose the native plugin or standalone skill route in a client to avoid duplicate
entry points. The [installation guide](docs/installation.md#standalone-skills)
covers explicit app selection, verification, updates and removal.

## Try it in your project

In **Codex**, start with:

```text
$idd-orchestration Interview me about a tool that helps volunteers schedule shifts.
```

In **Claude Code** with the native plugin:

```text
/idd-framework:interview I want to build a tool that helps volunteers schedule shifts.
```

Answer the interview questions to create a Product artifact. Continue through
Intentions, measurable Expectations and a Spec with explicit Boundaries. Review
the Spec and resolve gap-check findings before building. You can enter at a later
stage if those artifacts already exist.

Once a Spec is ready, has recorded human readiness approval and a current clean
gap-check, use IDD's implementation workflow or hand the Spec to your development
team. After building, review the implementation as a human and use IDD's
validation workflow. AI review does not replace human approval.

IDD helpers use Bash; YAML workflows need a safe parser. IDD's optional guarded
execution runner additionally requires Node.js **22.20.0+** and an authenticated
Claude terminal, even when planning from another app. See
[execution prerequisites](docs/installation.md).

## Optional: use with Guildhall

[Guildhall](https://github.com/GrillerGeek/guildhall) adds a team of independent
coding specialists for test-first implementation and reviews. Install it only if
you want that execution workflow; IDD's planning, review, implementation and
validation workflows can be used without it. Follow
[Guildhall's installation instructions](https://github.com/GrillerGeek/guildhall#install)
when you choose to add it.

Together, the workflow is **IDD to define and review → Guildhall to build and
review → IDD to validate**. With Guildhall installed and an IDD Spec ready for
execution, use the actual Spec ID generated in your project:

```text
# Codex
$guildhall-quest Implement SPEC-<your-id> using its boundaries and validation criteria.

# Claude Code native plugin
/guildhall:quest Implement SPEC-<your-id> using its boundaries and validation criteria.
```

Choose one execution owner for a Spec; do not start IDD's runner and Guildhall on
it simultaneously. Guildhall stops at `review`; human implementation approval
and QA govern the later lifecycle transitions.

## The Framework

Intent-Driven Development (IDD) replaces work-decomposition with purpose-decomposition. Instead of asking *"what should developers work on this sprint?"* IDD asks *"what does this product need to be, and how do we know it's right?"*

**The core principle:** The IDD hierarchy is not a chain of command — it's a **chain of context**. Each layer gives developers and AI agents the information they need to make implementation decisions independently, without waiting for someone above them to answer questions. When a developer understands *why* the product exists (Product), *what* it should accomplish (Intention), *how we'll know it's right* (Expectation), and *what's in and out of scope* (Spec with Boundaries), they can execute autonomously and make better decisions than any planning meeting could prescribe.

### The Hierarchy

```
Product          →  Why does this exist?
  └─ Intention   →  What should it accomplish?
      └─ Expectation  →  How do we know it's right?
          └─ Spec      →  How does AI build it?
```

| Level | Replaces | Purpose |
|-------|----------|---------|
| **Product** | Epic / Program | Define the problem space, vision, and value proposition |
| **Intention** | Feature | Describe what the product should accomplish |
| **Expectation** | Acceptance Criteria | Specify verifiable constraints with edge cases |
| **Spec** | User Story + Tasks | Provide AI-ready build instructions |

### Key Differences from Traditional Agile

- **Phase 0 (Chart + Resolve)** — efforts too foggy to interview get an Exploration map of decision tickets, resolved one per session until the way is clear.
- **Autonomy through context** — developers and AI agents get enough information to make decisions without waiting for clarification
- **Continuous flow** with WIP limits replaces time-boxed sprints
- **Spec quality** is the primary throughput metric, not velocity
- **Completeness gates** prevent underspecified work from reaching AI agents
- **An adversarial gap-check gate** simulates the implementing agent before execution — ambiguities, contradictions, and weak edge cases are found and fixed in the Spec before any code is written
- **Managed execution** — the implementing agent restates Boundaries before building, self-verifies against every Expectation and Deliverable, and files an Execution Report whose "spec gaps encountered" section feeds back into Spec quality
- **Boundaries** (what AI must *not* do) are a first-class artifact field
- **Context inheritance** eliminates repeated boilerplate across specs
- A new **Spec Author** role bridges business intent and AI execution

## Learn more

| Start here | What you will find |
|---|---|
| [Autonomy Through Context](docs/autonomy.md) | Why purpose and boundaries enable independent decisions |
| [Framework](docs/framework.md) | Workflow, lifecycle and the complete process |
| [Examples](examples/) | Worked artifacts and a [self-hosted case study](examples/self-hosted-v13.md) |
| [Templates](templates/) | YAML starters you can use without a plugin |
| [Spec Authoring](docs/spec-authoring.md) | How to write a buildable Spec |
| [Artifacts](docs/artifacts.md) | Field reference |
| [Adoption](docs/adoption.md), [Roles](docs/roles.md), [Metrics](docs/metrics.md) | Bringing IDD into a team |
| [Plugin reference](plugin/README.md) | Workflow entry points and detailed execution options |
| [FAQ](docs/faq.md) | Common questions |

## Relationship to Spec-Driven Development

IDD builds on Spec-Driven Development by adding the upstream context: why the
product exists, which outcomes matter and how a team decides that work is ready.
The Spec connects that context to implementation and validation. See the
[framework](docs/framework.md) for the full workflow and its relationship to other
AI development approaches.

## Influences and Acknowledgments

IDD draws on ideas from many sources in the evolving conversation about AI-assisted development:

- [Spec-Driven Development](https://github.com/github/spec-kit) (GitHub)
- [Kiro](https://kiro.dev/) (AWS) and the concept of "Intent Design"
- [Tessl](https://tessl.io/) and spec-as-source thinking
- [ThoughtWorks Future of Software Development Retreat](https://martinfowler.com/fragments/2026-02-18.html) (2026)
- The [DORA Report](https://dora.dev/) findings on AI as an amplifier
- [Intent Engineering](https://www.squer.io/blog/why-we-created-the-intent-engineer) (SQUER)
- Kanban, Lean, and flow-based delivery principles

## Contributing

Start with [CONTRIBUTING.md](CONTRIBUTING.md) and the
[shared contributor guide](docs/contributing-agents.md). Agent instructions live
in [AGENTS.md](AGENTS.md); Claude, Cursor and Copilot configurations extend it.
Contributor setup uses Node.js 22.20.0+, `npm ci`, `npm run build:skills`,
`npm run check` and `npm test`. These are development tools, not consumer setup.

## License

Framework documentation, templates and examples are
[CC BY-SA 4.0](LICENSE). Plugin contents are [Apache 2.0](plugin/LICENSE).

Intent-Driven Development was created by [Jason Robey](https://github.com/GrillerGeek).
