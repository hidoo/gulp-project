import write from './write.js';
import render from './render.js';
import {formatJS} from './format.js';

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
    .then((output) => formatJS(output))
    .then((output) => write(output, `${dest}/task/styleguide.js`, {verbose}));
}
