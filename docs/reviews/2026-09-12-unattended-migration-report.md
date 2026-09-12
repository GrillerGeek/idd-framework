# Unattended migration catch-up report

Status: work in progress. Updated as implementation and evaluation proceed.

## Requested outcome and authorization

The migration moves IDD toward complete portable skills usable in Codex and Claude Code, while preserving existing Claude aliases. The accepted sequence is contributor contract, reproducible packaging, three-workflow pilot, remaining workflow conversion, native distribution, and release verification.

On 2026-09-12 Jason asked to continue while away, make decisions using past direction, document those decisions, and produce a comprehensive catch-up report. This authorizes continued local implementation and verification. It does not authorize a release, remote push, personal installation changes, or invented human approval.

## Starting point

Branch: `codex/portable-skills`. Clean baseline: `f81c88d`.

- Milestone 1 (`SPEC-5113`): contributor guidance and consistent lifecycle/gap-check contract, implemented in `2f9c1d8`, in review.
- Milestone 2 (`SPEC-bffd`): deterministic assembly, structural validation, helper fixes, CI and isolated installer probes, implemented in `ea0c878`, in review.
- Baseline verification: 67 tests passing on Node 22.20.0 and 25.8.1; synthetic Codex/Claude installations pass in copy/symlink modes. Existing Claude bundle bytes are preserved.
- No real portable workflow had been shipped or exercised at the starting point.

## Decisions made while you were away

| Decision | Reason and scope |
|---|---|
| Proceed without another approval pause for this migration session | Your explicit unattended-work instruction supersedes waiting for each new implementation decision. New Specs retain `peer_review: pending` and record a session authorization. This is an exception for this work, not a claim you reviewed unseen text, and is not added to shipped workflow rules. |
| Pilot interview, gap-check and implementation before bulk conversion | These exercise stakeholder interaction, adversarial report-only review, and the strict execution gate; errors here would spread through the remaining stages. |
| Keep the legacy router intact until the catalog is ported | Avoid advertising a partially portable router or breaking its existing resource paths. Mark the three new catalog entries `pilot`, with the other twelve still planned. |
| Keep Node/npm dependencies in maintainer tooling | Installed workflow skills use bundled Markdown and existing Bash helpers; they do not require adding a package.json or runtime dependency to a consuming project. |
| Preserve Claude command and agent metadata, adapt bodies only | Existing aliases and reviewer/implementer model choices remain in Claude adapters. Interview runs in the stakeholder conversation so supplied answers are retained. |
| Separate deterministic tests from fresh host behavior evidence | File installation proves resource closure; only actual sessions can demonstrate workflow execution. Missing authentication or service access is a blocker to certification, not a pass. |
| Retain local commits and prepare reviewable evidence | No push, tag, release, marketplace update or personal installation mutation is implied by continued implementation. |

## Current work packet

[SPEC-b2e3](../specs/SPEC-b2e3.yaml) defines the portable pilot and records the unattended-session authorization. Independent adversarial review precedes implementation. The ordinary shipped lifecycle, human review and report-only reviewer rules remain unchanged.

## Host prerequisites observed

- Codex CLI: `0.153.4`; local login status reports ChatGPT authentication.
- Claude Code: `2.1.269`; authenticated through the existing subscription when keychain access is available. The initial sandboxed no-login result was an environment restriction, confirmed by a read-only check outside the sandbox. No login or credential change was required.
- Host invocations use existing configured models; no guessed cross-vendor model mapping.

Official references checked during this run: [Codex skill format and discovery](https://learn.chatgpt.com/docs/build-skills), [Claude programmatic execution](https://code.claude.com/docs/en/headless). Actual local CLI help is used when its available flags differ from published examples.

## Accomplishments, verification and remaining work

Implementation results, exact test counts, host observations, commit IDs and follow-ups will be recorded here before handing back the task.
