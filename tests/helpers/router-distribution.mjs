// SPDX-License-Identifier: Apache-2.0
// Disposable distribution fixtures; no production workflow implementation.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {root,write} from './workspace.mjs';
import {snapshot,gitState,hash} from '../../plugin/runtime/snapshot.mjs';
import {installLocal,installerExecutable} from '../../scripts/test-install.mjs';
import {runProcess} from '../../scripts/lib/process.mjs';
import {visibleAssistantText} from './pilot.mjs';
export const sourceHash=hash(fs.readFileSync(path.join(root,'tests/helpers/router-distribution.mjs')));
export const catalog=JSON.parse(fs.readFileSync(path.join(root,'plugin/skill-catalog.json')));
export const skillNames=catalog.bundles.map(b=>b.directory).sort();
export const installedPath=(project,host,name='idd-orchestration')=>path.join(project,host==='claude'?'.claude/skills':'.agents/skills',name);
export function setupRouter(owned,{host='claude',copy=true,execution=false}={}) {
  const project=path.join(owned,'project with spaces'),source=path.join(owned,'copied source');
  if(execution)fs.cpSync(path.join(root,'tests/fixtures/installed-execution'),project,{recursive:true});
  else {write(project,'USER-NOTES.md','Unrelated user decision. Preserve this file.\n');write(project,'docs/products/PROD-aabb.yaml','product:\n  id: PROD-aabb\n  name: Team handbook\n  status: active\n  owner: Fixture stakeholder\n  problem_statement: Team decisions become hard to find.\n  target_audience: Small project teams\n  value_proposition: Find the reason for a decision.\n  strategic_alignment: Maintain shared understanding\n  context:\n    stack: Markdown and YAML files\n    patterns: File-based documentation\n    conventions: [Keep confirmed decisions explicit]\n    auth: Local trusted repository access\n');}
  fs.cpSync(path.join(root,'plugin/skills/idd-orchestration'),source,{recursive:true});
  installLocal(source,project,'idd-orchestration',{copy,stateRoot:owned,agents:[host==='claude'?'claude-code':'codex']});
  if(copy)fs.rmSync(source,{recursive:true});
  for(const args of [['init','-q'],['add','.'],['-c','user.name=IDD Fixture','-c','user.email=fixture@example.invalid','-c','commit.gpgsign=false','commit','-qm','router fixture']])runProcess('git',args,{cwd:project});
  fs.appendFileSync(path.join(project,'USER-NOTES.md'),'\nPreserve this dirty user note.\n');
  const bundle=installedPath(project,host);
  return {project,bundle,skill:path.join(bundle,'SKILL.md'),before:snapshot(project,{excludeGit:true}),git:gitState(fs.realpathSync(project)),config:hash(fs.readFileSync(path.join(project,'.git/config')))};
}
export function routerPrompt(scenario,skill) {
  assert.ok(['outcomes','missing'].includes(scenario));
  const request=scenario==='outcomes'?'PROD-aabb is confirmed. I want to define Intentions and Expectations together for this Product. Route only: load the selected full procedure, shared authoring guidance and both templates, explain why it fits, then stop before stakeholder questions, confirmation or artifact authoring.':'Implement SPEC-dead. Inspect actual prerequisites and load the full selected local implementation procedure and its required references. If the Spec is absent, explain the missing prerequisite and stop without authoring or implementation.';
  return `Use the installed IDD router at ${skill}. Only this router is installed; its original source has been removed. ${request}\nPreserve all existing files, directory membership/modes, installed resources and Git state. Do not create scratch files or hierarchy directories. Read complete required resources using visible commands, not a hidden script. Do not invoke another model or controller from this session. This is a routing observation, not approval to fabricate context, a gate or a build.`;
}
export function verifyRouting(state,scenario,transcript) {
  assert.deepEqual(snapshot(state.project,{excludeGit:true}),state.before,'Routing changed project state');
  assert.deepEqual(gitState(fs.realpathSync(state.project)),state.git,'Routing changed Git state');
  assert.equal(hash(fs.readFileSync(path.join(state.project,'.git/config'))),state.config);
  const text=visibleAssistantText(transcript);
  assert.match(text,scenario==='outcomes'?/outcomes|Intentions[\s\S]*Expectations/i:/SPEC-dead/);
  if(scenario==='missing')assert.match(text,/missing|absent|not found|does not exist|cannot find/i);
  return {outcome:'passed',changes:[],scope:'Preservation and final-text oracle only; independent full resource-read trace review required.'};
}
export const refreshMarker='\n<!-- Disposable explicit local refresh marker -->\n';
export function verifyClosure(bundle,directRoot=path.join(root,'plugin/skills'),{refreshed=false}={}) {
  const router=catalog.bundles.find(b=>b.directory==='idd-orchestration');
  for(const file of router.files){const p=path.join(bundle,file.destination);assert.equal(fs.lstatSync(p).isFile(),true,file.destination);assert.equal(fs.statSync(p).mode&0o777,file.executable?0o755:0o644);let expected=fs.readFileSync(path.join(root,file.source));if(refreshed&&file.destination==='SKILL.md')expected=Buffer.concat([expected,Buffer.from(refreshMarker)]);assert.deepEqual(fs.readFileSync(p),expected,'Mapped bytes '+file.destination);}
  for(const b of catalog.bundles.filter(b=>b.directory!=='idd-orchestration')) {
    const stage=b.directory.slice(4);
    for(const f of b.files)assert.deepEqual(fs.readFileSync(path.join(bundle,'stages',stage,f.destination==='SKILL.md'?'workflow.md':f.destination)),fs.readFileSync(path.join(directRoot,b.directory,f.destination)),`${stage}/${f.destination}`);
  }
  const entries=snapshot(bundle).entries;
  assert.deepEqual(Object.keys(entries).filter(p=>p.endsWith('SKILL.md')),['SKILL.md']);
  const expectedPaths=new Set();for(const f of router.files){const parts=f.destination.split('/');for(let i=1;i<=parts.length;i++)expectedPaths.add(parts.slice(0,i).join('/'));}
  assert.deepEqual(Object.keys(entries).sort(),[...expectedPaths].sort(),'Unexpected bundle membership');
  const interview=path.join(bundle,'stages/interview');
  assert.match(fs.readFileSync(path.join(interview,'workflow.md'),'utf8'),/loaded entry/);
  assert.match(runProcess('bash',[path.join(interview,'scripts/idd-next-id'),'product'],{cwd:path.dirname(bundle)}),/^PROD-[a-f0-9]{4,8}\n$/);
  return router.files.length;
}
export function installedSnapshot(project,file) {
  const stat=fs.lstatSync(file),real=fs.realpathSync(file);assert.ok(real.startsWith(fs.realpathSync(project)+path.sep),'Installed root escaped project');
  assert.ok(stat.isDirectory()||stat.isSymbolicLink(),'Invalid installation root');
  return {kind:stat.isSymbolicLink()?'symlink':'directory',mode:stat.mode&0o7777,target:stat.isSymbolicLink()?fs.readlinkSync(file):null,contents:snapshot(file)};
}
export function verifySelectedRemoval(project,host,name,canonicalBefore) {
  const present=p=>Boolean(fs.lstatSync(p,{throwIfNoEntry:false}));
  if(host==='claude')assert.equal(present(installedPath(project,host,name)),false,'Selected Claude alias/copy remains');
  const canonical=path.join(project,'.agents/skills',name);
  if(present(canonical)) {
    assert.ok(canonicalBefore,'Unexpected canonical installation created by removal');
    assert.equal(fs.lstatSync(canonical).isDirectory(),true,'Retained canonical root must remain a directory');
    assert.deepEqual(installedSnapshot(project,canonical),canonicalBefore,'Retained shared installation changed');
    return {name,state:'still-installed',path:canonical,reason:'Pinned host-scoped removal retained the shared canonical directory; no complete uninstall claimed'};
  }
  assert.equal(present(installedPath(project,host,name)),false);
  return {name,state:'removed'};
}
export function installerReceipt(owned,project,args,receipts,{run=spawnSync}={}) {
  const receipt={command:process.execPath,args:[installerExecutable(),...args],date:new Date().toISOString()};receipts.push(receipt);
  const persist=()=>fs.writeFileSync(path.join(owned,'receipts.json'),JSON.stringify(receipts,null,2));persist();
  const r=run(receipt.command,receipt.args,{cwd:project,env:{...process.env,DISABLE_TELEMETRY:'1',DO_NOT_TRACK:'1',XDG_STATE_HOME:path.join(owned,'installer state')},encoding:'utf8',timeout:60000,maxBuffer:4*1024*1024,killSignal:'SIGKILL'});
  Object.assign(receipt,{code:r.status,signal:r.signal??null,error:r.error?.message??null,stdout:r.stdout??'',stderr:r.stderr??''});persist();
  assert.ok(!r.error&&r.status===0,`Installer failed: ${receipt.error??r.signal??r.status}; full attempted argv/output in receipts.json`);
  return receipt.stdout.replace(/\x1b\[[0-9;]*m/g,'');
}
export function bulkLifecycle(owned,{host,copy}) {
  assert.ok(['claude','codex'].includes(host));
  const project=path.join(owned,'consumer'),source=path.join(owned,'local source'),agent=host==='claude'?'claude-code':'codex',receipts=[];
  fs.mkdirSync(project,{recursive:true});fs.cpSync(path.join(root,'plugin/skills'),source,{recursive:true});
  write(project,'USER-NOTES.md','Preserve consumer decisions.\n');
  const unrelated=installedPath(project,host,'unrelated-fixture');write(unrelated,'SKILL.md','---\nname: unrelated-fixture\ndescription: Retained unrelated fixture\n---\nLeave this installed.\n');
  const unrelatedBefore=installedSnapshot(project,unrelated),notes=fs.readFileSync(path.join(project,'USER-NOTES.md'));
  const cli=args=>installerReceipt(owned,project,args,receipts);
  const discovered=cli(['add',source,'--list']);
  const found=[...discovered.matchAll(/^│\s+(idd-[a-z-]+)\s*$/gm)].map(m=>m[1]).sort();assert.deepEqual(found,skillNames,'Pinned discovery must expose exactly16 public names');
  cli(['add',source,'--agent',agent,'--skill',...skillNames,'--yes',...(copy?['--copy']:[])]);
  const inventory=cli(['list','--agent',agent]);for(const name of skillNames)assert.ok(inventory.includes(name));
  const checkModes=()=>{for(const name of skillNames){const p=installedPath(project,host,name);assert.ok(fs.realpathSync(p).startsWith(fs.realpathSync(project)+path.sep));assert.equal(fs.lstatSync(p).isSymbolicLink(),false,'Pinned single-host install forces copy');}};
  checkModes();verifyClosure(installedPath(project,host),source);
  const beforeUpdate=snapshot(project),selected='idd-orchestration';
  const update=cli(['update',selected,'--project','--yes']);assert.deepEqual(snapshot(project),beforeUpdate,'Local update must be a no-op');
  const retained=Object.fromEntries(skillNames.filter(n=>n!==selected).map(n=>[n,installedSnapshot(project,installedPath(project,host,n))]));
  fs.appendFileSync(path.join(source,selected,'SKILL.md'),refreshMarker);
  cli(['add',source,'--agent',agent,'--skill',selected,'--yes',...(copy?['--copy']:[])]);
  checkModes();
  for(const [name,state]of Object.entries(retained))assert.deepEqual(installedSnapshot(project,installedPath(project,host,name)),state,'Refresh changed retained '+name);
  fs.rmSync(source,{recursive:true});
  verifyClosure(installedPath(project,host),undefined,{refreshed:true});
  const canonicalStates=Object.fromEntries(skillNames.map(name=>{const p=path.join(project,'.agents/skills',name);return [name,fs.existsSync(p)?installedSnapshot(project,p):null];}));
  cli(['remove',selected,'--agent',agent,'--yes']);const removals=[verifySelectedRemoval(project,host,selected,canonicalStates[selected])];
  for(const [name,state]of Object.entries(retained))assert.deepEqual(installedSnapshot(project,installedPath(project,host,name)),state,'Selected removal changed '+name);
  cli(['remove',...skillNames.filter(n=>n!==selected),'--agent',agent,'--yes']);
  for(const name of skillNames.filter(n=>n!==selected))removals.push(verifySelectedRemoval(project,host,name,canonicalStates[name]));
  assert.deepEqual(installedSnapshot(project,unrelated),unrelatedBefore);assert.deepEqual(fs.readFileSync(path.join(project,'USER-NOTES.md')),notes);assert.equal(fs.existsSync(path.join(project,'docs')),false);
  return {outcome:'passed',host,requestedMode:copy?'copy':'default',actualMode:'copy',modeNote:'Pinned single-host installation forces copy, even without --copy; dual-host symlink coverage is separate',discovered:found,update:'Observed local-source no-op; no content update claimed',updateOutput:update,refresh:'Explicit add with retained host/mode',removals,receipts:path.join(owned,'receipts.json')};
}
