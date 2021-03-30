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
import url from 'postcss-url';
import header from 'gulp-header';
import rename from 'gulp-rename';
import gzip from 'gulp-gzip';
import log from 'fancy-log';
import errorHandler from '@hidoo/gulp-util-error-handler';

let pkg = {};

// try to load package.json that on current working directory
try {
  // eslint-disable-next-line node/global-require, import/no-dynamic-require
  pkg = require(path.resolve(process.cwd(), 'package.json'));
}
catch (error) {
  log.error('Failed to load package.json.');
}

/**
 * task default options.
 *
 * @type {Object}
 */
const DEFAULT_OPTIONS = {
  name: 'build:css',
  src: null,
  dest: null,
  filename: 'main.css',
  suffix: '.min',
  browsers: ['> 0.5% in JP', 'ie >= 10', 'android >= 4.4'],
  banner: '',
  stylusOptions: {rawDefine: {}},
  url: null,
  urlOptions: {},
  uncssTargets: [],
  uncssIgnore: [],
  additionalProcess: null,
  compress: false
};

/**
 * return css build task by stylus
 *
 * @param  {Object} options - options
 * @param  {String} [options.name='build:css'] - task name (use as displayName)
 * @param  {String} options.src - source path
 * @param  {String} options.dest - destination path
 * @param  {String} [options.filename='main.css'] - destination filename
 * @param  {String} [options.suffix='.min'] - suffix when compressed
 * @param  {Array<String>} [options.browsers] - target browsers.
 *   see: {@link http://browserl.ist/?q=%3E+0.5%25+in+JP%2C+ie%3E%3D+10%2C+android+%3E%3D+4.4 default target browsers}
 * @param  {String} [options.banner=''] - license comments
 * @param  {Object} [options.stylusOptions={rawDefine: {}}] - stylus options.
 *   see: {@link https://www.npmjs.com/package/gulp-stylus gulp-stylus options}
 * @param  {String} [options.url=null] - type of processing of url() (one of [inline|copy|rebase])
 *   see: {@link https://www.npmjs.com/package/postcss-url}
 * @param  {Object} [options.urlOptions={}] - options of processing of url()
 *   see: {@link https://www.npmjs.com/package/postcss-url#options-combinations}
 * @param  {Array<String>} [options.uncssTargets=[]] - array of html file path that target of uncss process
 * @param  {Array<String>} [options.uncssIgnore=[]] - array of selector that should not removed
 * @param  {Function<PostCSSRoot>} [options.additionalProcess=null] - additional PostCss process
 * @param  {Boolean} [options.compress=false] - compress file or not
 * @return {Function<Stream>}
 *
 * @example
 * import {task} from 'gulp';
 * import buildCss from '@hidoo/gulp-task-build-css-stylus';
 *
 * task('css', buildCss({
 *   name: 'css:main',
 *   src: '/path/to/stylus/main.styl',
 *   dest: '/path/to/dest',
 *   filename: 'styles.css',
 *   suffix: '.hoge',
 *   browsers: ['> 0.1% in JP'],
 *   banner: '/*! copyright <%= pkg.author %> * /\n',
 *   stylusOptions: {rawDefine: {}},
 *   url: 'inline',
 *   urlOptions: {basePath: path.resolve(process.cwd(), 'src/images')},
 *   uncssTargets: ['/path/to/html/target.html'],
 *   uncssIgnore: ['.ignore-selector'],
 *   additionalProcess: (root) => root,
 *   compress: true
 * }));
 */
export default function buildCss(options = {}) {
  const opts = {...DEFAULT_OPTIONS, ...options};

  // define task
  const task = () => {
    const {
            filename, suffix, browsers, banner,
            uncssTargets, uncssIgnore,
            additionalProcess,
            compress
          } = opts,
          extname = path.extname(filename),
          basename = path.basename(filename, extname),
          stylusOptions = opts.stylusOptions || {},
          postProcesses = [];

    // additinal stylus data
    // + always add NODE_ENV
    const mergedStylusOptions = {
      ...stylusOptions,
      rawDefine: {
        ...stylusOptions.rawDefine,
        NODE_ENV: process.env.NODE_ENV || 'development' // eslint-disable-line node/no-process-env
      }
    };

    // add default post css process
    postProcesses.push(autoprefixer({overrideBrowserslist: browsers}));
    postProcesses.push(cssmqpacker);

    // add post css process by postcss-url
    if (
      typeof opts.url === 'string' &&
      ['inline', 'copy', 'rebase'].includes(opts.url)
    ) {
      postProcesses.push(url({
        ...opts.urlOptions,
        url: opts.url
      }));
    }

    // add post css process if opts.uncssTargets is valid
    if (Array.isArray(uncssTargets) && Boolean(uncssTargets.length)) {
      postProcesses.push(uncss({
        html: uncssTargets,
        ignore: Array.isArray(uncssIgnore) ? uncssIgnore : []
      }));
    }

    // add post css process if opts.additionalProcess is valid
    if (typeof additionalProcess === 'function') {
      postProcesses.push(additionalProcess);
    }

    return src(opts.src)
      .pipe(plumber({errorHandler}))
      .pipe(stylus(mergedStylusOptions))
      .pipe(postcss([...postProcesses]))
      .pipe(header(banner, {pkg}))
      .pipe(rename({basename, extname}))
      .pipe(dest(opts.dest))
      .pipe(cond(compress, rename({suffix})))
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
