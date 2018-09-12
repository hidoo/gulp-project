import mkdir from './mkdir';
import copy from './copy';
import write from './write';
import render from './render';
import formatCode from './formatCode';

/**
 * generate image files
 * @param {String} src source path
 * @param {String} dest destination path
 * @param {OPTIONS} options command line options
 * @return {Promise}
 */
export default async function generateImageFiles(src = '', dest = '', options = {}) {
  if (typeof src !== 'string') {
    throw new TypeError('Argument "src" is not string.');
  }
  if (typeof dest !== 'string') {
    throw new TypeError('Argument "dest" is not string.');
  }

  const {verbose} = options;

  try {
    if (options.image) {
      await render(`${src}/task/image.js.hbs`, options)
        .then((output) => formatCode(output))
        .then((output) => write(output, `${dest}/task/image.js`, {verbose}));

      await mkdir(`${dest}/src/image`, {verbose});
      await copy(`${src}/src/image/**/*.{jpg,jpeg,png,gif,svg}`, `${dest}/src/image`, {verbose}); // eslint-disable-line max-len
    }
  }
  catch (error) {
    throw error;
  }
}
