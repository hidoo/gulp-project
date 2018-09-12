import mkdir from './mkdir';
import copy from './copy';
import write from './write';
import render from './render';
import formatCode from './formatCode';

/**
 * generate javascript files
 * @param {String} src source path
 * @param {String} dest destination path
 * @param {OPTIONS} options command line options
 * @return {Promise}
 */
export default async function generateJsFiles(src = '', dest = '', options = {}) {
  if (typeof src !== 'string') {
    throw new TypeError('Argument "src" is not string.');
  }
  if (typeof dest !== 'string') {
    throw new TypeError('Argument "dest" is not string.');
  }

  const {verbose} = options;

  try {
    if (options.js) {
      await render(`${src}/task/js.js.hbs`, options)
        .then((output) => formatCode(output))
        .then((output) => write(output, `${dest}/task/js.js`, {verbose}));

      await mkdir(`${dest}/src/js`, {verbose});
      await copy(`${src}/src/js/**/*.{js,opts}`, `${dest}/src/js`, {verbose});
    }
  }
  catch (error) {
    throw error;
  }
}
