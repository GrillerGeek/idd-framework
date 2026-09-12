// SPDX-License-Identifier: Apache-2.0
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { assemble, repositoryRoot } from './build-skills.mjs';
import { runProcess } from './lib/process.mjs';
import { portableFixture, workspace } from '../tests/helpers/workspace.mjs';

export function probeInstall() {
  const packageRoot=path.join(repositoryRoot,'node_modules/skills');
  const metadata=JSON.parse(fs.readFileSync(path.join(packageRoot,'package.json'),'utf8'));
  assert.equal(metadata.version,'1.5.25','installer must match the reviewed pin');
  const executable=path.join(packageRoot,'bin/cli.mjs');
  const ownedRoot=workspace();
  try {
    for (const copy of [false,true]) {
      const mode=copy?'copy':'symlink';
      const source=path.join(ownedRoot,`${mode} source`),target=path.join(ownedRoot,`${mode} target`);
      fs.mkdirSync(source);fs.mkdirSync(target);
      const catalog=portableFixture(source);assemble(source,{catalog});
      const expected=new Map(catalog.bundles[0].files.map(f => [f.destination,fs.readFileSync(path.join(source,'plugin/skills/idd-package-probe',f.destination))]));
      runProcess(process.execPath,[executable,'add',path.join(source,'plugin/skills/idd-package-probe'),'--agent','codex','claude-code','--skill','idd-package-probe','--yes',...(copy?['--copy']:[])],{
        cwd:target,env:{...process.env,DISABLE_TELEMETRY:'1',DO_NOT_TRACK:'1',XDG_STATE_HOME:path.join(ownedRoot,'installer state')},timeout:60000,
      });
      if (copy) fs.rmSync(source,{recursive:true,force:true});
      for (const [agent,relative] of [['codex','.agents/skills/idd-package-probe'],['claude-code','.claude/skills/idd-package-probe']]) {
        const installed=path.join(target,relative);
        assert.ok(fs.existsSync(installed),`${mode}: missing ${agent} installation`);
        assert.ok(fs.realpathSync(installed).startsWith(fs.realpathSync(target)+path.sep),'installed resource must be inside the disposable target');
        if (agent==='claude-code') assert.equal(fs.lstatSync(installed).isSymbolicLink(),!copy,`${mode}: installation method`);
        for (const [relative,bytes] of expected) assert.deepEqual(fs.readFileSync(path.join(installed,relative)),bytes,`${agent}: ${relative}`);
        const helper=path.join(installed,'scripts/probe.sh');
        assert.equal(fs.statSync(helper).mode&0o777,0o755,'helper executable mode');
        assert.equal(runProcess(helper,[],{cwd:target}),'IDD package probe\n');
        console.log(`PASS: ${agent} ${mode} install, resources and standalone helper`);
      }
    }
  } finally { fs.rmSync(ownedRoot,{recursive:true,force:true}); }
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try { probeInstall(); console.log('Synthetic package installation verified; real IDD host workflows remain untested.'); }
  catch (error) { console.error(error.message);process.exitCode=1; }
}
