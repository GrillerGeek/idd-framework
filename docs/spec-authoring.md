# Spec Authoring Guide

This guide covers how to write AI-ready Specs — the most important skill in Intent-Driven Development.

---

## The Spec Schema

```yaml
spec:
  id: "SPEC-001"
  product: "Customer Analytics Dashboard"
  intentions: ["INT-001"]
  expectations: ["EXP-001", "EXP-002"]
  status: draft | ready | in-progress | review | validating | done

  # CONTEXT — what the AI agent needs to know
  context:
    stack: "Node.js 20, TypeScript, React 18, PostgreSQL, Prisma ORM"
    patterns: "Vertical slice architecture, React Query for server state"
    conventions:
      - "All API routes return { data, error, meta } shape"
      - "Use Zod for request validation on all endpoints"
      - "Component-per-feature folder structure"
    existing_code_refs:
      - path: "/src/features/customers/"
        note: "Follow existing feature folder structure"
    auth: "OAuth 2.0 with JWT bearer tokens; role-based access"

  # EXPECTATIONS — what must be true when done
  expectations:
    - id: "EXP-001"
      description: "Health score displays as color-coded gauge"
      validation: "Gauge renders with correct color bands; value matches API"
      edge_cases:
        - "No data for customer → show 'Insufficient Data' state"
        - "Score on boundary (40, 70) → include in higher band"
    - id: "EXP-002"
      description: "Drill-down shows contributing metrics"
      validation: "Clicking gauge opens detail panel with metric breakdown"
      edge_cases:
        - "Single contributing metric → still renders in list layout"
        - "Metric value is null → show 'N/A' with tooltip explaining why"

  # BOUNDARIES — what the AI must NOT do
  boundaries:
    - "Do not modify the existing customer API endpoints"
    - "Do not introduce new npm packages without noting in PR description"
    - "Do not implement caching — that is a separate spec"
    - "Do not access the database directly from React components"

  # DELIVERABLES — what the AI should produce
  deliverables:
    - "Health score API endpoint with integration tests"
    - "HealthGauge React component with unit tests"
    - "DrillDown panel component with unit tests"
    - "React Query hooks for data fetching"
    - "PR description referencing this Spec ID"

  # VALIDATION — how we verify
  validation:
    automated:
      - "All Expectations have corresponding test coverage"
      - "API response matches defined schema"
      - "TypeScript compiles without errors"
    human_review:
      - "UX review of gauge interaction and drill-down"
      - "Data accuracy spot-check against source data"
      - "Code follows established patterns in existing feature folders"
```

---

## The Five Blocks

### 1. Context

**Purpose:** Give the AI agent everything it needs to produce code that fits your project.

Context should be inherited from the Product level. Only override when this Spec needs something different.

**Must include:**
- Technology stack with versions
- Architectural patterns in use
- Coding conventions (naming, file structure, response shapes)
- Authentication/authorization model
- References to existing code the AI should follow

**Common mistakes:**
- Saying "use our standard patterns" (AI doesn't know your standards)
- Omitting the auth model (AI will guess or skip it)
- Not referencing existing code (AI invents its own structure)

### 2. Expectations

**Purpose:** Define what must be true when the Spec is complete.

Each Expectation must have:
- A **description** of the required behavior
- **Validation criteria** that are pass/fail or measurable
- At least **2 edge cases** describing boundary conditions

**The edge case rule:** AI agents build the happy path well. Your quality lives in edge cases. If you only define the happy path, you'll get the happy path — and nothing else.

### 3. Boundaries

**Purpose:** Tell the AI what NOT to do.

This is the most commonly skipped block and the most commonly regretted omission. Without boundaries, AI agents will:
- Modify files you didn't want touched
- Add dependencies you didn't approve
- Implement adjacent features that aren't in scope
- Choose different patterns than your existing codebase

**Write boundaries as clear prohibitions:**
- "Do not modify any files in `/src/auth/`"
- "Do not add new database tables — use existing schema only"
- "Do not implement the admin view — that is SPEC-003"

### 4. Deliverables

**Purpose:** Make the definition of done concrete.

List every output the AI should produce:
- API endpoints
- UI components
- Database migrations
- Test files
- Configuration changes
- Documentation updates

If it's not in the deliverables list, the AI may not produce it.

### 5. Validation

**Purpose:** Define how to verify the Spec is complete and correct.

Split into two categories:

- **Automated:** Things tests can verify — API contracts, component rendering, data transformations
- **Human Review:** Things humans must evaluate — UX quality, architectural fit, data accuracy, security review

---

## Completeness Checklist

A Spec cannot enter **Ready** status until every item passes:

- [ ] **Context: stack** is non-empty
- [ ] **Context: patterns** is non-empty
- [ ] **Context: conventions** has at least one entry
- [ ] **Context: auth** is non-empty
- [ ] At least **one Expectation** is linked
- [ ] All Expectations have **validation criteria**
- [ ] All Expectations have **at least 2 edge cases**
- [ ] **Boundaries** block has at least one entry
- [ ] **Deliverables** block has at least one entry
- [ ] **Validation** block has at least one automated and one human review item
- [ ] Spec has been **peer-reviewed** by at least one other person

---

## Export Formats

Specs should be exportable in two formats:

### YAML Export
The canonical format. Valid YAML matching the schema above. Used for version control, tooling integration, and consumption by AI agents that accept structured input.

### Markdown Prompt Export
A single Markdown document optimized for pasting directly into an AI coding agent session. Includes:

- A preamble orienting the AI agent to the Spec structure
- All context rendered inline (no references to external files)
- Expectations as a numbered checklist
- Boundaries as a constraints section
- Deliverables as an output list
- Validation as a "definition of done" section

**Token warning:** If the Markdown export exceeds approximately 8,000 tokens, consider splitting the Spec into smaller units.

---

## Anti-Patterns

| Anti-Pattern | Why It's a Problem | Fix |
|---|---|---|
| "Make it responsive" with no detail | AI guesses at breakpoints and behavior | Specify breakpoints, layouts per size, and test criteria |
| Copy-pasting the same Context into every Spec | Drift between copies; maintenance burden | Use Product-level Context inheritance |
| Zero Boundaries | AI modifies anything it wants | Always include at least scope exclusions |
| One giant Spec covering an entire feature | Too much for AI to execute coherently | Split into Specs that each produce 1–3 deliverables |
| Expectations without edge cases | Happy path only | Minimum 2 edge cases per Expectation |
| Validation with only automated checks | UX and architecture issues slip through | Always include human review items |
