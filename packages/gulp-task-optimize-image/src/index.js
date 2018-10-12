import {src, dest} from 'gulp';
import plumber from 'gulp-plumber';
import cond from 'gulp-if';
import filter from 'gulp-filter';
import imagemin from 'gulp-imagemin';
import gzip from 'gulp-gzip';
import evenizer from '@hidoo/gulp-plugin-image-evenizer';
import errorHandler from '@hidoo/gulp-util-error-handler';

/**
 * task default options.
 * @type {Object}
 */
const DEFAULT_OPTIONS = {
  name: 'optimize:image',
  src: null,
  dest: null,
  evenize: false,
  compress: false,
  compressOptions: [
    imagemin.gifsicle({interlaced: true}),
    imagemin.jpegtran({progressive: true}),
    imagemin.optipng({optimizationLevel: 5}),
    imagemin.svgo()
  ],
  verbose: false
};

/**
 * record last run time
 * @type {WeakMap}
 */
const lastRunRecords = new WeakMap();

/**
 * return image optimize task
 * @param {Object} options - option
 * @param {String} [options.name='optimize:image'] - task name (use as displayName)
 * @param {String} options.src - source path
 * @param {String} options.dest - destination path
 * @param {Boolean} [options.evenize=false] - apply evenize or not
 * @param {Boolean} [options.compress=false] - compress file or not
 * @param {Array} [options.compressOptions] - compress options.
 *   see: {@link ./src/index.js DEFAULT_OPTIONS}.
 *   see: {@link https://www.npmjs.com/package/gulp-imagemin gulp-imagemin}
 * @param {Boolean} [options.verbose=false] - out log or not
 * @return {Function<Stream>}
 *
 * @example
 * import {task} from 'gulp';
 * import optimizeImage from '@hidoo/gulp-task-optimize-image';
 *
 * task('image', optimizeImage({
 *   name: 'image:main',
 *   src: '/path/to/images/*.{jpg,jpeg,gif,png,svg,ico}',
 *   dest: '/path/to/dest',
 *   evenize: true,
 *   compress: true,
 *   compressOptions: [ // Default for this options
 *     imagemin.gifsicle({interlaced: true}),
 *     imagemin.jpegtran({progressive: true}),
 *     imagemin.optipng({optimizationLevel: 5}),
 *     imagemin.svgo()
 *   ],
 *   verbose: true
 * }));
 */
export default function optimizeImage(options = {}) {
  const opts = {...DEFAULT_OPTIONS, ...options},
        isImage = filter('**/*.{jpg,jpeg,gif,png}', {restore: true}),
        isSvg = filter('**/*.svg', {restore: true}),
        isntIco = filter(['**', '!**/*.ico'], {restore: true});

  // define task
  // + record last run time to lastRunRecords that use for incremental build.
  const task = () => {
    const {evenize, compress, compressOptions, verbose} = opts;

    return src(opts.src, {since: lastRunRecords.get(task)})
      .on('end', () => lastRunRecords.set(task, new Date()))
      .pipe(plumber({errorHandler}))
      .pipe(isImage)
      .pipe(cond(evenize, evenizer({verbose})))
      .pipe(isImage.restore)
      .pipe(isntIco)
      .pipe(cond(compress, imagemin([...compressOptions], {verbose})))
      .pipe(isntIco.restore)
      .pipe(dest(opts.dest))
      .pipe(isSvg)
      .pipe(cond(compress, gzip({append: true})))
      .pipe(cond(compress, dest(opts.dest)))
      .pipe(isSvg.restore);
  };

  // add displayName (used as task name for gulp)
  if (typeof opts.name === 'string' && opts.name !== '') {
    task.displayName = opts.name;
  }

  return task;
}

/**
 * gifsicle plugins for imagemin
 * @type {Function}
 *
 * @example
 * import {gifsicle} from '@hidoo/gulp-task-optimize-image';
 */
export const gifsicle = imagemin.gifsicle;

/**
 * jpegtran plugins for imagemin
 * @type {Function}
 *
 * @example
 * import {jpegtran} from '@hidoo/gulp-task-optimize-image';
 */
export const jpegtran = imagemin.jpegtran;

/**
 * optipng plugins for imagemin
 * @type {Function}
 *
 * @example
 * import {optipng} from '@hidoo/gulp-task-optimize-image';
 */
export const optipng = imagemin.optipng;

/**
 * svgo plugins for imagemin
 * @type {Function}
 *
 * @example
 * import {svgo} from '@hidoo/gulp-task-optimize-image';
 */
export const svgo = imagemin.svgo;
