// SPDX-License-Identifier: Apache-2.0
import test from 'node:test';
import assert from 'node:assert/strict';
import {greet} from '../src/greet.mjs';
test('Ada greeting',()=>assert.equal(greet('Ada'),'Hello, Ada!'));
test('padding is trimmed',()=>assert.equal(greet('  Ada  '),'Hello, Ada!'));
test('invalid input throws TypeError',()=>{for(const input of ['', '   ', null, 3])assert.throws(()=>greet(input),TypeError);});
