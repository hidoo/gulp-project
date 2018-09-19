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

  await mkdir(`${dest}/src/css`, {verbose});
  await copy(`${src}/src/css/**/*.{styl,md}`, `${dest}/src/css`, {verbose});

  if (options.cssDeps) {
    await copy(`${src}/src/cssDeps/**/*.css`, `${dest}/src/css`, {verbose});
  }
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

  await mkdir(`${dest}/src/css/desktop`, {verbose});
  await mkdir(`${dest}/src/css/mobile`, {verbose});
  await copy(`${src}/src/css/**/*.{styl,md}`, `${dest}/src/css/desktop`, {verbose});
  await copy(`${src}/src/css/**/*.{styl,md}`, `${dest}/src/css/mobile`, {verbose});

  if (options.cssDeps) {
    await copy(`${src}/src/cssDeps/**/*.css`, `${dest}/src/css/desktop`, {verbose});
    await copy(`${src}/src/cssDeps/**/*.css`, `${dest}/src/css/mobile`, {verbose});
  }
}

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
    if (!options.css) {
      return;
    }

    await render(`${src}/task/css.js.hbs`, options)
      .then((output) => formatCode(output))
      .then((output) => write(output, `${dest}/task/css.js`, {verbose}));

    if (options.multiDevice) {
      await copyAssetsForMultiDeviceDevice(src, dest, options);
    }
    else {
      await copyAssetsForSingleDevice(src, dest, options);
    }

    return;
  }
  catch (error) {
    throw error;
  }
}
