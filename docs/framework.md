# Intent-Driven Development Framework

> See repository tags for the current version. This document is the canonical process reference.

## 1. Executive Summary

Traditional agile methodologies were designed for a world where human coding capacity was the primary bottleneck in software delivery. Sprint cadences, story point estimation, and ceremony-driven workflows all optimize around the assumption that building software is slow, incremental, and labor-intensive.

AI-assisted development has fundamentally changed this equation. When AI coding agents can produce working code in minutes rather than days, the bottleneck shifts from building to defining, reviewing, and validating. The process must shift with it.

But speed is only half the story. The deeper problem is **decision bottlenecks**. In most agile teams, context lives in the Product Owner's head. Developers wait for clarification. AI agents guess when context is missing. Every vague user story creates a dependency on a conversation that may or may not happen at the right time.

Intent-Driven Development (IDD) is a process framework purpose-built for teams using AI coding agents. It replaces the traditional Epic–Feature–Story hierarchy with a purpose-oriented model: **Product, Intentions, Expectations, and Specs**. The hierarchy is not a chain of command — it's a **chain of context**. Each layer gives developers and AI agents the information they need to make implementation decisions independently, without waiting for someone above them to answer questions.

IDD redefines team roles, ceremonies, metrics, and governance to align with two realities: specification quality is the primary constraint on delivery throughput, and developer autonomy scales only as far as the context available to them.

### Core Thesis

> When AI compresses the build phase 5–10x, the value of the process shifts from managing *what to build next* to giving developers and AI agents enough context to execute autonomously — so they make the right decisions without waiting for permission.

---

## 2. Why Traditional Agile Falls Short

### Assumptions That Have Changed

| Traditional Assumption | AI-Assisted Reality | Process Impact |
|---|---|---|
| Coding is the primary bottleneck | AI agents generate code in minutes | Sprint capacity planning becomes irrelevant |
| Stories take 3–5 days to build | Same scope can be drafted in hours | Story sizing loses meaning |
| Story points approximate effort | Dev time is no longer the dominant variable | Velocity metrics break down |
| Code review is incremental | Large volumes of generated code arrive in bursts | Review becomes the new bottleneck |
| Testing follows building | AI generates tests simultaneously | Test quality validation is the concern |
| Refinement feeds the next sprint | Spec quality is the throughput constraint | Refinement must become spec authoring |

### The Four New Bottlenecks

1. **Specification Quality.** Vague requirements that a developer could interpret through context produce incorrect output at machine speed. A poorly defined story that took 3 days to muddle through now generates wrong code in 20 minutes.

2. **Review and Validation Capacity.** Humans must still understand, review, and approve AI output. This is now the pacing function.

3. **Integration and Architectural Coherence.** AI agents build components rapidly, but ensuring they fit together and follow patterns requires deliberate governance.

4. **Decision Latency.** When building is fast, waiting two weeks to re-prioritize is waste.

---

## 3. The Artifact Hierarchy

IDD replaces work-decomposition with purpose-decomposition. The hierarchy is a **context delivery system** — each layer answers a question that developers and AI agents would otherwise have to ask someone or guess at.

```
Product          →  "Here's why this exists and who it's for."
  └─ Intention   →  "Here's what we're trying to accomplish and why it matters."
      └─ Expectation  →  "Here's how we'll know it's right, including the edge cases."
          └─ Spec      →  "Here's everything you need to build it."
```

| Level | Traditional Equivalent | Purpose | Autonomy It Enables |
|---|---|---|---|
| **Product** | Epic / Program | Define the problem space, vision, and value proposition | Developer can answer "why are we building this?" without asking |
| **Intention** | Feature | Describe what the product should accomplish | Developer can judge whether an implementation decision aligns with the goal |
| **Expectation** | Acceptance Criteria | Specify verifiable constraints and validations | Developer knows what "done" means and how to handle edge cases |
| **Spec** | User Story + Tasks | Provide AI-ready build instructions | Developer (or AI agent) can execute without clarification |

The critical difference: the traditional hierarchy decomposes **work**. IDD decomposes **purpose**. Work decomposition is delegated to AI agents operating against well-defined Specs.

When all four layers are populated, a developer should be able to pick up a Spec and make every implementation decision independently. If they can't — if they need to interrupt a PO or tech lead — the Spec isn't ready. See [Autonomy Through Context](autonomy.md) for the full philosophy.

---

## 4. The Spec: Bridge Between Humans and AI

The Spec is the most important artifact in IDD. It is the translation layer that converts human-authored Expectations into structured instructions an AI coding agent can execute with minimal ambiguity.

### What Makes a Spec "AI-Ready"

| Traditional Spec Problem | Why AI Agents Struggle | IDD Requirement |
|---|---|---|
| Vague language ("make it user-friendly") | AI interprets literally or guesses | Precise, testable statements |
| Assumes tribal knowledge ("use our standard auth") | AI doesn't know your standards | Context-complete — stack, patterns, conventions declared |
| Narrative/prose format | AI parses structure, not paragraphs | Structured format (YAML/Markdown with schema) |
| Implicit scope ("obviously don't touch billing") | AI has no "obvious" | Explicit Boundaries block |
| Missing edge cases | AI builds the happy path only | Enumerated edge cases (minimum 2 per Expectation) |
| No architectural guidance | AI picks whatever pattern it wants | Stack, patterns, and conventions in Context block |

### Spec Structure

Every Spec contains five blocks:

1. **Context** — stack, patterns, conventions, auth, existing code references. Inherited from the Product, overridable per Spec.
2. **Expectations** — what must be true when done, with validation criteria and edge cases.
3. **Boundaries** — what the AI must NOT do. Scope exclusions, off-limits areas, forbidden dependencies.
4. **Deliverables** — concrete outputs: endpoints, components, tests, migration scripts.
5. **Validation** — split into automated (tests, contract checks) and human review (UX, architecture, data accuracy).

> **Design Principle:** A Spec should contain everything an AI agent needs to produce correct, reviewable output without asking clarifying questions. If the AI agent needs to guess, the Spec is incomplete.

For the full Spec schema and authoring guide, see [spec-authoring.md](spec-authoring.md).

---

## 5. Process Lifecycle

IDD replaces the sprint cycle with a continuous flow model anchored by spec readiness and validation gates.

### Lifecycle Phases

| Phase | Activities | Gate Criteria | Owner |
|---|---|---|---|
| **1. Define** | Create/refine Product, draft Intentions | Product approved; Intentions reviewed | Product Owner |
| **2. Specify** | Author Expectations; produce AI-ready Specs | Spec passes completeness checklist | Spec Author + Tech Lead |
| **3. Execute** | AI agent builds against Spec | Deliverables match Spec; automated validation passes | AI Agent + Developer |
| **4. Review** | Human review against Expectations and Boundaries | Code review approved; no boundary violations | Tech Lead + Reviewer |
| **5. Validate** | Automated + human validation against Expectations | All Expectations verified; edge cases covered | QA + Product Owner |
| **6. Deploy** | Release to environment; confirm in production | Deployment successful; monitoring stable | DevOps + Tech Lead |

### Spec Completeness Checklist

A Spec is not ready for AI execution until it passes this checklist. This replaces "Definition of Ready."

- [ ] Context block complete: stack, patterns, conventions, auth populated
- [ ] All Expectations have validation criteria (pass/fail or measurable)
- [ ] Edge cases enumerated for every Expectation (minimum 2 per)
- [ ] Boundaries explicitly stated
- [ ] Deliverables listed with expected output types
- [ ] Validation split into automated and human review
- [ ] Spec reviewed by at least one other human

### Flow Model

IDD uses continuous flow with WIP limits rather than time-boxed sprints.

| Dimension | Traditional Sprint | IDD Flow |
|---|---|---|
| Cadence | Fixed 2-week iterations | Continuous; Specs flow when ready |
| Planning | Sprint planning meeting | Specs enter queue when Ready |
| Capacity | Story points / velocity | WIP limits per phase |
| Prioritization | Backlog locked at planning | Re-prioritized continuously |
| Done | End-of-sprint review | Each Spec validated independently |
| Feedback loop | 2-week minimum | Hours to days |

### Flow Board Phases

Specs move through six phases on a Kanban-style board:

```
Draft → Ready → In Progress → Review → Validating → Done
```

- **Draft → Ready** is gated by the completeness checklist
- **Review → Validating** is gated by human review approval
- Each phase has configurable WIP limits
- Backward movement is allowed and logged (for metrics)

---

## 6. Roles and Responsibilities

See [roles.md](roles.md) for detailed role definitions. Summary:

| Role | Focus in IDD | Change from Traditional |
|---|---|---|
| **Product Owner** | Defines Products + Intentions; validates outcomes | Less backlog grooming, more vision and validation |
| **Spec Author** | Translates Intentions into AI-ready Specs | **New role** — hybrid of business analyst + senior developer |
| **Tech Lead** | Reviews Specs for architecture; manages Boundaries | Less coding, more review and governance |
| **Developer** | Partners with AI agents; handles edge cases | From primary builder to AI collaborator + reviewer |
| **AI Agent** | Executes against Specs; produces code + tests | New team member with defined inputs and outputs |

---

## 7. Ceremonies

| IDD Ceremony | Replaces | Frequency | Duration | Purpose |
|---|---|---|---|---|
| **Spec Review** | Sprint Planning + Refinement | As Specs reach Ready | 30 min | Validate completeness; approve for execution |
| **Flow Sync** | Daily Standup | 2–3x per week | 15 min | Review WIP board; surface blockers |
| **Validation Review** | Sprint Review / Demo | Per Spec completion | 30 min | PO validates Expectations; accept or return |
| **Process Retro** | Sprint Retrospective | Biweekly or monthly | 45 min | Review metrics; improve process |
| **Architecture Check** | N/A (new) | Weekly | 30 min | Review coherence across active Specs |

### What Goes Away

- Sprint Planning as a commitment ceremony
- Story point estimation
- Daily standup (every day, full team)
- Locked sprint backlog
- Velocity tracking

---

## 8. Metrics

See [metrics.md](metrics.md) for detailed metric definitions. Summary of primary metrics:

| Metric | Definition | Target |
|---|---|---|
| **Spec Cycle Time** | Time from Ready → Done | Decrease |
| **First-Pass Rate** | % of Specs passing Review without return | Increase |
| **Review Queue Depth** | Specs awaiting review at any point | Stable / Low |
| **Expectation Coverage** | % of Expectations with passing automated validation | 100% |
| **Boundary Violation Rate** | AI outputs that violate Boundaries | Zero |
| **Rework Rate** | Validated Specs requiring post-deploy fixes | Decrease |

### Metric Anti-Patterns

- Do NOT measure AI lines-of-code generated (incentivizes bloat)
- Do NOT measure Specs completed per week as a productivity target (incentivizes splitting)
- Do NOT compare individual Spec Author throughput (complexity varies)

---

## 9. Adoption

See [adoption.md](adoption.md) for the full guide. Summary:

1. **Pilot** (4–6 weeks) — Apply IDD to one product with a willing team
2. **Refine** (2–4 weeks) — Adjust based on findings; build minimum viable tooling
3. **Expand** (4–8 weeks) — Roll out to additional teams; train Spec Authors
4. **Standardize** (ongoing) — Codify as standard process; invest in tooling

---

## Glossary

| Term | Definition |
|---|---|
| **Product** | Highest-level artifact; defines the business problem, vision, and strategic alignment |
| **Intention** | What the Product should accomplish; outcome-oriented, not implementation-specific |
| **Expectation** | A verifiable constraint with edge cases that makes an Intention concrete |
| **Spec** | AI-ready build instruction translating Expectations into structured directives |
| **Spec Author** | Role responsible for translating Intentions into Expectations and AI-ready Specs |
| **Context Block** | Spec section providing stack, patterns, conventions, and references for AI agents |
| **Boundaries** | Explicit scope exclusions within a Spec defining what AI must NOT do |
| **WIP Limit** | Maximum Specs allowed in a phase simultaneously |
| **Spec Cycle Time** | Elapsed time from Ready to Done |
| **First-Pass Rate** | Percentage of Specs approved at Review without rework |
| **Validation Gate** | Checkpoint where criteria must be met before advancing |
| **Flow Sync** | Brief alignment meeting replacing daily standup |
