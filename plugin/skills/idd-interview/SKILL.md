---
name: idd-interview
license: Apache-2.0
description: Grill stakeholders in rounds to define an IDD Product — business purpose, audience, owner, vocabulary, decisions, open questions and technical context — and render a readable brief. Use when defining or deepening a product, not when implementing a Spec.
---

# Define an IDD Product

Run the interview in the stakeholder's current conversation. Reuse answers and
confirmed decisions already supplied; do not send the person through a second
interview in a background agent. Use the host's available question mechanism or
plain conversation for missing facts. Keep the user's chosen scope and language.

Resolve this stage's installed directory from the parent of its loaded entry path,
whether standalone SKILL.md or routed workflow.md. Read
[the Product template](references/product-template.md),
[the grilling discipline](references/grilling.md) and
[the brief template](references/brief-template.md). Run the bundled
[ID helper](scripts/idd-next-id) by its absolute resolved path, with the consuming
project as the working directory. Quote paths containing spaces. Installed files
are read-only resources; all artifact writes belong in the consuming project.
No global helper, plugin-root environment variable or other installed skill is
required. If Bash or a needed file operation is unavailable, explain the missing
capability without inventing a tool call.

1. Inspect existing Products and any explicitly named exploration or parent
   artifact. Resolve an existing product name/ID before editing it; otherwise
   create a new Product. Do not overwrite an unrelated Product. For an existing
   Product, keep its exact original bytes as the baseline and grill only its
   gaps: missing or empty fields, an empty glossary, open questions, child
   Expectations with fewer than two confirmed edge cases, and claims the project
   contradicts. Do not re-ask confirmed fields unless something contradicts them.
2. Look up the facts the project can answer before asking: stack and versions,
   architecture patterns, conventions and authentication model. Then grill the
   stakeholder in rounds as the grilling discipline describes, with a
   recommended answer for every question. Cover the problem and cost of leaving it
   unsolved, primary/secondary audience, measurable value, strategic alignment,
   accountable owner and the project's vocabulary. Record settled terms,
   decisions and open questions in the candidate as you go. A technical question
   the stakeholder will not decide becomes an open question with
   `needs: tech-lead`. Do not invent an owner's identity or turn an assumption
   into a stakeholder answer.
3. When the frontier is empty, summarize the proposed definition as the brief
   will show it, including glossary, decisions and open questions. Respect
   confirmation already given; obtain missing confirmation before saving. If the
   user explicitly delegates a choice, make a reasonable decision and identify it
   as delegated, not as a confirmed historical fact. Do not create artifact
   directories while waiting for input.
4. For a new Product, run `bash "<absolute-skill-directory>/scripts/idd-next-id" product`
   from the consuming project. The helper checks live exact/descriptive filenames;
   it cannot reserve IDs across concurrent branches or archive history. Check any
   existing ledger for the proposed ID and regenerate on collision. Recheck the
   destination before writing; never overwrite a file created in the meantime.
   For an existing Product, recheck its bytes against the baseline and stop
   without writing if it changed.
5. Before writing, establish an available duplicate-rejecting YAML parser or a
   checked duplicate-key loader and validate the proposed single document, matching
   product root, required nonempty fields, ID/file agreement, context types and
   the optional glossary, decisions and open_questions shapes in the template.
   If safe parsing cannot be assured, stop without artifact or directory writes.
   Then save one YAML document at docs/products/PROD-<hash>.yaml. Create only
   docs/products when needed. Keep status discovery for a new Product and omit
   optional exploration entirely when no lineage is known. If context explicitly
   names an EXPL ID, map, or parent's exploration field, resolve and preserve that
   ID; contradictory lineage needs a stakeholder decision. Do not save an empty
   exploration value. Omit empty optional lists rather than saving placeholders.
6. Reread the saved file and confirm it matches the validated document. A parser
   silently keeping the last key is insufficient. Then render the brief beside it
   from the saved artifacts, following the brief template, and reread it.
7. Show the saved paths, open questions by who must answer them, and any
   delegated decisions. Offer to publish the brief when the host supports it, and
   suggest defining outcomes (Intentions and Expectations) as the next workflow.
