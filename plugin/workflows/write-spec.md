---
name: idd-write-spec
license: Apache-2.0
description: Create a draft five-block IDD Spec from selected Expectations with common Product context, confirmed boundaries and exact embedded edge cases.
---

# Write a Spec

Run mode **write-spec** in the stakeholder's current conversation. Input: one or more Expectation IDs. Produce a new draft Spec. Intentions and Expectations stay unchanged; the only permitted parent change is adding Product grilling records when an open question is answered, followed by a brief re-render. Read [the shared authoring procedure](references/authoring.md) and [Spec contract](references/spec-reference.md) before authoring. Also read [the grilling discipline](references/grilling.md) and [the brief template](references/brief-template.md). These resources and the [ID helper](scripts/idd-next-id) resolve relative to this installed skill; use absolute quoted paths and the consuming project as cwd. No other skill, plugin root, global helper or consumer dependency is required.

Reuse confirmed facts already supplied. Ask only for missing selection, decisions or confirmation; no directories or artifacts while awaiting answers. Drafting roles may return read-only proposals when explicitly supported, but this conversation owns stakeholder interaction, validation and saving. Apply the entire shared procedure, including the batch confirmation gate in accelerated modes. Content confirmation is not human peer review.

After verified saving, show actual paths/IDs, inherited context/lineage, confirmed edge-case counts and remaining review. Suggest the tech-review workflow as the next phase; its absence does not prevent this skill from completing its own outputs.
