import path from 'path';

/**
 * return options for rollup-plugin-commonjs
 * @param {DEFAULT_OPTIONS} options option
 * @return {Object}
 */
export default function commonjsOptions(options) {
  const defaultOptions = {
    sourceMap: false,
    include: [
      path.resolve(process.cwd(), 'node_modules/**')
    ]
  };

  if (options && typeof options.src === 'string') {
    defaultOptions.include.push(
      `${path.resolve(process.cwd(), path.dirname(options.src))}/**`
    );
  }

  if (
    options && options.commonjsOptions &&
    typeof options.commonjsOptions === 'object' &&
    !Array.isArray(options.commonjsOptions) && options.commonjsOptions !== null
  ) {
    return {
      ...defaultOptions,
      ...options.commonjsOptions,
      include: Array.isArray(options.commonjsOptions.include) ?
        defaultOptions.include.concat(options.commonjsOptions.include) :
        defaultOptions.include
    };
  }
  return defaultOptions;
}
