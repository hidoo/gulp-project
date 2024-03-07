import fs from 'node:fs';
import path from 'node:path';
import gulp from 'gulp';
import cond from 'gulp-if';
import through from 'through2';
import Vinyl from 'vinyl';
import * as sass from 'sass';
import postcss from 'gulp-postcss';
import csso from 'postcss-csso';
import header from 'gulp-header';
import rename from 'gulp-rename';
import gzip from 'gulp-gzip';
import errorHandler from '@hidoo/gulp-util-error-handler';
import configure, { autoprefixer, cssmqpacker } from './plugins.js';
import functions from './functions.js';
import * as importers from './importers.js';
import log from './log.js';

/**
 * Try to load package.json that on current working directory.
 *
 * @return {Object}
 */
function loadPackageJson() {
  let pkg = {};

  try {
    pkg = JSON.parse(
      // eslint-disable-next-line node/no-sync
      fs.readFileSync(path.resolve(process.cwd(), 'package.json'))
    );
  } catch (error) {
    log.error('Failed to load package.json.');
  }

  return pkg;
}

/**
 * postcss plugins
 *
 * @type {Function}
 *
 * @example
 * import { autoprefixer, cssmqpacker, csso } from '@hidoo/gulp-task-build-css-sass';
 */
export { autoprefixer, cssmqpacker, csso };

/**
 * Default options.
 *
 * @type {Object}
 */
export const defaultOptions = {
  name: 'build:css',
  src: null,
  dest: null,
  filename: 'main.css',
  suffix: '.min',
  banner: '',
  sassOptions: {
    outputStyle: 'expanded'
  },
  postcssPlugins: null,
  compress: false,
  verbose: false
};

/**
 * Return css build task by sass
 *
 * @param {Object} options - options
 * @param {String} [options.name='build:css'] - task name (use as displayName)
 * @param {String} options.src - source path
 * @param {String} options.dest - destination path
 * @param {String} [options.filename='main.css'] - destination filename
 * @param {String} [options.suffix='.min'] - suffix when compressed
 * @param {Array<String>} options.targets - target browsers.
 *   see: {@link http://browserl.ist/?q=%3E+0.5%25+in+JP%2C+ie%3E%3D+10%2C+android+%3E%3D+4.4 default target browsers}
 * @param {Array<String>} options.browsers - alias of options.targets.
 * @param {String} [options.banner=''] - license comments
 * @param {import('sass').Options} [options.sassOptions={outputStyle: 'expanded'}] - sass options.
 *   see: {@link https://sass-lang.com/documentation/js-api#options sass options}
 * @param {Object} [options.postcssPlugins=[]] - list of PostCSS plugin.
 * @param {Boolean} [options.compress=false] - compress file or not
 * @param {Boolean} [options.verbose=false] - out debug log or not
 * @return {Function<Transform>}
 *
 * @example
 * import {task} from 'gulp';
 * import buildCss, { autoprefixer } from '@hidoo/gulp-task-build-css-sass';
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
 *     autoprefixer(),
 *     (root) => root
 *   ],
 *   compress: true
 * }));
 */
export default function buildCss(options = {}) {
  const opts = {
    ...defaultOptions,
    ...options
  };

  // define task
  const task = () => {
    const { suffix, compress, verbose } = opts;
    const stream = through.obj();
    const pkg = loadPackageJson();
    const filename = opts.filename || path.basename(opts.src);
    const sassOptions = {
      functions: {},
      importers: [],
      alertColor: true,
      verbose,
      ...opts.sassOptions
    };

    (async () => {
      try {
        const { css, sourceMap } = await sass.compileAsync(opts.src, {
          ...sassOptions,
          sourceMap: true,
          sourceMapIncludeSources: true,
          importers: [
            new sass.NodePackageImporter(),
            importers.compatSassImporter(),
            importers.compatMagicImporter({
              ...sassOptions,
              includePaths: opts.src
            }),
            ...sassOptions.importers
          ],
          functions: {
            ...functions,
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
      .pipe(postcss(configure(opts)))
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
