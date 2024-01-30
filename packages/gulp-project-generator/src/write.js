import fs from 'node:fs/promises';
import path from 'node:path';
import mkdir from './mkdir.js';
import * as log from './log.js';

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
export default async function write(src = '', dest = '', options = {}) {
  if (typeof src !== 'string') {
    throw new TypeError('Argument "src" is not string.');
  }
  if (typeof dest !== 'string') {
    throw new TypeError('Argument "dest" is not string.');
  }

  const opts = {...DEFAULT_OPTIONS, ...options};
  const destPath = path.resolve(dest);
  const destDir = path.dirname(destPath);

  await mkdir(destDir, {verbose: opts.verbose});
  await fs.writeFile(destPath, src, opts.writeFile);

  if (opts.verbose) {
    log.outPath(dest);
  }
  return dest;
}
