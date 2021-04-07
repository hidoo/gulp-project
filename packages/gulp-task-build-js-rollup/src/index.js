import path from 'path';
import {dest} from 'gulp';
import cond from 'gulp-if';
import gzip from 'gulp-gzip';
import rename from 'gulp-rename';
import terser from 'gulp-terser';
import {rollup} from 'rollup';
import through from 'through2';
import Vinyl from 'vinyl';
import errorHandler from '@hidoo/gulp-util-error-handler';
import inputOptions from './inputOptions';
import outputOptions from './outputOptions';
import concatSourceMap from './concatSourceMap';

/**
 * task default options.
 *
 * @type {Object}
 */
const DEFAULT_OPTIONS = {
  name: 'build:js',
  src: null,
  dest: null,
  filename: 'main.js',
  suffix: '.min',
  targets: ['> 0.5% in JP', 'ie >= 10', 'android >= 4.4'],
  useBuiltIns: 'usage',
  corejs: 3,
  babelrc: path.resolve(process.cwd(), '.babelrc.js'),
  inputOptions: {},
  outputOptions: {},
  aliasOptions: {},
  nodeResolveOptions: {},
  jsonOptions: {},
  commonjsOptions: {},
  compress: false,
  verbose: false
};

/**
 * return javascript build task by rollup.js
 *
 * @param {Object} options - options
 * @param {String} [options.name='build:js'] - task name (use as displayName)
 * @param {Array<String>|String} options.src - source path
 * @param {String} options.dest - destination path
 * @param {Array<String>|String} [options.filename='main.js'] - destination filename
 * @param {String} [options.suffix='.min'] - suffix when compressed
 * @param {Array<String>} [options.targets] - target browsers.
 *   see: {@link http://browserl.ist/?q=%3E+0.5%25+in+JP%2C+ie%3E%3D+10%2C+android+%3E%3D+4.4 default target browsers}
 * @param {Array<String>} [options.browsers] - alias of options.targets.
 * @param {String|Boolean} [options.useBuiltIns='usage'] - use polyfill or not.
 *   see: {@link https://babeljs.io/docs/en/babel-preset-env#usebuiltins useBuiltIns in @babel/preset-env}
 * @param {Number|String|Object} [options.corejs=3] - specify core-js version
 *   see: {@link https://github.com/zloirock/core-js#babelpreset-env corejs in @babel/preset-env}
 * @param {String} [options.babelrc=path.resolve(process.cwd(), '.babelrc.js')] - babelrc path.
 *   see: {@link ./src/babelOptions.js Merged with this function}
 * @param {Object} [options.inputOptions] - input options for rollup.js.
 *   see: {@link ./src/inputOptions.js Merged with this function}.
 *   see: {@link https://rollupjs.org/guide/en#inputoptions inputOptions in JavaScript API of rollup.js}
 * @param {Object} [options.outputOptions] - output options for rollup.js.
 *   see: {@link ./src/outputOptions.js Merged with this function}.
 *   see: {@link https://rollupjs.org/guide/en#outputoptions outputOptions in JavaScript API of rollup.js}
 * @param {Object} [options.aliasOptions] - options for @rollup/plugin-alias.
 *   see: {@link ./src/aliasOptions.js Merged with this function}.
 *   see: {@link https://github.com/rollup/plugins/tree/master/packages/alias @rollup/plugin-alias}
 * @param {Object} [options.nodeResolveOptions] - options for @rollup/plugin-node-resolve.
 *   see: {@link ./src/nodeResolveOptions.js Merged with this function}.
 *   see: {@link https://github.com/rollup/plugins/tree/master/packages/node-resolve @rollup/plugin-node-resolve}
 * @param {Object} [options.jsonOptions] - options for @rollup/plugin-json.
 *   see: {@link ./src/jsonOptions.js Merged with this function}.
 *   see: {@link https://github.com/rollup/plugins/tree/master/packages/json @rollup/plugin-json}
 * @param {Object} [options.commonjsOptions] - options for @rollup/plugin-commonjs.
 *   see: {@link ./src/commonjsOptions.js Merged with this function}.
 *   see: {@link https://github.com/rollup/plugins/tree/master/packages/commonjs @rollup/plugin-commonjs}
 * @param {Boolean} [options.compress=false] - compress file or not
 * @param {Boolean} [options.verbose=false] - out log or not
 * @return {Function<Stream>}
 *
 * @example
 * import {task} from 'gulp';
 * import buildJs from '@hidoo/gulp-task-build-js-rollup';
 *
 * task('js', buildJs({
 *   name: 'js:main',
 *   src: '/path/to/js/main.js',
 *   dest: '/path/to/dest',
 *   filename: 'main.js',
 *   suffix: '.hoge',
 *   targets: ['> 0.1% in JP'],
 *   useBuiltIns: false,
 *   corejs: 2,
 *   babelrc: '/path/to/.babelrc.js',
 *   inputOptions: {},
 *   outputOptions: {},
 *   aliasOptions: {},
 *   nodeResolveOptions: {},
 *   jsonOptions: {},
 *   commonjsOptions: {},
 *   compress: true,
 *   verbose: true
 * }));
 */
export default function buildJs(options = {}) {
  const opts = {...DEFAULT_OPTIONS, ...options};

  // define task
  const task = () => {
    const {suffix, compress} = opts;
    const stream = through.obj();
    const filenames = Array.isArray(opts.filename) ?
      [...opts.filename] : [opts.filename];
    const inputOpts = inputOptions(opts);

    rollup(inputOpts)
      .then((bundle) => {
        const outputOpts = outputOptions(opts);

        return bundle.generate(outputOpts);
      })
      .then(({output}) => {
        for (const chunkOrAsset of output) {
          if (chunkOrAsset.type === 'asset') {
            throw new Error('"asset" is not support.');
          }

          const {code, map, fileName, isEntry} = chunkOrAsset;
          const filename = isEntry ? filenames.shift() : null;

          // add code and sourcemap to stream as vinyl file
          stream.push(new Vinyl({
            path: filename || fileName,
            contents: Buffer.from(concatSourceMap({code, map})),
            isEntry
          }));
        }

        // add null that indicates write completion
        stream.push(null);
      })
      .catch((error) => {
        errorHandler(error);
        stream.emit('end');
      });

    return stream
      .pipe(dest(opts.dest))
      .pipe(cond((file) => file.isEntry && compress, rename({suffix})))
      .pipe(cond(compress, terser({format: {comments: 'some'}})))
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
