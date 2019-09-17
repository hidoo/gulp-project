import fs from 'fs';
import path from 'path';
import mkdir from './mkdir';
import * as log from './log';

/**
 * default options
 *
 * @type {Object}
 */
const DEFAULT_OPTIONS = {

  /**
   * same as options of fs.writeFile
   *
   * @type {Object}
   */
  writeFile: {},

  /**
   * out log or not
   *
   * @type {Boolean}
   */
  verbose: false
};

/**
 * write to file
 *
 * @param {String} src source content
 * @param {String} dest destination path
 * @param {DEFAULT_OPTIONS} options options
 * @param {Object} options.writeFile same as options of fs.writeFile
 * @param {Boolean} options.verbose out log or not
 * @return {Promise<String>}
 */
export default function write(src = '', dest = '', options = {}) {
  if (typeof src !== 'string') {
    throw new TypeError('Argument "src" is not string.');
  }
  if (typeof dest !== 'string') {
    throw new TypeError('Argument "dest" is not string.');
  }

  const opts = {...DEFAULT_OPTIONS, ...options},
        destPath = path.resolve(dest),
        destDir = path.dirname(destPath);

  return mkdir(destDir, {verbose: opts.verbose})
    .then(() => new Promise((resolve, reject) => {
      fs.writeFile(destPath, src, opts.writeFile, (error) => {
        if (error) {
          return reject(error);
        }
        if (opts.verbose) {
          log.outPath(dest);
        }
        return resolve(dest);
      });
    }));
}
