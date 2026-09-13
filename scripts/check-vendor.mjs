// SPDX-License-Identifier: Apache-2.0
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
export function checkVendor(root) {
  const vendor=path.join(root,'plugin/vendor/yaml'),upstream=path.join(root,'node_modules/yaml');
  assert.equal(JSON.parse(fs.readFileSync(path.join(upstream,'package.json'))).version,'2.8.3','Pinned YAML version changed');
  const inventory=JSON.parse(fs.readFileSync(path.join(vendor,'integrity.json')));
  const actual=[];function visit(dir,prefix=''){for(const entry of fs.readdirSync(dir,{withFileTypes:true})){const relative=prefix+entry.name;if(entry.isDirectory())visit(path.join(dir,entry.name),relative+'/');else actual.push(relative);}}visit(vendor);
  assert.deepEqual(actual.filter(f=>f!=='integrity.json').sort(),Object.keys(inventory.files).sort(),'Vendor inventory differs');
  for(const [file,expected] of Object.entries(inventory.files)) {
    const bytes=fs.readFileSync(path.join(vendor,file));assert.equal(createHash('sha256').update(bytes).digest('hex'),expected,`Vendor hash: ${file}`);
    if(file!=='package.json')assert.deepEqual(bytes,fs.readFileSync(path.join(upstream,file)),`Upstream bytes: ${file}`);
  }
  assert.deepEqual(JSON.parse(fs.readFileSync(path.join(vendor,'package.json'))),{name:'yaml',version:'2.8.3',type:'commonjs',main:'./dist/index.js',license:'ISC'});
  return Object.keys(inventory.files).length;
}
