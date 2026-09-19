// SPDX-License-Identifier: Apache-2.0
// Optional isolated native client lifecycle verification. No model calls.
import fs from 'node:fs';import os from 'node:os';import path from 'node:path';import assert from 'node:assert/strict';import {fileURLToPath} from 'node:url';
import {repositoryRoot,assemble} from './build-skills.mjs';import {validateNativeDistribution} from './lib/packages.mjs';
import {hash} from '../plugin/runtime/snapshot.mjs';
import {nativeFixture,nativeCommand,containedNative,packageSnapshot,verifyNativeCache,verifyNativeConsumer,sourceHash as oracleHash,marketplace,pluginId} from '../tests/helpers/native-distribution.mjs';
const evaluatorHash=hash(fs.readFileSync(fileURLToPath(import.meta.url))),unrelatedMarket='unrelated-fixture-market',unrelatedId='unrelated-fixture@unrelated-fixture-market';
export async function evaluateNative(host) {
  assert.ok(['claude','codex'].includes(host));assemble(repositoryRoot,{check:true});validateNativeDistribution(repositoryRoot);
  const owned=fs.mkdtempSync(path.join(os.tmpdir(),`idd-native-${host}-`)),s=nativeFixture(owned,host),result={host,evidence:owned,project:s.project,date:new Date().toISOString(),evaluatorHash,oracleHash,outcome:'blocked',limitations:['Isolated CLI/cache observations only; no models, personal installation, desktop pickup, remote update or publication. Upstream Archive acceptance remains pending.']};
  const command=async args=>{const r=await nativeCommand(s,args);verifyNativeConsumer(s);return r.stdout;};
  const json=async args=>JSON.parse(await command(args));
  const list=async name=>host==='codex'?(await json(['plugin','list','--marketplace',name,'--json'])).installed:await json(['plugin','list','--json']);
  const addMarket=async(source,name)=>{const args=['plugin','marketplace','add',source,...(host==='codex'?['--json']:['--scope','project'])],text=await command(args);if(host==='codex'){const r=JSON.parse(text);assert.equal(r.marketplaceName,name);containedNative(s.owned,r.installedRoot);}};
  const install=async id=>{const r=await json(['plugin',host==='codex'?'add':'install',id,...(host==='claude'?['--scope','project']:[]),'--json']);if(host==='claude')assert.equal(r.outcome,'ok');else assert.equal(r.pluginId,id);const items=await list(id.split('@')[1]),item=items.find(x=>(x.pluginId??x.id)===id);assert.ok(item&&item.enabled,'Actual installed inventory missing enabled plugin');const cache=host==='codex'?r.installedPath:item.installPath;containedNative(s.client,cache);if(host==='claude'){assert.equal(item.scope,'project');assert.equal(fs.realpathSync(item.projectPath),fs.realpathSync(s.project));}return {cache,version:item.version,inventory:items};};
  try {
    result.version=(await command(['--version'])).trim();
    for(const source of [s.source,s.retained])if(host==='claude'){await command(['plugin','validate',source]);await command(['plugin','validate',path.join(source,'plugin')]);}
    await addMarket(s.retained,unrelatedMarket);const unrelated=await install(unrelatedId),unrelatedBefore=packageSnapshot(unrelated.cache);verifyNativeCache(s,unrelated.cache,packageSnapshot(path.join(s.retained,'plugin')));
    if(host==='claude')s.unrelatedSettings=JSON.parse(fs.readFileSync(path.join(s.project,'.claude/settings.json'),'utf8'));
    result.unrelated={cache:unrelated.cache,version:unrelated.version,hash:hash(JSON.stringify(unrelatedBefore))};
    await addMarket(s.source,marketplace);if(host==='codex'){const available=await json(['plugin','list','--available','--marketplace',marketplace,'--json']);assert.equal(available.available.filter(x=>x.pluginId===pluginId).length,1);result.available=available;}
    const initial=await install(pluginId);result.initial=initial;const original=packageSnapshot(path.join(s.source,'plugin'));verifyNativeCache(s,initial.cache,original);
    if(host==='claude') {
      const details=await command(['plugin','details',pluginId]);result.componentDetails=details;
      const skills=/Skills \((\d+)\)\s+([^\n]+)/.exec(details),agents=/Agents \((\d+)\)\s+([^\n]+)/.exec(details);
      const expectedSkills=[...fs.readdirSync(path.join(s.source,'plugin/skills')),...fs.readdirSync(path.join(s.source,'plugin/commands')).filter(f=>f.endsWith('.md')).map(f=>f.slice(0,-3))].sort();
      assert.equal(Number(skills?.[1]),31,'Claude combines15 commands and16 skills');assert.deepEqual(skills[2].split(', ').sort(),expectedSkills);assert.equal(Number(agents?.[1]),14);assert.deepEqual(agents[2].split(', ').sort(),fs.readdirSync(path.join(s.source,'plugin/agents')).filter(f=>f.endsWith('.md')).map(f=>f.slice(0,-3)).sort());
    }
    const marker='\n<!-- Owned native refresh fixture -->\n',cachebuster=new Date().toISOString().replace(/[-:.]/g,'');let refreshedVersion;
    for(const file of ['plugin.json','.codex-plugin/plugin.json','.claude-plugin/plugin.json']){const p=path.join(s.source,'plugin',file),d=JSON.parse(fs.readFileSync(p));d.version=d.version.split('+')[0]+'+codex.'+cachebuster;refreshedVersion=d.version;fs.writeFileSync(p,JSON.stringify(d,null,2)+'\n');}
    fs.appendFileSync(path.join(s.source,'plugin/skills/idd-orchestration/SKILL.md'),marker);const expected=packageSnapshot(path.join(s.source,'plugin'));
    if(host==='codex'){result.marketplaceRefresh={notRun:'Local marketplace reads the current source; upgrade is Git-only, as demonstrated by retained failed trial1NgAbT'};result.refreshed=await install(pluginId);result.refreshMethod='Explicit local re-add after fixture version cache-buster; no successful Git marketplace upgrade claimed';}
    else {await command(['plugin','marketplace','update',marketplace]);const r=await json(['plugin','update',pluginId,'--scope','project','--json']);assert.equal(r.outcome,'ok');const items=await list(marketplace),item=items.find(x=>x.id===pluginId);assert.ok(item?.enabled);assert.equal(item.scope,'project');assert.equal(fs.realpathSync(item.projectPath),fs.realpathSync(s.project));containedNative(s.client,item.installPath);result.refreshed={cache:item.installPath,version:item.version,inventory:items};result.refreshMethod='Named marketplace update followed by project-scoped plugin update';}
    assert.equal(result.refreshed.version,refreshedVersion,'Refresh must change actual installed version');verifyNativeCache(s,result.refreshed.cache,expected);verifyNativeCache(s,unrelated.cache,unrelatedBefore);
    fs.rmSync(s.source,{recursive:true});verifyNativeCache(s,result.refreshed.cache,expected);
    const helper=path.join(result.refreshed.cache,'skills/idd-orchestration/stages/interview/scripts/idd-next-id');assert.match(await commandWithExecutable(helper),/^PROD-[a-f0-9]{4,8}\n$/);result.sourceRemoved=true;
    const remove=await command(['plugin',host==='codex'?'remove':'uninstall',pluginId,...(host==='claude'?['--scope','project']:[]),'--json']);result.removal=JSON.parse(remove);if(host==='claude')assert.equal(result.removal.outcome,'ok');
    await command(['plugin','marketplace','remove',marketplace,...(host==='codex'?['--json']:['--scope','project'])]);
    result.finalMarketplaces=await json(['plugin','marketplace','list','--json']);assert.ok(!JSON.stringify(result.finalMarketplaces).includes('"'+marketplace+'"'),'IDD marketplace remains');assert.ok(JSON.stringify(result.finalMarketplaces).includes('"'+unrelatedMarket+'"'),'Unrelated marketplace removed');
    const final=host==='codex'?(await json(['plugin','list','--json'])).installed:await list(unrelatedMarket);result.finalInstalled=final;assert.deepEqual(final.map(x=>x.pluginId??x.id),[unrelatedId],'Final isolated registry must contain only retained plugin');const retainedItem=final[0];assert.deepEqual(retainedItem,unrelated.inventory.find(x=>(x.pluginId??x.id)===unrelatedId),'Unrelated registration changed');
    verifyNativeCache(s,unrelated.cache,unrelatedBefore);verifyNativeConsumer(s);result.cacheAfterRemoval={initialPresent:Boolean(fs.lstatSync(initial.cache,{throwIfNoEntry:false})),refreshedPresent:Boolean(fs.lstatSync(result.refreshed.cache,{throwIfNoEntry:false}))};if(host==='codex')assert.deepEqual(result.cacheAfterRemoval,{initialPresent:false,refreshedPresent:false},'Codex uninstall must remove cached versions');result.outcome='passed';
    async function commandWithExecutable(helper){containedNative(s.client,helper);const r=await nativeCommand(s,[helper,'product'],{command:'bash'});verifyNativeConsumer(s);return r.stdout;}
  }catch(e){result.outcome='failed';result.error=e.message;}
  result.receipts=path.join(owned,'receipts.json');result.elapsedSeconds=(Date.now()-s.started)/1000;fs.writeFileSync(path.join(owned,'result.json'),JSON.stringify(result,null,2)+'\n');return result;
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){try{assert.ok(process.argv.length===4&&process.argv[2]==='--host');const r=await evaluateNative(process.argv[3]);console.log(JSON.stringify({outcome:r.outcome,evidence:r.evidence,error:r.error},null,2));if(r.outcome!=='passed')process.exitCode=1;}catch(e){console.error(e.message);process.exitCode=1;}}
