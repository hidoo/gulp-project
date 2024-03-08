import autoprefixer from 'autoprefixer';
import cssmqpacker from 'css-mqpacker';
import log from './log.js';

// export postcss plugins
export { autoprefixer, cssmqpacker };

/**
 * plugin settings
 *
 * @type {Array<{name: String, factory: Function, config: Object}>}
 */
export const settings = [
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
 * @param {import('./index.js').defaultOptions} options options
 * @return {Object}
 */
function configureConfig(name, config = {}, options = {}) {
  const cfg = { ...config };

  if (name === 'autoprefixer') {
    if (options.browsers || options.targets) {
      cfg.overrideBrowserslist = options.browsers || options.targets;
    }
  }

  if (options.verbose) {
    log('Configure %s with options: %o', name, cfg);
  }

  return cfg;
}

/**
 * configure plugins
 *
 * @param {import('./index.js').defaultOptions} options options
 * @return {Array}
 */
export default function configure(options = {}) {
  const postcssPlugins = options?.postcssPlugins || null;

  if (Array.isArray(postcssPlugins)) {
    return postcssPlugins;
  }

  const pluginInfo = (plugin) => {
    if (typeof plugin.info === 'function' && options.verbose) {
      log('Debug %s: %s', plugin.postcssPlugin, plugin.info());
    }
  };

  return settings
    .map((setting, index) => {
      if (typeof postcssPlugins === 'function') {
        let newSetting = postcssPlugins(setting, {
          // eslint-disable-next-line no-magic-numbers
          current: index + 1,
          last: settings.length
        });

        newSetting = Array.isArray(newSetting) ? newSetting : [newSetting];

        return newSetting
          .map((_settings) => {
            const { name, factory, config } = _settings;

            if (typeof factory === 'function') {
              const plugin = factory(configureConfig(name, config, options));

              pluginInfo(plugin);
              return plugin;
            }
            return null;
          })
          .filter((plugin) => plugin !== null);
      }

      const { name, factory, config } = setting;
      const plugin = factory(configureConfig(name, config, options));

      pluginInfo(plugin);
      return plugin;
    })
    .flat();
}
