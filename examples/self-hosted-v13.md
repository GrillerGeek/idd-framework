# Worked Example: IDD Applied to Itself — The v1.3 Release

This is a real, unedited case study: the IDD v1.3 release (the gap-check gate and
managed execution stages) was built **using the IDD pipeline**, with the framework's
own repository as the product. Every artifact referenced below exists in this repo
under `docs/products/`, `docs/intentions/`, `docs/expectations/`, `docs/specs/`, and
`docs/reviews/`. Unlike the [onboarding portal example](onboarding-portal.md), which
is illustrative, this one is forensic — including the part where the process caught
its authors making things up.

## The Hierarchy

| Layer | Artifact(s) | Content |
|---|---|---|
| Product | `PROD-f67b` | The IDD Framework itself — problem: its calibrations lagged current AI capability; two leaks dominated (checklist verifies presence not quality; the Ready-Spec-to-agent handoff was unmanaged) |
| Intentions | `INT-08e4`, `INT-43b9`, `INT-0d38`, `INT-294f` | Machine-enforced Spec quality · managed execution stage · agent modernization · published guidance updated |
| Expectations | 12 (three per Intention) | Each with verifiable validation criteria and ≥2 real edge cases |
| Specs | `SPEC-c0d1`, `SPEC-8776`, `SPEC-e547`, `SPEC-bc1c` | One focused Spec per Intention, all five blocks complete |

## What the Gap-Check Gate Caught

All four Specs **passed the completeness checklist** — every block present, every
Expectation with validation criteria and edge cases. Then the adversarial gap-check
ran, simulating the implementing agent against each Spec.

**Result: all four Specs blocked. 16 Blockers, 20 Warnings.**

The findings were not writing-quality issues. They were *world-model errors* — the
Spec authors confidently described a reality that didn't exist:

- A Spec required registering new components in a manifest section **that does not
  exist** (the platform auto-discovers them). An implementing agent would have
  invented a non-standard structure.
- A Spec required enabling a configuration field **that the runtime does not
  support**. The feature would have been silently ignored.
- A Spec said "the nine existing command files." There are **ten**.
- A Spec required appending an annotation to a file **and** required that file to be
  byte-for-byte unchanged — a flat self-contradiction between two blocks.
- A Spec's only automated boundary check was structurally incapable of detecting
  violations (it diffed tracked files; the work created untracked ones).

None of these are visible to a presence checklist. All of them would have produced
confidently wrong implementations at machine speed — exactly the failure mode the
gate exists to prevent, caught **before any code was written**.

## The Fix Loop

Per doctrine, the gap-checker never edits a Spec. The Spec Author resolved every
finding *in the Specs* — verifying each disputed fact against the repository first —
then a second gap-check round re-verified all findings as genuinely resolved (one
finding needed a second pass: an automated check that could never pass because it
demanded zero tool-name matches in files that legitimately predate the rule; the fix
was a regression assertion — "no *new* matches" — with the pre-existing mentions
grandfathered).

Each Spec then received its annotation:

```yaml
  gap_check:
    status: "passed"
    blockers: 0
    warnings: 0
    rounds: 2
    report: "docs/reviews/gap-check-SPEC-c0d1.md"
    date: "2026-06-10"
```

## Managed Execution

After peer review moved the Specs to Ready, four implementing agents executed them
in parallel under the execution protocol: each restated its Spec's Boundaries before
the first file modification, implemented within them, self-verified against every
edge case, Boundary, and Deliverable, and filed an Execution Report
(`docs/reviews/execution-SPEC-*.md`).

Self-verification across the four runs: **65+ verification rows, zero violations,
zero missing deliverables.** Automated validation: all runnable checks passed.

The mandatory `spec_gaps_encountered` sections still earned their keep — five minor
gaps were logged (none blocker-grade), including a real process discovery: running
four Specs concurrently in one repository makes a global file-status diff ambiguous,
so each agent fell back to verifying its own tracked writes against its Deliverables
allowlist, and documented the adaptation. That observation now informs the guidance
that concurrent Spec execution needs per-run write tracking.

## What This Demonstrates

1. **The completeness checklist is a precondition, not a gate.** Four Specs that
   passed it carried 16 execution-breaking defects.
2. **Adversarial review finds different defects than authorship review.** The
   authors weren't careless — they were *confident*, and confidence is invisible
   from inside. Simulating the consumer exposed it.
3. **Gap-check findings per Spec is a real leading indicator.** First run: 4
   Blockers per Spec. Round two: zero. That delta is Spec-authoring skill becoming
   measurable (see [metrics.md](../docs/metrics.md)).
4. **The retro loop closes.** The execution reports' gap entries fed directly back
   into authoring guidance — within a single release cycle.

The gate ran clean on the second round and execution produced zero boundary
violations. The pipeline this example demonstrates is the pipeline that built it.
