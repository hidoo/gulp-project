import path from 'path';
import {dest} from 'gulp';
import cond from 'gulp-if';
import gzip from 'gulp-gzip';
import rename from 'gulp-rename';
import uglify from 'gulp-uglify';
import {rollup} from 'rollup';
import through from 'through2';
import source from 'vinyl-source-stream';
import buffer from 'vinyl-buffer';
import errorHandler from '@hidoo/gulp-util-error-handler';
import inputOptions from './inputOptions';
import outputOptions from './outputOptions';
import concatSourceMap from './concatSourceMap';

/**
 * task default options.
 * @type {Object}
 */
const DEFAULT_OPTIONS = {

  // task name (set displayName)
  name: 'build:js',

  // source path (required)
  src: null,

  // destination path (required)
  dest: null,

  // destination filename
  filename: 'main.js',

  // target browsers
  // + http://browserl.ist/?q=%3E+0.5%25+in+JP%2C+ie%3E%3D+10%2C+android+%3E%3D+4.4
  browsers: ['> 0.5% in JP', 'ie >= 10', 'android >= 4.4'],

  // use polyfill or not
  // + see options.useBuiltIns in @babel/preset-env
  useBuiltIns: 'usage',

  // babelrc path
  babelrc: path.resolve(process.cwd(), '.babelrc.js'),

  // input options for rollup.js
  // + see inputOptions in JavaScript API of rollup.js
  // + https://rollupjs.org/guide/en#inputoptions
  inputOptions: {},

  // output options for rollup.js
  // + see outputOptions in JavaScript API of rollup.js
  // + https://rollupjs.org/guide/en#outputoptions
  outputOptions: {},

  // options for rollup-plugin-node-resolve
  // + merge to default options
  nodeResolveOptions: {},

  // options for rollup-plugin-commonjs
  // + merge to default options
  commonjsOptions: {},

  // compress file or not
  compress: false,

  // out log or not
  verbose: false
};

/**
 * return javascript build task by rollup.js
 * @param {DEFAULT_OPTIONS} options options
 * @return {Function}
 *
 * @example
 * import {task} from 'gulp';
 * import buildJs from '@hidoo/gulp-task-build-js-rollup';
 *
 * task('js', buildJs({
 *   src: '/path/to/js/main.js',
 *   dest: '/path/to/dest'
 * }));
 */
export default function buildJs(options = {}) {
  const opts = {...DEFAULT_OPTIONS, ...options};

  // define task
  const task = async () => {
    const {filename, compress} = opts,
          stream = through.obj();

    return rollup(inputOptions(opts))
      .then((bundle) => bundle.generate(outputOptions(opts)))
      .then(({code, map}) => {

        // add code and sourcemap to stream,
        // and add null that indicates write completion
        stream.push(concatSourceMap({code, map}));
        stream.push(null);

        // transform from nodejs stream to vinyl stream,
        // and flush as gulp task
        return stream
          .pipe(source(filename))
          .pipe(buffer())
          .pipe(dest(opts.dest))
          .pipe(cond(compress, rename({suffix: '.min'})))
          .pipe(cond(compress, uglify({output: {comments: 'some'}})))
          .pipe(cond(compress, dest(opts.dest)))
          .pipe(cond(compress, gzip({append: true})))
          .pipe(cond(compress, dest(opts.dest)));
      })
      .catch((error) => {
        errorHandler(error);
        stream.emit('end');
      });
  };

  // add displayName (used as task name for gulp)
  if (typeof opts.name === 'string' && opts.name !== '') {
    task.displayName = opts.name;
  }

  return task;
}
