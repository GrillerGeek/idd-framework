// SPDX-License-Identifier: Apache-2.0
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {fileURLToPath} from 'node:url';
import {sha256} from './lib/files.mjs';
import {repositoryRoot,assemble} from './build-skills.mjs';
import {runCheckpoint} from './lib/claude-checkpoint.mjs';
import {installLocal} from './test-install.mjs';
import {scenarios,skillFor,setupScenario,projectSnapshot,scenarioPrompt,verifyScenario,runHost} from '../tests/helpers/pilot.mjs';

export {runHost} from '../tests/helpers/pilot.mjs';
export function hostInvocation(host,prompt,project,outputStyle='configured') {
  if(!['configured','default'].includes(outputStyle) || (host!=='claude' && outputStyle!=='configured'))throw Error('Output-style isolation requires Claude and configured|default');
  if(host==='codex')return {command:'codex',args:['exec','--ephemeral','--skip-git-repo-check','--sandbox','workspace-write','--cd',project,'--json','-'],input:prompt};
  if(host==='claude')return {command:'claude',args:['-p','--no-session-persistence','--setting-sources','user,project','--settings',JSON.stringify({disableAllHooks:true,...(outputStyle==='default'?{outputStyle:'Default'}:{})}),'--strict-mcp-config','--mcp-config','{"mcpServers":{}}','--permission-mode','acceptEdits','--allowedTools','Read,Write,Edit,Glob,Grep,Bash','--output-format','stream-json','--verbose','--forward-subagent-text'],input:prompt};
  throw Error('Expected --host codex or claude');
}
export async function evaluatePilot({host,scenario,output,'claude-output-style':outputStyle='configured','claude-checkpoint':checkpoint='direct'}) {
  if(!['codex','claude'].includes(host)||!scenarios.includes(scenario))throw Error('Use --host codex|claude --scenario '+scenarios.join('|')+' [--output <evidence-parent>]');
  if(!['direct','staged'].includes(checkpoint)||(checkpoint==='staged'&&(host!=='claude'||!scenario.startsWith('implement-'))))throw Error('Staged checkpoint requires Claude implement-clean|implement-refuse');
  hostInvocation(host,'','',outputStyle); // Validate optional isolation before creating temporary files.
  const owned=fs.mkdtempSync(path.join(os.tmpdir(),'idd host pilot '));
  const project=path.join(owned,'project with spaces');fs.mkdirSync(project);
  let evidence=owned;
  if(output){fs.mkdirSync(path.resolve(output),{recursive:true});evidence=fs.mkdtempSync(path.join(path.resolve(output),`${host}-${scenario}-`));}
  const result={host,scenario,date:new Date().toISOString(),outcome:'blocked',evidence,checks:[],limitations:['Automatic checks do not certify transcript ordering, complete semantic review quality or human approval.']};
  if(host==='claude'){result.outputStyle=outputStyle;result.checkpoint=checkpoint;}
  try {
    const version=await runHost(host==='codex'?'codex':'claude',['--version'],{cwd:project,timeout:15000,maxBytes:10000});result.version=version.stdout.trim();
    if(version.code!==0||version.reason)throw Error(`Host unavailable: ${version.reason??version.stderr}`);
    assemble(repositoryRoot,{check:true});
    const state=setupScenario(project,scenario),skill=skillFor(scenario);
    installLocal(path.join(repositoryRoot,'plugin/skills',skill),project,skill,{copy:true,stateRoot:owned,agents:[host==='codex'?'codex':'claude-code']});
    const skillPath=path.join(project,host==='codex'?'.agents/skills':'.claude/skills',skill,'SKILL.md');
    state.before=projectSnapshot(project);
    fs.writeFileSync(path.join(evidence,'baseline.json'),JSON.stringify(state,null,2)+'\n');
    result.sourceHashes={};
    for(const file of ['scripts/evaluate-pilot.mjs','tests/helpers/pilot.mjs','plugin/runtime/transport.mjs','plugin/runtime/checkpoints.mjs',`plugin/skills/${skill}/SKILL.md`])result.sourceHashes[file]=sha256(fs.readFileSync(path.join(repositoryRoot,file)));
    const prompt=scenarioPrompt(scenario,skillPath),invocation=hostInvocation(host,prompt,project,outputStyle);
    fs.writeFileSync(path.join(evidence,'prompt.txt'),prompt);
    result.invocation={command:invocation.command,args:invocation.args};
    if(checkpoint==='staged') {
      result.sourceHashes['scripts/lib/claude-checkpoint.mjs']=sha256(fs.readFileSync(path.join(repositoryRoot,'scripts/lib/claude-checkpoint.mjs')));
      const staged=await runCheckpoint({project,state,skillPath,baseInvocation:invocation,onPhase:(phase,run)=>{
        fs.writeFileSync(path.join(evidence,phase.phase+'-stdout.log'),run.stdout);
        fs.writeFileSync(path.join(evidence,phase.phase+'-stderr.log'),run.stderr);
        fs.writeFileSync(path.join(evidence,phase.phase+'-prompt.txt'),phase.prompt);
      }});
      fs.writeFileSync(path.join(evidence,'stdout.log'),staged.stdout);fs.writeFileSync(path.join(evidence,'stderr.log'),staged.stderr);
      const {stdout,stderr,...details}=staged;
      result.staged=details;result.outcome=staged.outcome;result.model=staged.model;result.changes=staged.changes;result.error=staged.error;
      result.limitations.push('Staged mode resumes one saved Claude session. Its owned runtime history remains in Claude storage; no personal settings are edited. Controller-only evidence does not certify ordinary/native invocation.');
      if(staged.outcome==='passed')result.checks.push(staged.disposition==='controller-refused'?'Controller refused invalid gate; zero Claude workflow invocations':'Controller validated both read-only acknowledgments and actual outputs before review transition');
      return result;
    }
    const run=await runHost(invocation.command,invocation.args,{cwd:project,input:invocation.input,timeout:600000});
    fs.writeFileSync(path.join(evidence,'stdout.log'),run.stdout);fs.writeFileSync(path.join(evidence,'stderr.log'),run.stderr);
    result.process={code:run.code,signal:run.signal,reason:run.reason};
    if(run.code!==0||run.reason)throw Error(`Host execution blocked: ${run.reason??run.signal??run.code}; inspect local logs`);
    // Some hosts report service/auth errors in a successful JSON transport.
    if(host==='claude') {
      const events=run.stdout.trim().split('\n').map(line=>JSON.parse(line));
      const response=events.findLast(event=>event.type==='result');
      result.model=events.find(event=>event.type==='system'&&event.subtype==='init')?.model??null;
      if(!response||response.is_error)throw Error('Host returned an error or missing final result; inspect local logs');
    }
    result.outcome='failed';
    const verified=await verifyScenario(project,state,run.stdout);result.outcome=verified.outcome;result.changes=verified.changes;
    result.checks.push('Scenario output and mutation allowlist passed');
  } catch(error){result.error=error.message;}
  finally {
    if(output)fs.cpSync(project,path.join(evidence,'project'),{recursive:true,filter:p=>path.basename(p)!=='.git'});
    fs.writeFileSync(path.join(evidence,'result.json'),JSON.stringify(result,null,2)+'\n');
    // No-output runs return their result on stdout and remove all temporary evidence.
    if(!output)result.evidence=null;
    fs.rmSync(owned,{recursive:true,force:true});
  }
  return result;
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
  try {
    const args=process.argv.slice(2),options={};
    for(let i=0;i<args.length;i+=2){if(!['--host','--scenario','--output','--claude-output-style','--claude-checkpoint'].includes(args[i])||!args[i+1])throw Error('Expected --host, --scenario and optional --output / --claude-output-style / --claude-checkpoint pairs');options[args[i].slice(2)]=args[i+1];}
    const result=await evaluatePilot(options);console.log(JSON.stringify(result,null,2));if(result.outcome!=='passed')process.exitCode=1;
  }catch(error){console.error(error.message);process.exitCode=1;}
}
