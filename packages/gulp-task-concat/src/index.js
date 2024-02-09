import fs from 'node:fs';
import path from 'node:path';
import util from 'node:util';
import gulp from 'gulp';
import plumber from 'gulp-plumber';
import cond from 'gulp-if';
import concat from 'gulp-concat';
import replace from 'gulp-replace';
import gzip from 'gulp-gzip';
import postcss from 'gulp-postcss';
import rename from 'gulp-rename';
import header from 'gulp-header';
import uglify from 'gulp-uglify';
import csso from 'postcss-csso';
import log from 'fancy-log';
import errorHandler from '@hidoo/gulp-util-error-handler';

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
 * task default options.
 *
 * @type {Object}
 */
const DEFAULT_OPTIONS = {
  name: 'build:asset',
  src: null,
  dest: null,
  filename: '',
  suffix: '.min',
  banner: '',
  compress: false
};

/**
 * return javascript concat task
 *
 * @param {Object} options options
 * @param {String} [options.name='build:asset'] - task name (use as displayName)
 * @param {Array<String>} options.src - source path
 * @param {String} options.dest - destination path
 * @param {String} [options.filename='bundle.js'] - destination filename
 * @param {String} [options.suffix='.min'] - suffix when compressed
 * @param {String} [options.banner=''] - license comments
 * @param {Boolean} [options.compress=false] - compress file or not
 * @return {Function<Stream>}
 *
 * @example
 * import {task} from 'gulp';
 * import {concatJs} from '@hidoo/gulp-task-concat';
 *
 * task('concat:js', concatJs({
 *   name: 'js:deps',
 *   src: [
 *     '/path/to/js/a.js',
 *     '/path/to/js/b.js',
 *     '/path/to/js/c.js'
 *   ],
 *   dest: '/path/to/dest',
 *   filename: 'deps.js',
 *   suffix: '.hoge',
 *   banner: '/*! copyright <%= pkg.author %> * /\n',
 *   compress: true
 * }));
 */
export function concatJs(options = {}) {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  // define task
  const task = () => {
    const { filename, suffix, banner, compress } = opts;

    return gulp
      .src(opts.src)
      .pipe(plumber({ errorHandler }))
      .pipe(concat(filename || 'bundle.js'))
      .pipe(
        replace(
          'process.env.NODE_ENV',
          // eslint-disable-next-line node/no-process-env
          `'${process.env.NODE_ENV || 'development'}'`
        )
      )
      .pipe(header(banner, { pkg }))
      .pipe(gulp.dest(opts.dest))
      .pipe(cond(compress, rename({ suffix })))
      .pipe(cond(compress, uglify({ output: { comments: 'some' } })))
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

/**
 * return css concat task
 *
 * @param {Object} options options
 * @param {String} [options.name='build:asset'] - task name (use as displayName)
 * @param {Array<String>} options.src - source path
 * @param {String} options.dest - destination path
 * @param {String} [options.filename='bundle.css'] - destination filename
 * @param {String} [options.suffix='.min'] - suffix when compressed
 * @param {String} [options.banner=''] - license comments
 * @param {Boolean} [options.compress=false] - compress file or not
 * @return {Function<Stream>}
 *
 * @example
 * import {task} from 'gulp';
 * import {concatCss} from '@hidoo/gulp-task-concat';
 *
 * task('concat:css', concatCss({
 *   name: 'css:deps',
 *   src: [
 *     '/path/to/css/a.css',
 *     '/path/to/css/b.css',
 *     '/path/to/css/c.css'
 *   ],
 *   dest: '/path/to/dest',
 *   filename: 'deps.css',
 *   suffix: '.hoge',
 *   banner: '/*! copyright <%= pkg.author %> * /\n',
 *   compress: true
 * }));
 */
export function concatCss(options = {}) {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  // define task
  const task = () => {
    const { filename, suffix, banner, compress } = opts;

    return gulp
      .src(opts.src)
      .pipe(plumber({ errorHandler }))
      .pipe(concat(filename || 'bundle.css'))
      .pipe(header(banner, { pkg }))
      .pipe(gulp.dest(opts.dest))
      .pipe(cond(compress, rename({ suffix })))
      .pipe(cond(compress, postcss([csso({ restructure: false })])))
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
