/* eslint max-len: 0, no-magic-numbers: 0 */

import assert from 'assert';
import licenseOptions from '../src/licenseOptions';

describe('licenseOptions', () => {

  it('should return rollup-plugin-license options.', () => {
    const actual = licenseOptions();

    assert(actual);
    assert(actual.banner);
    assert(typeof actual.banner === 'string');
  });

});
