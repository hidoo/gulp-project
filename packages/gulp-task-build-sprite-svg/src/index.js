import path from 'node:path';
import { fileURLToPath } from 'node:url';
import gulp from 'gulp';
import plumber from 'gulp-plumber';
import cond from 'gulp-if';
import imagemin, { svgo } from 'gulp-imagemin';
import gzip from 'gulp-gzip';
import merge from 'merge-stream';
import buffer from 'vinyl-buffer';
import svgSprite from '@hidoo/gulp-plugin-svg-sprite';
import * as helpers from '@hidoo/handlebars-helpers';
import errorHandler from '@hidoo/gulp-util-error-handler';

/**
 * svgo plugins for imagemin
 *
 * @type {Function}
 *
 * @example
 * import {svgo} from '@hidoo/gulp-task-build-sprite-svg';
 */
export { svgo } from 'gulp-imagemin';

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
  layout: 'packed',
  cssPreprocessor: 'stylus',
  cssTemplate: '',
  cssHandlebarsHelpers: helpers,
  compress: false,
  compressOptions: [svgo()],
  verbose: false
};

/**
 * return build svg sprite sheet task
 *
 * @param {Object} options option
 * @param {String} [options.name='build:sprite'] - task name (use as displayName)
 * @param {String} options.src - source path
 * @param {String} options.destImg - destination image path
 * @param {String} options.destCss - destination css path
 * @param {String} options.imgName - destination image filename
 * @param {String} options.cssName - destination css filename
 * @param {String} options.imgPath - destination image path in css
 * @param {Number} [options.padding=2] - padding between image in sprite sheet
 * @param {String} [options.layout='packed'] - layout for generate sprite sheet（one of [packed|vertical|horizontal]）
 * @param {String} [options.cssPreprocessor='stylus'] - type of css preprocessor (one of [stylus|sass|sass:module]).
 * @param {String} [options.cssTemplate=path.resolve(__dirname, '../template/stylus.hbs')] - Handlebars template for css.
 *   `options.cssPreprocessor` is ignored if this value is specified.
 *   see: {@link ./template/stylus.hbs default template}
 * @param {Object} [options.cssHandlebarsHelpers=require('@hidoo/handlebars-helpers')] - Handlebars helpers
 * @param {Boolean} [options.compress=false] - compress file or not
 * @param {Array} [options.compressOptions] - compress options.
 *   see: {@link ./src/index.js DEFAULT_OPTIONS}.
 *   see: {@link https://www.npmjs.com/package/gulp-imagemin gulp-imagemin}
 * @param {Boolean} [options.verbose=false] - out log or not
 * @return {Function<Stream>}
 *
 * @example
 * import {task} from 'gulp';
 * import buildSprite, {svgo} from '@hidoo/gulp-task-build-sprite-svg';
 *
 * task('sprite', buildSprite({
 *   name: 'sprite:main',
 *   src: '/path/to/sprite/*.svg',
 *   destImg: '/path/to/dest/image',
 *   destCss: '/path/to/dest/css',
 *   imgName: 'sprite.svg',
 *   cssName: 'sprite.styl',
 *   imgPath: './path/from/css/to/sprite/sprite.svg',
 *   padding: 10,
 *   layout: 'vertical',
 *   cssPreprocessor: 'sass',
 *   cssTemplate: '/path/to/template/sass.hbs',
 *   cssHandlebarsHelpers: {hoge: (value) => value},
 *   compress: true,
 *   // Default for this options
 *   compressOptions: [
 *     svgo()
 *   ],
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
    const { compress, compressOptions, verbose } = opts;

    const stream = gulp
      .src(opts.src)
      .pipe(plumber({ errorHandler }))
      .pipe(svgSprite(opts));

    // out css stream
    const css = stream.css.pipe(gulp.dest(opts.destCss));

    // out image stream
    // + it optimize if opts.compress
    const svg = stream.svg
      .pipe(buffer())
      .pipe(cond(compress, imagemin([...compressOptions], { verbose })))
      .pipe(gulp.dest(opts.destImg))
      .pipe(cond(compress, gzip({ append: true })))
      .pipe(cond(compress, gulp.dest(opts.destImg)));

    // return merged stream
    return merge(css, svg);
  };

  // add displayName (used as task name for gulp)
  if (typeof opts.name === 'string' && opts.name !== '') {
    task.displayName = opts.name;
  }

  return task;
}
