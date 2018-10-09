import through from 'through2';
import PluginError from 'plugin-error';
import chunk from 'lodash.chunk';
import flattenDeep from 'lodash.flattendeep';
import getStream from 'get-stream';
import ndarray from 'ndarray';
import getPixels from 'get-pixels';
import savePixels from 'save-pixels';
import fileType from 'file-type';
import log from 'fancy-log';

/**
 * check number is odd or not
 * @param {Number} value number
 * @return {Boolean}
 */
function isOdd(value = 0) { // eslint-disable-line no-magic-numbers
  return value % 2 === 1; // eslint-disable-line no-magic-numbers
}

/**
 * plugin default options.
 * @type {Object}
 */
const DEFAULT_OPTIONS = {

  // out log or not
  verbose: false
};

/**
 * plugin name.
 * @type {String}
 */
const PLUGIN_NAME = 'gulp-plugin-image-evenizer';

/**
 * return evenized image if image width or height is odd number.
 * @param {DEFAULT_OPTIONS} options option
 * @return {DestroyableTransform}
 *
 * @example
 * import {src, dest, task} from 'gulp';
 * import imageEvenizer from '@hidoo/gulp-plugin-image-evenizer';
 *
 * task('evenize', () => src('/path/to/src')
 *   .pipe(imageEvenizer())
 *   .pipe(dest('/path/to/dest'))):
 */
export default function imageEvenizer(options = {}) {
  const opts = {...DEFAULT_OPTIONS, ...options};

  return through.obj((file, enc, done) => {
    if (file.isStream()) {
      throw new PluginError(PLUGIN_NAME, 'Stream is not support.');
    }
    if (file.isNull()) {
      return done(null, file);
    }
    if (!file.isBuffer()) {
      return done(null, file);
    }

    const {ext, mime} = fileType(file.contents),
          fillPixel = (/^jpe?g$/i).test(ext) ? [255, 255, 255, 255] : [255, 255, 255, 0], // eslint-disable-line no-magic-numbers
          dimension = 4;

    const promise = new Promise((resolve, reject) => {
      getPixels(file.contents, mime, (error, pixels) => {
        if (error) {
          return reject(error);
        }
        return resolve(pixels);
      });
    });

    return promise
      .then((pixels) => {
        const hasFrames = pixels.shape.length === 4, // eslint-disable-line no-magic-numbers
              width = hasFrames ? pixels.shape[1] : pixels.shape[0],
              height = hasFrames ? pixels.shape[2] : pixels.shape[1],
              isOddWidth = isOdd(width),
              isOddHeight = isOdd(height);

        // ignore animation gif and even size image
        // eslint-disable-next-line no-magic-numbers
        if (hasFrames && pixels.shape[0] > 1 || !isOddWidth && !isOddHeight) {
          return done(null, file);
        }

        // transform to such as (example when the width is 3 pixels)
        // [[0, 0, 0, 255], [0, 0, 0, 255], [0, 0, 0, 255],
        //  [0, 0, 0, 255], [0, 0, 0, 255], [0, 0, 0, 255],
        //  [0, 0, 0, 255], [0, 0, 0, 255], [0, 0, 0, 255]]
        let data = chunk(chunk([...pixels.data], dimension), width),
            newWidth = width,
            newHeight = height;

        // fill to width that to be even
        if (isOddWidth) {
          newWidth = newWidth + 1; // eslint-disable-line no-magic-numbers
          data = data.map((row) => [...row, fillPixel]);
        }

        // fill to height that to be even
        if (isOddHeight) {
          newHeight = newHeight + 1; // eslint-disable-line no-magic-numbers
          data.push(Array.from(new Array(newWidth)).map(() => fillPixel));
        }

        // transform array to ndarray
        data = ndarray(flattenDeep(data), [newWidth, newHeight, dimension]);

        return getStream.buffer(savePixels(data, ext))
          .then((buffer) => {
            if (opts.verbose) {
              log(`${PLUGIN_NAME}: "${file.relative}" evenize to ${newWidth}x${newHeight}.`); // eslint-disable-line max-len
            }
            file.contents = buffer;
            return done(null, file);
          });
      })
      .catch((error) => done(new PluginError(PLUGIN_NAME, error)));
  });
}
