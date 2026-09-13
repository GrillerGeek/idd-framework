// SPDX-License-Identifier: Apache-2.0
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {spawnSync} from 'node:child_process';
export const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
export function snapshot(root,{excludeGit=false,maxEntries=50000,maxBytes=512*1024*1024}={}) {
  const entries=Object.create(null);let count=0,bytes=0;
  function visit(dir,prefix='') {
    for(const name of fs.readdirSync(dir).sort()) {
      if(!prefix&&excludeGit&&name==='.git')continue;
      assert.ok(++count<=maxEntries,'Snapshot entry limit exceeded');const relative=prefix?`${prefix}/${name}`:name,file=path.join(dir,name),s=fs.lstatSync(file),mode=s.mode&0o7777;
      if(s.isSymbolicLink())entries[relative]={kind:'symlink',mode,target:fs.readlinkSync(file)};
      else if(s.isDirectory()){entries[relative]={kind:'directory',mode};visit(file,relative);}
      else {assert.ok(s.isFile(),`Unsupported file type: ${relative}`);bytes+=s.size;assert.ok(bytes<=maxBytes,'Snapshot byte limit exceeded');entries[relative]={kind:'file',mode,links:s.nlink,hash:hash(fs.readFileSync(file))};}
    }
  }
  visit(root);return {rootMode:fs.statSync(root).mode&0o7777,entries};
}
export function gitState(project) {
  const run=args=>{const r=spawnSync('git',args,{cwd:project,encoding:'utf8',timeout:10000,maxBuffer:4*1024*1024,env:{...process.env,GIT_OPTIONAL_LOCKS:'0'}});assert.ok(!r.error&&r.status===0,`Git state unavailable: ${r.error?.message??r.stderr}`);return r.stdout;};
  const top=fs.realpathSync(run(['rev-parse','--show-toplevel']).trim());assert.equal(top,project,'Project must be its own Git root');
  return {head:run(['rev-parse','--verify','HEAD']),branch:run(['rev-parse','--symbolic-full-name','HEAD']),staged:run(['diff','--cached','--binary','--no-ext-diff','--no-textconv'])};
}
export function verifyDelta(before,after,profile) {
  assert.equal(after.rootMode,before.rootMode,'Project directory mode changed');
  const reports=new RegExp(`^docs/reviews/${profile.spec.id}-[0-9]{8}T[0-9]{6}Z-execution\\.md$`);
  const outputs=profile.contract.outputs.filter(o=>o.path);
  const changed=Object.keys({...before.entries,...after.entries}).filter(p=>JSON.stringify(before.entries[p])!==JSON.stringify(after.entries[p]));
  for(const p of changed) {
    const prior=before.entries[p],next=after.entries[p];
    const owns=outputs.some(o=>p===o.path||(o.kind==='directory'&&p.startsWith(o.path+'/')));
    const parent=!prior&&next?.kind==='directory'&&(outputs.some(o=>o.path.startsWith(p+'/'))||['docs','docs/reviews'].includes(p));
    const report=reports.test(p)&&!prior;
    assert.ok(owns||parent||report,`Changed unowned path: ${p}`);assert.ok(next?.kind!=='symlink',`Symlink output: ${p}`);assert.ok(next?.kind!=='file'||next.links===1,`Hardlinked output: ${p}`);
    if(prior)assert.ok(next&&prior.mode===next.mode&&prior.kind===next.kind,`Changed existing output type/mode: ${p}`);
  }
  for(const o of outputs)assert.equal(after.entries[o.path]?.kind,o.kind,`Missing/wrong output type: ${o.path}`);
  const created=Object.keys(after.entries).filter(p=>reports.test(p)&&!before.entries[p]);assert.equal(created.length,1,'Expected exactly one new execution report');assert.equal(after.entries[created[0]].kind,'file');
  return {changes:changed,report:created[0]};
}
