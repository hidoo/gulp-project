/* eslint max-len: 0, no-magic-numbers: 0 */

import assert from 'node:assert';
import sample from './index.cjs';

describe('js/lib/sample-cjs', () => {

  it('should return "message" string.', () => {
    const actual = sample();

    assert(typeof actual === 'string');
    assert.equal(actual, 'This is Common JS Module sample.');
  });
});
