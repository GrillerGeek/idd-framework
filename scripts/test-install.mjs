// SPDX-License-Identifier: Apache-2.0
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { assemble, repositoryRoot } from './build-skills.mjs';
import { runProcess } from './lib/process.mjs';
import { spawnSync } from 'node:child_process';
import { portableFixture, workspace } from '../tests/helpers/workspace.mjs';

export function installerExecutable() {
  const packageRoot=path.join(repositoryRoot,'node_modules/skills');
  const metadata=JSON.parse(fs.readFileSync(path.join(packageRoot,'package.json'),'utf8'));
  assert.equal(metadata.version,'1.5.25','installer must match the reviewed pin');
  return path.join(packageRoot,'bin/cli.mjs');
}
export function installLocal(source,target,name,{copy=false,stateRoot=target,agents=['codex','claude-code']}={}) {
  return runProcess(process.execPath,[installerExecutable(),'add',source,'--agent',...agents,'--skill',name,'--yes',...(copy?['--copy']:[])],{
    cwd:target,env:{...process.env,DISABLE_TELEMETRY:'1',DO_NOT_TRACK:'1',XDG_STATE_HOME:path.join(stateRoot,'installer state')},timeout:60000,
  });
}
export function probeInstall() {
  const ownedRoot=workspace();
  const production=JSON.parse(fs.readFileSync(path.join(repositoryRoot,'plugin/skill-catalog.json')));
  const bundles=production.bundles.filter(b=>b.profile==='portable');
  try {
    for (const copy of [false,true]) {
      const mode=copy?'copy':'symlink';
      for (const bundle of [null,...bundles]) {
        const name=bundle?.directory??'idd-package-probe';
        const working=path.join(ownedRoot,`${name} ${mode}`);fs.mkdirSync(working);
        const source=path.join(working,'source'),target=path.join(working,'target');fs.mkdirSync(source);fs.mkdirSync(target);
        let mappings,skillSource;
        if(bundle) {
          assemble(repositoryRoot,{check:true});
          skillSource=path.join(source,name);fs.cpSync(path.join(repositoryRoot,'plugin/skills',name),skillSource,{recursive:true});mappings=bundle.files;
        } else {
          const catalog=portableFixture(source);assemble(source,{catalog});mappings=catalog.bundles[0].files;skillSource=path.join(source,'plugin/skills',name);
        }
        const expected=new Map(mappings.map(f=>[f.destination,{bytes:fs.readFileSync(path.join(skillSource,f.destination)),mode:f.executable?0o755:0o644}]));
        installLocal(skillSource,target,name,{copy,stateRoot:working});
        if(copy)fs.rmSync(source,{recursive:true,force:true});
        for(const [agent,relative]of[['codex','.agents/skills'],['claude-code','.claude/skills']]) {
          const parent=path.join(target,relative),installed=path.join(parent,name);
          assert.deepEqual(fs.readdirSync(parent),[name],'only the selected skill is installed');
          assert.ok(fs.existsSync(installed),`${mode}: missing ${agent} installation`);
          assert.ok(fs.realpathSync(installed).startsWith(fs.realpathSync(target)+path.sep),'installation must stay inside disposable project');
          if(agent==='claude-code')assert.equal(fs.lstatSync(installed).isSymbolicLink(),!copy,`${mode}: installation method`);
          for(const [file,{bytes,mode}]of expected) {assert.deepEqual(fs.readFileSync(path.join(installed,file)),bytes,`${agent}: ${file}`);assert.equal(fs.statSync(path.join(installed,file)).mode&0o777,mode);}
          if(!bundle)assert.equal(runProcess(path.join(installed,'scripts/probe.sh'),[],{cwd:target}),'IDD package probe\n');
          if(mappings.some(f=>f.destination==='scripts/idd-next-id')) {
            const kind=name==='idd-interview'?'product':name==='idd-define-expectations'?'expectation':name==='idd-write-spec'||name==='idd-quick-spec'?'spec':'intention';
            const prefix={product:'PROD',intention:'INT',expectation:'EXP',spec:'SPEC'}[kind];
            assert.match(runProcess('bash',[path.join(installed,'scripts/idd-next-id'),kind],{cwd:target}),new RegExp('^'+prefix+'-[a-f0-9]{4,8}\\n$'));
          }
          if(name==='idd-implement-spec') {
            const probe=spawnSync(process.execPath,[path.join(installed,'scripts/idd-execute-spec.mjs'),'--project',target,'--spec','SPEC-c0de','--check'],{cwd:working,encoding:'utf8',timeout:15000});
            assert.equal(probe.status,1);const result=JSON.parse(probe.stdout);assert.equal(result.outcome,'refused');assert.equal(result.hostInvocations,0);assert.match(result.error,/Missing\/unsafe path/,'installed runtime loads and reaches project preflight');
          }
          assert.equal(fs.existsSync(path.join(target,'docs')),false,'installation/helper does not initialize project artifacts');
          console.log(`PASS: ${name}, ${agent} ${mode}, resources and executable modes`);
        }
      }
    }
  } finally {fs.rmSync(ownedRoot,{recursive:true,force:true});}
}
if(process.argv[1] && path.resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
  try {probeInstall();console.log('Package installation verified; host workflow behavior requires separate evaluation.');}
  catch(error){console.error(error.message);process.exitCode=1;}
}
