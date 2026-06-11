# Worked Example: Employee Onboarding Portal

This example walks through the full IDD hierarchy for a realistic internal tool. It demonstrates how Product, Intentions, Expectations, and Specs connect.

---

## Product

```yaml
product:
  id: "PROD-a3f8"
  name: "Onboarding Portal"
  status: "active"
  owner: "Sarah Chen"

  problem_statement: >
    New employee onboarding is managed through a combination of email chains,
    shared spreadsheets, and tribal knowledge. HR, IT, and hiring managers
    each maintain separate checklists with no shared visibility. Result:
    missed steps, delayed equipment provisioning, and a poor first-week
    experience. Average time to full productivity is 3 weeks; target is 1 week.

  target_audience: >
    HR coordinators, IT provisioning teams, hiring managers, and new employees.

  value_proposition: >
    A single portal that orchestrates the onboarding workflow across HR, IT,
    and the hiring manager — providing visibility, automation, and a
    guided first-week experience for new employees.

  strategic_alignment: >
    Operational efficiency, employee experience, process standardization.

  context:
    stack: "React 18, TypeScript, Node.js 20, Express, PostgreSQL, Prisma"
    patterns: "REST API, vertical slice architecture, React Query"
    conventions:
      - "All API routes return { data, error, meta }"
      - "Zod for request/response validation"
      - "Component-per-feature folder structure"
    auth: "SSO via corporate identity provider (OIDC); role-based access (HR, IT, Manager, Employee)"
```

---

## Intentions

### INT-7c21: Onboarding Checklist Management

```yaml
intention:
  id: "INT-7c21"
  product: "PROD-a3f8"
  statement: "HR can define and manage onboarding checklist templates that automatically create task lists for each new hire."
  rationale: "The checklist is the core workflow artifact. Without structured, reusable templates, every onboarding is improvised."
  priority: "critical"
  dependencies: []
  expectations: ["EXP-9b04", "EXP-3f2a", "EXP-5d8b"]
  owner: "Sarah Chen"
  status: "defined"
```

### INT-3e4f: Cross-Team Visibility

```yaml
intention:
  id: "INT-3e4f"
  product: "PROD-a3f8"
  statement: "HR, IT, and hiring managers can see the real-time status of every onboarding in progress, filtered to their responsibilities."
  rationale: "The #1 complaint is 'I didn't know that was my task.' Visibility eliminates handoff gaps."
  priority: "critical"
  dependencies: ["INT-7c21"]
  expectations: []
  owner: "Sarah Chen"
  status: "defined"
```

### INT-c8a4: New Employee Self-Service

```yaml
intention:
  id: "INT-c8a4"
  product: "PROD-a3f8"
  statement: "New employees can view their onboarding progress, complete assigned tasks (document uploads, acknowledgments), and see their first-week schedule."
  rationale: "Empowering the new hire reduces HR burden and improves the first-week experience."
  priority: "high"
  dependencies: ["INT-7c21"]
  expectations: []
  owner: "Sarah Chen"
  status: "defined"
```

---

## Expectations (for INT-7c21)

```yaml
- id: "EXP-9b04"
  intention: "INT-7c21"
  description: "HR can create a checklist template with named tasks, each assigned to a role (HR, IT, Manager, or Employee) with a due-by offset in days from start date."
  validation_criteria: "Template creation form saves all fields; template appears in template list; tasks display with role badges and day offsets."
  edge_cases:
    - "Template with zero tasks → validation error, cannot save"
    - "Due-by offset of 0 → task is due on start date, displayed as 'Day 1'"
    - "Two tasks with same name → allowed (different role assignments make them distinct)"
  complexity: "low"
  status: "ready"

- id: "EXP-3f2a"
  intention: "INT-7c21"
  description: "When a new hire is added, the system instantiates a checklist from the selected template, calculating actual due dates from the start date."
  validation_criteria: "New hire creation triggers checklist generation; each task has a concrete due date; task list visible on the new hire's onboarding page."
  edge_cases:
    - "Start date is today → tasks with offset 0 are immediately due"
    - "Start date is in the past (late entry) → past-due tasks flagged as overdue, not hidden"
    - "Template is modified after instantiation → existing checklists are not affected; only future onboardings use the updated template"
  complexity: "medium"
  status: "ready"

- id: "EXP-5d8b"
  intention: "INT-7c21"
  description: "Tasks can be marked complete by the assigned role, with a timestamp and the completing user recorded."
  validation_criteria: "Checkbox on task toggles completion; timestamp and user recorded; completion is reflected in progress calculations."
  edge_cases:
    - "Task marked complete then unchecked → completion record removed; audit log retains both events"
    - "Task completed by someone other than the assigned role → allowed but flagged as 'completed by [name] (not assigned role)'"
    - "All tasks complete → onboarding status automatically changes to 'Complete'"
  complexity: "low"
  status: "ready"
```

---

## Spec (for EXP-9b04 + EXP-3f2a + EXP-5d8b)

```yaml
spec:
  id: "SPEC-d12e"
  product: "PROD-a3f8"
  intentions: ["INT-7c21"]
  expectations: ["EXP-9b04", "EXP-3f2a", "EXP-5d8b"]
  status: "ready"

  context:
    stack: "React 18, TypeScript, Node.js 20, Express, PostgreSQL, Prisma"
    patterns: "REST API, vertical slice architecture, React Query"
    conventions:
      - "All API routes return { data, error, meta }"
      - "Zod for request/response validation"
      - "Component-per-feature folder structure"
      - "Soft-delete pattern (archived_at timestamp) for all entities"
    existing_code_refs:
      - path: "/src/features/"
        note: "Follow existing feature folder structure for new onboarding feature"
    auth: "SSO via OIDC; role field on user record (hr, it, manager, employee); middleware validates role on protected routes"

  expectations:
    - id: "EXP-9b04"
      description: "HR can create checklist templates with tasks, role assignments, and day offsets"
      validation: "Form saves; template appears in list; tasks show role badges and offsets"
      edge_cases:
        - "Zero tasks → validation error"
        - "Offset 0 → displayed as 'Day 1'"
        - "Duplicate task names → allowed"

    - id: "EXP-3f2a"
      description: "New hire creation instantiates checklist with concrete due dates"
      validation: "Checklist generated from template; dates calculated; visible on onboarding page"
      edge_cases:
        - "Start date today → offset 0 tasks immediately due"
        - "Start date in past → overdue tasks flagged"
        - "Template modified after instantiation → no effect on existing"

    - id: "EXP-5d8b"
      description: "Tasks can be marked complete with timestamp and user recorded"
      validation: "Checkbox toggles; timestamp recorded; progress recalculated"
      edge_cases:
        - "Uncheck → record removed; audit log retained"
        - "Completed by wrong role → allowed, flagged"
        - "All complete → status auto-updates"

  boundaries:
    - "Do not implement email notifications — that is SPEC-7e15"
    - "Do not implement document upload functionality — that is SPEC-4b62"
    - "Do not modify the existing user/auth tables"
    - "Do not implement a calendar or scheduling view"

  deliverables:
    - "Database schema: ChecklistTemplates, TemplateTasks, Onboardings, OnboardingTasks tables (Prisma migration)"
    - "API: CRUD routes for templates (POST/GET /api/templates, GET/PUT/DELETE /api/templates/:id)"
    - "API: POST /api/onboardings (creates onboarding + instantiates checklist)"
    - "API: PATCH /api/onboardings/:id/tasks/:taskId (toggle completion)"
    - "UI: Template management page (create, edit, list)"
    - "UI: Onboarding detail page with task checklist"
    - "Unit tests for date calculation logic"
    - "Integration tests for API endpoints"

  validation:
    automated:
      - "Template CRUD operations succeed via API tests"
      - "Checklist instantiation calculates correct due dates"
      - "Task completion toggles correctly and updates progress"
      - "Role-based access enforced on template management routes"
    human_review:
      - "Template creation UX: is it intuitive for HR users?"
      - "Onboarding page layout: is the checklist clear and scannable?"
      - "Date display: are overdue items visually distinct?"
```

---

## What This Example Demonstrates

| IDD Concept | Where It Appears |
|---|---|
| **Product as problem space** | Problem statement focuses on the workflow gap, not the technical solution |
| **Intentions as outcomes** | "HR can define templates" not "build a template CRUD page" |
| **Expectations with edge cases** | Every Expectation has ≥2 edge cases covering boundaries and error states |
| **Context inheritance** | Spec Context matches Product Context with one addition (existing_code_refs) |
| **Explicit Boundaries** | Spec clearly states what is NOT in scope (notifications, uploads, calendar) |
| **Deliverables as concrete outputs** | Every API route, UI page, and test type is listed |
| **Validation split** | Automated tests for logic; human review for UX and clarity |
| **Gap-check gate** | See v1.3 Pipeline section — gate runs even when clean, result recorded in Spec |
| **Managed execution** | Boundary restatement, self-verification table, and Execution Report shown inline |

---

## v1.3 Pipeline: Gap-Check Gate and Execution Report

IDD v1.3 adds two mandatory stages between **Ready** and **In Progress**: the gap-check gate and managed execution. The example below shows both stages for SPEC-d12e.

### Stage: Gap-Check Gate

After SPEC-d12e reached Ready status, the team's AI agent ran the gap-check stage against the Spec before any implementation began. The gate reviews the Spec adversarially — it reads every Boundary, Expectation, Deliverable, and Validation item looking for ambiguity, internal contradictions, and missing context that would require improvisation during execution.

**Gap-check report excerpt (SPEC-d12e — clean gate):**

```
Gap-Check Report: SPEC-d12e
Date: [run date]
Result: PASSED — 0 Blockers, 0 Warnings

Findings:
  none

Gate decision: CLEARED FOR EXECUTION
```

The gate returned zero findings. This is the expected outcome for a well-authored Spec — but the gate ran regardless. The gap-check gate always runs. Skipping it because a Spec looks complete defeats its purpose: completeness is not visible to the naked eye, and the adversarial review catches contradictions that pass a human read-through.

The Spec's `gap_check` annotation was updated to record the outcome:

```yaml
gap_check:
  status: "pass"
  blockers: 0
  warnings: 0
  report: "docs/reviews/gap-check-SPEC-d12e.md"
  date: "[run date]"
```

### Stage: Execute (Managed Execution)

With the gate cleared, execution began. The executing agent followed the managed execution protocol:

1. **Boundary restatement** — Before writing any code, the agent restated all four Boundaries from the Spec verbatim, confirming each was understood.
2. **Implementation** — The agent built the Deliverables against the Spec.
3. **Self-verification** — Upon completion, the agent produced a self-verification table covering every Expectation, every Boundary, and every Deliverable.
4. **Execution Report** — The agent filed an Execution Report in docs/reviews/.

**Execution Report excerpt (SPEC-d12e):**

```
Execution Report: SPEC-d12e
Date: [execution date]
Executor: AI implementing agent

## Boundary Acknowledgment

1. "Do not implement email notifications — that is SPEC-7e15" — Observed. No
   notification logic was introduced.
2. "Do not implement document upload functionality — that is SPEC-4b62" — Observed.
   No upload endpoints or UI components were created.
3. "Do not modify the existing user/auth tables" — Observed. Only new tables were
   added via Prisma migration; user and auth tables untouched.
4. "Do not implement a calendar or scheduling view" — Observed. No calendar
   components or scheduling routes were produced.

## Self-Verification Table (excerpt)

| Item | Type | Status | Evidence |
|---|---|---|---|
| EXP-9b04: Template creation with tasks, roles, offsets | expectation | satisfied | POST /api/templates creates template; GET returns with role badges and offsets |
| EXP-9b04 edge: Zero tasks → validation error | edge_case | satisfied | Zod schema requires tasks.minLength(1); API returns 422 |
| EXP-9b04 edge: Offset 0 → displayed as 'Day 1' | edge_case | satisfied | formatOffset() function maps 0 to 'Day 1'; unit test covers boundary |
| EXP-3f2a: Checklist instantiation on new hire creation | expectation | satisfied | POST /api/onboardings triggers generateChecklist(); integration test confirms |
| EXP-5d8b: Task completion with timestamp and user | expectation | satisfied | PATCH /api/onboardings/:id/tasks/:taskId records completed_at and completed_by |
| Boundary: No email notifications | boundary | satisfied | Grep confirms no nodemailer or SMTP references in produced files |
| Deliverable: Prisma migration for all four tables | deliverable | satisfied | Migration file creates ChecklistTemplates, TemplateTasks, Onboardings, OnboardingTasks |

## Spec Gaps Encountered

none

## Follow-Ups

- EXP-3f2a edge case "start date in past → overdue tasks flagged": the visual
  treatment (color, icon) was not specified in the Spec. A UI decision was made
  to use a red badge labeled "Overdue." Suggest the Spec Author confirm this
  matches intent or author an Expectation covering the visual treatment.
```

### What This Stage Demonstrates

| v1.3 Concept | Where It Appears |
|---|---|
| **Gap-check gate always runs** | Gate ran against SPEC-d12e even though it returned zero findings; the report confirms zero Blockers, not a skipped stage |
| **Clean gate does not mean skipped gate** | The `gap_check` annotation in the Spec records the pass result and the report path |
| **Boundary restatement before execution** | Execution Report opens with all four Boundaries acknowledged verbatim |
| **Self-verification table** | Each Expectation, Boundary, and Deliverable checked with evidence |
| **Execution Report as a mandatory artifact** | Report filed in docs/reviews/ regardless of whether gaps were found |
| **Gaps Encountered section present even when empty** | "none" — not omitted |
| **Minor gaps escalated, not silently resolved** | The UI treatment for overdue tasks surfaced as a Follow-Up, not improvised silently |

---

## Try It Yourself

1. Copy the Spec above into a file
2. Export it as Markdown (or just copy the YAML block)
3. Run the gap-check stage against the Spec before execution — even for a clean Spec, the gate confirms completeness and files a record
4. Compare the output quality to what you'd get from a typical user story like:
   > "As an HR coordinator, I want to manage onboarding checklists so that new hires have a structured first week."
