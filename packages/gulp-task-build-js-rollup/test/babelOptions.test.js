/* eslint max-len: 0, no-magic-numbers: 0 */

import assert from 'assert';
import babelOptions from '../src/babelOptions';

describe('babelOptions', () => {

  it('should return merged rollup-plugin-babel options.', () => {
    const cases = [
      [
        null,
        {babelrc: false, externalHelpers: true, exclude: 'node_modules/**', plugins: [], presets: []}
      ],
      [
        [],
        {babelrc: false, externalHelpers: true, exclude: 'node_modules/**', plugins: [], presets: [
          ['@babel/preset-env', {
            modules: false,
            targets: {browsers: []},
            useBuiltIns: false,
            debug: false
          }]
        ]}
      ],
      [
        {},
        {babelrc: false, externalHelpers: true, exclude: 'node_modules/**', plugins: [], presets: [
          ['@babel/preset-env', {
            modules: false,
            targets: {browsers: []},
            useBuiltIns: false,
            debug: false
          }]
        ]}
      ],
      [
        {verbose: true},
        {babelrc: false, externalHelpers: true, exclude: 'node_modules/**', plugins: [], presets: [
          ['@babel/preset-env', {
            modules: false,
            targets: {browsers: []},
            useBuiltIns: false,
            debug: true
          }]
        ]}
      ],
      [
        {useBuiltIns: 'usage'},
        {babelrc: false, externalHelpers: true, exclude: 'node_modules/**', plugins: [], presets: [
          ['@babel/preset-env', {
            modules: false,
            targets: {browsers: []},
            useBuiltIns: 'usage',
            debug: false
          }]
        ]}
      ],
      [
        {browsers: ['> 0.1% in JP', 'ie >= 8']},
        {babelrc: false, externalHelpers: true, exclude: 'node_modules/**', plugins: [], presets: [
          ['@babel/preset-env', {
            modules: false,
            targets: {browsers: ['> 0.1% in JP', 'ie >= 8']},
            useBuiltIns: false,
            debug: false
          }]
        ]}
      ],
      [
        {babelrc: `${process.cwd()}/.babelrc.js`},
        {babelrc: false, externalHelpers: true, exclude: 'node_modules/**', plugins: [],
          presets: [
            ['@babel/preset-env', {
              modules: false,
              targets: {browsers: []},
              useBuiltIns: false,
              debug: false
            }]
          ],
          env: {
            test: {
              presets: [
                'power-assert'
              ]
            }
          }
        }
      ]
    ];

    cases.forEach(([options, expected]) => {
      const actual = babelOptions(options);

      assert(actual);
      assert.deepStrictEqual(actual, expected);
    });
  });

});
