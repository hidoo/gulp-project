/* eslint max-len: off, no-magic-numbers: off */

import assert from 'node:assert';
import inputOptions from '../src/inputOptions.js';
import configurePlugins from '../src/configurePlugins.js';

describe('inputOptions', () => {
  it('should throw error if options is not object.', () => {
    const cases = ['', [], null];

    cases.forEach((options) => {
      let err = null;

      try {
        inputOptions(options);
      } catch (error) {
        err = error;
      }

      assert(err instanceof Error, `when ${typeof options} specified.`);
    });
  });

  it('should throw error if input source is not set.', () => {
    let err = null;

    try {
      inputOptions({
        src: null,
        inputOptions: {
          input: null
        }
      });
    } catch (error) {
      err = error;
    }

    assert(err instanceof Error);
  });

  it('should return merged input options.', () => {
    const cases = [
      [
        {
          src: '/path/to/src'
        },
        {
          input: '/path/to/src'
        }
      ],
      [
        {
          inputOptions: {
            input: '/path/to/src'
          }
        },
        {
          input: '/path/to/src'
        }
      ],
      [
        {
          src: '/path/to/src',
          inputOptions: {
            plugins: [
              () => {
                return {
                  name: 'hoge'
                };
              }
            ]
          }
        },
        {
          input: '/path/to/src'
        }
      ]
    ];

    cases.forEach(([options, expected]) => {
      const { onwarn, plugins, ...actual } = inputOptions(options);

      assert.deepEqual(actual, expected);
      assert(typeof onwarn === 'function');
      assert.deepEqual(
        plugins.map(({ name }) => name),
        configurePlugins(options).map(({ name }) => name)
      );
    });
  });
});
