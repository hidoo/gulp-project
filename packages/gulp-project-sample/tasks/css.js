/**
 * import modules
 */
import gulp from 'gulp';
import buildCss from '@hidoo/gulp-task-build-css-stylus';
import {concatCss} from '@hidoo/gulp-task-concat';

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
export const dependency = concatCss({
  src: [
    `${path.srcCss}/deps/sample-b.css`,
    `${path.srcCss}/deps/sample-a.css`
  ],
  dest: `${path.destCss}`,
  compress
});
export const watch = () => {
  gulp.watch(`${path.srcCss}/*.styl`, main);
  gulp.watch(`${path.srcCss}/deps/*.css`, dependency);
};
