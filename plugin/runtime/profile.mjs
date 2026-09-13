// SPDX-License-Identifier: Apache-2.0
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import YAML from '../vendor/yaml/dist/index.js';
const nonempty=v=>typeof v==='string'&&!!v.trim();
const list=(v,min=1)=>Array.isArray(v)&&v.length>=min&&v.every(nonempty);
export function parseDocument(text) {
  const doc=YAML.parseDocument(text,{uniqueKeys:true});
  assert.equal(doc.errors.length,0,doc.errors.map(e=>e.message).join('\n'));
  const value=doc.toJS({maxAliasCount:0}); // Execution metadata never needs YAML aliases.
  return {doc,value};
}
export function safePath(project,relative,{missing=true}={}) {
  assert.ok(nonempty(relative)&&!path.isAbsolute(relative)&&!/[\\*?\[\]\0]/.test(relative)&&relative.split('/').every(p=>p&&p!=='.'&&p!=='..'),`Unsafe path: ${relative}`);
  let file=project;
  for(const part of relative.split('/')) {
    const parent=file;file=path.join(file,part);
    if(!fs.existsSync(file)) {assert.ok(missing&&!fs.lstatSync(file,{throwIfNoEntry:false}),`Missing/unsafe path: ${relative}`);continue;}
    const stat=fs.lstatSync(file);
    assert.ok(!stat.isSymbolicLink(),`Symlink path: ${relative}`);
    assert.ok(!stat.isFile()||stat.nlink===1,`Hardlinked guarded path: ${relative}`);
    assert.ok(fs.readdirSync(parent).includes(part),`Noncanonical filesystem spelling: ${relative}`);
  }
  return file;
}
function keys(object,allowed) {
  assert.ok(object&&typeof object==='object'&&!Array.isArray(object),'Expected mapping');
  assert.deepEqual(Object.keys(object).filter(k=>!allowed.includes(k)),[],'Unknown execution metadata keys');
}
// Conservative case/Unicode folding also rejects aliases before creating paths.
const fold=p=>p.normalize('NFC').toLowerCase();
const contains=(a,b)=>fold(a)===fold(b)||fold(b).startsWith(fold(a)+'/');
export function validateContract(spec,project,specFile,bundleRoot) {
  const contract=spec.execution_contract;keys(contract,['version','outputs','checks']);assert.equal(contract.version,1,'Unsupported execution contract version');
  assert.ok(Array.isArray(contract.outputs)&&Array.isArray(contract.checks),'Expected outputs/checks');
  const protectedPaths=[specFile,`docs/reviews/${spec.id}-gap-check.md`,'.git'];
  const bundleRelative=path.relative(project,bundleRoot).split(path.sep).join('/');
  if(bundleRelative&&!bundleRelative.startsWith('../')&&!path.isAbsolute(bundleRelative))protectedPaths.push(bundleRelative);
  const seen=new Set(),paths=[];let reports=0;
  for(const output of contract.outputs) {
    keys(output,['deliverable','path','kind']);assert.ok(Number.isInteger(output.deliverable)&&output.deliverable>=1&&output.deliverable<=spec.deliverables.length&&!seen.has(output.deliverable),'Invalid/duplicate deliverable mapping');seen.add(output.deliverable);
    if(output.kind==='execution-report'){assert.equal(output.path,undefined,'Report path is selected at creation');reports++;continue;}
    assert.ok(['file','directory'].includes(output.kind),'Unsupported output kind');safePath(project,output.path);
    assert.ok(!protectedPaths.some(p=>contains(p,output.path)||contains(output.path,p)),`Protected output: ${output.path}`);
    assert.ok(!paths.some(p=>contains(p,output.path)||contains(output.path,p)),'Overlapping output paths');paths.push(output.path);
  }
  assert.equal(seen.size,spec.deliverables.length,'Every deliverable requires one mapping');assert.equal(reports,1,'Exactly one execution-report output required');
  const checks=new Set();for(const check of contract.checks) {
    keys(check,['validation','kind','argv','timeout_seconds']);assert.ok(Number.isInteger(check.validation)&&check.validation>=1&&check.validation<=spec.validation.automated.length&&!checks.has(check.validation),'Invalid/duplicate validation mapping');checks.add(check.validation);
    if(check.kind!==undefined){assert.ok(['preservation','report'].includes(check.kind),'Unsupported check kind');assert.equal(check.argv,undefined);assert.equal(check.timeout_seconds,undefined);}
    else {assert.ok(list(check.argv)&&check.argv.every(s=>!s.includes('\0')),'Expected explicit argv vector');assert.ok(Number.isInteger(check.timeout_seconds)&&check.timeout_seconds>=1&&check.timeout_seconds<=600,'Invalid command timeout');}
  }
  assert.equal(checks.size,spec.validation.automated.length,'Every automated validation requires one mapping');return contract;
}
export function statusText(text,from,to) {
  const {doc,value}=parseDocument(text);assert.equal(value.spec?.status,from,'Unexpected lifecycle');
  const node=doc.getIn(['spec','status'],true);assert.ok(YAML.isScalar(node)&&node.range,'Ambiguous lifecycle node');
  assert.ok(['PLAIN','QUOTE_SINGLE','QUOTE_DOUBLE'].includes(node.type),'Unsupported block-form lifecycle scalar');
  const replacement=node.type==='QUOTE_SINGLE'?`'${to}'`:node.type==='QUOTE_DOUBLE'?JSON.stringify(to):to;
  return text.slice(0,node.range[0])+replacement+text.slice(node.range[1]);
}
export function loadProfile(project,id,bundleRoot) {
  assert.match(id,/^SPEC-(?:[a-f0-9]{4,8}|[0-9]{3})$/,'Expected immutable Spec ID');
  const directory=safePath(project,'docs/specs',{missing:false}),matches=[];
  for(const name of fs.readdirSync(directory).filter(n=>/\.ya?ml$/.test(n))) {
    const relative=`docs/specs/${name}`,file=safePath(project,relative,{missing:false});assert.ok(fs.statSync(file).isFile(),'Spec must be regular');
    const text=fs.readFileSync(file,'utf8'),{value}=parseDocument(text);if(value?.spec?.id===id)matches.push({relative,text,spec:value.spec,root:value});
  }
  assert.equal(matches.length,1,'Missing or ambiguous Spec identity');const {relative:specFile,text,spec,root}=matches[0];assert.deepEqual(Object.keys(root),['spec'],'Expected one Spec root');
  assert.equal(spec.status,'ready','Expected ready lifecycle');statusText(text,'ready','in-progress');
  assert.ok(nonempty(spec.product)&&list(spec.intentions,0)&&list(spec.expectations),'Missing parent/Expectations');
  for(const key of ['stack','patterns','auth'])assert.ok(nonempty(spec.context?.[key]),`Incomplete context.${key}`);
  assert.ok(list(spec.context.conventions)&&Array.isArray(spec.context.existing_code_refs),'Incomplete context');
  assert.ok(spec.context.existing_code_refs.every(r=>r&&typeof r.path==='string'&&typeof r.note==='string'),'Invalid code references');
  for(const field of ['boundaries','deliverables'])assert.ok(list(spec[field]),`Incomplete ${field}`);
  for(const field of ['automated','human_review'])assert.ok(list(spec.validation?.[field]),`Incomplete validation.${field}`);
  assert.ok(Array.isArray(spec.expectations_detail),'Missing detail');const ids=[];
  for(const detail of spec.expectations_detail){assert.ok(nonempty(detail.id)&&nonempty(detail.description)&&nonempty(detail.validation)&&list(detail.edge_cases,2),'Incomplete Expectation detail');ids.push(detail.id);}
  assert.equal(new Set(ids).size,ids.length,'Duplicate detail');assert.equal(new Set(spec.expectations).size,spec.expectations.length,'Duplicate linked Expectation');assert.deepEqual([...ids].sort(),[...spec.expectations].sort(),'Linked/detail mismatch');
  assert.equal(spec.peer_review?.outcome,'approved','Missing actual recorded readiness approval');assert.ok(nonempty(spec.peer_review.reviewer),'Missing reviewer');
  const gapFile=`docs/reviews/${id}-gap-check.md`,gate=spec.gap_check;assert.equal(gate?.status,'passed','Expected passed gap-check');
  for(const field of ['blockers','warnings'])assert.ok(Number.isInteger(gate[field])&&gate[field]===0,`Expected integer zero ${field}`);
  assert.equal(gate.report,gapFile,'Expected canonical gap report');const file=safePath(project,gapFile,{missing:false});assert.ok(fs.statSync(file).isFile(),'Gap report must be regular');
  const gapText=fs.readFileSync(file,'utf8');assert.match(gapText,/^PASS — 0 blockers, 0 warnings\r?\n/);assert.match(gapText,/^## Coverage\s*$/m);
  const contract=validateContract(spec,project,specFile,bundleRoot);return {spec,specFile,text,gapFile,gapText,contract};
}
