/* eslint-disable no-console */

import path from 'path';
import chalk from 'chalk';

/**
 * output file path to stdout
 * @param {String} pathname path name
 * @return {void}
 */
export function outPath(pathname) {
  console.log(chalk.grey(path.relative(process.cwd(), pathname)));
}
