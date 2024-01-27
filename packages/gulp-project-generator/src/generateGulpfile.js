import write from './write.js';
import render from './render.js';
import formatCode from './formatCode.js';

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

  await render(`${src}/gulpfile.js.hbs`, options)
    .then((output) => formatCode(output))
    .then((output) => write(output, `${dest}/gulpfile.js`, {verbose}));
}
