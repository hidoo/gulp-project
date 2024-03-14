import path from 'node:path';
import util from 'node:util';
import zlib from 'node:zlib';
import chalk from 'chalk';
import log from 'fancy-log';
import PluginError from 'plugin-error';
import through from 'through2';
import Vinyl from 'vinyl';

// tweaks log date color like gulp log
util.inspect.styles.date = 'grey';

/**
 * Get saved file size.
 *
 * @param {Buffer} original buffer of original file
 * @param {Buffer} compressed buffer of compressed file
 * @param {Object} options options
 * @param {Boolean} options.percent calculate percentage or not
 * @return {Number}
 */
function getSavedSize(original, compressed, options = { percent: true }) {
  const savedSize = original.length - compressed.length;

  if (options.percent) {
    /* eslint-disable no-magic-numbers */
    return (
      original.length > 0 ? (savedSize / original.length) * 100 : 0
    ).toFixed(2);
    /* eslint-enable no-magic-numbers */
  }
  return savedSize;
}

/**
 * Plugin name.
 *
 * @type {String}
 */
const PLUGIN_NAME = 'gulp-plugin-compress';

/**
 * Mapping of promisified compressor.
 *
 * @typedef {Object} compressors
 * @property {Function<Promise>} gzip - gzip compressor function
 * @property {Function<Promise>} brotli - brotli compressor function
 *
 * @example
 * import fs from 'node:fs/promises';
 * import { compressors } from '@hidoo/gulp-plugin-compress';
 *
 * const buffer = await fs.readFile('./path/to/file.ext');
 * const compressed = await compressors.gzip(buffer);
 */
export const compressors = {
  gzip: util.promisify(zlib.gzip),
  brotli: util.promisify(zlib.brotliCompress)
};

/**
 * Default options for gzip
 *
 * @typedef {Object} gzipOptions
 * @property {String} extname - extname for gzip compressed file
 * @property {Number} level - compress level for gzip
 */
const gzipOptions = {
  extname: '.gz',
  level: zlib.constants.Z_MAX_LEVEL
};

/**
 * Default options for blotli
 *
 * @typedef {Object} brotliOptions
 * @property {String} extname - extname for blotli compressed file
 * @property {Object} params - compress parameters for blotli
 */
const brotliOptions = {
  extname: '.br',
  params: {
    [zlib.constants.BROTLI_PARAM_QUALITY]: zlib.constants.BROTLI_MAX_QUALITY
  }
};

/**
 * Default options.
 *
 * @type {Object} defaultOptions
 */
export const defaultOptions = {
  gzip: gzipOptions,
  brotli: brotliOptions,
  append: true,
  keepExtname: true,
  targetExtnames: ['.html', '.css', '.js', '.svg', '.txt'],
  verbose: false
};

/**
 * Generate compressed files.
 *
 * @param {defaultOptions} options option
 * @param {Boolean|gzipOptions} [options.gzip=gzipOptions] - gzip compression options
 * @param {Boolean|brotliOptions} [options.brotli=brotliOptions] - brotli compression options
 * @param {Boolean} [options.append=true] - append compressed files before original files whether or not
 * @param {Boolean} [options.keepExtname=true] - keep original extension name whether or not (like: example.html.gz)
 * @param {Boolean} [options.targetExtnames=['.html', '.css', '.js', '.svg', '.txt']] - list of target extension names to compress
 * @param {Boolean} [options.verbose=false] - output log whether or not
 * @return {import('node:stream').Transform}
 *
 * @example
 * import gulp from 'gulp';
 * import compress from '@hidoo/gulp-plugin-compress';
 *
 * export const compressTask = () => gulp.src('/path/to/src')
 *   .pipe(compress({
 *     gzip: true,
 *     brotli: false,
 *     append: false,
 *     keepExtname: false,
 *     targetExtnames: ['.html', '.css', '.js'],
 *     verbose: true
 *   }))
 *   .pipe(gulp.dest('/path/to/dest'));
 */
export default function compress(options = {}) {
  const opts = { ...defaultOptions, ...options };

  return through.obj(async function transform(file, enc, done) {
    try {
      if (file.isStream()) {
        throw new TypeError('Stream is not supported.');
      }
      if (file.isNull() || !file.isBuffer()) {
        return done(null, file);
      }

      // eslint-disable-next-line no-invalid-this, consistent-this
      const stream = this;

      // push original file before archives.
      if (opts.append) {
        stream.push(file);
      }

      await Promise.all(
        Object.entries(compressors).map(async ([name, compressor]) => {
          if (!opts[name]) {
            return;
          }

          const compressOptions =
            typeof opts[name] === 'object' ? opts[name] : defaultOptions[name];

          try {
            const extname = `${opts.keepExtname ? file.extname : ''}${compressOptions.extname}`;
            const dest = path.resolve(file.dirname, `${file.stem}${extname}`);
            const compressed = new Vinyl({
              cwd: file.cwd,
              base: file.base,
              path: dest,
              contents: await compressor(file.contents, compressOptions)
            });

            stream.push(compressed);

            if (opts.verbose) {
              log(
                `${PLUGIN_NAME}:`,
                `${chalk.green('✔︎')} ${compressed.relative}`,
                chalk.gray(
                  `(${getSavedSize(file.contents, compressed.contents)}% saved)`
                )
              );
            }
          } catch (err) {
            log.error(
              `${PLUGIN_NAME}:`,
              `${chalk.red('✘')} ${file.relative} (${name}):`,
              chalk.gray(opts.verbose ? err : err.name)
            );
          }
        })
      );

      return done(null);
    } catch (error) {
      return done(
        new PluginError(PLUGIN_NAME, error, { showStack: opts.verbose })
      );
    }
  });
}
