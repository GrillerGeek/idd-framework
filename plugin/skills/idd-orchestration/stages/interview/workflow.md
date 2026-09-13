---
name: idd-interview
license: Apache-2.0
description: Interview stakeholders and create an IDD Product definition with business purpose, audience, owner and technical context. Use when defining a product, not when implementing a Spec.
---

# Define an IDD Product

Run the interview in the stakeholder's current conversation. Reuse answers and
confirmed decisions already supplied; do not send the person through a second
interview in a background agent. Use the host's available question mechanism or
plain conversation for missing facts. Keep the user's chosen scope and language.

Resolve this stage's installed directory from the parent of its loaded entry path,
whether standalone SKILL.md or routed workflow.md. Read
[the Product template](references/product-template.md). Run the bundled
[ID helper](scripts/idd-next-id) by its absolute resolved path, with the consuming
project as the working directory. Quote paths containing spaces. Installed files
are read-only resources; all artifact writes belong in the consuming project.
No global helper, plugin-root environment variable or other installed skill is
required. If Bash or a needed file operation is unavailable, explain the missing
capability without inventing a tool call.

1. Inspect existing Products and any explicitly named exploration or parent
   artifact. Resolve an existing product name/ID before editing it; otherwise
   create a new Product. Do not overwrite an unrelated Product.
2. Capture the problem and cost of leaving it unsolved, primary/secondary audience,
   measurable value, strategic alignment and accountable owner. Capture stack
   versions, architecture patterns, conventions and authentication model. Ask
   only about missing or ambiguous facts, one focused question at a time. Do not
   invent an owner's identity or turn an assumption into a stakeholder answer.
3. Summarize the proposed definition. Respect confirmation already given; obtain
   missing confirmation before saving. If the user explicitly delegates a choice,
   make a reasonable decision and identify it as an assumption, not a confirmed
   historical fact. Do not create artifact directories while waiting for input.
4. For a new Product, run `bash "<absolute-skill-directory>/scripts/idd-next-id" product`
   from the consuming project. The helper checks live exact/descriptive filenames;
   it cannot reserve IDs across concurrent branches or archive history. Check any
   existing ledger for the proposed ID and regenerate on collision. Recheck the
   destination before writing; never overwrite a file created in the meantime.
5. Before writing, establish an available duplicate-rejecting YAML parser or a
   checked duplicate-key loader and validate the proposed single document, matching
   product root, required nonempty fields, ID/file agreement and context types.
   If safe parsing cannot be assured, stop without artifact or directory writes.
   Then save one YAML document at docs/products/PROD-<hash>.yaml. Create only
   docs/products when needed. Keep status discovery and omit optional exploration
   entirely when no lineage is known. If context explicitly names an EXPL ID,
   map, or parent's exploration field, resolve and preserve that ID; contradictory
   lineage needs a stakeholder decision. Do not save an empty exploration value.
6. Reread the saved file and confirm it matches the validated document. A parser
   silently keeping the last key is insufficient. Show the saved path and any
   recorded assumptions, and suggest defining Intentions as the next workflow.
