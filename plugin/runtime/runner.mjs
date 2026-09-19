// SPDX-License-Identifier: Apache-2.0
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';
import {loadProfile,statusText,safePath} from './profile.mjs';
import {snapshot,gitState,verifyDelta,hash} from './snapshot.mjs';
import {runHost} from './transport.mjs';
import {checkpointInvocation,phaseEvidence,validateAcknowledgment} from './checkpoints.mjs';
import {verifyReport} from './report.mjs';
export function baseInvocation() {
  return {command:'claude',args:['-p','--setting-sources','user,project','--settings','{"disableAllHooks":true}','--strict-mcp-config','--mcp-config','{"mcpServers":{}}','--permission-mode','acceptEdits','--allowedTools','Read,Write,Edit,Glob,Grep,Bash','--output-format','stream-json','--verbose']};
}
export function runtimeVersion(version=process.versions.node) {const [major,minor,patch]=version.split('.').map(Number);assert.ok(major>22||(major===22&&(minor>20||(minor===20&&patch>=0))),'Guarded execution needs Node >=22.20.0');}
export function bindGate(profile,before,project) {
  for(const [file,text] of [[profile.specFile,profile.text],[profile.gapFile,profile.gapText]]) {
    assert.equal(before.entries[file]?.hash,hash(text),'Gate changed during initial snapshot');
    assert.equal(fs.readFileSync(path.join(project,file),'utf8'),text,'Gate changed after initial snapshot');
  }
  for(const output of profile.contract.outputs.filter(o=>o.path))for(const [file,entry] of Object.entries(before.entries))if(file===output.path||(output.kind==='directory'&&file.startsWith(output.path+'/')))assert.ok(entry.kind!=='file'||entry.links===1,`Hardlinked output: ${file}`);
}
export function workflowEntry(bundleRoot) {
  const name=fs.lstatSync(path.join(bundleRoot,'SKILL.md'),{throwIfNoEntry:false})?'SKILL.md':'workflow.md';
  const entry=safePath(bundleRoot,name,{missing:false});
  assert.ok(fs.lstatSync(entry).isFile(),'Workflow entry must be a regular file');
  return entry;
}
export async function execute({project,specId,bundleRoot,check=false,implementerModel='configured',run=runHost,now=Date.now,onAcknowledgment=text=>process.stderr.write(text+'\n'),environment=process.env}) {
  const result={outcome:'refused',hostInvocations:0,phases:[],checks:[],evidence:null};let evidence,profile,currentText,before,git,bundle;
  const writeEvidence=()=>{if(evidence)fs.writeFileSync(path.join(evidence,'result.json'),JSON.stringify(result,null,2)+'\n');};
  try {
    runtimeVersion();assert.ok(['configured','sonnet'].includes(implementerModel),'Unknown implementer policy');
    if(!check)assert.ok(!environment.CLAUDECODE,'Nested Claude execution is unsupported. Run this command in a separate terminal; do not clear CLAUDECODE.');
    project=fs.realpathSync(project);bundleRoot=fs.realpathSync(bundleRoot);assert.notEqual(project,bundleRoot,'Bundle cannot be project root');
    const entry=workflowEntry(bundleRoot);
    profile=loadProfile(project,specId,bundleRoot);currentText=profile.text;
    before=snapshot(project,{excludeGit:true});git=gitState(project);bundle=snapshot(bundleRoot);bindGate(profile,before,project);
    result.spec=specId;result.sourceHashes={spec:hash(profile.text),gapReport:hash(profile.gapText),bundle:hash(JSON.stringify(bundle))};
    const resources=()=>{assert.deepEqual(gitState(project),git,'Git HEAD/branch/staged state changed');assert.deepEqual(snapshot(bundleRoot),bundle,'Installed bundle changed');};
    const unchanged=()=>{resources();assert.deepEqual(snapshot(project,{excludeGit:true}),before,'Project changed during read-only checkpoint');};
    const transition=(from,to)=>{unchanged();const file=path.join(project,profile.specFile);assert.equal(fs.readFileSync(file,'utf8'),currentText,'Spec changed before transition');const next=statusText(currentText,from,to);fs.writeFileSync(file,next);currentText=next;before.entries[profile.specFile]={...before.entries[profile.specFile],hash:hash(next)};unchanged();};
    if(check){result.outcome='ready';return result;}
    result.outcome='blocked';const sessionId=randomUUID();result.sessionId=sessionId;let model,outputStyle,used=0;const deadline=now()+600000;
    const reportLabels=[...profile.spec.expectations_detail.flatMap(e=>e.edge_cases.map((_,i)=>`${e.id} edge case ${i+1}`)),...profile.spec.boundaries.map((_,i)=>`Boundary #${i+1}`),...profile.spec.deliverables.map((_,i)=>`Deliverable #${i+1}`),...profile.spec.validation.automated.map((_,i)=>`Automated check #${i+1}`)];
    const handoff=`Read the installed workflow at ${entry} and required references. Controller verified safe complete YAML, recorded readiness approval, ready/passed integer-zero gate, canonical PASS report and Coverage. Spec path ${profile.specFile}; SHA256 ${result.sourceHashes.spec}. The controller owns lifecycle and snapshots. No delegation, no Skill tool and no extra approval. `;
    function acknowledgment(role){return `This is ONLY the read-only ${role} checkpoint. Inspect the Spec with read tools. The ENTIRE final assistant message must be exactly the heading Boundaries Acknowledged — ${role}, followed by numbered N. blocks containing EVERY Boundary verbatim in Spec order, with no fences, quotes, styling, introduction or closing text. ${role==='implementation'?'After each quote put a new line Meaning: followed by your comprehension paraphrase. ':''}No scratch, directories, status edits, implementation or report writes. The controller will validate and resume this same session.`;}
    for(const phase of ['orchestration','implementation','build']) {
      unchanged();assert.ok(deadline>now()&&used<4*1024*1024,'Shared model budget exhausted');
      const requested=phase==='implementation'&&implementerModel==='sonnet'?'sonnet':model;
      const invocation=checkpointInvocation(baseInvocation(),{sessionId,phase,model:requested});
      const prompt=handoff+(phase==='build'?`Both visible acknowledgments have passed. Continue as the SAME implementing role at implementation Step 3. Status is in-progress and MUST remain byte-identical; controller alone later changes to review. Implement only the reviewed execution_contract outputs. Use its argv checks and the Spec prose for self-verification. Choose report timestamp using actual current UTC immediately before creating docs/reviews/${specId}-<YYYYMMDDTHHmmssZ>-execution.md; never replace an existing report. Use EXACT first-column report labels, without parenthetical additions: ${JSON.stringify(reportLabels)}. Put descriptions in the Evidence column. Write all required report rows with actual evidence and finalize provisional rows only after verifying them. Capture and compare actual file bytes/modes for your own preservation check; Git status alone cannot detect edits to already-dirty files and is insufficient. Do not claim content equality from a status listing. Return path and outcome while Spec is still in-progress. Controller independently runs reviewed commands afterward; they must not change any project files. Preserve existing user edits and bundle resources. The controller's own retained evidence is outside your scratch ownership. No further acknowledgment or approval needed.`:acknowledgment(phase));
      result.hostInvocations++;const receipt=await run(invocation.command,invocation.args,{cwd:project,input:prompt,timeout:deadline-now(),maxBytes:4*1024*1024-used});
      used+=Buffer.byteLength(receipt.stdout)+Buffer.byteLength(receipt.stderr);assert.ok(used<=4*1024*1024,'Shared model output limit exceeded');
      const record={phase,invocation,prompt,receipt};result.phases.push(record);writeEvidence();
      const observed=phaseEvidence(receipt,{sessionId,phase,model:requested==='sonnet'?undefined:model,outputStyle});
      if(requested==='sonnet')assert.match(observed.model,/^claude-sonnet-/, 'Requested Sonnet did not resolve to a Sonnet model');
      model=observed.model;outputStyle=observed.outputStyle;record.observed=observed;
      if(phase!=='build') {
        unchanged();validateAcknowledgment(observed.text,phase,profile.spec.boundaries);onAcknowledgment(observed.text);
        if(phase==='orchestration') {evidence=fs.mkdtempSync(path.join(os.tmpdir(),'idd-execution-'));result.evidence=evidence;fs.writeFileSync(path.join(evidence,'baseline.json'),JSON.stringify({project:before,git,bundle},null,2)+'\n');writeEvidence();transition('ready','in-progress');}
      } else {
        resources();assert.equal(fs.readFileSync(path.join(project,profile.specFile),'utf8'),currentText,'Implementer changed lifecycle or Spec content');
        const candidate=snapshot(project,{excludeGit:true});const verified=verifyDelta(before,candidate,profile);
        const readReport=()=>verifyReport(fs.readFileSync(path.join(project,verified.report),'utf8'),profile.spec,verified.report);
        readReport();
        for(const check of profile.contract.checks)if(check.argv) {
          const receipt=await run(check.argv[0],check.argv.slice(1),{cwd:project,timeout:check.timeout_seconds*1000,maxBytes:4*1024*1024});result.checks.push({validation:check.validation,argv:check.argv,receipt});writeEvidence();
          resources();assert.deepEqual(snapshot(project,{excludeGit:true}),candidate,'Independent verification modified the project');
          assert.equal(receipt.reason,null,'Independent verification interrupted');assert.equal(receipt.code,0,'Independent verification failed');
        }
        resources();assert.deepEqual(snapshot(project,{excludeGit:true}),candidate,'Project changed after verification');verifyDelta(before,candidate,profile);readReport();
        before=candidate;transition('in-progress','review');result.report=verified.report;result.changes=verified.changes;result.outcome='passed';result.model=model;result.outputStyle=outputStyle;
      }
      writeEvidence();
    }
  } catch(error) {result.error=error.message;if(result.hostInvocations)result.outcome='failed';writeEvidence();}
  return result;
}
