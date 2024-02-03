import fs from 'node:fs/promises';
import gulp from 'gulp';
import chalk from 'chalk';
import * as config from './config.js';
import * as css from './task/css.js';
import * as html from './task/html.js';
import * as image from './task/image.js';
import * as js from './task/js.js';
import * as sprite from './task/sprite.js';
import * as styleguide from './task/styleguide.js';
import server from './task/server.js';

// print values of config
/* eslint-disable node/no-process-env */
console.log(
  chalk.gray.italic(`/**
 * ${config.pkg.name.toUpperCase()}
 * ${config.pkg.description || '(no description)'}
 *
 * @version ${config.pkg.version}
 * @type {String}  NODE_ENV ${chalk.green(`'${process.env.NODE_ENV}'`)}
 * @type {Boolean} compress ${chalk.yellow(config.compress)}
 */
`)
);
/* eslint-enable node/no-process-env */

/**
 * clean dest task
 *
 * @return {Promise}
 */
export const clean = async () => {
  try {
    if (await fs.stat(config.path.dest)) {
      await fs.rm(config.path.dest, { recursive: true });
    }
  } catch ({ message }) {
    console.warn(message);
  }
};

/**
 * server task
 *
 * @type {Function}
 */
export { default as server } from './task/server.js';

/**
 * build task
 *
 * @return {Function}
 */
export const build = gulp.parallel(
  css.deps,
  js.deps,
  gulp.series(sprite.main, css.main, styleguide.main),
  js.main,
  html.main,
  image.main
);

/**
 * file observe task
 *
 * @return {Function}
 */
export const watch = gulp.parallel(
  css.watch,
  js.watch,
  html.watch,
  image.watch,
  sprite.watch,
  styleguide.watch
);

/**
 * default task
 *
 * @return {Function}
 */
export default gulp.series(clean, build, gulp.parallel(server, watch));
