import mkdir from './mkdir';
import copy from './copy';
import write from './write';
import render from './render';
import formatCode from './formatCode';

/**
 * generate html files
 * @param {String} src source path
 * @param {String} dest destination path
 * @param {OPTIONS} options command line options
 * @return {Promise}
 */
export default async function generateHtmlFiles(src = '', dest = '', options = {}) {
  if (typeof src !== 'string') {
    throw new TypeError('Argument "src" is not string.');
  }
  if (typeof dest !== 'string') {
    throw new TypeError('Argument "dest" is not string.');
  }

  const {verbose} = options;

  try {
    if (options.html) {
      await render(`${src}/task/html.js.hbs`, options)
        .then((output) => formatCode(output))
        .then((output) => write(output, `${dest}/task/html.js`, {verbose}));

      await mkdir(`${dest}/src/html`, {verbose});
      await copy(`${src}/src/html/**/*.hbs`, `${dest}/src/html`, {verbose});

      await mkdir(`${dest}/src/data`, {verbose});
      await copy(`${src}/src/data/**/*.{yaml,yml,json5,json}`, `${dest}/src/data`, {verbose}); // eslint-disable-line max-len
    }
  }
  catch (error) {
    throw error;
  }
}
