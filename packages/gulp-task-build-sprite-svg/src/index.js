import path from 'path';
import {src, dest} from 'gulp';
import plumber from 'gulp-plumber';
import cond from 'gulp-if';
import imagemin from 'gulp-imagemin';
import gzip from 'gulp-gzip';
import merge from 'merge-stream';
import buffer from 'vinyl-buffer';
import svgSprite from '@hidoo/gulp-plugin-svg-sprite';
import * as helpers from '@hidoo/handlebars-helpers';
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

  // layout for generate sprite sheet（one of packed, vertical, and horizontal）
  layout: 'packed',

  // Handlebars template for css
  cssTemplate: path.resolve(__dirname, '../template/stylus.hbs'),

  // Handlebars helpers
  cssHandlebarsHelpers: helpers,

  // compress file or not
  compress: false,

  // compress options
  compressOptions: [
    imagemin.svgo()
  ],

  // out log or not
  verbose: true
};

/**
 * return build svg sprite sheet task
 * @param {DEFAULT_OPTIONS} options option
 * @return {Function}
 *
 * @example
 * import {task} from 'gulp';
 * import buildSprite from '@hidoo/gulp-task-build-sprite-svg';
 *
 * task('sprite', buildSprite({
 *   src: '/path/to/sprite/*.svg',
 *   destImg: '/path/to/dest/image',
 *   destCss: '/path/to/dest/css',
 *   imgName: 'sprite.svg',
 *   cssName: 'sprite.styl',
 *   imgPath: './image/sprite.svg'
 * }));
 */
export default function buildSprite(options = {}) {
  const opts = {...DEFAULT_OPTIONS, ...options};

  // define task
  const task = () => {
    const {compress, compressOptions, verbose} = opts;

    const stream = src(opts.src)
      .pipe(plumber({errorHandler}))
      .pipe(svgSprite(opts));

    // out css stream
    const css = stream.css.pipe(dest(opts.destCss));

    // out image stream
    // + it optimize if opts.compress
    const svg = stream.svg.pipe(buffer())
      .pipe(cond(compress, imagemin([...compressOptions], {verbose})))
      .pipe(dest(opts.destImg))
      .pipe(cond(compress, gzip({append: true})))
      .pipe(cond(compress, dest(opts.destImg)));

    // return merged stream
    return merge(css, svg);
  };

  // add displayName (used as task name for gulp)
  if (typeof opts.name === 'string' && opts.name !== '') {
    task.displayName = opts.name;
  }

  return task;
}
