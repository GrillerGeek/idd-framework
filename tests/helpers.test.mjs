// SPDX-License-Identifier: Apache-2.0
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { workspace,write,snapshot,root } from './helpers/workspace.mjs';

function invoke(helper,dir,args=[],env=process.env) {return spawnSync('bash',[path.join(root,'plugin/bin',helper),...args],{cwd:dir,env,encoding:'utf8',timeout:10000});}
function stub(t,dir) {
  const bin=workspace(t);write(bin,'od','#!/bin/sh\ncase "$*" in\n *-N2*) printf " a1 b2\\n" ;;\n *-N3*) printf " c3 d4 e5\\n" ;;\n *-N4*) printf " f6 a7 b8 c9\\n" ;;\nesac\n',0o755);
  return {...process.env,PATH:bin+path.delimiter+process.env.PATH};
}
test('ID aliases and invalid inputs leave projects unchanged',t=>{
  const dir=workspace(t);
  for(const [type,prefix] of [['product','PROD'],['intention','INT'],['expectation','EXP'],['spec','SPEC'],['exploration','EXPL']]) for(const alias of [type,type+'s']) {
    const result=invoke('idd-next-id',dir,[alias]);assert.equal(result.status,0);assert.match(result.stdout,new RegExp(`^${prefix}-[a-f0-9]{4}\\n$`));
  }
  for(const args of [[],['unknown']]) {const r=invoke('idd-next-id',dir,args);assert.notEqual(r.status,0);assert.match(r.stderr,/Usage:/);assert.equal(r.stdout,'');}
  assert.deepEqual(snapshot(dir),{});
});
for(const [type,prefix,extension] of [['product','PROD','.yaml'],['intention','INT','-description.yaml'],['expectation','EXP','-description.yaml'],['spec','SPEC','-description.yaml'],['exploration','EXPL','-description/map.md']]) test(`${type} collisions extend hashes without writes`,t=>{
  const dir=workspace(t),env=stub(t,dir),directory=`docs/${type}s`;
  write(dir,`${directory}/${prefix}-a1b2${extension}`,'occupied');
  const before=snapshot(dir),six=invoke('idd-next-id',dir,[type],env);assert.equal(six.status,0);assert.equal(six.stdout,`${prefix}-c3d4e5\n`);assert.deepEqual(snapshot(dir),before);
  write(dir,`${directory}/${prefix}-c3d4e5${extension}`,'occupied');
  assert.equal(invoke('idd-next-id',dir,[type],env).stdout,`${prefix}-f6a7b8c9\n`);
  write(dir,`${directory}/${prefix}-f6a7b8c9${extension}`,'occupied');
  const full=snapshot(dir),failed=invoke('idd-next-id',dir,[type],env);assert.notEqual(failed.status,0);assert.match(failed.stderr,/15 attempts/);assert.equal(failed.stdout,'');assert.deepEqual(snapshot(dir),full);
});
test('product descriptive filename occupies its ID',t=>{
  const dir=workspace(t);write(dir,'docs/products/PROD-a1b2-existing.yaml','product:\n  id: PROD-a1b2\n');
  assert.equal(invoke('idd-next-id',dir,['product'],stub(t,dir)).stdout,'PROD-c3d4e5\n');
});
test('archive inventory is deterministic and read-only, including nested exploration references',t=>{
  const dir=workspace(t);
  assert.equal(invoke('idd-archive-scan',dir).stdout,'== INVENTORY ==\n== STATUS ==\n== MENTIONS ==\n');
  write(dir,'docs/products/PROD-a1b2-existing.yaml','product:\n  id: PROD-a1b2\n  status: "active"\n');
  write(dir,'docs/specs/SPEC-a1b2.yaml','spec:\n  id: SPEC-a1b2\n  status: ready\n  gap_check:\n    status: passed\n');
  write(dir,'docs/expectations/EXP-c3d4.yaml','expectation:\n  id: EXP-c3d4\n');
  write(dir,'docs/explorations/EXPL-c3d4-with spaces/map.md','---\nstatus: clear\n---\nPROD-a1b2 PROD-a1b2\n');
  write(dir,'docs/explorations/EXPL-c3d4-with spaces/decisions/one choice.md','SPEC-a1b2 EXP-c3d4 SPEC-a1b2\n');
  const before=snapshot(dir),result=invoke('idd-archive-scan',dir);assert.equal(result.status,0);
  assert.equal(invoke('idd-archive-scan',dir).stdout,result.stdout);assert.deepEqual(snapshot(dir),before);
  const [inventory,status,mentions]=result.stdout.split(/== (?:INVENTORY|STATUS|MENTIONS) ==\n/).slice(1);
  assert.match(inventory,/EXPL docs\/explorations\/EXPL-c3d4-with spaces\/map.md/);assert.doesNotMatch(inventory,/one choice/);
  assert.match(status,/SPEC-a1b2.yaml ready\n/);assert.match(status,/EXP-c3d4.yaml <none>\n/);
  assert.match(mentions,/docs\/explorations\/EXPL-c3d4-with spaces\/map.md: PROD-a1b2\n/);
  assert.match(mentions,/docs\/explorations\/EXPL-c3d4-with spaces\/decisions\/one choice.md: EXP-c3d4 SPEC-a1b2\n/);
});
