import assert from 'node:assert';
import * as sass from 'sass-embedded';
import functions from '../src/functions.js';

describe('functions', () => {
  it('should export an Object.', () => {
    assert.equal(typeof functions, 'object');
  });

  describe('env', () => {
    it('should be accessible with "env($name)" key.', () => {
      assert.equal(typeof functions['env($name)'], 'function');
    });

    it('should return a value of environment variable as SassString.', () => {
      const actual = functions['env($name)']([new sass.SassString('NODE_ENV')]);

      assert(actual instanceof sass.SassString);
      assert.equal(actual.text, process.env.NODE_ENV);
    });
  });
});
