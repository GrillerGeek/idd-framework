// SPDX-License-Identifier: Apache-2.0
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { installerExecutable } from '../scripts/test-install.mjs';
import { workspace } from './helpers/workspace.mjs';

test('alternate installer is explicit and bound to the expected package/version', t => {
  const root=workspace(t), bin=path.join(root,'bin');
  fs.mkdirSync(bin);
  const cli=path.join(bin,'cli.mjs');
  fs.writeFileSync(cli,'throw Error("selection must not execute the installer");');
  const metadata=path.join(root,'package.json');
  const write=(name,version)=>fs.writeFileSync(metadata,JSON.stringify({name,version}));
  write('skills','1.7.0');
  const env={SKILLS_CLI_PATH:cli,SKILLS_EXPECTED_VERSION:'1.7.0'};
  assert.equal(installerExecutable(env),fs.realpathSync(cli));
  assert.throws(()=>installerExecutable({SKILLS_CLI_PATH:cli}),/explicitly selected version/);
  assert.throws(()=>installerExecutable({...env,SKILLS_EXPECTED_VERSION:'latest'}),/must be exact/);
  write('different-package','1.7.0');
  assert.throws(()=>installerExecutable(env),/must be the skills package/);
  write('skills','1.7.1');
  assert.throws(()=>installerExecutable(env),/explicitly selected version/);
});
