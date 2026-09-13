// SPDX-License-Identifier: Apache-2.0
// Optional real-host evaluation; never part of offline CI.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import YAML from 'yaml';
import {repositoryRoot,assemble} from './build-skills.mjs';
import {installLocal} from './test-install.mjs';
import {runProcess} from './lib/process.mjs';
import {runHost} from '../plugin/runtime/transport.mjs';
import {snapshot,hash} from '../plugin/runtime/snapshot.mjs';
export function setupInstalledFixture(owned,{copy=true}={}) {
  const project=path.join(owned,'project with spaces'),source=path.join(owned,'copied source');
  fs.cpSync(path.join(repositoryRoot,'tests/fixtures/installed-execution'),project,{recursive:true});fs.cpSync(path.join(repositoryRoot,'plugin/skills/idd-implement-spec'),source,{recursive:true});
  installLocal(source,project,'idd-implement-spec',{copy,stateRoot:owned,agents:['claude-code']});
  if(copy)fs.rmSync(source,{recursive:true});
  for(const args of [['init','-q'],['add','.'],['-c','user.name=IDD Fixture','-c','user.email=fixture@example.invalid','-c','commit.gpgsign=false','commit','-qm','installed fixture']])runProcess('git',args,{cwd:project});
  fs.appendFileSync(path.join(project,'USER-NOTES.md'),'\nPre-existing dirty user decision: preserve this.\n');
  return {project,runner:path.join(project,'.claude/skills/idd-implement-spec/scripts/idd-execute-spec.mjs')};
}
export async function evaluateInstalled({policy='configured',negative=false}={}) {
  assert.ok(['configured','sonnet'].includes(policy));assemble(repositoryRoot,{check:true});
  const owned=fs.mkdtempSync(path.join(os.tmpdir(),`idd-installed-${negative?'refuse':policy}-`));const result={outcome:'blocked',evidence:owned,policy,negative};
  try {
    const {project,runner}=setupInstalledFixture(owned);result.project=project;
    if(negative){const file=path.join(project,'docs/specs/SPEC-c0de-greeting.yaml'),d=YAML.parse(fs.readFileSync(file,'utf8'));d.spec.gap_check.status='warnings';d.spec.gap_check.warnings=1;fs.writeFileSync(file,YAML.stringify(d));}
    const before=snapshot(project,{excludeGit:true});fs.writeFileSync(path.join(owned,'baseline.json'),JSON.stringify(before,null,2));
    result.evaluatorHash=hash(fs.readFileSync(fileURLToPath(import.meta.url)));result.bundleHash=hash(JSON.stringify(snapshot(path.dirname(path.dirname(runner)))));
    result.version=await runHost('claude',['--version'],{cwd:project,timeout:15000,maxBytes:10000});
    const receipt=await runHost(process.execPath,[runner,'--project',project,'--spec','SPEC-c0de','--implementer-model',policy],{cwd:owned,timeout:680000,maxBytes:6*1024*1024});
    fs.writeFileSync(path.join(owned,'stdout.json'),receipt.stdout);fs.writeFileSync(path.join(owned,'acknowledgments.txt'),receipt.stderr);result.process={code:receipt.code,reason:receipt.reason};result.runtime=JSON.parse(receipt.stdout);
    if(negative){assert.equal(result.runtime.outcome,'refused');assert.equal(result.runtime.hostInvocations,0);assert.deepEqual(snapshot(project,{excludeGit:true}),before);result.outcome='passed';result.disposition='controller-refused';}
    else {assert.equal(receipt.reason,null);assert.equal(receipt.code,0,result.runtime.error);assert.equal(result.runtime.outcome,'passed',result.runtime.error);
      const oracle=`import assert from 'node:assert/strict';import {greet} from './src/greet.mjs';assert.equal(greet('Ada'),'Hello, Ada!');assert.equal(greet('  Ada  '),'Hello, Ada!');for(const v of ['', '   ',null,42])assert.throws(()=>greet(v),TypeError);console.log('Six independent greeting cases passed');`;
      const after=snapshot(project,{excludeGit:true});result.oracle=await runHost(process.execPath,['--input-type=module','-'],{cwd:project,input:oracle,timeout:10000,maxBytes:100000});assert.equal(result.oracle.code,0,result.oracle.stderr);assert.equal(result.oracle.reason,null);
      const tests=result.runtime.checks[0].receipt.stdout;for(const field of ['fail','skipped','cancelled'])assert.match(tests,new RegExp(`(?:#|ℹ) ${field} 0`));assert.ok(Number(tests.match(/(?:#|ℹ) tests (\d+)/)?.[1])>=6);
      assert.deepEqual(snapshot(project,{excludeGit:true}),after);result.outcome='passed';result.disposition='installed-controller-and-independent-oracle';}
  }catch(error){result.error=error.message;result.outcome='failed';}
  fs.writeFileSync(path.join(owned,'evaluation.json'),JSON.stringify(result,null,2)+'\n');return result;
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
  const args=process.argv.slice(2);if(args.some(a=>!['--sonnet','--negative'].includes(a)))throw Error('Use optional --sonnet or --negative');
  const result=await evaluateInstalled({policy:args.includes('--sonnet')?'sonnet':'configured',negative:args.includes('--negative')});console.log(JSON.stringify({outcome:result.outcome,evidence:result.evidence,error:result.error,runtime:result.runtime?.outcome},null,2));if(result.outcome!=='passed')process.exitCode=1;
}
