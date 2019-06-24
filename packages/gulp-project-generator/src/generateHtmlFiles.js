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

  await mkdir(`${dest}/src/html`, {verbose});
  await copy(`${src}/src/html/**/*.hbs`, `${dest}/src/html`, {verbose});

  await mkdir(`${dest}/src/data`, {verbose});
  await copy(`${src}/src/data/**/*.{yaml,yml,json5,json}`, `${dest}/src/data`, {verbose}); // eslint-disable-line max-len
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

  await mkdir(`${dest}/src/html/desktop`, {verbose});
  await mkdir(`${dest}/src/html/mobile`, {verbose});
  await copy(`${src}/src/html/pages/**/*.hbs`, `${dest}/src/html/desktop`, {verbose});
  await copy(`${src}/src/html/pages/**/*.hbs`, `${dest}/src/html/mobile`, {verbose});
  await copy(`${src}/src/html/partials/**/*.hbs`, `${dest}/src/html/partials`, {verbose});
  await copy(`${src}/src/html/layouts/**/*.hbs`, `${dest}/src/html/layouts`, {verbose});

  await mkdir(`${dest}/src/data`, {verbose});
  await copy(`${src}/src/data/**/*.{yaml,yml,json5,json}`, `${dest}/src/data`, {verbose}); // eslint-disable-line max-len
}

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

  if (!options.html) {
    return;
  }

  await render(`${src}/task/html.js.hbs`, options)
    .then((output) => formatCode(output))
    .then((output) => write(output, `${dest}/task/html.js`, {verbose}));

  if (options.multiDevice) {
    await copyAssetsForMultiDeviceDevice(src, dest, options);
  }
  else {
    await copyAssetsForSingleDevice(src, dest, options);
  }
}
