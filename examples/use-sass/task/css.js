import gulp from 'gulp';
import buildCss from '@hidoo/gulp-task-build-css-sass';
import {concatCss} from '@hidoo/gulp-task-concat';
import * as config from '../config.js';

// define main task
export const main = buildCss({
  name: 'css:main',
  src: `${config.path.srcCss}/main.scss`,
  dest: `${config.path.destCss}`,
  filename: 'main.css',
  compress: config.compress
});

// define dependency task
export const deps = concatCss({
  name: 'css:deps',
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
      `${config.path.srcCss}/*.scss`
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

