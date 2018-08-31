/* eslint max-len: 0, no-magic-numbers: 0 */

import assert from 'assert';
import path from 'path';
import mergeBabelrc, {
  normalizeBabelPresets,
  findBabelPreset,
  mergeBabelPresets,
  mergeBabelPlugins
} from '../src';

describe('gulp-util-merge-babelrc', () => {

  describe('normalizeBabelPresets', () => {

    it('should return normalized presets.', () => {
      const cases = [
        [0, []],
        ['', []],
        [{}, []],
        [() => {}, []],
        [[], []],
        [['preset-name-1'], [['preset-name-1', {}]]],
        [[['preset-name-2']], [['preset-name-2']]],
        [[['preset-name-3', {}]], [['preset-name-3', {}]]]
      ];

      cases.forEach(([presets, expected]) => {
        const actual = normalizeBabelPresets(presets);

        assert(Array.isArray(actual));
        assert.deepStrictEqual(actual, expected);
      });
    });

  });

  describe('findBabelPreset', () => {

    it('should return specified name preset.', () => {
      const cases = [
        ['', '', []],
        [0, [['preset-1', {}]], []],
        ['', [['preset-2', {}]], []],
        ['preset-3', [['preset-4', {}]], []],
        ['preset-5', [['preset-5', {}]], ['preset-5', {}]],
        ['preset-6', [['preset-6', {}], ['preset-6']], ['preset-6', {}]],
        ['preset-7', ['preset-7'], ['preset-7']]
      ];

      cases.forEach(([name, presets, expected]) => {
        const actual = findBabelPreset(name, presets);

        assert(Array.isArray(actual));
        assert.deepStrictEqual(actual, expected);
      });
    });

  });

  describe('mergeBabelPresets', () => {

    it('should return merged presets.', () => {
      const cases = [
        [
          '',
          '',
          {},
          []
        ],
        [
          'preset-a',
          'preset-a',
          {},
          []
        ],
        [
          ['preset-c'],
          ['preset-d'],
          {},
          [['preset-c', {}], ['preset-d', {}]]
        ],
        [
          [['preset-e', {hoge: 'fuga'}]],
          [['preset-f', {hoge: 'piyo'}]],
          {},
          [['preset-e', {hoge: 'fuga'}], ['preset-f', {hoge: 'piyo'}]]
        ],
        [
          [['preset-g', {hoge: 'fuga'}]],
          [['preset-g', {hoge: 'piyo'}]],
          {},
          [['preset-g', {hoge: 'piyo'}]]
        ],
        [
          [['@babel/preset-env', {targets: {node: 'current'}}]],
          [['@babel/preset-env', {targets: {browsers: 'hoge'}}]],
          {},
          [['@babel/preset-env', {targets: {node: 'current', browsers: 'hoge'}}]]
        ],
        [
          [['@babel/preset-env', {targets: {node: 'current'}}]],
          [['@babel/preset-env', {targets: {browsers: 'hoge'}}]],
          {presetEnvAllowTargets: ['browsers']},
          [['@babel/preset-env', {targets: {browsers: 'hoge'}}]]
        ],
        [
          [['@babel/preset-env', {targets: {node: 'current'}}]],
          [['@babel/preset-env', {targets: {browsers: 'hoge'}}]],
          {presetEnvAllowTargets: ['node']},
          [['@babel/preset-env', {targets: {node: 'current'}}]]
        ],
        [
          [['@babel/preset-env', {targets: {node: 'current', hoge: 'piyo'}}]],
          [['@babel/preset-env', {targets: {browsers: 'hoge'}}]],
          {presetEnvAllowTargets: ['node', 'browsers']},
          [['@babel/preset-env', {targets: {node: 'current', browsers: 'hoge'}}]]
        ],
        [
          [['@babel/env', {targets: {node: 'current', hoge: 'piyo'}}]],
          [['@babel/env', {targets: {browsers: 'hoge'}}]],
          {presetEnvAllowTargets: ['node', 'browsers']},
          [['@babel/env', {targets: {node: 'current', browsers: 'hoge'}}]]
        ]
      ];

      cases.forEach(([presets, source, options, expected]) => {
        const actual = mergeBabelPresets(presets, source, options);

        assert(Array.isArray(actual));
        assert.deepStrictEqual(actual, expected);
      });
    });

  });

  describe('mergeBabelPlugins', () => {

    it('should return merged plugins.', () => {
      const cases = [
        ['', '', []],
        [['plugin-1'], '', ['plugin-1']],
        ['', ['plugin-2'], ['plugin-2']],
        [['plugin-3'], ['plugin-4'], ['plugin-3', 'plugin-4']]
      ];

      cases.forEach(([plugins, source, expected]) => {
        const actual = mergeBabelPlugins(plugins, source);

        assert(Array.isArray(actual));
        assert.deepStrictEqual(actual, expected);
      });
    });

  });

  describe('mergeBabelrc', () => {
    const babelrcPath = path.resolve(process.cwd(), '.babelrc.js');
    const babelrc = require(babelrcPath); // eslint-disable-line global-require

    it('should return merged babelrc.', () => {
      const cases = [
        [
          babelrcPath,
          '',
          {verbose: false},
          {plugins: [], presets: [], ...babelrc}
        ],
        [
          babelrcPath,
          {plugins: ['aaaa', 'bbb'], presets: [['@babel/preset-env', {targets: {browsers: 'hoge'}}]]},
          {verbose: false},
          {...babelrc, plugins: ['aaaa', 'bbb'], presets: [['@babel/preset-env', {targets: {browsers: 'hoge'}}]]}
        ]
      ];

      cases.forEach(([filepath, source, options, expected]) => {
        const actual = mergeBabelrc(filepath, source, options);

        assert.deepStrictEqual(actual, expected);
      });
    });

  });

});
