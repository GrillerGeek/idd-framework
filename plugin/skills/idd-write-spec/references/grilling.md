# Grilling interview discipline

Use this discipline whenever a stage interviews a stakeholder. The goal is a
shared understanding a developer can build from without returning to the
stakeholder, recorded in the artifacts rather than left in the conversation.

## Design tree and rounds

Treat the work as a tree of decisions: each decision opens the decisions that
depend on it. The **frontier** is every open decision whose prerequisites are
already settled.

Ask in **rounds**. One round asks the whole frontier at once:

```
Q1 — <short title>: <question, including the realistic options>
Recommended: <your recommended answer and the one-line reason>

Q2 — ...
```

- Number every question and give a **recommended answer** for each.
- Word each question so that "yes" accepts the recommendation.
- A question whose answer depends on another question still open in this round
  belongs to a later round.
- Keep rounds readable. When the frontier is large, ask the highest-impact
  questions first and say how many remain.
- After each round, recompute the frontier from the answers and ask the next
  round.

## What counts as confirmation

- An explicit "yes" to a numbered recommendation, or an explicit answer,
  confirms that item.
- A bulk reply such as "yes to all" confirms every item in that round.
- **Silence confirms nothing.** An unanswered item stays open. Never treat an
  agent proposal, a passing check or a missing objection as a stakeholder answer.
- An item the stakeholder explicitly delegates ("you decide") is recorded as a
  decision made by delegation, naming who delegated it.

## Facts versus decisions

Finding **facts** is your job; making **decisions** is the stakeholder's.

- Look up facts the project can answer: stack and versions, conventions,
  authentication, existing code, existing artifacts. Use a read-only helper when
  the host offers one; otherwise read directly. A pending lookup blocks only the
  questions that depend on it; ask the rest of the frontier now.
- Put decisions to the stakeholder: problem, audience, value, scope, priority,
  vocabulary, trade-offs and acceptable behaviour at the edges.

## Technical questions a stakeholder cannot answer

A product manager is not expected to decide architecture. When a technical
question is not settled by the project and the stakeholder does not want to
decide it, record it as an open question with `needs: tech-lead`. Do not guess,
and do not block the rest of the interview on it. The stakeholder may still
answer it if they choose.

## Vocabulary

- When a term conflicts with the Product glossary, say so at once: "The glossary
  defines *hold* as X, but you seem to mean Y. Which is it?"
- When a word is vague or overloaded, propose one canonical term.
- When a term is settled, add it to the candidate glossary immediately: `term`,
  one tight `definition`, and any words to `avoid`. The glossary holds
  vocabulary only — no implementation detail, no requirements prose.

## Scenarios and contradictions

- Stress-test relationships with concrete scenarios that probe the edges:
  "Two people hold the last site at the same second. Who gets it?"
- When a stakeholder claim contradicts the project ("the code cancels whole
  orders, but you said partial cancellation is possible"), surface it as a
  question. Never silently pick one side.

## Recording decisions

- Record a stakeholder decision in the candidate `decisions` list, with
  `decided_by` and `decided_at`, when it settles something the Product's
  fields do not already say: scope, priority, a trade-off, a rejected option,
  a constraint, or the answer to an open question.
  Do not restate the Product's own fields as decisions; name, owner, problem,
  audience, value, alignment and context are already recorded where they live. No real choices is fine: leave
  `decisions` empty.
- Give a decision a full entry — `alternatives` and `rationale` — only when all
  three are true: it is hard to reverse, it would surprise a later reader
  without context, and it was a real trade-off between genuine options.
- When an answer resolves an open question, remove the question and add a
  decision with `resolves: <Q-id>`.
- Omit an empty `relates_to`; a question with no `relates_to` concerns the
  whole Product.
- Decision and question IDs are `D-` or `Q-` plus four random lowercase hex
  characters, unique within the Product.

## When the interview is done

The interview is done when the frontier is empty — every branch visited,
nothing silently assumed, and every remaining open item recorded as an open
question — **and** the stakeholder confirms the shared understanding. Summarize
the result as the brief will show it, then apply the stage's normal validation,
confirmation and save rules. Grilling never bypasses them.
