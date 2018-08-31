import path from 'path';
import {src, dest} from 'gulp';
import plumber from 'gulp-plumber';
import cond from 'gulp-if';
import spritesmith from 'gulp.spritesmith';
import imagemin from 'gulp-imagemin';
import merge from 'merge-stream';
import buffer from 'vinyl-buffer';
import * as helpers from '@hidoo/handlebars-helpers';
import evenizer from '@hidoo/gulp-plugin-image-evenizer';
import errorHandler from '@hidoo/gulp-util-error-handler';

/**
* task default options.
 * @type {Object}
 */
const DEFAULT_OPTIONS = {

  // task name (set displayName)
  name: 'build:sprite',

  // source path (required)
  src: null,

  // destination image path (required)
  destImg: null,

  // destination css path (required)
  destCss: null,

  // destination image filename (required)
  imgName: null,

  // destination css filename (required)
  cssName: null,

  // destination image path in css (required)
  imgPath: null,

  // padding between image in sprite sheet
  padding: 2,

  // algorithm for generate sprite sheet
  algorithm: 'binary-tree',

  // engine for generate sprite sheet
  engine: 'pixelsmith',

  // Handlebars template for css
  cssTemplate: path.resolve(__dirname, '../template/stylus.hbs'),

  // Handlebars helpers
  cssHandlebarsHelpers: helpers,

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
 * return build image sprite sheet task
 * @param {DEFAULT_OPTIONS} options option
 * @return {Function}
 *
 * @example
 * import {task} from 'gulp';
 * import buildSprite from '@hidoo/gulp-task-build-sprite-image';
 *
 * task('sprite', buildSprite({
 *   src: '/path/to/sprite/*.png',
 *   destImg: '/path/to/dest/image',
 *   destCss: '/path/to/dest/css',
 *   imgName: 'sprite.png',
 *   cssName: 'sprite.styl',
 *   imgPath: './image/sprite.png'
 * }));
 */
export default function buildSprite(options = {}) {
  const opts = {...DEFAULT_OPTIONS, ...options};

  // define task
  const task = () => {
    const {evenize, evenizeOptions, compress, compressOptions, verbose} = opts,
          {imageMagick} = evenizeOptions;

    const stream = src(opts.src)
      .pipe(plumber({errorHandler}))
      .pipe(cond(evenize, evenizer({imageMagick, verbose})))
      .pipe(spritesmith(opts));

    // out css stream
    const css = stream.css.pipe(dest(opts.destCss));

    // out image stream
    // + it optimize if opts.compress
    const image = stream.img.pipe(buffer())
      .pipe(cond(compress, imagemin([...compressOptions], {verbose})))
      .pipe(dest(opts.destImg));

    // return merged stream
    return merge(css, image);
  };

  // add displayName (used as task name for gulp)
  if (typeof opts.name === 'string' && opts.name !== '') {
    task.displayName = opts.name;
  }

  return task;
}
