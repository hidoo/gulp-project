import gulp from 'gulp';
import plumber from 'gulp-plumber';
import cond from 'gulp-if';
import sort from 'gulp-sort';
import hbs from 'gulp-hb';
import data from 'gulp-data';
import htmlmin from 'gulp-htmlmin';
import rename from 'gulp-rename';
import cloneDeep from 'lodash.clonedeep';
import Handlebars from 'handlebars';
import layouts from 'handlebars-layouts';
import { glob } from 'glob';
import * as helpers from '@hidoo/handlebars-helpers';
import errorHandler from '@hidoo/gulp-util-error-handler';
import { fromFilesSync, fromFrontMatter } from '@hidoo/data-from';
import pathDepth from './pathDepth.js';

/**
 * task name.
 *
 * @type {String}
 */
const TASK_NAME = 'gulp-task-build-html-handlebars';

/**
 * get context data from files
 *
 * @param {String} pattern glob pattern
 * @param {Object} options options
 * @param {HandlebarsEnvironment} options.handlebars Handlebars instance
 * @param {Function} options.onParsed process after files parsed
 * @param {Boolean} options.verbose out log or not
 * @return {Object}
 */
function getContextFromFiles(pattern, options = {}) {
  if (typeof pattern !== 'string' || pattern === '') {
    return {};
  }

  const { handlebars, onParsed, verbose } = options;
  let context = {};

  try {
    context = fromFilesSync(pattern, { handlebars });

    if (typeof onParsed === 'function') {
      return onParsed(context);
    }
    return context;
  } catch (error) {
    if (verbose) {
      errorHandler({ plugin: TASK_NAME, ...error });
    }
    return context;
  }
}

/**
 * get context data from front matter
 * + add path information of files included in Vinyl
 *
 * @param {Vinyl} file Vinyl file
 * @param {Object} options options
 * @param {Object} options.context additional data
 * @param {HandlebarsEnvironment} options.handlebars Handlebars instance
 * @param {Function} options.onParsed process after front matter parsed
 * @return {Object}
 */
function getContextFromFrontMatter(file, options = {}) {
  const { contents, relative, basename, extname } = file,
    { context, handlebars, onParsed } = options,
    { body, attributes } = fromFrontMatter(contents.toString(), {
      context,
      handlebars
    }),
    path = {
      depth: pathDepth(relative),
      relative,
      basename,
      extname
    };

  if (typeof onParsed === 'function') {
    const processedAttributes = onParsed(attributes);

    return { body, attributes: { ...processedAttributes, path } };
  }
  return { body, attributes: { ...attributes, path } };
}

/**
 * sort vinyl stream by filename
 * + it sort to be end of sorting, if filename is like "page-list".
 *
 * @param {Object} options options
 * @param {String} options.extname extname
 * @return {Number}
 */
function sortByFilename(options = {}) {
  const extname = options.extname || '.html',
    pattern = new RegExp(`page-?list${extname}$`);

  // eslint-disable-next-line id-length
  return (a, b) => {
    const aIsMatch = pattern.test(a.path),
      bIsMatch = pattern.test(b.path);

    if (aIsMatch && !bIsMatch) {
      return 1; // eslint-disable-line no-magic-numbers
    } else if (!aIsMatch && bIsMatch) {
      return -1; // eslint-disable-line no-magic-numbers
    }
    return a.path.localeCompare(b.path);
  };
}

/**
 * task default options.
 *
 * @type {Object}
 */
const DEFAULT_OPTIONS = {
  name: 'build:html',
  src: null,
  dest: null,
  extname: '.html',
  partials: '',
  layouts: '',
  helpers: '',
  data: '',
  compress: false,
  compressOptions: {
    caseSensitive: true,
    collapseWhitespace: true,
    conservativeCollapse: true,
    preserveLineBreaks: true,
    ignoreCustomFragments: [
      // php start end tags
      /<\?[\s\S]*?\?>/,
      // cms tags
      /<\/?mt:?[\s\S]*?>/i,
      /<\$mt:?[\s\S]*?\$>/i
    ]
  },
  onFilesParsed(context) {
    return context;
  },
  onFrontMatterParsed(context) {
    return context;
  },
  verbose: false
};

/**
 * return html build task by handlebars
 *
 * @param  {Object} options - options
 * @param  {String} [options.name='build:html'] - task name (use as displayName)
 * @param  {String} options.src - source path
 * @param  {String} options.dest - destination path
 * @param  {String} [options.extname='.html'] - destination extname
 * @param  {String} [options.partials=''] - Handlebars partials files glob pattern
 * @param  {String} [options.layouts=''] - Handlebars layouts files glob pattern
 * @param  {String} [options.helpers=''] - Handlebars helpers files glob pattern
 * @param  {String} [options.data=''] - data files glob pattern
 * @param  {Boolean|Object} [options.compress=false] - compress file whether or not
 * @param {Array<Function>} options.compress.htmlmin - htmlmin settings
 *   see: {@link https://www.npmjs.com/package/gulp-htmlmin gulp-htmlmin options}.
 * @param  {Function<Object>} [options.onFilesParsed=(context) => context] - additional process after data files parsed
 * @param  {Function<Object>} [options.onFrontMatterParsed=(context) => context] - additional process after front matter parsed
 * @param  {Boolean} [options.verbose=false] - out log or not
 * @return {Function<Promise>}
 *
 * @example
 * import {task} from 'gulp';
 * import buildHtml from '@hidoo/gulp-task-build-html-handlebars';
 *
 * task('html', buildHtml({
 *   name: 'html:main',
 *   src: '/path/to/html/*.hbs',
 *   dest: '/path/to/dest',
 *   extname: '.php',
 *   partials: '/path/to/html/partials/*.hbs',
 *   layouts: '/path/to/html/layouts/*.hbs',
 *   helpers: '/path/to/html/helpers/*.js',
 *   data: '/path/to/html/data/*.{json,yaml}',
 *   compress: {
 *     htmlmin: {
 *       caseSensitive: true,
 *       collapseWhitespace: true,
 *       conservativeCollapse: true,
 *       preserveLineBreaks: true,
 *       ignoreCustomFragments: [
 *         // php start end tags
 *         /<\?[\s\S]*?\?>/,
 *         // cms tags
 *         /<\/?mt:?[\s\S]*?>/i,
 *         /<\$mt:?[\s\S]*?\$>/i
 *       ]
 *     }
 *   },
 *   onFilesParsed: (context) => context,
 *   onFrontMatterParsed: (context) => context,
 *   verbose: false
 * }));
 */
export default function buildHtml(options = {}) {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  // define task
  const task = () => {
    const { extname, onFilesParsed, onFrontMatterParsed, verbose } = opts;
    const handlebars = Handlebars.create();
    const context = getContextFromFiles(opts.data, {
      onParsed: onFilesParsed,
      handlebars,
      verbose
    });
    const pages = [];
    const enableCompress = Boolean(opts.compress);
    const compressOpts = {
      htmlmin: {
        caseSensitive: true,
        collapseWhitespace: true,
        conservativeCollapse: true,
        preserveLineBreaks: true,
        ignoreCustomFragments: [
          // php start end tags
          /<\?[\s\S]*?\?>/,
          // cms tags
          /<\/?mt:?[\s\S]*?>/i,
          /<\$mt:?[\s\S]*?\$>/i
        ]
      },
      ...(opts.compress && typeof opts.compress === 'object'
        ? opts.compress
        : {}),
      verbose
    };

    // add default helpers from @hidoo/handlebars-helpers
    Object.entries(helpers).forEach(([name, helper]) =>
      handlebars.registerHelper(name, helper)
    );

    return gulp
      .src(opts.src)
      .pipe(plumber({ errorHandler }))
      .pipe(rename({ extname }))
      .pipe(sort(sortByFilename({ extname })))
      .pipe(
        data((file) => {
          const { body, attributes } = getContextFromFrontMatter(file, {
            context,
            handlebars,
            onParsed: onFrontMatterParsed
          });

          file.contents = Buffer.from(body);
          pages.push(attributes);
          return cloneDeep(attributes);
        })
      )
      .pipe(
        data(
          // add helpers from options.helpers
          () =>
            glob(opts.helpers, { ignore: 'node_modules/**' })
              .then((filenames) =>
                Promise.all(filenames.map((filename) => import(filename)))
              )
              .then((modules) =>
                modules.forEach(({ register }) => register(handlebars))
              )
        )
      )
      .pipe(
        hbs({ handlebars })
          .helpers(layouts)
          .partials(opts.layouts)
          .partials(opts.partials)
          .data({
            ...context,
            NODE_ENV: process.env.NODE_ENV || 'development', // eslint-disable-line node/no-process-env
            enableCompress,
            pages
          })
      )
      .pipe(gulp.dest(opts.dest))
      .pipe(cond(enableCompress, htmlmin(compressOpts.htmlmin)))
      .pipe(cond(enableCompress, gulp.dest(opts.dest)));
  };

  // add displayName (used as task name for gulp)
  if (typeof opts.name === 'string' && opts.name !== '') {
    task.displayName = opts.name;
  }

  return task;
}
