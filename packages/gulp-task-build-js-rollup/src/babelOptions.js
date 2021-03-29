import mergeBabelrc from '@hidoo/util-merge-babelrc';

/**
 * return options for rollup-plugin-babel
 *
 * @param {DEFAULT_OPTIONS} options option
 * @return {Object}
 */
export default function babelOptions(options = {}) {
  const defaultOptions = {
    babelrc: false,
    babelHelpers: 'bundled',
    exclude: 'node_modules/**',
    presets: [],
    plugins: []
  };

  if (options === null) {
    return mergeBabelrc('', defaultOptions, {});
  }

  const overrideOptions = {
    ...defaultOptions,
    targets: options.browsers || options.targets || null,
    presets: [
      ['@babel/preset-env', {
        modules: false,
        useBuiltIns: options.useBuiltIns ? options.useBuiltIns : false,
        corejs: options.corejs ? options.corejs : 3, // eslint-disable-line no-magic-numbers
        debug: options.verbose ? options.verbose : false
      }]
    ]
  };

  return mergeBabelrc(options.babelrc || '', overrideOptions, {
    removeEnv: true,
    verbose: options.verbose ? options.verbose : false
  });
}
