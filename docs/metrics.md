# Metrics and Measurement

Traditional agile metrics like velocity and burn-down charts lose meaning when AI compresses the build phase. IDD introduces metrics that reflect the new constraints.

---

## Primary Metrics

These are the metrics every IDD team should track from day one.

| Metric | Definition | Target Direction | Why It Matters |
|---|---|---|---|
| **Spec Cycle Time** | Elapsed time from Spec entering Ready to reaching Done | Decrease | Overall throughput measure; analogous to lead time |
| **First-Pass Rate** | % of Specs that pass Review without being returned | Increase | Measures spec quality; low rate = spec authoring needs improvement |
| **Review Queue Depth** | Number of Specs awaiting human review at any point | Stable / Low | Leading indicator of review bottleneck |
| **Expectation Coverage** | % of Expectations with passing automated validation | 100% | Ensures AI output is verified against defined criteria |
| **Boundary Violation Rate** | Number of AI outputs that violate defined Boundaries | Zero | Measures Spec clarity and AI agent compliance |
| **Rework Rate** | % of validated Specs requiring post-deploy fixes | Decrease | Lagging quality indicator; reveals spec or validation gaps |

### How to Calculate

**Spec Cycle Time:**
```
cycle_time = done_timestamp - ready_timestamp
```
Break down by phase for diagnostic value (time in Execute, time in Review, etc.).

**First-Pass Rate:**
```
first_pass_rate = specs_approved_first_try / total_specs_reviewed × 100
```
A "return" is any Spec moved from Review back to a prior phase.

**Review Queue Depth:**
Sample at a consistent time (e.g., each Flow Sync). Track the trend, not individual readings.

---

## Secondary Metrics

Track these after the team has established baseline primary metrics.

| Metric | Definition | Purpose |
|---|---|---|
| Spec Queue Depth | Specs in Ready awaiting execution | Indicates if spec authoring outpaces execution |
| AI Execution Time | Wall-clock time for AI to produce Deliverables | Baseline for AI performance; flags unusually complex Specs |
| Human Review Time | Time from Review to approval/return | Review capacity indicator |
| Intention Fulfillment Rate | % of Intentions with all Expectations at Done | Product progress measure; replaces burn-down |
| Spec Completeness Score | % of checklist items satisfied at Spec Review | Spec authoring quality measure |

---

## Anti-Patterns

| Anti-Pattern | Why It's Harmful |
|---|---|
| Measuring AI lines-of-code generated | Incentivizes bloat; more lines ≠ better output |
| Counting Specs completed per week as a target | Incentivizes splitting large Specs into trivially small ones |
| Comparing individual Spec Author throughput | Spec complexity varies widely; creates perverse incentives |
| Using Spec Cycle Time as a performance metric for individuals | Cycle time is a system metric, not a person metric |

---

## Getting Started

For a team piloting IDD, start with just three metrics:

1. **Spec Cycle Time** — Are we getting faster?
2. **First-Pass Rate** — Are our Specs good enough?
3. **Review Queue Depth** — Is review becoming a bottleneck?

Add the others once the team has 4–6 weeks of data and a stable process.
