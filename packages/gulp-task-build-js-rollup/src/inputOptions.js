import log from 'fancy-log';
import configurePlugins from './configurePlugins.js';

/**
 * handle rollup.js warnings
 *
 * @param {Object} warnings warning object
 * @return {void}
 */
function handleOnWarn(warnings) {
  const { loc, frame, message } = warnings;

  if (loc) {
    log.warn(`${loc.file} (${loc.line}:${loc.column}) ${message}`);
    if (frame) {
      log.warn(frame);
    }
  } else {
    log.warn(message);
  }
}

/**
 * return input options for rollup.js
 *
 * @param {DEFAULT_OPTIONS} options options of @hidoo/gulp-task-build-js-rollup
 * @return {Object}
 */
export default function inputOptions(options) {
  if (!options || typeof options !== 'object' || Array.isArray(options)) {
    throw new Error('Argument #1 "options" must be Object.');
  }

  const inputOpts = options?.inputOptions || {};
  const input = inputOpts.input || options.src;

  if (!input) {
    throw new Error('Input source is not set.');
  }

  return {
    ...inputOpts,
    input,
    plugins: configurePlugins(options),
    onwarn: options.verbose ? handleOnWarn : () => {} // eslint-disable-line no-empty-function
  };
}
