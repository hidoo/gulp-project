import gulp from 'gulp';
import plumber from 'gulp-plumber';
import errorHandler from '@hidoo/gulp-util-error-handler';

/**
 * task default options.
 *
 * @type {Object}
 */
const DEFAULT_OPTIONS = {
  name: 'copy:asset',
  src: null,
  dest: null
};

/**
 * return copy files task
 *
 * @param {Object} options - options
 * @param {String} [options.name='copy:asset'] - task name (use as displayName)
 * @param {String} options.src - source path
 * @param {String} options.dest - destination path
 * @return {Function<Stream>}
 *
 * @example
 * import {task} from 'gulp';
 * import copy from '@hidoo/gulp-task-copy';
 *
 * task('copy', copy({
 *   name: 'copy:main',
 *   src: '/path/to/src',
 *   dest: '/path/to/dest'
 * }));
 */
export default function copy(options = {}) {
  const opts = {...DEFAULT_OPTIONS, ...options};

  // define task
  const task = () => gulp.src(opts.src)
    .pipe(plumber({errorHandler}))
    .pipe(gulp.dest(opts.dest));

  // add displayName (used as task name for gulp)
  if (typeof opts.name === 'string' && opts.name !== '') {
    task.displayName = opts.name;
  }

  return task;
}
