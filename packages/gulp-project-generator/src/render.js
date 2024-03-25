import fs from 'node:fs/promises';
import path from 'node:path';
import Handlebars from 'handlebars';
import defaultHelpersRegister from '@hidoo/handlebars-helpers/register'; // eslint-disable-line import/no-unresolved

/**
 * render file from template
 *
 * @param {String} src source path of template
 * @param {Object} context template context
 * @return {Promise<String>}
 */
export default async function render(src = '', context = {}) {
  if (typeof src !== 'string') {
    throw new TypeError('Argument "src" is not string.');
  }

  const hbs = Handlebars.create();

  defaultHelpersRegister(hbs);

  const content = await fs.readFile(path.resolve(src));
  const template = hbs.compile(content.toString());

  return template(context);
}
