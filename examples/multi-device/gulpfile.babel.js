/**
 * import modules
 */
import gulp from 'gulp';
import rimraf from 'rimraf';
import fancyPrint from '@hidoo/util-fancy-print';

/**
 * import modules - tasks
 */
import * as config from './config';
import * as css from './task/css';
import * as html from './task/html';
import * as image from './task/image';
import * as js from './task/js';
import * as sprite from './task/sprite';
import * as styleguide from './task/styleguide';
import server from './task/server';

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
 * @param {Function} done callback
 * @return {void}
 */
export const clean = (done) => rimraf(`${config.path.dest}/*`, done);

/**
 * server task
 *
 * @type {Function}
 */
export {default as server} from './task/server';

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
