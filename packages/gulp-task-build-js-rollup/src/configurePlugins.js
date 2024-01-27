import alias from '@rollup/plugin-alias';
import {babel} from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import {nodeResolve} from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import license from 'rollup-plugin-license';

/**
 * default plugins
 *
 * @type {Object}
 */
export const defaultPlugins = {
  alias,
  babel,
  commonjs,
  json,
  nodeResolve,
  replace,
  license
};

/**
 * default plugin settings
 *
 * @type {Array<Object>}
 */
export const defaultPluginSettings = [
  {
    name: 'alias',
    factory: alias,
    config: {
      entries: []
    }
  },
  {
    name: 'json',
    factory: json,
    config: {
      indent: '  '
    }
  },
  {
    name: 'node-resolve',
    factory: nodeResolve,
    config: {
      mainFields: [
        'browser',
        'module',
        'jsnext:main',
        'jsnext',
        'main'
      ]
    }
  },
  {
    name: 'commonjs',
    factory: commonjs,
    config: {
      defaultIsModuleExports: true,
      sourceMap: false
    }
  },
  {
    name: 'babel',
    factory: babel,
    config: {
      babelHelpers: 'bundled'
    }
  },
  {
    name: 'replace',
    factory: replace,
    config: {
      'preventAssignment': true,
      // eslint-disable-next-line node/no-process-env
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    }
  },
  {
    name: 'license',
    factory: license,
    config: {
      /* eslint-disable max-len */
      banner: '' +
        '@license\n' +
        '\n' +
        '<%= pkg.title || pkg.name %>:\n' +
        '<% if (pkg.author) { %>' +
        '  author: <%= pkg.author %>\n' +
        '<% } %>' +
        '<% if (pkg.version) { %>' +
        '  version: <%= pkg.version %>\n' +
        '<% } %>' +
        '<% dependencies.forEach((dependency) => { %>\n' +
        '<%= dependency.name %>:\n' +
        '<% if (dependency.license) { %>' +
        '  license: <%= dependency.license %>\n' +
        '<% } %>' +
        '<% if (dependency.author && dependency.author.name) { %>' +
          '  author: <%= dependency.author.name %><% if (dependency.author.email) { %> <<%= dependency.author.email %>><% } %>\n' +
        '<% } %>' +
        '<% if (dependency.version) { %>' +
        '  version: <%= dependency.version %>\n' +
        '<% } %>' +
        '<% }) %>'
      /* eslint-enable max-len */
    }
  }
];

/**
 * configure plugin config
 *
 * @param {String} name plugin name
 * @param {Object} [config={}] plugin config
 * @param {DEFAULT_OPTIONS} [options={}] options of @hidoo/gulp-task-build-js-rollup
 * @return {Object}
 */
function configurePluginConfig(name, config = {}, options = {}) {
  if (name === 'babel') {
    if (options.browsers || options.targets) {
      config.targets = options.browsers || options.targets;
    }
  }

  if (options.verbose) {
    console.debug(
      '[DEBUG] "%s" config: %o',
      name,
      config
    );
  }

  return config;
}

/**
 * configure plugins
 *
 * @param {DEFAULT_OPTIONS} [options={}] options of @hidoo/gulp-task-build-js-rollup
 * @return {Array}
 */
export default function configurePlugins(options = {}) {
  const {plugins} = options?.inputOptions || {};

  if (Array.isArray(plugins)) {
    return plugins;
  }

  return defaultPluginSettings
    .map((settings) => {
      if (typeof plugins === 'function') {
        let newSettings = plugins(settings);

        newSettings = Array.isArray(newSettings) ? newSettings : [newSettings];

        return newSettings
          .map((_settings) => {
            const {name, factory, config} = _settings;

            if (typeof factory === 'function') {
              return factory(configurePluginConfig(name, config, options));
            }
            return null;
          })
          .filter((plugin) => plugin !== null);
      }

      const {name, factory, config} = settings;

      return factory(configurePluginConfig(name, config, options));
    })
    .flat();
}
