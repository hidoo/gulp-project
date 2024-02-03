import assert from 'node:assert';
import configurePlugins, {
  defaultPluginSettings,
  defaultPlugins
} from '../src/configurePlugins.js';

describe('configurePlugins', () => {
  let commonjs = null;

  before(async () => {
    commonjs = (await import('@rollup/plugin-commonjs')).default;
  });

  after(() => {
    commonjs = null;
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
          inputOptions: {
            plugins: []
          }
        },
        []
      ],
      [
        'If configured plugins specified.',
        {
          inputOptions: {
            plugins: [commonjs()]
          }
        },
        [commonjs()]
      ],
      [
        'If function specified.',
        {
          inputOptions: {
            plugins({ name, factory, config }) {
              if (name === 'commonjs') {
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
          }
        },
        defaultPluginSettings.map(({ name, factory, config }) => {
          if (name === 'commonjs') {
            return { name: 'hoge' };
          }
          return factory(config);
        })
      ],
      [
        'If function specified. (multiple plugins)',
        {
          inputOptions: {
            plugins({ name, factory, config }) {
              if (name === 'commonjs') {
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
          }
        },
        defaultPluginSettings
          .map(({ name, factory, config }) => {
            if (name === 'commonjs') {
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
        actual.map(({ name }) => name),
        expected.map(({ name }) => name),
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
