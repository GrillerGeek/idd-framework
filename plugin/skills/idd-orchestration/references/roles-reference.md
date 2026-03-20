# IDD Roles Reference

IDD defines six roles that reflect the shift from coding-centric to specification-centric workflows.

## Product Owner

**Focus:** Defines Products and Intentions; prioritizes the Spec queue; validates outcomes against Intentions.

**Key Activities:**
- Author and maintain Product definitions
- Define Intentions with clear rationale and priority
- Prioritize the Spec queue continuously
- Participate in Validation Reviews to confirm Expectations are met
- Decide when an Intention is fulfilled

**Change from Traditional:** Less backlog grooming and user stories. More defining what the product should accomplish and validating AI-generated output.

## Spec Author

**Focus:** Translates Intentions into Expectations; produces AI-ready Specs with complete context for autonomous execution.

**Key Activities:**
- Decompose Intentions into verifiable Expectations with edge cases
- Author Specs with complete Context, Boundaries, Deliverables, and Validation blocks
- Ensure Specs pass the completeness checklist before entering Ready
- Collaborate with Tech Lead on Context block accuracy
- Iterate on Specs when AI output reveals gaps

**Skills Required:** Domain knowledge, technical fluency, edge-case thinking, clear structured writing.

**This is a new role** that doesn't exist in traditional agile — a hybrid of business analyst and senior developer.

## Tech Lead

**Focus:** Reviews Specs for architectural fit; reviews AI output for pattern compliance; manages Boundaries.

**Key Activities:**
- Co-author the Context block with the Spec Author
- Review Specs for architectural feasibility before Ready
- Review AI-generated code against Boundaries and established patterns
- Conduct Architecture Check meetings
- Make go/no-go decisions on gate overrides

**Change from Traditional:** Less hands-on coding. Primary value shifts to architectural governance.

## Developer

**Focus:** Makes implementation decisions autonomously within Spec context; partners with AI agents during execution.

**Key Activities:**
- Execute Specs by orchestrating AI agents
- Review AI-generated code for correctness and pattern compliance
- Handle cases where AI output needs manual intervention
- Write and maintain automated tests
- Provide feedback when Specs are unclear

**Change from Traditional:** From "waiting for instructions and building" to "making autonomous decisions within clear boundaries and reviewing AI output."

## AI Agent

**Focus:** Executes against Specs; produces code, tests, and documentation as defined in Deliverables.

- **Inputs:** AI-ready Spec (YAML or Markdown export)
- **Outputs:** Code, tests, documentation as defined in Deliverables
- **Constraints:** Bounded by the Spec's Boundaries block

## Reviewer

**Focus:** Conducts human review against Expectations and Boundaries; approves or returns with feedback.

**Key Activities:**
- Review AI output against Expectations: does it do what the Spec says?
- Review against Boundaries: did it touch things it shouldn't have?
- Review for architectural fit, code quality, and test coverage
- Approve or return with specific, Spec-referenced feedback

**Change from Traditional:** Review volume increases (AI generates faster), but criteria become clearer (Spec provides explicit Expectations and Boundaries).

## Typical Team Composition

| Role | Count | Notes |
|------|-------|-------|
| Product Owner | 1 | May span multiple Products |
| Spec Author | 1-2 | The critical new skill |
| Tech Lead | 1 | Reviews architecture and Boundaries |
| Developer | 2-4 | AI collaborators and reviewers |
| AI Agent | N/A | Tool, not headcount |
