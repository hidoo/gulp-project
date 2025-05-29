import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import gulp from 'gulp';
import plumber from 'gulp-plumber';
import cond from 'gulp-if';
import through from 'through2';
import PluginError from 'plugin-error';
import * as sass from 'sass-embedded';
import postcss from 'gulp-postcss';
import cssnano from 'cssnano';
import header from 'gulp-header';
import rename from 'gulp-rename';
import compress from '@hidoo/gulp-plugin-compress';
import errorHandler from '@hidoo/gulp-util-error-handler';
import configure, { autoprefixer, cssmqpacker } from './plugins.js';
import functions from './functions.js';
import * as importers from './importers.js';
import log from './log.js';

/**
 * Try to load package.json that on current working directory.
 *
 * @param {Boolean} verbose out debug log or not
 * @return {Object}
 */
function loadPackageJson(verbose = false) {
  const filename = path.resolve(process.cwd(), 'package.json');
  let pkg = {};

  try {
    pkg = JSON.parse(fs.readFileSync(filename));
  } catch (error) {
    if (verbose) {
      log.error(`Failed to load package '${filename}':`, error);
    }
  }

  return pkg;
}

/**
 * postcss plugins
 *
 * @type {Function}
 *
 * @example
 * import { autoprefixer, cssmqpacker, cssnano } from '@hidoo/gulp-task-build-css-sass';
 */
export { autoprefixer, cssmqpacker, cssnano };

/**
 * Default options.
 *
 * @type {Object}
 */
export const defaultOptions = {
  name: 'build:css',
  src: null,
  dest: null,
  filename: 'main.css',
  suffix: '.min',
  banner: '',
  sassOptions: {
    outputStyle: 'expanded'
  },
  postcssPlugins: null,
  compress: false,
  verbose: false
};

/**
 * Default options for cssnano.
 *
 * @type {Object}
 */
const defaultCssnanoOptions = {
  preset: [
    'default',
    {
      cssDeclarationSorter: false,
      mergeRules: false,
      normalizeCharset: false
    }
  ]
};

/**
 * Return css build task by sass
 *
 * @param {Object} options - options
 * @param {String} [options.name='build:css'] - task name (use as displayName)
 * @param {String} options.src - source path
 * @param {String} options.dest - destination path
 * @param {String} [options.filename='main.css'] - destination filename
 * @param {String} [options.suffix='.min'] - suffix when compressed
 * @param {Array<String>} options.targets - target browsers.
 * @param {Array<String>} options.browsers - alias of options.targets.
 * @param {String} [options.banner=''] - license comments
 * @param {import('sass').Options} [options.sassOptions={outputStyle: 'expanded'}] - sass options.
 * @param {Object} [options.postcssPlugins=[]] - list of PostCSS plugin.
 * @param {Boolean|import('@hidoo/gulp-plugin-compress').defaultOptions} [options.compress=false] - compress file whether or not
 * @param {Boolean} [options.verbose=false] - out debug log or not
 * @return {Function<Transform>}
 *
 * @example
 * import {task} from 'gulp';
 * import buildCss, { autoprefixer } from '@hidoo/gulp-task-build-css-sass';
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
 *   postcssPlugins: [
 *     autoprefixer(),
 *     (root) => root
 *   ],
 *   compress: true
 * }));
 */
export default function buildCss(options = {}) {
  const opts = {
    ...defaultOptions,
    ...options
  };

  // define task
  const task = () => {
    const { suffix, verbose } = opts;
    const pkg = loadPackageJson(verbose);
    const pkgName = pkg.name || 'gulp-task-build-css-sass';
    const extname = path.extname(opts.filename || opts.src);
    const basename = path.basename(opts.filename || opts.src, extname);
    const { sourceMap: sourcemaps, ...sassOptions } = {
      functions: {},
      importers: [],
      sourceMap: false,
      sourceMapIncludeSources: true,
      verbose,
      ...opts.sassOptions
    };
    const enableCompress = Boolean(opts.compress);
    const compressOpts = {
      ...(opts.compress && typeof opts.compress === 'object'
        ? opts.compress
        : {}),
      verbose
    };
    const cssnanoOptions =
      compressOpts.cssnano && typeof compressOpts.cssnano === 'object'
        ? compressOpts.cssnano
        : defaultCssnanoOptions;

    const compile = through.obj(async function transform(file, enc, done) {
      if (file.isStream()) {
        throw new PluginError(pkgName, 'Stream is not support.');
      }
      if (file.isNull()) {
        return done(null, file);
      }
      if (!file.isBuffer()) {
        return done(null, file);
      }

      try {
        const result = await sass.compileStringAsync(file.contents.toString(), {
          ...sassOptions,
          url: pathToFileURL(file.path),
          sourceMap: Boolean(sourcemaps),
          importers: [
            new sass.NodePackageImporter(),
            importers.createFileImporter(),
            importers.compatMagicImporter({
              ...sassOptions,
              includePaths: file.dirname
            }),
            ...sassOptions.importers
          ],
          functions: {
            ...functions,
            ...sassOptions.functions
          }
        });

        file.contents = Buffer.from(result.css);

        if (sourcemaps && result.sourceMap) {
          file.sourceMap = {
            ...result.sourceMap,
            sources: result.sourceMap.sources.map((source) =>
              path.relative(file.relative, new URL(source).pathname)
            ),
            file: file.relative
          };
        }

        // eslint-disable-next-line no-invalid-this
        this.push(file);
        return done();
      } catch (error) {
        return done(new PluginError(pkgName, error));
      }
    });

    return gulp
      .src(opts.src, { sourcemaps: Boolean(sourcemaps) })
      .pipe(plumber({ errorHandler }))
      .pipe(compile)
      .pipe(rename({ basename, extname }))
      .pipe(postcss(configure(opts)))
      .pipe(header(opts.banner, { pkg }))
      .pipe(gulp.dest(opts.dest, { sourcemaps }))
      .pipe(cond(enableCompress, postcss([cssnano(cssnanoOptions)])))
      .pipe(header(opts.banner, { pkg }))
      .pipe(cond(enableCompress, rename({ suffix })))
      .pipe(cond(enableCompress, compress(compressOpts)))
      .pipe(cond(enableCompress, gulp.dest(opts.dest, { sourcemaps })));
  };

  // add displayName (used as task name for gulp)
  if (typeof opts.name === 'string' && opts.name !== '') {
    task.displayName = opts.name;
  }

  return task;
}
