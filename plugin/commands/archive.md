---
description: Consolidate terminal IDD artifacts into the roll-up ledger — classify mode produces a reviewable archive manifest; apply mode tags, distills to docs/idd-ledger.yaml, and deletes the archived files
argument-hint: [--apply manifest-path]
allowed-tools: "Read Write Glob Grep Bash(ls *) Bash(mkdir *) Bash(git status *) Bash(git rm *) Bash(git tag *) Bash(git add *) Bash(git commit *) Bash(git mv *) Bash(${CLAUDE_PLUGIN_ROOT}/bin/idd-archive-scan *)"
---

!`mkdir -p docs/products docs/intentions docs/expectations docs/specs docs/reviews`

Current artifact inventory:
!`${CLAUDE_PLUGIN_ROOT}/bin/idd-archive-scan 2>/dev/null | head -40 || echo "scan helper unavailable — run it manually"`

Launch the `idd-archivist` subagent to consolidate terminal IDD artifacts into the archive ledger (`docs/idd-ledger.yaml`). Archiving distills each artifact to a compact ledger record and **deletes the file** — full text remains recoverable via the archive git tag (`git show <tag>:<path>`). See `${CLAUDE_PLUGIN_ROOT}/skills/idd-orchestration/references/ledger-reference.md` for the ledger schema and classification rules.

**Model directive:** When dispatching this subagent, you MUST explicitly pass `model: "sonnet"` to the Agent/Task tool call. Do not downgrade or inherit. Do NOT skip this parameter.

**Invocation forms:**

| Form | Example | Behavior |
|---|---|---|
| No argument | _(blank)_ | **Classify mode (read-only):** scans all artifact dirs, writes a reviewable manifest to `docs/reviews/idd-archive-manifest-<YYYY-MM-DD>.yaml`. Nothing is deleted. |
| `--apply <manifest-path>` | `--apply docs/reviews/idd-archive-manifest-2026-06-12.yaml` | **Apply mode:** executes the (possibly human-edited) manifest — tag, ledger, deletions, commit. |

Pass `$ARGUMENTS` to the agent unchanged so it can resolve the mode, EXCEPT the git choreography below, which is command-layer responsibility.

---

## Classify mode (no `--apply`)

1. Run `${CLAUDE_PLUGIN_ROOT}/bin/idd-archive-scan` and pass its full output to the `idd-archivist` agent (classify mode).
2. The agent writes the manifest. **Spec spot-verification:** for every manifest row with `reason: spot-verify-pending`, dispatch parallel read-only verifier agents (general-purpose, `model: "sonnet"`, batches of ~5 specs) that check 2–3 concrete deliverables from each spec's deliverables block against the codebase and return `confirmed-done | partial | not-done` verdicts with one-line evidence. Update those manifest rows: `confirmed-done` → `verified: code`, keep `disposition: archive`; `partial`/`not-done` → `disposition: keep`, `reason: status-correction`, note the gap.
3. Surface to the human: totals, the orphans section, every `KEEP-RECOMMENDED?` flag, all status-correction rows, and the manifest path. **Stop.** The human reviews (and optionally edits) the manifest, then runs `--apply`.

## Apply mode (`--apply <manifest-path>`)

Execute strictly in this order — the tag MUST precede any deletion:

1. **Preflight:** `git status --porcelain` must be empty (clean tree). Abort with a clear message otherwise. The manifest itself must be committed (it is part of the pre-archive snapshot).
2. **Tag:** `git tag idd-archive-<YYYY-MM>` on HEAD. If the tag exists (second run in a month), use `idd-archive-<YYYY-MM>-2`, `-3`, etc. Every archived file is still present at this tag.
3. **Distill:** dispatch `idd-archivist` (apply mode, `model: "sonnet"`) with the manifest path and the tag name. It creates/updates `docs/idd-ledger.yaml` and returns the record count.
4. **Reconcile before deleting:** ledger records added MUST equal manifest `disposition: archive` rows. On mismatch, stop and surface — do not delete anything.
5. **Delete:** `git rm` every manifest row's `path` with `disposition: archive`; `git rm` every `reviews:` entry with `action: delete`; `git mv` every `action: move-to-archive` review to `docs/archive/`; `git rm` the manifest itself (recoverable at the tag).
6. **Dangling-reference sweep:** Grep the surviving artifact files for every archived ID. Report each hit as a warning (`<surviving-file> still references <archived-ID> — resolvable via ledger + tag`). Do NOT edit the surviving files — the ledger is the resolution mechanism.
7. **Commit:** `git add docs/idd-ledger.yaml` plus the deletions/moves, then commit:
   `chore(idd): archive N artifacts to ledger (idd-archive-<YYYY-MM>)`
8. **Remind the user:** push with `git push --follow-tags` — the tag is the lossless archive anchor and must reach the remote.

**Never** set any artifact's status to `archived` (no such lifecycle value), never annotate surviving artifacts, and never delete files not listed in the manifest.
