import merge from 'lodash.merge';
import log from 'fancy-log';

/**
 * default options
 * @type {Object}
 */
const DEFAULT_OPTIONS = {

  // specifiy targets that leave after merging
  // in @babel/preset-env options
  presetEnvAllowTargets: ['browsers'],

  // out log or not
  verbose: false
};

/**
 * return normalize presets
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
      return preset;
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
 * return merged babelrc presets
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

    // merge targets in @babel/preset-env options
    // by options.presetEnvAllowTargets value
    if (
      (name === '@babel/preset-env' || name === '@babel/env') &&
      mergedOptions.targets &&
      Array.isArray(options.presetEnvAllowTargets)
    ) {
      mergedOptions.targets = Object.entries(mergedOptions.targets)
        .filter(([key]) => options.presetEnvAllowTargets.includes(key))
        .reduce((prev, [key, value]) => ({...prev, [key]: value}), {});
    }

    mergedNames.push(name);
    return [name, mergedOptions];
  });

  const restPresets = sourcePresets.filter(([name]) => !mergedNames.includes(name));

  return [...restPresets, ...overridePresets].sort((a, b) => a[0].localeCompare(b[0]));
}

/**
 * return merged babelrc plugins
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
 * @param {String} path path to babelrc
 * @param {Object} source target of merge
 * @param {DEFAULT_OPTIONS} options options
 * @return {Object}
 *
 * @example
 * import mergeBabelrc from '@hidoo/gulp-util-merge-babelrc';
 *
 * const babelOptions = mergeBabelrc('/path/to/.babelrc.js', {
 *   presets: [...],
 *   plugins: [...],
 *   useBuiltIns: 'usege'
 * });
 */
export default function mergeBabelrc(path = '', source, options = {}) {
  const opts = {...DEFAULT_OPTIONS, ...options};
  let babelrc = {};

  if (typeof path === 'string' && path !== '') {
    babelrc = require(path); // eslint-disable-line global-require
    if (opts.verbose) {
      log.info(`Using babelrc: ${path}`);
    }
  }

  return {
    ...babelrc,
    ...source,
    presets: mergeBabelPresets(babelrc.presets, source.presets, opts),
    plugins: mergeBabelPlugins(babelrc.plugins, source.plugins)
  };
}
