/* eslint max-len: 0, no-magic-numbers: 0 */

import assert from 'assert';
import aliasOptions from '../src/aliasOptions';

describe('aliasOptions', () => {

  it('should return merged @rollup/plugin-alias options.', () => {
    const cases = [
      [
        null,
        {entries: []}
      ],
      [
        {},
        {entries: []}
      ],
      [
        {
          aliasOptions: {
            entries: [
              {find: 'hoge', replacement: '../../hoge'}
            ]
          }
        },
        {
          entries: [
            {find: 'hoge', replacement: '../../hoge'}
          ]
        }
      ],
      [
        {
          aliasOptions: {
            entries: {
              hoge: '../../hoge'
            }
          }
        },
        {
          entries: [
            {find: 'hoge', replacement: '../../hoge'}
          ]
        }
      ]
    ];

    cases.forEach(([options, expected]) => {
      const actual = aliasOptions(options);

      assert(actual);
      assert.deepStrictEqual(actual, expected);
    });
  });

});
