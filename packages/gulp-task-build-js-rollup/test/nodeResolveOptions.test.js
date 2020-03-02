/* eslint max-len: 0, no-magic-numbers: 0 */

import assert from 'assert';
import nodeResolveOptions from '../src/nodeResolveOptions';

describe('nodeResolveOptions', () => {

  it('should return merged rollup-plugin-node-resolve options.', () => {
    const cases = [
      [
        null,
        {mainFields: ['browser', 'module', 'jsnext', 'main']}
      ],
      [
        [],
        {mainFields: ['browser', 'module', 'jsnext', 'main']}
      ],
      [
        {},
        {mainFields: ['browser', 'module', 'jsnext', 'main']}
      ],
      [
        {nodeResolveOptions: {hoge: 'fuga'}},
        {mainFields: ['browser', 'module', 'jsnext', 'main'], hoge: 'fuga'}
      ],
      [
        {nodeResolveOptions: {mainFields: ['module', 'main']}},
        {mainFields: ['module', 'main']}
      ]
    ];

    cases.forEach(([options, expected]) => {
      const actual = nodeResolveOptions(options);

      assert(actual);
      assert.deepStrictEqual(actual, expected);
    });
  });

});
