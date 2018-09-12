import write from './write';
import render from './render';

/**
 * generate README
 * @param {String} name project name
 * @param {String} src source path
 * @param {String} dest destination path
 * @param {OPTIONS} options command line options
 * @return {Promise}
 */
export default async function generateReadme(name = '', src = '', dest = '', options = {}) { // eslint-disable-line max-len, max-params
  if (typeof name !== 'string') {
    throw new TypeError('Argument "name" is not string.');
  }
  if (typeof src !== 'string') {
    throw new TypeError('Argument "src" is not string.');
  }
  if (typeof dest !== 'string') {
    throw new TypeError('Argument "dest" is not string.');
  }

  const {verbose} = options;

  try {
    await render(`${src}/README.md.hbs`, {...options, name})
      .then((output) => write(output, `${dest}/README.md`, {verbose}));
  }
  catch (error) {
    throw error;
  }
}
