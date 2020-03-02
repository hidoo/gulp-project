/**
 * return options for @rollup/plugin-alias
 *
 * @param {DEFAULT_OPTIONS} options option
 * @return {Object}
 */
export default function aliasOptions(options) {
  const defaultOptions = {
    entries: []
  };

  if (
    options && options.aliasOptions &&
    typeof options.aliasOptions === 'object' &&
    !Array.isArray(options.aliasOptions) && options.aliasOptions !== null
  ) {
    let entries = options.aliasOptions.entries || [];

    if (
      typeof entries === 'object' &&
      !Array.isArray(entries) && entries !== null
    ) {
      entries = Object.entries(entries).map(([key, value]) => {
        return {find: key, replacement: value};
      });
    }

    return {
      ...defaultOptions,
      ...options.aliasOptions,
      entries
    };
  }
  return defaultOptions;
}
