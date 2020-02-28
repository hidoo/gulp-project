/**
 * return options for rollup-plugin-commonjs
 *
 * @param {DEFAULT_OPTIONS} options option
 * @return {Object}
 */
export default function commonjsOptions(options) {
  const defaultOptions = {
    sourceMap: false
  };

  if (
    options && options.commonjsOptions &&
    typeof options.commonjsOptions === 'object' &&
    !Array.isArray(options.commonjsOptions) && options.commonjsOptions !== null
  ) {
    return {
      ...defaultOptions,
      ...options.commonjsOptions
    };
  }
  return defaultOptions;
}
