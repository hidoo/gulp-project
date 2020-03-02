/* eslint max-len: off, no-magic-numbers: off */

import assert from 'assert';
import jsonOptions from '../src/jsonOptions';

describe('jsonOptions', () => {

  it('should return @rollup/plugin-json options.', () => {
    const cases = [
      [
        null,
        {indent: '  '}
      ],
      [
        {},
        {indent: '  '}
      ],
      [
        {jsonOptions: {}},
        {indent: '  '}
      ],
      [
        {
          jsonOptions: {
            indent: ' '
          }
        },
        {indent: ' '}
      ],
      [
        {
          jsonOptions: {
            exclude: [],
            include: [],
            namedExports: false,
            preferConst: true
          }
        },
        {
          indent: '  ',
          exclude: [],
          include: [],
          namedExports: false,
          preferConst: true
        }
      ]
    ];

    cases.forEach(([options, expected]) => {
      const actual = jsonOptions(options);

      assert(actual);
      assert.deepStrictEqual(actual, expected);
    });
  });

});
