/**
 * import modules
 */
import gulp from 'gulp';
import buildJsBrowserify from '@hidoo/gulp-task-build-js-browserify';
import buildJsRollup from '@hidoo/gulp-task-build-js-rollup';
import {concatJs} from '@hidoo/gulp-task-concat';

/**
 * import modules - local
 */
import {path, compress} from '../config';

/**
 * define tasks
 */
export const browserify = buildJsBrowserify({
  src: `${path.srcJs}/main.js`,
  dest: `${path.destJs}`,
  filename: 'main.browserify.js',
  compress
});
export const rollup = buildJsRollup({
  src: `${path.srcJs}/main.js`,
  dest: `${path.destJs}`,
  filename: 'main.rollup.js',
  compress
});
export const dependency = concatJs({
  src: [
    `${path.srcJs}/deps/sample-b.js`,
    `${path.srcJs}/deps/sample-a.js`
  ],
  dest: `${path.destJs}`,
  compress
});
export const main = gulp.parallel(browserify, rollup);
export const watch = () => {
  gulp.watch([`!${path.srcJs}/deps/*.js`, `${path.srcJs}/**/*.js`], main);
  gulp.watch(`${path.srcJs}/deps/*.js`, dependency);
};
