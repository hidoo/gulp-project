import mkdir from './mkdir';
import copy from './copy';
import write from './write';
import render from './render';
import formatCode from './formatCode';

/**
 * copy assets for single device mode
 * @param {String} src source path
 * @param {String} dest destination path
 * @param {OPTIONS} options command line options
 * @return {Promise}
 */
async function copyAssetsForSingleDevice(src = '', dest = '', options = {}) {
  const {verbose} = options;

  await mkdir(`${dest}/src/image`, {verbose});
  await copy(`${src}/src/image/**/*.{jpg,jpeg,png,gif,svg}`, `${dest}/src/image`, {verbose}); // eslint-disable-line max-len
}

/**
 * copy assets for multi device mode
 * @param {String} src source path
 * @param {String} dest destination path
 * @param {OPTIONS} options command line options
 * @return {Promise}
 */
async function copyAssetsForMultiDeviceDevice(src = '', dest = '', options = {}) {
  const {verbose} = options;

  await mkdir(`${dest}/src/image/desktop`, {verbose});
  await mkdir(`${dest}/src/image/mobile`, {verbose});
  await copy(`${src}/src/image/**/*.{jpg,jpeg,png,gif,svg}`, `${dest}/src/image/desktop`, {verbose}); // eslint-disable-line max-len
  await copy(`${src}/src/image/**/*.{jpg,jpeg,png,gif,svg}`, `${dest}/src/image/mobile`, {verbose}); // eslint-disable-line max-len
}

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

  if (!options.image) {
    return;
  }

  await render(`${src}/task/image.js.hbs`, options)
    .then((output) => formatCode(output))
    .then((output) => write(output, `${dest}/task/image.js`, {verbose}));

  if (options.multiDevice) {
    await copyAssetsForMultiDeviceDevice(src, dest, options);
  }
  else {
    await copyAssetsForSingleDevice(src, dest, options);
  }
}
