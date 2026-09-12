// SPDX-License-Identifier: Apache-2.0
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { stringify } from 'yaml';
import { validateArtifact, validateArtifacts } from '../scripts/lib/artifacts.mjs';
import { parseYAML } from '../scripts/lib/yaml.mjs';
import { workspace,write,snapshot,root } from './helpers/workspace.mjs';

function spec() { return {spec:{id:'SPEC-a1b2',product:'PROD-a1b2',intentions:['INT-a1b2'],expectations:['EXP-a1b2'],status:'ready',context:{stack:'Node 22',patterns:'CLI',conventions:['Use exit codes'],auth:'N/A',existing_code_refs:[]},expectations_detail:[{id:'EXP-a1b2',description:'Reject invalid arguments',validation:'Exit nonzero',edge_cases:['No arguments','Unknown type']}],boundaries:['No global writes'],deliverables:['CLI'],validation:{automated:['Run checks'],human_review:['Review CLI help']}}}; }
function hierarchy(dir) {
  write(dir,'docs/products/PROD-a1b2.yaml',stringify({product:{id:'PROD-a1b2',name:'Test product',status:'active',owner:'Test',problem_statement:'Problem',target_audience:'Users',value_proposition:'Value',strategic_alignment:'Goal',context:{stack:'Node',patterns:'CLI',conventions:[],auth:'N/A'}}}));
  write(dir,'docs/intentions/INT-a1b2.yaml',stringify({intention:{id:'INT-a1b2',product:'PROD-a1b2',statement:'Outcome',rationale:'Reason',priority:'high',dependencies:[],expectations:['EXP-a1b2'],owner:'Test',status:'defined'}}));
  write(dir,'docs/expectations/EXP-a1b2.yaml',stringify({expectation:{id:'EXP-a1b2',intention:'INT-a1b2',description:'Behavior',validation_criteria:'Pass/fail',edge_cases:['None','Too many'],complexity:'low',owner:'Test',status:'ready'}}));
  write(dir,'docs/specs/SPEC-a1b2.yaml',stringify(spec()));
}
for(const [name,edit] of [
 ['missing block',s=>delete s.context],
 ['invalid lifecycle',s=>s.status='banana'],
 ['blank ready stack',s=>s.context.stack=' '],
 ['blank auth',s=>s.context.auth=''],
 ['empty conventions',s=>s.context.conventions=[]],
 ['missing detail',s=>s.expectations_detail=[]],
 ['duplicate linked ID',s=>s.expectations.push('EXP-a1b2')],
 ['duplicate detail ID',s=>s.expectations_detail.push({...s.expectations_detail[0]})],
 ['mismatched IDs',s=>s.expectations_detail[0].id='EXP-ffff'],
 ['too few edge cases',s=>s.expectations_detail[0].edge_cases=['None']],
 ['blank edge case',s=>s.expectations_detail[0].edge_cases=['None',' ']],
 ['untyped deliverables',s=>s.deliverables=[42]],
 ['missing human validation',s=>s.validation.human_review=[]],
]) test(`live validation rejects ${name}`,()=>{
 const data=spec();edit(data.spec);assert.throws(()=>validateArtifact(stringify(data)),/SCHEMA/);
});
test('drafts allow incomplete values and additive fields but not malformed shapes',()=>{
 const d=spec();d.spec.status='draft';d.spec.context.stack='';d.spec.context.conventions=[];d.spec.expectations_detail=[];d.spec.expectations=[];d.spec.deliverables=[];d.spec.extra_annotation={note:'future field'};
 assert.doesNotThrow(()=>validateArtifact(stringify(d)));
 d.spec.context.conventions='not an array';assert.throws(()=>validateArtifact(stringify(d)),/SCHEMA/);
});
test('duplicate keys and multiple documents are rejected before values are consumed',()=>{
 assert.throws(()=>parseYAML('spec: {}\nspec: {}\n','duplicate.yaml'),/DUPLICATE_KEY/);
 assert.throws(()=>parseYAML('spec: {}\n---\nspec: {}\n','multiple.yaml'),/MULTIPLE_DOCS/);
});
test('templates permit placeholders while enforcing schema shape',()=>{
 for(const kind of ['product','intention','expectation','spec']) {
   const file=`templates/${kind}-template.yaml`,text=fs.readFileSync(path.join(root,file),'utf8');
   assert.doesNotThrow(()=>validateArtifact(text,{file,kind,template:true}));
   const data=parseYAML(text,file);delete data[kind].status;
   assert.throws(()=>validateArtifact(stringify(data),{file,kind,template:true}),/SCHEMA/);
 }
});
test('historical clean/flawed fixtures are explicit, immutable and do not exempt live files',t=>{
 const dir=workspace(t),profiles=JSON.parse(fs.readFileSync(path.join(root,'tests/fixtures/artifact-profiles.json')));
 for(const file of Object.keys(profiles))write(dir,file,fs.readFileSync(path.join(root,file)));
 const before=snapshot(dir);let result=validateArtifacts(dir,{profiles});assert.deepEqual(result.errors,[]);assert.equal(result.fixtures,2);assert.deepEqual(snapshot(dir),before);
 write(dir,'docs/specs/SPEC-test-another.yaml','spec: {}\nspec: {}\n');
 assert.match(validateArtifacts(dir,{profiles}).errors.join('\n'),/DUPLICATE_KEY/);
 fs.appendFileSync(path.join(dir,'docs/specs/SPEC-test-flawed.yaml'),'\n# changed\n');
 assert.match(validateArtifacts(dir,{profiles}).errors.join('\n'),/FIXTURE_CHANGED/);
 profiles['docs/specs/SPEC-test-another.yaml']={expect:'DUPLICATE_KEY',sha256:'0'.repeat(64)};
 assert.match(validateArtifacts(dir,{profiles}).errors.join('\n'),/FIXTURE_PROFILE/);
});
test('live hierarchy links resolve by ID, unique product name or ledger record',t=>{
 const dir=workspace(t);hierarchy(dir);assert.deepEqual(validateArtifacts(dir,{profiles:{}}).errors,[]);
 const file=path.join(dir,'docs/specs/SPEC-a1b2.yaml'),data=spec();data.spec.product='Test product';fs.writeFileSync(file,stringify(data));
 assert.deepEqual(validateArtifacts(dir,{profiles:{}}).errors,[]);
 data.spec.product='Missing product';fs.writeFileSync(file,stringify(data));assert.match(validateArtifacts(dir,{profiles:{}}).errors.join('\n'),/REFERENCE/);
 data.spec.product='PROD-a1b2';fs.writeFileSync(file,stringify(data));fs.unlinkSync(path.join(dir,'docs/expectations/EXP-a1b2.yaml'));
 assert.match(validateArtifacts(dir,{profiles:{}}).errors.join('\n'),/REFERENCE/);
 write(dir,'docs/idd-ledger.yaml',stringify({ledger:{version:1,records:[{id:'EXP-a1b2',type:'expectation',title:'Archived expectation'}]}}));
 assert.deepEqual(validateArtifacts(dir,{profiles:{}}).errors,[]);
});
test('duplicate live IDs and wrong-type parent references fail',t=>{
 const dir=workspace(t);hierarchy(dir);
 const specText=fs.readFileSync(path.join(dir,'docs/specs/SPEC-a1b2.yaml'),'utf8');write(dir,'docs/specs/SPEC-a1b2-description.yaml',specText);
 assert.match(validateArtifacts(dir,{profiles:{}}).errors.join('\n'),/duplicate ID/);
 fs.unlinkSync(path.join(dir,'docs/specs/SPEC-a1b2-description.yaml'));
 const data=spec();data.spec.product='INT-a1b2';write(dir,'docs/specs/SPEC-a1b2.yaml',stringify(data));
 assert.match(validateArtifacts(dir,{profiles:{}}).errors.join('\n'),/wrong-type/);
});
test('non-draft Expectations need edge cases and deferred reason',()=>{
 const value={expectation:{id:'EXP-a1b2',intention:'INT-a1b2',description:'Behavior',validation_criteria:'Pass',edge_cases:['One','Two'],complexity:'low',owner:'Test',status:'deferred'}};
 assert.throws(()=>validateArtifact(stringify(value),{kind:'expectation'}),/deferred_reason/);
 value.expectation.deferred_reason='Awaiting input';assert.doesNotThrow(()=>validateArtifact(stringify(value),{kind:'expectation'}));
 value.expectation.edge_cases=['Only'];assert.throws(()=>validateArtifact(stringify(value),{kind:'expectation'}),/edge_cases/);
});
test('historical gap status remains readable without asserting a report exists',()=>{
 const value=spec();value.spec.status='done';value.spec.gap_check={status:'warned',blockers:0,warnings:1,report:'old-file.md',date:'2020-01-01'};
 assert.doesNotThrow(()=>validateArtifact(stringify(value)));
});

for (const [kind,file,parent] of [['spec','docs/specs/SPEC-a1b2.yaml','product'],['expectation','docs/expectations/EXP-a1b2.yaml','intention'],['intention','docs/intentions/INT-a1b2.yaml','product']]) test(`non-draft ${kind} requires a parent while draft allows a placeholder`,t=>{
 const dir=workspace(t);hierarchy(dir);const data=parseYAML(fs.readFileSync(path.join(dir,file),'utf8'),file);
 data[kind][parent]='';write(dir,file,stringify(data));
 assert.match(validateArtifacts(dir,{profiles:{}}).errors.join('\n'),/parent must not be empty/);
 data[kind].status='draft';write(dir,file,stringify(data));
 assert.deepEqual(validateArtifacts(dir,{profiles:{}}).errors,[]);
});
