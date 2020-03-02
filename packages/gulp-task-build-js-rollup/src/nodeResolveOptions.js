/**
 * return options for rollup-plugin-node-resolve
 *
 * @param {DEFAULT_OPTIONS} options option
 * @return {Object}
 */
export default function nodeResolveOptions(options) {
  const defaultOptions = {
    mainFields: ['browser', 'module', 'jsnext', 'main']
  };

  if (
    options && options.nodeResolveOptions &&
    typeof options.nodeResolveOptions === 'object' &&
    !Array.isArray(options.nodeResolveOptions) && options.nodeResolveOptions !== null
  ) {
    return {
      ...defaultOptions,
      ...options.nodeResolveOptions,
      mainFields: Array.isArray(options.nodeResolveOptions.mainFields) ?
        options.nodeResolveOptions.mainFields : defaultOptions.mainFields
    };
  }
  return defaultOptions;
}
