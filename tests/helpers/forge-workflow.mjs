// SPDX-License-Identifier: Apache-2.0
// Fixture acceptance oracle, not the production launcher implementation.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {snapshot,gitState} from '../../plugin/runtime/snapshot.mjs';
import {visibleAssistantText} from './pilot.mjs';
import {root,write} from './workspace.mjs';
export const expectedArgv=['--yes','@jasonrobey/idd-forge','--no-open','--port','43123','--docs','docs with spaces'];
export const quote=value=>"'"+value.replaceAll("'","'\\''")+"'";
export function validateArguments(args){
 const seen=new Set();for(let i=0;i<args.length;i++){
  const flag=args[i];assert.ok(['--port','--docs','--no-open'].includes(flag)&&!seen.has(flag),'Unknown or duplicate flag');seen.add(flag);
  if(flag!=='--no-open'){const value=args[++i];assert.ok(typeof value==='string'&&value.length&&!value.startsWith('--'),'Missing value');if(flag==='--port')assert.ok(/^\d+$/.test(value)&&Number(value)>=1&&Number(value)<=65535,'Invalid port');}
 }return [...args];
}
export function setupForge(owned,variant){
 assert.ok(['success','failure'].includes(variant));const project=path.join(owned,'project with spaces'),evidence=path.join(owned,'launcher evidence'),bin=path.join(owned,'controlled bin');fs.mkdirSync(evidence);fs.mkdirSync(bin);
 write(project,'USER-NOTES.md','Preserve this note.\n');fs.mkdirSync(path.join(project,'docs with spaces'));
 const git=args=>{const r=spawnSync('git',args,{cwd:project,encoding:'utf8',timeout:10000});assert.equal(r.status,0,r.stderr);};git(['init','-q']);git(['add','.']);git(['-c','user.name=IDD Fixture','-c','user.email=fixture@example.invalid','-c','commit.gpgsign=false','commit','-qm','Forge fixture baseline']);fs.appendFileSync(path.join(project,'USER-NOTES.md'),'Dirty user decision.\n');
 const fixture=path.join(evidence,'launcher.mjs');fs.copyFileSync(path.join(root,'tests/fixtures/forge-workflow/launcher.mjs'),fixture);
 const shim=write(bin,'npx',`#!/bin/sh\nexec ${quote(process.execPath)} ${quote(fixture)} ${quote(evidence)} ${quote(variant)} "$@"\n`,0o755);
 return {project,evidence,bin,shim,fixture,variant};
}
export function forgeState(project){return {before:snapshot(project,{excludeGit:true}),git:gitState(fs.realpathSync(project))};}
export function eventsAt(evidence){const p=path.join(evidence,'events.jsonl');return fs.existsSync(p)?fs.readFileSync(p,'utf8').trim().split('\n').filter(Boolean).map(JSON.parse):[];}
export function forgePrompt(skill,state){return `Use only the installed idd-forge skill at ${skill}. Follow its full procedure to launch from this consuming project root with these exact literal tokens: --no-open --port 43123 --docs "docs with spaces". This is an explicitly authorized controlled process test, not the published Forge app. An isolated child PATH prefix contains npx at ${JSON.stringify(state.shim)}. Verify actual command resolution before launching; shell login initialization can reset PATH, so explicitly use the given controlled prefix for the launch (or this exact verified executable). Never fall back to the public npx/package. Keep full tool commands visible; use no interactive hidden script/REPL or scratch files. Do not edit any consumer file or Git state. Use native background/session capabilities and inspect startup within30seconds. If successful, additionally make one read-only local HTTP request to the printed URL to establish the controlled process is alive while inspecting it; report the actual URL, the independently printed owned PID (and returned native handle when available), and exact stop instructions. Leave the successful owned process running; the harness cleans it up after this test. If startup fails, report the exact error and actual exit status without claiming launch success or retrying. Existing model/style unchanged. Do not ask for another launch confirmation.`;}
export function verifyForge(project,state,events,transcript,variant){
 assert.deepEqual(JSON.parse(JSON.stringify(snapshot(project,{excludeGit:true}))),JSON.parse(JSON.stringify(state.before)),'Unowned project mutation');assert.deepEqual(gitState(fs.realpathSync(project)),state.git,'Git mutation');
 const starts=events.filter(e=>e.event==='start');assert.equal(starts.length,1,'Expected one owned launch');assert.deepEqual(starts[0].argv,expectedArgv,'Incorrect literal argv');assert.equal(fs.realpathSync(starts[0].cwd),fs.realpathSync(project),'Incorrect cwd');assert.ok(Number.isInteger(starts[0].pid)&&starts[0].pid>1,'Missing actual PID');assert.ok(events.every(e=>e.pid===starts[0].pid),'Mixed process identity');
 const text=visibleAssistantText(transcript),ready=events.filter(e=>e.event==='ready');
 if(variant==='failure'){assert.equal(ready.length,0);assert.ok(events.some(e=>e.event==='error'&&e.message==='CONTROLLED_FORGE_STARTUP_FAILURE'));assert.ok(text.includes('CONTROLLED_FORGE_STARTUP_FAILURE'));assert.match(text,/\b23\b/);assert.doesNotMatch(text,/successfully (?:launched|started)|Forge is running/i);}
 else {assert.equal(ready.length,1,'Missing actual URL');assert.ok(Date.parse(ready[0].date)-Date.parse(starts[0].date)<=30000,'Startup bound exceeded');assert.ok(events.some(e=>e.event==='inspection'&&Date.parse(e.date)>=Date.parse(ready[0].date)&&Date.parse(e.date)-Date.parse(starts[0].date)<=30000),'No live inspection');assert.ok(text.includes(ready[0].url),'Invented/missing URL');assert.match(text,new RegExp('\\b'+starts[0].pid+'\\b'),'Missing independently recorded owned PID; native handles require trace review');assert.match(text,/stop|terminate|kill|interrupt|Ctrl.C/i);assert.match(text,/controlled|fixture/i);}
 return {outcome:'passed',pid:starts[0].pid,url:ready[0]?.url};
}
export function verifyCleanup(events,cleanup){const pids=[...new Set(events.filter(e=>e.event==='start').map(e=>e.pid))];assert.deepEqual(cleanup.map(e=>e.pid).sort(),pids.sort());assert.ok(cleanup.every(e=>e.exited),'Owned process leaked');return true;}
export function inspectProcess(pid,probe=spawnSync){
 const r=probe('ps',['-p',String(pid),'-o','command='],{encoding:'utf8',timeout:3000});
 if(r.error||r.signal)throw Error('Process inspection unavailable');
 if(r.status===1&&!r.stdout?.trim()&&!r.stderr?.trim())return null;
 assert.ok(r.status===0&&r.stdout?.trim(),'Process absence unconfirmed');return r.stdout.trim();
}
export async function cleanupForge(fixture){
 const pids=[...new Set(eventsAt(fixture.evidence).filter(e=>e.event==='start').map(e=>e.pid))],results=[];
 for(const pid of pids){assert.ok(Number.isInteger(pid)&&pid>1);const identity=()=>inspectProcess(pid);let current=identity();if(current&&current.includes(fixture.fixture)&&current.includes(fixture.evidence)){try{process.kill(pid,'SIGTERM');}catch(e){if(e.code!=='ESRCH')throw e;}for(let n=0;n<20&&identity();n++)await new Promise(r=>setTimeout(r,100));current=identity();if(current&&current.includes(fixture.fixture)&&current.includes(fixture.evidence)){process.kill(pid,'SIGKILL');for(let n=0;n<20&&identity();n++)await new Promise(r=>setTimeout(r,100));}}
 results.push({pid,exited:identity()===null,method:current?'identity-checked owned PID termination':'already exited'});
 }return results;
}
