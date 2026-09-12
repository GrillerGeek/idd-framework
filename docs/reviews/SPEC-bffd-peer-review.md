# SPEC-bffd: packaging foundations peer review

Human peer review: **approved by Jason Robey on 2026-09-12**, replying “approved” to the concrete Spec handoff. This packet prepares milestone 2 on
`codex/portable-skills`; implementation has not started.

Read the [Spec](../specs/SPEC-bffd.yaml) and
[migration plan](../plans/2026-09-12-codex-skills-migration.md).

## Proposed result

A contributor can install development dependencies, assemble the existing plugin
resources, and run the same structural checks locally and in CI. A synthetic
standalone skill proves that the package tooling includes required files and that
the pinned installer can place them in temporary Codex and Claude projects.
Real IDD workflow conversion and native Codex packaging remain later milestones.

The proposal uses Node >=22.20.0, the built-in test runner, pinned `yaml@2.8.3`
and `skills@1.5.25`, and a private development package with a lockfile. The installer
version declares that Node minimum in its [package metadata](https://github.com/vercel-labs/skills/blob/v1.5.25/package.json).
The YAML parser supports document-level parse errors and unique-key checks;
validation must inspect errors before consuming the parsed document.
[Parser documentation](https://eemeli.org/yaml/).

## Decisions to approve

1. **Canonical sources and generated copies:** move the current router source and
   six references to maintained plugin source locations, then reproduce today's
   installed files byte-for-byte. Keep all 15 stage names in a catalog as pending;
   do not generate empty or nonfunctional public stage skills.
2. **Explicit legacy exception:** today's orchestration bundle remains Claude-only.
   Portable fixture validation requires self-contained resources and excludes
   Claude-specific dispatch instructions. The exception cannot silently spread
   to other bundles.
3. **Read-only checks:** detect output drift, invalid metadata, missing resources,
   and invalid artifacts without modifying files. Structural validation neither
   supplies human peer review nor authorizes Spec execution.
4. **Fixture preservation:** keep both historical test Specs unchanged. The flawed
   fixture has a duplicate key and must fail with that diagnostic; the clean
   fixture passes structural checks without resolving its fictional project links.
   Exact-path and hash profiles prevent blanket exemptions.
5. **Targeted helper corrections:** fix the two demonstrated defects below, with
   regression tests. Preserve command interfaces and existing archival semantics.
6. **Isolated installation and CI:** probe only a synthetic complete skill in
   temporary projects, in symlink and copy modes. No personal/global installation,
   release, tag or push is included. Remote CI results remain pending until a
   separately authorized push actually runs them.

New build/test code will use Apache-2.0 headers; documentation and existing
fixtures retain their current licenses. Existing license files are unchanged.

## Assessment evidence

These are isolated probes of the existing baseline, not completed fixes:

| Probe | Observed result | Required regression |
|---|---|---|
| Create `docs/products/PROD-a1b2-existing.yaml`; invoke the unchanged helper with child-only deterministic `od` output | Emitted `PROD-a1b2`, colliding with the existing artifact | Descriptive filenames must occupy the ID |
| Create an exploration map referencing `PROD-a1b2`; run the unchanged archive scan | Map appeared in INVENTORY, but not MENTIONS | Include maps and decision Markdown in the reference index |
| Parse the existing deliberately flawed Spec with duplicate-key rejection | Rejected duplicate `expectations` | Preserve fixture and assert DUPLICATE_KEY explicitly |

Probe workspace: `/tmp/idd-foundations-assessment-q89cjsym`; its `evidence.json`
contains the helper outcomes. Tests in the implementation will recreate these
conditions without relying on the temporary workspace surviving.

The installer supports selecting agents, project-local installation, noninteractive
confirmation, and copy mode. [Installer options](https://github.com/vercel-labs/skills/blob/v1.5.25/README.md).
The probe must disable telemetry/audit calls with `DISABLE_TELEMETRY=1`, supported
by the [pinned implementation](https://github.com/vercel-labs/skills/blob/v1.5.25/src/telemetry.ts).

## Review status

The fresh independent [gap-check](SPEC-bffd-gap-check.md) passed with zero
unresolved blockers and warnings. All 33 author-accepted coverage omissions remain
visible with independent resolution evidence. The [initial review](SPEC-bffd-gap-check-initial.md)
is preserved. Packet checks passed for unique YAML keys, parent/detail links, eight
edge cases, code references and completeness items 1–10. Human peer review is now recorded for this concrete Spec. Implementation review and hosted CI validation remain later activities.
