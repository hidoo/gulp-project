/* eslint no-magic-numbers: off, max-statements: off */

import through from 'through2';
import PluginError from 'plugin-error';
import arrayChunk from 'lodash.chunk';
import ndarray from 'ndarray';
import getPixels from 'get-pixels';
import savePixels from 'save-pixels';
import FileType from 'file-type';
import log from 'fancy-log';

/**
 * check number is odd or not
 *
 * @param {Number} value number
 * @return {Boolean}
 */
function isOdd(value = 0) {
  return value % 2 === 1;
}

/**
 * debug for ndarray of pixels
 *
 * @param {Vinyl} file vinyl of image file
 * @param {View4duint8} pixels ndarray of pixels
 * @return {void}
 */
function debug(file, pixels) {
  const hasFrames = pixels.shape.length === 4,
    width = hasFrames ? pixels.shape[1] : pixels.shape[0],
    channels = hasFrames ? pixels.shape[3] : pixels.shape[2],
    data = chunk(chunk([...pixels.data], channels), width);

  console.log(`
    file: ${file.basename}
    pixels:
      shape: [${pixels.shape.join(', ')}]
      stride: [${pixels.stride.join(', ')}]
      offset: ${pixels.offset}
      size: ${pixels.size}
      order: ${pixels.order}
      dimension: ${pixels.dimension}
      data:
---
${data.map((row) => row.map((el) => `[${el.join(' ')}]`).join(' ')).join('\n')}
---
  `);
}

/**
 * plugin default options.
 *
 * @type {Object}
 */
const DEFAULT_OPTIONS = {
  // out log or not
  verbose: false
};

/**
 * plugin name.
 *
 * @type {String}
 */
const PLUGIN_NAME = 'gulp-plugin-image-evenizer';

/**
 * return evenized image if image width or height is odd number.
 *
 * @param {DEFAULT_OPTIONS} options option
 * @return {DestroyableTransform}
 *
 * @example
 * import {src, dest, task} from 'gulp';
 * import imageEvenizer from '@hidoo/gulp-plugin-image-evenizer';
 *
 * task('evenize', () => src('/path/to/src')
 *   .pipe(imageEvenizer())
 *   .pipe(dest('/path/to/dest')));
 */
export default function imageEvenizer(options = {}) {
  const opts = { ...DEFAULT_OPTIONS, ...options };

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

    return (async () => {
      try {
        const { ext, mime } = await FileType.fromBuffer(file.contents);
        const pixels = await new Promise((resolve, reject) => {
          getPixels(file.contents, mime, (error, pxls) => {
            if (error) {
              reject(error);
            } else {
              resolve(pxls);
            }
          });
        });
        const hasFrames = pixels.shape.length === 4;
        const width = hasFrames ? pixels.shape[1] : pixels.shape[0];
        const height = hasFrames ? pixels.shape[2] : pixels.shape[1];
        const isOddWidth = isOdd(width);
        const isOddHeight = isOdd(height);
        const isJpg = /^jpe?g$/i.test(ext);
        const isGif = /^gif$/i.test(ext);
        const fillPixel = isJpg ? [255, 255, 255, 255] : [255, 255, 255, 0];
        const saveOptions = isJpg ? { quality: 100 } : {};
        const channels = 4;

        // ignore animation gif and even size image
        if (
          (hasFrames && pixels.shape[0] > 1) ||
          (!isOddWidth && !isOddHeight)
        ) {
          return done(null, file);
        }

        // transform to such as (example when the width is 3 pixels)
        // [[[0, 0, 0, 255], [0, 0, 0, 255], [0, 0, 0, 255]],
        //  [[0, 0, 0, 255], [0, 0, 0, 255], [0, 0, 0, 255]],
        //  [[0, 0, 0, 255], [0, 0, 0, 255], [0, 0, 0, 255]]]
        let data = arrayChunk(arrayChunk([...pixels.data], channels), width);
        let newWidth = width;
        let newHeight = height;

        // replace [0, 0, 0, 0] to [255, 255, 255, 0] when media is gif
        if (isGif) {
          data = data.map((row) =>
            row.map((pixel) => {
              if (pixel.join(',') === '0,0,0,0') {
                return fillPixel;
              }
              return pixel;
            })
          );
        }

        // fill to width that to be even
        if (isOddWidth) {
          newWidth = newWidth + 1;
          data = data.map((row) => [...row, fillPixel]);
        }

        // fill to height that to be even
        if (isOddHeight) {
          newHeight = newHeight + 1;
          data = [
            ...data,
            ...Array.from({ length: newWidth }).map(() => fillPixel)
          ];
        }

        // set params (example when image size is 12x10)
        // + shape -> [12, 10, 4]
        // + stride -> [4, 48, 1]
        const sizeInRow = newWidth * channels;
        const shape = [newWidth, newHeight, channels];
        const stride = [channels, sizeInRow, 1];

        // // add frame to params (example when image size is 12x10)
        // // + shape -> [1, 12, 10, 4]
        // // + stride -> [480, 4, 48, 1]
        if (isGif) {
          const sizeInFrame = newWidth * newHeight * channels;

          shape.unshift(1);
          stride.unshift(sizeInFrame);
        }

        const newPixels = ndarray(
          Uint8Array.from(data.flat(Infinity)),
          shape,
          stride
        );

        // save pixels as buffer
        file.contents = await new Promise((resolve, reject) => {
          const chunks = [];

          savePixels(newPixels, ext, saveOptions)
            .on('error', reject)
            .on('data', (chunk) => {
              chunks.push(chunk);
            })
            .on('end', () => {
              resolve(Buffer.concat(chunks));
            });
        });

        if (opts.verbose) {
          log(
            `${PLUGIN_NAME}: "${file.relative}" evenize to ${newWidth}x${newHeight}.`
          );
        }

        return done(null, file);
      } catch (error) {
        return done(new PluginError(PLUGIN_NAME, error));
      }
    })();
  });
}
