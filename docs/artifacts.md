# Artifact Definitions

This document provides the complete field reference for each artifact in the IDD hierarchy.

---

## Product

The Product is the highest-level artifact. It defines the business problem, target audience, value proposition, and strategic alignment. A Product is stable and should not change cycle-to-cycle.

### Required Fields

| Field | Description | Example |
|---|---|---|
| Product ID | Unique identifier | `PROD-a3f8` |
| Name | Working product name | Customer Analytics Dashboard |
| Problem Statement | What business problem this solves | Operations teams lack real-time visibility into customer health metrics, leading to delayed interventions and churn |
| Target Audience | Who benefits | Operations managers, customer success teams, account executives |
| Value Proposition | Why this product matters | Consolidates 5 manual reports into a single real-time view with proactive alerting |
| Strategic Alignment | Organizational priorities served | Operational efficiency, data-driven decision making, customer retention |
| Owner | Accountable individual | Product Owner (named) |
| Status | Lifecycle state | `Discovery` · `Active` · `Maintenance` · `Sunset` |

### Recommended Fields

| Field | Description |
|---|---|
| Context | Product-level tech stack, patterns, conventions, auth — **inherited by all child Specs**. Strongly recommended: without it, every Spec must define its own Context from scratch. |
| Success Criteria | How do we know this Product is successful at the business level? |

### Authorship

- **Created by:** Product Owner with input from business sponsor and leadership
- **Reviewed by:** Leadership, stakeholders, technical lead
- **Updated:** Quarterly or at major strategic pivots

---

## Intention

An Intention describes what the Product should accomplish. It is a statement of purpose, not a feature specification. Intentions should be testable at a conceptual level: you should be able to ask *"can we demonstrate this Intention is fulfilled?"*

### Required Fields

| Field | Description | Example |
|---|---|---|
| Intention ID | Unique identifier scoped to Product | `INT-7c21` |
| Product ID | Parent Product reference | `PROD-a3f8` |
| Statement | What the product should accomplish | Users can view customer health scores with drill-down into contributing metrics |
| Rationale | Why this Intention matters to the Product | Health score visibility is the core value proposition for operations managers |
| Priority | Relative importance | `Critical` · `High` · `Medium` · `Low` |
| Dependencies | Other Intentions that must be fulfilled first | `INT-c8a4` (data ingestion must exist before visualization) |
| Expectations | Expectation IDs that belong to this Intention | `[EXP-9b04, EXP-3f2a]` |
| Owner | Person accountable | Product Owner or Spec Author |
| Status | Current state | `Draft` · `Defined` · `In Progress` · `Fulfilled` · `Deferred` |

### Writing Good Intentions

- **Focus on outcomes, not implementation.** Say "users can view health scores" not "build a React dashboard component."
- **Each Intention should be independently demonstrable.** If you can't show it working in isolation, it may be too coupled.
- **Avoid compound Intentions.** "Users can view scores AND export reports" should be two Intentions.
- **Include rationale.** Intentions without a clear "why" survive longer than they should.

---

## Expectation

An Expectation is a verifiable constraint or validation that makes an Intention concrete. Expectations answer: *"how do we know this Intention is fulfilled?"*

### Required Fields

| Field | Description | Example |
|---|---|---|
| Expectation ID | Unique identifier scoped to Intention | `EXP-9b04` |
| Intention ID | Parent Intention reference | `INT-7c21` |
| Description | What must be true when met | Health score displays as a color-coded gauge with numeric value |
| Validation Criteria | How to verify: pass/fail, measurable, demonstrable | Gauge renders with correct color bands (red < 40, yellow 40–70, green > 70); numeric value matches API response |
| Edge Cases | Boundary conditions and error scenarios (minimum 2) | "No data for customer → show 'Insufficient Data' state, not zero" / "Score exactly on boundary (40, 70) → include in higher band" |
| Complexity | Risk/uncertainty indicator | `Low` · `Medium` · `High` |
| Owner | Accountable person | Spec Author |
| Status | Current state | `Draft` · `Ready` · `Specced` · `Validated` · `Done` · `Deferred` |
| Deferred Reason | Why this Expectation is deferred *(required when status is `Deferred`)* | Blocked on IT team delivering production TLS certificate; does not block feature delivery |

### Writing Good Expectations

- **Every Expectation must be verifiable.** If you can't write a test or demonstrate it, it's too vague.
- **Enumerate edge cases explicitly.** AI agents build the happy path well. Edge cases are where quality lives.
- **Separate functional from non-functional.** Performance, security, and accessibility constraints are Expectations too.
- **Use complexity as a risk indicator**, not an effort estimate. High complexity signals tighter spec authoring and more review.

### Do vs. Don't

| Do ✓ | Don't ✗ |
|---|---|
| "Score displays in weekly or monthly intervals" | "Make the chart user-friendly" |
| "No data for period → show 'No Data' label" | "Handle errors appropriately" |
| "API accepts array of IDs (max 10)" | "Use our standard API patterns" |

---

## Spec

The Spec is the translation artifact that converts Expectations into structured instructions an AI coding agent can execute. It is the new unit of work.

### Required Fields

| Field | Description |
|---|---|
| Spec ID | Unique identifier (e.g., `SPEC-d12e`) |
| Product ID | Parent Product reference |
| Intention ID(s) | Which Intention(s) this Spec addresses |
| Expectation ID(s) | Which Expectation(s) this Spec implements |
| Status | `Draft` · `Ready` · `In Progress` · `Review` · `Validating` · `Done` |
| **Context Block** | Stack, patterns, conventions, auth, existing code references |
| **Expectations Block** | Expectations with validation criteria and edge cases |
| **Boundaries Block** | What the AI must NOT do |
| **Deliverables Block** | Concrete outputs expected |
| **Validation Block** | Automated checks + human review requirements |

### Context Inheritance

Context is defined once at the Product level and inherited by all child Specs. Individual Specs may override or extend inherited context.

| Context Element | Defined At | Override Behavior |
|---|---|---|
| Stack | Product | Spec may add components |
| Patterns | Product | Spec may add patterns for its scope |
| Conventions | Product | Spec may add; should not contradict |
| Existing Code Refs | Spec | Always Spec-specific |
| Auth | Product | Spec may narrow (e.g., specific roles) |

For the complete Spec schema and authoring best practices, see [spec-authoring.md](spec-authoring.md).

### Optional Fields

The following fields are added by the v1.3 pipeline and are not required on pre-existing Specs.

**gap_check** — Records the outcome of the gap-check gate run before execution.

| Sub-Field | Type / Valid Values | Description |
|---|---|---|
| `status` | `pass` · `blocked` · `warned` | Result of the gap-check run: `pass` means zero Blockers and zero Warnings; `warned` means zero Blockers but at least one Warning reviewed and accepted; `blocked` means at least one Blocker remains unresolved |
| `blockers` | integer | Count of Blocker-grade findings at the time of the run |
| `warnings` | integer | Count of Warning-grade findings at the time of the run |
| `report` | file path string | Path to the gap-check report file (e.g., `docs/reviews/gap-check-SPEC-d12e.md`) |
| `date` | ISO 8601 date | Date the gap-check gate was run |

Pre-v1.3 artifacts that do not include the `gap_check` field remain valid; the field is optional and its absence does not indicate an incomplete Spec.
