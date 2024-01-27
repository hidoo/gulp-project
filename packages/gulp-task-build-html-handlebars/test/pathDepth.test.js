/* eslint max-len: 0 */

import assert from 'node:assert';
import pathDepth from '../src/pathDepth.js';

describe('pathDepth', () => {

  it('should throw TypeError if argument "path" is not string.', () => {
    const invalidValues = [0, [], {}, () => {}]; // eslint-disable-line no-empty-function

    invalidValues.forEach((value) => {
      try {
        pathDepth(value);
      }
      catch (error) {
        assert(error instanceof TypeError);
      }
    });
  });

  it('should return depth string if argument "path" is valid.', () => {
    const values = [
      ['index.html', './'],
      ['path/index.html', '../'],
      ['path/to/index.html', '../../'],
      ['path', './'],
      ['path/', '../'],
      ['path/to/', '../../']
    ];

    values.forEach(([path, expected]) => {
      const result = pathDepth(path);

      assert(typeof result === 'string');
      assert(result === expected);
    });
  });

  it('should return as it is if argument "path" is abssolute path string.', () => {
    const values = [
      ['/path', '/path'],
      ['/path/to', '/path/to']
    ];

    values.forEach(([path, expected]) => {
      const result = pathDepth(path);

      assert(typeof result === 'string');
      assert(result === expected);
    });
  });

});
