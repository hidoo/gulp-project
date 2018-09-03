/* eslint max-len: 0, no-magic-numbers: 0 */

import assert from 'assert';
import outputOptions from '../src/outputOptions';

describe('outputOptions', () => {

  it('should return merged output options.', () => {
    const cases = [
      [
        null,
        {format: 'iife', name: '', sourcemap: 'inline'}
      ],
      [
        [],
        {format: 'iife', name: '', sourcemap: 'inline'}
      ],
      [
        {},
        {format: 'iife', name: '', sourcemap: 'inline'}
      ],
      [
        {outputOptions: {format: 'cjs', name: '', sourcemap: true}},
        {format: 'cjs', name: '', sourcemap: true}
      ],
      [
        {outputOptions: {hoge: 'fuga'}},
        {format: 'iife', name: '', sourcemap: 'inline', hoge: 'fuga'}
      ]
    ];

    cases.forEach(([options, expected]) => {
      const actual = outputOptions(options);

      assert(actual);
      assert.deepStrictEqual(actual, expected);
    });
  });

});
