/* eslint no-magic-numbers: off */

import path from 'node:path';
import imageminWebp from 'imagemin-webp';
import through from 'through2';
import Vinyl from 'vinyl';
import PluginError from 'plugin-error';
import log from 'fancy-log';

/**
 * plugin name.
 *
 * @type {String}
 */
const PLUGIN_NAME = 'gulp-plugin-webp';

/**
 * plugin default options.
 *
 * @type {Object}
 */
const DEFAULT_OPTIONS = {
  // override imagemin-webp defaults
  method: 6,

  // this plugin options
  append: true,
  keepExtname: true,
  verbose: false
};

/**
 * return webp.
 *
 * @param {Object} options option
 * @param {Boolean} [options.append=true] append webp or not
 * @param {Boolean} [options.keepExtname=true] keep extname or not
 * @param {Boolean} [options.verbose=false] out log or not
 * @return {DestroyableTransform}
 *
 * @example
 * import {src, dest, task} from 'gulp';
 * import webp from '@hidoo/gulp-plugin-webp';
 *
 * task('webp', () => src('/path/to/src')
 *   .pipe(webp({
 *     // this plugin options
 *     append: false,
 *     keepExtname: false,
 *     verbose: true,
 *
 *     // specify imagemin-webp options
 *     quality: 100
 *   }))
 *   .pipe(dest('/path/to/dest')));
 */
export default function webp(options = {}) {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  return through.obj(function transform(file, enc, done) {
    if (file.isStream()) {
      throw new PluginError(PLUGIN_NAME, 'Stream is not support.');
    }
    if (file.isNull()) {
      return done(null, file);
    }
    if (!file.isBuffer()) {
      return done(null, file);
    }

    const stream = this; // eslint-disable-line no-invalid-this, consistent-this
    const { dirname, extname, contents } = file;
    const basename = path.basename(file.path, extname);
    const instance = imageminWebp(opts);

    return instance(contents)
      .then((buffer) => {
        const filename = opts.keepExtname
          ? `${basename}${extname}.webp`
          : `${basename}.webp`;
        const dest = path.resolve(dirname, filename);

        // prepend original image before webp.
        if (opts.append) {
          stream.push(file);

          if (opts.verbose) {
            log(`${PLUGIN_NAME}: append "${dest}".`);
          }
        }

        stream.push(
          new Vinyl({
            cwd: file.cwd,
            base: file.base,
            path: dest,
            contents: buffer
          })
        );

        return done();
      })
      .catch((error) => done(new PluginError(PLUGIN_NAME, error)));
  });
}
