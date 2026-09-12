# GitHub Copilot Instructions — IDD Framework

This repository contains IDD documentation, YAML artifacts, and a Claude plugin with Bash helpers. Read the [shared contributor guide](../docs/contributing-agents.md) for maintenance, licensing and available validation; assessments and planning do not automatically invoke managed Spec execution.

## IDD Workflow Knowledge

Read [AGENTS.md](../AGENTS.md) at the repository root for the complete IDD artifact schemas, workflow phases, completeness checklist, and generation rules. That file is the canonical reference for all AI agents working with this framework.

## When Generating IDD Artifacts

- Use the YAML schemas defined in `AGENTS.md`
- Save hierarchy artifacts to `docs/` subdirectories (products/, intentions/, expectations/, specs/, reviews/). Phase-0 maps are at `docs/explorations/EXPL-<id>-<slug>/map.md` with decision tickets. Archived records live in `docs/idd-ledger.yaml` when present; recover full text from the archive Git tag.
- Generate artifact IDs by running `idd-next-id <type>` from `plugin/bin/` (e.g., `idd-next-id expectation` → `EXP-9b04`). If the script is unavailable, generate a random 4-character hex suffix instead. **Never use sequential numbers** (EXP-001, EXP-002, INT-001, etc.)
- Every Expectation needs at least 2 edge cases
- Every Spec needs all 5 blocks: Context, Expectations, Boundaries, Deliverables, Validation
- Require all eleven completeness items including actual human peer review for Ready; AI approval alone is insufficient. Follow the shared lifecycle contract for the additional clean gap-check execution gate.

## When Editing Framework Documentation

Follow [shared source ownership and editing conventions](../docs/contributing-agents.md). Framework docs use CC BY-SA 4.0; plugin contents use Apache 2.0.
