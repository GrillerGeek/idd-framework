// SPDX-License-Identifier: Apache-2.0
import fs from 'node:fs';
import path from 'node:path';
import { containedPath, fail, readJSON, relativePath, walkFiles } from './files.mjs';

export function planAssembly(root, catalog = readJSON(root, 'plugin/skill-catalog.json')) {
  if (catalog.schemaVersion !== 1 || !Array.isArray(catalog.bundles) || !catalog.bundles.length || !Array.isArray(catalog.stages)) {
    fail('plugin/skill-catalog.json', 'CATALOG', 'expected schemaVersion 1, nonempty bundles and stages array');
  }
  const directories = new Set();
  const plan = [];
  for (const bundle of catalog.bundles) {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(bundle.directory ?? '') || bundle.directory.length >= 64 || directories.has(bundle.directory)) {
      fail('plugin/skill-catalog.json', 'BUNDLE', 'invalid or duplicate bundle directory');
    }
    directories.add(bundle.directory);
    if (!['legacy-claude', 'portable'].includes(bundle.profile) || !Array.isArray(bundle.files)) fail(bundle.directory, 'BUNDLE', 'invalid profile or files');
    if (bundle.profile === 'legacy-claude' && bundle.directory !== 'idd-orchestration') fail(bundle.directory, 'LEGACY', 'only idd-orchestration has a legacy exception');
    const destinations = new Set();
    const bundleRoot = containedPath(root, `plugin/skills/${bundle.directory}`);
    for (const mapping of bundle.files) {
      relativePath(mapping.source, bundle.directory);
      relativePath(mapping.destination, bundle.directory);
      if (typeof mapping.executable !== 'boolean' || destinations.has(mapping.destination)) fail(bundle.directory, 'MAPPING', 'duplicate destination or missing executable boolean');
      destinations.add(mapping.destination);
      const source = containedPath(root, mapping.source);
      const relative = `plugin/skills/${bundle.directory}/${mapping.destination}`;
      const output = containedPath(root, relative);
      if (!fs.existsSync(source) || !fs.statSync(source).isFile()) fail(mapping.source, 'SOURCE', 'missing regular source file');
      if (fs.existsSync(output) && !fs.statSync(output).isFile()) fail(relative, 'OUTPUT', 'destination is not a regular file');
      // Check parent/file conflicts before making any changes, even if output is absent.
      const parts = mapping.destination.split('/');
      for (let n = 1; n < parts.length; n++) {
        const parent = path.join(bundleRoot, ...parts.slice(0,n));
        if (fs.existsSync(parent) && !fs.statSync(parent).isDirectory()) fail(relative, 'OUTPUT', 'parent is not a directory');
      }
      plan.push({ relative, output, bytes: fs.readFileSync(source), mode: mapping.executable ? 0o755 : 0o644 });
    }
    if (!destinations.has('SKILL.md')) fail(bundle.directory, 'ENTRYPOINT', 'exactly one SKILL.md is required');
    for (const destination of destinations) {
      const parts = destination.split('/');
      for (let n=1; n<parts.length; n++) if (destinations.has(parts.slice(0,n).join('/'))) fail(bundle.directory, 'MAPPING', 'file/directory destination conflict');
    }
    for (const existing of walkFiles(bundleRoot)) if (!destinations.has(existing)) fail(`${bundle.directory}/${existing}`, 'EXTRA_OUTPUT', 'unrecognized file preserved; remove only through an explicit migration');
  }
  const aliases = new Set(), names = new Set();
  for (const stage of catalog.stages) {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(stage.legacyCommand ?? '') || stage.skill !== `idd-${stage.legacyCommand}`
        || stage.state !== 'planned' || aliases.has(stage.legacyCommand) || names.has(stage.skill)) fail('plugin/skill-catalog.json', 'STAGE', 'invalid, duplicate or non-planned stage');
    aliases.add(stage.legacyCommand); names.add(stage.skill);
  }
  return plan.sort((a,b) => a.relative < b.relative ? -1 : a.relative > b.relative ? 1 : 0);
}
export function assemble(root, { catalog, check = false } = {}) {
  const plan = planAssembly(root, catalog);
  const drift = plan.filter(item => !fs.existsSync(item.output)
    || !fs.readFileSync(item.output).equals(item.bytes)
    || (fs.statSync(item.output).mode & 0o777) !== item.mode);
  if (check && drift.length) fail('plugin/skills', 'STALE_OUTPUT', drift.map(item => item.relative).join(', '));
  for (const item of drift) {
    fs.mkdirSync(path.dirname(item.output), { recursive: true });
    fs.writeFileSync(item.output, item.bytes);
    fs.chmodSync(item.output, item.mode);
  }
  return { files: plan.length, changed: drift.length };
}
