import log from 'fancy-log';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import babel from 'rollup-plugin-babel';
import license from 'rollup-plugin-license';
import nodeResolveOptions from './nodeResolveOptions';
import commonjsOptions from './commonjsOptions';
import jsonOptions from './jsonOptions';
import babelOptions from './babelOptions';
import licenseOptions from './licenseOptions';

/**
 * handle rollup.js warnings
 *
 * @param {Object} warnings warning object
 * @return {void}
 */
function handleOnWarn(warnings) {
  const {loc, frame, message} = warnings;

  if (loc) {
    log.warn(`${loc.file} (${loc.line}:${loc.column}) ${message}`);
    if (frame) {
      log.warn(frame);
    }
  }
  else {
    log.warn(message);
  }
}

/**
 * return input options for rollup.js
 *
 * @param {DEFAULT_OPTIONS} options option
 * @return {Object}
 */
export default function inputOptions(options = {}) {
  const defaultPlugins = [
    replace({'process.env.NODE_ENV': `'${process.env.NODE_ENV}'`}), // eslint-disable-line no-process-env,
    license(licenseOptions())
  ];

  if (!options) {
    return {
      input: '',
      plugins: defaultPlugins,
      onwarn() {} // eslint-disable-line no-empty-function
    };
  }

  if (
    options && options.inputOptions &&
    typeof options.inputOptions === 'object' &&
    !Array.isArray(options.inputOptions) && options.inputOptions !== null
  ) {
    const {input, plugins, ...restInputOptions} = options.inputOptions;
    const newPlugins = [
      resolve(nodeResolveOptions(options)),
      json(jsonOptions(options)),
      babel(babelOptions(options)),
      commonjs(commonjsOptions(options)),
      ...defaultPlugins
    ];

    return {
      input: options.src || input,
      plugins: Array.isArray(plugins) ? newPlugins.concat(plugins) : newPlugins,
      onwarn: options.verbose ? handleOnWarn : () => {}, // eslint-disable-line no-empty-function
      ...restInputOptions
    };
  }
  return {
    input: options.src || '',
    plugins: defaultPlugins,
    onwarn: options.verbose ? handleOnWarn : () => {} // eslint-disable-line no-empty-function
  };
}
