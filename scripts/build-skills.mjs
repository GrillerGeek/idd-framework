// SPDX-License-Identifier: Apache-2.0
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { assemble } from './lib/assembly.mjs';
export { assemble, planAssembly } from './lib/assembly.mjs';
export const repositoryRoot = fileURLToPath(new URL('../', import.meta.url));
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const args = process.argv.slice(2);
    if (args.some(a => a !== '--check') || args.length > 1) throw new Error('Usage: node scripts/build-skills.mjs [--check]');
    const result = assemble(repositoryRoot, { check: args.includes('--check') });
    console.log(`${args.includes('--check') ? 'Verified' : 'Assembled'} ${result.files} files; ${result.changed} changed.`);
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}
