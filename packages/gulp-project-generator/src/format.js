import * as prettier from 'prettier';

/**
 * return formatted code by prettier
 *
 * @param {String} src raw code
 * @param {Object} options options
 * @return {Promise}
 */
export default async function format(src = '', options = {}) {
  if (typeof src !== 'string') {
    throw new TypeError('Argument "src" is not string.');
  }

  const formatted = await prettier.format(src, {
    trailingComma: 'none',
    singleQuote: true,
    parser: 'espree',
    ...options
  });

  return formatted || src;
}
