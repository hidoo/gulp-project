import mkdir from './mkdir.js';
import copy from './copy.js';
import write from './write.js';
import render from './render.js';
import format from './format.js';

/**
 * copy assets for single device mode
 *
 * @param {String} src source path
 * @param {String} dest destination path
 * @param {OPTIONS} options command line options
 * @return {Promise}
 */
async function copyAssetsForSingleDevice(src = '', dest = '', options = {}) {
  const { verbose } = options;
  const ext = options.cssPreprocessor === 'sass' ? 'scss' : 'styl';

  await mkdir(`${dest}/src/css`, { verbose });
  await copy(`${src}/src/css/**/*.${ext}`, `${dest}/src/css`, { verbose });

  const output = await render(`${src}/src/css/README.md.hbs`, options);

  await write(output, `${dest}/src/css/README.md`, { verbose });

  if (options.cssDeps) {
    await copy(`${src}/src/cssDeps/**/*.css`, `${dest}/src/css`, { verbose });
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
async function copyAssetsForMultiDeviceDevice(
  src = '',
  dest = '',
  options = {}
) {
  const { verbose } = options;
  const ext = options.cssPreprocessor === 'sass' ? 'scss' : 'styl';

  await mkdir(`${dest}/src/css/desktop`, { verbose });
  await mkdir(`${dest}/src/css/mobile`, { verbose });
  await copy(`${src}/src/css/**/*.${ext}`, `${dest}/src/css/desktop`, {
    verbose
  });
  await copy(`${src}/src/css/**/*.${ext}`, `${dest}/src/css/mobile`, {
    verbose
  });

  const output = await render(`${src}/src/css/README.md.hbs`, options);

  await write(output, `${dest}/src/css/desktop/README.md`, { verbose });
  await write(output, `${dest}/src/css/mobile/README.md`, { verbose });

  if (options.cssDeps) {
    await copy(`${src}/src/cssDeps/**/*.css`, `${dest}/src/css/desktop`, {
      verbose
    });
    await copy(`${src}/src/cssDeps/**/*.css`, `${dest}/src/css/mobile`, {
      verbose
    });
  }
}

/**
 * generate css files
 *
 * @param {String} src source path
 * @param {String} dest destination path
 * @param {OPTIONS} options command line options
 * @return {Promise}
 */
export default async function generateCssFiles(
  src = '',
  dest = '',
  options = {}
) {
  if (typeof src !== 'string') {
    throw new TypeError('Argument "src" is not string.');
  }
  if (typeof dest !== 'string') {
    throw new TypeError('Argument "dest" is not string.');
  }

  if (!options.css) {
    return;
  }

  const { verbose } = options;

  const output = await render(`${src}/task/css.js.hbs`, options);
  const formatted = await format(output);

  await write(formatted, `${dest}/task/css.js`, { verbose });

  if (options.multiDevice) {
    await copyAssetsForMultiDeviceDevice(src, dest, options);
  } else {
    await copyAssetsForSingleDevice(src, dest, options);
  }
}
