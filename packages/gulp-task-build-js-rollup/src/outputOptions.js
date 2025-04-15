/**
 * default output options
 *
 * @type {Object}
 */
export const defaultOutputOptions = {
  format: 'iife',
  name: '',
  sourcemap: process.env.NODE_ENV === 'development' ? 'inline' : false
};

/**
 * return input options for rollup.js
 *
 * @param {DEFAULT_OPTIONS} options option
 * @return {Array}
 */
export default function outputOptions(options = {}) {
  const outputOpts = options?.outputOptions;

  if (Array.isArray(outputOpts)) {
    return outputOpts;
  } else if (typeof outputOpts === 'object' && outputOpts !== null) {
    return [
      {
        ...defaultOutputOptions,
        ...outputOpts
      }
    ];
  }
  return [defaultOutputOptions];
}
