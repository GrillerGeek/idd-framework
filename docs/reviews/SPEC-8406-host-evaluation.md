# Portable authoring host evaluation — SPEC-8406

Status: accepted for the measured standalone authoring lanes on 2026-09-13. All sixteen required actual-host observations passed final mechanical revalidation and independent full-trace review. Actual human peer review and native interactive aliases remain pending.

## Method and provenance

Each case installed only its selected skill into a fresh disposable project with spaces, removed the copy source, and preserved dirty user notes. Host models/configuration were unchanged. Each invocation was bounded to ten minutes and 4 MiB. Raw prompt, stdout/stderr, original result (including original oracle/evaluator and bundle hashes), and pre-run baseline remain in its evidence directory. Original receipts have not been rewritten. Current-oracle revalidation is separately retained at /tmp/idd-authoring-final-revalidation.json; oracle SHA-256: 8173809642aed0a9a8c729f50406f69bcfd4b15d22cbb8f3e48f66e60b85f92a.

The independent reviewers checked actual tool order and writes, safe YAML parsing, original-context binding, stakeholder confirmation, identity inventory, batch preflight, exact draft artifacts and full byte/type/mode preservation. Mechanical checks alone are not procedural certification.

## Accepted matrix

Evidence directory prefix: /var/folders/f0/_sscvrpd48s9srngb0d0l_mh0000gn/T/idd-authoring- followed by host-stage-variant-suffix. Each row is independently trace-accepted, including separately revalidated original oracle false negatives.

| Host | Stage | Variant | Suffix | Original receipt | Final oracle / trace |
|---|---|---|---|---|---|
| codex | define-intentions | happy | FrrtHB | passed | pass / accepted |
| claude | define-intentions | happy | oetAT6 | passed | pass / accepted |
| codex | define-expectations | happy | BZ0gFB | passed | pass / accepted |
| claude | define-expectations | happy | ZtfXb8 | failed | pass / accepted |
| codex | define-outcomes | happy | DjF9oX | passed | pass / accepted |
| claude | define-outcomes | happy | mAuCBJ | passed | pass / accepted |
| codex | quick-spec | happy | Mxathm | passed | pass / accepted |
| claude | quick-spec | happy | D5Muab | passed | pass / accepted |
| codex | write-spec | happy | herV8F | passed | pass / accepted |
| claude | write-spec | happy | AExnli | failed | pass / accepted |
| codex | define-expectations | missing-confirmation | G1PgDB | failed | pass / accepted |
| claude | define-expectations | missing-confirmation | 09gXwk | passed | pass / accepted |
| codex | define-outcomes | accelerated-rejected-edge | XB8KcK | passed | pass / accepted |
| claude | define-outcomes | accelerated-rejected-edge | qeC7lk | failed | pass / accepted |
| codex | quick-spec | accelerated-rejected-edge | bZeUFu | failed | pass / accepted |
| claude | quick-spec | accelerated-rejected-edge | enu3Ly | passed | pass / accepted |

## Failures, corrections and decisions

- Claude define-outcomes QiO8JH passed its output oracle but failed trace review: it created unowned scratch files under /tmp, did not bind the original parent at first context read, and omitted the final identity sweep. It remains failed. The mAuCBJ retry explicitly reinforced existing baseline/no-scratch/preflight instructions and passed full review.
- Codex quick-spec LxsLjs passed its output oracle but failed trace review: its final ID sweep iterated original filenames and could miss a new descriptive artifact incorporated into a later snapshot. It remains failed. Mxathm, with explicit current-filename enumeration in the reinforced prompt, captured the parent at first parse, rescanned live/archive IDs and exclusively created its validated batch; all twenty original entries were preserved.
- Claude ZtfXb8 and AExnli used valid descriptive new filenames. The initial oracle had silently required bare ID filenames. Author decision and independent fresh gap-check now explicitly allow ID plus an optional lowercase hyphenated slug; original failures are preserved and current revalidation passes.
- Codex G1PgDB used a valid candidate table; the initial numbered-list-only oracle was too narrow. Claude qeC7lk used “needs 2”; Codex bZeUFu used singular “edge” with an explicit two minimum. Semantic confirmation/refusal requirements are unchanged; regression tests cover the accepted forms.
- Claude D5Muab/AExnli prove no new collision in these fixtures through unchanged original files/ledger and exclusive creation of previously absent output directories. This is fixture-specific evidence, not arbitrary concurrent-directory safety.
- A Codex matrix startup stopped on stale generated output during a source rebuild. No model invocation began for that case; it was rerun after assembly. This is a tooling setup interruption, not host behavior evidence.

## What the evidence establishes

Both hosts demonstrated five standalone happy paths, missing edge confirmation, and rejection below the two-edge minimum in both accelerated workflows. Confirmed strings, lineage, draft lifecycle, parent backlinks and dirty notes are checked. New Spec content confirmation never became human peer review or readiness. Copy-source removal was real. The sixteen accepted observations include two reinforced-prompt retries, so ordinary invocation reliability across all contexts is not claimed.

All 185 offline tests pass on Node 25.8.1 and minimum Node 22.20.0. Installer probes are independently reported in the Execution Report. The concurrency fixtures exercise a synthetic preservation/partial-report oracle; no production transactional writer or real interleaving was tested. Safe tool availability remains a documented host prerequisite.

## Remaining gates

Human content/implementation review, native Claude aliases and drafting-model dispatch, further host variability, and complete release acceptance remain separate work. No personal installation/settings, credentials, external marketplace, push, tag or release changed.
