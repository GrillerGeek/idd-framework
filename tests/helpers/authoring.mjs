// SPDX-License-Identifier: Apache-2.0
// Acceptance oracle only: it does not execute the prose workflow.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import YAML from 'yaml';
import {root,write} from './workspace.mjs';
import {runProcess} from '../../scripts/lib/process.mjs';
import {validateArtifact} from '../../scripts/lib/artifacts.mjs';
import {parseYAML} from '../../scripts/lib/yaml.mjs';
import {snapshot,gitState,hash} from '../../plugin/runtime/snapshot.mjs';
import {visibleAssistantText} from './pilot.mjs';
export const stages=['define-intentions','define-expectations','define-outcomes','quick-spec','write-spec'];
export const facts=JSON.parse(fs.readFileSync(path.join(root,'tests/fixtures/authoring/facts.json')));
export const productFile='docs/products/PROD-a1b2-greeting-library.yaml',intentionFile='docs/intentions/INT-a1b2-greeting.yaml',expectationFile='docs/expectations/EXP-a1b2-greeting.yaml';
export const variants=['happy','missing-confirmation','rejected-edge','parent-conflict','lineage-conflict','malformed-parent','partial-recovery','already-linked','empty-selection','ambiguous-identity','archived-parent','absent-lineage','multi-intention-spec','accelerated-rejected-edge'];
export function setupAuthoring(project,stage,variant='happy') {
  assert.ok(stages.includes(stage)&&variants.includes(variant));
  write(project,'package.json',JSON.stringify({name:'authoring-fixture',private:true,type:'module'})+'\n');write(project,'USER-NOTES.md','Existing user notes.\n');
  const product={id:'PROD-a1b2',name:'Greeting Library',status:'active',owner:facts.owner,problem_statement:'Duplicated greeting formatting',target_audience:'Library callers',value_proposition:'Consistent greeting semantics',strategic_alignment:'Predictable API behavior',context:{stack:'Node 22 ESM',patterns:'Pure functions',conventions:['Use named exports'],auth:'None'},exploration:'EXPL-cafe'};
  if(variant==='absent-lineage')delete product.exploration;
  write(project,productFile,YAML.stringify({product}));write(project,'docs/products/PROD-beef-unrelated.yaml',YAML.stringify({product:{...product,id:'PROD-beef',name:'Unrelated Product'}}));
  const intention={id:'INT-a1b2',product:'PROD-a1b2',statement:facts.statement,rationale:facts.rationale,priority:'medium',dependencies:[],expectations:[],owner:facts.owner,status:'defined',exploration:'EXPL-cafe'};
  if(stage==='define-expectations'||stage==='write-spec')write(project,intentionFile,YAML.stringify({intention}).replace('  expectations: []','  # before expectations: preserve this comment\n  expectations: [] # list suffix stays\n  # after expectations: preserve this comment'));
  const expectation={id:'EXP-a1b2',intention:'INT-a1b2',description:facts.description,validation_criteria:facts.validation,edge_cases:facts.edges,complexity:'low',owner:facts.owner,status:'ready',exploration:'EXPL-cafe'};
  if(stage==='write-spec') {write(project,expectationFile,YAML.stringify({expectation}));const f=path.join(project,intentionFile);fs.writeFileSync(f,fs.readFileSync(f,'utf8').replace('expectations: []','expectations: [EXP-a1b2]'));}
  const records=['INT-dead','EXP-dead','SPEC-dead'].map(id=>({id,type:id.startsWith('INT')?'intention':id.startsWith('EXP')?'expectation':'spec',title:'Reserved archived fixture'}));
  if(variant==='archived-parent'){fs.unlinkSync(path.join(project,productFile));records.push({id:'PROD-a1b2',type:'product',title:'Archived selected Product'});}
  write(project,'docs/idd-ledger.yaml',YAML.stringify({ledger:{records}}));
  if(variant==='malformed-parent')fs.appendFileSync(path.join(project,productFile),'  name: duplicate name\n');
  if(variant==='ambiguous-identity')fs.copyFileSync(path.join(project,productFile),path.join(project,'docs/products/PROD-a1b2-duplicate.yaml'));
  if(['parent-conflict','lineage-conflict','multi-intention-spec'].includes(variant)) {
    const other={...intention,id:'INT-b2c3',product:variant==='parent-conflict'?'PROD-beef':'PROD-a1b2',expectations:['EXP-b2c3'],exploration:variant==='lineage-conflict'?'EXPL-feed':'EXPL-cafe'};
    write(project,'docs/intentions/INT-b2c3-secondary.yaml',YAML.stringify({intention:other}));write(project,'docs/expectations/EXP-b2c3-secondary.yaml',YAML.stringify({expectation:{...expectation,id:'EXP-b2c3',intention:'INT-b2c3',exploration:other.exploration}}));
  }
  if(['partial-recovery','already-linked'].includes(variant)){write(project,'docs/expectations/EXP-b2c3-partial.yaml',YAML.stringify({expectation:{...expectation,id:'EXP-b2c3',status:'draft'}}));if(variant==='already-linked'){const f=path.join(project,intentionFile);fs.writeFileSync(f,fs.readFileSync(f,'utf8').replace('expectations: []','expectations: [EXP-b2c3]'));}}
  for(const args of [['init','-q'],['add','.'],['-c','user.name=IDD Fixture','-c','user.email=fixture@example.invalid','-c','commit.gpgsign=false','commit','-qm','authoring baseline']])runProcess('git',args,{cwd:project});
  fs.appendFileSync(path.join(project,'USER-NOTES.md'),'\nPre-existing dirty user decision: preserve this.\n');
  return authoringState(project,stage,variant);
}
export function authoringState(project,stage,variant){const before=snapshot(project,{excludeGit:true}),parents={};for(const p of Object.keys(before.entries).filter(p=>/^docs\/.+\.yaml$/.test(p)))parents[p]=fs.readFileSync(path.join(project,p),'utf8');return {stage,variant,before,parents,git:gitState(fs.realpathSync(project))};}
export function authoringPrompt(stage,variant,skillPath) {
  const selection=stage==='write-spec'?(['parent-conflict','lineage-conflict','multi-intention-spec'].includes(variant)?'EXP-a1b2 EXP-b2c3':'EXP-a1b2'):stage==='define-expectations'?'INT-a1b2':'PROD-a1b2';
  const base=`Use only the installed idd-${stage} skill at ${skillPath}, in this disposable project. Use the configured model. Stay in the main stakeholder conversation; no delegation. Use existing safe duplicate-key-rejecting YAML tooling if needed; do not install dependencies. Installed resources and pre-existing user edits are read-only. Keep baselines in process memory or captured tool output; do not write baseline/scratch files anywhere, especially generic /tmp paths. Capture original parent bytes/type/mode together with the first context parse, retain that binding, and rescan live/archive IDs or prove the complete scanned identity inventory is unchanged immediately before saving. Re-enumerate current artifact filenames rather than checking only filenames seen during the first scan. `;
  const context=`I select ${selection}. Confirmed context: Node 22 ESM, pure functions, named exports, no authentication, owner Casey Example. I confirm Intention statement ${JSON.stringify(facts.statement)}, rationale ${JSON.stringify(facts.rationale)}, priority medium, dependencies none. I confirm Expectation description ${JSON.stringify(facts.description)}, validation ${JSON.stringify(facts.validation)}, complexity low. `;
  const spec=`I confirm boundaries ${JSON.stringify(facts.boundaries)}, deliverables ${JSON.stringify(facts.deliverables)}, automated validation ${JSON.stringify(facts.automated)}, human review ${JSON.stringify(facts.human_review)}. Inherit the Product context; use only actual existing code refs. `;
  if(variant==='empty-selection')return base+'List available Products and help me select one. I have not chosen a Product and do not authorize artifact saving.';
  if(variant==='missing-confirmation')return base+context+'Propose candidate edge cases and explain how each differs from the happy path. I have not confirmed any edge cases or authorized saving yet.';
  if(['rejected-edge','accelerated-rejected-edge'].includes(variant))return base+context+spec+`I confirm only this edge: ${facts.edges[0]} I reject the other candidate. Propose a replacement for confirmation. Do not assume I have confirmed a replacement or save intermediate artifacts.`;
  if(['partial-recovery','already-linked'].includes(variant))return base+'Recover only the missing INT-a1b2 backlink to existing docs/expectations/EXP-b2c3-partial.yaml. I confirm this existing child content and its two edges. Do not create a new child or ID. If already linked, leave everything unchanged.';
  if(['parent-conflict','lineage-conflict','malformed-parent','ambiguous-identity','archived-parent'].includes(variant))return base+context+spec+'The selected parents are the source of truth; inspect their consistency before authoring. I have not resolved any parent or lineage conflict. Ask for repair/selection if needed; do not silently choose context.';
  return base+context+`I explicitly confirm both and only these two edge cases: ${JSON.stringify(facts.edges)}. `+spec+'All supplied content is confirmed; preserve the supplied confirmed strings exactly. Save only the requested draft artifacts now without asking again. This content confirmation is not human peer review or permission to mark a Spec ready.';
}
const refusalVariants=['missing-confirmation','rejected-edge','accelerated-rejected-edge','parent-conflict','lineage-conflict','malformed-parent','empty-selection','ambiguous-identity','archived-parent'];
export function outsideList(text) {const doc=YAML.parseDocument(text,{uniqueKeys:true});assert.equal(doc.errors.length,0);const node=doc.getIn(['intention','expectations'],true);assert.ok(node?.range);return text.slice(0,node.range[0])+'<OWNED-LIST>'+text.slice(node.range[1]);}
export function verifyAuthoring(project,state,transcript) {
  state={...state,before:{...state.before,entries:Object.assign(Object.create(null),state.before.entries)}};
  const after=snapshot(project,{excludeGit:true});assert.deepEqual(gitState(fs.realpathSync(project)),state.git,'Git state changed');assert.equal(after.rootMode,state.before.rootMode);
  const visible=visibleAssistantText(transcript);assert.ok(visible.trim(),'Missing visible host response');
  if(refusalVariants.includes(state.variant)) {
    assert.deepEqual(after,state.before,'Refusal/confirmation case wrote project files');
    const text=visible.replace(/[*`]/g,'');
    if(/(?:auth(?:entication)?|credential|API key|quota|rate limit|service|network|permission|YAML (?:tooling|parser))[^.\n]*(?:unavailable|expired|denied|failed|cannot|missing)|(?:cannot|unavailable|expired|denied|failed)[^.\n]*(?:auth(?:entication)?|credential|API key|service|network)/i.test(text)) {const error=Error('Host capability/auth/service failure is not a workflow refusal pass');error.code='HOST_BLOCKED';throw error;}
    const required={
      'missing-confirmation':[/confirm|approv/i,/\bedges?(?: cases?)?\b/i,/trim|padding/i,/null|blank|non.?string/i],
      'rejected-edge':[/replac/i,/(?:at least|minimum(?: of)?|needs?)\s*(?:two|2)\b/i,/\bedges?(?: cases?)?\b/i,/confirm|approv/i],
      'accelerated-rejected-edge':[/replac/i,/(?:at least|minimum(?: of)?|needs?)\s*(?:two|2)\b/i,/\bedges?(?: cases?)?\b/i,/confirm|approv/i],
      'parent-conflict':[/PROD-a1b2/,/PROD-beef/,/different|conflict|mismatch/i],
      'lineage-conflict':[/EXPL-cafe/,/EXPL-feed/,/lineage|exploration|conflict/i],
      'malformed-parent':[/duplicate.*(?:key|name)|(?:key|name).*duplicate/i,/YAML|Product|PROD-a1b2/i],
      'empty-selection':[/PROD-a1b2/,/PROD-beef/,/select|choose|which/i],
      'ambiguous-identity':[/PROD-a1b2/,/ambiguous|duplicate|multiple/i],
      'archived-parent':[/PROD-a1b2/,/archiv/i,/recover|restor|select/i]
    };
    for(const pattern of required[state.variant])assert.match(text,pattern,'Missing scenario-specific refusal/confirmation detail');
    if(state.variant==='missing-confirmation') {
      const numbered=[...text.matchAll(/(?:^|\n)\s*\d+[.)]\s/g)].length;
      const table=text.split('\n').filter(l=>/^\s*\|/.test(l)).map(l=>l.trim().slice(1,-1).split('|').map(c=>c.trim()));
      const tableCandidates=table.slice(2).filter(c=>c.length>=3&&c.every(Boolean)&&!c.every(v=>/^:?-+:?$/.test(v))).length;
      const bullets=text.split('\n').filter(l=>/^\s*[-+]\s/.test(l)&&/trim|padding|blank|null|non.?string|whitespace|input/i.test(l)&&/TypeError|return|throw|preserv/i.test(l)).length;
      assert.ok(Math.max(numbered,tableCandidates,bullets)>=2,'Expected at least two candidate edges');
    }
    assert.match(text,/\?|cannot|need|please|refus|blocked/i,'Missing meaningful question/refusal');return {outcome:'passed',changes:[]};
  }
  const recovery=['partial-recovery','already-linked'].includes(state.variant);const kinds=recovery?[]:state.stage==='define-intentions'?['intention']:state.stage==='define-expectations'?['expectation']:state.stage==='define-outcomes'?['intention','expectation']:state.stage==='quick-spec'?['intention','expectation','spec']:['spec'];
  const changes=Object.keys({...state.before.entries,...after.entries}).filter(p=>JSON.stringify(state.before.entries[p])!==JSON.stringify(after.entries[p]));
  const newFiles=changes.filter(p=>!state.before.entries[p]&&after.entries[p]?.kind==='file');assert.equal(newFiles.length,kinds.length,'Wrong output count');
  const outputs=new Map();for(const p of newFiles){const parsed=parseYAML(fs.readFileSync(path.join(project,p),'utf8'),p),kind=Object.keys(parsed)[0];assert.ok(kinds.includes(kind)&&Object.keys(parsed).length===1&&!outputs.has(kind),'Wrong/duplicate artifact kind');const v=validateArtifact(fs.readFileSync(path.join(project,p),'utf8'),{file:p,kind});assert.match(v.id,new RegExp(`^${kind==='intention'?'INT':kind==='expectation'?'EXP':'SPEC'}-[a-f0-9]{4,8}$`));assert.ok(!['INT-dead','EXP-dead','SPEC-dead','INT-a1b2','EXP-a1b2'].includes(v.id),'ID collision');assert.match(p,new RegExp(`^docs/${kind==='spec'?'specs':kind+'s'}/${v.id}(?:-[a-z0-9]+(?:-[a-z0-9]+)*)?\\.yaml$`),'Filename must preserve complete internal ID and optional descriptive slug');assert.equal(v.status,'draft');assert.equal(v.gap_check,undefined);assert.equal(v.peer_review,undefined);if(kind==='spec')assert.equal(v.owner,undefined);else assert.equal(v.owner,facts.owner);assert.equal(v.exploration,state.variant==='absent-lineage'?undefined:'EXPL-cafe');outputs.set(kind,v);}
  for(const p of changes){const before=state.before.entries[p],next=after.entries[p];if(before){assert.equal(next?.kind,before.kind);assert.equal(next?.mode,before.mode);assert.ok((state.stage==='define-expectations'||recovery)&&p===intentionFile,'Unowned existing write');assert.equal(outsideList(fs.readFileSync(path.join(project,p),'utf8')),outsideList(state.parents[p]),'Parent reformatted outside expectations list');}else assert.ok(newFiles.includes(p)||(next?.kind==='directory'&&newFiles.some(f=>f.startsWith(p+'/'))),'Unowned new path');assert.notEqual(next?.kind,'symlink');}
  if(recovery){const parent=parseYAML(fs.readFileSync(path.join(project,intentionFile),'utf8')).intention;assert.deepEqual(parent.expectations,['EXP-b2c3']);if(state.variant==='already-linked')assert.deepEqual(changes,[]);return {outcome:'passed',changes};}
  const intention=outputs.get('intention'),expectation=outputs.get('expectation'),spec=outputs.get('spec');
  if(intention){assert.equal(intention.product,'PROD-a1b2');assert.equal(intention.statement,facts.statement);assert.equal(intention.rationale,facts.rationale);assert.equal(intention.priority,'medium');assert.deepEqual(intention.dependencies,[]);assert.deepEqual(intention.expectations,expectation?[expectation.id]:[]);}
  if(expectation){assert.equal(expectation.intention,intention?.id??'INT-a1b2');assert.equal(expectation.description,facts.description);assert.equal(expectation.validation_criteria,facts.validation);assert.deepEqual(expectation.edge_cases,facts.edges);assert.equal(expectation.complexity,'low');if(!intention)assert.deepEqual(parseYAML(fs.readFileSync(path.join(project,intentionFile),'utf8')).intention.expectations,[expectation.id]);}
  if(spec){const selected=state.variant==='multi-intention-spec'?['EXP-a1b2','EXP-b2c3']:[expectation?.id??'EXP-a1b2'];assert.equal(spec.product,'PROD-a1b2');assert.deepEqual([...spec.expectations].sort(),selected.sort());assert.deepEqual([...spec.intentions].sort(),state.variant==='multi-intention-spec'?['INT-a1b2','INT-b2c3']:[intention?.id??'INT-a1b2']);assert.deepEqual(spec.boundaries,facts.boundaries);assert.deepEqual(spec.deliverables,facts.deliverables);assert.deepEqual(spec.validation.automated,facts.automated);assert.deepEqual(spec.validation.human_review,facts.human_review);assert.equal(spec.expectations_detail.length,selected.length);for(const detail of spec.expectations_detail){assert.ok(selected.includes(detail.id));assert.equal(detail.description,expectation?.description??facts.description);assert.equal(detail.validation,expectation?.validation_criteria??facts.validation);assert.deepEqual(detail.edge_cases,facts.edges);}assert.match(spec.context.stack,/Node.*22.*ESM/i);assert.match(spec.context.patterns,/pure.*function/i);assert.match(spec.context.auth,/none|no auth/i);assert.match(spec.context.conventions.join(' '),/named exports/i);assert.ok(Array.isArray(spec.context.existing_code_refs));for(const ref of spec.context.existing_code_refs){assert.ok(state.before.entries[ref.path],`Nonexistent code ref ${ref.path}`);}validateArtifact(YAML.stringify({spec:{...spec,status:'ready'}}));}
  return {outcome:'passed',changes};
}

export function verifyConcurrentOutcome(project,{phase,interference,child,id,candidate,report}) {
  assert.ok(['preflight','late'].includes(phase));assert.ok(report&&report.reason==='parent-changed','Missing parent-change partial report');assert.equal(report.parent,intentionFile);
  assert.deepEqual(report.written,phase==='late'?[{path:child,id}]:[],'Incorrect written paths/IDs');
  assert.deepEqual(report.remaining,phase==='late'?[{path:intentionFile,operation:'append-expectation',id}]:[{path:child,operation:'create',id},{path:intentionFile,operation:'append-expectation',id}],'Incorrect remaining recovery operations');
  const actual=snapshot(project,{excludeGit:true}),expected={...interference,entries:Object.assign(Object.create(null),interference.entries)};
  if(phase==='late') {
    const parsed=validateArtifact(candidate,{kind:'expectation'});assert.equal(parsed.id,id);assert.equal(parsed.intention,'INT-a1b2');assert.equal(parsed.status,'draft');
    assert.equal(fs.readFileSync(path.join(project,child),'utf8'),candidate,'Written child changed or removed');expected.entries[child]={kind:'file',mode:0o644,links:1,hash:hash(candidate)};
    const directory=path.posix.dirname(child);if(!expected.entries[directory])expected.entries[directory]={kind:'directory',mode:0o755};
  }
  assert.deepEqual(actual,expected,'Concurrent parent or other final state was overwritten');return true;
}
