import write from './write';
import render from './render';
import formatCode from './formatCode';

/* eslint-disable max-statements */
/**
 * generate dot files
 *
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

  await render(`${src}/.babelrc.js.hbs`, options)
    .then((output) => formatCode(output))
    .then((output) => write(output, `${dest}/.babelrc.js`, {verbose}));

  if (options.conventionalCommits) {
    await render(`${src}/.commitlintrc.js.hbs`, options)
      .then((output) => write(output, `${dest}/.commitlintrc.js`, {verbose}));
  }

  if (options.css && options.cssPreprocessor === 'sass') {
    await render(`${src}/.stylelintrc.js.hbs`, options)
      .then((output) => formatCode(output))
      .then((output) => write(output, `${dest}/.stylelintrc.js`, {verbose}));

    await render(`${src}/.stylelintignore.hbs`, options)
      .then((output) => write(output, `${dest}/.stylelintignore`, {verbose}));
  }

  if (options.js) {
    await render(`${src}/.mocharc.js.hbs`, options)
      .then((output) => formatCode(output))
      .then((output) => write(output, `${dest}/.mocharc.js`, {verbose}));
  }

  await render(`${src}/.eslintrc.js.hbs`, options)
    .then((output) => formatCode(output))
    .then((output) => write(output, `${dest}/.eslintrc.js`, {verbose}));

  await render(`${src}/.eslintignore.hbs`, options)
    .then((output) => write(output, `${dest}/.eslintignore`, {verbose}));

  await render(`${src}/.husky-pre-commit.hbs`, options)
    .then((output) => write(output, `${dest}/.husky/pre-commit`, {
      verbose,
      writeFile: {mode: parseInt('0755', 8)}
    }));

  if (options.conventionalCommits) {
    await render(`${src}/.husky-commit-msg.hbs`, options)
      .then((output) => write(output, `${dest}/.husky/commit-msg`, {
        verbose,
        writeFile: {mode: parseInt('0755', 8)}
      }));
  }

  await render(`${src}/.lintstagedrc.js.hbs`, options)
    .then((output) => formatCode(output))
    .then((output) => write(output, `${dest}/.lintstagedrc.js`, {verbose}));

  await render(`${src}/.editorconfig.hbs`, options)
    .then((output) => write(output, `${dest}/.editorconfig`, {verbose}));

  await render(`${src}/.gitignore.hbs`, options)
    .then((output) => write(output, `${dest}/.gitignore`, {verbose}));

  await render(`${src}/.gitattributes.hbs`, options)
    .then((output) => write(output, `${dest}/.gitattributes`, {verbose}));
}
/* eslint-enable max-statements */
