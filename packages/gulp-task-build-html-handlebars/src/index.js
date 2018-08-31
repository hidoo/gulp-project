import {src, dest} from 'gulp';
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
import * as helpers from '@hidoo/handlebars-helpers';
import errorHandler from '@hidoo/gulp-util-error-handler';
import {fromFiles, fromFrontMatter} from '@hidoo/data-from';
import pathDepth from './pathDepth';

/**
 * task default options.
 * @type {Object}
 */
const DEFAULT_OPTIONS = {

  // task name (set displayName)
  name: 'build:html',

  // source path (required)
  src: null,

  // destination path (required)
  dest: null,

  // destination extname
  extname: '.html',

  // Handlebars partials files glob pattern
  partials: '',

  // Handlebars layouts files glob pattern
  layouts: '',

  // Handlebars helpers files glob pattern
  helpers: '',

  // data files glob pattern
  data: '',

  // compress file or not
  compress: false,

  // compress options (using htmlmin)
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

  /**
   * additional process after data files parsed
   * @param {Object} context data
   * @return {Object}
   */
  onFilesParsed(context) {
    return context;
  },

  /**
   * additional process after front matter parsed
   * @param {Object} context data
   * @return {Object}
   */
  onFrontMatterParsed(context) {
    return context;
  },

  // out log or not
  verbose: false
};

/**
 * task name.
 * @type {String}
 */
const TASK_NAME = 'gulp-task-build-html-handlebars';

/**
 * get context data from files
 * @param {String} pattern glob pattern
 * @param {Object} options options
 * @param {HandlebarsEnvironment} options.handlebars Handlrbars instance
 * @param {Function} options.onParsed process after files parsed
 * @param {Boolean} options.verbose out log or not
 * @return {Object}
 */
function getContextFromFiles(pattern, options = {}) {
  if (typeof pattern !== 'string' || pattern === '') {
    return {};
  }

  const {handlebars, onParsed, verbose} = options;
  let context = {};

  try {
    context = fromFiles(pattern, {handlebars});

    if (typeof onParsed === 'function') {
      return onParsed(context);
    }
    return context;
  }
  catch (error) {
    if (verbose) {
      errorHandler({plugin: TASK_NAME, ...error});
    }
    return context;
  }
}

/**
 * get context data from front matter
 * + add path information of files included in Vinyl
 * @param {Vinyl} file Vinyl file
 * @param {Object} options options
 * @param {Object} options.context additinal data
 * @param {HandlebarsEnvironment} options.handlebars Handlrbars instance
 * @param {Function} options.onParsed process after front matter parsed
 * @return {Object}
 */
function getContextFromFrontMatter(file, options = {}) {
  const {contents, relative, basename, extname} = file,
        {context, handlebars, onParsed} = options,
        {body, attributes} = fromFrontMatter(contents.toString(), {context, handlebars}),
        path = {
          depth: pathDepth(relative),
          relative,
          basename,
          extname
        };

  if (typeof onParsed === 'function') {
    const processedAttributes = onParsed(attributes);

    return {body, attributes: {...processedAttributes, path}};
  }
  return {body, attributes: {...attributes, path}};
}

/**
 * sort vinyl stream by filename
 * + it sort to be end of sorting, if filename is like "pagelist".
 * @param {Object} options options
 * @param {String} options.extname extname
 * @return {Number}
 */
function sortByFilename(options = {}) {
  const extname = options.extname || '.html',
        pattern = new RegExp(`page-?list${extname}$`);

  return (a, b) => {
    const aIsMatch = pattern.test(a.path),
          bIsMatch = pattern.test(b.path);

    if (aIsMatch && !bIsMatch) {
      return 1; // eslint-disable-line no-magic-numbers
    }
    else if (!aIsMatch && bIsMatch) {
      return -1; // eslint-disable-line no-magic-numbers
    }
    return a.path.localeCompare(b.path);
  };
}

/**
 * return html build task by handlebars
 * @param  {DEFAULT_OPTIONS} options options
 * @return {Function<Promise>}
 *
 * @example
 * import {task} from 'gulp';
 * import buildHtml from '@hidoo/gulp-task-build-html-handlebars';
 *
 * task('html', buildHtml({
 *   src: '/path/to/html/*.hbs',
 *   dest: '/path/to/dest'
 * }));
 */
export default function buildHtml(options = {}) {
  const opts = {...DEFAULT_OPTIONS, ...options};

  // define task
  const task = () => {
    const {extname, compress, compressOptions, onFilesParsed, onFrontMatterParsed, verbose} = opts, // eslint-disable-line max-len
          handlebars = Handlebars.create(),
          context = getContextFromFiles(opts.data, {onParsed: onFilesParsed, handlebars, verbose}), // eslint-disable-line max-len
          pages = [],
          addtionalContext = {
            NODE_ENV: process.env.NODE_ENV || 'development', // eslint-disable-line no-process-env
            compress,
            pages
          };

    // add default helpers from @hidoo/handlebars-helpers
    Object.entries(helpers).forEach(([name, helper]) =>
      handlebars.registerHelper(name, helper)
    );

    return src(opts.src)
      .pipe(plumber({errorHandler}))
      .pipe(rename({extname}))
      .pipe(sort(sortByFilename({extname})))
      .pipe(data((file) => {
        const {body, attributes} = getContextFromFrontMatter(file, {
          context,
          handlebars,
          onParsed: onFrontMatterParsed
        });

        file.contents = Buffer.from(body);
        pages.push(attributes);
        return cloneDeep(attributes);
      }))
      .pipe(
        hbs({handlebars})
          .helpers(layouts)
          .helpers(opts.helpers)
          .partials(opts.layouts)
          .partials(opts.partials)
          .data(context)
          .data(addtionalContext)
      )
      .pipe(dest(opts.dest))
      .pipe(cond(compress, htmlmin({...compressOptions})))
      .pipe(cond(compress, dest(opts.dest)));
  };

  // add displayName (used as task name for gulp)
  if (typeof opts.name === 'string' && opts.name !== '') {
    task.displayName = opts.name;
  }

  return task;
}
