import mkdir from './mkdir';
import copy from './copy';
import write from './write';
import render from './render';
import formatCode from './formatCode';

/**
 * copy assets for single device mode
 *
 * @param {String} src source path
 * @param {String} dest destination path
 * @param {OPTIONS} options command line options
 * @return {Promise}
 */
async function copyAssetsForSingleDevice(src = '', dest = '', options = {}) {
  const {verbose} = options;

  await mkdir(`${dest}/src/sprite`, {verbose});
  switch (options.spriteType) {
    case 'svg':
      await copy(`${src}/src/sprite/**/*.svg`, `${dest}/src/sprite`, {verbose});
      break;
    case 'image':
      await copy(`${src}/src/sprite/**/*.{jpg,jpeg,png,gif}`, `${dest}/src/sprite`, {verbose});
      break;
    default:
  }
}

/**
 * copy assets for multi device mode
 *
 * @param {String} src source path
 * @param {String} dest destination path
 * @param {OPTIONS} options command line options
 * @return {Promise}
 */
async function copyAssetsForMultiDeviceDevice(src = '', dest = '', options = {}) {
  const {verbose} = options;

  await mkdir(`${dest}/src/sprite/desktop`, {verbose});
  await mkdir(`${dest}/src/sprite/mobile`, {verbose});
  switch (options.spriteType) {
    case 'svg':
      await copy(`${src}/src/sprite/**/*.svg`, `${dest}/src/sprite/desktop`, {verbose});
      await copy(`${src}/src/sprite/**/*.svg`, `${dest}/src/sprite/mobile`, {verbose});
      break;
    case 'image':
      await copy(`${src}/src/sprite/**/*.{jpg,jpeg,png,gif}`, `${dest}/src/sprite/desktop`, {verbose});
      await copy(`${src}/src/sprite/**/*.{jpg,jpeg,png,gif}`, `${dest}/src/sprite/mobile`, {verbose});
      break;
    default:
  }
}

/**
 * generate sprite sheet files
 *
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

  if (!options.sprite) {
    return;
  }

  await render(`${src}/task/sprite.js.hbs`, options)
    .then((output) => formatCode(output))
    .then((output) => write(output, `${dest}/task/sprite.js`, {verbose}));

  if (options.multiDevice) {
    await copyAssetsForMultiDeviceDevice(src, dest, options);
  }
  else {
    await copyAssetsForSingleDevice(src, dest, options);
  }
}
