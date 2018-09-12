import fs from 'fs';
import path from 'path';
import Handlebars from 'handlebars';
import * as helpers from '@hidoo/handlebars-helpers';

/**
 * render file from template
 * @param {String} src source path of template
 * @param {Object} context template context
 * @return {Promise<String>}
 */
export default function render(src = '', context = {}) {
  if (typeof src !== 'string') {
    throw new TypeError('Argument "src" is not string.');
  }

  const hbs = Handlebars.create();

  Object.entries(helpers).forEach(([name, helper]) =>
    hbs.registerHelper(name, helper)
  );

  const promise = new Promise((resolve, reject) =>
    fs.readFile(path.resolve(src), (error, content) => {
      if (error) {
        return reject(error);
      }
      return resolve(content.toString());
    })
  );

  return promise
    .then((content) => hbs.compile(content))
    .then((template) => template(context));
}
