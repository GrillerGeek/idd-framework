# Adoption Guide

How to introduce IDD to your team.

---

## Phased Approach

### Phase 1: Pilot (4–6 weeks)

**Goal:** Validate the process with one product and one willing team.

**Activities:**
- Select a pilot Product (see criteria below)
- Define the Product, 3–5 Intentions, and initial Expectations
- Use manual tracking: Markdown Specs in a Git repo + a simple Kanban board (Trello, GitHub Projects, or a whiteboard)
- Write 2–3 Specs and execute them with AI agents
- Measure baseline Spec Cycle Time, First-Pass Rate, and Review Queue Depth
- Conduct a Process Retro at weeks 2 and 4

**Pilot Product Criteria:**
- Clear problem statement and defined Intentions (even if informal)
- Active development planned in the next 6–8 weeks
- A team willing to experiment with new workflows
- Sufficient complexity to exercise the full lifecycle (not trivial)
- A Product Owner who can commit time to Expectation definition and validation

### Phase 2: Refine (2–4 weeks)

**Goal:** Adjust the process based on pilot findings.

**Activities:**
- Review what worked and what didn't from the pilot
- Adjust artifact definitions, ceremonies, and roles
- Build or configure minimum viable tooling
- Document team-specific conventions for Spec authoring
- Identify the Spec Author role — who on the team has the right skills?

### Phase 3: Expand (4–8 weeks)

**Goal:** Roll out to additional products and teams.

**Activities:**
- Train new Spec Authors using examples from the pilot
- Establish metrics baselines across teams
- Share the Context block template across products
- Start Spec Reviews as a regular ceremony
- Stand up the Flow Board for each team

### Phase 4: Standardize (ongoing)

**Goal:** Codify IDD as the standard development process.

**Activities:**
- Invest in tooling (custom or configured)
- Publish internal Spec authoring guidelines
- Integrate metrics into leadership reporting
- Continuous improvement via Process Retros

---

## Change Management

### Spec authoring is a new skill

Budget time and support for team members to develop it. The first Specs will be imperfect — that's expected. The completeness checklist catches gaps, and First-Pass Rate tracks improvement over time.

### Developers get more autonomy, not less

A common first reaction is that IDD adds overhead. In reality, it removes the biggest source of developer frustration: waiting for someone to answer their questions. With a complete Spec, developers make implementation decisions independently — they're not executing orders, they're exercising judgment within clear context. Frame IDD as giving developers **more decision-making authority** because they have the information to use it well.

### Product Owners must engage more deeply

In traditional agile, POs could write a vague story and let devs figure it out. In IDD, Expectations require specificity upfront. This is more work initially but dramatically less rework downstream.

### Resist adding ceremony

IDD is designed to be lighter than Scrum, not heavier. If you find yourself adding meetings, check whether the Flow Board or metrics dashboard could answer the question instead.

---

## Common Objections

| Objection | Response |
|---|---|
| "This is just waterfall with extra steps" | Waterfall locks requirements and builds in sequence. IDD uses continuous flow, iterates Specs rapidly, and validates incrementally. The Spec is a living artifact, not a signed-off document. |
| "We don't have time to write detailed Specs" | You're already spending the time — it's just hidden in rework, clarification meetings, and AI re-prompting. IDD front-loads clarity to reduce total effort. |
| "Story points work fine for us" | If AI hasn't changed your build times, they might. Once AI compresses the build phase, story points measure the wrong thing. |
| "We can't justify a new role (Spec Author)" | Start by growing the skill in existing senior developers or BAs. The role emerges organically as the team recognizes that spec quality is the bottleneck. |
| "Our AI tools aren't good enough yet" | IDD works with any AI coding agent — Claude Code, Copilot, Kiro, Cursor, etc. The framework is tool-agnostic. Better AI makes IDD more valuable, not less. |

---

## Minimal Viable IDD

If you want to try IDD with the smallest possible investment:

1. Pick one feature you're about to build
2. Write a **Product** definition (one paragraph)
3. Write 2–3 **Intentions** (what should it accomplish?)
4. For each Intention, write **Expectations** with edge cases
5. Write one **Spec** using the [template](../templates/spec-template.yaml)
6. Export the Spec as Markdown and paste it into your AI coding agent
7. Compare the output quality to your usual approach

That's it. No tooling, no ceremonies, no role changes. Just better input to AI.
