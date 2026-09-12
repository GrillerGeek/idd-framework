// SPDX-License-Identifier: Apache-2.0
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';

export const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');
export function fail(file, code, message) { throw new Error(`${file}: ${code}: ${message}`); }
export function readJSON(root, relative) {
  try { return JSON.parse(fs.readFileSync(path.join(root, relative), 'utf8')); }
  catch (error) { fail(relative, 'JSON', error.message); }
}
export function relativePath(value, label) {
  if (typeof value !== 'string' || !value || path.isAbsolute(value) || /^[A-Za-z]:/.test(value)
      || value.includes('\\') || value.split('/').some(p => !p || p === '.' || p === '..')) {
    fail(label, 'PATH', 'expected a contained relative path without dot segments');
  }
  return value;
}
export function containedPath(root, relative) {
  relativePath(relative, relative);
  let current = root;
  for (const part of relative.split('/')) {
    current = path.join(current, part);
    try {
      if (fs.lstatSync(current).isSymbolicLink()) fail(relative, 'SYMLINK', 'symlinks are not package inputs or outputs');
    } catch (error) { if (error.code !== 'ENOENT') throw error; }
  }
  return current;
}
export function walkFiles(directory, prefix = '') {
  if (!fs.existsSync(directory)) return [];
  const result = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true }).sort((a,b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0)) {
    const relative = prefix ? `${prefix}/${entry.name}` : entry.name;
    if (entry.isSymbolicLink()) fail(relative, 'SYMLINK', 'symlinks are not package inputs or outputs');
    if (entry.isDirectory()) result.push(...walkFiles(path.join(directory, entry.name), relative));
    else if (entry.isFile()) result.push(relative);
    else fail(relative, 'FILE_TYPE', 'expected an ordinary file or directory');
  }
  return result;
}
