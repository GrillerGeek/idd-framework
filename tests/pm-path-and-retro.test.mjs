// SPDX-License-Identifier: Apache-2.0
// Structural checks for the grilling PM path and the retro stage. They do not execute prose workflows.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { root } from './helpers/workspace.mjs';

const catalog = () => JSON.parse(fs.readFileSync(path.join(root,'plugin/skill-catalog.json'),'utf8'));
const destinations = directory => catalog().bundles.find(b => b.directory === directory)?.files.map(f => f.destination) ?? [];
export const grillingStages = ['interview'];

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
