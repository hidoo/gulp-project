import fs from 'fs';
import path from 'path';
import glob from 'glob';
import globParent from 'glob-parent';
import mkdir from './mkdir';
import * as log from './log';

/**
 * default options
 *
 * @type {Object}
 */
const DEFAULT_OPTIONS = {

  /**
   * same as options of glob
   *
   * @type {Object}
   */
  glob: {},

  /**
   * out log or not
   *
   * @type {Boolean}
   */
  verbose: true
};

/**
 * copy files by specified blob patten
 *
 * @param {String} pattern glob pattern of source path
 * @param {String} dest destination path
 * @param {DEFAULT_OPTIONS} options options
 * @param {Object} options.glob same as options of glob
 * @param {Boolean} options.verbose out log or not
 * @return {Promise<Array<String>>}
 */
export default function copy(pattern = '', dest = '', options = {}) {
  if (typeof pattern !== 'string') {
    throw new TypeError('Argument "pattern" is not string.');
  }
  if (typeof dest !== 'string') {
    throw new TypeError('Argument "dest" is not string.');
  }

  const opts = {...DEFAULT_OPTIONS, ...options},
        globBase = globParent(pattern);

  const promise = new Promise((resolve, reject) => {
    glob(pattern, opts.glob, (error, srcPaths) => {
      if (error) {
        return reject(error);
      }
      return resolve(srcPaths);
    });
  });

  return promise
    .then((srcPaths) => Promise.all(srcPaths.map((srcPath) => {
      const destPath = path.resolve(dest, srcPath.replace(`${globBase}${path.sep}`, '')),
            destDir = path.dirname(destPath);

      return mkdir(destDir, {verbose: opts.verbose})
        .then(() => new Promise((resolve, reject) => {
          fs.copyFile(srcPath, destPath, (error) => {
            if (error) {
              return reject(error);
            }
            if (opts.verbose) {
              log.outPath(destPath);
            }
            return resolve(destPath);
          });
        }));
    })));
}
