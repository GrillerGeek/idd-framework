// SPDX-License-Identifier: Apache-2.0
// Optional evaluation controller. This is not installed runtime or a general sandbox.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';
import {validateArtifact} from './artifacts.mjs';
import {sha256} from './files.mjs';
import {projectSnapshot,verifyScenario,runHost,specFile,gapFile} from '../../tests/helpers/pilot.mjs';

import {checkpointInvocation,phaseEvidence,validateAcknowledgment} from '../../plugin/runtime/checkpoints.mjs';
export {checkpointInvocation,phaseEvidence,validateAcknowledgment};
export function readGate(project,state) {
  const file=path.join(project,specFile),text=fs.readFileSync(file,'utf8');
  assert.equal(text,state.specText,'Spec changed since controller baseline');
  const spec=validateArtifact(text,{file:specFile});
  assert.equal(spec.id,'SPEC-a1b2','Fixture ID mismatch');assert.equal(spec.status,'ready','Expected ready lifecycle');
  const gate=spec.gap_check;
  assert.equal(gate?.status,'passed','Expected passed gate');
  for(const key of ['blockers','warnings'])assert.ok(Number.isInteger(gate[key])&&gate[key]===0,`Expected integer zero ${key}`);
  assert.equal(gate.report,gapFile,'Noncanonical gap report');
  const report=fs.readFileSync(path.join(project,gapFile),'utf8');
  assert.match(report,/^PASS — 0 blockers, 0 warnings\r?\n/);assert.match(report,/^## Coverage\s*$/m);
  assert.equal(spec.peer_review?.outcome,'approved','Missing recorded fixture human readiness approval');
  assert.ok(spec.peer_review.reviewer?.trim(),'Missing recorded reviewer');
  return {spec,text,report,specHash:sha256(text),reportHash:sha256(report)};
}
export function verifyExecutionReport(project,spec) {
  const reports=fs.readdirSync(path.join(project,'docs/reviews')).filter(f=>/^SPEC-a1b2-\d{8}T\d{6}Z-execution\.md$/.test(f));
  assert.equal(reports.length,1,'Expected one execution report');
  const report=fs.readFileSync(path.join(project,'docs/reviews',reports[0]),'utf8');
  const labels=[...spec.expectations_detail.flatMap(e=>e.edge_cases.map((_,i)=>`${e.id} edge case ${i+1}`)),
    ...spec.boundaries.map((_,i)=>`Boundary #${i+1}`),...spec.deliverables.map((_,i)=>`Deliverable #${i+1}`),
    ...spec.validation.automated.map((_,i)=>`Automated check #${i+1}`)];
  const table=report.split(/^## Self-Verification Table\s*$/m)[1]?.split(/^## /m)[0];
  assert.ok(table,'Missing self-verification table');
  const rows=table.split('\n').filter(line=>/^\s*\|/.test(line)).map(line=>line.trim().slice(1,-1).split('|').map(c=>c.trim().replace(/\*\*|`/g,'')));
  for(const label of labels) {
    const matches=rows.filter(row=>row[0]===label);assert.equal(matches.length,1,`Missing/duplicate report row: ${label}`);
    assert.equal(matches[0][1],'pass',`Unfinished report row: ${label}`);assert.ok(matches[0][2]?.trim(),`Missing evidence: ${label}`);
  }
  const gaps=report.split(/^## spec_gaps_encountered\s*$/m)[1]?.split(/^## /m)[0];
  assert.ok(gaps?.trim(),'Missing gap disposition');
  assert.doesNotMatch(gaps.replace(/\*\*|`/g,''),/severity\s*:\s*blocker-grade/i,'Blocker-grade execution gap requires author recovery');
  return reports[0];
}
export async function runCheckpoint({project,state,skillPath,baseInvocation,onPhase=()=>{},run=runHost,timeout=600000,maxBytes=4*1024*1024,now=Date.now}) {
  const sessionId=randomUUID(),deadline=now()+timeout;
  const result={mode:'staged',sessionId,outcome:'blocked',phases:[],hostInvocations:0,stdout:'',stderr:'',model:null,outputStyle:null};
  let gate;
  try {gate=readGate(project,state);}catch(error) {
    result.error=error.message;result.disposition='controller-refused';
    result.outcome=state.scenario==='implement-refuse'?'passed':'failed';
    return result;
  }
  let currentText=gate.text,expected=projectSnapshot(project),usedBytes=0;
  const preserve=()=>assert.deepEqual(projectSnapshot(project),expected,'Project changed during read-only checkpoint or controller verification');
  function transition(from,to) {
    preserve();
    const file=path.join(project,specFile);
    assert.equal(fs.readFileSync(file,'utf8'),currentText,'Spec changed before controller transition');
    const pattern=new RegExp('^  status: '+from+'$','gm');
    assert.equal([...currentText.matchAll(pattern)].length,1,'Ambiguous lifecycle field');
    const next=currentText.replace(pattern,'  status: '+to);fs.writeFileSync(file,next);
    currentText=next;expected={...expected,[specFile]:{...expected[specFile],hash:sha256(next)}};preserve();
  }
  const handoff=`Controller verified the disposable fixture's safe YAML (duplicate keys rejected), mechanical completeness, recorded fictional human readiness approval, ready/passed gate with integer zero counts, canonical PASS report and Coverage. Spec: ${specFile}; SHA256 ${gate.specHash}. Report: ${gapFile}; SHA256 ${gate.reportHash}. Read the installed workflow at ${skillPath} and its needed references. The controller owns lifecycle. No human approval is requested by these checkpoints. Do not call Skill or delegate. `;
  const acknowledgment=role=>`This is ONLY the read-only ${role} checkpoint. Inspect the supplied gate evidence and current Spec using read tools. Return a final assistant message headed exactly "Boundaries Acknowledged — ${role}". The ENTIRE reply must contain only the heading and numbered Boundary blocks. Use exactly N. followed by each verbatim Boundary in Spec order, without quote marks, fences or Markdown styling. No introduction, gate summary, closing remarks or next-step text. ${role==='implementation'?'After each quote add a new line beginning Meaning: with your own comprehension paraphrase. ':''}Do not perform snapshots, create directories, edit status, build or write a report in this phase. The controller will validate this message and automatically resume the same session; wait for that continuation.`;
  const prompts={orchestration:handoff+acknowledgment('orchestration'),
    implementation:handoff+'Your orchestration acknowledgment passed. The controller changed only status ready to in-progress and verified preservation. Enter the implementing role in this same conversation. '+acknowledgment('implementation'),
    build:handoff+'Both of your prior visible acknowledgments passed before any implementation mutation. Continue in this SAME implementing role from Step 3 of the installed implementer procedure. The controller has completed ready to in-progress and owns the later review transition. Do not modify Spec status or any other pre-existing file. Recheck the gate handoff, build the deliverables, self-verify every required row and write the execution report. Return the report path and actual outcome to the controller while status is STILL in-progress. Do not enter orchestration at the end. Use available Python with duplicate-key-rejecting YAML if needed, without installing dependencies. Preserve all pre-existing user edits. No further acknowledgment or approval is needed: both checkpoints are in this conversation.'};
  try {
    for(const phase of ['orchestration','implementation','build']) {
      preserve();
      const remaining=deadline-now(),bytesLeft=maxBytes-usedBytes;
      assert.ok(remaining>0&&bytesLeft>0,'Host execution blocked: shared checkpoint budget exhausted');
      const invocation=checkpointInvocation(baseInvocation,{sessionId,phase,model:result.model});
      invocation.input=prompts[phase];
      result.hostInvocations++;
      const phaseRun=await run(invocation.command,invocation.args,{cwd:project,input:prompts[phase],timeout:remaining,maxBytes:bytesLeft});
      usedBytes+=Buffer.byteLength(phaseRun.stdout)+Buffer.byteLength(phaseRun.stderr);
      result.stdout+=phaseRun.stdout;result.stderr+=phaseRun.stderr;
      const record={phase,invocation,prompt:prompts[phase],process:{code:phaseRun.code,reason:phaseRun.reason,signal:phaseRun.signal},outcome:'blocked'};
      result.phases.push(record);onPhase(record,phaseRun);
      // Transport errors remain blocked; structural/protocol failures are failed.
      if(phaseRun.reason||phaseRun.code!==0)throw Error(`Host execution blocked: ${phaseRun.reason??phaseRun.code}`);
      let events;try {events=phaseRun.stdout.trim().split('\n').map(line=>JSON.parse(line));}
      catch {result.outcome='failed';record.outcome='failed';throw Error('Malformed Claude event stream');}
      if(events.some(e=>e.type==='result'&&e.is_error))throw Error('Host execution blocked: Claude error result');
      result.outcome='failed';record.outcome='failed';
      assert.ok(usedBytes<=maxBytes,'Shared checkpoint output budget exceeded');
      const evidence=phaseEvidence(phaseRun,{sessionId,phase,model:result.model,outputStyle:result.outputStyle});
      result.model??=evidence.model;result.outputStyle??=evidence.outputStyle;record.observed=evidence;
      if(phase!=='build') {
        preserve();validateAcknowledgment(evidence.text,phase,gate.spec.boundaries);
        record.outcome='passed';
        if(phase==='orchestration')transition('ready','in-progress');
      } else {
        // Verify the actual delta BEFORE changing lifecycle. Never repair a model-owned status edit.
        assert.equal(fs.readFileSync(path.join(project,specFile),'utf8'),currentText,'Implementer changed lifecycle or Spec content');
        const candidate=projectSnapshot(project);
        result.report=verifyExecutionReport(project,gate.spec);
        const verified=await verifyScenario(project,state,result.stdout,{expectedStatus:'in-progress'});
        record.outcome='passed';result.changes=verified.changes;
        expected=candidate;preserve();transition('in-progress','review');
        result.outcome='passed';result.disposition='controller-verified-build';
      }
      if(phase!=='build')result.outcome='blocked';
    }
  } catch(error) {result.error=error.message;}
  return result;
}
