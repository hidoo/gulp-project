import mkdir from './mkdir.js';
import copy from './copy.js';
import write from './write.js';
import render from './render.js';
import {formatJS} from './format.js';

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

  await mkdir(`${dest}/src/js`, {verbose});
  await copy(`${src}/src/js/**/*.{js,cjs}`, `${dest}/src/js`, {verbose});

  if (options.jsDeps) {
    await copy(`${src}/src/jsDeps/**/*.{js,cjs}`, `${dest}/src/js`, {verbose});
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

  await mkdir(`${dest}/src/js/desktop`, {verbose});
  await mkdir(`${dest}/src/js/mobile`, {verbose});
  await copy(`${src}/src/js/**/*.{js,cjs}`, `${dest}/src/js/desktop`, {verbose});
  await copy(`${src}/src/js/**/*.{js,cjs}`, `${dest}/src/js/mobile`, {verbose});

  if (options.jsDeps) {
    await copy(`${src}/src/jsDeps/**/*.{js,cjs}`, `${dest}/src/js/desktop`, {verbose});
    await copy(`${src}/src/jsDeps/**/*.{js,cjs}`, `${dest}/src/js/mobile`, {verbose});
  }
}

/**
 * generate javascript files
 *
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

  if (!options.js) {
    return;
  }

  await render(`${src}/task/js.js.hbs`, options)
    .then((output) => formatJS(output))
    .then((output) => write(output, `${dest}/task/js.js`, {verbose}));

  if (options.multiDevice) {
    await copyAssetsForMultiDeviceDevice(src, dest, options);
  }
  else {
    await copyAssetsForSingleDevice(src, dest, options);
  }
}
