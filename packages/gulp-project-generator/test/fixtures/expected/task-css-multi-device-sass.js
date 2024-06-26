import gulp from 'gulp';
import buildCss from '@hidoo/gulp-task-build-css-sass';
import * as config from '../config.js';

// define main task
const mainDesktop = buildCss({
  name: 'css:desktop:main',
  src: `${config.path.srcCssDesktop}/main.scss`,
  dest: `${config.path.destCssDesktop}`,
  filename: 'main.css',
  compress: config.compress
});
const mainMobile = buildCss({
  name: 'css:mobile:main',
  src: `${config.path.srcCssMobile}/main.scss`,
  dest: `${config.path.destCssMobile}`,
  filename: 'main.css',
  compress: config.compress
});

// define watch task
const watchDesktop = () => {
  gulp.watch([`${config.path.srcCssDesktop}/*.scss`], mainDesktop);
};
const watchMobile = () => {
  gulp.watch([`${config.path.srcCssMobile}/*.scss`], mainMobile);
};

// export tasks
export const desktop = {
  main: mainDesktop,
  watch: watchDesktop
};
export const mobile = {
  main: mainMobile,
  watch: watchMobile
};
