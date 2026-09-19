// SPDX-License-Identifier: Apache-2.0
// Acceptance fixtures and oracles, not a production implementation of review.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import YAML from 'yaml';
import {root,write} from './workspace.mjs';
import {parseYAML} from '../../scripts/lib/yaml.mjs';
import {runProcess} from '../../scripts/lib/process.mjs';
import {snapshot,gitState} from '../../plugin/runtime/snapshot.mjs';
import {visibleAssistantText} from './pilot.mjs';
export const stages=['tech-review','deep-review','review-spec'];
export const variants=['happy','contradiction','broken','empty','ambiguous','malformed'];
export const specFile='docs/specs/SPEC-a1b2-greeting.yaml';
export const reportFor=stage=>`docs/reviews/SPEC-a1b2-${stage==='deep-review'?'deep-review':'review'}.md`;
export function setupReview(project,stage,variant='happy') {
  assert.ok(stages.includes(stage)&&variants.includes(variant));
  write(project,'package.json',JSON.stringify({name:'review-fixture',private:true,type:'module'})+'\n');
  write(project,'USER-NOTES.md','Existing user note, preserve bytes.\n');
  write(project,'src/greet.mjs',variant==='contradiction'?"export function greet() { return 'Legacy'; }\n":variant==='broken'?"export function greet() { return 'Wrong'; }\n":fs.readFileSync(path.join(root,'tests/fixtures/review-workflows/greet.mjs')));
  write(project,'tests/greet.test.mjs',fs.readFileSync(path.join(root,'tests/fixtures/review-workflows/greet.test.mjs')));
  const exp={id:'EXP-a1b2',intention:'INT-a1b2',description:'Callers receive Hello, <trimmed name>! for valid names; invalid input throws TypeError.',validation_criteria:'greet("Ada") and greet("  Ada  ") return "Hello, Ada!"; blank and nonstring inputs throw TypeError.',edge_cases:['Leading and trailing padding is trimmed.','Blank and nonstring input throws TypeError.'],complexity:'low',owner:'Casey Example',status:'specced'};
  const context={stack:'Node 22 ESM',patterns:'Pure functions',conventions:['Named exports'],auth:'No authentication',existing_code_refs:[{path:'src/greet.mjs',note:'Existing greeting implementation to review or replace to satisfy required behavior.'}]};
  write(project,'docs/products/PROD-a1b2-library.yaml',YAML.stringify({product:{id:'PROD-a1b2',name:'Greeting Library',status:'active',owner:'Casey Example',problem_statement:'Duplicated greeting behavior',target_audience:'Library callers',value_proposition:'Consistent formatting',strategic_alignment:'Predictable library APIs',context}}));
  write(project,'docs/intentions/INT-a1b2-greeting.yaml',YAML.stringify({intention:{id:'INT-a1b2',product:'PROD-a1b2',statement:'Callers receive predictable greetings',rationale:'Consistent formatting',priority:'medium',dependencies:[],expectations:['EXP-a1b2'],owner:'Casey Example',status:'defined'}}));
  write(project,'docs/expectations/EXP-a1b2-greeting.yaml',YAML.stringify({expectation:exp}));
  const spec={id:'SPEC-a1b2',product:'PROD-a1b2',intentions:['INT-a1b2'],expectations:['EXP-a1b2'],status:stage==='review-spec'?'review':'draft',context,expectations_detail:[{id:exp.id,description:exp.description,validation:exp.validation_criteria,edge_cases:exp.edge_cases}],boundaries:['Do not modify USER-NOTES.md.','Do not add dependencies.',...(variant==='contradiction'?['Do not modify src/greet.mjs.']:[])],deliverables:['src/greet.mjs','tests/greet.test.mjs'],validation:{automated:['node --test tests/greet.test.mjs'],human_review:['Review greeting wording.']},gap_check:{status:'passed',blockers:0,warnings:0,report:'docs/reviews/SPEC-a1b2-gap-check.md',date:'2026-01-01'},review:{reviewer:'Old Reviewer',date:'2026-01-01',status:'approved',findings:[{severity:'suggestion',block:'context',description:'OLD-REVIEW-MARKER',recommendation:'Historical only'}]}};
  let specText='# User header: preserve exactly.\n'+YAML.stringify({spec},{lineWidth:100})+'  # User trailing comment: preserve exactly.\n';
  if(variant==='malformed')specText=specText.replace('  id: SPEC-a1b2\n','  id: SPEC-a1b2\n  id: SPEC-ffff\n');
  write(project,specFile,specText);if(variant==='ambiguous')write(project,'docs/specs/SPEC-a1b2-other.yaml',specText);
  write(project,'docs/reviews/SPEC-a1b2-gap-check.md','Historical passed fixture gate.\n\n## Coverage\nNo fixture omissions.\n');
  write(project,reportFor('deep-review'),'OLD-DEEP-REPORT\n');write(project,reportFor('review-spec'),'OLD-VALIDATION-REPORT\n');
  runProcess('git',['init','-q'],{cwd:project});runProcess('git',['add','.'],{cwd:project});runProcess('git',['-c','user.name=IDD Fixture','-c','user.email=fixture@example.invalid','-c','commit.gpgsign=false','commit','-qm','Review fixture baseline'],{cwd:project});fs.appendFileSync(path.join(project,'USER-NOTES.md'),'Dirty user decision.\n');return reviewState(project,stage,variant);
}
export function reviewState(project,stage,variant) {return {stage,variant,allowedDates:[new Date().toISOString().slice(0,10),new Intl.DateTimeFormat('en-CA').format(new Date())],specText:fs.readFileSync(path.join(project,specFile),'utf8'),before:snapshot(project,{excludeGit:true}),git:gitState(fs.realpathSync(project))};}
export function reviewPrompt(stage,variant,skill,{python}={}) {
  const base=(python?`Verified existing Python with PyYAML: ${JSON.stringify(python)}. Use this existing interpreter for safe parsing; no installation is needed. `:'')+`Use only the installed idd-${stage} skill at ${skill}. Review this disposable project with the configured model. Follow the full procedure, including original-context binding at first parse, full byte/type/mode preservation, no scratch files anywhere, current evidence and orchestration ownership. Use existing Python with a duplicate-key-rejecting loader when necessary; install no dependencies. At first context capture, emit the original date-safe byte/hash/type/mode baseline before YAML parsing or parsed-value serialization can fail. Use SHA-256 hashes for unowned-file byte comparisons; retain original text where needed for context and localized edits. Avoid repeatedly embedding full installed-resource contents in scripts. Raw snapshots contain no date objects; if exporting parsed YAML use safe date conversion. Retain the original baseline rather than recapturing after losing it. Use self-contained tool commands with full script bodies visible in the captured transcript; do not use an interactive REPL or hidden stdin for review, mutation or verification. No native subagent dispatch is available in this bounded case; use and truthfully label sequential phases/perspectives. `;
  if(variant==='empty')return base+'List eligible Specs and ask me to select one; I have not selected a Spec.';
  return base+'Review SPEC-a1b2. The existing annotation and reports are historical setup, not current results. No actual human wording review or human peer review is supplied, and no reliable historical implementation baseline is supplied. Current-review snapshots cannot establish prior implementation preservation. Do not ask again for selection; complete the selected review and preserve every unowned file. Use only the explicitly specified existing local test command for automated execution, bounded to 60 seconds/1 MiB. For technical/deep review, visibly report all ten mechanical checklist results and human pending; replace only the review annotation, preserving comments and all outside bytes. For validation, report every original item and edge with evidence/confidence and leave the entire Spec/code unchanged.';
}
export function outsideReview(text) {const doc=YAML.parseDocument(text,{uniqueKeys:true});assert.equal(doc.errors.length,0,'Malformed Spec');const node=doc.getIn(['spec','review'],true);assert.ok(node?.range);return text.slice(0,node.range[0])+'<OWNED-REVIEW>'+text.slice(node.range[1]);}
export function verifyPerspectives(receipts,approach) {
  const names=['Architecture','Boundaries & Edge Cases','Deliverables & Validation'];assert.equal(receipts.length,3);assert.deepEqual(receipts.map(r=>r.name).sort(),names.sort());
  for(const r of receipts)assert.ok(r.completed===true&&r.evidence?.trim()&&['worker','local'].includes(r.by),'Incomplete perspective');
  if(approach==='Parallel dispatch')assert.ok(receipts.every(r=>r.by==='worker'&&!r.failed));
  else if(approach==='Sequential fallback — dispatch unavailable')assert.ok(receipts.every(r=>r.by==='local'&&!r.failed));
  else {assert.match(approach,/^Parallel dispatch with partial degradation — .+ self-reviewed$/);const failed=receipts.filter(r=>r.failed);assert.ok(failed.length&&receipts.some(r=>r.by==='worker'));for(const r of failed)assert.ok(r.by==='local'&&approach.includes(r.name));assert.ok(receipts.every(r=>r.by==='worker'||r.failed));}return true;
}
function sections(text,headings) {text=text.replace(/\r\n/g,'\n');const matches=[...text.matchAll(/^## ([^\n]+?)\s*$/gm)];assert.deepEqual(matches.map(m=>m[1]),headings,'Missing/duplicate report headings');return Object.fromEntries(matches.map((m,i)=>[m[1],text.slice(m.index+m[0].length,matches[i+1]?.index??text.length)]));}
const clean=t=>t.replace(/[*`]/g,'');
function row(text,label,statuses) {
 const rows=text.split('\n').filter(l=>/^\s*\|/.test(l)).map(l=>l.trim().slice(1,-1).split(/(?<!\\)\|/).map(c=>clean(c.trim()).replaceAll('\\|','|'))),header=rows[0]??[];
 const statusColumn=header.findIndex(c=>/^(?:status|result)$/i.test(c)),confidenceColumn=header.findIndex(c=>/^confidence(?: level)?$/i.test(c)),evidenceColumn=header.findIndex(c=>/\b(?:evidence|notes|output)\b/i.test(c));
 assert.ok(statusColumn>0&&confidenceColumn>0&&evidenceColumn>0,'Missing dedicated result/evidence/confidence columns');
 const found=rows.slice(2).filter(r=>r[0]===label);assert.equal(found.length,1,`Missing/duplicate row ${label}`);const r=found[0];assert.equal(r.length,header.length);assert.ok(statuses.includes(r[statusColumn]),`Wrong status for ${label}`);assert.ok(/^(?:High|Medium|Low)(?:$|[ :—–-])/.test(r[confidenceColumn]),`Missing confidence for ${label}`);assert.ok(r[evidenceColumn].trim().length>2,`Missing evidence for ${label}`);if(r[statusColumn]==='Unverified')assert.match(r[confidenceColumn],/^Low(?:$|[ :—–-])/);r.status=r[statusColumn];return r;
}
function checklist(text) {
 text=clean(text);const heading=/^#{1,6} +[^\n]*(?:checklist|completeness)[^\n]*$/im.exec(text);if(heading){const rest=text.slice(heading.index+heading[0].length);const next=/^#{1,6} +/m.exec(rest);text=rest.slice(0,next?.index??rest.length);}
 const lines=clean(text).split('\n'),used=new Set();const concepts=[/stack/i,/patterns?/i,/conventions?/i,/auth/i,/(?:link|least|one).*(?:expectation)|expectation.*(?:link|least|one)/i,/validation criteria|validat.*expectation|expectation.*validat/i,/edge/i,/boundar/i,/deliverable/i,/automated.*human|human.*automated/i];
 for(let i=0;i<10;i++){const number=new RegExp('^\\s*(?:\\|\\s*)?'+(i+1)+'(?:[.)]|\\s*\\|)');const numbered=lines.filter(l=>number.test(l));const candidates=numbered.length?numbered:lines.filter(l=>concepts[i].test(l)&&/\bpass(?:ed)?\b|\[x\]/i.test(l));assert.equal(candidates.length,1,`Missing/duplicate checklist item ${i+1}`);assert.match(candidates[0],/\bpass(?:ed)?\b|\[x\]/i);assert.ok(!used.has(candidates[0]),'Checklist reuses a result for multiple items');used.add(candidates[0]);}
}
function currentDate(text,state){assert.ok(state.allowedDates.some(date=>text.includes(date)),'Missing invocation-date evidence');}
function summarySegment(text,label) {
 const match=new RegExp('\\b'+label+'\\s*:?\\s*(?=\\d)','i').exec(text);assert.ok(match,'Missing '+label+' count');const rest=text.slice(match.index);return rest.split(/\n|;|\b(?:Boundaries|Deliverables|Automated Validation|Human Review)\b/).find(p=>p.trim())??rest;
}
function summaryCount(text,label,count,total) {
 if(label==='Expectations'&&count===0&&/1 linked Expectation \(1 Fail\), 2 original edge cases \(2 Fail\)/i.test(text)&&/Expectation table totals: 0 Pass, 0 Partial, 3 Fail, 0 Unverified/i.test(text))return;
 if(label==='Deliverables'&&count===1&&/2 Deliverables \(1 Present, 1 Incomplete\)/i.test(text))return;
 if(label==='Expectations'&&count===1&&/1\s*\/\s*1 linked Expectation Pass\s*;\s*2\s*\/\s*2 edge cases Pass/i.test(text))return;
 if(label==='Expectations'&&count===0&&/1 linked Expectation failed;\s*its 2 original edges failed\s*\(3 assessed rows: 0 Pass, 0 Partial, 3 Fail, 0 Unverified\)/i.test(text))return;
 if(label==='Deliverables'&&new RegExp('\\b'+count+'\\s*/\\s*'+total+' Deliverables Present\\b','i').test(text))return;
 if(label==='Deliverables'&&count===1&&/Of 2 Deliverables, 1 is Present and 1 Incomplete\s*\(0 Missing, 0 Unverified\)/i.test(text))return;
 let line=summarySegment(text,label);if(label==='Deliverables'){const m=/\bDeliverables\s*:?\s*(?=\d)/i.exec(text);line=text.slice(m.index).split(/\n|;/)[0];}
 if(new RegExp('\\b'+count+'\\s*\\/\\s*'+total+'\\b').test(line))return;
 if(label==='Expectations'){
  const scoped=/3 rows?\s*\(1 Expectation,?\s*2 edge cases?\)/i.test(line)||new RegExp('Expectations\\s*:?\\s*1\\s+'+(count?'Pass':'Fail')+'\\s*\\+\\s*2 edge cases\\s+'+(count?'Pass':'Fail')+'\\s*\\(3 rows','i').test(line);
  assert.ok(scoped,'Missing explicit expectation/edge row-count scope');const breakdown=line.slice(line.search(/3 rows/i));for(const [name,value]of [['Pass',count?3:0],['Partial',0],['Fail',count?0:3],['Unverified',0]])assert.match(breakdown,new RegExp('\\b'+value+'\\s+'+name+'\\b','i'),'Wrong Expectations '+name+' count');
 }else {for(const [name,value]of [['Present',count],['Incomplete',total-count],['Missing',0],['Unverified',0]])assert.match(line,new RegExp('\\b'+value+'\\s+'+name+'\\b','i'),'Wrong Deliverables '+name+' count');}
}
export function verifyReview(project,state,transcript) {
  const before={...state.before,entries:Object.assign(Object.create(null),state.before.entries)},after=snapshot(project,{excludeGit:true});assert.equal(after.rootMode,before.rootMode);assert.deepEqual(gitState(fs.realpathSync(project)),state.git,'Git state changed');const visible=clean(visibleAssistantText(transcript));assert.ok(visible.trim(),'Missing visible response');
  const changes=Object.keys({...before.entries,...after.entries}).filter(p=>JSON.stringify(before.entries[p])!==JSON.stringify(after.entries[p]));
  if(['empty','ambiguous','malformed'].includes(state.variant)){assert.deepEqual(changes,[],'Selection refusal wrote files');if(/unavailable|auth(?:entication)?[^.\n]*(?:fail|denied|expired)|cannot[^.\n]*pars|parser[^.\n]*(?:missing|fail)/i.test(visible)){const error=Error('Operational failure is not a selection refusal');error.code='HOST_BLOCKED';throw error;}const reason={empty:/select|choos|which/i,ambiguous:/ambiguous|multiple|duplicate.*(?:identit|ID|file)/i,malformed:/duplicate.*key|malformed.*YAML|YAML.*malformed/i};assert.match(visible,reason[state.variant]);assert.match(visible,/SPEC-a1b2/);return {outcome:'passed',changes};}
  const owned=state.stage==='tech-review'?[specFile]:state.stage==='deep-review'?[specFile,reportFor(state.stage)]:[reportFor(state.stage)];
  assert.deepEqual(changes.sort(),owned.sort(),'Wrong output set');for(const p of changes){assert.equal(after.entries[p]?.kind,'file');assert.equal(after.entries[p].mode,before.entries[p].mode);assert.equal(after.entries[p].links,1);}
  const original=parseYAML(state.specText).spec,nowText=fs.readFileSync(path.join(project,specFile),'utf8'),now=parseYAML(nowText).spec;
  if(state.stage!=='review-spec') {
    assert.equal(outsideReview(nowText),outsideReview(state.specText),'Unowned Spec bytes changed');const review=now.review;assert.deepEqual(Object.keys(review).sort(),['reviewer','date','status','findings'].sort());assert.ok(review.reviewer&&review.reviewer!=='Old Reviewer');assert.match(review.date,/^\d{4}-\d{2}-\d{2}$/);assert.ok(state.allowedDates.includes(review.date),'Review date is not from this invocation');assert.ok(Array.isArray(review.findings));assert.doesNotMatch(JSON.stringify(review),/OLD-REVIEW-MARKER|operationally incomplete|rerun the interrupted/i,'Stale/incomplete review');
    for(const f of review.findings){assert.ok(['blocker','warning','suggestion'].includes(f.severity));assert.ok(['context','expectations','boundaries','deliverables','validation'].includes(f.block));assert.ok(f.description?.trim()&&f.recommendation?.trim());}
    if(state.variant==='contradiction'){assert.ok(['needs-changes','rejected'].includes(review.status));assert.ok(review.findings.some(f=>f.severity==='blocker'&&/src\/greet\.mjs/.test(f.description)&&/boundar|forbid|modif/i.test(f.description)));}
    else {assert.equal(review.status,'approved');assert.ok(review.findings.every(f=>f.severity!=='blocker'));}
    assert.match(visible,/human[\s\S]{0,100}pending|pending[\s\S]{0,100}human/i);
    if(state.stage==='tech-review')checklist(visible);
    if(state.stage==='deep-review'){const report=clean(fs.readFileSync(path.join(project,reportFor(state.stage)),'utf8'));const s=sections(report,['Summary','Architecture Findings','Boundaries & Edge Case Findings','Deliverables & Validation Findings','Completeness Checklist Results','Recommendation']);assert.match(s.Summary,/SPEC-a1b2/);currentDate(s.Summary,state);assert.match(s.Summary,/Sequential fallback\s*[—–-]\s*dispatch unavailable/i);assert.match(s.Summary,/10\s*\/\s*10/);assert.match(s.Summary,/human[\s\S]{0,80}pending|pending[\s\S]{0,80}human/i);assert.match(s.Summary,/Approved/);for(const h of ['Architecture Findings','Boundaries & Edge Case Findings','Deliverables & Validation Findings'])assert.ok(s[h].trim().length>30);checklist(s['Completeness Checklist Results']);}
    return {outcome:'passed',changes};
  }
  assert.equal(nowText,state.specText);const report=clean(fs.readFileSync(path.join(project,reportFor(state.stage)),'utf8'));const s=sections(report,['Summary','Expectation Results','Boundary Results','Deliverable Results','Automated Validation','Human Review Required','Recommendations']);assert.match(s.Summary,/SPEC-a1b2/);currentDate(s.Summary,state);assert.match(s.Summary,state.variant==='broken'?/Overall Status:\s*Fail/i:/Overall Status:\s*Needs Changes/i);
  for(const [i,label]of ['EXP-a1b2','EXP-a1b2 edge case 1','EXP-a1b2 edge case 2'].entries())row(s['Expectation Results'],label,state.variant==='broken'?['Fail']:['Pass']);
  row(s['Boundary Results'],original.boundaries[0],['Unverified']);row(s['Boundary Results'],original.boundaries[1],['Clean','Unverified']);assert.match(s['Boundary Results'],/historical|baseline|prior/i);const deliverableRows=original.deliverables.map(label=>row(s['Deliverable Results'],label,['Present','Incomplete']));summaryCount(s.Summary,'Expectations',state.variant==='broken'?0:1,1);summaryCount(s.Summary,'Deliverables',deliverableRows.filter(r=>r.status==='Present').length,2);const boundaryRows=original.boundaries.map(label=>row(s['Boundary Results'],label,['Clean','Unverified']));const boundarySummary=s.Summary.split('\n').find(l=>/Boundaries/i.test(l));assert.ok(boundarySummary,'Missing Boundary counts');for(const status of ['Clean','Violation','Unverified']){if(boundaryRows.every(r=>r.status==='Unverified')&&/2 Boundaries \(2 Unverified\)/i.test(boundarySummary))continue;const count=boundaryRows.filter(r=>r.status===status).length;assert.match(boundarySummary,new RegExp('(?:\\b'+count+'\\s*(?:/\\s*2\\s*)?(?:Boundaries\\s*)?'+status+'s?\\b|\\b'+status+'s?\\s*:\\s*'+count+'\\b)','i'),'Wrong Boundary '+status+' count');}
  row(s['Automated Validation'],original.validation.automated[0],state.variant==='broken'?['Fail']:['Pass']);assert.match(s['Automated Validation'],state.variant==='broken'?/exit[^\n]*1|fail[^\n]*3|3[^\n]*fail|ERR_ASSERTION/i:/exit[^\n]*0|pass[^\n]*3|3[^\n]*pass/i);
  assert.match(s['Human Review Required'],/Review greeting wording\./);assert.match(s['Human Review Required'],/pending|\[ \]/i);assert.match(report,/High/);assert.match(s['Boundary Results'],/Low/);return {outcome:'passed',changes};
}
