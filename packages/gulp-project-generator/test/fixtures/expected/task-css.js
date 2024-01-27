import gulp from 'gulp';
import buildCss from '@hidoo/gulp-task-build-css-stylus';
import * as config from '../config.js';

// define main task
export const main = buildCss({
  name: 'css:main',
  src: `${config.path.srcCss}/main.styl`,
  dest: `${config.path.destCss}`,
  filename: 'main.css',
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
};
