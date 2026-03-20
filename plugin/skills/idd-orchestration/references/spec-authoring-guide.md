# Spec Authoring Guide

Best practices for writing AI-ready Specs — the most important skill in Intent-Driven Development.

## The Core Principle

A Spec should contain everything an AI agent needs to produce correct, reviewable output without asking clarifying questions. If the AI agent needs to guess, the Spec is incomplete.

## Writing Each Block

### Context Block

Give the AI everything it needs to produce code that fits your project.

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

### Expectations Block

Each Expectation must have:
- A **description** of the required behavior
- **Validation criteria** that are pass/fail or measurable
- At least **2 edge cases** describing boundary conditions

**The edge case rule:** AI agents build the happy path well. Your quality lives in edge cases.

### Boundaries Block

The most commonly skipped block and the most commonly regretted omission. Without boundaries, AI agents will:
- Modify files you didn't want touched
- Add dependencies you didn't approve
- Implement adjacent features that aren't in scope
- Choose different patterns than your existing codebase

**Write boundaries as clear prohibitions:**
- "Do not modify any files in `/src/auth/`"
- "Do not add new database tables — use existing schema only"
- "Do not implement the admin view — that is SPEC-003"

### Deliverables Block

List every output the AI should produce. If it's not in the deliverables list, the AI may not produce it.

### Validation Block

Split into:
- **Automated:** Things tests can verify
- **Human Review:** Things humans must evaluate (UX quality, architectural fit, data accuracy)

## Anti-Patterns

| Anti-Pattern | Why It's a Problem | Fix |
|---|---|---|
| "Make it responsive" with no detail | AI guesses at breakpoints and behavior | Specify breakpoints, layouts, and test criteria |
| Copy-pasting Context into every Spec | Drift between copies; maintenance burden | Use Product-level Context inheritance |
| Zero Boundaries | AI modifies anything it wants | Always include at least scope exclusions |
| One giant Spec covering an entire feature | Too much for AI to execute coherently | Split into Specs with 1-3 deliverables each |
| Expectations without edge cases | Happy path only | Minimum 2 edge cases per Expectation |
| Validation with only automated checks | UX and architecture issues slip through | Always include human review items |

## Token Warning

If a Spec's Markdown export exceeds approximately 8,000 tokens, consider splitting it into smaller units.
