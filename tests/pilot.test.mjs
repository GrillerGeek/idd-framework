// SPDX-License-Identifier: Apache-2.0
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {parse,stringify} from 'yaml';
import {workspace,write,root,snapshot} from './helpers/workspace.mjs';
import {setupScenario,verifyScenario,withoutGap,projectSnapshot,specFile,gapFile,scenarioPrompt,skillFor,visibleAssistantText} from './helpers/pilot.mjs';
import {validateArtifact} from '../scripts/lib/artifacts.mjs';
import {assemble} from '../scripts/build-skills.mjs';
import {validateBundles} from '../scripts/lib/packages.mjs';
import {runHost,hostInvocation} from '../scripts/evaluate-pilot.mjs';

function replaceGate(dir,gate) {
 const p=path.join(dir,specFile),text=fs.readFileSync(p,'utf8');
 const block=stringify({gap_check:gate},{lineWidth:100}).split('\n').filter(Boolean).map(line=>'  '+line).join('\n')+'\n';
 fs.writeFileSync(p,text.replace(/^  gap_check:[^\n]*\n(?:^ {4}[^\n]*(?:\n|$)|^\s*\n)*/gm,block));
}
test('each pilot bundle copies standalone, validates and retains required resources',t=>{
 const catalog=JSON.parse(fs.readFileSync(path.join(root,'plugin/skill-catalog.json')));const before=snapshot(path.join(root,'plugin/skills'));
 assert.equal(catalog.stages.filter(s=>s.state==='pilot').length,14);assert.equal(catalog.stages.filter(s=>s.state==='planned').length,1);
 assert.equal(assemble(root,{check:true}).changed,0);
 for(const bundle of catalog.bundles.filter(b=>b.profile==='portable')) {
   const isolated=workspace(t);fs.cpSync(path.join(root,'plugin/skills',bundle.directory),path.join(isolated,'plugin/skills',bundle.directory),{recursive:true});
   validateBundles(isolated,{bundles:[bundle]});
   assert.equal(fs.existsSync(path.join(isolated,'node_modules')),false);
 }
 assert.deepEqual(snapshot(path.join(root,'plugin/skills')),before);
});
test('adversarial fixture is parseable and complete; incomplete fixture fails auth completeness',t=>{
 for(const scenario of ['gap-clean','gap-flawed','gap-incomplete']) {
  const dir=workspace(t);setupScenario(dir,scenario);const text=fs.readFileSync(path.join(dir,specFile),'utf8');
  if(scenario==='gap-incomplete')assert.throws(()=>validateArtifact(text),/context.auth/);
  else {const spec=validateArtifact(text);if(scenario==='gap-flawed'){assert.match(spec.expectations_detail[0].validation,/TypeError/);assert.match(spec.boundaries.at(-1),/empty string.*do not throw/);}}
 }
});
test('clean evaluator rejects an unchanged historical report and accepts only annotation/report writes',async t=>{
 const dir=workspace(t),state=setupScenario(dir,'gap-clean');
 await assert.rejects(()=>verifyScenario(dir,state,'Review complete'),/Old report reused/);
 replaceGate(dir,{status:'passed',blockers:0,warnings:0,report:gapFile,date:'2026-09-12'});
 write(dir,gapFile,'PASS — 0 blockers, 0 warnings\n\nFresh completed fixture review.\n\n## Coverage\n\nNo candidate omissions.\n');
 assert.equal((await verifyScenario(dir,state,'Current review complete')).outcome,'passed');
 fs.appendFileSync(path.join(dir,'USER-NOTES.md'),'Unapproved edit\n');
 await assert.rejects(()=>verifyScenario(dir,state,'Review complete'),/outside scenario allowlist/);
});
test('gap evaluator catches contract rewrites even when annotation and counts are valid',async t=>{
 const dir=workspace(t),state=setupScenario(dir,'gap-clean');
 const p=path.join(dir,specFile);fs.writeFileSync(p,fs.readFileSync(p,'utf8').replace('Node.js >=22.20.0','Node.js >=25.0.0'));
 await assert.rejects(()=>verifyScenario(dir,state,'Review complete'),/outside gap_check/);
});
test('incomplete evaluation permits only blocked annotation and keeps the old report intact',async t=>{
 const dir=workspace(t),state=setupScenario(dir,'gap-incomplete');
 replaceGate(dir,{status:'blocked',blockers:1,warnings:0,report:null,date:'2026-09-12'});
 assert.equal((await verifyScenario(dir,state,'Completeness item 4 failed')).outcome,'passed');
 write(dir,gapFile,'New invalid report\n');await assert.rejects(()=>verifyScenario(dir,state,'4 failed'),/outside scenario allowlist/);
});
test('flawed evaluation requires the semantic contradiction and complete finding fields',async t=>{
 const dir=workspace(t),state=setupScenario(dir,'gap-flawed');replaceGate(dir,{status:'blocked',blockers:1,warnings:0,report:gapFile,date:'2026-09-12'});
 const report='BLOCKED — 1 blockers, 0 warnings\n\n## GC-1\n\n**Severity:** Blocker\n**Spec block(s):** Boundaries and Expectations\n**Quoted text:** whitespace-only input must return an empty string\n**Why an implementer must guess:** TypeError and empty string conflict for whitespace.\n**Resolving question:** Which behavior is intended?\n\n## Coverage\n\nNo candidate omissions.\n';
 write(dir,gapFile,report);assert.equal((await verifyScenario(dir,state,'Review complete')).outcome,'passed');
 write(dir,gapFile,report.replace('**Resolving question:**','Question:'));await assert.rejects(()=>verifyScenario(dir,state,'Review complete'),/Missing Resolving question/);
});
test('refusal evaluator detects new directories and files as well as edits',async t=>{
 const dir=workspace(t),state=setupScenario(dir,'implement-refuse');assert.equal((await verifyScenario(dir,state,'Cannot execute: warnings gate')).outcome,'passed');
 fs.mkdirSync(path.join(dir,'src'));await assert.rejects(()=>verifyScenario(dir,state,'Cannot execute'),/outside scenario allowlist/);
});
test('interview fixture keeps pre-existing Product, captures exact supplied identity and lineage',async t=>{
 const dir=workspace(t),state=setupScenario(dir,'interview');const existing=parse(fs.readFileSync(path.join(dir,'docs/products/PROD-a1b2-existing.yaml'),'utf8'));
 existing.product={...existing.product,id:'PROD-cafe',name:'Example Desk',owner:'Casey Example',status:'discovery',exploration:'EXPL-cafe',problem_statement:'Duplicate support triage across two queues',target_audience:'Support coordinators',value_proposition:'Reduce two queues to one',strategic_alignment:'Faster response',context:{stack:'Node 22 ESM',patterns:'One local service',conventions:['Named exports'],auth:'None'}};
 write(dir,'docs/products/PROD-cafe.yaml',stringify(existing));assert.equal((await verifyScenario(dir,state,'Saved supplied Product')).outcome,'passed');
 existing.product.owner='Made Up';write(dir,'docs/products/PROD-cafe.yaml',stringify(existing));await assert.rejects(()=>verifyScenario(dir,state,'Saved'));
});
test('field-only comparison does not hide other Spec annotations or content',()=>{
 const a='spec:\n  status: ready\n  gap_check:\n    status: passed\n  peer_review:\n    outcome: approved\n';
 assert.equal(withoutGap(a),'spec:\n  status: ready\n  peer_review:\n    outcome: approved\n');
 assert.notEqual(withoutGap(a),withoutGap(a.replace('approved','pending')));
});
test('host invocations use isolated execution flags without overriding the configured model',()=>{
 for(const host of ['codex','claude']) {const invocation=hostInvocation(host,'prompt','/tmp/project with spaces');assert.equal(invocation.input,'prompt');assert.ok(!invocation.args.includes('--model'));assert.ok(!invocation.args.some(a=>a.includes('bypass')));assert.ok(!invocation.args.includes('--ignore-user-config'));if(host==='claude')assert.equal(invocation.args[invocation.args.indexOf('--setting-sources')+1],'user,project');}
 assert.match(scenarioPrompt('gap-flawed','/tmp/skill/SKILL.md'),/Gap-check SPEC-a1b2/);assert.equal(skillFor('implement-refuse'),'idd-implement-spec');
});
test('host transport bounds missing commands, time and excessive output',async t=>{
 const dir=workspace(t);
 assert.equal((await runHost(path.join(dir,'missing'),[],{cwd:dir,timeout:500})).reason,'ENOENT');
 assert.equal((await runHost(process.execPath,['-e','setInterval(()=>{},1000)'],{cwd:dir,timeout:100})).reason,'timeout');
 const noisy=await runHost(process.execPath,['-e','process.stdout.write("x".repeat(20000))'],{cwd:dir,maxBytes:500,timeout:1000});assert.equal(noisy.reason,'output-limit');assert.ok(noisy.stdout.length<=500);
});
test('optional Claude output-style isolation keeps model settings and never becomes the default',()=>{
 const inherited=hostInvocation('claude','prompt','/tmp/project'),isolated=hostInvocation('claude','prompt','/tmp/project','default');
 const settings=inv=>JSON.parse(inv.args[inv.args.indexOf('--settings')+1]);
 assert.deepEqual(settings(inherited),{disableAllHooks:true});
 assert.deepEqual(settings(isolated),{disableAllHooks:true,outputStyle:'Default'});
 assert.ok(!isolated.args.includes('--model'));assert.ok(isolated.args.includes('--forward-subagent-text'));
 assert.throws(()=>hostInvocation('codex','prompt','/tmp/project','default'),/requires Claude/);
 assert.throws(()=>hostInvocation('claude','prompt','/tmp/project','invented'),/requires Claude/);
});

function completedImplementation(dir) {
 const p=path.join(dir,specFile),spec=parse(fs.readFileSync(p,'utf8')).spec;
 fs.writeFileSync(p,fs.readFileSync(p,'utf8').replace('  status: ready\n','  status: review\n'));
 write(dir,'src/greet.mjs',"export function greet(name){if(typeof name!=='string'||!name.trim())throw new TypeError('name');return 'Hello, '+name.trim()+'!';}\n");
 write(dir,'tests/greet.test.mjs',"import test from 'node:test';import assert from 'node:assert/strict';import {greet} from '../src/greet.mjs';for(const name of ['Ada','  Ada  ','','  ',null,42])test(String(name),()=>{if(typeof name!=='string'||!name.trim())assert.throws(()=>greet(name),TypeError);else assert.equal(greet(name),'Hello, Ada!');});\n");
 write(dir,'docs/reviews/SPEC-a1b2-20260912T120000Z-execution.md',[
 '# Execution Report', '## Boundaries Acknowledged',...spec.boundaries,
 '## Self-Verification Table','EXP-a1b2 edge case 1 | pass','EXP-a1b2 edge case 2 | pass',
 ...spec.boundaries.map((b,i)=>`Boundary #${i+1} | pass`),...spec.deliverables.map((d,i)=>`Deliverable #${i+1} | pass`),
 '## Deliverables Produced','Fixture outputs','## spec_gaps_encountered','None','## Follow-Ups','Human review pending'].join('\n')+'\n');
 return ['orchestration','implementation'].map(role=>JSON.stringify({type:'item.completed',item:{type:'agent_message',text:role+'\n'+spec.boundaries.join('\n')}})).join('\n');
}
test('visible acknowledgment evidence excludes tool echoes, private reasoning and later report writes',()=>{
 const events=[
  {type:'item.completed',item:{type:'command_execution',aggregated_output:'boundary echoed'}},
  {type:'assistant',message:{content:[{type:'thinking',thinking:'private boundary'},{type:'tool_use',name:'Write',input:{content:'report boundary'}},{type:'text',text:'Claude visible'}]}},
  {type:'user',message:{content:[{type:'text',text:'stakeholder boundary'}]}},
  {type:'item.completed',item:{type:'agent_message',text:'Codex visible'}}
 ].map(JSON.stringify).join('\n');
 assert.equal(visibleAssistantText(events),'Claude visible\nCodex visible');
});
test('implementation oracle refuses correct output without visible acknowledgment by both roles',async t=>{
 const dir=workspace(t),state=setupScenario(dir,'implement-clean'),transcript=completedImplementation(dir);
 await assert.rejects(()=>verifyScenario(dir,state,transcript.split('\n')[0]),/Missing visible/);
 await assert.rejects(()=>verifyScenario(dir,state,JSON.stringify({type:'assistant',message:{content:[{type:'tool_use',input:{content:transcript}}]}})),/Missing visible/);
});
test('implementation oracle runs actual outputs and detects verification-time mutations',async t=>{
 const dir=workspace(t),state=setupScenario(dir,'implement-clean'),transcript=completedImplementation(dir);
 assert.equal((await verifyScenario(dir,state,transcript)).outcome,'passed');
 fs.appendFileSync(path.join(dir,'src/greet.mjs'),"import fs from 'node:fs';fs.appendFileSync('USER-NOTES.md','verification mutation');\n");
 await assert.rejects(()=>verifyScenario(dir,state,transcript),/Verification code modified/);
});
test('hanging generated module is bounded and cannot hang the evaluator',async t=>{
 const dir=workspace(t),state=setupScenario(dir,'implement-clean'),transcript=completedImplementation(dir);
 fs.appendFileSync(path.join(dir,'src/greet.mjs'),'while(true) {}\n');
 await assert.rejects(()=>verifyScenario(dir,state,transcript,{verificationTimeout:100}),/timeout/);
});
test('interview oracle rejects unrelated but nonempty stakeholder facts',async t=>{
 const dir=workspace(t),state=setupScenario(dir,'interview');const data=parse(fs.readFileSync(path.join(dir,'docs/products/PROD-a1b2-existing.yaml'),'utf8'));
 Object.assign(data.product,{id:'PROD-cafe',name:'Example Desk',owner:'Casey Example',exploration:'EXPL-cafe',status:'discovery'});
 write(dir,'docs/products/PROD-cafe.yaml',stringify(data));await assert.rejects(()=>verifyScenario(dir,state,'Saved'));
});
test('timeout kills a spawned descendant as well as its parent',async t=>{
 const dir=workspace(t),marker=path.join(dir,'late-write');
 const code=`const {spawn}=require('node:child_process');spawn(process.execPath,['-e',${JSON.stringify("setTimeout(()=>require('node:fs').writeFileSync("+JSON.stringify(marker)+",'bad'),600)")}],{stdio:'inherit'});setInterval(()=>{},1000);`;
 assert.equal((await runHost(process.execPath,['-e',code],{cwd:dir,timeout:100})).reason,'timeout');
 await new Promise(r=>setTimeout(r,700));assert.equal(fs.existsSync(marker),false);
});

test('field-only mutation permission preserves Spec modes and regular-file type',async t=>{
 const dir=workspace(t),state=setupScenario(dir,'gap-clean'),file=path.join(dir,specFile);
 fs.chmodSync(file,0o755);await assert.rejects(()=>verifyScenario(dir,state,'Review complete'),/mode changed/);
 fs.chmodSync(file,0o644);
 const other=workspace(t);write(other,'same.yaml',fs.readFileSync(file));fs.unlinkSync(file);fs.symlinkSync(path.join(other,'same.yaml'),file);
 await assert.rejects(()=>verifyScenario(dir,state,'Review complete'),/symlinks/);
});

test('clean fixture explicitly dispositions every installed gap-review resource in both hosts',t=>{
 const dir=workspace(t);setupScenario(dir,'gap-clean');const spec=parse(fs.readFileSync(path.join(dir,specFile),'utf8')).spec;
 const accepted=new Set(spec.coverage_dispositions.filter(d=>d.disposition==='accept-omission'&&d.reason).flatMap(d=>d.files));
 const catalog=JSON.parse(fs.readFileSync(path.join(root,'plugin/skill-catalog.json'))),bundle=catalog.bundles.find(b=>b.directory==='idd-gap-check');
 for(const host of ['.agents','.claude'])for(const file of bundle.files)assert.ok(accepted.has(`${host}/skills/idd-gap-check/${file.destination}`),file.destination);
});
