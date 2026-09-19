// SPDX-License-Identifier: Apache-2.0
import { parseDocument } from 'yaml';
import { fail } from './files.mjs';

export function parseYAML(text, file) {
  const doc = parseDocument(text, { uniqueKeys: true });
  if (doc.errors.length) {
    const error = doc.errors.find(e => e.code === 'DUPLICATE_KEY') ?? doc.errors[0];
    fail(file, error.code, error.message);
  }
  return doc.toJS();
}
export function frontmatter(text, file) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/.exec(text);
  if (!match) fail(file, 'FRONTMATTER', 'missing YAML frontmatter');
  const data = parseYAML(match[1], file);
  if (!data || typeof data !== 'object' || Array.isArray(data)) fail(file, 'FRONTMATTER', 'expected mapping');
  return data;
}
