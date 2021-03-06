import write from './write';
import render from './render';
import formatCode from './formatCode';

/**
 * generate gulpfile
 *
 * @param {String} src source path
 * @param {String} dest destination path
 * @param {OPTIONS} options command line options
 * @return {Promise}
 */
export default async function generateGulpfile(src = '', dest = '', options = {}) {
  if (typeof src !== 'string') {
    throw new TypeError('Argument "src" is not string.');
  }
  if (typeof dest !== 'string') {
    throw new TypeError('Argument "dest" is not string.');
  }

  const {verbose} = options;

  await render(`${src}/gulpfile.babel.js.hbs`, options)
    .then((output) => formatCode(output))
    .then((output) => write(output, `${dest}/gulpfile.babel.js`, {verbose}));
}
