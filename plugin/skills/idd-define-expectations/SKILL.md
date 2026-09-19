---
name: idd-define-expectations
license: Apache-2.0
description: Define confirmed draft Expectations for an IDD Intention, with measurable criteria and at least two explicitly confirmed edge cases.
---

# Define Expectations

Run mode **define-expectations** in the stakeholder's current conversation. Input: one Intention ID. Produce new draft Expectations and only their existing parent Intention expectations-list additions. Read [the shared authoring procedure](references/authoring.md) and [expectation template](references/expectation-template.md) before authoring. These resources and the [ID helper](scripts/idd-next-id) resolve relative to this installed skill; use absolute quoted paths and the consuming project as cwd. No other skill, plugin root, global helper or consumer dependency is required.

Reuse confirmed facts already supplied. Ask only for missing selection, decisions or confirmation; no directories or artifacts while awaiting answers. Drafting roles may return read-only proposals when explicitly supported, but this conversation owns stakeholder interaction, validation and saving. Apply the entire shared procedure, including the batch confirmation gate in accelerated modes. Content confirmation is not human peer review.

After verified saving, show actual paths/IDs, inherited context/lineage, confirmed edge-case counts and remaining review. Suggest the write-spec workflow as the next phase; its absence does not prevent this skill from completing its own outputs.
