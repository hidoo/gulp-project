import write from './write';
import render from './render';
import formatCode from './formatCode';

/**
 * generate dot files
 * @param {String} src source path
 * @param {String} dest destination path
 * @param {OPTIONS} options command line options
 * @return {Promise}
 */
export default async function generateDotFiles(src = '', dest = '', options = {}) {
  if (typeof src !== 'string') {
    throw new TypeError('Argument "src" is not string.');
  }
  if (typeof dest !== 'string') {
    throw new TypeError('Argument "dest" is not string.');
  }

  const {verbose} = options;

  try {
    await render(`${src}/.babelrc.js.hbs`, options)
      .then((output) => formatCode(output))
      .then((output) => write(output, `${dest}/.babelrc.js`, {verbose}));

    await render(`${src}/.eslintrc.js.hbs`, options)
      .then((output) => formatCode(output))
      .then((output) => write(output, `${dest}/.eslintrc.js`, {verbose}));

    await render(`${src}/.eslintignore.hbs`, options)
      .then((output) => write(output, `${dest}/.eslintignore`, {verbose}));

    await render(`${src}/.editorconfig.hbs`, options)
      .then((output) => write(output, `${dest}/.editorconfig`, {verbose}));

    await render(`${src}/.gitignore.hbs`, options)
      .then((output) => write(output, `${dest}/.gitignore`, {verbose}));

    await render(`${src}/.gitattributes.hbs`, options)
      .then((output) => write(output, `${dest}/.gitattributes`, {verbose}));
  }
  catch (error) {
    throw error;
  }
}
