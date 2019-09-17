import write from './write';
import render from './render';
import formatCode from './formatCode';

/**
 * generate styleguide files
 *
 * @param {String} src source path
 * @param {String} dest destination path
 * @param {OPTIONS} options command line options
 * @return {Promise}
 */
export default async function generateStyleguideFiles(src = '', dest = '', options = {}) {
  if (typeof src !== 'string') {
    throw new TypeError('Argument "src" is not string.');
  }
  if (typeof dest !== 'string') {
    throw new TypeError('Argument "dest" is not string.');
  }

  const {verbose} = options;

  if (!options.styleguide) {
    return;
  }

  await render(`${src}/task/styleguide.js.hbs`, options)
    .then((output) => formatCode(output))
    .then((output) => write(output, `${dest}/task/styleguide.js`, {verbose}));
}
