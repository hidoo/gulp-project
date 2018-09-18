/**
 * import modules
 */
import gulp from 'gulp';
import buildCss from '@hidoo/gulp-task-build-css-stylus';
import {concatCss} from '@hidoo/gulp-task-concat';

/**
 * import modules - local
 */
import * as config from '../config';

// define main task
export const main = buildCss({
  src: `${config.path.srcCss}/main.styl`,
  dest: `${config.path.destCss}`,
  filename: 'main.css',
  compress: config.compress
});

// define dependency task
export const deps = concatCss({
  src: [
    `${config.path.srcCss}/deps/sample-b.css`,
    `${config.path.srcCss}/deps/sample-a.css`
  ],
  dest: config.path.destCss,
  filename: 'bundle.css',
  compress: config.compress
});

// define watch task
export const watch = () => {
  gulp.watch(
    [
      `${config.path.srcCss}/*.styl`
    ],
    main
  );
  gulp.watch(
    [
      `${config.path.srcCss}/deps/*.css`
    ],
    deps
  );
};
