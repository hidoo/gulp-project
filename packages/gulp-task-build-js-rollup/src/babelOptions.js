import mergeBabelrc from '@hidoo/util-merge-babelrc';

/**
 * return options for rollup-plugin-babel
 * @param {DEFAULT_OPTIONS} options option
 * @return {Object}
 */
export default function babelOptions(options = {}) {
  const defaultOptions = {
    babelrc: false,
    externalHelpers: true,
    exclude: 'node_modules/**',
    presets: [],
    plugins: []
  };

  if (options === null) {
    return mergeBabelrc('', defaultOptions, {});
  }

  const overrideOptions = {
    ...defaultOptions,
    presets: [
      ['@babel/preset-env', {
        modules: false,
        targets: {browsers: options.browsers ? options.browsers : []},
        useBuiltIns: options.useBuiltIns ? options.useBuiltIns : false,
        debug: options.verbose ? options.verbose : false
      }]
    ]
  };

  return mergeBabelrc(options.babelrc || '', overrideOptions, {
    verbose: options.verbose ? options.verbose : false
  });
}
