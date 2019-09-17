/* eslint max-len: 0, no-magic-numbers: 0 */

import assert from 'assert';
import sample from '..';

describe('js/lib/sample-esm', () => {

  it('should return "message" string.', () => {
    const actual = sample();

    assert(typeof actual === 'string');
    assert.equal(actual, 'This is ES Module sample.');
  });
});
