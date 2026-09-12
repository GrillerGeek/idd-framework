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
| **3. Gap-Check Gate** | Adversarial review of content and omission sweep of files referencing changed concepts but owned by no Deliverable | Zero unresolved Blockers and Warnings; current gap-check report filed with Coverage; lifecycle ready | Spec Author + Tech Lead |
| **4. Execute** | AI agent builds against Spec; restates Boundaries before starting; self-verifies against all Expectations, Boundaries, and Deliverables upon completion; produces an Execution Report recording any gaps encountered | Deliverables match Spec; automated validation passes; Execution Report filed | AI Agent + Developer |
| **5. Review** | Human review against Expectations and Boundaries; gap-check findings and Execution Report reviewed as inputs | Code review approved; no boundary violations | Tech Lead + Reviewer |
| **6. Validate** | Automated + human validation against Expectations | All Expectations verified; edge cases covered | QA + Product Owner |
| **7. Deploy** | Release to environment; confirm in production | Deployment successful; monitoring stable | DevOps + Tech Lead |

### Spec Completeness Checklist

A Spec is not ready for AI execution until it passes this checklist. This replaces "Definition of Ready."

- [ ] Context: stack is non-empty
- [ ] Context: patterns is non-empty
- [ ] Context: conventions has at least one entry
- [ ] Context: auth is non-empty
- [ ] At least one Expectation is linked
- [ ] All Expectations have validation criteria (pass/fail or measurable)
- [ ] All Expectations have at least 2 edge cases
- [ ] Boundaries block has at least one entry
- [ ] Deliverables block has at least one entry
- [ ] Validation block has at least one automated and one human review item
- [ ] Spec has been peer-reviewed by at least one other person

### Spec lifecycle contract

The YAML lifecycle is `draft → ready → in-progress → review → validating → done`.
Technical review and gap-check are review activities with separate annotations;
neither is a YAML lifecycle transition. The following rules are a protocol for
people and orchestrating agents, not an executable state machine in this repository.

| Transition or activity | Owner and required evidence |
|---|---|
| `draft → ready` | Author/orchestrator records all eleven completeness items, including actual human peer review |
| Technical or deep review | Reviewer records review findings and outcome, preserving input lifecycle status and content blocks; AI approval cannot establish human peer review |
| Gap-check | Reviewer writes reports only; orchestrator updates one `gap_check` annotation, preserving lifecycle and content |
| `ready → in-progress` | Orchestrator verifies the strict gate, restates Boundaries verbatim, then changes status before dispatching implementation |
| `in-progress → review` | Orchestrator checks execution evidence and the completion conditions below |
| `review → validating` | Orchestrator records human implementation-review approval from the Reviewer/Tech Lead |
| `validating → done` | Orchestrator records QA/Product Owner evidence that Expectations and required validation passed |

**Finding policy.** New annotations use `passed` for zero unresolved blockers and
warnings, `warnings` for zero blockers with outstanding warnings, and `blocked`
for any blocker. A warning-only report starts `PASS` but does not authorize
execution. Resolve findings in the Spec and rerun. Technical-review warnings must
be addressed or carried into gap-check for classification; a technical approval
is not a gap-check result. Historical `pass`/`warned` values remain history and
require a new check before execution.

Coverage includes every candidate omission, including protected files. The author
may record `coverage_dispositions` entries containing `files`, `disposition`, and
`reason`. An `accept-omission` with a reason resolves a coverage finding only when
the reviewer independently confirms no unmet validation dependency. Retain its
file, evidence, severity, suggested disposition, and resolution in Coverage;
exclude resolved findings from gate counts. Undispositioned omissions remain
Warnings; a validation dependency without an owner remains a Blocker. Human
acknowledgment alone cannot waive a substantive content warning.

**Gap-check reruns and failure.** Resolve targets first; report missing IDs without
creating substitute Specs. Before completeness assessment or reviewer dispatch,
upsert `gap_check` on each readable selected Spec to `blocked`, `blockers: 1`,
`warnings: 0`, `report: null`, and the current date. This is an operational blocker
meaning no valid current result exists, not an invented content finding. Leave
an unparseable Spec untouched and report it; it cannot authorize execution.

The reviewer checks completeness items 1–10; item 11 remains a human fact. Failure
returns the failed item numbers without writing a finding report. Orchestration
keeps the annotation blocked, sets blockers to the failed-item count, warnings to
zero and report to null. Old reports are not consumed. Otherwise the reviewer
writes `docs/reviews/<SPEC-ID>-gap-check.md` with a summary on line 1, required
GC finding fields, and `## Coverage`, even when there are no omissions.

Only a successful result for that Spec from the current invocation, with matching
returned/report counts and valid report structure, replaces the operational
blocker. Errors, interruption, and missing or malformed reports leave it blocked
with no authoritative report; rerun the check. File existence or modification
time alone is not freshness evidence. Previous report files remain untouched
until a successful review replaces the canonical report. In a mixed portfolio,
continue complete Specs, exclude incomplete Specs from portfolio coverage, and
state the exclusions. Each Spec receives its own result.

**Execution preflight.** Resolve or select one Spec before any write, including
directory initialization. Read its YAML, annotation and referenced report.
Require `ready`, `gap_check.status: passed`, zero counts, and a readable report
at `docs/reviews/<SPEC-ID>-gap-check.md` whose first line is
`PASS — 0 blockers, 0 warnings` and which contains `## Coverage`. Any failed
prerequisite produces a conversational refusal with no writes. Spec content
changed after review requires a fresh gap-check; automatic detection of unnoticed
manual edits requires provenance tooling that is not provided here.

Restate every Boundary verbatim before mkdir or status mutation. Orchestration
then changes ready to in-progress and passes verified gate evidence to the
implementer. Before its own changes, the implementer repeats the verbatim
acknowledgment with a comprehension paraphrase. It never changes Spec status.
Capture file contents/diffs as well as Git status before implementation: editing
an already-dirty file can leave its porcelain status unchanged. Preserve user
edits and compare the actual content delta to the Deliverables allowlist.

**Completion and recovery.** Advance to review only when the execution report
exists, every Deliverable and Boundary passes, every automated validation passes,
and no blocker-grade gap remains. Every edge case needs a row; only checks
explicitly assigned to human review may remain unverifiable at build time, with
a reason and follow-up. Pending human-only checks are not failed automation.
Failed, blocked, or interrupted builds stay in-progress. Surface failure evidence
and save a partial report if possible; do not roll back user changes or reset to
ready automatically. The standard implementation command accepts only ready;
resumption requires an explicit recovery decision outside this protocol.

A mid-build gap is blocker-grade if alternative resolutions change validation
outcomes, risk crossing a Boundary, or change a Deliverable's visible shape.
Stop and report those gaps to the author. Other gaps permit a best-effort choice
recorded with reasoning in the mandatory `spec_gaps_encountered` report section.

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

Specs move through seven phases on a Kanban-style board:

```
Draft → Ready → Gap-Check → In Progress → Review → Validating → Done
```

- **Draft → Ready** is gated by the completeness checklist
- **Ready → Gap-Check** is a required review activity before execution, not an automatic tool action or an additional YAML status
- **Gap-Check → In Progress** requires lifecycle ready and a current passed annotation with zero unresolved Blockers and Warnings
- **Review → Validating** is gated by human review approval
- Each phase has configurable WIP limits
- Deliberate rework decisions are logged (for metrics); a failed build is not automatically reset to ready

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
| **Spec Review** | Sprint Planning + Refinement | As Specs reach Ready | 30 min | Validate completeness and human readiness review; execution additionally requires a clean gap-check |
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

## 10. The Seven-Stage Workflow

As AI coding agents matured, practitioners converged on a recurring shape for the work. Matt Pocock's widely-shared model names seven stages — Grill, Research, Prototype, PRD/Plan, Issues/Tasks, Implement, Review. Read in order, the striking thing is that **only one of the seven is the build.** The other six are upstream: briefing, grounding, planning, decomposing, and deciding in advance how you'll know it worked.

That is IDD's founding premise (§1): when the build phase compresses 5–10×, the bottleneck moves from *building* to *defining, reviewing, and validating*. IDD exists to name that front-loaded work, give it artifacts, and gate it. The table below maps each stage to the IDD lifecycle phase that carries it.

### Stages to lifecycle phases

| # | Stage | The question it answers | IDD lifecycle phase(s) |
|---|---|---|---|
| 1 | **Grill** | How do I brief an AI well? | **Define** — interview the stakeholder into a Product, rather than writing a perfect prompt |
| 2 | **Research** *(optional)* | How do I keep it grounded in current facts? | **Specify** — the Spec's Context block captures stack, patterns, conventions, and code references; external sources are curated into Context rather than left to model memory |
| 3 | **Prototype** *(optional)* | How do I test an idea before committing? | *Outside core IDD* — a disposable spike to react to, not an artifact that flows through the hierarchy |
| 4 | **PRD/Plan** | How do we end up at the right place? | **Define + Specify** — an Intention states *what* the outcome is; Expectations state *how we'll know it's right*, which is the written-down definition of "done" |
| 5 | **Issues/Tasks** | How do I break a big job into pieces? | **Specify** — decompose into Specs; each Spec is one well-scoped, independently flowable unit of work |
| 6 | **Implement** | When do I let the AI actually run? | **Execute** — the agent builds against a complete Spec, restating Boundaries first and self-verifying when done |
| 7 | **Review** | How do I know it got it right? | **Gap-Check + Review + Validate** — Expectations *are* the QA plan, decided in advance; the gap-check gate even runs the review *before* any code, simulating the implementer to catch ambiguity early |

The mapping is close because both describe the same arc: get clear, get grounded, decide the destination, break it down, then act, then check. IDD's contribution is to make the upstream stages durable artifacts with gates between them, so front-loaded review is an explicit protocol obligation; this repository does not supply an executable state-machine enforcement layer.

Two stages are a deliberately loose fit. **Research** in IDD is context-gathering folded into the Spec rather than a standalone stage, and **Prototype** has no IDD artifact at all — IDD is a planning framework, and a throwaway spike is by definition not something you plan and validate. That gap is exactly where an execution harness completes the picture.

### In practice with Claude Code

The IDD plugin's `/idd-framework:*` commands carry the upstream stages; the **Guildhall** plugin's `/quest` harness carries prototyping and execution. The two meet at the Spec.

| # | Stage | IDD plugin | Guildhall |
|---|---|---|---|
| 1 | Grill | `/interview` | — |
| 2 | Research | Context block authored in `/write-spec` (codebase scan); pair with Context7 or web for external grounding | Aldric (`architecture-reviewer`) surveys 2–3 alternatives with trade-offs |
| 3 | Prototype | — | `/quest` prototype mode → Pip (`prototype-builder`): a fast spike, no tests, disposable |
| 4 | PRD/Plan | `/define-intentions`, `/define-expectations` (or `/define-outcomes`) | — |
| 5 | Issues/Tasks | `/write-spec` (or `/quick-spec`); one Spec per chunk | Mordain's committed `plan.md` orders the quest into TDD-sequenced tasks |
| 6 | Implement | `/implement-spec` — managed, single-agent build with self-verification | `/quest` — TDD loop: Seraphine (red tests) → Bruga (green code) → Tink (refactor) |
| 7 | Review | `/gap-check` (before execution), `/review-spec` (after) | Parallel reviewer fan-out — Oriana (security) and Cassian (docs) always-on, plus gated specialists; Rook drafts the PR |

**The Spec is the seam.** IDD produces a complete, gap-checked Spec; Guildhall is built to consume it ("Integrates with IDD-framework specs"). That gives you two execution paths off the *same* artifact: run `/implement-spec` for a managed single-agent build, or hand the Spec to `/quest` when you want the full TDD-ordered guild with parallel specialist review. Stage 6 — the "loop and subagents" doing the work — is the only stage where you let the agent move fast, because stages 1–5 already did the deciding.

### Where to start

You don't have to adopt all seven at once. The three highest-leverage stages map to three commands you can run on your next real task:

- **Grill** → `/idd-framework:interview` — let the agent interview you instead of guessing.
- **Plan** → write Expectations first — a few verifiable criteria are your definition of "done" before anything is built.
- **Review** → `/idd-framework:gap-check` — decide how you'll check, and catch the gaps, *before* the agent runs.

Add the rest as the habit takes. The leverage is in the order, not the tooling.

> *Stage names follow Matt Pocock's seven-stage AI coding workflow ([github.com/mattpocock/skills](https://github.com/mattpocock/skills)).*

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
| **Gap-Check Gate** | Adversarial review stage run after a Spec reaches Ready and before execution begins; requires zero unresolved Blockers and Warnings before execution; aims to catch ambiguity, contradictions, and missing context before the build |
| **Execution Report** | Artifact produced by the executing agent upon completing a Spec; records every Boundary acknowledged, a self-verification table against all Expectations and Deliverables, and any Spec gaps encountered during execution; stored alongside the Spec |
| **Flow Sync** | Brief alignment meeting replacing daily standup |
