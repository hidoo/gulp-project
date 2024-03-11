import assert from 'node:assert';
import configure, {
  settings,
  autoprefixer,
  cssmqpacker
} from '../src/plugins.js';

describe('plugins', () => {
  it('should return configured plugins.', () => {
    const cases = [
      [
        'If no arguments specified:',
        undefined, // eslint-disable-line no-undefined
        settings.map(({ factory, config }) => factory(config))
      ],
      [
        'If empty array specified.',
        {
          postcssPlugins: []
        },
        []
      ],
      [
        'If configured plugins specified.',
        {
          postcssPlugins: [autoprefixer()]
        },
        [autoprefixer()]
      ],
      [
        'If function specified.',
        {
          postcssPlugins({ name, factory, config }) {
            if (name === 'autoprefixer') {
              return {
                name: 'hoge',
                factory() {
                  return { name: 'hoge' };
                },
                config
              };
            }
            return { name, factory, config };
          }
        },
        settings.map(({ name, factory, config }) => {
          if (name === 'autoprefixer') {
            return { name: 'hoge' };
          }
          return factory(config);
        })
      ],
      [
        'If function specified. (multiple plugins)',
        {
          postcssPlugins({ name, factory, config }) {
            if (name === 'autoprefixer') {
              return [
                {
                  name: 'hoge',
                  factory() {
                    return { name: 'hoge' };
                  },
                  config
                },
                {
                  name: 'fuga',
                  factory() {
                    return { name: 'fuga' };
                  },
                  config
                }
              ];
            }
            return { name, factory, config };
          }
        },
        settings
          .map(({ name, factory, config }) => {
            if (name === 'autoprefixer') {
              return [{ name: 'hoge' }, { name: 'fuga' }];
            }
            return factory(config);
          })
          .flat()
      ]
    ];

    cases.forEach(([message, options, expected]) => {
      const actual = configure(options);

      assert.deepEqual(
        actual.map(({ postcssPlugin }) => postcssPlugin),
        expected.map(({ postcssPlugin }) => postcssPlugin),
        message
      );
    });
  });

  describe('settings', () => {
    it('should named export as an Array.', () => {
      assert(Array.isArray(settings));
    });
  });

  describe('exports postcss plugins', () => {
    it('should be accessible to postcss plugins', async () => {
      assert.equal((await import('autoprefixer')).default, autoprefixer);
      assert.equal((await import('css-mqpacker')).default, cssmqpacker);
    });
  });
});
