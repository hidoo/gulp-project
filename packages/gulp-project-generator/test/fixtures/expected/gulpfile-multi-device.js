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
console.log(chalk.gray.italic(`/**
 * ${config.pkg.name.toUpperCase()}
 * ${config.pkg.description || '(no description)'}
 *
 * @version ${config.pkg.version}
 * @type {String}  NODE_ENV ${chalk.green(`'${process.env.NODE_ENV}'`)}
 * @type {Boolean} compress ${chalk.yellow(config.compress)}
 */
`));
/* eslint-enable node/no-process-env */

/**
 * clean dest task
 *
 * @return {Promise}
 */
export const clean = async () => {
  try {
    if (await fs.stat(config.path.dest)) {
      await fs.rm(config.path.dest, {recursive: true});
    }
  }
  catch ({message}) {
    console.warn(message);
  }
};

/**
 * server task
 *
 * @type {Function}
 */
export {default as server} from './task/server.js';

/**
 * return skip task
 *
 * @param {String} name task name
 * @return {Function}
 */
export const skip = (name = 'skip') => {
  const task = (done) => done();

  task.displayName = name;
  return task;
};

/**
 * build task
 *
 * @return {Function}
 */
export const build = gulp.parallel(
  config.skipDevice === 'desktop' ? skip('skip:build:desktop') : gulp.parallel(
    css.desktop.deps,
    js.desktop.deps,
    gulp.series(
      sprite.desktop.main,
      css.desktop.main,
      styleguide.desktop.main
    ),
    js.desktop.main,
    html.desktop.main,
    image.desktop.main
  ),
  config.skipDevice === 'mobile' ? skip('skip:build:mobile') : gulp.parallel(
    css.mobile.deps,
    js.mobile.deps,
    gulp.series(
      sprite.mobile.main,
      css.mobile.main,
      styleguide.mobile.main
    ),
    js.mobile.main,
    html.mobile.main,
    image.mobile.main
  )
);

/**
 * file observe task
 *
 * @return {Function}
 */
export const watch = gulp.parallel(
  config.skipDevice === 'desktop' ? skip('skip:watch:desktop') : gulp.parallel(
    css.desktop.watch,
    js.desktop.watch,
    html.desktop.watch,
    image.desktop.watch,
    sprite.desktop.watch,
    styleguide.desktop.watch
  ),
  config.skipDevice === 'mobile' ? skip('skip:watch:mobile') : gulp.parallel(
    css.mobile.watch,
    js.mobile.watch,
    html.mobile.watch,
    image.mobile.watch,
    sprite.mobile.watch,
    styleguide.mobile.watch
  )
);

/**
 * default task
 *
 * @return {Function}
 */
export default gulp.series(
  clean,
  build,
  gulp.parallel(
    server,
    watch
  )
);
