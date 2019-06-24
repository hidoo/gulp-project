/* eslint max-len: 0, no-magic-numbers: 0 */

import assert from 'assert';
import fs from 'fs';
import formatCode from '../src/formatCode';

describe('formatCode', () => {
  const path = {
    src: `${__dirname}/fixtures/src/formatCode`,
    expected: `${__dirname}/fixtures/expected/formatCode`
  };

  it('should return Promise includes String of formated code by eslint.', (done) => {
    const src = fs.readFileSync(`${path.src}/sample.js`),
          expected = fs.readFileSync(`${path.expected}/sample.js`),
          actual = formatCode(src.toString());

    assert(actual instanceof Promise);
    actual
      .then((output) => {
        assert(typeof output === 'string');
        assert.deepStrictEqual(output.trim(), expected.toString().trim());
      })
      .then(() => done())
      .catch((error) => done(error));
  });

});
