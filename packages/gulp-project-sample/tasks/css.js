/**
 * import modules
 */
import gulp from 'gulp';
import buildCss from '@hidoo/gulp-task-build-css-stylus';

/**
 * import modules - local
 */
import {path, compress} from '../config';

/**
 * define tasks
 */
export const main = buildCss({
  src: `${path.srcCss}/main.styl`,
  dest: `${path.destCss}`,
  compress
});
export const watch = () => {
  gulp.watch(`${path.srcCss}/*.styl`, main);
};
