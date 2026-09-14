// SPDX-License-Identifier: Apache-2.0
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { assemble, repositoryRoot } from './build-skills.mjs';
import { validateArtifacts } from './lib/artifacts.mjs';
import { validateBundles, validatePlugin, validateNativeDistribution } from './lib/packages.mjs';
import { parseYAML } from './lib/yaml.mjs';

import { checkVendor } from './check-vendor.mjs';

export function checkRepository(root = repositoryRoot) {
  const errors = [];
  const run = fn => { try { fn(); } catch (e) { errors.push(e.message); } };
  run(() => assemble(root,{ check: true }));
  run(() => validateBundles(root));
  run(() => validatePlugin(root));
  run(() => validateNativeDistribution(root));
  run(() => checkVendor(root));
  run(() => errors.push(...validateArtifacts(root).errors));
  const helpers = ['plugin/bin/idd-next-id','plugin/bin/idd-archive-scan','plugin/scripts/init-idd.sh'];
  run(() => {
    for (const helper of helpers) if (!(fs.statSync(path.join(root,helper)).mode & 0o111)) throw new Error(`${helper}: MODE: executable bit required`);
  });
  for (const [command,args] of [['bash',['-n',...helpers]],['git',['diff','--check']]]) run(() => {
    const result = spawnSync(command,args,{ cwd: root,encoding: 'utf8',timeout: 30000,maxBuffer: 1024*1024 });
    if (result.error || result.status !== 0) throw new Error(`${command}: ${result.error?.message ?? result.stderr ?? result.stdout}`);
  });
  run(() => {
    const workflow = parseYAML(fs.readFileSync(path.join(root,'.github/workflows/validate.yml'),'utf8'),'.github/workflows/validate.yml');
    for (const job of Object.values(workflow.jobs)) for (const step of job.steps) if (step.uses && !/^[^@]+@[a-f0-9]{40}$/.test(step.uses)) throw new Error('CI: action references must use immutable commit SHAs');
  });
  return errors.sort();
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const errors = checkRepository();
  if (errors.length) { console.error(errors.join('\n')); process.exitCode=1; }
  else console.log('Package, artifact, inventory, CI and Bash checks passed. Structural checks do not authorize Spec execution.');
}
