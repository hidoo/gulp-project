import path from 'path';
import {src, dest} from 'gulp';
import plumber from 'gulp-plumber';
import cond from 'gulp-if';
import stylus from 'gulp-stylus';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import cssmqpacker from 'css-mqpacker';
import uncss from 'postcss-uncss';
import csso from 'postcss-csso';
import header from 'gulp-header';
import rename from 'gulp-rename';
import gzip from 'gulp-gzip';
import errorHandler from '@hidoo/gulp-util-error-handler';

/**
* task default options.
 * @type {Object}
 */
const DEFAULT_OPTIONS = {

  // task name (set displayName)
  name: 'build:css',

  // source path (required)
  src: null,

  // destination path (required)
  dest: null,

  // destination filename
  filename: 'main.css',

  // target browsers
  // + http://browserl.ist/?q=%3E+0.5%25+in+JP%2C+ie%3E%3D+10%2C+android+%3E%3D+4.4
  browsers: ['> 0.5% in JP', 'ie >= 10', 'android >= 4.4'],

  // licence comments
  banner: '',

  // stylus options
  stylusOptions: {
    rawDefine: {
      NODE_ENV: process.env.NODE_ENV || 'development' // eslint-disable-line no-process-env
    }
  },

  // array of html file path that target of uncss process
  uncssTargets: [],

  // array of selector that should not removed
  uncssIgnore: [],

  /**
   * additional PostCss process
   * @param {Root} root instance of PostCSS Root class
   * @return {Root}
   */
  additionalProcess: null,

  // compress file or not
  compress: false
};

/**
 * return css build task by stylus
 * @param  {DEFAULT_OPTIONS} options options
 * @return {Function}
 *
 * @example
 import {task} from 'gulp';
 import buildCss from '@hidoo/gulp-task-build-css-stylus';

 task('css', buildCss({
   src: '/path/to/stylus/main.styl',
   dest: '/path/to/dest'
 }));
 */
export default function buildCss(options = {}) {
  const opts = {...DEFAULT_OPTIONS, ...options};

  // define task
  const task = () => {
    const {
            filename, browsers, banner,
            stylusOptions,
            uncssTargets, uncssIgnore,
            additionalProcess,
            compress
          } = opts,
          extname = path.extname(filename),
          basename = path.basename(filename, extname),
          postProcesses = [];

    postProcesses.push(autoprefixer({browsers}));
    postProcesses.push(cssmqpacker);

    // add post process if opts.uncssTargets is valid
    if (Array.isArray(uncssTargets) && Boolean(uncssTargets.length)) {
      postProcesses.push(uncss({
        html: uncssTargets,
        ignore: Array.isArray(uncssIgnore) ? uncssIgnore : []
      }));
    }
    // add post process if opts.additionalProcess is valid
    if (typeof additionalProcess === 'function') {
      postProcesses.push(additionalProcess);
    }

    return src(opts.src)
      .pipe(plumber({errorHandler}))
      .pipe(stylus({...stylusOptions}))
      .pipe(postcss([...postProcesses]))
      .pipe(header(banner))
      .pipe(rename({basename, extname}))
      .pipe(dest(opts.dest))
      .pipe(cond(compress, rename({suffix: '.min'})))
      .pipe(cond(compress, postcss([csso({restructure: false})])))
      .pipe(cond(compress, dest(opts.dest)))
      .pipe(cond(compress, gzip({append: true})))
      .pipe(cond(compress, dest(opts.dest)));
  };

  // add displayName (used as task name for gulp)
  if (typeof opts.name === 'string' && opts.name !== '') {
    task.displayName = opts.name;
  }

  return task;
}
