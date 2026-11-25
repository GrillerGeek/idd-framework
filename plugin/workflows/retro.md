---
name: idd-retro
license: Apache-2.0
description: Propose evidence-traced improvements after a Spec is validated — Product context, glossary, checks and upstream feedback — and apply only what a human approves. Use after review-spec and before archive.
---

# Run a Spec retro

Run the bundled [retro procedure](references/retro.md) in the current
conversation for one Spec. Read it and the [Spec contract](references/spec-reference.md)
before acting. Resolve this stage's installed directory from the parent of its
loaded entry path; installed resources, including the [ID helper](scripts/idd-next-id),
are read-only, and every write belongs in the consuming project. No other skill,
plugin root or global helper is required.

Evidence gathering is read-only. Optional helpers may collect evidence when the
host offers them, but this conversation owns candidate selection, every human
decision and every write. Apply nothing without explicit approval of that
candidate. Missing parsers, files or capabilities are reported as limitations,
never worked around by guessing.

Finish by showing the report path, the approved and rejected candidates, the
changes applied and any upstream feedback. Suggest archive as the next phase.
