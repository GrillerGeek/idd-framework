// SPDX-License-Identifier: Apache-2.0
// Optional real-host controlled process evaluation; never executed by npm test/CI.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {assemble,repositoryRoot} from './build-skills.mjs';
import {installLocal} from './test-install.mjs';
import {hostInvocation,runHost} from './evaluate-pilot.mjs';
import {snapshot,hash} from '../plugin/runtime/snapshot.mjs';
import {setupForge,forgeState,forgePrompt,verifyForge,eventsAt,cleanupForge,verifyCleanup} from '../tests/helpers/forge-workflow.mjs';
export async function evaluateForge({host,variant='success'}={}){
 assert.ok(['codex','claude'].includes(host)&&['success','failure'].includes(variant));assemble(repositoryRoot,{check:true});
 const owned=fs.mkdtempSync(path.join(os.tmpdir(),`idd-forge-${host}-${variant}-`)),result={host,variant,date:new Date().toISOString(),evidence:owned,outcome:'blocked',limitations:['Controlled argv/process fixture only; no published UI, native alias or cross-session persistence certification. Full independent trace review required.']};let fixture;
 try{
  fixture=setupForge(owned,variant);result.project=fixture.project;const source=path.join(owned,'copied source');fs.cpSync(path.join(repositoryRoot,'plugin/skills/idd-forge'),source,{recursive:true});installLocal(source,fixture.project,'idd-forge',{copy:true,stateRoot:owned,agents:[host==='claude'?'claude-code':'codex']});fs.rmSync(source,{recursive:true});
  const state=forgeState(fixture.project),skill=path.join(fixture.project,host==='claude'?'.claude/skills':'.agents/skills','idd-forge/SKILL.md');fs.writeFileSync(path.join(owned,'baseline.json'),JSON.stringify(state,null,2));result.bundleHash=hash(JSON.stringify(snapshot(path.dirname(skill))));result.evaluatorHash=hash(fs.readFileSync(fileURLToPath(import.meta.url)));result.oracleHash=hash(fs.readFileSync(path.join(repositoryRoot,'tests/helpers/forge-workflow.mjs')));result.fixtureHash=hash(fs.readFileSync(fixture.fixture));
  const version=await runHost(host,['--version'],{cwd:fixture.project,timeout:15000,maxBytes:10000});result.version=version.stdout.trim();if(version.reason||version.code!==0)throw Error('Host unavailable');
  const prompt=forgePrompt(skill,fixture),invocation=hostInvocation(host,prompt,fixture.project);if(host==='codex'){invocation.args=invocation.args.filter(a=>a!=='--ephemeral');invocation.args.splice(1,0,'-c','sandbox_workspace_write.network_access=true');result.persistence='Normal owned Codex rollout retained to capture original background tool returns omitted from JSON stdout; personal configuration unchanged.';result.networkProfile='Per-invocation workspace sandbox network access for controlled loopback fixture; personal configuration unchanged.';}result.invocation={command:'env',args:[`PATH=${fixture.bin}${path.delimiter}${process.env.PATH}`,invocation.command,...invocation.args]};fs.writeFileSync(path.join(owned,'prompt.txt'),prompt);
  const receipt=await runHost(result.invocation.command,result.invocation.args,{cwd:fixture.project,input:prompt,timeout:600000,maxBytes:4*1024*1024});fs.writeFileSync(path.join(owned,'stdout.log'),receipt.stdout);fs.writeFileSync(path.join(owned,'stderr.log'),receipt.stderr);result.process={code:receipt.code,reason:receipt.reason};if(receipt.reason||receipt.code!==0)throw Error(`Host blocked: ${receipt.reason??receipt.code}`);
  if(host==='codex'){
   const id=receipt.stdout.split('\n').map(l=>{try{return JSON.parse(l);}catch{return null;}}).find(e=>e?.type==='thread.started')?.thread_id;assert.match(id??'',/^[0-9a-f-]{36}$/);
   const sessionRoot=path.join(process.env.CODEX_HOME??path.join(os.homedir(),'.codex'),'sessions');let found;
   for(const delta of [-1,0,1]){const date=new Date(Date.parse(result.date)+delta*86400000).toISOString().slice(0,10).replaceAll('-','/'),directory=path.join(sessionRoot,date);if(fs.existsSync(directory))for(const name of fs.readdirSync(directory))if(name.endsWith('-'+id+'.jsonl')){assert.ok(!found,'Ambiguous owned rollout');found=path.join(directory,name);}}
   assert.ok(found,'Missing original owned Codex rollout');assert.ok(fs.statSync(found).size<=8*1024*1024,'Rollout source bound exceeded');const raw=fs.readFileSync(found,'utf8'),events=raw.trim().split('\n').map(JSON.parse),meta=events.find(e=>e.type==='session_meta');assert.equal(meta?.payload?.id,id);assert.equal(fs.realpathSync(meta.payload.cwd),fs.realpathSync(fixture.project));
   const selected=events.filter(e=>e.type==='response_item'&&['function_call','function_call_output','custom_tool_call','custom_tool_call_output'].includes(e.payload?.type));const serialized=selected.map(e=>JSON.stringify(e)).join('\n')+'\n';assert.ok(selected.length,'Missing original tool evidence');assert.ok(Buffer.byteLength(serialized)+Buffer.byteLength(receipt.stdout)+Buffer.byteLength(receipt.stderr)<=4*1024*1024,'Combined evidence bound exceeded');fs.writeFileSync(path.join(owned,'native-tools.jsonl'),serialized);result.nativeEvidence={threadId:id,source:found,sourceHash:hash(raw),filteredHash:hash(serialized),records:selected.length};
  }

  if(host==='claude'){const events=receipt.stdout.trim().split('\n').map(JSON.parse),init=events.find(e=>e.type==='system'&&e.subtype==='init'),last=events.findLast(e=>e.type==='result');result.model=init?.model;result.outputStyle=init?.output_style;if(!last||last.is_error)throw Error('Claude host error');}
  result.outcome='failed';Object.assign(result,verifyForge(fixture.project,state,eventsAt(fixture.evidence),receipt.stdout,variant));
 }catch(e){result.error=e.message;}finally{if(fixture){try{result.cleanup=await cleanupForge(fixture);verifyCleanup(eventsAt(fixture.evidence),result.cleanup);}catch(e){result.cleanupError=e.message;result.outcome='failed';}}}
 fs.writeFileSync(path.join(owned,'result.json'),JSON.stringify(result,null,2)+'\n');return result;
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){try{const a=process.argv.slice(2),options={};for(let i=0;i<a.length;i+=2){assert.ok(['--host','--variant'].includes(a[i])&&a[i+1]&&!Object.hasOwn(options,a[i].slice(2)));options[a[i].slice(2)]=a[i+1];}const r=await evaluateForge(options);console.log(JSON.stringify({outcome:r.outcome,evidence:r.evidence,error:r.error,cleanupError:r.cleanupError},null,2));if(r.outcome!=='passed')process.exitCode=1;}catch(e){console.error(e.message);process.exitCode=1;}}
