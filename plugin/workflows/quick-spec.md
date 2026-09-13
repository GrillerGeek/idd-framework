---
name: idd-quick-spec
license: Apache-2.0
description: Author a linked draft Intention, Expectation and five-block Spec batch from a Product and confirmed feature outcome; preserve stakeholder confirmation before saving.
---

# Create a Quick Spec

Run mode **quick-spec** in the stakeholder's current conversation. Input: one Product ID and a feature/outcome description. Produce new draft Intentions, Expectations and a cohesive five-block Spec; no implementation code. Read [the shared authoring procedure](references/authoring.md) and [intention template](references/intention-template.md), [expectation template](references/expectation-template.md), [Spec contract](references/spec-reference.md) before authoring. These resources and the [ID helper](scripts/idd-next-id) resolve relative to this installed skill; use absolute quoted paths and the consuming project as cwd. No other skill, plugin root, global helper or consumer dependency is required.

Reuse confirmed facts already supplied. Ask only for missing selection, decisions or confirmation; no directories or artifacts while awaiting answers. Drafting roles may return read-only proposals when explicitly supported, but this conversation owns stakeholder interaction, validation and saving. Apply the entire shared procedure, including the batch confirmation gate in accelerated modes. Content confirmation is not human peer review.

After verified saving, show actual paths/IDs, inherited context/lineage, confirmed edge-case counts and remaining review. Suggest the tech-review workflow as the next phase; its absence does not prevent this skill from completing its own outputs.
