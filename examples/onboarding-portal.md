# Worked Example: Employee Onboarding Portal

This example walks through the full IDD hierarchy for a realistic internal tool. It demonstrates how Product, Intentions, Expectations, and Specs connect.

---

## Product

```yaml
product:
  id: "PROD-001"
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

### INT-001: Onboarding Checklist Management

```yaml
intention:
  id: "INT-001"
  product: "PROD-001"
  statement: "HR can define and manage onboarding checklist templates that automatically create task lists for each new hire."
  rationale: "The checklist is the core workflow artifact. Without structured, reusable templates, every onboarding is improvised."
  priority: "critical"
  dependencies: []
  owner: "Sarah Chen"
  status: "defined"
```

### INT-002: Cross-Team Visibility

```yaml
intention:
  id: "INT-002"
  product: "PROD-001"
  statement: "HR, IT, and hiring managers can see the real-time status of every onboarding in progress, filtered to their responsibilities."
  rationale: "The #1 complaint is 'I didn't know that was my task.' Visibility eliminates handoff gaps."
  priority: "critical"
  dependencies: ["INT-001"]
  owner: "Sarah Chen"
  status: "defined"
```

### INT-003: New Employee Self-Service

```yaml
intention:
  id: "INT-003"
  product: "PROD-001"
  statement: "New employees can view their onboarding progress, complete assigned tasks (document uploads, acknowledgments), and see their first-week schedule."
  rationale: "Empowering the new hire reduces HR burden and improves the first-week experience."
  priority: "high"
  dependencies: ["INT-001"]
  owner: "Sarah Chen"
  status: "defined"
```

---

## Expectations (for INT-001)

```yaml
- id: "EXP-001"
  intention: "INT-001"
  description: "HR can create a checklist template with named tasks, each assigned to a role (HR, IT, Manager, or Employee) with a due-by offset in days from start date."
  validation_criteria: "Template creation form saves all fields; template appears in template list; tasks display with role badges and day offsets."
  edge_cases:
    - "Template with zero tasks → validation error, cannot save"
    - "Due-by offset of 0 → task is due on start date, displayed as 'Day 1'"
    - "Two tasks with same name → allowed (different role assignments make them distinct)"
  complexity: "low"
  status: "ready"

- id: "EXP-002"
  intention: "INT-001"
  description: "When a new hire is added, the system instantiates a checklist from the selected template, calculating actual due dates from the start date."
  validation_criteria: "New hire creation triggers checklist generation; each task has a concrete due date; task list visible on the new hire's onboarding page."
  edge_cases:
    - "Start date is today → tasks with offset 0 are immediately due"
    - "Start date is in the past (late entry) → past-due tasks flagged as overdue, not hidden"
    - "Template is modified after instantiation → existing checklists are not affected; only future onboardings use the updated template"
  complexity: "medium"
  status: "ready"

- id: "EXP-003"
  intention: "INT-001"
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

## Spec (for EXP-001 + EXP-002 + EXP-003)

```yaml
spec:
  id: "SPEC-001"
  product: "PROD-001"
  intentions: ["INT-001"]
  expectations: ["EXP-001", "EXP-002", "EXP-003"]
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
    - id: "EXP-001"
      description: "HR can create checklist templates with tasks, role assignments, and day offsets"
      validation: "Form saves; template appears in list; tasks show role badges and offsets"
      edge_cases:
        - "Zero tasks → validation error"
        - "Offset 0 → displayed as 'Day 1'"
        - "Duplicate task names → allowed"

    - id: "EXP-002"
      description: "New hire creation instantiates checklist with concrete due dates"
      validation: "Checklist generated from template; dates calculated; visible on onboarding page"
      edge_cases:
        - "Start date today → offset 0 tasks immediately due"
        - "Start date in past → overdue tasks flagged"
        - "Template modified after instantiation → no effect on existing"

    - id: "EXP-003"
      description: "Tasks can be marked complete with timestamp and user recorded"
      validation: "Checkbox toggles; timestamp recorded; progress recalculated"
      edge_cases:
        - "Uncheck → record removed; audit log retained"
        - "Completed by wrong role → allowed, flagged"
        - "All complete → status auto-updates"

  boundaries:
    - "Do not implement email notifications — that is SPEC-003"
    - "Do not implement document upload functionality — that is SPEC-004"
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

## Try It Yourself

1. Copy the Spec above into a file
2. Export it as Markdown (or just copy the YAML block)
3. Paste it into your AI coding agent (Claude Code, Copilot, etc.)
4. Compare the output quality to what you'd get from a typical user story like:
   > "As an HR coordinator, I want to manage onboarding checklists so that new hires have a structured first week."
