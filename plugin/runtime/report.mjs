// SPDX-License-Identifier: Apache-2.0
import assert from 'node:assert/strict';
export function verifyReport(text,spec,filename) {
  text=text.replace(/\r\n/g,'\n');
  const headings=['Header','Boundaries Acknowledged','Self-Verification Table','Deliverables Produced','spec_gaps_encountered','Follow-Ups'];
  const found=[...text.matchAll(/^## (.+?)\s*$/gm)].map(m=>m[1]);assert.deepEqual(found,headings,'Missing, duplicated or out-of-order report headings');
  const sections=Object.fromEntries(headings.map(h=>[h,text.split(`## ${h}\n`)[1]?.split(/^## /m)[0]]));
  for(const h of headings)assert.ok(sections[h]?.trim(),`Empty report section: ${h}`);
  const date=filename.match(/-(\d{4})(\d{2})(\d{2})T\d{6}Z-execution\.md$/);assert.ok(date,'Invalid report timestamp');
  assert.ok(sections.Header.includes(spec.id)&&sections.Header.includes(`${date[1]}-${date[2]}-${date[3]}`),'Header ID/date mismatch');
  for(const boundary of spec.boundaries)assert.ok(sections['Boundaries Acknowledged'].includes(boundary),'Missing report Boundary quote');
  const labels=[...spec.expectations_detail.flatMap(e=>e.edge_cases.map((_,i)=>`${e.id} edge case ${i+1}`)),...spec.boundaries.map((_,i)=>`Boundary #${i+1}`),...spec.deliverables.map((_,i)=>`Deliverable #${i+1}`),...spec.validation.automated.map((_,i)=>`Automated check #${i+1}`)];
  const rows=sections['Self-Verification Table'].split('\n').filter(l=>/^\s*\|/.test(l)).map(l=>l.trim().slice(1,-1).split('|').map(c=>c.trim().replace(/\*\*|`/g,'')));
  for(const label of labels){const matches=rows.filter(r=>r[0]===label);assert.equal(matches.length,1,`Missing/duplicate report row: ${label}`);assert.equal(matches[0][1],'pass',`Unfinished report row: ${label}`);assert.ok(matches[0][2]?.trim(),`Missing evidence: ${label}`);}
  const gaps=sections.spec_gaps_encountered.replace(/[*`"']/g,'');assert.doesNotMatch(gaps,/\bseverity\s*:\s*blocker(?:-grade)?\b/i,'Blocker-grade execution gap requires author recovery');
  return true;
}
