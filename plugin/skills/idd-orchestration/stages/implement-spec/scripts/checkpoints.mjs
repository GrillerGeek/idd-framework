// SPDX-License-Identifier: Apache-2.0
import assert from 'node:assert/strict';
const readTools=['Read','Glob','Grep'];
const buildTools=[...readTools,'Write','Edit','Bash'];
const cleanText=text=>text.replace(/\r\n/g,'\n');
export function checkpointInvocation(base,{sessionId,phase,model}) {
  assert.ok(['orchestration','implementation','build'].includes(phase));
  const args=base.args.filter(arg=>arg!=='--no-session-persistence');
  const tools=phase==='build'?buildTools:readTools;
  const allowed=args.indexOf('--allowedTools');
  assert.ok(allowed>=0,'Missing explicit allowed tools');args[allowed+1]=tools.join(',');
  args.push('--tools',tools.join(','),'--disable-slash-commands');
  args.push(phase==='orchestration'?'--session-id':'--resume',sessionId);
  if(phase!=='orchestration') {assert.ok(model,'Missing observed initial model');args.push('--model',model);}
  return {...base,args};
}
export function phaseEvidence(run,{sessionId,phase,model,outputStyle}) {
  assert.equal(run.reason,null,`Host execution blocked: ${run.reason}`);
  assert.equal(run.code,0,`Host execution blocked: exit ${run.code}`);
  const events=run.stdout.trim().split('\n').map(line=>JSON.parse(line));
  const inits=events.filter(e=>e.type==='system'&&e.subtype==='init');
  const results=events.filter(e=>e.type==='result');
  assert.equal(inits.length,1,'Missing/duplicate init');assert.equal(results.length,1,'Missing/duplicate result');
  const init=inits[0],result=results[0];
  assert.equal(init.session_id,sessionId,'Changed init session identity');assert.equal(result.session_id,sessionId,'Changed result session identity');
  assert.equal(result.is_error,false,'Host returned an error');
  assert.ok(typeof init.model==='string'&&init.model,'Missing observed model');
  if(model)assert.equal(init.model,model,'Resume changed configured model');
  assert.ok(typeof init.output_style==='string'&&init.output_style,'Missing observed output style');
  if(outputStyle)assert.equal(init.output_style,outputStyle,'Resume changed configured output style');
  const allowed=phase==='build'?buildTools:readTools;
  assert.ok(Array.isArray(init.tools),'Missing exposed tool evidence');
  assert.deepEqual(init.tools.filter(t=>!allowed.includes(t)),[],'Unexpected exposed tools');
  const messages=[];
  for(const event of events)if(event.type==='assistant') {
    assert.ok(!event.parent_tool_use_id,'Unexpected delegation in sequential checkpoint');
    for(const block of event.message?.content??[]) {
      if(block.type==='tool_use')assert.ok(allowed.includes(block.name),`Unexpected tool call: ${block.name}`);
      if(block.type==='text')messages.push(block.text??'');
    }
  }
  assert.ok(typeof result.result==='string'&&result.result.trim(),'Missing final assistant response');
  assert.ok(messages.includes(result.result),'Final response has no matching visible assistant message');
  return {model:init.model,outputStyle:init.output_style,sessionId,text:result.result};
}
export function validateAcknowledgment(text,role,boundaries) {
  // Validate the current phase's final assistant message, never result echoes or prior phases.
  let remaining=cleanText(text).trim();
  assert.doesNotMatch(remaining,/```/,'Acknowledgment cannot be a fenced example');
  const heading=new RegExp('^(?:#{1,6}\\s+|\\*\\*)?Boundaries Acknowledged — '+role+'(?:\\*\\*)?\\s*\\n');
  const matched=heading.exec(remaining);
  assert.ok(matched,'Missing role-specific acknowledgment heading at start');
  remaining=remaining.slice(matched[0].length).trimStart();
  for(const [index,boundary] of boundaries.entries()) {
    const block=new RegExp('^(?:'+(index+1)+'[.)]\\s+|Boundary #'+(index+1)+'\\s*\\n)').exec(remaining);
    assert.ok(block,`Missing indexed Boundary block #${index+1}`);
    remaining=remaining.slice(block[0].length);
    assert.ok(remaining.startsWith(boundary),`Missing verbatim Boundary #${index+1}`);
    remaining=remaining.slice(boundary.length);
    if(role==='implementation') {
      const meaning=/^\s*\n\s*Meaning: *([^\n]+)/.exec(remaining);
      assert.ok(meaning?.[1].trim(),`Missing Boundary #${index+1} comprehension paraphrase`);
      remaining=remaining.slice(meaning[0].length);
    }
    remaining=remaining.trimStart();
  }
  assert.equal(remaining,'','Unexpected text outside acknowledgment blocks');
}
