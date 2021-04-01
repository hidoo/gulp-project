import path from 'path';
import util from 'util';
import {dest} from 'gulp';
import cond from 'gulp-if';
import through from 'through2';
import Vinyl from 'vinyl';
import sass from 'sass';
import Fiber from 'fibers';
import magicImporter from 'node-sass-magic-importer';
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
 * default custom sass functions
 *
 * @type {Object}
 */
const DEFAULT_FUNCTIONS = {

  /**
   * add "env" function that get value from process.env
   *
   * @param {String} key key
   * @param {Function} done callback function when call asynchronously
   * @return {void|sass.compiler.types.String}
   */
  'env($key)': (key, done) => {
    const name = key.getValue(),
          result = new sass.types.String(
            process.env[name] || '' // eslint-disable-line node/no-process-env
          );

    if (typeof done === 'function') {
      return done(result);
    }
    return result;
  }
};

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
  targets: ['> 0.5% in JP', 'ie >= 10', 'android >= 4.4'],
  banner: '',
  sassOptions: {outputStyle: 'expanded'},
  url: null,
  urlOptions: {},
  uncssTargets: [],
  uncssIgnore: [],
  additionalProcess: null,
  compress: false
};

/**
 * promisifed sass.render
 *
 * @param {Object} options options of sass.render
 * @return {Promise<Object>}
 */
const render = util.promisify(sass.render).bind(sass);

/**
 * get post css processes
 *
 * @param {DEFAULT_OPTIONS} options - options
 * @return {Array<Function>}
 */
function getProcesses(options = {}) {
  const processes = [];

  // add default post css process
  processes.push(
    autoprefixer({
      overrideBrowserslist: options.browsers || options.targets || []
    })
  );
  processes.push(cssmqpacker);

  // add post css process by postcss-url
  if (
    typeof options.url === 'string' &&
    ['inline', 'copy', 'rebase'].includes(options.url)
  ) {
    processes.push(url({
      basePath: path.dirname(options.src),
      ...options.urlOptions,
      url: options.url
    }));
  }

  // add post css process if options.uncssTargets is valid
  if (
    Array.isArray(options.uncssTargets) &&
    Boolean(options.uncssTargets.length)
  ) {
    processes.push(uncss({
      html: options.uncssTargets,
      ignore: Array.isArray(options.uncssIgnore) ? options.uncssIgnore : []
    }));
  }

  // add post css process if options.additionalProcess is valid
  if (typeof options.additionalProcess === 'function') {
    processes.push(options.additionalProcess);
  }

  return processes;
}

/**
 * return css build task by sass
 *
 * @param  {Object} options - options
 * @param  {String} [options.name='build:css'] - task name (use as displayName)
 * @param  {String} options.src - source path
 * @param  {String} options.dest - destination path
 * @param  {String} [options.filename='main.css'] - destination filename
 * @param  {String} [options.suffix='.min'] - suffix when compressed
 * @param  {Array<String>} [options.targets] - target browsers.
 *   see: {@link http://browserl.ist/?q=%3E+0.5%25+in+JP%2C+ie%3E%3D+10%2C+android+%3E%3D+4.4 default target browsers}
 * @param  {Array<String>} [options.browsers] - alias of options.targets.
 * @param  {String} [options.banner=''] - license comments
 * @param  {Object} [options.sassOptions={outputStyle: 'expanded'}] - sass options.
 *   see: {@link https://sass-lang.com/documentation/js-api#options sass options}
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
 * import buildCss from '@hidoo/gulp-task-build-css-sass';
 *
 * task('css', buildCss({
 *   name: 'css:main',
 *   src: '/path/to/scss/main.scss',
 *   dest: '/path/to/dest',
 *   filename: 'styles.css',
 *   suffix: '.hoge',
 *   targets: ['> 0.1% in JP'],
 *   banner: '/*! copyright <%= pkg.author %> * /\n',
 *   sassOptions: {outputStyle: 'nested'},
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
    const {suffix, compress} = opts;
    const stream = through.obj();
    const filename = opts.filename || path.basename(opts.src);
    const sassOptions = opts.sassOptions || {};
    const compiler = render({
      file: opts.src,
      ...sassOptions,
      fiber: Fiber,
      importer: magicImporter(),
      functions: {
        ...DEFAULT_FUNCTIONS,
        ...sassOptions.functions
      }
    });

    compiler
      .then(({css}) => {
        // add code to stream as vinyl file
        stream.push(new Vinyl({
          path: filename,
          contents: Buffer.from(css)
        }));

        // add null that indicates write completion
        stream.push(null);
      })
      .catch((error) => {
        errorHandler(error);
        stream.emit('end');
      });

    return stream
      .pipe(postcss(getProcesses(opts)))
      .pipe(header(opts.banner, {pkg}))
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
