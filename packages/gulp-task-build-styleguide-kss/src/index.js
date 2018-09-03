import path from 'path';
import kss from 'kss';
import errorHandler from '@hidoo/gulp-util-error-handler';

/**
 * task default options.
 * @type {Object}
 */
const DEFAULT_OPTIONS = {

  // task name (set displayName)
  name: 'build:styleguide',

  // source path (required)
  src: null,

  // destination path (required)
  dest: null,

  // css paths that load to styleguide
  css: [],

  // javascript paths that load to styleguide
  js: [],

  // markdown filename that load to styleguide
  // + it must be located in the same directory with options.src
  homepage: 'README.md',

  // modifier string
  placeholder: '{{modifier_class}}',

  // navigation depth to display
  'nav-depth': 2,

  // masking of file that includes kss comments
  mask: '*.css',

  // builder path
  builder: path.resolve(__dirname, '../builder'),

  // out log or not
  verbose: false
};

/**
 * return build styleguide task by kss
 * @param {DEFAULT_OPTIONS} options オプション
 * @return {Function}
 *
 * @example
 * import {task} from 'gulp';
 * import buildStyleguide from '@hidoo/gulp-task-build-styleguide-kss';
 *
 * task('styleguide', buildStyleguide({
 *   src: '/path/to/css',
 *   dest: '/path/to/dest'
 * }));
 */
export default function kssBuildTask(options = {}) {
  const opts = {...DEFAULT_OPTIONS, ...options};

  // to fit original kss options
  opts.source = opts.src;
  opts.destination = opts.dest;

  // delete unnecessary properties,
  // because occurs error if that remains
  delete opts.src;
  delete opts.dest;

  // define task
  const task = () => kss(opts).catch((error) => errorHandler(error));

  // add displayName (used as task name for gulp)
  if (typeof opts.name === 'string' && opts.name !== '') {
    task.displayName = opts.name;
  }

  return task;
}
