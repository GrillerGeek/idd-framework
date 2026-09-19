// SPDX-License-Identifier: Apache-2.0
// Native lifecycle fixtures never use personal client roots or model calls.
import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {root,write} from './workspace.mjs';import {snapshot,hash} from '../../plugin/runtime/snapshot.mjs';
export const sourceHash=hash(fs.readFileSync(path.join(root,'tests/helpers/native-distribution.mjs')));
export const marketplace='idd-framework-local',pluginId='idd-framework@idd-framework-local';
export function nativeFixture(owned,host) {
  assert.ok(['claude','codex'].includes(host));
  const project=path.join(owned,'consumer'),source=path.join(owned,'idd source'),retained=path.join(owned,'unrelated source'),client=path.join(owned,'client');
  fs.mkdirSync(project,{recursive:true});fs.mkdirSync(client,{recursive:true});
  fs.cpSync(path.join(root,'plugin'),path.join(source,'plugin'),{recursive:true});
  for(const f of ['.agents/plugins/marketplace.json','.claude-plugin/marketplace.json'])write(source,f,fs.readFileSync(path.join(root,f)));
  write(project,'USER-NOTES.md','Preserve native installation consumer notes.\n');write(project,'.agents/skills/unrelated-local/SKILL.md','---\nname: unrelated-local\ndescription: Preserve unrelated skill\n---\nUnrelated local skill.\n');
  const minimal={name:'unrelated-fixture',version:'1.0.0',description:'Independent preservation fixture',author:{name:'Fixture'},homepage:'https://example.invalid',repository:'https://example.invalid',license:'Apache-2.0',keywords:['fixture']};
  const j=(dir,file,value)=>write(dir,file,JSON.stringify(value,null,2)+'\n');
  j(retained,'plugin/plugin.json',{$schema:'https://agent-plugins.org/schemas/1.0.0/plugin.schema.json',...minimal});j(retained,'plugin/.claude-plugin/plugin.json',minimal);j(retained,'plugin/.codex-plugin/plugin.json',{...minimal,skills:'./skills/',interface:{displayName:'Unrelated fixture',shortDescription:'Preserve me',longDescription:'Independent preservation fixture',developerName:'Fixture',category:'Productivity',capabilities:['Read'],websiteURL:'https://example.invalid',defaultPrompt:'Read fixture'}});
  write(retained,'plugin/skills/unrelated-native/SKILL.md','---\nname: unrelated-native\ndescription: Unrelated native preservation fixture\n---\nRead this fixture.\n');
  j(retained,'.agents/plugins/marketplace.json',{name:'unrelated-fixture-market',plugins:[{name:'unrelated-fixture',source:{source:'local',path:'./plugin'},policy:{installation:'AVAILABLE',authentication:'ON_INSTALL'},category:'Productivity'}]});
  j(retained,'.claude-plugin/marketplace.json',{name:'unrelated-fixture-market',owner:{name:'Fixture'},plugins:[{name:'unrelated-fixture',source:'./plugin'}]});
  const globalGit=write(owned,'empty-git-config','');const environment={PATH:process.env.PATH,TMPDIR:owned,LANG:'en_US.UTF-8',NO_COLOR:'1',DISABLE_TELEMETRY:'1',DO_NOT_TRACK:'1',CODEX_HOME:path.join(client,'codex'),CLAUDE_CONFIG_DIR:path.join(client,'claude'),XDG_CONFIG_HOME:path.join(client,'xdg-config'),XDG_CACHE_HOME:path.join(client,'xdg-cache'),XDG_STATE_HOME:path.join(client,'xdg-state'),GIT_CONFIG_GLOBAL:globalGit,GIT_CONFIG_NOSYSTEM:'1',GIT_TERMINAL_PROMPT:'0'};
  for(const p of ['CODEX_HOME','CLAUDE_CONFIG_DIR','XDG_CONFIG_HOME','XDG_CACHE_HOME','XDG_STATE_HOME'])fs.mkdirSync(environment[p],{recursive:true});
  if(process.env.CLAUDECODE)environment.CLAUDECODE=process.env.CLAUDECODE;
  return {owned,host,project,source,retained,client,environment,receipts:[],started:Date.now(),notes:snapshot(project)};
}
export function containedNative(owned,file) {
  assert.ok(path.isAbsolute(file),'Native path must be absolute');const real=fs.realpathSync(file);assert.ok(real.startsWith(fs.realpathSync(owned)+path.sep),'Native path escaped owned root');return real;
}
export async function nativeCommand(state,args,{command=state.host,allowFailure=false}={}) {
  assert.ok(Date.now()-state.started<600000,'Native host evaluation ten-minute budget exhausted');
  const record={command,args,date:new Date().toISOString(),cwd:state.project};state.receipts.push(record);
  const save=()=>fs.writeFileSync(path.join(state.owned,'receipts.json'),JSON.stringify(state.receipts,null,2));save();
  const child=spawnSync(command,args,{cwd:state.project,env:state.environment,timeout:Math.min(60000,600000-(Date.now()-state.started)),maxBuffer:4*1024*1024,encoding:'utf8',killSignal:'SIGKILL',detached:process.platform!=='win32'});
  // Only this freshly created command's process group can be cleaned up.
  if(child.pid&&process.platform!=='win32')try{process.kill(-child.pid,'SIGKILL');}catch{}
  const r={code:child.status,signal:child.signal,reason:child.error?.code??null,stdout:child.stdout??'',stderr:child.stderr??''};Object.assign(record,r);save();
  if(!allowFailure){assert.equal(r.reason,null,`Native command interrupted: ${r.reason}`);assert.equal(r.code,0,`${command}: ${r.stderr||r.stdout}`);}
  return r;
}
export function packageSnapshot(dir){assert.ok(fs.lstatSync(dir).isDirectory(),'Native cache root must be a directory');return snapshot(dir);}
export function verifyNativeConsumer(state) {
  const after=snapshot(state.project);
  assert.equal(after.rootMode,state.notes.rootMode);
  for(const [p,entry]of Object.entries(state.notes.entries))assert.deepEqual(after.entries[p],entry,'Changed consumer '+p);
  const allowed=state.host==='claude'?new Set(['.claude','.claude/settings.json']):new Set();
  for(const p of Object.keys(after.entries))if(!Object.hasOwn(state.notes.entries,p))assert.ok(allowed.has(p),'Unexpected consumer addition '+p);
  if(after.entries['.claude']){assert.equal(after.entries['.claude'].kind,'directory','Claude settings root must be a directory');containedNative(state.project,path.join(state.project,'.claude'));}
  if(after.entries['.claude/settings.json'])assert.equal(after.entries['.claude/settings.json'].kind,'file');
  if(state.unrelatedSettings){const settings=JSON.parse(fs.readFileSync(path.join(state.project,'.claude/settings.json'),'utf8'));delete settings.enabledPlugins?.[pluginId];delete settings.extraKnownMarketplaces?.[marketplace];assert.deepEqual(settings,state.unrelatedSettings,'Unrelated project plugin settings changed');}
}
export function verifyNativeCache(state,cache,expected) {
  containedNative(state.client,cache);assert.deepEqual(packageSnapshot(cache),expected,'Cached package bytes/types/modes/membership differ');
}
