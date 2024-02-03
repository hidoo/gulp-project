import fs from 'node:fs/promises';
import path from 'node:path';
import Handlebars from 'handlebars';
import * as helpers from '@hidoo/handlebars-helpers';

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

  Object.entries(helpers).forEach(([name, helper]) =>
    hbs.registerHelper(name, helper)
  );

  const content = await fs.readFile(path.resolve(src));
  const template = hbs.compile(content.toString());

  return template(context);
}
