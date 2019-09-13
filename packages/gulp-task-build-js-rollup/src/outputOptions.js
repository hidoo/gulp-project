/**
 * return input options for rollup.js
 *
 * @param {DEFAULT_OPTIONS} options option
 * @return {Object}
 */
export default function outputOptions(options = {}) {
  const defaultOptions = {
    format: 'iife',
    name: '',
    sourcemap: 'inline'
  };

  if (
    options && options.outputOptions &&
    typeof options.outputOptions === 'object' &&
    !Array.isArray(options.outputOptions) && options.outputOptions !== null
  ) {
    return {
      format: 'iife',
      name: '',
      sourcemap: 'inline',
      ...options.outputOptions
    };
  }
  return defaultOptions;
}
