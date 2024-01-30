import path from 'node:path';
import fs from 'node:fs/promises';
import {glob} from 'glob';
import globParent from 'glob-parent';
import mkdir from './mkdir.js';
import * as log from './log.js';

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
export default async function copy(pattern = '', dest = '', options = {}) {
  if (typeof pattern !== 'string') {
    throw new TypeError('Argument "pattern" is not string.');
  }
  if (typeof dest !== 'string') {
    throw new TypeError('Argument "dest" is not string.');
  }

  const opts = {...DEFAULT_OPTIONS, ...options};
  const globBase = globParent(pattern);

  const srcPaths = await glob(pattern, opts.glob);
  const destPaths = await Promise.all(srcPaths.map(async (srcPath) => {
    const destPath = path.resolve(dest, srcPath.replace(`${globBase}${path.sep}`, ''));

    await mkdir(path.dirname(destPath), {verbose: opts.verbose});
    await fs.copyFile(srcPath, destPath);

    if (opts.verbose) {
      log.outPath(destPath);
    }
    return destPath;
  }));

  return destPaths;
}
