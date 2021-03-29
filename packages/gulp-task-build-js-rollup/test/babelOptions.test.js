/* eslint max-len: 0, no-magic-numbers: 0 */

import assert from 'assert';
import babelOptions from '../src/babelOptions';

describe('babelOptions', () => {

  it('should return merged rollup-plugin-babel options.', () => {
    const cases = [
      [
        null,
        {babelrc: false, babelHelpers: 'bundled', exclude: 'node_modules/**', plugins: [], presets: [], targets: 'defaults'}
      ],
      [
        [],
        {babelrc: false, babelHelpers: 'bundled', exclude: 'node_modules/**', plugins: [], presets: [
          ['@babel/preset-env', {
            modules: false,
            useBuiltIns: false,
            debug: false
          }]
        ], targets: 'defaults'}
      ],
      [
        {},
        {babelrc: false, babelHelpers: 'bundled', exclude: 'node_modules/**', plugins: [], presets: [
          ['@babel/preset-env', {
            modules: false,
            useBuiltIns: false,
            debug: false
          }]
        ], targets: 'defaults'}
      ],
      [
        {verbose: true},
        {babelrc: false, babelHelpers: 'bundled', exclude: 'node_modules/**', plugins: [], presets: [
          ['@babel/preset-env', {
            modules: false,
            useBuiltIns: false,
            debug: true
          }]
        ], targets: 'defaults'}
      ],
      [
        {useBuiltIns: 'usage'},
        {babelrc: false, babelHelpers: 'bundled', exclude: 'node_modules/**', plugins: [], presets: [
          ['@babel/preset-env', {
            modules: false,
            useBuiltIns: 'usage',
            corejs: 3,
            debug: false
          }]
        ], targets: 'defaults'}
      ],
      [
        {useBuiltIns: 'usage', corejs: 2},
        {babelrc: false, babelHelpers: 'bundled', exclude: 'node_modules/**', plugins: [], presets: [
          ['@babel/preset-env', {
            modules: false,
            useBuiltIns: 'usage',
            corejs: 2,
            debug: false
          }]
        ], targets: 'defaults'}
      ],
      [
        {browsers: ['> 0.1% in JP', 'ie >= 8']},
        {babelrc: false, babelHelpers: 'bundled', exclude: 'node_modules/**', plugins: [], presets: [
          ['@babel/preset-env', {
            modules: false,
            useBuiltIns: false,
            debug: false
          }]
        ], targets: ['> 0.1% in JP', 'ie >= 8']}
      ],
      [
        {browsers: '> 0.1% in JP, ie >= 8'},
        {babelrc: false, babelHelpers: 'bundled', exclude: 'node_modules/**', plugins: [], presets: [
          ['@babel/preset-env', {
            modules: false,
            useBuiltIns: false,
            debug: false
          }]
        ], targets: '> 0.1% in JP, ie >= 8'}
      ],
      [
        {babelrc: `${process.cwd()}/.babelrc.js`},
        {
          babelrc: false, babelHelpers: 'bundled', exclude: 'node_modules/**', plugins: [],
          presets: [
            ['@babel/preset-env', {
              modules: false,
              useBuiltIns: false,
              debug: false
            }]
          ],
          targets: 'defaults'
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
