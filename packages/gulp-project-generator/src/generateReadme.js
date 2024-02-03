import write from './write.js';
import format from './format.js';
import render from './render.js';

/**
 * generate README
 *
 * @param {String} name project name
 * @param {String} src source path
 * @param {String} dest destination path
 * @param {OPTIONS} options command line options
 * @return {Promise}
 */
export default async function generateReadme( // eslint-disable-line max-params
  name = '',
  src = '',
  dest = '',
  options = {}
) {
  if (typeof name !== 'string') {
    throw new TypeError('Argument "name" is not string.');
  }
  if (typeof src !== 'string') {
    throw new TypeError('Argument "src" is not string.');
  }
  if (typeof dest !== 'string') {
    throw new TypeError('Argument "dest" is not string.');
  }

  const { verbose } = options;

  await render(`${src}/README.md.hbs`, { ...options, name })
    .then((output) => format(output, { parser: 'markdown' }))
    .then((output) => write(output, `${dest}/README.md`, { verbose }));
}
