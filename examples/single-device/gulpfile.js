import fs from 'node:fs/promises';
import gulp from 'gulp';
import fancyPrint from '@hidoo/util-fancy-print';
import * as config from './config.js';
import * as css from './task/css.js';
import * as html from './task/html.js';
import * as image from './task/image.js';
import * as js from './task/js.js';
import * as sprite from './task/sprite.js';
import * as styleguide from './task/styleguide.js';
import server from './task/server.js';

/**
 * print values of config
 */
fancyPrint(`${config.pkg.name} - ${config.pkg.version}`, [
  {
    label: 'NODE_ENV',
    value: process.env.NODE_ENV // eslint-disable-line node/no-process-env
  },
  {
    label: 'Compress Flag',
    value: config.compress
  },
  {
    label: 'Destination',
    value: config.path.dest
  },
  {
    label: 'Local Web Server',
    value: (({host, port, protocol}) =>
      `${protocol}://${host}:${port}/`)(config.serverOptions)
  }
]);

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
 * build task
 *
 * @return {Function}
 */
export const build = gulp.parallel(
  css.deps,
  js.deps,
  gulp.series(
    sprite.main,
    css.main,
    styleguide.main
  ),
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
export default gulp.series(
  clean,
  build,
  gulp.parallel(
    server,
    watch
  )
);
