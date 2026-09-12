// SPDX-License-Identifier: Apache-2.0
import fs from 'node:fs';
import path from 'node:path';
import { containedPath, fail, readJSON, sha256 } from './files.mjs';
import { frontmatter } from './yaml.mjs';

function slug(text) { return text.toLowerCase().replace(/<[^>]*>/g,'').replace(/[^\p{L}\p{N}_ -]/gu,'').replace(/ /g,'-'); }
function localTarget(bundleRoot, file, target) {
  if (/^[a-z][a-z0-9+.-]*:/i.test(target)) return;
  let decoded;
  try { decoded = decodeURIComponent(target); } catch { fail(file,'RESOURCE','invalid URL encoding'); }
  const [pathname, anchor] = decoded.split('#');
  if (path.isAbsolute(pathname) || pathname.includes('\\')) fail(file,'RESOURCE','absolute/backslash resource path');
  const current = path.join(bundleRoot,file);
  const resolved = pathname ? path.resolve(path.dirname(current),pathname) : current;
  const relative = path.relative(bundleRoot,resolved);
  if (relative === '..' || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative)) fail(file,'RESOURCE',`target escapes bundle: ${target}`);
  if (!fs.existsSync(resolved)) fail(file,'RESOURCE',`missing target: ${target}`);
  if (relative) containedPath(bundleRoot,relative.split(path.sep).join('/'));
  if (anchor) {
    if (!fs.statSync(resolved).isFile()) fail(file,'RESOURCE',`anchor target is not a file: ${target}`);
    const text = fs.readFileSync(resolved,'utf8').replace(/^```[^\n]*\n[\s\S]*?^```\s*$/gm,'');
    const used = new Map();
    const anchors = [...text.matchAll(/^#{1,6}\s+(.+?)\s*#*\s*$/gm)].map(m => {
      const base = slug(m[1]), n = used.get(base) ?? 0; used.set(base,n+1); return n ? `${base}-${n}` : base;
    });
    if (!anchors.includes(anchor)) fail(file,'RESOURCE',`missing anchor: ${target}`);
  }
}
function markdownTargets(text, file) {
  const targets = new Set(), definitions = new Map();
  const label = value => value.trim().replace(/\s+/g,' ').toLowerCase();
  // Reference definitions and inline links share the same path validation below.
  for (const match of text.matchAll(/^ {0,3}\[([^\]\n]+)\]:\s*(?:<([^>\n]+)>|(\S+))/gm)) {
    const key = label(match[1]);
    if (!definitions.has(key)) definitions.set(key, match[2] ?? match[3]);
  }
  for (const match of text.matchAll(/\[[^\]\n]*\]\((<[^>]+>|[^\s)]+)(?:\s+(?:"[^"]*"|'[^']*'|\([^)]*\)))?\s*\)/g)) {
    targets.add(match[1].replace(/^<|>$/g,''));
  }
  for (const match of text.matchAll(/\[([^\]\n]+)\](?:\[([^\]\n]*)\])?(?!\()/g)) {
    if (text.slice(match.index + match[0].length).startsWith(':')) continue;
    const key = label(match[2] || match[1]);
    if (definitions.has(key)) targets.add(definitions.get(key));
    else if (match[2] !== undefined) fail(file,'RESOURCE',`missing link definition: ${key}`);
  }
  return targets;
}
export function validateBundles(root, catalog = readJSON(root,'plugin/skill-catalog.json')) {
  for (const bundle of catalog.bundles) {
    const bundleRoot = containedPath(root,`plugin/skills/${bundle.directory}`);
    const entry = fs.readFileSync(path.join(bundleRoot,'SKILL.md'),'utf8');
    const meta = frontmatter(entry,`${bundle.directory}/SKILL.md`);
    if (typeof meta.description !== 'string' || !meta.description.trim()) fail(bundle.directory,'METADATA','description must be nonempty');
    if (bundle.profile === 'legacy-claude') {
      if (bundle.directory !== 'idd-orchestration' || meta.name !== 'IDD Orchestration') fail(bundle.directory,'LEGACY','unrecognized legacy exception');
    } else if (bundle.profile !== 'portable' || meta.name !== bundle.directory || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(meta.name) || meta.name.length >=64) fail(bundle.directory,'METADATA','portable name must match directory and use lowercase hyphens');
    for (const mapping of bundle.files) {
      const filename = containedPath(bundleRoot,mapping.destination);
      if (!fs.existsSync(filename) || !fs.statSync(filename).isFile()) fail(mapping.destination,'RESOURCE','missing regular resource');
      if ((fs.statSync(filename).mode & 0o777) !== (mapping.executable ? 0o755 : 0o644)) fail(mapping.destination,'MODE','incorrect executable mode');
      if (bundle.profile !== 'portable' || !mapping.destination.endsWith('.md')) continue;
      const text = fs.readFileSync(filename,'utf8');
      if (/CLAUDE_PLUGIN_ROOT|\/idd-framework:|\b(?:Agent|Task)\s*\(|\bmodel\s*:\s*["']?(?:opus|sonnet|haiku)\b|\b(?:Opus|Sonnet|Haiku)\b[^\n]{0,30}\b(?:model|tier)\b/i.test(text)) fail(mapping.destination,'HOST_SPECIFIC','portable instructions contain Claude dispatch/model syntax');
      const targets = markdownTargets(text, mapping.destination);
      for (const m of text.matchAll(/`((?:\.\.?\/)*(?:references|scripts|assets)\/[^`\s]+)`/g)) targets.add(m[1]);
      for (const target of targets) localTarget(bundleRoot,mapping.destination,target);
    }
  }
}
export function validatePlugin(root, catalog = readJSON(root,'plugin/skill-catalog.json')) {
  const expected = readJSON(root,'tests/fixtures/plugin-inventory.json');
  for (const kind of ['commands','agents']) {
    const directory = path.join(root,'plugin',kind);
    const files = fs.readdirSync(directory).filter(f => f.endsWith('.md')).sort();
    if (JSON.stringify(files) !== JSON.stringify(Object.keys(expected[kind]).sort()) || files.length !== (kind === 'commands' ? 15 : 14)) fail(`plugin/${kind}`,'INVENTORY','command/agent filenames changed');
    for (const name of files) {
      const file = `plugin/${kind}/${name}`, text = fs.readFileSync(path.join(root,file),'utf8');
      frontmatter(text,file);
      if (sha256(text.split('---',3)[1] ?? '') !== expected[kind][name]) fail(file,'FRONTMATTER_CHANGED','name/model/metadata differ from reviewed inventory');
    }
  }
  const commands = Object.keys(expected.commands).map(f => f.replace(/\.md$/,'')).sort();
  if (JSON.stringify(catalog.stages.map(s => s.legacyCommand).sort()) !== JSON.stringify(commands)) fail('plugin/skill-catalog.json','INVENTORY','every legacy command needs a stage record');
  const manifest = readJSON(root,'plugin/.claude-plugin/plugin.json');
  if (JSON.stringify(manifest) !== JSON.stringify(expected.manifest) || manifest.version !== '1.6.0') fail('plugin/.claude-plugin/plugin.json','MANIFEST_CHANGED','manifest differs from reviewed baseline');
  for (const field of ['commands','agents','skills','hooks','mcpServers','lspServers']) {
    const values = Array.isArray(manifest[field]) ? manifest[field] : [manifest[field]];
    for (let value of values) if (typeof value === 'string') {
      value = value.replace(/^\.\//,'');
      const resolved = containedPath(path.join(root,'plugin'),value);
      if (!fs.existsSync(resolved)) fail('plugin/.claude-plugin/plugin.json','MANIFEST_PATH',`missing ${field}: ${value}`);
    }
  }
  const hooks = readJSON(root,'plugin/hooks/hooks.json');
  if (!hooks.hooks || Object.keys(hooks.hooks).length) fail('plugin/hooks/hooks.json','HOOKS','expected unchanged empty hook mapping');
}
