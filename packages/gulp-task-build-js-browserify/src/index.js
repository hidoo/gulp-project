import path from 'path';
import {dest} from 'gulp';
import cond from 'gulp-if';
import gzip from 'gulp-gzip';
import rename from 'gulp-rename';
import uglify from 'gulp-uglify';
import browserify from 'browserify';
import babelify from 'babelify';
import envify from 'envify';
import licensify from 'licensify';
import buffer from 'vinyl-buffer';
import source from 'vinyl-source-stream';
import errorHandler from '@hidoo/gulp-util-error-handler';
import mergeBabelrc from '@hidoo/util-merge-babelrc';

/**
 * task default options.
 * @type {Object}
 */
const DEFAULT_OPTIONS = {
  name: 'build:js',
  src: null,
  dest: null,
  filename: 'main.js',
  browsers: ['> 0.5% in JP', 'ie >= 10', 'android >= 4.4'],
  useBuiltIns: 'usage',
  babelrc: path.resolve(process.cwd(), '.babelrc.js'),
  compress: false,
  verbose: false
};

/**
 * return javascript build task by browserify
 * @param {Object} options - options
 * @param {String} [options.name='build:js'] - task name (use as displayName)
 * @param {String} options.src - source path
 * @param {String} options.dest - destination path
 * @param {String} [options.filename='main.js'] - destination filename
 * @param {Array<String>} [options.browsers] - target browsers.
 *   see: {@link http://browserl.ist/?q=%3E+0.5%25+in+JP%2C+ie%3E%3D+10%2C+android+%3E%3D+4.4 default target browsers}
 * @param {String|Boolean} [options.useBuiltIns='usage'] - use polyfill or not.
 *   see: {@link https://babeljs.io/docs/en/babel-preset-env#usebuiltins useBuiltIns in @babel/preset-env}
 * @param {String} [options.babelrc=path.resolve(process.cwd(), '.babelrc.js')] - babelrc path
 * @param {Boolean} [options.compress=false] - compress file or not
 * @param {Boolean} [options.verbose=false] - out log or not
 * @return {Function<Stream>}
 *
 * @example
 * import {task} from 'gulp';
 * import buildJs from '@hidoo/gulp-task-build-js-browserify';
 *
 * task('js', buildJs({
 *   name: 'js:main',
 *   src: '/path/to/js/main.js',
 *   dest: '/path/to/dest'
 *   filename: 'main.js',
 *   browsers: ['> 0.1% in JP'],
 *   useBuiltIns: false,
 *   babelrc: '/path/to/.babelrc.js',
 *   compress: true,
 *   verbose: true
 * }));
 */
export default function buildJs(options = {}) {
  const opts = {...DEFAULT_OPTIONS, ...options},
        {browsers, useBuiltIns, babelrc, verbose} = opts,
        babelifyOptions = mergeBabelrc(babelrc, {
          presets: [
            ['@babel/preset-env', {
              targets: {browsers},
              useBuiltIns: useBuiltIns,
              debug: verbose
            }]
          ]
        }, {verbose});

  // define task
  const task = () => {
    const {filename, compress} = opts;

    const bundler = browserify(opts.src)
      .transform(babelify, babelifyOptions)
      .transform(envify, {NODE_ENV: process.env.NODE_ENV}) // eslint-disable-line no-process-env
      .plugin(licensify, {includePrivate: true})
      .bundle()
      .on('error', (error) => {
        errorHandler(error);
        bundler.emit('end');
      });

    return bundler
      .pipe(source(filename))
      .pipe(buffer())
      .pipe(dest(opts.dest))
      .pipe(cond(compress, rename({suffix: '.min'})))
      .pipe(cond(compress, uglify({output: {comments: 'some'}})))
      .pipe(cond(compress, dest(opts.dest)))
      .pipe(cond(compress, gzip({append: true})))
      .pipe(cond(compress, dest(opts.dest)));
  };

  // add displayName (used as task name for gulp)
  if (typeof opts.name === 'string' && opts.name !== '') {
    task.displayName = opts.name;
  }

  return task;
}
