// SPDX-License-Identifier: Apache-2.0
// Optional actual host and pinned-installer observations; never run by offline CI.
import fs from 'node:fs';import os from 'node:os';import path from 'node:path';import assert from 'node:assert/strict';import {fileURLToPath} from 'node:url';
import {assemble,repositoryRoot} from './build-skills.mjs';
import {hostInvocation,runHost} from './evaluate-pilot.mjs';
import {snapshot,hash} from '../plugin/runtime/snapshot.mjs';
import {setupRouter,routerPrompt,verifyRouting,bulkLifecycle,sourceHash as oracleHash} from '../tests/helpers/router-distribution.mjs';
const evaluatorHash=hash(fs.readFileSync(fileURLToPath(import.meta.url)));
export async function evaluateRouter({host,scenario,copy=true}={}) {
  assert.ok(['claude','codex'].includes(host));assert.ok(['outcomes','missing','controller','installer'].includes(scenario));assert.ok(scenario!=='controller'||host==='claude');
  assemble(repositoryRoot,{check:true});
  const owned=fs.mkdtempSync(path.join(os.tmpdir(),`idd-router-${host}-${scenario}-`)),result={host,scenario,copy,date:new Date().toISOString(),evidence:owned,evaluatorHash,oracleHash,outcome:'blocked',limitations:['Disposable local observations; independent full-trace review required. No native alias, remote update, publication or human peer-review certification.']};
  try {
    if(scenario==='installer'){Object.assign(result,bulkLifecycle(owned,{host,copy}));}
    else {
      const state=setupRouter(owned,{host,copy:true,execution:scenario==='controller'});result.project=state.project;result.bundleHash=hash(JSON.stringify(snapshot(state.bundle)));fs.writeFileSync(path.join(owned,'baseline.json'),JSON.stringify(state,null,2));
      const version=await runHost(host,['--version'],{cwd:state.project,timeout:15000,maxBytes:10000});assert.equal(version.reason,null);assert.equal(version.code,0);result.version=version.stdout.trim();
      if(scenario==='controller') {
        const runner=path.join(state.bundle,'stages/implement-spec/scripts/idd-execute-spec.mjs');
        const invocation={command:process.execPath,args:[runner,'--project',state.project,'--spec','SPEC-c0de','--implementer-model','configured']};result.invocation=invocation;
        const receipt=await runHost(invocation.command,invocation.args,{cwd:owned,timeout:600000,maxBytes:4*1024*1024});
        fs.writeFileSync(path.join(owned,'stdout.log'),receipt.stdout);fs.writeFileSync(path.join(owned,'stderr.log'),receipt.stderr);result.process={code:receipt.code,reason:receipt.reason};assert.equal(receipt.reason,null);result.runtime=JSON.parse(receipt.stdout);assert.equal(receipt.code,0,result.runtime.error);assert.equal(result.runtime.outcome,'passed',result.runtime.error);assert.equal(result.runtime.hostInvocations,3);
        const oracle="import assert from 'node:assert/strict';import {greet} from './src/greet.mjs';assert.equal(greet('Ada'),'Hello, Ada!');assert.equal(greet('  Ada  '),'Hello, Ada!');for(const v of ['', '   ',null,42])assert.throws(()=>greet(v),TypeError);console.log('Six independent greeting cases passed');";
        const after=snapshot(state.project,{excludeGit:true});result.oracle=await runHost(process.execPath,['--input-type=module','-'],{cwd:state.project,input:oracle,timeout:10000,maxBytes:100000});assert.equal(result.oracle.code,0,result.oracle.stderr);assert.equal(result.oracle.reason,null);
        const tests=result.runtime.checks[0].receipt.stdout;for(const field of ['fail','skipped','cancelled'])assert.match(tests,new RegExp(`(?:#|ℹ) ${field} 0`));assert.ok(Number(tests.match(/(?:#|ℹ) tests (\d+)/)?.[1])>=6);assert.deepEqual(snapshot(state.project,{excludeGit:true}),after);result.outcome='passed';
      } else {
        const prompt=routerPrompt(scenario,state.skill),invocation=hostInvocation(host,prompt,state.project);result.invocation=invocation;fs.writeFileSync(path.join(owned,'prompt.txt'),prompt);
        const receipt=await runHost(invocation.command,invocation.args,{cwd:state.project,input:prompt,timeout:600000,maxBytes:4*1024*1024});fs.writeFileSync(path.join(owned,'stdout.log'),receipt.stdout);fs.writeFileSync(path.join(owned,'stderr.log'),receipt.stderr);result.process={code:receipt.code,reason:receipt.reason};assert.equal(receipt.reason,null);assert.equal(receipt.code,0);
        if(host==='claude'){const events=receipt.stdout.trim().split('\n').map(JSON.parse),init=events.find(e=>e.type==='system'&&e.subtype==='init'),last=events.findLast(e=>e.type==='result');result.model=init?.model;result.outputStyle=init?.output_style;assert.ok(last&&!last.is_error);}
        Object.assign(result,verifyRouting(state,scenario,receipt.stdout));
      }
    }
  }catch(e){result.outcome='failed';result.error=e.message;}
  fs.writeFileSync(path.join(owned,'result.json'),JSON.stringify(result,null,2)+'\n');return result;
}
export function parseRouterOptions(args){const options={};for(let i=0;i<args.length;i++){const a=args[i];if(a==='--default-mode'){assert.equal(options.copy,undefined);options.copy=false;}else{const k={'--host':'host','--scenario':'scenario'}[a];assert.ok(k&&args[i+1]&&!Object.hasOwn(options,k),'Invalid arguments');options[k]=args[++i];}}assert.ok(['claude','codex'].includes(options.host)&&['outcomes','missing','controller','installer'].includes(options.scenario));assert.ok(options.scenario!=='controller'||options.host==='claude');assert.ok(options.copy!==false||options.scenario==='installer','Host observations require copied source removal');return options;}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){try{const r=await evaluateRouter(parseRouterOptions(process.argv.slice(2)));console.log(JSON.stringify({outcome:r.outcome,evidence:r.evidence,error:r.error},null,2));if(r.outcome!=='passed')process.exitCode=1;}catch(e){console.error(e.message);process.exitCode=1;}}
