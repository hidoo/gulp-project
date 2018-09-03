import {src, dest} from 'gulp';
import plumber from 'gulp-plumber';
import errorHandler from '@hidoo/gulp-util-error-handler';

/**
 * task default options.
 * @type {Object}
 */
const DEFAULT_OPTIONS = {

  // task name (set displayName)
  name: 'copy:asset',

  // source path (required)
  src: null,

  // destination path (required)
  dest: null
};

/**
 * return copy files task
 * @param {DEFAULT_OPTIONS} options options
 * @return {Function}
 *
 * @example
 * import {task} from 'gulp';
 * import {concatJs} from '@hidoo/gulp-task-copy';
 *
 * task('copy', copy({
 *   src: '/path/to/src',
 *   dest: '/path/to/dest'
 * }));
 */
export default function copy(options = {}) {
  const opts = {...DEFAULT_OPTIONS, ...options};

  // define task
  const task = () => src(opts.src)
    .pipe(plumber({errorHandler}))
    .pipe(dest(opts.dest));

  // add displayName (used as task name for gulp)
  if (typeof opts.name === 'string' && opts.name !== '') {
    task.displayName = opts.name;
  }

  return task;
}
