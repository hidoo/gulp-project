/* eslint max-len: 0, no-magic-numbers: 0 */

import assert from 'assert';
import path from 'path';
import commonjsOptions from '../src/commonjsOptions';

describe('commonjsOptions', () => {
  let cwdNodeModules = null;

  before(() => {
    cwdNodeModules = path.resolve(process.cwd(), 'node_modules/**');
  });

  it('should return merged rollup-plugin-commonjs options.', () => {
    const cases = [
      [
        null,
        {sourceMap: false, include: [cwdNodeModules]}
      ],
      [
        [],
        {sourceMap: false, include: [cwdNodeModules]}
      ],
      [
        {},
        {sourceMap: false, include: [cwdNodeModules]}
      ],
      [
        {src: './path/to/src/filename.js'},
        {sourceMap: false, include: [
          cwdNodeModules,
          `${path.resolve(process.cwd(), path.dirname('./path/to/src/filename.js'))}/**`
        ]}
      ],
      [
        {src: './path/to/src/filename.js', commonjsOptions: {
          hoge: 'fuga'
        }},
        {sourceMap: false, hoge: 'fuga', include: [
          cwdNodeModules,
          `${path.resolve(process.cwd(), path.dirname('./path/to/src/filename.js'))}/**`
        ]}
      ],
      [
        {src: './path/to/src/filename.js', commonjsOptions: {
          sourceMap: true,
          include: ['node_modules/**']
        }},
        {sourceMap: true, include: [
          cwdNodeModules,
          `${path.resolve(process.cwd(), path.dirname('./path/to/src/filename.js'))}/**`,
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
