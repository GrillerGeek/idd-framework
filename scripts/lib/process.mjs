// SPDX-License-Identifier: Apache-2.0
import { spawnSync } from 'node:child_process';
export function runProcess(command,args,{ cwd,env=process.env,timeout=60000 }={}) {
  const result=spawnSync(command,args,{cwd,env,encoding:'utf8',timeout,maxBuffer:1024*1024,killSignal:'SIGKILL'});
  if (result.error || result.status !== 0) {
    const detail=(result.error?.message ?? `${result.signal ?? result.status}: ${result.stderr || result.stdout}`).slice(-4000);
    throw new Error(`${command}: subprocess failed: ${detail}`);
  }
  return result.stdout;
}
