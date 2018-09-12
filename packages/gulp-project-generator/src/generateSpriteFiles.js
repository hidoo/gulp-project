import mkdir from './mkdir';
import copy from './copy';
import write from './write';
import render from './render';
import formatCode from './formatCode';

/**
 * generate sprite sheet files
 * @param {String} src source path
 * @param {String} dest destination path
 * @param {OPTIONS} options command line options
 * @return {Promise}
 */
export default async function generateSpriteFiles(src = '', dest = '', options = {}) {
  if (typeof src !== 'string') {
    throw new TypeError('Argument "src" is not string.');
  }
  if (typeof dest !== 'string') {
    throw new TypeError('Argument "dest" is not string.');
  }

  const {verbose} = options;

  try {
    if (options.sprite) {
      await render(`${src}/task/sprite.js.hbs`, options)
        .then((output) => formatCode(output))
        .then((output) => write(output, `${dest}/task/sprite.js`, {verbose}));

      await mkdir(`${dest}/src/sprite`, {verbose});
      switch (options.spriteType) {
        case 'svg':
          await copy(`${src}/src/sprite/**/*.svg`, `${dest}/src/sprite`, {verbose});
          break;
        case 'image':
          await copy(`${src}/src/sprite/**/*.{jpg,jpeg,png,gif}`, `${dest}/src/sprite`, {verbose}); // eslint-disable-line max-len
          break;
        default:
      }
    }
  }
  catch (error) {
    throw error;
  }
}
