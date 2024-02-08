import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Vinyl from 'vinyl';
import through from 'through2';
import Handlebars from 'handlebars';
import PluginError from 'plugin-error';
import optimizeSvg from './optimizeSvg.js';
import reshapeTemplateVars from './reshapeTemplateVars.js';
import configureSVGSpriter from './configureSVGSpriter.js';

/**
 * plugin default options.
 *
 * @type {Object}
 */
const DEFAULT_OPTIONS = {
  // destination svg path
  imgName: null,

  // destination css path
  cssName: null,

  // destination svg path in css file
  imgPath: null,

  // padding between image in sprite sheet
  padding: 0,

  // layout for generate sprite sheet（one of packed, vertical, and horizontal）
  layout: 'packed',

  // Handlebars template for css
  cssTemplate: path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    '../template/stylus.hbs'
  ),

  // Handlebars helpers
  cssHandlebarsHelpers: null
};

/**
 * plugin name.
 *
 * @type {String}
 */
const PLUGIN_NAME = 'gulp-plugin-svg-sprite';

/* eslint-disable max-lines-per-function, max-statements */
/**
 * return svg sprite sheet
 *
 * @param {DEFAULT_OPTIONS} options options
 * @return {DestroyableTransform}
 *
 * @example
 * import {src, dest, task} from 'gulp';
 * import merge from 'merge-stream';
 * import svgSprite from '@hidoo/gulp-plugin-svg-sprite';
 *
 * task('sprite', () => {
 *   const stream = src('/path/to/src')
 *     .pipe(svgSprite(options));
 *
 *   return merge(
 *     stream.css.pipe(dest('/path/to/dest')),
 *     stream.svg.pipe(dest('/path/to/dest'))
 *   );
 * });
 */
export default function svgSprite(options) {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  if (typeof opts.imgName !== 'string') {
    throw new PluginError(
      PLUGIN_NAME,
      'Argument "options.imgName" is required.'
    );
  }
  if (typeof opts.cssName !== 'string') {
    throw new PluginError(
      PLUGIN_NAME,
      'Argument "options.cssName" is required.'
    );
  }
  if (typeof opts.imgPath !== 'string') {
    throw new PluginError(
      PLUGIN_NAME,
      'Argument "options.imgPath" is required.'
    );
  }
  // eslint-disable-next-line node/no-sync
  if (!fs.existsSync(opts.cssTemplate)) {
    throw new PluginError(
      PLUGIN_NAME,
      'Argument "options.cssTemplate" is required.'
    );
  }

  const { cssTemplate, cssHandlebarsHelpers } = opts;
  const spriter = configureSVGSpriter(opts);
  const handlebars = Handlebars.create();

  const stream = through.obj(transform, flush);
  const svgStream = through.obj();
  const cssStream = through.obj();

  let fileCount = 0;

  // add helpers to Handlebars instance
  if (cssHandlebarsHelpers) {
    Object.entries(cssHandlebarsHelpers).forEach(([name, helper]) =>
      handlebars.registerHelper(name, helper)
    );
  }

  // evaluate template
  const template = handlebars.compile(
    fs.readFileSync(cssTemplate, 'utf8') // eslint-disable-line node/no-sync
  );

  /**
   * process that transform each file
   * + add svg files to SVGSpriter
   *
   * @param {Vinyl} file Vinyl file
   * @param {String} enc encoding
   * @param {Function} done callback
   * @return {void}
   */
  function transform(file, enc, done) {
    if (file.isStream()) {
      throw new PluginError(PLUGIN_NAME, 'Stream is not support.');
    }
    if (file.isNull()) {
      return done(null, file);
    }
    if (!file.isBuffer()) {
      return done(null, file);
    }

    try {
      spriter.add(file.path, path.basename(file.path), file.contents);
      fileCount += 1; // eslint-disable-line no-magic-numbers
    } catch (error) {
      stream.emit('error', new PluginError(PLUGIN_NAME, error));
    }
    return done();
  }

  /**
   * process that flush
   * + generate sprite sheet
   *
   * @param {Function} done callback
   * @return {Promise}
   */
  function flush(done) {
    const { imgName, imgPath, cssName } = opts;

    // eslint-disable-next-line no-magic-numbers
    if (fileCount <= 0) {
      svgStream.push(null);
      cssStream.push(null);
      stream.push(null);
      return done();
    }

    return (async () => {
      try {
        const { result, data } = await spriter.compileAsync();

        Object.entries(result.css).forEach(([type, resource]) => {
          // resource is .svg
          if (type === 'sprite') {
            const contents = optimizeSvg(resource.contents.toString());

            // add file to svg stream
            svgStream.push(
              new Vinyl({
                path: imgName,
                contents: Buffer.from(contents)
              })
            );
            svgStream.push(null);

            // add original file to master stream
            // + required to notify completion of processing
            stream.push(resource);
          }
          // resource is .styl
          else if (type === 'styl') {
            const contents = template({
              spriteName: path.basename(
                imgPath.replace(/(\?|#).*$/g, ''), // eslint-disable-line prefer-named-capture-group
                '.svg'
              ),
              imgPath,
              shapes: reshapeTemplateVars(data.css)
            });

            // add file to css stream
            cssStream.push(
              new Vinyl({
                path: cssName,
                contents: Buffer.from(contents)
              })
            );
            cssStream.push(null);
          }
        });

        await Promise.all([
          new Promise((resolve) => svgStream.on('end', resolve)),
          new Promise((resolve) => cssStream.on('end', resolve))
        ]);

        done();
      } catch (error) {
        done(new PluginError(PLUGIN_NAME, error));
      }
    })();
  }

  stream.css = cssStream;
  stream.svg = svgStream;
  return stream;
}
/* eslint-enable max-lines-per-function, max-statements */
