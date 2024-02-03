/* eslint max-len: off, no-magic-numbers: off */

import assert from 'node:assert';
import outputOptions, { defaultOutputOptions } from '../src/outputOptions.js';

describe('outputOptions', () => {
  it('should return merged output options list.', () => {
    const cases = [
      [null, [defaultOutputOptions]],
      [[], [defaultOutputOptions]],
      [{}, [defaultOutputOptions]],
      [
        {
          outputOptions: {
            format: 'cjs',
            name: '',
            sourcemap: true
          }
        },
        [
          {
            format: 'cjs',
            name: '',
            sourcemap: true
          }
        ]
      ],
      [
        {
          outputOptions: [
            {
              format: 'es',
              name: '',
              sourcemap: true
            },
            {
              format: 'cjs',
              name: '',
              sourcemap: true
            }
          ]
        },
        [
          {
            format: 'es',
            name: '',
            sourcemap: true
          },
          {
            format: 'cjs',
            name: '',
            sourcemap: true
          }
        ]
      ]
    ];

    cases.forEach(([options, expected]) => {
      const actual = outputOptions(options);

      assert(actual);
      assert.deepEqual(actual, expected);
    });
  });
});
