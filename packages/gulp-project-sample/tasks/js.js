/**
 * import modules
 */
import gulp from 'gulp';
import buildJs from '@hidoo/gulp-task-build-js-browserify';

/**
 * import modules - local
 */
import {path, compress} from '../config';

/**
 * define tasks
 */
export const main = buildJs({
  src: `${path.srcJs}/main.js`,
  dest: `${path.destJs}`,
  compress
});
export const watch = () => {
  gulp.watch(`${path.srcJs}/**/*.js`, main);
};
