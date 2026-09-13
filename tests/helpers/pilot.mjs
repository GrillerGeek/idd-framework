// SPDX-License-Identifier: Apache-2.0
import fs from 'node:fs';
import path from 'node:path';
import {spawn} from 'node:child_process';
import assert from 'node:assert/strict';
import { parse, stringify } from 'yaml';
import { root, write } from './workspace.mjs';
import { sha256 } from '../../scripts/lib/files.mjs';
import { runProcess } from '../../scripts/lib/process.mjs';
import { validateArtifact } from '../../scripts/lib/artifacts.mjs';

// Bounded subprocess transport, including descendant cleanup on timeout/output overflow.
export function runHost(command,args,{cwd,input='',timeout=240000,maxBytes=4*1024*1024}={}) {
  return new Promise(resolve=>{
    let stdout='',stderr='',bytes=0,reason=null,settled=false;
    const env={...process.env};delete env.NODE_TEST_CONTEXT;
    const child=spawn(command,args,{cwd,env,detached:process.platform!=='win32',stdio:['pipe','pipe','pipe']});
    const terminate=why=>{reason??=why;try{if(process.platform==='win32')child.kill('SIGKILL');else process.kill(-child.pid,'SIGKILL');}catch{}};
    const timer=setTimeout(()=>terminate('timeout'),timeout);
    const finish=(code,signal)=>{if(settled)return;settled=true;clearTimeout(timer);resolve({code,signal,reason,stdout,stderr});};
    const receive=stream=>chunk=>{bytes+=chunk.length;if(bytes>maxBytes){terminate('output-limit');return;}if(stream==='stdout')stdout+=chunk;else stderr+=chunk;};
    child.stdout.on('data',receive('stdout'));child.stderr.on('data',receive('stderr'));
    child.on('exit',()=>{try{if(process.platform!=='win32')process.kill(-child.pid,'SIGKILL');}catch{}});
    child.on('error',error=>{reason=error.code??error.message;finish(null,null);});child.on('close',finish);
    child.stdin.on('error',()=>{});child.stdin.end(input);
  });
}
export const scenarios = ['interview','gap-clean','gap-flawed','gap-incomplete','implement-clean','implement-refuse'];
export const skillFor = scenario => scenario === 'interview' ? 'idd-interview' : scenario.startsWith('gap-') ? 'idd-gap-check' : 'idd-implement-spec';
export const specFile = 'docs/specs/SPEC-a1b2.yaml';
export const gapFile = 'docs/reviews/SPEC-a1b2-gap-check.md';
export function projectSnapshot(directory) {
  const files = {};
  function visit(dir, prefix = '') {
    for (const entry of fs.readdirSync(dir, {withFileTypes:true})) {
      if (!prefix && entry.name === '.git') continue;
      const relative = prefix ? `${prefix}/${entry.name}` : entry.name;
      const file = path.join(dir,entry.name), stat = fs.lstatSync(file);
      if (stat.isSymbolicLink()) files[relative] = {link:fs.readlinkSync(file),mode:stat.mode&0o777};
      else if (stat.isDirectory()) { files[`${relative}/`] = {directory:true};visit(file,relative); }
      else files[relative] = {hash:sha256(fs.readFileSync(file)),mode:stat.mode&0o777};
    }
  }
  visit(directory);return files;
}
export function setupScenario(directory, scenario) {
  assert.ok(scenarios.includes(scenario),`Unknown scenario: ${scenario}`);
  fs.cpSync(path.join(root,'tests/fixtures/pilot/project'),directory,{recursive:true});
  if (scenario === 'interview') {
    // Only a pre-existing unrelated Product; no setup-time hierarchy directories.
    for (const name of ['intentions','expectations','specs','reviews']) fs.rmSync(path.join(directory,'docs',name),{recursive:true});
    fs.renameSync(path.join(directory,'docs/products/PROD-a1b2.yaml'),path.join(directory,'docs/products/PROD-a1b2-existing.yaml'));
  } else {
    const data = parse(fs.readFileSync(path.join(directory,specFile),'utf8'));
    if (scenario === 'gap-flawed') data.spec.boundaries.push('For whitespace-only input, return an empty string and do not throw an exception.');
    if (scenario === 'gap-incomplete') data.spec.context.auth = '';
    if (scenario === 'implement-refuse') {
      data.spec.gap_check.status = 'warnings';data.spec.gap_check.warnings = 1;
      write(directory,gapFile,'PASS — 0 blockers, 1 warnings\n\n## Coverage\n\nA fixture warning is unresolved.\n');
    }
    write(directory,specFile,stringify(data,{lineWidth:100}));
  }
  runProcess('git',['init','-q'],{cwd:directory});
  runProcess('git',['add','.'],{cwd:directory});
  runProcess('git',['-c','user.name=IDD Fixture','-c','user.email=fixture@example.invalid','-c','commit.gpgsign=false','commit','-qm','Fixture baseline'],{cwd:directory});
  fs.appendFileSync(path.join(directory,'USER-NOTES.md'),'\nPre-existing uncommitted user decision: keep this line.\n');
  return {scenario,specText:scenario==='interview'?null:fs.readFileSync(path.join(directory,specFile),'utf8'),before:projectSnapshot(directory)};
}
export function scenarioPrompt(scenario, skillPath) {
  const base=`Use the installed ${skillFor(scenario)} skill at ${skillPath}. Work only in this disposable project; do not modify the installed bundle or personal configuration. Use the existing configured model. Follow the skill fully, using sequential reviewer/implementer phases when delegation is unavailable. Use existing Python with a duplicate-key-rejecting YAML loader if parsing is needed; do not install dependencies. Preserve every pre-existing user edit. `;
  if (scenario==='interview') return base+'Define a new Product called Example Desk. I am the stakeholder and confirm these details: owner Casey Example; problem duplicate support triage across two queues; audience support coordinators; value reduce two queues to one; strategic aim faster response; stack Node 22 ESM; pattern one local service; convention named exports; authentication none; originating exploration EXPL-cafe. These answers are confirmed and I authorize saving the Product. Reuse them without asking for reconfirmation.';
  if (scenario.startsWith('gap-')) return base+'Gap-check SPEC-a1b2. Review the actual Spec and repository, produce the current result, and leave contract content unchanged. The previous report is historical setup data, not your result.';
  return base+'Implement SPEC-a1b2. The fixture contains explicitly recorded fictional human readiness approval, supplied as a scenario fact. Inspect its current gate and follow the installed workflow. Do not request repeated readiness approval; preserve any later human implementation review for after the build.';
}
export function withoutGap(text) {
  return text.replace(/^  gap_check:[^\n]*\n(?:^ {4}[^\n]*(?:\n|$)|^\s*\n)*/gm,'');
}
// Count visible assistant messages only, never echoed files, tool input or private reasoning.
// Ordering relative to mutations and role ownership still require trace review.
export function visibleAssistantText(transcript) {
  const messages=[];
  for(const line of transcript.split('\n')) {
    let event;try {event=JSON.parse(line);} catch {continue;}
    if(event.type==='item.completed' && event.item?.type==='agent_message')messages.push(event.item.text??'');
    if(event.type==='assistant')for(const block of event.message?.content??[])if(block.type==='text')messages.push(block.text??'');
  }
  return messages.join('\n');
}
export async function verifyScenario(directory, state, transcript, {verificationTimeout=10000,expectedStatus='review'}={}) {
  const after=projectSnapshot(directory),changes=Object.keys({...state.before,...after}).filter(f=>JSON.stringify(state.before[f])!==JSON.stringify(after[f]));
  const execution=/^docs\/reviews\/SPEC-a1b2-\d{8}T\d{6}Z-execution\.md$/;
  const allow = file => {
    if(state.scenario==='interview')return /^docs\/products\/PROD-[a-f0-9]{4,8}\.yaml$/.test(file) && !state.before[file];
    if(state.scenario.startsWith('gap-'))return file===specFile || (state.scenario!=='gap-incomplete' && file===gapFile);
    if(state.scenario==='implement-clean')return [specFile,'src/','src/greet.mjs','tests/','tests/greet.test.mjs'].includes(file)||execution.test(file);
    return false;
  };
  assert.deepEqual(changes.filter(f=>!allow(f)),[],'Changes outside scenario allowlist');
  for(const file of changes) {
    assert.ok(!after[file]?.link,'Changed outputs must not be symlinks');
    if(state.before[file]) {
      assert.equal(after[file]?.mode,state.before[file].mode,`Existing file mode changed: ${file}`);
      assert.equal(after[file]?.directory,state.before[file].directory,`Existing file type changed: ${file}`);
    }
  }
  assert.ok(transcript.trim(),'Missing host response');
  if(state.scenario==='interview') {
    const newFiles=changes.filter(f=>/^docs\/products\/PROD-/.test(f));assert.equal(newFiles.length,1);
    const data=validateArtifact(fs.readFileSync(path.join(directory,newFiles[0]),'utf8'),{kind:'product'});
    assert.equal(data.name,'Example Desk');assert.equal(data.owner,'Casey Example');assert.equal(data.exploration,'EXPL-cafe');
    assert.equal(path.basename(newFiles[0]),`${data.id}.yaml`);assert.notEqual(data.id,'PROD-a1b2');
    for(const field of ['problem_statement','target_audience','value_proposition','strategic_alignment'])assert.ok(data[field]?.trim(),field);
    assert.equal(data.status,'discovery');
    assert.match(data.problem_statement,/duplicat/i);assert.match(data.problem_statement,/triage/i);
    assert.match(data.target_audience,/support coordinators/i);
    assert.match(data.value_proposition,/(?:two|2).*queues?.*(?:one|1)|(?:one|1).*queue.*(?:two|2)/i);
    assert.match(data.strategic_alignment,/faster.*response|response.*faster/i);
    assert.match(data.context.stack,/Node.*22/i);assert.match(data.context.stack,/ESM/i);
    assert.match(data.context.patterns,/local service/i);assert.match(data.context.conventions.join(' '),/named exports/i);
    assert.match(data.context.auth,/none|no auth/i);
    return {changes,outcome:'passed'};
  }
  const text=fs.readFileSync(path.join(directory,specFile),'utf8'),spec=parse(text).spec;
  if(state.scenario.startsWith('gap-')) {
    assert.equal(withoutGap(text),withoutGap(state.specText),'Reviewer/orchestration rewrote content outside gap_check');
    assert.equal(spec.status,'ready');
    assert.match(spec.gap_check.date,/^\d{4}-\d{2}-\d{2}$/);
    if(state.scenario==='gap-incomplete') {
      assert.deepEqual({...spec.gap_check,date:null},{status:'blocked',blockers:1,warnings:0,report:null,date:null});
      assert.match(transcript,/\b4\b/,'Missing failed completeness item');
    } else {
      const report=fs.readFileSync(path.join(directory,gapFile),'utf8');
      assert.notEqual(sha256(report),state.before[gapFile].hash,'Old report reused');assert.match(report,/^## Coverage\s*$/m);
      assert.equal(spec.gap_check.report,gapFile);
      const header=report.split('\n')[0].match(/^(PASS|BLOCKED) — (\d+) blockers, (\d+) warnings$/);assert.ok(header,'Report header');
      assert.equal(Number(header[2]),spec.gap_check.blockers);assert.equal(Number(header[3]),spec.gap_check.warnings);
      if(state.scenario==='gap-clean'){assert.equal(spec.gap_check.status,'passed');assert.equal(header[1],'PASS');assert.equal(spec.gap_check.blockers,0);assert.equal(spec.gap_check.warnings,0);}
      else {
        assert.equal(spec.gap_check.status,'blocked');assert.equal(header[1],'BLOCKED');assert.ok(spec.gap_check.blockers>0);
        for(const field of ['Severity','Spec block(s)','Quoted text','Why an implementer must guess','Resolving question'])assert.ok(report.includes(`**${field}:**`),`Missing ${field}`);
        assert.match(report,/whitespace|blank/i);assert.match(report,/TypeError|throw/i);assert.match(report,/empty string/i);
      }
    }
  } else if(state.scenario==='implement-refuse') {
    assert.deepEqual(changes,[]);assert.match(transcript,/refus|cannot|blocked|warnings|gate/i);
  } else {
    assert.ok(['review','in-progress'].includes(expectedStatus));
    assert.equal(spec.status,expectedStatus);assert.equal(text.replace(new RegExp('^  status: '+expectedStatus+'$','m'),'  status: ready'),state.specText,'Spec changes beyond status');
    const oracle = `import assert from 'node:assert/strict';
import {greet} from './src/greet.mjs';
assert.equal(greet('Ada'),'Hello, Ada!');assert.equal(greet('  Ada  '),'Hello, Ada!');
for(const value of ['', '   ',null,42])assert.throws(()=>greet(value),TypeError);
console.log('Six independent greeting cases passed');`;
    const behavior=await runHost(process.execPath,['--input-type=module','-'],{cwd:directory,input:oracle,timeout:verificationTimeout,maxBytes:100000});
    assert.equal(behavior.reason,null,`Behavior verification ${behavior.reason}`);assert.equal(behavior.code,0,behavior.stderr);
    const tests=await runHost(process.execPath,['--test','tests/greet.test.mjs'],{cwd:directory,timeout:verificationTimeout,maxBytes:100000});
    assert.equal(tests.reason,null,`Test verification ${tests.reason}`);assert.equal(tests.code,0,tests.stderr);assert.match(tests.stdout,/(?:#|ℹ) fail 0/);assert.match(tests.stdout,/(?:#|ℹ) skipped 0/);
    assert.ok(Number(tests.stdout.match(/(?:#|ℹ) tests (\d+)/)?.[1])>=6,'Expected six input test cases');
    assert.deepEqual(projectSnapshot(directory),after,'Verification code modified the project or installed bundle');
    const reports=changes.filter(f=>execution.test(f));assert.equal(reports.length,1);const report=fs.readFileSync(path.join(directory,reports[0]),'utf8');
    for(const heading of ['Boundaries Acknowledged','Self-Verification Table','Deliverables Produced','spec_gaps_encountered','Follow-Ups'])assert.ok(report.includes(`## ${heading}`),heading);
    for(let n=1;n<=2;n++)assert.match(report,new RegExp(`EXP-a1b2.*edge case ${n}`,'i'));
    for(let n=1;n<=spec.boundaries.length;n++)assert.ok(report.includes(`Boundary #${n}`));
    for(let n=1;n<=spec.deliverables.length;n++)assert.ok(report.includes(`Deliverable #${n}`));
    const visible=visibleAssistantText(transcript);
    for(const boundary of spec.boundaries)assert.ok(visible.split(boundary).length-1>=2,'Missing visible orchestration/implementation Boundary acknowledgments');
  }
  return {outcome:'passed',changes};
}
