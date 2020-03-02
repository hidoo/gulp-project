/**
 * return options for @rollup/plugin-json
 *
 * @param {DEFAULT_OPTIONS} options option
 * @return {Object}
 */
export default function jsonOptions(options) {
  const defaultOptions = {
    indent: '  '
  };

  if (
    options && options.jsonOptions &&
    typeof options.jsonOptions === 'object' &&
    !Array.isArray(options.jsonOptions) && options.jsonOptions !== null
  ) {
    return {
      ...defaultOptions,
      ...options.jsonOptions
    };
  }
  return defaultOptions;

}
