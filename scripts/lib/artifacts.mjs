// SPDX-License-Identifier: Apache-2.0
import fs from 'node:fs';
import path from 'node:path';
import { fail, readJSON, sha256 } from './files.mjs';
import { parseYAML } from './yaml.mjs';

const states = {
  product: ['discovery','active','maintenance','sunset'],
  intention: ['draft','defined','in-progress','fulfilled','deferred'],
  expectation: ['draft','ready','specced','validated','done','deferred'],
  spec: ['draft','ready','in-progress','review','validating','done'],
};
const fields = {
  product: { strings: ['id','name','status','owner','problem_statement','target_audience','value_proposition','strategic_alignment'], arrays: [], maps: ['context'] },
  intention: { strings: ['id','product','statement','rationale','priority','owner','status'], arrays: ['dependencies','expectations'], maps: [] },
  expectation: { strings: ['id','intention','description','validation_criteria','complexity','owner','status'], arrays: ['edge_cases'], maps: [] },
  spec: { strings: ['id','product','status'], arrays: ['intentions','expectations','expectations_detail','boundaries','deliverables'], maps: ['context','validation'] },
};
const object = v => v !== null && typeof v === 'object' && !Array.isArray(v);
const nonempty = v => typeof v === 'string' && v.trim().length > 0;
function need(condition, file, field, message) { if (!condition) fail(file, 'SCHEMA', `${field}: ${message}`); }
function strings(v, file, field, complete = false, minimum = 0) {
  need(Array.isArray(v), file, field, 'expected array');
  need(v.every(x => typeof x === 'string' && (!complete || nonempty(x))) && v.length >= minimum, file, field, `expected ${minimum}+ ${complete ? 'nonempty ' : ''}strings`);
}
export function validateArtifact(text, { file = '<artifact>', kind = 'spec', template = false } = {}) {
  const document = parseYAML(text, file);
  need(object(document) && Object.keys(document).length === 1 && object(document[kind]), file, kind, 'expected one matching artifact root');
  const value = document[kind], shape = fields[kind];
  need(!!shape, file, kind, 'unknown artifact type');
  for (const key of shape.strings) need(typeof value[key] === 'string', file, key, 'expected string');
  for (const key of shape.arrays) need(Array.isArray(value[key]), file, key, 'expected array');
  for (const key of shape.maps) need(object(value[key]), file, key, 'expected mapping');
  if (!template) {
    need(nonempty(value.id), file, 'id', 'must not be empty');
    need(states[kind].includes(value.status), file, 'status', 'unknown lifecycle value');
  }
  const complete = !template && value.status !== 'draft';
  if (complete && kind !== 'product') {
    const parent = kind === 'expectation' ? 'intention' : 'product';
    need(nonempty(value[parent]), file, parent, 'non-draft parent must not be empty');
  }
  if (kind === 'product' || kind === 'spec') {
    for (const key of ['stack','patterns','auth']) need(typeof value.context[key] === 'string', file, `context.${key}`, 'expected string');
    strings(value.context.conventions, file, 'context.conventions');
    if (kind === 'spec') {
      need(Array.isArray(value.context.existing_code_refs), file, 'context.existing_code_refs', 'expected array');
      for (const ref of value.context.existing_code_refs) need(object(ref) && typeof ref.path === 'string' && typeof ref.note === 'string', file, 'context.existing_code_refs', 'expected path/note strings');
    }
  }
  if (kind === 'intention') for (const key of ['dependencies','expectations']) strings(value[key], file, key);
  if (kind === 'expectation') {
    strings(value.edge_cases, file, 'edge_cases', complete, complete ? 2 : 0);
    if (complete) need(nonempty(value.validation_criteria), file, 'validation_criteria', 'must not be empty');
    if (!template && value.status === 'deferred') need(nonempty(value.deferred_reason), file, 'deferred_reason', 'required for deferred');
  }
  if (kind === 'spec') {
    for (const key of ['intentions','expectations','boundaries','deliverables']) strings(value[key], file, key, complete, complete && key !== 'intentions' ? 1 : 0);
    for (const key of ['automated','human_review']) strings(value.validation[key], file, `validation.${key}`, complete, complete ? 1 : 0);
    const ids = [];
    for (const detail of value.expectations_detail) {
      need(object(detail), file, 'expectations_detail', 'expected mappings');
      for (const key of ['id','description','validation']) need(typeof detail[key] === 'string' && (!complete || nonempty(detail[key])), file, `expectations_detail.${key}`, 'expected string, nonempty for ready or later');
      strings(detail.edge_cases, file, 'expectations_detail.edge_cases', complete, complete ? 2 : 0);
      ids.push(detail.id);
    }
    if (complete) {
      for (const key of ['stack','patterns','auth']) need(nonempty(value.context[key]), file, `context.${key}`, 'must not be empty');
      strings(value.context.conventions, file, 'context.conventions', true, 1);
      need(new Set(value.expectations).size === value.expectations.length && new Set(ids).size === ids.length
        && JSON.stringify([...value.expectations].sort()) === JSON.stringify([...ids].sort()), file, 'expectations_detail', 'linked/detail IDs must match without duplicates');
    }
    // Optional annotation syntax is validated, but never interpreted as execution permission.
    if (value.gap_check !== undefined) {
      const g = value.gap_check;
      need(object(g) && ['passed','warnings','blocked','pass','warned'].includes(g.status), file, 'gap_check.status', 'unknown result');
      for (const key of ['blockers','warnings']) need(Number.isInteger(g[key]) && g[key] >= 0, file, `gap_check.${key}`, 'expected nonnegative integer');
      need(g.report === null || typeof g.report === 'string', file, 'gap_check.report', 'expected path or null');
      need(typeof g.date === 'string', file, 'gap_check.date', 'expected date string');
    }
  }
  return value;
}
function yamlFiles(root, dir) {
  const full = path.join(root, dir);
  if (!fs.existsSync(full)) return [];
  return fs.readdirSync(full).filter(f => f.endsWith('.yaml')).sort().map(f => `${dir}/${f}`);
}
export function validateArtifacts(root, { profiles = readJSON(root, 'tests/fixtures/artifact-profiles.json') } = {}) {
  const errors = [], artifacts = [], fixtures = [];
  function capture(fn) { try { fn(); } catch (error) { errors.push(error.message); } }
  const permitted = ['docs/specs/SPEC-test-clean.yaml','docs/specs/SPEC-test-flawed.yaml'];
  for (const [file, profile] of Object.entries(profiles)) capture(() => {
    if (!permitted.includes(file)) fail(file, 'FIXTURE_PROFILE', 'unrecognized historical fixture exemption');
    if (profile.expect !== (file.includes('flawed') ? 'DUPLICATE_KEY' : 'valid')) fail(file, 'FIXTURE_PROFILE', 'unexpected profile outcome');
    if (!/^[a-f0-9]{64}$/.test(profile.sha256)) fail(file, 'FIXTURE_PROFILE', 'expected SHA256');
    const bytes = fs.readFileSync(path.join(root, file));
    if (sha256(bytes) !== profile.sha256) fail(file, 'FIXTURE_CHANGED', 'historical fixture hash mismatch');
    let error;
    try { validateArtifact(bytes.toString(), { file }); } catch (caught) { error = caught; }
    if (profile.expect === 'valid' && error) throw error;
    if (profile.expect !== 'valid' && (!error || !error.message.includes(`: ${profile.expect}:`))) fail(file, 'FIXTURE_RESULT', `expected ${profile.expect}; got ${error?.message ?? 'valid'}`);
    fixtures.push(file);
  });
  for (const kind of Object.keys(fields)) {
    for (const file of yamlFiles(root, `docs/${kind === 'spec' ? 'specs' : kind + 's'}`)) {
      if (Object.hasOwn(profiles, file)) continue;
      capture(() => artifacts.push({ file, kind, value: validateArtifact(fs.readFileSync(path.join(root,file),'utf8'), { file, kind }) }));
    }
    const file = `templates/${kind}-template.yaml`;
    if (fs.existsSync(path.join(root,file))) capture(() => validateArtifact(fs.readFileSync(path.join(root,file),'utf8'), { file, kind, template: true }));
  }
  const index = new Map();
  function add(id, kind, file, value) {
    if (!nonempty(id) || index.has(id)) fail(file, 'ID', `empty or duplicate ID ${id}`);
    index.set(id, { kind, file, value });
  }
  for (const a of artifacts) capture(() => add(a.value.id, a.kind, a.file, a.value));
  const ledgerPath = 'docs/idd-ledger.yaml';
  if (fs.existsSync(path.join(root,ledgerPath))) capture(() => {
    const ledger = parseYAML(fs.readFileSync(path.join(root,ledgerPath),'utf8'),ledgerPath)?.ledger;
    need(object(ledger) && Array.isArray(ledger.records), ledgerPath, 'ledger.records', 'expected records array');
    for (const record of ledger.records) if (Object.hasOwn(fields,record.type)) add(record.id,record.type,ledgerPath,{ name: record.title });
  });
  function reference(id, type, file, field, allowName = false, allowEmpty = false) {
    if (!nonempty(id)) {
      if (allowEmpty) return;
      fail(file, 'REFERENCE', `${field}: non-draft link must not be empty`);
    }
    const exact = index.get(id);
    if (exact?.kind === type) return;
    if (allowName && [...index.values()].filter(x => x.kind === 'product' && x.value.name === id).length === 1) return;
    fail(file, 'REFERENCE', `${field}: missing or wrong-type ${type} ${id}`);
  }
  for (const { file, kind, value: v } of artifacts) capture(() => {
    const draft = v.status === 'draft';
    if (kind === 'intention') {
      reference(v.product,'product',file,'product',false,draft);
      for (const id of v.dependencies) reference(id,'intention',file,'dependencies',false,draft);
      for (const id of v.expectations) reference(id,'expectation',file,'expectations',false,draft);
    }
    if (kind === 'expectation') reference(v.intention,'intention',file,'intention',false,draft);
    if (kind === 'spec') {
      reference(v.product,'product',file,'product',true,draft);
      for (const id of v.intentions) reference(id,'intention',file,'intentions',false,draft);
      for (const id of v.expectations) reference(id,'expectation',file,'expectations',false,draft);
    }
  });
  return { errors: errors.sort(), artifacts: artifacts.length, fixtures: fixtures.length };
}
