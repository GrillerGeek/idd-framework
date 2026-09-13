# Guarded terminal execution (version 1)

This optional installed runner provides observed Claude checkpoints. Invoke it from a separate terminal with Node >=22.20.0, Git, and an already authenticated `claude` executable:

```sh
node <installed-skill>/scripts/idd-execute-spec.mjs --project <project> --spec SPEC-abcd --check
node <installed-skill>/scripts/idd-execute-spec.mjs --project <project> --spec SPEC-abcd
```

Replace `<installed-skill>` with this skill's directory. `--check` performs read-only contract/resource checks and starts no model. A real run refuses inside an existing Claude session; never clear `CLAUDECODE` to bypass that guard. Existing native aliases remain available, but their prose dispatch does not acquire the terminal controller's checks automatically. Installation alone is not native execution certification.

The default preserves the observed configured model and output style across one saved session. Optional `--implementer-model sonnet` retains the configured orchestrator, requests the existing provider alias for the implementing checkpoint, requires the resolved identity to be in that family, and resumes that exact model for build. Model-family selection is tested, but the current Sonnet observation failed full workflow trace review (its own baseline/report ordering). Treat this option as experimental; use the configured policy for the accepted pilot lane. A controller pass does not certify the truth of every model-authored evidence claim. This option is specific to the Claude terminal transport; it does not select a model in other hosts. Normal saved session history uses existing host storage. No settings or credentials are edited.

## Reviewed execution metadata

The Spec author adds the optional annotation below, reviewed together with the prose before Ready. The runner requires real recorded `peer_review.outcome: approved` and a reviewer; an agent cannot invent that fact. Existing Specs without this annotation remain valid but cannot use this guarded route. The original five mandatory blocks remain unchanged.

```yaml
  execution_contract:
    version: 1
    outputs:
      - deliverable: 1
        path: src/greet.mjs
        kind: file
      - deliverable: 2
        path: tests/greet.test.mjs
        kind: file
      - deliverable: 3
        kind: execution-report
    checks:
      - validation: 1
        argv: [node, --test, tests/greet.test.mjs]
        timeout_seconds: 10
      - validation: 2
        kind: preservation
      - validation: 3
        kind: report
```

Map every Deliverable and automated validation's one-based index exactly once. File/directory paths are explicit normalized project-relative paths. Directory outputs own descendants; overlapping/case-alias paths, hardlinked writable files, symlink paths and protected Spec/gap/bundle/Git paths are refused. Every declared output must exist at completion; version 1 does not support deletion-only deliverables. Exactly one report is required. The implementing role samples actual UTC immediately before creating `docs/reviews/<SPEC-ID>-<YYYYMMDDTHHmmssZ>-execution.md`; it cannot overwrite a pre-existing report.

Each check is either an explicit argument vector with a 1–600 second timeout, or `preservation`/`report`. Commands are executed directly; the runner never converts prose to shell commands or checks semantic agreement between prose and metadata. Author/readiness review owns that agreement. Independent verification commands must leave the whole project unchanged, including declared outputs; build side effects belong in the implementation phase within output ownership.

## Lifecycle and evidence

The controller checks safe YAML, completeness, Ready, recorded approval, integer-zero passed gate and canonical PASS report with Coverage. It reads initial snapshots into memory, obtains an actual visible orchestration acknowledgment with read-only tools, prints it, then creates owned temporary evidence and changes only the status scalar to `in-progress`. A second read-only implementing acknowledgment quotes and paraphrases every Boundary before writable tools are enabled. Both checkpoints and build resume the same saved session; delegation is disabled.

The implementing role leaves the Spec byte-identical at `in-progress`. It follows the ordinary report contract, including all evidenced edge-case, Boundary, Deliverable and automated-check rows. The controller accepts exactly one new report, verifies ownership, runs reviewed commands, checks preservation again and alone changes status to `review`. Human implementation review remains pending. Controller-owned evidence remains in the reported OS-temporary directory; the implementer must not remove it as its own scratch.

Project snapshots include hidden files, existing dirty files, directory/file modes and symlinks, excluding only `.git` internals. Git HEAD, branch and staged binary diff are separately compared. The resolved installed bundle receives an independent snapshot even for external symlink targets. Snapshots refuse above 50,000 entries or 512 MiB of regular-file content; there is no silent dependency-directory exclusion. Model phases share 600 seconds and 4 MiB output; each verification command has its reviewed timeout and 4 MiB output cap. Owned subprocess groups receive termination on interruption/timeout/overflow, followed by forced termination after a one-second grace if necessary. This lets nested controllers forward cancellation to their own children.

Failures retain partial work and evidence. No automatic retry, cleanup of user work or lifecycle repair occurs; recovery goes back to the author. Unsupported metadata refuses before model calls. This is a coordination mechanism, not hostile-code containment, atomic transactions or universal semantic validation. The runner detects known stale state but does not cryptographically establish historical approval.
