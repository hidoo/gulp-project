/* eslint max-len: 0, no-magic-numbers: 0 */

import assert from 'assert';
import inputOptions from '../src/inputOptions';

describe('inputOptions', () => {

  it('should return merged input options.', () => {
    const cases = [
      [
        null,
        {input: ''}
      ],
      [
        [],
        {input: ''}
      ],
      [
        {},
        {input: ''}
      ],
      [
        {src: '/path/to/src'},
        {input: '/path/to/src'}
      ],
      [
        {src: '/path/to/src', inputOptions: {plugins: [() => {}]}}, // eslint-disable-line no-empty-function
        {input: '/path/to/src'}
      ],
      [
        {src: '/path/to/src', inputOptions: {hoge: 'fuga'}},
        {input: '/path/to/src', hoge: 'fuga'}
      ]
    ];

    cases.forEach(([options, expected]) => {
      const {onwarn, plugins, ...actual} = inputOptions(options);

      assert(actual);
      assert.deepStrictEqual(actual, expected);
      assert(typeof onwarn === 'function');
      assert(Array.isArray(plugins));

      if (
        options && options.inputOptions &&
        Array.isArray(options.plugins) && options.plugins.length
      ) {
        options.plugins.forEach((plugin) => {
          assert(expected.plugins.includes(plugin));
        });
      }
    });
  });

});
