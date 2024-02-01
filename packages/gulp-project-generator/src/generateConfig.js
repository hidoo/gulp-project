import write from './write.js';
import render from './render.js';
import {formatJS} from './format.js';

/**
 * generate config
 *
 * @param {String} src source path
 * @param {String} dest destination path
 * @param {OPTIONS} options command line options
 * @return {Promise}
 */
export default async function generateConfig(src = '', dest = '', options = {}) {
  if (typeof src !== 'string') {
    throw new TypeError('Argument "src" is not string.');
  }
  if (typeof dest !== 'string') {
    throw new TypeError('Argument "dest" is not string.');
  }

  const {verbose} = options;
  const output = await render(`${src}/config.js.hbs`, options);
  const formatted = await formatJS(output);

  await write(formatted, `${dest}/config.js`, {verbose});
}
