import fs from 'node:fs/promises';
import * as log from './log.js';

/**
 * default options
 *
 * @type {Object}
 */
const DEFAULT_OPTIONS = {

  /**
   * same as options of mkdir
   *
   * @type {Object}
   */
  mkdir: {},

  /**
   * out log or not
   *
   * @type {Boolean}
   */
  verbose: false
};

/**
 * make directory
 *
 * @param {String} dest destination path
 * @param {DEFAULT_OPTIONS} options options
 * @param {Object} options.mkdir same as options of mkdir
 * @param {Boolean} options.verbose out log or not
 * @return {Promise<String>}
 */
export default async function mkdir(dest = '', options = {}) {
  if (typeof dest !== 'string') {
    throw new TypeError('Argument "dest" is not string.');
  }

  const opts = {...DEFAULT_OPTIONS, ...options};
  let exists = false;

  try {
    await fs.access(dest, fs.constants.W_OK);
    exists = true;
  }
  catch (error) {
    if (error.code !== 'ENOENT') {
      throw error;
    }
  }

  if (exists) {
    return dest;
  }

  await fs.mkdir(dest, {recursive: true, ...opts.mkdir});

  if (opts.verbose) {
    log.outPath(dest);
  }

  return dest;
}
