# Roles and Responsibilities

IDD redefines team roles to reflect the shift from coding-centric to specification-centric workflows.

---

## Product Owner

**Focus:** Defines Products and Intentions; prioritizes the Spec queue; validates outcomes against Intentions.

**Change from Traditional:** Less time grooming backlogs and writing user stories. More time defining what the product should accomplish and validating that AI-generated output actually fulfills those Intentions. The PO's judgment about *what matters* is more critical than ever because AI can build anything — the question is whether it's the right thing.

**Key Activities:**
- Author and maintain Product definitions
- Define Intentions with clear rationale and priority
- Prioritize the Spec queue continuously (not just at sprint planning)
- Participate in Validation Reviews to confirm Expectations are met
- Decide when an Intention is fulfilled

---

## Spec Author

**Focus:** Translates Intentions into Expectations; produces AI-ready Specs; ensures specs contain enough context for autonomous execution.

**Change from Traditional:** This is a **new role** that doesn't exist in traditional agile. It's a hybrid of a business analyst (who understands the domain and the "why") and a senior developer (who understands how AI agents consume instructions and what makes a spec unambiguous). The Spec Author's primary question is: *"If a developer picked this up with no other context, could they make every implementation decision without asking anyone?"* If the answer is no, the Spec isn't done. This is the most critical skill gap teams will face when adopting IDD.

**Key Activities:**
- Decompose Intentions into verifiable Expectations with edge cases
- Author Specs with complete Context, Boundaries, Deliverables, and Validation blocks
- Ensure Specs pass the completeness checklist before entering Ready
- Collaborate with Tech Lead on Context block accuracy
- Iterate on Specs when AI output reveals gaps

**Skills Required:**
- Domain knowledge sufficient to write meaningful Expectations
- Technical fluency to understand stack, patterns, and conventions
- Ability to think in edge cases and boundary conditions
- Clear, structured writing (the Spec is essentially a prompt)

---

## Tech Lead

**Focus:** Reviews Specs for architectural fit; reviews AI output for pattern compliance; manages Boundaries.

**Change from Traditional:** Significantly less hands-on coding. The Tech Lead's primary value shifts to architectural governance — ensuring that what AI builds fits together, follows established patterns, and doesn't introduce drift. This is a design and review role, not a build role.

**Key Activities:**
- Co-author the Context block with the Spec Author (stack, patterns, conventions)
- Review Specs for architectural feasibility before they enter Ready
- Review AI-generated code against Boundaries and established patterns
- Conduct Architecture Check meetings (weekly)
- Make go/no-go decisions on gate overrides

---

## Developer

**Focus:** Makes implementation decisions autonomously within the context of a Spec; partners with AI agents during execution; handles edge cases AI cannot resolve.

**Change from Traditional:** In traditional agile, developers are often blocked waiting for clarification — "what did the PO mean by this story?" "is this edge case in scope?" In IDD, the Spec provides enough context that developers can answer these questions themselves. The developer's role shifts from *waiting for instructions and building* to *making autonomous decisions within clear boundaries and reviewing AI output*. This is an elevation, not a reduction — developers exercise more judgment, not less.

**Key Activities:**
- Execute Specs by orchestrating AI agents (Claude Code, Copilot, Kiro, etc.)
- Review AI-generated code for correctness, quality, and pattern compliance
- Handle cases where AI output needs manual intervention
- Write and maintain automated tests
- Provide feedback to Spec Authors when Specs are unclear or incomplete

---

## AI Agent

**Focus:** Executes against Specs; produces code, tests, and documentation as defined in Deliverables.

**Change from Traditional:** AI agents are treated as a defined team member with specific inputs (Specs) and outputs (Deliverables). They are not magic — they are as good as the Specs they receive.

**Inputs:** AI-ready Spec (YAML or Markdown export)
**Outputs:** Code, tests, documentation as defined in Deliverables block
**Constraints:** Bounded by the Spec's Boundaries block

---

## Reviewer

**Focus:** Conducts human review against Expectations and Boundaries; approves or returns with feedback.

**Change from Traditional:** Review volume increases significantly because AI generates code faster than humans can review it. However, review criteria become clearer because the Spec provides explicit Expectations and Boundaries to review against — it's no longer subjective.

**Key Activities:**
- Review AI output against Expectations: does it do what the Spec says?
- Review against Boundaries: did it touch things it shouldn't have?
- Review for architectural fit, code quality, and test coverage
- Approve or return with specific, Spec-referenced feedback

---

## Team Composition

A typical IDD team might look like:

| Role | Count | Notes |
|---|---|---|
| Product Owner | 1 | May span multiple Products |
| Spec Author | 1–2 | The critical new skill; may be a senior developer growing into the role |
| Tech Lead | 1 | Reviews architecture and Boundaries |
| Developer | 2–4 | AI collaborators and reviewers |
| AI Agent | N/A | Tool, not headcount — but treated as a team member with defined I/O |

The **Spec Author to Developer ratio** will likely invert over time. As AI agents handle more execution, teams need more people defining *what* to build and fewer people *building* it.
