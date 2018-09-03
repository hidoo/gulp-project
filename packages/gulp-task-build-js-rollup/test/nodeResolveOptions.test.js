/* eslint max-len: 0, no-magic-numbers: 0 */

import assert from 'assert';
import nodeResolveOptions from '../src/nodeResolveOptions';

describe('nodeResolveOptions', () => {

  it('should return merged rollup-plugin-node-resolve options.', () => {
    const cases = [
      [
        null,
        {module: true, jsnext: true, main: true}
      ],
      [
        [],
        {module: true, jsnext: true, main: true}
      ],
      [
        {},
        {module: true, jsnext: true, main: true}
      ],
      [
        {nodeResolveOptions: {hoge: 'fuga'}},
        {module: true, jsnext: true, main: true, hoge: 'fuga'}
      ],
      [
        {nodeResolveOptions: {jsnext: false}},
        {module: true, jsnext: false, main: true}
      ]
    ];

    cases.forEach(([options, expected]) => {
      const actual = nodeResolveOptions(options);

      assert(actual);
      assert.deepStrictEqual(actual, expected);
    });
  });

});
