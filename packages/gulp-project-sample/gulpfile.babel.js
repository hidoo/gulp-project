/**
 * import modules
 */
import {series, parallel} from 'gulp';
import rimraf from 'rimraf';

/**
 * import modules - tasks
 */
import * as config from './config';
import * as css from './tasks/css';
import * as html from './tasks/html';
import * as image from './tasks/image';
import * as sprite from './tasks/sprite';

/**
 * clean dest task
 * @param {Function} done callback
 * @return {void}
 */
export const clean = (done) => rimraf(`${config.path.dest}/*`, done);

/**
 * build task
 * @return {Function}
 */
export const build = parallel(
  css.main,
  html.main,
  image.main,
  sprite.main
);

/**
 * file observe task
 * @return {Function}
 */
export const watch = parallel(
  css.watch,
  html.watch,
  image.watch,
  sprite.watch
);

/**
 * default task
 * @return {Function}
 */
export default series(
  clean,
  build,
  watch
);
