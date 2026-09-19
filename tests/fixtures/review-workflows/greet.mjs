// SPDX-License-Identifier: Apache-2.0
export function greet(name) {
  if (typeof name !== 'string' || !name.trim()) throw new TypeError('Expected a nonempty name');
  return `Hello, ${name.trim()}!`;
}
