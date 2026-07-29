---
name: IDD Orchestration
description: This skill should be used when the user asks to "start IDD", "chart an exploration", "too foggy to interview", "use intent-driven development", "set up IDD workflow", "define a product", "write intentions", "create expectations", "author a spec", "review a spec", "run the IDD process", or invokes any /idd-framework:* command. Orchestrates the Intent-Driven Development workflow for AI-augmented teams.
---

# IDD Orchestration

Intent-Driven Development decomposes purpose into four levels — Product, Intention, Expectation, and Spec — giving developers and AI agents the context they need to make implementation decisions independently.

## Workflow Phases

| Phase | Command | Agent | Artifact | Output Path |
|-------|---------|-------|----------|-------------|
| 0. Chart (optional) | `/idd-framework:chart` | exploration-charter | Exploration map + decision tickets | `docs/explorations/` |
| 1. Interview | `/idd-framework:interview` | product-interviewer | Product definition | `docs/products/` |
| 2. Intentions | `/idd-framework:define-intentions` | intention-author | Intention artifacts | `docs/intentions/` |
| 3. Expectations | `/idd-framework:define-expectations` | expectation-author | Expectation artifacts | `docs/expectations/` |
| 4. Spec | `/idd-framework:write-spec` | spec-author | Spec artifact | `docs/specs/` |
| 5. Tech Review | `/idd-framework:tech-review` | tech-lead-reviewer | Review annotations | `docs/specs/` (updates) |
| 6. Gap-Check | `/idd-framework:gap-check` | gap-checker | Gap-check report + `gap_check` annotation | `docs/reviews/` + annotation in `docs/specs/` |
| 7. Implementation | `/idd-framework:implement-spec` | spec-implementer | Deliverables + Execution Report | Codebase + `docs/reviews/` |
| 8. Validation | `/idd-framework:review-spec` | spec-reviewer | Validation report | `docs/reviews/` |
| 9. Archival | `/idd-framework:archive` | idd-archivist | Archive manifest, then ledger records | `docs/reviews/` (manifest) + `docs/idd-ledger.yaml` |

**Accelerated workflows:**
- `/idd-framework:define-outcomes` — Combines Intentions + Expectations in one session
- `/idd-framework:quick-spec` — Produces Intentions + Expectations + Spec in one session
- `/idd-framework:deep-review` — Multi-perspective review using Agent Teams

## Phase 0 — Explorations

Efforts too foggy for `/interview` start as an **Exploration** (`docs/explorations/EXPL-<id>-<slug>/`): a map of decision tickets worked one per session via `/resolve` until `status: clear`, then seeded into `/interview` or `/quick-spec`. Downstream artifacts carry the `exploration:` lineage field. Format and rules: `references/exploration-template.md`.

## Entry Points

Users can enter the workflow at any phase:

- **Too foggy to interview?** Start with `/idd-framework:chart` — chart the fog, then `/idd-framework:resolve` one decision per session until the way is clear
- **Full pipeline:** Start with `/idd-framework:interview`
- **Already have a product?** Start at `/idd-framework:define-intentions`
- **Have intentions?** Start at `/idd-framework:define-expectations`
- **Have expectations?** Start at `/idd-framework:write-spec`
- **Have a spec to review?** Start at `/idd-framework:tech-review`
- **Have a spec ready to gate?** Run `/idd-framework:gap-check` — every Spec passes the gap-check gate before execution
- **Have a gated spec to build?** Run `/idd-framework:implement-spec`
- **Have AI output to validate?** Start at `/idd-framework:review-spec`
- **Artifact dirs overflowing with finished work?** Run `/idd-framework:archive`

## Archival

Terminal artifacts (Intentions `fulfilled`, Expectations `done`/`validated`, Specs `done`, and anything `superseded` or `deferred`) are consolidated by `/idd-framework:archive`: each is distilled to a compact record in `docs/idd-ledger.yaml` and its YAML file is **deleted**, keeping the active directories — and therefore discovery globs, gap-checks, and counts — limited to live work. Nothing is lost: every archive run tags HEAD first, so any artifact's full text is recoverable with `git show <tag>:<path>`. There is no `archived` lifecycle status; archived artifacts cease to exist on disk by design. The flow is two-step: classify (read-only manifest for human review) then `--apply` (tag → ledger → delete → commit). Schema and classification rules: `references/ledger-reference.md`.

## Agents

| Agent | Color | Model | Role |
|-------|-------|-------|------|
| `idd-exploration-charter` | green | **sonnet** | Charts phase-0 Exploration maps from loose ideas |
| `idd-exploration-resolver` | orange | **sonnet** | Resolves one Exploration decision ticket per session |
| `idd-product-interviewer` | blue | **haiku** | Interviews stakeholder to capture Product artifact |
| `idd-intention-author` | green | **haiku** | Guides Product Owner to decompose Product into Intentions |
| `idd-expectation-author` | yellow | **haiku** | Defines verifiable Expectations with edge cases |
| `idd-outcome-author` | green | **sonnet** | Defines Intentions + Expectations in one session |
| `idd-spec-author` | cyan | **sonnet** | Creates AI-ready Specs with all 5 mandatory blocks |
| `idd-quick-spec-author` | cyan | **sonnet** | Produces INT + EXP + SPEC in one session |
| `idd-spec-reviewer` | red | **sonnet** | Validates AI output against Spec criteria |
| `idd-tech-lead-reviewer` | magenta | **opus** | Reviews Specs for architectural feasibility |
| `idd-deep-review-lead` | magenta | **opus** | Multi-perspective Spec review (parallel by default) |
| `idd-gap-checker` | red | **opus** | Adversarial pre-execution gate: simulates the implementing agent, reports Blocker/Warning findings (report-only) |
| `idd-spec-implementer` | orange | **sonnet** | Executes a gated Spec: restates Boundaries, implements, self-verifies, emits Execution Report |
| `idd-archivist` | purple | **sonnet** | Consolidates terminal artifacts into the roll-up ledger: classify (manifest) + apply (distill records) |

## CRITICAL: Model Dispatch Rule

**When dispatching any `idd-*` subagent (via the Agent or Task tool), you MUST explicitly pass the `model` parameter in the tool call, matching the agent's tier above.** Do NOT rely on the subagent's frontmatter `model:` field alone — in practice, orchestrators frequently dispatch subagents with the parent session's model unless the model is set explicitly at dispatch time. This defeats the plugin's cost-optimization design and can turn a cheap Haiku interview into an expensive Opus run.

Correct pattern (pseudocode):
```
Agent({
  subagent_type: "idd-intention-author",
  model: "haiku",                         // REQUIRED — match the table above
  prompt: "...",
})
```

If you are invoking one of these subagents and are unsure of the tier, read the agent's frontmatter file at `plugin/agents/<name>.md` and use the `model:` value there as the source of truth. The per-command `.md` files under `plugin/commands/` also state the required model inline.
