// SPDX-License-Identifier: Apache-2.0
// Optional real-host evaluation; default checks never invoke a model.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import assert from 'node:assert/strict';
import {repositoryRoot,assemble} from './build-skills.mjs';
import {installLocal} from './test-install.mjs';
import {hostInvocation,runHost} from './evaluate-pilot.mjs';
import {setupAuthoring,authoringState,authoringPrompt,verifyAuthoring,stages,variants} from '../tests/helpers/authoring.mjs';
import {snapshot,hash} from '../plugin/runtime/snapshot.mjs';
export async function evaluateAuthoring({host,stage,variant='happy'}={}) {
  assert.ok(['codex','claude'].includes(host)&&stages.includes(stage)&&variants.includes(variant),'Expected host, authoring stage and known variant');
  assemble(repositoryRoot,{check:true});const owned=fs.mkdtempSync(path.join(os.tmpdir(),`idd-authoring-${host}-${stage}-${variant}-`)),project=path.join(owned,'project with spaces');const result={host,stage,variant,date:new Date().toISOString(),outcome:'blocked',evidence:owned,project,limitations:['Mechanical output/response checks require independent trace review; they do not establish human peer review or native alias behavior.']};
  try {
    setupAuthoring(project,stage,variant);const source=path.join(owned,'copied source');fs.cpSync(path.join(repositoryRoot,'plugin/skills','idd-'+stage),source,{recursive:true});installLocal(source,project,'idd-'+stage,{copy:true,stateRoot:owned,agents:[host==='claude'?'claude-code':'codex']});fs.rmSync(source,{recursive:true});
    const state=authoringState(project,stage,variant);fs.writeFileSync(path.join(owned,'baseline.json'),JSON.stringify(state,null,2));
    const skill=path.join(project,host==='claude'?'.claude/skills':'.agents/skills','idd-'+stage,'SKILL.md');result.bundleHash=hash(JSON.stringify(snapshot(path.dirname(skill))));result.evaluatorHash=hash(fs.readFileSync(fileURLToPath(import.meta.url)));result.oracleHash=hash(fs.readFileSync(path.join(repositoryRoot,'tests/helpers/authoring.mjs')));
    const version=await runHost(host,['--version'],{cwd:project,timeout:15000,maxBytes:10000});result.version=version.stdout.trim();if(version.code!==0||version.reason)throw Error(`Host unavailable: ${version.reason??version.stderr}`);
    const prompt=authoringPrompt(stage,variant,skill),invocation=hostInvocation(host,prompt,project);result.invocation=invocation;fs.writeFileSync(path.join(owned,'prompt.txt'),prompt);
    const receipt=await runHost(invocation.command,invocation.args,{cwd:project,input:prompt,timeout:600000,maxBytes:4*1024*1024});fs.writeFileSync(path.join(owned,'stdout.log'),receipt.stdout);fs.writeFileSync(path.join(owned,'stderr.log'),receipt.stderr);result.process={code:receipt.code,reason:receipt.reason};
    if(receipt.reason||receipt.code!==0)throw Error(`Host blocked: ${receipt.reason??receipt.code}`);
    if(host==='claude'){const events=receipt.stdout.trim().split('\n').map(l=>JSON.parse(l)),init=events.find(e=>e.type==='system'&&e.subtype==='init'),final=events.findLast(e=>e.type==='result');result.model=init?.model;result.outputStyle=init?.output_style;if(!final||final.is_error)throw Error('Claude host error result');}
    result.outcome='failed';Object.assign(result,verifyAuthoring(project,state,receipt.stdout));
  }catch(error){result.error=error.message;if(error.code==='HOST_BLOCKED')result.outcome='blocked';}
  fs.writeFileSync(path.join(owned,'result.json'),JSON.stringify(result,null,2)+'\n');return result;
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
  try {const args=process.argv.slice(2),options={};for(let i=0;i<args.length;i+=2){assert.ok(['--host','--stage','--variant'].includes(args[i])&&args[i+1]&&!Object.hasOwn(options,args[i].slice(2)));options[args[i].slice(2)]=args[i+1];}const result=await evaluateAuthoring(options);console.log(JSON.stringify({outcome:result.outcome,evidence:result.evidence,error:result.error},null,2));if(result.outcome!=='passed')process.exitCode=1;}catch(error){console.error(error.message);process.exitCode=1;}
}
