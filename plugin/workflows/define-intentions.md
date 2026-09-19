---
name: idd-define-intentions
license: Apache-2.0
description: Define confirmed draft Intentions from an IDD Product, preserving purpose, priorities, dependencies and exploration lineage.
---

# Define Intentions

Run mode **define-intentions** in the stakeholder's current conversation. Input: one Product ID. Produce new draft Intentions only; expectations lists start empty. Read [the shared authoring procedure](references/authoring.md) and [intention template](references/intention-template.md) before authoring. These resources and the [ID helper](scripts/idd-next-id) resolve relative to this installed skill; use absolute quoted paths and the consuming project as cwd. No other skill, plugin root, global helper or consumer dependency is required.

Reuse confirmed facts already supplied. Ask only for missing selection, decisions or confirmation; no directories or artifacts while awaiting answers. Drafting roles may return read-only proposals when explicitly supported, but this conversation owns stakeholder interaction, validation and saving. Apply the entire shared procedure, including the batch confirmation gate in accelerated modes. Content confirmation is not human peer review.

After verified saving, show actual paths/IDs, inherited context/lineage, confirmed edge-case counts and remaining review. Suggest the define-expectations workflow as the next phase; its absence does not prevent this skill from completing its own outputs.
