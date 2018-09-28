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
  name: 'build:sprite',
  src: null,
  destImg: null,
  destCss: null,
  imgName: null,
  cssName: null,
  imgPath: null,
  padding: 2,
  algorithm: 'binary-tree',
  engine: 'pixelsmith',
  cssTemplate: path.resolve(__dirname, '../template/stylus.hbs'),
  cssHandlebarsHelpers: helpers,
  evenize: false,
  evenizeOptions: {imageMagick: true},
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
 * return build image sprite sheet task
 * @param {Object} options - option
 * @param {String} [options.name='build:sprite'] - task name (use as displayName)
 * @param {String} options.src - source path
 * @param {String} options.destImg - destination image path
 * @param {String} options.destCss - destination css path
 * @param {String} options.imgName - destination image filename
 * @param {String} options.cssName - destination css filename
 * @param {String} options.imgPath - destination image path in css
 * @param {Number} [options.padding=2] - padding between image in sprite sheet.
 *   see: {@link https://www.npmjs.com/package/gulp.spritesmith gulp.spritesmith}
 * @param {String} [options.algorithm='binary-tree'] - algorithm for generate sprite sheet.
 *   see: {@link https://www.npmjs.com/package/gulp.spritesmith gulp.spritesmith}
 * @param {String} [options.engine='pixelsmith'] - engine for generate sprite sheet.
 *   see: {@link https://www.npmjs.com/package/gulp.spritesmith gulp.spritesmith}
 * @param {String} [options.cssTemplate=path.resolve(__dirname, '../template/stylus.hbs')] - Handlebars template for css.
 *   see: {@link ./template/stylus.hbs default template}
 * @param {Object} [options.cssHandlebarsHelpers=require('@hidoo/handlebars-helpers')] - Handlebars helpers
 * @param {Boolean} [options.evenize=false] - apply evenize or not
 * @param {Object} [options.evenizeOptions={imageMagick: true}] - evenize options
 * @param {Boolean} [options.compress=false] - compress file or not
 * @param {Array} [options.compressOptions] - compress options.
 *   see: {@link ./src/index.js DEFAULT_OPTIONS}.
 *   see: {@link https://www.npmjs.com/package/gulp-imagemin gulp-imagemin}
 * @param {Boolean} [options.verbose=false] - out log or not
 * @return {Function<Stream>}
 *
 * @example
 * import {task} from 'gulp';
 * import buildSprite from '@hidoo/gulp-task-build-sprite-image';
 *
 * task('sprite', buildSprite({
 *   name: 'sprite:main',
 *   src: '/path/to/sprite/*.png',
 *   destImg: '/path/to/dest/image',
 *   destCss: '/path/to/dest/css',
 *   imgName: 'sprite.png',
 *   cssName: 'sprite.styl',
 *   imgPath: './path/from/css/to/sprite/sprite.png'
 *   padding: 10,
 *   algorithm: 'top-down',
 *   engine: 'pixelsmith',
 *   cssTemplate: '/path/to/template/stylus.hbs',
 *   cssHandlebarsHelpers: {hoge: (value) => value},
 *   evenize: true,
 *   evenizeOptions: {imageMagick: false},
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
