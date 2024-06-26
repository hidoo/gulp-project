import mkdir from './mkdir.js';
import copy from './copy.js';
import write from './write.js';
import render from './render.js';
import format from './format.js';

/**
 * generate local dev server files
 *
 * @param {String} src source path
 * @param {String} dest destination path
 * @param {OPTIONS} options command line options
 * @return {Promise}
 */
export default async function generateServerFiles(
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

  const { verbose } = options;

  if (options.server) {
    const output = await render(`${src}/task/server.js.hbs`, options);
    const formatted = await format(output);

    await write(formatted, `${dest}/task/server.js`, { verbose });
    await mkdir(`${dest}/src/server`, { verbose });
    await copy(`${src}/src/server/**/*.{js,hbs}`, `${dest}/src/server`, {
      verbose
    });
  }
}
