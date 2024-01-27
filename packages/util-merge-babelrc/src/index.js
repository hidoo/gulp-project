import {createRequire} from 'node:module';
import merge from 'lodash.merge';
import log from 'fancy-log';

/**
 * commonjs style require
 *
 * @type {Function}
 */
const require = createRequire(import.meta.url);

/**
 * default options
 *
 * @type {Object}
 */
const DEFAULT_OPTIONS = {

  // specifiy targets that leave after merging
  // in @babel/preset-env options
  presetEnvAllowTargets: ['browsers'],

  // remove env fields or not
  removeEnv: false,

  // out log or not
  verbose: false
};

/**
 * return normalize presets
 *
 * @param {Array} presets presets
 * @return {Array}
 */
export function normalizeBabelPresets(presets = []) {
  if (!Array.isArray(presets)) {
    return [];
  }
  return presets.map((preset) => {
    // return as it if preset is array and first element in preset is valid string
    if (Array.isArray(preset) && typeof preset[0] === 'string' && preset[0] !== '') {
      const name = preset[0];
      const opts = preset[1] || {};

      return [name, opts];
    }
    // return wrapped preset with array if preset is valid string
    else if (typeof preset === 'string' && preset !== '') {
      return [preset, {}];
    }
    // other return empty array
    return [];
  });
}

/**
 * return specified name preset
 *
 * @param {String} name preset name
 * @param {Array} presets presets
 * @return {Array}
 */
export function findBabelPreset(name = '', presets = []) {
  if (!Array.isArray(presets)) {
    return [];
  }
  if (typeof name !== 'string' || name === '') {
    return [];
  }

  const target = presets.find((preset) => preset === name || preset[0] === name);

  if (target) {
    return Array.isArray(target) ? target : [target];
  }
  return [];
}

/**
 * hoist target value from options of @babel/preset-env
 *
 * @param {Array} presets babelrc presets
 * @return {Array}
 */
export function hoistTargetsFromPresetEnv(presets = []) {
  let targets = null;

  const reducedPresets = presets.map(([name, opts]) => {
    const preset = [name];

    if (!targets && (name === '@babel/preset-env' || name === '@babel/env')) {
      if (opts && opts.targets) {
        targets = opts.targets;
        delete opts.targets;
      }
    }
    if (opts) {
      preset.push(opts);
    }
    return preset;
  });

  return [targets, reducedPresets];
}

/**
 * return merged babelrc presets
 *
 * @param {Array} presets babelrc presets
 * @param {Array} source target of merge
 * @param {DEFAULT_OPTIONS} options option
 * @return {Array}
 */
export function mergeBabelPresets(presets = [], source = [], options = {}) {
  const originalPresets = normalizeBabelPresets(presets),
        sourcePresets = normalizeBabelPresets(source),
        mergedNames = [];

  const overridePresets = originalPresets.map((originalPreset) => {
    const [name, originalOptions] = originalPreset,
          sourcePreset = findBabelPreset(name, sourcePresets),
          [, sourceOptions] = sourcePreset;
    let mergedOptions = originalOptions;

    // merge options of same preset if defined sourceOptions
    if (sourceOptions) {
      mergedOptions = merge(merge({}, originalOptions), merge({}, sourceOptions));
    }

    mergedNames.push(name);
    return [name, mergedOptions];
  });

  const restPresets = sourcePresets.filter(([name]) => !mergedNames.includes(name)),
        mergedPresets = [...restPresets, ...overridePresets];

  return mergedPresets
    .map(([name, opts]) => {

      // @babel/preset-env options
      if (name === '@babel/preset-env' || name === '@babel/env') {
        const {useBuiltIns, corejs} = opts;

        // remove corejs options when useBuiltIns options is not set
        if (!useBuiltIns || !corejs) {
          delete opts.corejs;
        }

        // merge targets options by options.presetEnvAllowTargets value
        if (opts.targets) {
          if (
            typeof opts.targets === 'object' &&
            !Array.isArray(opts.targets) &&
            opts.targets !== null &&
            Array.isArray(options.presetEnvAllowTargets)
          ) {
            opts.targets = Object.entries(opts.targets)
              .filter(([key]) => options.presetEnvAllowTargets.includes(key))
              .reduce((prev, [key, value]) => {
                return {...prev, [key]: value};
              }, {});
          }
        }
      }

      return [name, opts];
    })
    .sort((a, b) => a[0].localeCompare(b[0])); // eslint-disable-line id-length
}

/**
 * return merged babelrc plugins
 *
 * @param {Array} plugins babelrc plugins
 * @param {Array} source target of merge
 * @return {Array}
 */
export function mergeBabelPlugins(plugins = [], source = []) {
  if (!Array.isArray(plugins) && !Array.isArray(source)) {
    return [];
  }
  else if (!Array.isArray(plugins)) {
    return [...source];
  }
  else if (!Array.isArray(source)) {
    return [...plugins];
  }
  return [...plugins, ...source];
}

/**
 * return merged babelrc
 *
 * @param {String} [path=''] path to babelrc (Supported only .cjs or .json)
 * @param {Object} [source={}] target of merge
 * @param {DEFAULT_OPTIONS} [options={}] options
 * @return {Object}
 *
 * @example
 * import mergeBabelrc from '@hidoo/gulp-util-merge-babelrc';
 *
 * const babelOptions = mergeBabelrc('/path/to/.babelrc.json', {
 *   presets: [
 *     // some presets ...
 *   ],
 *   plugins: [
 *     // some presets ...
 *   ],
 *   useBuiltIns: 'usege'
 * });
 */
export default function mergeBabelrc(path = '', source = {}, options = {}) {
  const opts = {...DEFAULT_OPTIONS, ...options};
  let babelrc = {};
  let targets = null;

  if (typeof path === 'string' && path !== '') {
    babelrc = require(path); // eslint-disable-line import/no-dynamic-require
    if (opts.verbose) {
      log.info(`Using babelrc: ${path}`);
    }
    if (options.removeEnv && babelrc.env) {
      delete babelrc.env;
    }
  }

  const [hoistedTargets, presets] = hoistTargetsFromPresetEnv(
    mergeBabelPresets(babelrc.presets, source.presets, opts)
  );

  targets = source.targets || hoistedTargets;

  // set 'default'
  // if targets is empty object or empty array
  if (
    targets &&
    typeof targets === 'object' &&
    !Object.keys(targets).length
  ) {
    targets = null;
  }

  return {
    ...babelrc,
    ...source,
    targets: targets || 'defaults',
    presets,
    plugins: mergeBabelPlugins(babelrc.plugins, source.plugins)
  };
}
