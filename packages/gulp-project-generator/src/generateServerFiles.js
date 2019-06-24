import mkdir from './mkdir';
import copy from './copy';
import write from './write';
import render from './render';
import formatCode from './formatCode';

/**
 * generate local dev server files
 * @param {String} src source path
 * @param {String} dest destination path
 * @param {OPTIONS} options command line options
 * @return {Promise}
 */
export default async function generateServerFiles(src = '', dest = '', options = {}) {
  if (typeof src !== 'string') {
    throw new TypeError('Argument "src" is not string.');
  }
  if (typeof dest !== 'string') {
    throw new TypeError('Argument "dest" is not string.');
  }

  const {verbose} = options;

  if (options.server) {
    await render(`${src}/task/server.js.hbs`, options)
      .then((output) => formatCode(output))
      .then((output) => write(output, `${dest}/task/server.js`, {verbose}));

    await mkdir(`${dest}/src/server`, {verbose});
    await copy(`${src}/src/server/**/*.{js,hbs}`, `${dest}/src/server`, {verbose});
  }
}
