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

  // task name (set displayName)
  name: 'build:js',

  // source path (required)
  src: null,

  // destination path (required)
  dest: null,

  // destination filename
  filename: 'main.js',

  // target browsers
  // + http://browserl.ist/?q=%3E+0.5%25+in+JP%2C+ie%3E%3D+10%2C+android+%3E%3D+4.4
  browsers: ['> 0.5% in JP', 'ie >= 10', 'android >= 4.4'],

  // use polyfill or not
  // + see options.useBuiltIns in @babel/preset-env
  useBuiltins: 'usage',

  // babelrc path
  babelrc: path.resolve(process.cwd(), '.babelrc.js'),

  // compress file or not
  compress: false,

  // out log or not
  verbose: false
};

/**
 * return javascript build task by browserify
 * @param {DEFAULT_OPTIONS} options options
 * @return {Function}
 *
 * @example
 * import {task} from 'gulp';
 * import buildJs from '@hidoo/gulp-task-build-js-browserify';
 *
 * task('js', buildJs({
 *   src: '/path/to/js/main.js',
 *   dest: '/path/to/dest'
 * }));
 */
export default function buildJs(options = {}) {
  const opts = {...DEFAULT_OPTIONS, ...options},
        {browsers, useBuiltins, babelrc, verbose} = opts,
        babelifyOptions = mergeBabelrc(babelrc, {
          presets: [
            ['@babel/preset-env', {
              targets: {browsers},
              useBuiltIns: useBuiltins,
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
