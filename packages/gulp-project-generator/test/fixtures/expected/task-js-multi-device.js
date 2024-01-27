import gulp from 'gulp';
import buildJs from '@hidoo/gulp-task-build-js-browserify';
import * as config from '../config.js';

// define main task
const mainDesktop = buildJs({
  name: 'js:desktop:main',
  src: `${config.path.srcJsDesktop}/main.js`,
  dest: `${config.path.destJsDesktop}`,
  filename: 'main.js',
  compress: config.compress
});
const mainMobile = buildJs({
  name: 'js:mobile:main',
  src: `${config.path.srcJsMobile}/main.js`,
  dest: `${config.path.destJsMobile}`,
  filename: 'main.js',
  compress: config.compress
});

// define watch task
const watchDesktop = () => {
  gulp.watch(
    [
      `${config.path.srcJsDesktop}/**/*.js`
    ],
    mainDesktop
  );
};
const watchMobile = () => {
  gulp.watch(
    [
      `${config.path.srcJsMobile}/**/*.js`
    ],
    mainMobile
  );
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
