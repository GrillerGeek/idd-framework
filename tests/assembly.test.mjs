// SPDX-License-Identifier: Apache-2.0
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { assemble } from '../scripts/build-skills.mjs';
import { validateBundles } from '../scripts/lib/packages.mjs';
import { runProcess } from '../scripts/lib/process.mjs';
import { workspace, portableFixture, snapshot, write, root } from './helpers/workspace.mjs';

test('assembly is byte/mode deterministic, idempotent and works outside caller cwd', t => {
  const dir=workspace(t), catalog=portableFixture(dir);
  assert.equal(assemble(dir,{catalog}).changed,4);
  const before=snapshot(path.join(dir,'plugin/skills'));
  assert.equal(assemble(dir,{catalog}).changed,0);
  assemble(dir,{catalog,check:true}); validateBundles(dir,catalog);
  assert.deepEqual(snapshot(path.join(dir,'plugin/skills')),before);
  assert.match(runProcess(process.execPath,[path.join(root,'scripts/build-skills.mjs'),'--check'],{cwd:dir}),/0 changed/);
  const copy=workspace(t);
  fs.cpSync(path.join(dir,'plugin/skills/idd-package-probe'),path.join(copy,'installed'),{recursive:true});
  fs.rmSync(dir,{recursive:true,force:true});
  assert.equal(runProcess(path.join(copy,'installed/scripts/probe.sh'),[],{cwd:copy}),'IDD package probe\n');
});
for (const [name,edit,code] of [
  ['missing source', (c)=>{c.bundles[0].files[0].source='missing.md';},'SOURCE'],
  ['source traversal',(c)=>{c.bundles[0].files[0].source='../escape.md';},'PATH'],
  ['absolute source',(c)=>{c.bundles[0].files[0].source='/tmp/escape.md';},'PATH'],
  ['destination traversal',(c)=>{c.bundles[0].files[0].destination='../escape.md';},'PATH'],
  ['dot segment',(c)=>{c.bundles[0].files[0].destination='references/./guide.md';},'PATH'],
  ['duplicate destination',(c)=>{c.bundles[0].files.push({...c.bundles[0].files[0]});},'MAPPING'],
  ['file directory overlap',(c)=>{c.bundles[0].files.push({source:'source/SKILL.md',destination:'references',executable:false});},'MAPPING'],
  ['overlapping bundles',(c)=>{c.bundles.push({...c.bundles[0],directory:'idd-package-probe/nested'});},'BUNDLE'],
  ['duplicate bundle',(c)=>{c.bundles.push({...c.bundles[0]});},'BUNDLE'],
  ['unknown legacy exception',(c)=>{c.bundles[0].profile='legacy-claude';},'LEGACY'],
  ['missing entrypoint',(c)=>{c.bundles[0].files=c.bundles[0].files.filter(f=>f.destination!=='SKILL.md');},'ENTRYPOINT'],
]) test(`${name} fails before writes`, t => {
  const dir=workspace(t),catalog=portableFixture(dir);edit(catalog);
  for (const check of [false,true]) assert.throws(()=>assemble(dir,{catalog,check}),new RegExp(code));
  assert.equal(fs.existsSync(path.join(dir,'plugin/skills')),false);
});
for (const side of ['source','output']) test(`${side} symlink escape is rejected`,t=>{
  const dir=workspace(t), outside=workspace(t),catalog=portableFixture(dir);
  write(outside,'protected.md','unchanged');
  if(side==='source') {fs.unlinkSync(path.join(dir,'source/SKILL.md'));fs.symlinkSync(path.join(outside,'protected.md'),path.join(dir,'source/SKILL.md'));}
  else {fs.mkdirSync(path.join(dir,'plugin'));fs.symlinkSync(outside,path.join(dir,'plugin/skills'));}
  assert.throws(()=>assemble(dir,{catalog}),/SYMLINK/);
  assert.equal(fs.readFileSync(path.join(outside,'protected.md'),'utf8'),'unchanged');
  assert.deepEqual(fs.readdirSync(outside),['protected.md']);
});
for(const drift of ['edit','delete','mode','extra']) test(`check detects ${drift} drift without modifying it`,t=>{
  const dir=workspace(t),catalog=portableFixture(dir);assemble(dir,{catalog});
  const entry=path.join(dir,'plugin/skills/idd-package-probe/SKILL.md');
  if(drift==='edit')fs.appendFileSync(entry,'\nmanual edit\n');
  if(drift==='delete')fs.unlinkSync(entry);
  if(drift==='mode')fs.chmodSync(entry,0o755);
  if(drift==='extra')write(dir,'plugin/skills/idd-package-probe/notes.txt','user notes');
  const before=snapshot(path.join(dir,'plugin/skills'));
  assert.throws(()=>assemble(dir,{catalog,check:true}),/STALE_OUTPUT|EXTRA_OUTPUT/);
  assert.deepEqual(snapshot(path.join(dir,'plugin/skills')),before);
  if(drift==='extra') {
    assert.throws(()=>assemble(dir,{catalog}),/EXTRA_OUTPUT/);
    assert.deepEqual(snapshot(path.join(dir,'plugin/skills')),before);
  } else {assemble(dir,{catalog});assert.equal(assemble(dir,{catalog,check:true}).changed,0);}
});
for(const [name,text,code] of [
  ['missing linked resource','\nRead [missing](references/missing.md).\n','RESOURCE'],
  ['missing literal resource','\nRead `references/missing.md`.\n','RESOURCE'],
  ['missing anchor','\nRead [missing](references/guide.md#absent).\n','RESOURCE'],
  ['escaping link','\nRead [outside](../../../../outside.md).\n','RESOURCE'],
  ['Claude root','\nUse ${CLAUDE_PLUGIN_ROOT}.\n','HOST_SPECIFIC'],
  ['Claude invocation','\nRun /idd-framework:interview.\n','HOST_SPECIFIC'],
  ['Claude dispatch','\nAgent({ model: "opus" })\n','HOST_SPECIFIC'],
]) test(`portable package rejects ${name}`,t=>{
  const dir=workspace(t),catalog=portableFixture(dir);
  fs.appendFileSync(path.join(dir,'source/SKILL.md'),text);assemble(dir,{catalog});
  assert.throws(()=>validateBundles(dir,catalog),new RegExp(code));
});
test('metadata duplicate keys and names are rejected',t=>{
  const dir=workspace(t),catalog=portableFixture(dir),entry=path.join(dir,'source/SKILL.md');
  const original=fs.readFileSync(entry,'utf8');
  fs.writeFileSync(entry,original.replace('name: idd-package-probe','name: idd-package-probe\nname: duplicate'));assemble(dir,{catalog});
  assert.throws(()=>validateBundles(dir,catalog),/DUPLICATE_KEY/);
  fs.writeFileSync(entry,original.replace('name: idd-package-probe','name: Wrong Name'));assemble(dir,{catalog});
  assert.throws(()=>validateBundles(dir,catalog),/METADATA/);
});

for (const [name,text,valid] of [
 ['contained reference link','\nRead [guide][g].\n\n[g]: references/guide.md#expected-result\n',true],
 ['collapsed reference link','\nRead [guide][].\n\n[guide]: references/guide.md\n',true],
 ['shortcut reference link','\nRead [guide].\n\n[guide]: references/guide.md\n',true],
 ['reference escape','\nRead [guide][g].\n\n[g]: ../../outside.md\n',false],
 ['reference missing file','\nRead [guide][g].\n\n[g]: references/missing.md\n',false],
 ['reference missing anchor','\nRead [guide][g].\n\n[g]: references/guide.md#missing\n',false],
 ['inline single-quoted title','\nRead [guide](references/missing.md \'Title\').\n',false],
]) test(`portable resources validate ${name}`,t=>{
 const dir=workspace(t),catalog=portableFixture(dir);fs.appendFileSync(path.join(dir,'source/SKILL.md'),text);assemble(dir,{catalog});
 if(valid)assert.doesNotThrow(()=>validateBundles(dir,catalog));else assert.throws(()=>validateBundles(dir,catalog),/RESOURCE/);
});
