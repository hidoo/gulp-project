/* eslint no-magic-numbers: off */

import path from 'node:path';
import through from 'through2';
import Vinyl from 'vinyl';
import PluginError from 'plugin-error';
import getStream from 'get-stream';
import ndarray from 'ndarray';
import savePixels from 'save-pixels';
import sizeOf from 'image-size';
import log from 'fancy-log';

/**
 * plugin name.
 *
 * @type {String}
 */
const PLUGIN_NAME = 'gulp-plugin-image-placeholder';

/**
 * plugin default options.
 *
 * @type {Object}
 */
const DEFAULT_OPTIONS = {
  append: true,
  suffix: 'placeholder',
  verbose: false
};

/**
 * return placeholder image.
 *
 * @param {Object} options option
 * @param {Boolean} [options.append=true] append placeholder or not
 * @param {String} [options.suffix='placeholder'] placeholder image suffix
 * @param {Boolean} [options.verbose=false] out log or not
 * @return {DestroyableTransform}
 *
 * @example
 * import {src, dest, task} from 'gulp';
 * import imagePlaceholder from '@hidoo/gulp-plugin-image-placeholder';
 *
 * task('placeholder', () => src('/path/to/src')
 *   .pipe(imagePlaceholder({
 *     append: false,
 *     suffix: 'placehold',
 *     verbose: true
 *   }))
 *   .pipe(dest('/path/to/dest')));
 */
export default function imagePlaceholder(options = {}) {
  const opts = {...DEFAULT_OPTIONS, ...options};

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

    const stream = this, // eslint-disable-line no-invalid-this, consistent-this
          {dirname, contents} = file,
          basename = path.basename(file.path, file.extname),
          {width, height} = sizeOf(contents),
          saveOptions = {},
          fillPixel = [0, 0, 0, 0],
          channels = 4;

    // set params (example when image size is 12x10)
    // + shape -> [12, 10, 4]
    // + stride -> [4, 48, 1]
    const sizeInRow = width * channels,
          shape = [width, height, channels],
          stride = [channels, sizeInRow, 1];

    // transform array to ndarray
    const data = Array(width * height).fill(fillPixel),
          pixels = ndarray(Uint8ClampedArray.from(data), shape, stride);

    return getStream.buffer(savePixels(pixels, 'png', saveOptions))
      .then((buffer) => {
        const suffix = opts.suffix ? `.${opts.suffix}` : '',
              placeholder = new Vinyl({
                cwd: file.cwd,
                base: file.base,
                path: `${dirname}/${basename}${suffix}.png`,
                contents: buffer
              });

        // append placeholder image after original image.
        if (opts.append) {
          if (opts.verbose) {
            log(`${PLUGIN_NAME}: append ${basename}${suffix}.png.`);
          }

          stream.push(file);
          stream.push(placeholder);
        }
        // push placeholder image only.
        else {
          stream.push(placeholder);
        }

        return done();
      })
      .catch((error) => done(new PluginError(PLUGIN_NAME, error)));
  });
}
