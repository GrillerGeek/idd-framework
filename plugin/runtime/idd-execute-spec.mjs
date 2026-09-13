#!/usr/bin/env node
// SPDX-License-Identifier: Apache-2.0
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {execute} from './runner.mjs';
const options={};
try {
  for(let n=2;n<process.argv.length;n++) {
    const flag=process.argv[n];if(!['--project','--spec','--check','--implementer-model'].includes(flag)||Object.hasOwn(options,flag))throw Error(`Unknown/duplicate option: ${flag}`);
    if(flag==='--check')options[flag]=true;else {const value=process.argv[++n];if(!value||value.startsWith('--'))throw Error(`Missing value for ${flag}`);options[flag]=value;}
  }
  if(!options['--project']||!options['--spec'])throw Error('Usage: node <skill>/scripts/idd-execute-spec.mjs --project <project> --spec <SPEC-ID> [--check] [--implementer-model configured|sonnet]');
  const result=await execute({project:path.resolve(options['--project']),specId:options['--spec'],bundleRoot:path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'),check:options['--check'],implementerModel:options['--implementer-model']});
  console.log(JSON.stringify(result,null,2));if(!['passed','ready'].includes(result.outcome))process.exitCode=1;
} catch(error) {console.log(JSON.stringify({outcome:'refused',hostInvocations:0,error:error.message}));process.exitCode=1;}
