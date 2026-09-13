// SPDX-License-Identifier: Apache-2.0
// Controlled npx replacement, never executes a package or writes consumer files.
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
const [evidence,variant,...argv]=process.argv.slice(2);
const record=event=>fs.appendFileSync(path.join(evidence,'events.jsonl'),JSON.stringify({...event,pid:process.pid,date:new Date().toISOString()})+'\n');
record({event:'start',argv,cwd:process.cwd()});
const expected=['--yes','@jasonrobey/idd-forge','--no-open','--port','43123','--docs','docs with spaces'];
if(JSON.stringify(argv)!==JSON.stringify(expected)){record({event:'error',message:'CONTROLLED_ARGV_REJECTED'});console.error('CONTROLLED_ARGV_REJECTED');process.exit(64);}
if(variant==='failure'){record({event:'error',message:'CONTROLLED_FORGE_STARTUP_FAILURE'});console.error('CONTROLLED_FORGE_STARTUP_FAILURE');process.exit(23);}
const server=http.createServer((req,res)=>{record({event:'inspection',url:req.url});res.end('CONTROLLED_FORGE_ALIVE\n');});
let port=43123;
server.on('error',error=>{if(error.code==='EADDRINUSE'&&port<43223){port++;server.listen(port,'127.0.0.1');}else{record({event:'error',message:error.message});console.error(error.message);process.exit(1);}});
server.on('listening',()=>{const url=`http://127.0.0.1:${port}/`;record({event:'ready',url});console.log(`CONTROLLED Forge ready at ${url} owned PID ${process.pid}`);});
for(const signal of ['SIGTERM','SIGINT'])process.on(signal,()=>{record({event:'stopped',signal});server.close(()=>process.exit(0));setTimeout(()=>process.exit(1),1000).unref();});
server.listen(port,'127.0.0.1');
