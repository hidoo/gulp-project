import gulp from 'gulp';
import plumber from 'gulp-plumber';
import cond from 'gulp-if';
import imagemin, { gifsicle, mozjpeg, optipng, svgo } from 'gulp-imagemin';
import compress from '@hidoo/gulp-plugin-compress';
import imageEvenizer from '@hidoo/gulp-plugin-image-evenizer';
import imagePlaceholder from '@hidoo/gulp-plugin-image-placeholder';
import webp from '@hidoo/gulp-plugin-webp';
import errorHandler from '@hidoo/gulp-util-error-handler';

/**
 * imagemin plugins
 *
 * @type {Function}
 *
 * @example
 * import {gifsicle, mozjpeg, optipng, svgo} from '@hidoo/gulp-task-optimize-image';
 */
export { gifsicle, mozjpeg, optipng, svgo };

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
  webp: false,
  compress: false,
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
 * @param {Boolean|Object} [options.webp=false] - generate webp or not. use as webp options if object specified.
 * @param {Boolean|import('@hidoo/gulp-plugin-compress').defaultOptions} [options.compress=false] - compress file whether or not
 * @param {Array<Function>} options.compress.imagemin - list of imagemin plugins
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
 *   webp: {
 *     method: 6
 *   },
 *   compress: {
 *     imagemin: [
 *       gifsicle({ interlaced: true }),
 *       mozjpeg({ quality: 90, progressive: true }),
 *       optipng({ optimizationLevel: 5 }),
 *       svgo()
 *     ]
 *   },
 *   verbose: true
 * }));
 */
export default function optimizeImage(options = {}) {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const isImage = '**/*.{jpg,jpeg,gif,png}';
  const isSvg = '**/*.svg';
  const isntIco = '!**/*.ico';

  // define task
  const task = () => {
    const { evenize, placeholder, verbose } = opts;
    const since = gulp.lastRun(task);
    const enableCompress = Boolean(opts.compress);
    const compressOpts = {
      imagemin: [
        gifsicle({ interlaced: true }),
        mozjpeg({ quality: 90, progressive: true }),
        optipng({ optimizationLevel: 5 }),
        svgo()
      ],
      ...(opts.compress && typeof opts.compress === 'object'
        ? opts.compress
        : {}),
      verbose
    };
    const webpOpts = {
      ...(opts.webp &&
      typeof opts.webp === 'object' &&
      !Array.isArray(opts.webp)
        ? opts.webp
        : {}),
      verbose
    };

    return gulp
      .src(opts.src, { since })
      .pipe(plumber({ errorHandler }))
      .pipe(cond(isImage, cond(evenize, imageEvenizer({ verbose }))))
      .pipe(cond(isImage, cond(opts.webp, webp(webpOpts))))
      .pipe(
        cond(
          isntIco,
          cond(placeholder, imagePlaceholder({ append: true, verbose }))
        )
      )
      .pipe(
        cond(
          isntIco,
          cond(enableCompress, imagemin(compressOpts.imagemin, { verbose }))
        )
      )
      .pipe(cond(isSvg, cond(enableCompress, compress(compressOpts))))
      .pipe(gulp.dest(opts.dest));
  };

  // add displayName (used as task name for gulp)
  if (typeof opts.name === 'string' && opts.name !== '') {
    task.displayName = opts.name;
  }

  return task;
}
