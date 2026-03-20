# Frequently Asked Questions

---

### Is IDD a replacement for Agile?

IDD replaces specific agile *practices* (sprints, story points, velocity, the Epic–Feature–Story hierarchy) but preserves agile *values* — iterative delivery, working software, responding to change, and collaboration. Think of it as agile's next evolution for a world where AI changes the build equation.

### How is IDD different from Spec-Driven Development?

Spec-Driven Development (SDD) focuses on the **spec-to-code pipeline** — how to give AI agents better instructions. IDD extends this by providing **upstream layers** (Product, Intentions, Expectations) that determine *what* should be specified and *why*, plus a **process wrapper** (flow model, roles, ceremonies, metrics) that governs how work moves through a team. IDD is compatible with SDD tools like GitHub Spec Kit, Kiro, and Tessl.

### Do I need special tooling to use IDD?

No. You can start with Markdown files in a Git repo and a simple Kanban board. The templates in this repo are designed for that. Purpose-built tooling helps at scale but isn't required for a pilot.

### What if my team isn't using AI coding agents yet?

IDD's artifact hierarchy (Product → Intentions → Expectations) is valuable even without AI agents — it provides clearer requirements and better acceptance criteria than Epics/Features/Stories. The Spec layer becomes essential once you're using AI agents, but the upstream layers stand on their own.

### How do I estimate work without story points?

IDD uses **Complexity ratings** on Expectations (Low/Medium/High) as risk indicators, not effort estimates. Prioritization is driven by Intention priority and value, not estimated effort. Capacity is managed through WIP limits, not sprint commitment.

### What happens to Scrum Masters?

The Scrum Master role evolves. The facilitation skills remain valuable (running Spec Reviews, Flow Syncs, and Retros). The process enforcement role shifts toward ensuring spec quality and flow health. Some Scrum Masters may evolve into Spec Authors if they have the technical fluency.

### Can IDD work alongside existing Scrum teams?

Yes, during a transition. A team can adopt the IDD hierarchy (Product → Intentions → Expectations → Specs) while still working in sprints. Over time, as the team builds confidence, they can transition to continuous flow with WIP limits.

### How do I handle dependencies between Specs?

At the Intention level, dependencies are explicit (Intention A depends on Intention B). At the Spec level, the build order is managed through the Flow Board — a Spec that depends on another should not enter Ready until its dependency is in Done or near-Done. For MVP, this is managed manually; tooling can enforce it later.

### What about compliance and audit requirements?

IDD actually strengthens compliance posture. Every Spec has a defined author, a completeness checklist, a review gate, and a validation record. Phase transitions are logged with timestamps, users, and override reasons. This creates a more auditable trail than typical agile processes.

### Is the Spec Author a full-time role?

Not necessarily. On smaller teams, the Spec Author function can be shared among senior developers, BAs, or tech leads. The key is recognizing it as a *skill* that needs development, not assuming anyone can write a good Spec without practice.
