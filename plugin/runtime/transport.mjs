// SPDX-License-Identifier: Apache-2.0
import {spawn} from 'node:child_process';
// Bounded subprocess transport, including descendant cleanup on timeout/output overflow.
export function runHost(command,args,{cwd,input='',timeout=240000,maxBytes=4*1024*1024}={}) {
  return new Promise(resolve=>{
    let stdout='',stderr='',bytes=0,reason=null,settled=false,escalation;
    const env={...process.env};delete env.NODE_TEST_CONTEXT;
    const child=spawn(command,args,{cwd,env,detached:process.platform!=='win32',stdio:['pipe','pipe','pipe']});
    const signalOwned=signal=>{try{if(process.platform==='win32')child.kill(signal);else process.kill(-child.pid,signal);}catch{}};
    const terminate=why=>{if(reason)return;reason=why;signalOwned('SIGTERM');escalation=setTimeout(()=>signalOwned('SIGKILL'),1000);};
    const interrupt=()=>terminate('interrupted');
    process.once('SIGINT',interrupt);process.once('SIGTERM',interrupt);
    const timer=setTimeout(()=>terminate('timeout'),timeout);
    const finish=(code,signal)=>{if(settled)return;settled=true;clearTimeout(timer);clearTimeout(escalation);process.removeListener('SIGINT',interrupt);process.removeListener('SIGTERM',interrupt);resolve({code,signal,reason,stdout,stderr});};
    const receive=stream=>chunk=>{bytes+=chunk.length;if(bytes>maxBytes){terminate('output-limit');return;}if(stream==='stdout')stdout+=chunk;else stderr+=chunk;};
    child.stdout.on('data',receive('stdout'));child.stderr.on('data',receive('stderr'));
    child.on('exit',()=>{try{if(process.platform!=='win32')process.kill(-child.pid,'SIGKILL');}catch{}});
    child.on('error',error=>{reason=error.code??error.message;finish(null,null);});child.on('close',finish);
    child.stdin.on('error',()=>{});child.stdin.end(input);
  });
}
