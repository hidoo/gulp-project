import path from 'path';
import kss from 'kss';
import errorHandler from '@hidoo/gulp-util-error-handler';

/**
 * task default options.
 * @type {Object}
 */
const DEFAULT_OPTIONS = {
  name: 'build:styleguide',
  src: null,
  dest: null,
  css: [],
  js: [],
  homepage: 'README.md',
  placeholder: '{{modifier_class}}',
  'nav-depth': 2,
  mask: '*.css',
  builder: path.resolve(__dirname, '../builder'),
  verbose: false
};

/**
 * return build styleguide task by kss
 * @param {Object} options option
 * @param {String} [options.name='build:styleguide'] - task name (use as displayName)
 * @param {String} options.src - source path
 * @param {String} options.dest - destination path
 * @param {Array<String>} [options.css=[]] - css paths that load to styleguide
 * @param {Array<String>} [options.js=[]] - javascript paths that load to styleguide
 * @param {String} [options.homepage='README.md'] - markdown filename that load to styleguide.
 *   it must be located in the same directory with options.src
 * @param {String} [options.placeholder='{{modifier_class}}'] - modifier string
 * @param {Number} [options.nav-depth=2] - navigation depth to display
 * @param {String} [options.mask='*.css'] - masking of file that includes kss comments
 * @param {String} [options.builder=path.resolve(__dirname, '../builder')] - builder path.
 *   see: {@link ./builder default builder}
 * @param {Boolean} [options.verbose=false] - out log or not
 * @return {Function<Promise>}
 *
 * @example
 * import {task} from 'gulp';
 * import buildStyleguide from '@hidoo/gulp-task-build-styleguide-kss';
 *
 * task('styleguide', buildStyleguide({
 *   name: 'styleguide:main',
 *   src: '/path/to/css',
 *   dest: '/path/to/dest'
 *   css: ['./path/from/styleguide/to/css/extra.css'],
 *   js: ['./path/from/styleguide/to/js/extra.js'],
 *   homepage: 'README.md',
 *   placeholder: '{{modifier_class}}',
 *   'nav-depth': 2,
 *   mask: '*.css',
 *   builder: '/path/to/builder',
 *   verbose: true
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
