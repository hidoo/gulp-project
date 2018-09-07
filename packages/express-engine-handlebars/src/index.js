import path from 'path';
import Handlebars from 'handlebars';
import layoutsHelper from 'handlebars-layouts';
import * as defaultHelpers from '@hidoo/handlebars-helpers';
import {globPromise, readFile, readFiles} from './util';

/**
 * Handlebars default instance
 * @type {Object}
 */
export {default as Handlebars} from 'handlebars';

/**
 * default options
 * @type {Object}
 */
const DEFAULT_OPTIONS = {

  // Handlebars partials files glob pattern
  partials: '',

  // Handlebars layouts files glob pattern
  layouts: '',

  // Handlebars helpers object
  helpers: {},

  // handlebars instance
  handlebars: null,

  // handlebars compile method options
  // + see: https://handlebarsjs.com/reference.html#base-compile
  compileOptions: {},

  // out log or not
  verbose: false
};

/**
 * return Handlebars template engine for express
 * @param {Object} options options
 * @return {Function}
 *
 * @example
 * import express from 'express';
 * import expressEngineHandlebars from '@hidoo/express-engine-handlebars';
 *
 * const app = express();
 *
 * app.set('view engine', 'hbs');
 * app.set('views', '/path/to/views');
 * app.engine('hbs', expressEngineHandlebars({
 *   layouts: '/path/to/views/layouts/**.hbs',
 *   partials: '/path/to/views/partials/**.hbs',
 *   helpers: '/path/to/views/helpers/**.js'
 * }));
 */
export default function expressEngineHandlebars(options = {}) {
  const opts = {...DEFAULT_OPTIONS, ...options};

  return async (filepath, context, done) => {
    const {verbose} = opts;

    try {
      const {error, contents} = await readFile(filepath, {verbose}),
            layouts = await readFiles(opts.layouts, {verbose}),
            partials = await readFiles(opts.partials, {verbose}),
            hbs = opts.handlebars || Handlebars.create();

      // filepath not loaded
      if (error) {
        throw error;
      }

      // register layouts helper
      hbs.registerHelper(layoutsHelper(hbs));

      // register default helpers
      Object.entries(defaultHelpers).forEach(([name, helper]) =>
        hbs.registerHelper(name, helper)
      );

      // register additional helpers
      if (typeof opts.helpers === 'string') {
        const modulepaths = await globPromise(opts.helpers, {silent: verbose});

        modulepaths
          .map((modulepath) => path.relative(__dirname, modulepath))
          .filter((modulepath) => path.extname(modulepath) === '.js')
          .forEach((modulepath) => {
            const {register} = require(modulepath); // eslint-disable-line global-require

            if (typeof register !== 'function') {
              if (verbose) {
                console.warn(`Warning: helper '${modulepath}' is not valid format.`); // eslint-disable-line no-console
              }
              return null;
            }
            return register(hbs);
          });
      }

      // register layouts and partials
      [...layouts, ...partials].forEach((file) => {
        const name = file.relative.replace(file.extname, '').split(path.sep).join('/');

        hbs.registerPartial(name, file.contents.toString());
      });

      const template = hbs.compile(contents.toString(), opts.compileOptions);

      done(null, template(context));
    }
    catch (error) {
      done(error);
    }
  };
}
