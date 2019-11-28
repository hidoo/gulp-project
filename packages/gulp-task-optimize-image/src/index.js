import {src, dest, lastRun} from 'gulp';
import plumber from 'gulp-plumber';
import cond from 'gulp-if';
import imagemin from 'gulp-imagemin';
import gzip from 'gulp-gzip';
import imageminMozjpeg from 'imagemin-mozjpeg';
import imageEvenizer from '@hidoo/gulp-plugin-image-evenizer';
import imagePlaceholder from '@hidoo/gulp-plugin-image-placeholder';
import errorHandler from '@hidoo/gulp-util-error-handler';

/**
 * gifsicle plugins for imagemin
 *
 * @type {Function}
 *
 * @example
 * import {gifsicle} from '@hidoo/gulp-task-optimize-image';
 */
export const gifsicle = imagemin.gifsicle;

/**
 * jpegtran plugins for imagemin
 *
 * @type {Function}
 *
 * @example
 * import {jpegtran} from '@hidoo/gulp-task-optimize-image';
 */
export const jpegtran = imagemin.jpegtran;

/**
 * mozjpeg plugins for imagemin
 *
 * @type {Function}
 *
 * @example
 * import {mozjpeg} from '@hidoo/gulp-task-optimize-image';
 */
export const mozjpeg = imageminMozjpeg;

/**
 * optipng plugins for imagemin
 *
 * @type {Function}
 *
 * @example
 * import {optipng} from '@hidoo/gulp-task-optimize-image';
 */
export const optipng = imagemin.optipng;

/**
 * svgo plugins for imagemin
 *
 * @type {Function}
 *
 * @example
 * import {svgo} from '@hidoo/gulp-task-optimize-image';
 */
export const svgo = imagemin.svgo;

/**
 * task default options.
 *
 * @type {Object}
 */
const DEFAULT_OPTIONS = {
  name: 'optimize:image',
  src: null,
  dest: null,
  evenize: false,
  placeholder: false,
  compress: false,
  compressOptions: [
    gifsicle({interlaced: true}),
    mozjpeg({quality: 90, progressive: true}),
    optipng({optimizationLevel: 5}),
    svgo()
  ],
  verbose: false
};

/**
 * return image optimize task
 *
 * @param {Object} options - option
 * @param {String} [options.name='optimize:image'] - task name (use as displayName)
 * @param {String} options.src - source path
 * @param {String} options.dest - destination path
 * @param {Boolean} [options.evenize=false] - apply evenize or not
 * @param {Boolean} [options.placeholder=false] - generate placeholder image or not
 * @param {Boolean} [options.compress=false] - compress file or not
 * @param {Array} [options.compressOptions] - compress options.
 *   see: {@link ./src/index.js DEFAULT_OPTIONS}.
 *   see: {@link https://www.npmjs.com/package/gulp-imagemin gulp-imagemin}
 * @param {Boolean} [options.verbose=false] - out log or not
 * @return {Function<Stream>}
 *
 * @example
 * import {task} from 'gulp';
 * import optimizeImage, {
 *   gifsicle,
 *   mozjpeg,
 *   optipng,
 *   svgo
 * } from '@hidoo/gulp-task-optimize-image';
 *
 * task('image', optimizeImage({
 *   name: 'image:main',
 *   src: '/path/to/images/*.{jpg,jpeg,gif,png,svg,ico}',
 *   dest: '/path/to/dest',
 *   evenize: true,
 *   placeholder: true,
 *   compress: true,
 *   // Default for this options
 *   compressOptions: [
 *     gifsicle({interlaced: true}),
 *     mozjpeg({quality: 90, progressive: true}),
 *     optipng({optimizationLevel: 5}),
 *     svgo()
 *   ],
 *   verbose: true
 * }));
 */
export default function optimizeImage(options = {}) {
  const opts = {...DEFAULT_OPTIONS, ...options},
        isImage = '**/*.{jpg,jpeg,gif,png}',
        isSvg = '**/*.svg',
        isntIco = '!**/*.ico';

  // define task
  const task = () => {
    const {evenize, placeholder, compress, compressOptions, verbose} = opts,
          since = lastRun(task);

    return src(opts.src, {since})
      .pipe(plumber({errorHandler}))
      .pipe(cond(isImage, cond(evenize, imageEvenizer({verbose}))))
      .pipe(cond(isntIco, cond(placeholder, imagePlaceholder({append: true, verbose}))))
      .pipe(cond(isntIco, cond(compress, imagemin([...compressOptions], {verbose}))))
      .pipe(dest(opts.dest))
      .pipe(cond(isSvg, cond(compress, gzip({append: true}))))
      .pipe(cond(isSvg, cond(compress, dest(opts.dest))));
  };

  // add displayName (used as task name for gulp)
  if (typeof opts.name === 'string' && opts.name !== '') {
    task.displayName = opts.name;
  }

  return task;
}
