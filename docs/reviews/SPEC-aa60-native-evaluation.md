# SPEC-aa60 — Native Codex and Claude lifecycle evidence

Native packaging is implemented. Final actual native observations pass output/cache/registry checks; independent review is recorded below when complete. Archive's final Claude apply observation and Archive/Router closure remain prerequisites for Native review. No personal install, copied credential, model call, actual-repository tag/push/release or external marketplace update occurred.

## Isolation and source contract

Repository-owned catalogs use the name idd-framework-local and resolve ./plugin from repository root. Portable plugin/plugin.json uses the fixed skills/ schema; .codex-plugin/plugin.json supplies separate compatibility/display metadata. Existing Claude userConfig,15command/14agent frontmatter and all318generated skill files remain unchanged. The plugin-creator compatibility validator passed on a disposable folder named idd-framework; the separate strict portable/catalog validator passes. Claude native marketplace/plugin validation passes, with a nonblocking marketplace-description warning.

Each native child uses owned CODEX_HOME, CLAUDE_CONFIG_DIR, XDG paths and empty global Git configuration; no inherited credential variables or parent environment changes. Configured client/cache paths are verified within the owned client root. Every command is bounded60seconds/4MiB; host evaluation ten minutes. All attempted argv, exit/signal/error/stdout/stderr and partial fixtures remain preserved.

## Final observed lifecycle

| Host | Fixture | Actual result | Receipt SHA-256 | Elapsed |
|---|---|---|---|---|
| codex | 4lQF7O | passed | d815fdc947aedb0205351ab0ba7df840ca81f7cf57710f77030f5970cee010ef | 7.923s |

codex module-load evaluator hash: `1fcda66603af9a97a88bb2325fd1a988120ce51ed67e35edbfedab8b8328d2d0`; helper hash: `d04f2450f00949a2eaf599414a74240c81c54a93c0a120c0aaedb9ea2e937b9d`. Installed version changed from1.6.0 to fixture-only `1.6.0+codex.20260914T010151348Z`. Source was removed before cached helper/resource validation.
| claude | mSTRNK | passed | 4dc0843a2f83253bf7f3a658b8f7f484c6e8764dd099b9520a2da80a5eb0c612 | 8.638s |

claude module-load evaluator hash: `1fcda66603af9a97a88bb2325fd1a988120ce51ed67e35edbfedab8b8328d2d0`; helper hash: `d04f2450f00949a2eaf599414a74240c81c54a93c0a120c0aaedb9ea2e937b9d`. Installed version changed from1.6.0 to fixture-only `1.6.0+codex.20260914T010154812Z`. Source was removed before cached helper/resource validation.

Codex0.153.4 discovers the named package, installs all16closed skills in its isolated cache, then explicit local re-add consumes the changed version/marker. It removes both cached versions and IDD registration. Marketplace upgrade is Git-only and no successful local upgrade is claimed.

Claude2.1.269 reports31skills (15legacycommands+16portable skills) and14agents with exact names/metadata. Named marketplace update and project-scoped plugin update refresh actual cached version/bytes. Optional default_product_id/team_name remain unset; installation reports them without authentication or configuration writes. Uninstall removes IDD registration/project settings, while cached directories remain and may receive orphan-housekeeping markers. This is not cache purging.

Both final authoritative installed inventories contain only the original unrelated fixture plugin with identical identity/version/cache/scope/project metadata; both final marketplace inventories contain its separate marketplace and omit IDD. Full unrelated cache and consumer notes/skill/settings guards pass. No hierarchy was created by installed helper execution. CLI inventories do not certify native alias execution or fresh desktop discovery.

## Retained failures and corrections

- Codex1NgAbT: local marketplace upgrade returned Git-only capability error. Fixture installation/source/cache retained. Local re-add is the supported reviewed refresh path.
- CodexR3h66d: post-uninstall query tried loading the still-configured marketplace after its source had intentionally been removed. Query failed before marketplace removal. Final evaluator verifies the complete isolated installed registry after removing that source declaration; it does not recreate deleted source or hide stale registrations.
- ClaudesMBa05: native command timed out; exact attempted command/output/partial state retained.
- Earlier successful YJ0zfZ/NeMXZH/3quF8N/pC7OJl are retained but superseded by stronger final registry/settings checks.
- Independent review corrected a possible .claude root symlink, refreshed scope/project and unrelated-registration comparisons, and separate authoritative plugin/marketplace removal checks. New regressions cover changed unrelated settings and symlinked root.

## Test environment and limits

Initial full suites hit Git subprocess timeouts in existing unchanged fixtures. Parallel run: currentNode489/495 passed and minimumNode488/495 passed; serial current run493/497 passed, with Git/controlled-process timeouts. These are retained failures, not full-suite passes. macOS power logs subsequently showed repeated multi-minute MaintenanceSleep/DarkWake intervals; suspension is an established environmental factor, not proof that every historical timeout shares one cause. A process-scoped caffeinate idle-sleep assertion is used for fresh checks, without persistent power changes or relaxed test deadlines. Final results are appended when complete.

Native targeted tests and the compatibility validator passed before the final two guard regressions. Default tests invoke no native plugin mutations or models; their only subprocess isolation probe is a harmless Node fixture. Archive's seven accepted cases and failed/partial Claude apply attempts remain separately documented.

Primary sources: [OpenAI plugin guide](https://developers.openai.com/plugins/build/plugins), [portable plugin schema](https://agent-plugins.org/schemas/1.0.0/plugin.schema.json), [Claude marketplace guide](https://code.claude.com/docs/en/plugin-marketplaces), [Claude plugin reference](https://code.claude.com/docs/en/plugins-reference), [Claude configuration directory](https://code.claude.com/docs/en/claude-directory). Local CLI help and actual receipts support version-specific command behavior.


## Independent acceptance and final case coverage

Independent reviewer accepted all three oracle fixes and finalCodex4lQF7O/ClaudemSTRNK, with15and20successful fullreceipts respectively. Authoritative finalinstalled/marketplace inventories retain onlythe exactunrelatedfixture. Claude's retained IDDcache has onlyexpectedorphan-housekeepingmarkers beyond originalbytes/modes. Originalsource removal andallconsumer preservation checks pass.

Current Node's later497-case suite was interrupted byhostsleep:492passed,5failedwithGit/controlledprocesstimeouts. All5targeted reruns passed in1.57seconds. MinimumNode's495-case suite had488passes/7timeouts; a9-case targeted run passed all7affectedcasesplus2newguardtests in4.25seconds. This providespassing individualcase coverage forall497checks atbothruntimes, notoneuninterruptedfull-suite result. Separate packagechecks onbothversions,318-file deterministicassembly,local-links/protectedsource/ownership/whitespace audits pass. Nativecurrent33tests includeallnewguards.

The temporarycaffeinate attempt did notpreventMaintenanceSleep. Archive6FhPEF explicitlyreported computer sleepmidresponse; powerlogsshows117,768and878second sleepintervals duringit. It ranonlyinstalledresourcereads andleftallconsumer/Gitstateunchanged. Native/sourcechecksremainvalidboundedobservations;uninterruptedfullsuiteandArchiveapplyneedsareexplicitfollow-ups.


## Final implementation closure — September 15

Archive closure `2970f3d` and Router closure `68836de` satisfy the final
upstream gates. Native source `234199c` and its original 1.6.0/disposable refresh
observations remain the evidence for this Spec. Release `bb2f9e8` separately changes
only current versions to 1.7.0, preserving every nonversion property and production
resource; no native 1.6.0 receipt is relabeled as an actual 1.7.0 client run.

Both final full suites pass 499/499 with native regression coverage. Original
Codex `4lQF7O` and Claude `mSTRNK` lifecycle observations retain independent
acceptance, including all 35 command receipts, exact unrelated preservation and
accurate cache-retention/removal conclusions. No new native operation was needed
for this report closure. See [SPEC-aa60-20260915T014613Z-execution.md](SPEC-aa60-20260915T014613Z-execution.md)
and [final verification](2026-09-15-final-acceptance.md). Human review, desktop
discovery, native alias execution, hosted CI and publication remain separate.
