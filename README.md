# Intent-Driven Development Framework

**A process framework for teams building software with AI coding agents.**

---

## The Problem

Traditional agile methodologies — sprints, story points, backlogs — were designed for a world where human coding capacity was the primary constraint. AI coding agents have changed that equation. When the build phase compresses 5–10x, the bottleneck shifts from *building* to *defining, reviewing, and validating*.

The frameworks haven't caught up. Teams are using 2-week sprints to manage work that takes 2 hours to build. They're estimating story points for tasks where effort is no longer the dominant variable. They're holding planning meetings to decompose work that AI agents can execute from a well-written specification.

## The Framework

Intent-Driven Development (IDD) replaces work-decomposition with purpose-decomposition. Instead of asking *"what should developers work on this sprint?"* IDD asks *"what does this product need to be, and how do we know it's right?"*

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

- **Continuous flow** with WIP limits replaces time-boxed sprints
- **Spec quality** is the primary throughput metric, not velocity
- **Completeness gates** prevent underspecified work from reaching AI agents
- **Boundaries** (what AI must *not* do) are a first-class artifact field
- **Context inheritance** eliminates repeated boilerplate across specs
- A new **Spec Author** role bridges business intent and AI execution

## Quick Start

1. **Read the framework** → [`docs/framework.md`](docs/framework.md) — the complete process definition
2. **See it in action** → [`examples/`](examples/) — a worked example using the full hierarchy
3. **Use the templates** → [`templates/`](templates/) — copy-paste starter templates for each artifact
4. **Understand the roles** → [`docs/roles.md`](docs/roles.md)
5. **Set up metrics** → [`docs/metrics.md`](docs/metrics.md)

## Documentation

| Document | Description |
|----------|-------------|
| [Framework](docs/framework.md) | Complete process definition — artifacts, lifecycle, ceremonies |
| [Artifacts](docs/artifacts.md) | Detailed definitions and field reference for Product, Intention, Expectation, and Spec |
| [Spec Authoring Guide](docs/spec-authoring.md) | How to write AI-ready Specs — with do's, don'ts, and the completeness checklist |
| [Roles](docs/roles.md) | Role definitions and responsibilities in IDD |
| [Metrics](docs/metrics.md) | Primary and secondary metrics for measuring process health |
| [Adoption Guide](docs/adoption.md) | How to pilot IDD with your team |
| [FAQ](docs/faq.md) | Common questions and concerns |

## Relationship to Spec-Driven Development

IDD builds on the [Spec-Driven Development](https://github.com/github/spec-kit) movement but extends it in a specific direction. Where SDD focuses on the spec-to-code pipeline (how to give AI agents better instructions), IDD provides the **upstream layers** that answer *what* should be specified and *why*, along with the **process wrapper** that governs how specs flow through a team.

Think of it this way:
- **SDD** answers: "How do I write a good spec for an AI agent?"
- **IDD** answers: "How does my team decide what to spec, ensure it's complete, track it through delivery, and measure whether the process is working?"

IDD is compatible with SDD tools like GitHub Spec Kit, Kiro, Tessl, and others. The Spec artifact in IDD is designed to export in formats these tools can consume.

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

We welcome contributions. See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

This framework is early and evolving. If you're experimenting with AI-assisted development processes, we'd love to hear what's working and what isn't. Open an issue, start a discussion, or submit a PR.

## License

This work is licensed under [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/). You are free to share and adapt this material for any purpose **except commercial**, as long as you give appropriate credit and distribute contributions under the same license.

---

*Intent-Driven Development was created by [Jason Robey](https://github.com/jasonrobey), motivated by the belief that when AI changes how we build, we need to change how we plan, organize, and measure.*
