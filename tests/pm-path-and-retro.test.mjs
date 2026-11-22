// SPDX-License-Identifier: Apache-2.0
// Structural checks for the grilling PM path and the retro stage. They do not execute prose workflows.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { root } from './helpers/workspace.mjs';

const catalog = () => JSON.parse(fs.readFileSync(path.join(root,'plugin/skill-catalog.json'),'utf8'));
const destinations = directory => catalog().bundles.find(b => b.directory === directory)?.files.map(f => f.destination) ?? [];
export const grillingStages = ['interview','define-intentions','define-expectations','define-outcomes','quick-spec','write-spec'];
test('gap-checker blocks on unresolved relevant open questions', () => {
  assert.match(fs.readFileSync(path.join(root,'plugin/references/pilot/gap-reviewer.md'),'utf8'), /open_questions[\s\S]*\*\*Blocker\*\*/);
});

for (const stage of grillingStages) test(`${stage} bundles ship grilling and brief references, direct and routed`, () => {
  for (const ref of ['references/grilling.md','references/brief-template.md']) {
    assert.ok(destinations('idd-'+stage).includes(ref), `idd-${stage} missing ${ref}`);
    assert.ok(destinations('idd-orchestration').includes(`stages/${stage}/${ref}`), `router ${stage} missing ${ref}`);
  }
});
test('interview workflow links grilling and brief references', () => {
  const text = fs.readFileSync(path.join(root,'plugin/workflows/interview.md'),'utf8');
  assert.match(text, /\(references\/grilling\.md\)/);
  assert.match(text, /\(references\/brief-template\.md\)/);
});
test('grilling reference defines rounds, confirmation and tech-lead flags', () => {
  const text = fs.readFileSync(path.join(root,'plugin/references/authoring/grilling.md'),'utf8');
  for (const phrase of [/recommended answer/i, /silence/i, /needs: tech-lead/, /frontier/i, /shared understanding/i]) assert.match(text, phrase);
});

test('retro stage is catalogued, bundled and routed', () => {
  const c = catalog();
  assert.ok(c.stages.some(s => s.skill === 'idd-retro' && s.legacyCommand === 'retro' && s.state === 'pilot'));
  for (const dest of ['SKILL.md','references/retro.md','references/spec-reference.md','scripts/idd-next-id','LICENSE']) assert.ok(destinations('idd-retro').includes(dest), `idd-retro missing ${dest}`);
  assert.ok(destinations('idd-orchestration').includes('stages/retro/workflow.md'));
  assert.match(fs.readFileSync(path.join(root,'plugin/workflows/idd-orchestration.md'),'utf8'), /stages\/retro\/workflow\.md/);
  assert.ok(fs.existsSync(path.join(root,'plugin/commands/retro.md')));
});
test('retro contract names its report, lessons and approval gate', () => {
  const text = fs.readFileSync(path.join(root,'plugin/references/retro/retro.md'),'utf8');
  for (const phrase of [/docs\/reviews\/SPEC-<id>-retro\.md/, /lessons/, /spec_gaps_encountered/, /docs\/guildhall\/plans\//, /upstream feedback/i, /approv/i, /CLAUDE\.md|AGENTS\.md/]) assert.match(text, phrase);
});

test('review-spec nudges retro and archive warns when it is missing', () => {
  assert.match(fs.readFileSync(path.join(root,'plugin/references/review/review.md'),'utf8'), /retro workflow/);
  const archive = fs.readFileSync(path.join(root,'plugin/references/archive/archive.md'),'utf8');
  assert.match(archive, /retro-missing/); assert.match(archive, /lessons/);
});
