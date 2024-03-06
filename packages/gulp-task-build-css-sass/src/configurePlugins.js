import autoprefixer from 'autoprefixer';
import cssmqpacker from 'css-mqpacker';

/**
 * default plugins
 *
 * @type {Object}
 */
export const defaultPlugins = {
  autoprefixer,
  cssmqpacker
};

/**
 * default plugin settings
 *
 * @type {Array<Object>}
 */
export const defaultPluginSettings = [
  {
    name: 'autoprefixer',
    factory: autoprefixer,
    config: {}
  },
  {
    name: 'css-mqpacker',
    factory: cssmqpacker,
    config: {}
  }
];

/**
 * configure plugin config
 *
 * @param {String} name plugin name
 * @param {Object} config plugin config
 * @param {import('./index.js').DEFAULT_OPTIONS} options options of @hidoo/gulp-task-build-css-sass
 * @return {Object}
 */
function configurePluginConfig(name, config = {}, options = {}) {
  const cfg = { ...config };

  if (name === 'autoprefixer') {
    if (options.browsers || options.targets) {
      cfg.overrideBrowserslist = options.browsers || options.targets;
    }
  }

  if (options.verbose) {
    console.debug('[DEBUG] "%s" config: %o', name, cfg);
  }

  return cfg;
}

/**
 * configure plugins
 *
 * @param {import('./index.js').DEFAULT_OPTIONS} options options of @hidoo/gulp-task-build-css-sass
 * @return {Array}
 */
export default function configurePlugins(options = {}) {
  const plugins = options?.postcssPlugins || null;

  if (Array.isArray(plugins)) {
    return plugins;
  }

  return defaultPluginSettings
    .map((settings, index) => {
      if (typeof plugins === 'function') {
        let newSettings = plugins(settings, {
          // eslint-disable-next-line no-magic-numbers
          current: index + 1,
          last: defaultPluginSettings.length
        });

        newSettings = Array.isArray(newSettings) ? newSettings : [newSettings];

        return newSettings
          .map((_settings) => {
            const { name, factory, config } = _settings;

            if (typeof factory === 'function') {
              return factory(configurePluginConfig(name, config, options));
            }
            return null;
          })
          .filter((plugin) => plugin !== null);
      }

      const { name, factory, config } = settings;

      return factory(configurePluginConfig(name, config, options));
    })
    .flat();
}
