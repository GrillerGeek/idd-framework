// SPDX-License-Identifier: Apache-2.0
import test from 'node:test';
import assert from 'node:assert/strict';
import { runProcess } from '../scripts/lib/process.mjs';
import { workspace } from './helpers/workspace.mjs';

test('installer subprocess failures retain a useful diagnostic',t=>{
 const dir=workspace(t);
 assert.throws(()=>runProcess(process.execPath,['-e','console.error("installation failed"); process.exit(7)'],{cwd:dir}),/installation failed/);
 assert.throws(()=>runProcess('/no/such/installer',[],{cwd:dir}),/subprocess failed/);
});
test('hung and excessively noisy subprocesses fail within bounds',t=>{
 const dir=workspace(t);
 assert.throws(()=>runProcess(process.execPath,['-e','setInterval(()=>{},1000)'],{cwd:dir,timeout:100}),/subprocess failed/);
 assert.throws(()=>runProcess(process.execPath,['-e','process.stdout.write("x".repeat(2*1024*1024))'],{cwd:dir}),/subprocess failed/);
});
