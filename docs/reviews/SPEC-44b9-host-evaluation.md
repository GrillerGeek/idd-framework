# Portable review host evaluation — SPEC-44b9

Ten required installed observations pass the current output oracle. All ten have strict independent full-trace acceptance, including final Codex deep-review jS5a76. Technical/deep approval remains advice, and correct-code validation correctly reports Needs Changes because human wording review and historical preservation are unverified.

## Measured matrix

| Host | Stage | Variant | Evidence suffix | Original receipt | Separate revalidation |
|---|---|---|---|---|---|
| claude | tech-review | happy | CIJ7p6 | passed | passed |
| claude | deep-review | happy | RzxFhC | passed | passed |
| claude | review-spec | happy | V1ehYa | failed | passed |
| claude | tech-review | contradiction | 36AENP | failed | passed |
| claude | review-spec | broken | MlGadl | failed | passed |
| codex | tech-review | happy | C60du6 | passed | passed |
| codex | tech-review | contradiction | 22OgJD | passed | passed |
| codex | review-spec | happy | 4cxweb | failed | passed |
| codex | review-spec | broken | MUHHj8 | failed | passed |
| codex | deep-review | happy | jS5a76 | passed | passed |

Evidence root: OS temporary directory, each named `idd-review-<host>-<stage>-<variant>-<suffix>`. Every directory retains the original result.json, baseline.json, prompt.txt, stdout.log, stderr.log and final disposable project. Final separate revalidation is /tmp/idd-review-final-revalidation.json; missing old allowedDates are derived in memory from the original invocation date, never written back into receipts.

Each invocation installs one complete skill in copy mode, removes its copy source, preserves existing dirty notes and uses configured model/style. Bounds are 600 seconds/4 MiB per host and 60 seconds/1 MiB per explicit local test. No npm test or CI model calls. All happy review fixtures run three actual passing tests; contradiction fixtures expose a required source change forbidden by a Boundary; broken validation shows three actual test failures and Fail. Deep observations cover all three perspectives with explicitly unavailable delegation and truthful sequential labels. Validation publishes only its report; technical/deep orchestration changes only the localized review annotation and owned deep report, preserving lifecycle/gap/content/comments/modes. Current reports are reread and preservation verified before final technical annotation.

## Original failures and corrected oracle limits

- Initial Codex yO6Uza, j3CGSu and sJfgJq lost the original parsed baseline during YAML date serialization. A later capture does not establish original equality. Earlier unconditional reviewer passes for yO6Uza/j3CGSu were withdrawn; these are not accepted cases.
- TPdlZ3 produced correct contradictory findings but used arbitrary Python through hidden interactive stdin; complete-script evidence is insufficient. 5UsIE8 correctly stopped before writes after baseline loss: failed-safe, not completed technical review.
- 0O4BHH used a visible restricted command interpreter and preserved outputs, but aggregate receipts did not independently establish exact immediate pre/post-test timing. Its evidence is limited, replaced by MUHHj8.
- rirDEb timed out after 600 seconds with the operational sentinel and partial work retained. No report or approval was manually manufactured to complete it.
- CIJ7p6/36AENP initially hit a checklist oracle that included separately numbered Process sections. V1ehYa used escaped Markdown pipes/descriptive headers; MlGadl used accurate combined edge/category totals; 4cxweb and MUHHj8 used accurate scoped/prose counts. Regression-tested oracle corrections accept these equivalent presentations without weakening individual rows, actual results, confidence, dates, preservation or status requirements. Original receipts remain unchanged.

Later retries reinforce visible self-contained commands, raw date-safe original capture before parsing, and no scratch files. C60du6/4cxweb retained the raw original across unavailable-parser attempts and proved every later comparison equal to that original. This is reinforced-prompt evidence, not a claim of universal ordinary-prompt reliability.

## Provenance and scope

| Case | Invocation UTC | Bundle SHA-256 | Evaluator SHA-256 | Original oracle SHA-256 |
|---|---|---|---|---|
| CIJ7p6 | 2026-09-13T05:39:10.931Z | 7ff7465b78858028598bc7d5a51bad40f84de9fb2df4f4317474f89bb74be699 | 2d656a71697627ad5929f8b93011a1bd6c2503d3d57109ff9f79485dc2a3a583 | 1b597ef502685426101dea04a668f60b81e5496e3929718234f65cbd59a08607 |
| RzxFhC | 2026-09-13T05:44:24.614Z | 1fab840d488f1f6ddb9bfc618eaa10138f186226b90e99e9c43653cedb03bed9 | 2d656a71697627ad5929f8b93011a1bd6c2503d3d57109ff9f79485dc2a3a583 | 9849ddf6d01e81b9573896e384f15c3c41edaadfed972f0f73acb5ee2a041225 |
| V1ehYa | 2026-09-13T05:50:18.319Z | 08c89a1eadc793099c6eae247a09fe5c764a3578990cf6e0e82c54fd28db9558 | dffa973bc7fb1d48cfa30f91ab869006bc87757c19f8f90f91095ffaa95b0e83 | f43cd05b9d9a13f8ee6a958711ffa2ec8eb25ac4de6c3a1b3407da9473541b78 |
| 36AENP | 2026-09-13T05:44:24.995Z | 7ff7465b78858028598bc7d5a51bad40f84de9fb2df4f4317474f89bb74be699 | 2d656a71697627ad5929f8b93011a1bd6c2503d3d57109ff9f79485dc2a3a583 | 9849ddf6d01e81b9573896e384f15c3c41edaadfed972f0f73acb5ee2a041225 |
| MlGadl | 2026-09-13T05:48:13.791Z | 08c89a1eadc793099c6eae247a09fe5c764a3578990cf6e0e82c54fd28db9558 | dffa973bc7fb1d48cfa30f91ab869006bc87757c19f8f90f91095ffaa95b0e83 | f43cd05b9d9a13f8ee6a958711ffa2ec8eb25ac4de6c3a1b3407da9473541b78 |
| C60du6 | 2026-09-13T05:59:23.790Z | 3cdc0e2eb9775b9ba76d44079f3251ca4adeddb70fea6881fb9e796498594f98 | dffa973bc7fb1d48cfa30f91ab869006bc87757c19f8f90f91095ffaa95b0e83 | 825db2289b41ce04e9d0f3ad7ff3fe406a13aa56e383b98f4eca95881b16b793 |
| 22OgJD | 2026-09-13T05:59:27.518Z | 3cdc0e2eb9775b9ba76d44079f3251ca4adeddb70fea6881fb9e796498594f98 | dffa973bc7fb1d48cfa30f91ab869006bc87757c19f8f90f91095ffaa95b0e83 | 825db2289b41ce04e9d0f3ad7ff3fe406a13aa56e383b98f4eca95881b16b793 |
| 4cxweb | 2026-09-13T05:59:25.416Z | 91e896e2b6d875b569dd81c246c02c58c28c4c615f009a1f27f95983b6f41e58 | dffa973bc7fb1d48cfa30f91ab869006bc87757c19f8f90f91095ffaa95b0e83 | 825db2289b41ce04e9d0f3ad7ff3fe406a13aa56e383b98f4eca95881b16b793 |
| MUHHj8 | 2026-09-13T06:06:35.443Z | 91e896e2b6d875b569dd81c246c02c58c28c4c615f009a1f27f95983b6f41e58 | dffa973bc7fb1d48cfa30f91ab869006bc87757c19f8f90f91095ffaa95b0e83 | 825db2289b41ce04e9d0f3ad7ff3fe406a13aa56e383b98f4eca95881b16b793 |
| jS5a76 | 2026-09-13T06:21:08.996Z | 40280d1c6c71fd75c168bace5afbde25ea8a6d6f4bde0be527f888d0ac252959 | 3f00ae793b8d6615e7361cb1077486e0bd11e65dce03b4dc4aecb06bf35449c5 | f6be16e408f3f48a9daa5c69a75dbc029a68333cd727d2e47211b8a896d4fc3d |

The latest procedure makes unowned-file SHA-256 comparisons explicit to avoid repeatedly embedding full bundle contents; raw text is retained for contextual/localized edits. The evaluator now probes an existing Python/PyYAML interpreter read-only and supplies its verified absolute path. These are post-evaluation guidance improvements for earlier accepted traces, which used a raw-byte superset; all receipts retain their original bundle/evaluator hashes. The final deep retry used these improvements. Neither synthetic perspective receipts nor actual sequential cases certify native parallel/partial dispatch. Native aliases, actual human review, Windows, published installation and arbitrary models/settings remain separate gates.

## Offline and package evidence

248 tests pass on Node 25.8.1 and minimum Node 22.20.0 (63 review-specific tests); 48 installation combinations pass. Assembly has 144 generated files, eleven portable stages and four planned. Six modified adapter frontmatter blocks remain exact; existing helper/runtime implementations and earlier bundles are preserved. See the timestamped SPEC-44b9 Execution Report for itemized verification.
