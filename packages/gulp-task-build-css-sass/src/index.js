import fs from 'node:fs';
import path from 'node:path';
import util from 'node:util';
import gulp from 'gulp';
import cond from 'gulp-if';
import through from 'through2';
import Vinyl from 'vinyl';
import * as sass from 'sass';
import magicImporter from 'node-sass-magic-importer';
import postcss from 'gulp-postcss';
import csso from 'postcss-csso';
import header from 'gulp-header';
import rename from 'gulp-rename';
import gzip from 'gulp-gzip';
import log from 'fancy-log';
import sassImporter from '@hidoo/sass-importer';
import errorHandler from '@hidoo/gulp-util-error-handler';
import configurePlugins, { defaultPlugins } from './configurePlugins.js';

/**
 * default plugins
 *
 * @type {Function}
 *
 * @example
 * import { defaultPlugins } from '@hidoo/gulp-task-build-css-sass';
 */
export { defaultPlugins };

// tweaks log date color like gulp log
util.inspect.styles.date = 'grey';

let pkg = {};

// try to load package.json that on current working directory
try {
  pkg = JSON.parse(
    // eslint-disable-next-line node/no-sync
    fs.readFileSync(path.resolve(process.cwd(), 'package.json'))
  );
} catch (error) {
  log.error('Failed to load package.json.');
}

/**
 * default custom sass functions
 *
 * @type {Object}
 */
const DEFAULT_FUNCTIONS = {
  /**
   * add "env" function that get value from process.env
   *
   * @param {String} key key
   * @param {Function} done callback function when call asynchronously
   * @return {void|sass.compiler.types.String}
   */
  'env($key)': (key, done) => {
    const name = key.getValue(),
      result = new sass.types.String(
        process.env[name] || '' // eslint-disable-line node/no-process-env
      );

    if (typeof done === 'function') {
      return done(result);
    }
    return result;
  }
};

/**
 * task default options.
 *
 * @type {Object}
 */
const DEFAULT_OPTIONS = {
  name: 'build:css',
  src: null,
  dest: null,
  filename: 'main.css',
  suffix: '.min',
  banner: '',
  sassOptions: {
    outputStyle: 'expanded',
    functions: {},
    importer: []
  },
  postcssPlugins: null,
  compress: false
};

/**
 * promisified sass.render
 *
 * @param {Object} options options of sass.render
 * @return {Promise<Object>}
 */
const render = util.promisify(sass.render).bind(sass);

/**
 * return css build task by sass
 *
 * @param  {Object} options - options
 * @param  {String} [options.name='build:css'] - task name (use as displayName)
 * @param  {String} options.src - source path
 * @param  {String} options.dest - destination path
 * @param  {String} [options.filename='main.css'] - destination filename
 * @param  {String} [options.suffix='.min'] - suffix when compressed
 * @param  {Array<String>} [options.targets] - target browsers.
 *   see: {@link http://browserl.ist/?q=%3E+0.5%25+in+JP%2C+ie%3E%3D+10%2C+android+%3E%3D+4.4 default target browsers}
 * @param  {Array<String>} [options.browsers] - alias of options.targets.
 * @param  {String} [options.banner=''] - license comments
 * @param  {Object} [options.sassOptions={outputStyle: 'expanded'}] - sass options.
 *   see: {@link https://sass-lang.com/documentation/js-api#options sass options}
 * @param  {Object} [options.postcssPlugins=[]] - list of PostCSS plugin.
 * @param  {Boolean} [options.compress=false] - compress file or not
 * @return {Function<Stream>}
 *
 * @example
 * import {task} from 'gulp';
 * import buildCss from '@hidoo/gulp-task-build-css-sass';
 *
 * task('css', buildCss({
 *   name: 'css:main',
 *   src: '/path/to/scss/main.scss',
 *   dest: '/path/to/dest',
 *   filename: 'styles.css',
 *   suffix: '.hoge',
 *   targets: ['> 0.1% in JP'],
 *   banner: '/*! copyright <%= pkg.author %> * /\n',
 *   sassOptions: {outputStyle: 'nested'},
 *   postcssPlugins: [
 *     (root) => root
 *   ],
 *   compress: true
 * }));
 */
export default function buildCss(options = {}) {
  const opts = {
    ...DEFAULT_OPTIONS,
    ...options
  };

  // define task
  const task = () => {
    const { suffix, compress } = opts;
    const stream = through.obj();
    const filename = opts.filename || path.basename(opts.src);
    const sassOptions = opts.sassOptions || { functions: {}, importer: [] };

    (async () => {
      try {
        const { css } = await render({
          file: opts.src,
          ...sassOptions,
          importer: [
            sassImporter.default(),
            magicImporter(),
            ...sassOptions.importer
          ],
          functions: {
            ...DEFAULT_FUNCTIONS,
            ...sassOptions.functions
          }
        });

        // add code to stream as vinyl file
        stream.push(
          new Vinyl({
            path: filename,
            contents: Buffer.from(css)
          })
        );

        // add null that indicates write completion
        stream.push(null);
      } catch (error) {
        errorHandler(error);
        stream.emit('end');
      }
    })();

    return stream
      .pipe(postcss(configurePlugins(opts)))
      .pipe(header(opts.banner, { pkg }))
      .pipe(gulp.dest(opts.dest))
      .pipe(cond(compress, postcss([csso({ restructure: false })])))
      .pipe(header(opts.banner, { pkg }))
      .pipe(cond(compress, rename({ suffix })))
      .pipe(cond(compress, gulp.dest(opts.dest)))
      .pipe(cond(compress, gzip({ append: true })))
      .pipe(cond(compress, gulp.dest(opts.dest)));
  };

  // add displayName (used as task name for gulp)
  if (typeof opts.name === 'string' && opts.name !== '') {
    task.displayName = opts.name;
  }

  return task;
}
