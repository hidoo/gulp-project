import assert from 'node:assert';
import configurePlugins, {
  defaultPluginSettings,
  defaultPlugins
} from '../src/configurePlugins.js';

describe('configurePlugins', () => {
  let autoprefixer = null;

  before(async () => {
    autoprefixer = (await import('autoprefixer')).default;
  });

  after(() => {
    autoprefixer = null;
  });

  it('should return configured plugins.', () => {
    const cases = [
      [
        'If no arguments specified:',
        undefined, // eslint-disable-line no-undefined
        defaultPluginSettings.map(({ factory, config }) => factory(config))
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
        defaultPluginSettings.map(({ name, factory, config }) => {
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
        defaultPluginSettings
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
      const actual = configurePlugins(options);

      assert.deepEqual(
        actual.map(({ postcssPlugin }) => postcssPlugin),
        expected.map(({ postcssPlugin }) => postcssPlugin),
        message
      );
    });
  });

  describe('defaultPluginSettings', () => {
    it('should named export as an Array.', () => {
      assert(Array.isArray(defaultPluginSettings));
    });
  });

  describe('defaultPlugins', () => {
    it('should named export as an Object.', () => {
      assert(
        typeof defaultPlugins === 'object' &&
          !(Array.isArray(defaultPlugins) && defaultPlugins === null)
      );
    });
  });
});
