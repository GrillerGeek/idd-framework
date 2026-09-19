// SPDX-License-Identifier: Apache-2.0
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {spawn,spawnSync} from 'node:child_process';
import {workspace} from './helpers/workspace.mjs';
import {setupForge,forgeState,expectedArgv,validateArguments,quote,eventsAt,verifyForge,cleanupForge,verifyCleanup,inspectProcess} from './helpers/forge-workflow.mjs';
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
function synthetic(project,pid=876543){const date=new Date().toISOString();return [{event:'start',argv:expectedArgv,cwd:project,pid,date},{event:'ready',url:'http://127.0.0.1:43123/',pid,date},{event:'inspection',url:'/',pid,date}];}
const transcript=text=>JSON.stringify({type:'item.completed',item:{type:'agent_message',text}});
const success=transcript('Controlled fixture running at http://127.0.0.1:43123/; owned PID 876543. Stop with kill -TERM 876543.');
for(const args of [[],['--port','1'],['--port','65535'],['--docs','docs with spaces'],['--docs',"docs'; $(touch X) `touch Y`"],['--no-open','--port','43123','--docs','docs with spaces']])test('literal allowed argument tokens '+JSON.stringify(args),()=>assert.deepEqual(validateArguments(args),args));
for(const args of [['--unknown'],['--no-open','--no-open'],['--port'],['--docs'],['--docs',''],['--port','0'],['--port','65536'],['--port','1.2'],['--port','1;echo'],['--port','NaN'],['--docs','x','--docs','y']])test('invalid argument refusal '+JSON.stringify(args),()=>assert.throws(()=>validateArguments(args)));
test('POSIX quote round-trips metacharacters without execution',()=>{const args=["a'b",'$(echo BAD)','`echo BAD`','two words','x\ny'];const r=spawnSync('/bin/sh',['-c',`${quote(process.execPath)} -e 'process.stdout.write(JSON.stringify(process.argv.slice(1)))' ${args.map(quote).join(' ')}`],{encoding:'utf8',timeout:3000});assert.equal(r.status,0);assert.deepEqual(JSON.parse(r.stdout),args);});
test('actual controlled launch remains alive for HTTP inspection and owned cleanup',async t=>{const f=setupForge(workspace(t),'success'),state=forgeState(f.project),child=spawn(f.shim,expectedArgv,{cwd:f.project,stdio:'ignore'});const exited=new Promise(resolve=>child.once('exit',resolve));t.after(async()=>{if(child.exitCode===null)child.kill();await exited;});let ready;for(let i=0;i<100&&!ready;i++){await sleep(20);ready=eventsAt(f.evidence).find(e=>e.event==='ready');}assert.ok(ready);assert.equal(child.exitCode,null);const response=await fetch(ready.url,{signal:AbortSignal.timeout(3000)});assert.equal(await response.text(),'CONTROLLED_FORGE_ALIVE\n');const text=`Controlled fixture: ${ready.url} PID ${child.pid}; stop with kill -TERM ${child.pid}.`;assert.equal(verifyForge(f.project,state,eventsAt(f.evidence),transcript(text),'success').outcome,'passed');const cleanup=await cleanupForge(f);verifyCleanup(eventsAt(f.evidence),cleanup);await exited;assert.notEqual(child.exitCode,null);});
test('actual controlled startup error records exact argv and exit23',t=>{const f=setupForge(workspace(t),'failure'),state=forgeState(f.project),r=spawnSync(f.shim,expectedArgv,{cwd:f.project,encoding:'utf8',timeout:3000});assert.equal(r.status,23);assert.match(r.stderr,/CONTROLLED_FORGE_STARTUP_FAILURE/);assert.equal(verifyForge(f.project,state,eventsAt(f.evidence),transcript('CONTROLLED_FORGE_STARTUP_FAILURE exit 23. Did not start.'),'failure').outcome,'passed');});
test('shim refuses unexpected package without package execution',t=>{const f=setupForge(workspace(t),'success'),r=spawnSync(f.shim,['--yes','unrelated-package'],{cwd:f.project,encoding:'utf8',timeout:3000});assert.equal(r.status,64);assert.equal(eventsAt(f.evidence).some(e=>e.event==='ready'),false);});
const mutations={
 'wrong argv':e=>{e[0].argv=['--yes','@jasonrobey/idd-forge','--docs','docs','with','spaces'];},
 'wrong cwd':e=>{e[0].cwd='/tmp';},
 'missing live inspection':e=>e.pop(),
 'invented URL':e=>{e[1].url='http://127.0.0.1:49999/';},
 'late inspection':e=>{e[2].date=new Date(Date.parse(e[0].date)+60000).toISOString();},
 'late startup':e=>{e[1].date=new Date(Date.parse(e[0].date)+31000).toISOString();},
 'unowned PID':e=>{e[1].pid=22;},
 'multiple launches':e=>e.push({...e[0]}),
 'invalid PID':e=>e.forEach(x=>{x.pid=0;}),
};
for(const [name,mutate] of Object.entries(mutations))test('oracle rejects '+name,t=>{const f=setupForge(workspace(t),'success'),state=forgeState(f.project),events=synthetic(f.project);mutate(events);assert.throws(()=>verifyForge(f.project,state,events,success,'success'));});
test('oracle rejects unowned consumer write',t=>{const f=setupForge(workspace(t),'success'),state=forgeState(f.project);fs.appendFileSync(f.project+'/USER-NOTES.md','bad');assert.throws(()=>verifyForge(f.project,state,synthetic(f.project),success,'success'),/Unowned/);});
test('oracle rejects unsupported launch success claim for startup error',t=>{const f=setupForge(workspace(t),'failure'),state=forgeState(f.project),events=[synthetic(f.project)[0],{event:'error',message:'CONTROLLED_FORGE_STARTUP_FAILURE',pid:876543}];assert.throws(()=>verifyForge(f.project,state,events,transcript('CONTROLLED_FORGE_STARTUP_FAILURE exit 23; Forge is running'),'failure'));});
test('cleanup oracle rejects missing or leaked owned process',()=>{const events=synthetic('/tmp');assert.throws(()=>verifyCleanup(events,[]));assert.throws(()=>verifyCleanup(events,[{pid:876543,exited:false}]));assert.equal(verifyCleanup(events,[{pid:876543,exited:true}]),true);});

test('oracle rejects invented native handle without observed PID',t=>{const f=setupForge(workspace(t),'success'),state=forgeState(f.project);assert.throws(()=>verifyForge(f.project,state,synthetic(f.project),transcript('Controlled fixture http://127.0.0.1:43123/ session ID invented; stop it.'),'success'),/owned PID/);});
test('process inspection distinguishes confirmed absence from operational failure',()=>{assert.equal(inspectProcess(123,()=>({status:1,stdout:'',stderr:''})),null);assert.equal(inspectProcess(123,()=>({status:0,stdout:'node fixture',stderr:''})),'node fixture');for(const result of [{error:Error('timeout')},{status:null,signal:'SIGTERM'},{status:127,stdout:'',stderr:'missing ps'},{status:1,stdout:'',stderr:'permission denied'},{status:0,stdout:'',stderr:''}])assert.throws(()=>inspectProcess(123,()=>result));});

test('persisted JSON baseline retains exact preservation verification',t=>{const f=setupForge(workspace(t),'success'),state=JSON.parse(JSON.stringify(forgeState(f.project)));assert.equal(verifyForge(f.project,state,synthetic(f.project),success,'success').outcome,'passed');});
