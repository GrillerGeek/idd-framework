// SPDX-License-Identifier: Apache-2.0
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {parse} from 'yaml';
import {workspace,write} from './helpers/workspace.mjs';
import {setupScenario,specFile,projectSnapshot} from './helpers/pilot.mjs';
import {hostInvocation} from '../scripts/evaluate-pilot.mjs';
import {checkpointInvocation,phaseEvidence,validateAcknowledgment,verifyExecutionReport,runCheckpoint} from '../scripts/lib/claude-checkpoint.mjs';

function acknowledgment(spec,role) {return `Boundaries Acknowledged — ${role}\n\n`+spec.boundaries.map((b,i)=>`${i+1}. ${b}${role==='implementation'?'\nMeaning: I will keep the described resources intact.':''}`).join('\n\n');}
function response(args,text,extra={}) {
 const index=Math.max(args.indexOf('--session-id'),args.indexOf('--resume')),session_id=args[index+1];
 const model=args.includes('--model')?args[args.indexOf('--model')+1]:'configured-model[1m]';
 const events=[{type:'system',subtype:'init',session_id,model,output_style:'ELI5',tools:args[args.indexOf('--tools')+1].split(',')},
 {type:'assistant',message:{content:[{type:'text',text}]}},
 {type:'result',session_id,is_error:false,result:text}];
 return {code:0,signal:null,reason:null,stdout:events.map(JSON.stringify).join('\n')+'\n',stderr:'',...extra};
}
function completedBuild(dir) {
 const spec=parse(fs.readFileSync(path.join(dir,specFile),'utf8')).spec;
 write(dir,'src/greet.mjs',"export function greet(name){if(typeof name!=='string'||!name.trim())throw new TypeError('name');return 'Hello, '+name.trim()+'!';}\n");
 write(dir,'tests/greet.test.mjs',"import test from 'node:test';import assert from 'node:assert/strict';import {greet} from '../src/greet.mjs';for(const name of ['Ada','  Ada  ','','  ',null,42])test(String(name),()=>{if(typeof name!=='string'||!name.trim())assert.throws(()=>greet(name),TypeError);else assert.equal(greet(name),'Hello, Ada!');});\n");
 const labels=['EXP-a1b2 edge case 1','EXP-a1b2 edge case 2',...spec.boundaries.map((_,i)=>`Boundary #${i+1}`),...spec.deliverables.map((_,i)=>`Deliverable #${i+1}`),...spec.validation.automated.map((_,i)=>`Automated check #${i+1}`)];
 const file='docs/reviews/SPEC-a1b2-20260912T120000Z-execution.md';
 write(dir,file,['# Execution Report: SPEC-a1b2','## Header','Spec ID: SPEC-a1b2','## Boundaries Acknowledged',...spec.boundaries,'## Self-Verification Table',
 '| Item | Status | Evidence |','|---|---|---|',...labels.map(label=>`| ${label} | pass | Checked the fixture output. |`),
 '## Deliverables Produced','src/greet.mjs and tests/greet.test.mjs','## spec_gaps_encountered','None.','## Follow-Ups','Human review pending.'].join('\n')+'\n');
 return file;
}
function harness(t,scenario='implement-clean') {
 const project=workspace(t),state=setupScenario(project,scenario),spec=parse(state.specText).spec,calls=[];
 const options={project,state,skillPath:path.join(project,'.claude/skills/idd-implement-spec/SKILL.md'),baseInvocation:hostInvocation('claude','',project)};
 const run=async (command,args,opts)=>{
   calls.push({args,opts,status:parse(fs.readFileSync(path.join(project,specFile),'utf8')).spec.status});
   if(calls.length===3) {completedBuild(project);return response(args,'Implementation complete; returning to controller.');}
   return response(args,acknowledgment(spec,calls.length===1?'orchestration':'implementation'));
 };
 return {project,state,spec,calls,options,run};
}
test('staged controller validates both read-only checkpoints before a verified lifecycle transition',async t=>{
 const h=harness(t),result=await runCheckpoint({...h.options,run:h.run});
 assert.equal(result.outcome,'passed',result.error);assert.equal(result.disposition,'controller-verified-build');
 assert.deepEqual(h.calls.map(c=>c.status),['ready','in-progress','in-progress']);
 assert.equal(fs.readFileSync(path.join(h.project,specFile),'utf8'),h.state.specText.replace('  status: ready','  status: review'));
 assert.equal(result.phases.length,3);assert.ok(result.phases.every(p=>p.outcome==='passed'));
 for(const [i,c] of h.calls.entries()) {
   assert.deepEqual(c.args[c.args.indexOf('--tools')+1].split(','),i===2?['Read','Glob','Grep','Write','Edit','Bash']:['Read','Glob','Grep']);
   assert.ok(!c.args.includes('--no-session-persistence'));assert.ok(c.args.includes('--disable-slash-commands'));
   if(i)assert.equal(c.args[c.args.indexOf('--model')+1],'configured-model[1m]');else assert.ok(!c.args.includes('--model'));
 }
});
test('missing or partial phase acknowledgment prevents subsequent work and preserves prior status',async t=>{
 for(const failure of [1,2]) {
  const h=harness(t);let n=0;
  const result=await runCheckpoint({...h.options,run:async (...args)=>{n++;if(n===failure)return response(args[1],'Ready to proceed.');return h.run(...args);}});
  assert.equal(result.outcome,'failed');assert.match(result.error,/role-specific/);assert.equal(n,failure);
  assert.equal(parse(fs.readFileSync(path.join(h.project,specFile),'utf8')).spec.status,failure===1?'ready':'in-progress');
  assert.equal(fs.existsSync(path.join(h.project,'src')),false);
 }
});
test('read-only phase mutation prevents any transition or writable launch',async t=>{
 const h=harness(t);let calls=0;
 const result=await runCheckpoint({...h.options,run:async (...args)=>{calls++;const r=await h.run(...args);fs.appendFileSync(path.join(h.project,'USER-NOTES.md'),'bad');return r;}});
 assert.equal(result.outcome,'failed');assert.match(result.error,/read-only checkpoint/);assert.equal(calls,1);
 assert.equal(fs.readFileSync(path.join(h.project,specFile),'utf8'),h.state.specText);
});
test('invalid gates and duplicate YAML keys start no workflow host',async t=>{
 const h=harness(t,'implement-refuse'),before=projectSnapshot(h.project);
 const result=await runCheckpoint({...h.options,run:()=>assert.fail('Must not launch host')});
 assert.equal(result.outcome,'passed');assert.equal(result.disposition,'controller-refused');assert.equal(result.hostInvocations,0);assert.deepEqual(projectSnapshot(h.project),before);
 const invalid=harness(t);fs.appendFileSync(path.join(invalid.project,specFile),'  status: ready\n');invalid.state.specText=fs.readFileSync(path.join(invalid.project,specFile),'utf8');
 const bad=await runCheckpoint({...invalid.options,run:()=>assert.fail('Must not launch host')});
 assert.equal(bad.outcome,'failed');assert.match(bad.error,/DUPLICATE_KEY/);assert.equal(bad.hostInvocations,0);
});
test('phase evidence rejects tool echoes, changed session/model and unexpected tools',()=>{
 const base=hostInvocation('claude','','/tmp/project');
 const inv=checkpointInvocation(base,{sessionId:'same',phase:'orchestration'}),valid=response(inv.args,'Ready');
 const options={sessionId:'same',phase:'orchestration'};
 for(const mutate of [events=>events[2].session_id='other',events=>events[0].tools.push('Bash'),events=>events[1].message.content=[{type:'tool_use',name:'Read',input:{text:'Ready'}}]]) {
  const events=valid.stdout.trim().split('\n').map(JSON.parse);mutate(events);
  assert.throws(()=>phaseEvidence({...valid,stdout:events.map(JSON.stringify).join('\n')},options));
 }
 assert.throws(()=>phaseEvidence(valid,{...options,model:'another'}),/model/);
});
test('phase-local acknowledgment requires every ordered boundary and a separate implementation paraphrase',async t=>{
 const h=harness(t),text=acknowledgment(h.spec,'implementation');validateAcknowledgment(text,'implementation',h.spec.boundaries);
 assert.throws(()=>validateAcknowledgment(text,'orchestration',h.spec.boundaries),/role-specific/);
 assert.throws(()=>validateAcknowledgment(text.replace(h.spec.boundaries[1],'changed'),'implementation',h.spec.boundaries),/verbatim/);
 assert.throws(()=>validateAcknowledgment(text.replace(/\nMeaning:[^\n]+/g,''),'implementation',h.spec.boundaries),/paraphrase/);
});
test('failed report rows and blocker gaps reject otherwise correct builds before review',async t=>{
 for(const replacement of ['| Boundary #1 | fail |','| Automated check #2 | provisional |','| Deliverable #3 | unverifiable at build time |']) {
  const h=harness(t),result=await runCheckpoint({...h.options,run:async (...args)=>{
   const r=await h.run(...args);if(h.calls.length===3){const f=path.join(h.project,'docs/reviews/SPEC-a1b2-20260912T120000Z-execution.md');fs.writeFileSync(f,fs.readFileSync(f,'utf8').replace(replacement.replace(/\| (?:fail|provisional|unverifiable at build time) \|$/,'| pass |'),replacement));}return r;
  }});
  assert.equal(result.outcome,'failed');assert.match(result.error,/Unfinished report row/);assert.equal(parse(fs.readFileSync(path.join(h.project,specFile),'utf8')).spec.status,'in-progress');
 }
 const h=harness(t);const file=completedBuild(h.project);fs.appendFileSync(path.join(h.project,file),'');
 const text=fs.readFileSync(path.join(h.project,file),'utf8');fs.writeFileSync(path.join(h.project,file),text.replace('None.','severity: blocker-grade'));
 assert.throws(()=>verifyExecutionReport(h.project,h.spec),/Blocker-grade/);
});
test('model lifecycle writes are detected and preserved as failure, never silently repaired',async t=>{
 const h=harness(t),result=await runCheckpoint({...h.options,run:async (...args)=>{
  const r=await h.run(...args);if(h.calls.length===3){const f=path.join(h.project,specFile);fs.writeFileSync(f,fs.readFileSync(f,'utf8').replace('status: in-progress','status: review'));}return r;
 }});
 assert.equal(result.outcome,'failed');assert.match(result.error,/Implementer changed lifecycle/);
});
test('transport failure prevents continuation and shared time/output budgets shrink across phases',async t=>{
 const h=harness(t);let clock=0;
 const result=await runCheckpoint({...h.options,now:()=>clock,timeout:1000,maxBytes:50000,run:async (...args)=>{const r=await h.run(...args);clock+=100;return h.calls.length===2?{...r,reason:'timeout',code:null}:r;}});
 assert.equal(result.outcome,'blocked');assert.equal(result.hostInvocations,2);assert.ok(h.calls[1].opts.timeout<h.calls[0].opts.timeout);assert.ok(h.calls[1].opts.maxBytes<h.calls[0].opts.maxBytes);
 assert.equal(parse(fs.readFileSync(path.join(h.project,specFile),'utf8')).spec.status,'in-progress');
});

test('checkpoint rejects quoted examples, late headings and extra assertions outside its blocks',t=>{
 const h=harness(t),valid=acknowledgment(h.spec,'orchestration');
 for(const text of ['Example only, not an acknowledgment:\n```text\n'+valid+'\n```',valid.split('\n').slice(1).join('\n')+'\nBoundaries Acknowledged — orchestration',valid+'\nI do not accept these restrictions.'])
  assert.throws(()=>validateAcknowledgment(text,'orchestration',h.spec.boundaries));
 validateAcknowledgment(valid.replace(/^(\d+)\. /gm,'Boundary #$1\n'),'orchestration',h.spec.boundaries);
});
test('phase evidence rejects missing/changed output style across resume',()=>{
 const inv=checkpointInvocation(hostInvocation('claude','','/tmp/project'),{sessionId:'same',phase:'implementation',model:'configured-model[1m]'});
 for(const style of [undefined,'Default']) {
  const r=response(inv.args,'Ready'),events=r.stdout.trim().split('\n').map(JSON.parse);events[0].output_style=style;
  assert.throws(()=>phaseEvidence({...r,stdout:events.map(JSON.stringify).join('\n')},{sessionId:'same',phase:'implementation',model:'configured-model[1m]',outputStyle:'ELI5'}),/output style/);
 }
});
test('explicit no-gap prose is valid while a recorded blocker-grade entry prevents acceptance',t=>{
 const h=harness(t),f=path.join(h.project,completedBuild(h.project)),text=fs.readFileSync(f,'utf8');
 fs.writeFileSync(f,text.replace('None.','None — no blocker-grade gaps were encountered.'));verifyExecutionReport(h.project,h.spec);
 fs.writeFileSync(f,text.replace('None.','- **severity:** blocker-grade\n  **resolution:** stopped — reported to author'));
 assert.throws(()=>verifyExecutionReport(h.project,h.spec),/Blocker-grade/);
});
test('successful transport containing a Claude service error remains blocked and stops continuation',async t=>{
 const h=harness(t),result=await runCheckpoint({...h.options,run:async (command,args)=>{
  const r=response(args,'Service unavailable'),events=r.stdout.trim().split('\n').map(JSON.parse);events[2].is_error=true;
  return {...r,stdout:events.map(JSON.stringify).join('\n')};
 }});
 assert.equal(result.outcome,'blocked');assert.equal(result.hostInvocations,1);assert.match(result.error,/Claude error result/);
 assert.equal(fs.readFileSync(path.join(h.project,specFile),'utf8'),h.state.specText);
});
