import path from 'node:path';
import { fileURLToPath } from 'node:url';
import gulp from 'gulp';
import plumber from 'gulp-plumber';
import cond from 'gulp-if';
import spritesmith from 'gulp.spritesmith';
import imagemin, { gifsicle, mozjpeg, optipng } from 'gulp-imagemin';
import merge from 'merge-stream';
import buffer from 'vinyl-buffer';
import * as helpers from '@hidoo/handlebars-helpers';
import evenizer from '@hidoo/gulp-plugin-image-evenizer';
import errorHandler from '@hidoo/gulp-util-error-handler';

/**
 * imagemin plugins
 *
 * @type {Function}
 *
 * @example
 * import { gifsicle, mozjpeg, optipng } from '@hidoo/gulp-task-build-sprite-image';
 */
export { gifsicle, mozjpeg, optipng };

/**
 * dirname
 *
 * @type {String}
 */
const dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * path of css templates
 *
 * @type {Map}
 */
const TEMPLATES = new Map([
  ['stylus', path.resolve(dirname, '../template/stylus.hbs')],
  ['sass', path.resolve(dirname, '../template/scss.hbs')],
  ['sass:module', path.resolve(dirname, '../template/scss-module.hbs')]
]);

/**
 * task default options.
 *
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
  cssPreprocessor: 'stylus',
  cssTemplate: '',
  cssHandlebarsHelpers: helpers,
  evenize: false,
  compress: false,
  verbose: false
};

/**
 * return build image sprite sheet task
 *
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
 * @param {String} [options.cssPreprocessor='stylus'] - type of css preprocessor (one of [stylus|sass|sass:module]).
 * @param {String} [options.cssTemplate=path.resolve(__dirname, '../template/stylus.hbs')] - Handlebars template for css.
 *   `options.cssPreprocessor` is ignored if this value is specified.
 *   see: {@link ./template/stylus.hbs default template}
 * @param {Object} [options.cssHandlebarsHelpers=require('@hidoo/handlebars-helpers')] - Handlebars helpers
 * @param {Boolean} [options.evenize=false] - apply evenize or not
 * @param {Boolean|Object} [options.compress=false] - compress file whether or not
 * @param {Array<Function>} options.compress.imagemin - list of imagemin plugins
 * @param {Boolean} [options.verbose=false] - out log or not
 * @return {Function<Stream>}
 *
 * @example
 * import {task} from 'gulp';
 * import buildSprite, {
 *   gifsicle,
 *   mozjpeg,
 *   optipng
 * } from '@hidoo/gulp-task-build-sprite-image';
 *
 * task('sprite', buildSprite({
 *   name: 'sprite:main',
 *   src: '/path/to/sprite/*.png',
 *   destImg: '/path/to/dest/image',
 *   destCss: '/path/to/dest/css',
 *   imgName: 'sprite.png',
 *   cssName: 'sprite.styl',
 *   imgPath: './path/from/css/to/sprite/sprite.png',
 *   padding: 10,
 *   algorithm: 'top-down',
 *   engine: 'pixelsmith',
 *   cssPreprocessor: 'sass',
 *   cssTemplate: '/path/to/template/sass.hbs',
 *   cssHandlebarsHelpers: {hoge: (value) => value},
 *   evenize: true,
 *   compress: {
 *     imagemin: [
 *       gifsicle({ interlaced: true }),
 *       mozjpeg({ quality: 90, progressive: true }),
 *       optipng({ optimizationLevel: 5 })
 *     ]
 *   },
 *   verbose: true
 * }));
 */
export default function buildSprite(options = {}) {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  if (!opts.cssTemplate && TEMPLATES.has(opts.cssPreprocessor)) {
    opts.cssTemplate = TEMPLATES.get(opts.cssPreprocessor);
  }

  // define task
  const task = () => {
    const { evenize, verbose } = opts;
    const enableCompress = Boolean(opts.compress);
    const compressOpts = {
      imagemin: [
        gifsicle({ interlaced: true }),
        mozjpeg({ quality: 90, progressive: true }),
        optipng({ optimizationLevel: 5 })
      ],
      ...(opts.compress && typeof opts.compress === 'object'
        ? opts.compress
        : {}),
      verbose
    };

    const stream = gulp
      .src(opts.src)
      .pipe(plumber({ errorHandler }))
      .pipe(cond(evenize, evenizer({ verbose })))
      .pipe(spritesmith(opts));

    // out css stream
    const css = stream.css.pipe(gulp.dest(opts.destCss));

    // out image stream
    // + it optimize if opts.compress
    const image = stream.img
      .pipe(buffer())
      .pipe(cond(enableCompress, imagemin(compressOpts.imagemin, { verbose })))
      .pipe(gulp.dest(opts.destImg));

    // return merged stream
    return merge(css, image);
  };

  // add displayName (used as task name for gulp)
  if (typeof opts.name === 'string' && opts.name !== '') {
    task.displayName = opts.name;
  }

  return task;
}
