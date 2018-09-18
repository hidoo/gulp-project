import mkdir from './mkdir';
import copy from './copy';
import write from './write';
import render from './render';
import formatCode from './formatCode';

/**
 * generate css files
 * @param {String} src source path
 * @param {String} dest destination path
 * @param {OPTIONS} options command line options
 * @return {Promise}
 */
export default async function generateCssFiles(src = '', dest = '', options = {}) {
  if (typeof src !== 'string') {
    throw new TypeError('Argument "src" is not string.');
  }
  if (typeof dest !== 'string') {
    throw new TypeError('Argument "dest" is not string.');
  }

  const {verbose} = options;

  try {
    if (options.css) {
      await render(`${src}/task/css.js.hbs`, options)
        .then((output) => formatCode(output))
        .then((output) => write(output, `${dest}/task/css.js`, {verbose}));

      await mkdir(`${dest}/src/css`, {verbose});
      await copy(`${src}/src/css/**/*.{styl,md}`, `${dest}/src/css`, {verbose});

      if (options.cssDeps) {
        await copy(`${src}/src/cssDeps/**/*.css`, `${dest}/src/css`, {verbose});
      }
    }
  }
  catch (error) {
    throw error;
  }
}
