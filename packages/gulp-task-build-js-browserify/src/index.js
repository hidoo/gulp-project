import gulp from 'gulp';
import cond from 'gulp-if';
import rename from 'gulp-rename';
import terser from 'gulp-terser';
import browserify from 'browserify';
import babelify from 'babelify';
import envify from 'envify';
import licensify from 'licensify';
import buffer from 'vinyl-buffer';
import source from 'vinyl-source-stream';
import compress from '@hidoo/gulp-plugin-compress';
import errorHandler from '@hidoo/gulp-util-error-handler';

/**
 * task default options.
 *
 * @type {Object}
 */
const DEFAULT_OPTIONS = {
  name: 'build:js',
  src: null,
  dest: null,
  filename: 'main.js',
  suffix: '.min',
  compress: false,
  verbose: false
};

/**
 * return javascript build task by browserify
 *
 * @param {Object} options - options
 * @param {String} [options.name='build:js'] - task name (use as displayName)
 * @param {String} options.src - source path
 * @param {String} options.dest - destination path
 * @param {String} [options.filename='main.js'] - destination filename
 * @param {String} [options.suffix='.min'] - suffix when compressed
 * @param {Array<String>} [options.targets] - target browsers.
 *   see: {@link http://browserl.ist/?q=%3E+0.5%25+in+JP%2C+ie%3E%3D+10%2C+android+%3E%3D+4.4 default target browsers}
 * @param {Array<String>} [options.browsers] - alias of options.targets.
 * @param {Boolean|import('@hidoo/gulp-plugin-compress').defaultOptions} [options.compress=false] - compress file whether or not
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
 *   dest: '/path/to/dest',
 *   filename: 'main.js',
 *   suffix: '.compressed',
 *   targets: ['> 0.1% in JP'],
 *   compress: true,
 *   verbose: true
 * }));
 */
export default function buildJs(options = {}) {
  const opts = {
    ...DEFAULT_OPTIONS,
    ...options
  };
  const babelOptions = {};

  if (opts.browsers || opts.targets) {
    babelOptions.targets = options.browsers || options.targets;
  }

  // define task
  const task = () => {
    const { filename, suffix, verbose } = opts;
    const enableCompress = Boolean(opts.compress);
    const compressOpts = {
      ...(opts.compress && typeof opts.compress === 'object'
        ? opts.compress
        : {}),
      verbose
    };

    const bundler = browserify()
      .add(opts.src)
      .transform(babelify, babelOptions)
      .transform(envify, { NODE_ENV: process.env.NODE_ENV })
      .plugin(licensify, { includePrivate: true })
      .bundle()
      .on('error', (error) => {
        errorHandler(error);
        bundler.emit('end');
      });

    return bundler
      .pipe(source(filename))
      .pipe(buffer())
      .pipe(gulp.dest(opts.dest))
      .pipe(cond(enableCompress, rename({ suffix })))
      .pipe(cond(enableCompress, terser({ format: { comments: 'some' } })))
      .pipe(cond(enableCompress, compress(compressOpts)))
      .pipe(cond(enableCompress, gulp.dest(opts.dest)));
  };

  // add displayName (used as task name for gulp)
  if (typeof opts.name === 'string' && opts.name !== '') {
    task.displayName = opts.name;
  }

  return task;
}
