/* eslint max-len: 0, no-magic-numbers: 0 */

import assert from 'assert';
import commonjsOptions from '../src/commonjsOptions';

describe('commonjsOptions', () => {

  it('should return merged rollup-plugin-commonjs options.', () => {
    const cases = [
      [
        null,
        {sourceMap: false}
      ],
      [
        [],
        {sourceMap: false}
      ],
      [
        {},
        {sourceMap: false}
      ],
      [
        {src: './path/to/src/filename.js'},
        {sourceMap: false}
      ],
      [
        {src: './path/to/src/filename.js', commonjsOptions: {
          hoge: 'fuga'
        }},
        {sourceMap: false, hoge: 'fuga'}
      ],
      [
        {src: './path/to/src/filename.js', commonjsOptions: {
          sourceMap: true,
          include: ['node_modules/**']
        }},
        {sourceMap: true, include: [
          'node_modules/**'
        ]}
      ]
    ];

    cases.forEach(([options, expected]) => {
      const actual = commonjsOptions(options);

      assert(actual);
      assert.deepStrictEqual(actual, expected);
    });
  });

});
