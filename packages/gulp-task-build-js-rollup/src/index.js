import gulp from 'gulp';
import cond from 'gulp-if';
import gzip from 'gulp-gzip';
import rename from 'gulp-rename';
import terser from 'gulp-terser';
import { rollup } from 'rollup';
import through from 'through2';
import Vinyl from 'vinyl';
import errorHandler from '@hidoo/gulp-util-error-handler';
import inputOptions from './inputOptions.js';
import outputOptions, { defaultOutputOptions } from './outputOptions.js';

/**
 * default options
 *
 * @type {Object}
 */
const DEFAULT_OPTIONS = {
  name: 'build:js',
  src: null,
  dest: null,
  filename: 'main.js',
  suffix: '.min',
  inputOptions: {},
  outputOptions: defaultOutputOptions,
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
 * @param {Object} [options.inputOptions] - input options for rollup.js.
 *   see: {@link ./src/inputOptions.js Merged with this function}.
 *   see: {@link https://rollupjs.org/javascript-api/#inputoptions-object inputOptions in JavaScript API of rollup.js}
 * @param {Array<Object>|Object} [options.outputOptions] - output options for rollup.js.
 *   see: {@link ./src/outputOptions.js Merged with this function}.
 *   see: {@link https://rollupjs.org/javascript-api/#outputoptions-object outputOptions in JavaScript API of rollup.js}
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
 *   suffix: '.compressed',
 *   targets: ['> 0.1% in JP'],
 *   inputOptions: {},
 *   outputOptions: [
 *     {
 *       format: 'es',
 *       file: 'main.es.js'
 *     },
 *     {
 *       format: 'system',
 *       file: 'main.system.js'
 *     }
 *   ],
 *   compress: true,
 *   verbose: true
 * }));
 */
export default function buildJs(options = {}) {
  const opts = {
    ...DEFAULT_OPTIONS,
    ...options
  };

  // define task
  const task = () => {
    const { suffix, compress } = opts;
    const stream = through.obj();
    const filenames = Array.isArray(opts.filename)
      ? [...opts.filename]
      : [opts.filename];

    (async () => {
      try {
        const bundle = await rollup(inputOptions(opts));
        const outputs = await Promise.all(
          outputOptions(opts).map((op) => bundle.generate(op))
        );

        for (const { output } of outputs) {
          for (const chunkOrAsset of output) {
            if (
              chunkOrAsset.type === 'asset' &&
              typeof chunkOrAsset.source !== 'undefined'
            ) {
              stream.push(
                new Vinyl({
                  path: chunkOrAsset.fileName,
                  contents: Buffer.from(chunkOrAsset.source),
                  isAsset: true
                })
              );
            } else {
              const { isEntry } = chunkOrAsset;
              const filename = isEntry ? filenames.shift() : null;

              // add code and sourcemap to stream as vinyl file
              stream.push(
                new Vinyl({
                  path: filename || chunkOrAsset.fileName,
                  contents: Buffer.from(chunkOrAsset.code),
                  isEntry
                })
              );
            }
          }
        }

        // add null that indicates write completion
        stream.push(null);
      } catch (error) {
        errorHandler(error);
        stream.emit('end');
      }
    })();

    return stream
      .pipe(gulp.dest(opts.dest))
      .pipe(cond((file) => file.isEntry && compress, rename({ suffix })))
      .pipe(cond(compress, terser({ format: { comments: 'some' } })))
      .pipe(cond(compress, gulp.dest(opts.dest)))
      .pipe(cond(compress, gzip({ append: true })))
      .pipe(cond(compress, gulp.dest(opts.dest)));
  };

  // add displayName (used as task name for gulp)
  if (typeof opts.name === 'string' && opts.name !== '') {
    task.displayName = opts.name;
  }

  return task;
}
