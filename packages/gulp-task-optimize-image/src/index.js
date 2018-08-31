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

  // task name (set displayName)
  name: 'optimize:image',

  // source path (required)
  src: null,

  // destination path (required)
  dest: null,

  // apply evenize or not
  evenize: false,

  // evenize options
  evenizeOptions: {
    imageMagick: true
  },

  // compress file or not
  compress: false,

  // compress options
  compressOptions: [
    imagemin.gifsicle({interlaced: true}),
    imagemin.jpegtran({progressive: true}),
    imagemin.optipng({optimizationLevel: 5}),
    imagemin.svgo()
  ],

  // out log or not
  verbose: false
};

/**
 * record last run time
 * @type {WeakMap}
 */
const lastRunRecords = new WeakMap();

/**
 * return image optimize task
 * @param {DEFAULT_OPTIONS} options option
 * @return {Function}
 *
 * @example
 * import {task} from 'gulp';
 * import optimizeImage from '@hidoo/gulp-task-optimize-image';
 *
 * task('image', optimizeImage({
 *   src: '/path/to/images/*.{jpg,jpeg,gif,png,svg,ico}',
 *   dest: '/path/to/dest'
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
    const {evenize, evenizeOptions, compress, compressOptions, verbose} = opts,
          {imageMagick} = evenizeOptions;

    return src(opts.src, {since: lastRunRecords.get(task)})
      .on('end', () => lastRunRecords.set(task, new Date()))
      .pipe(plumber({errorHandler}))
      .pipe(isImage)
      .pipe(cond(evenize, evenizer({imageMagick, verbose})))
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
