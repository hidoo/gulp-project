import fs from 'fs';
import glob from 'glob';
import globParent from 'glob-parent';
import Vinyl from 'vinyl';

/**
 * [globPromise description]
 * @param {String} pattern glob pattern
 * @param {Object} options same as options of glob
 * @return {Array<String>}
 */
export function globPromise(pattern = '', options = {}) {
  return new Promise((resolve) =>
    glob(pattern, options, (err, filepaths) => {
      if (err) {
        return resolve([]);
      }
      return resolve(filepaths);
    })
  );
}

/**
 * read file async
 * @param {String} filepath file path
 * @param {Object} options options
 * @param {Object} options.encoding same as options.encoding of fs.readFile
 * @param {Object} options.flag flag as options.flag of fs.readFile
 * @param {Object} options.base base path
 * @param {Object} options.verbose out log or not
 * @return {Promise<Vinyl>}
 */
export function readFile(filepath, options = {}) {
  const {base, verbose, ...readFileOptions} = options;

  return new Promise((resolve) => {
    fs.readFile(filepath, readFileOptions, (error, contents) => {
      if (error) {
        if (verbose) {
          console.error(error); // eslint-disable-line no-console
        }
        return resolve(new Vinyl({path: filepath, base, error}));
      }
      return resolve(new Vinyl({path: filepath, base, contents}));
    });
  });
}

/**
 * read multi file async
 * @param {String} pattern glob pattern
 * @param {Object} options options
 * @param {Object} options.glob same as options of glob
 * @param {Object} options.readFile same as options of fs.readFile
 * @param {Object} options.verbose out log or not
 * @return {Promise<Array<Vinyl>>}
 */
export async function readFiles(pattern, options = {}) {
  const {verbose} = options,
        base = globParent(pattern);

  const filepaths = await globPromise(pattern, {silent: !verbose, ...options.glob});

  const files = await Promise.all(
    filepaths.map((filepath) => readFile(filepath, {...options.readFile, base, verbose}))
  );

  return files.filter(({error}) => !error);
}
