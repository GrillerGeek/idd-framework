# Skills onboarding verification — 2026-09-20

## Outcome

The README leads with a short interactive GitHub command for `idd-orchestration`.
The installation guide provides explicit single-host copy commands and the
install → list → invoke → refresh → remove path. The complete IDD router is the default; individual stages remain optional.
Plugin resources and versions are unchanged.

## Remote lifecycle observations

Public source: `GrillerGeek/idd-framework`. Both `skills@1.5.25` and `skills@1.7.0`
were run against Codex and Claude Code in separate disposable home/config/project
directories with an environment allowlist and telemetry disabled. No personal
installation or model invocation was performed. All four combinations passed:

1. GitHub shorthand installation produced the complete expected bundle bytes/modes.
2. `list --agent <host>` reported the selected skill.
3. `update idd-orchestration --project --yes` refreshed the current source and retained
   expected bundle content and an unrelated fixture skill.
4. Repeating explicit `add --skill idd-orchestration --agent <host> --copy --yes`
   restored a deliberately replaced installed SKILL.md to the published bytes.
5. Named removal removed the selected host and canonical paths in these single-host
   fixtures and preserved the unrelated skill.

The shared evidence directory is
`/private/var/folders/f0/_sscvrpd48s9srngb0d0l_mh0000gn/T/skills-lifecycle-zalafoot/`.
Each case has a report with command arguments, exit codes and captured output;
`summary.json` contains all eight combinations across the two projects. The
one-off driver is `/tmp/probe-skills-lifecycle.py`. These temporary records are
local evidence, not shipped dependencies.

The update observation is a refresh of the currently published version, not an
upgrade across two upstream releases. Removal in a multi-host shared directory
can retain a copy needed by another host; the guide preserves that limitation.
The short form's discovery was checked separately; interactive selection UX was
not automated end to end. Explicit target/copy options were used for lifecycle
comparisons. Global scope and additional hosts remain separate checks.

## Compatibility automation

The pinned installer remains the supported baseline. The new GitHub workflow
adds an advisory `latest` check with exact resolved-version reporting and no
install lifecycle scripts. CI checks local package contents rather than relying
on directory indexing or running models. Hosted CI is only established after
these changes are pushed.

Local package probes passed on both installer versions: 68 bundle/host/method
checks plus two repository-root router discovery checks per version. Candidate
selection requires an explicit matching package identity and exact version;
normal offline tests continue using the locked dependency.

## Directory discovery

GitHub shorthand discovery succeeds. However, `skills find` did not return the
matching GrillerGeek skill, and the page at
`https://skills.sh/grillergeek/idd-framework/idd-orchestration` returned HTTP 200 with rendered
**404 / skill unavailable** content. A successful HTTP status alone is not a
valid listing. No badge or directory link was added to the README, and no
synthetic telemetry-enabled installs were generated to inflate discovery.

Direct GitHub commands remain usable without directory listing. Recheck the
actual directory content before adding a badge. The [skills.sh documentation](https://skills.sh/docs)
describes telemetry-based ranking; it does not establish that these repositories
are currently indexed. External indexing is an outstanding ecosystem condition,
not a packaging requirement or a reason to couple the two tools.

## Repository checks

`npm run check` passes. All **500 tests** pass with local networking permitted.
The initial sandboxed run passed 499 tests and could not start the controlled
Forge HTTP fixture; the host-permitted rerun passed without a code change to
Forge. The new regression test checks that alternate installers cannot silently
bypass the default pin, package identity or exact-version selection.
Both compatibility workflow YAML files parse, their version-recording shell
step was exercised, and all 65 relative links in the changed documentation
resolve. `git diff --check` passes. No plugin resource or manifest changed, so no
installer-visible plugin version bump is needed.
