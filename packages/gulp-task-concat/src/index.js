import path from 'path';
import {src, dest} from 'gulp';
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

let pkg = {};

// try to load package.json that on current working directory
try {
  pkg = require(path.resolve(process.cwd(), 'package.json')); // eslint-disable-line global-require
}
catch (error) {
  log.error('Failed to load package.json.');
}

/**
 * task default options.
 * @type {Object}
 */
const DEFAULT_OPTIONS = {

  // task name (set displayName)
  name: 'build:asset',

  // source path (required)
  src: null,

  // destination path (required)
  dest: null,

  // destination filename
  filename: '',

  // licence comments
  banner: '',

  // compress file or not
  compress: false
};

/**
 * return javascript concat task
 * @param {DEFAULT_OPTIONS} options options
 * @return {Function}
 *
 * @example
 * import {task} from 'gulp';
 * import {concatJs} from '@hidoo/gulp-task-concat';
 *
 * task('js', concatJs({
 *   src: [
 *     '/path/to/js/a.js'
 *     '/path/to/js/b.js'
 *     '/path/to/js/c.js'
 *   ],
 *   dest: '/path/to/dest'
 * }));
 */
export function concatJs(options = {}) {
  const opts = {...DEFAULT_OPTIONS, ...options};

  // define task
  const task = () => {
    const {filename, banner, compress} = opts;

    return src(opts.src)
      .pipe(plumber({errorHandler}))
      .pipe(concat(filename || 'bundle.js'))
      .pipe(replace('process.env.NODE_ENV', `'${process.env.NODE_ENV || 'development'}'`)) // eslint-disable-line no-process-env
      .pipe(header(banner, {pkg}))
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

/**
 * return css concat task
 * @param {DEFAULT_OPTIONS} options options
 * @return {Function}
 *
 * @example
 * import {task} from 'gulp';
 * import {concatCss} from '@hidoo/gulp-task-concat';
 *
 * task('js', concatCss({
 *   src: [
 *     '/path/to/css/a.css'
 *     '/path/to/css/b.css'
 *     '/path/to/css/c.css'
 *   ],
 *   dest: '/path/to/dest'
 * }));
 */
export function concatCss(options = {}) {
  const opts = {...DEFAULT_OPTIONS, ...options};

  // define task
  const task = () => {
    const {filename, banner, compress} = opts;

    return src(opts.src)
      .pipe(plumber({errorHandler}))
      .pipe(concat(filename || 'bundle.css'))
      .pipe(header(banner, {pkg}))
      .pipe(dest(opts.dest))
      .pipe(cond(compress, rename({suffix: '.min'})))
      .pipe(cond(compress, postcss([csso({restructure: false})])))
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
