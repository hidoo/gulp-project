/**
 * return options for rollup-plugin-node-resolve
 * @param {DEFAULT_OPTIONS} options option
 * @return {Object}
 */
export default function nodeResolveOptions(options) {
  const defaultOptions = {
    module: true,
    jsnext: true,
    main: true
  };

  if (
    options && options.nodeResolveOptions &&
    typeof options.nodeResolveOptions === 'object' &&
    !Array.isArray(options.nodeResolveOptions) && options.nodeResolveOptions !== null
  ) {
    return {...defaultOptions, ...options.nodeResolveOptions};
  }
  return defaultOptions;
}
