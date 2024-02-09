import { glob } from 'glob';

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
  glob: {}
};

/**
 * return directory is empty or not
 *
 * @param {String} dest destination path
 * @param {DEFAULT_OPTIONS} options options
 * @param {Object} options.glob same as options of glob
 * @return {Promise<Boolean>}
 */
export default async function isEmptyDir(dest = '', options = {}) {
  if (typeof dest !== 'string') {
    throw new TypeError('Argument "dest" is not string.');
  }

  const opts = { ...DEFAULT_OPTIONS, ...options };
  const destPaths = await glob(`${dest}/**/*`, opts.glob);

  return !destPaths.length;
}
