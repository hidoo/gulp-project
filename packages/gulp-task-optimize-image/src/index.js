import gulp from 'gulp';
import plumber from 'gulp-plumber';
import cond from 'gulp-if';
import imagemin, { gifsicle, mozjpeg, optipng, svgo } from 'gulp-imagemin';
import gzip from 'gulp-gzip';
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
export { gifsicle, mozjpeg, optipng, svgo } from 'gulp-imagemin';

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
  compressOptions: [
    gifsicle({ interlaced: true }),
    mozjpeg({ quality: 90, progressive: true }),
    optipng({ optimizationLevel: 5 }),
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
 * @param {Boolean|Object} [options.webp=false] - generate webp or not. use as webp options if object specified.
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
 *   webp: {
 *     method: 6
 *   },
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
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const isImage = '**/*.{jpg,jpeg,gif,png}';
  const isSvg = '**/*.svg';
  const isntIco = '!**/*.ico';

  // define task
  const task = () => {
    const { evenize, placeholder, compress, compressOptions, verbose } = opts;
    const since = gulp.lastRun(task);
    let webpOptions = { verbose };

    if (
      opts.webp &&
      typeof opts.webp === 'object' &&
      !Array.isArray(opts.webp)
    ) {
      webpOptions = {
        verbose,
        ...opts.webp
      };
    }

    return gulp
      .src(opts.src, { since })
      .pipe(plumber({ errorHandler }))
      .pipe(cond(isImage, cond(evenize, imageEvenizer({ verbose }))))
      .pipe(cond(isImage, cond(opts.webp, webp(webpOptions))))
      .pipe(
        cond(
          isntIco,
          cond(placeholder, imagePlaceholder({ append: true, verbose }))
        )
      )
      .pipe(
        cond(
          isntIco,
          cond(compress, imagemin([...compressOptions], { verbose }))
        )
      )
      .pipe(gulp.dest(opts.dest))
      .pipe(cond(isSvg, cond(compress, gzip({ append: true }))))
      .pipe(cond(isSvg, cond(compress, gulp.dest(opts.dest))));
  };

  // add displayName (used as task name for gulp)
  if (typeof opts.name === 'string' && opts.name !== '') {
    task.displayName = opts.name;
  }

  return task;
}
