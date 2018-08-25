import through from 'through2';
import PluginError from 'plugin-error';
import gm from 'gm';
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

  // use ImageMagick or not
  imageMagick: true,

  // out log or not
  verbose: true
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
  const opts = {...DEFAULT_OPTIONS, ...options},
        engine = opts.imageMagick ? gm.subClass({imageMagick: true}) : gm;

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
          image = engine(file.contents, mime),
          getSize = new Promise((resolve) => image.size((error, size) => {
            if (error) {
              throw new PluginError(PLUGIN_NAME, error);
            }
            resolve(size);
          }));

    return getSize
      .then((size) => {
        let {width, height} = size,
            direction = '';

        if (isOdd(height)) {
          direction += 'Nouth';
          height += 1; // eslint-disable-line no-magic-numbers
        }

        if (isOdd(width)) {
          direction += 'West';
          width += 1; // eslint-disable-line no-magic-numbers
        }

        if (direction === '') {
          done(null, file);
          return Promise.resolve();
        }

        return image
          .gravity(direction)
          .background(mime === 'image/jpeg' ? '#fff' : 'rgba(255,255,255,0)')
          .extent(width, height)
          .toBuffer(ext, (error, buffer) => {
            if (error) {
              throw new PluginError(PLUGIN_NAME, error);
            }
            if (opts.verbose) {
              log(`${PLUGIN_NAME}: "${file.relative}" evenize to ${width}x${height}.`);
            }
            file.contents = buffer;
            done(null, file);
            Promise.resolve();
          });
      });
  });
}
