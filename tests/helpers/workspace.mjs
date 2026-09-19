// SPDX-License-Identifier: Apache-2.0
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { sha256, walkFiles } from '../../scripts/lib/files.mjs';

export const root = fileURLToPath(new URL('../../',import.meta.url));
export function workspace(t) {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(),'idd test with spaces '));
  t?.after(() => fs.rmSync(directory,{ recursive: true,force: true }));
  return directory;
}
export function write(root,relative,text,mode=0o644) {
  const file=path.join(root,relative);fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,text);fs.chmodSync(file,mode);return file;
}
export function snapshot(root) {
  return Object.fromEntries(walkFiles(root).map(relative => {
    const full=path.join(root,relative);const stat=fs.statSync(full);
    return [relative,{hash:sha256(fs.readFileSync(full)),mode:stat.mode&0o777,mtime:stat.mtimeMs}];
  }));
}
export function portableFixture(directory) {
  const source = path.join(root,'tests/fixtures/portable');
  fs.cpSync(source,path.join(directory,'source'),{recursive:true});
  const catalog={schemaVersion:1,stages:[],bundles:[{directory:'idd-package-probe',profile:'portable',files:walkFiles(source).map(relative => ({source:`source/${relative}`,destination:relative,executable:relative.endsWith('.sh')}))}]};
  return catalog;
}
