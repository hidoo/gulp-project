import fs from 'fs';
import mkdirp from 'mkdirp';
import * as log from './log';

/**
 * default options
 * @type {Object}
 */
const DEFAULT_OPTIONS = {

  /**
   * same as options of mkdirp
   * @type {Object}
   */
  mkdirp: {},

  /**
   * out log or not
   * @type {Boolean}
   */
  verbose: false
};

/**
 * make directory
 * @param {String} dest destination path
 * @param {DEFAULT_OPTIONS} options options
 * @param {Object} options.mkdirp same as options of mkdirp
 * @param {Boolean} options.verbose out log or not
 * @return {Promise<String>}
 */
export default function mkdir(dest = '', options = {}) {
  if (typeof dest !== 'string') {
    throw new TypeError('Argument "dest" is not string.');
  }

  const opts = {...DEFAULT_OPTIONS, ...options};

  const promise = new Promise((resolve) => {
    fs.access(dest, fs.constants.W_OK, (error, reject) => {
      if (error && error.code !== 'ENOENT') {
        return reject(error);
      }
      return resolve({dest, exists: !error});
    });
  });

  return promise
    .then((results) => new Promise((resolve, reject) => {
      if (results.exists) {
        return resolve(results.dest);
      }
      return mkdirp(results.dest, opts.mkdirp, (error) => {
        if (error) {
          return reject(error);
        }
        if (opts.verbose) {
          log.outPath(results.dest);
        }
        return resolve(results.dest);
      });
    }));
}
