import gulp from 'gulp';
import buildJs from '@hidoo/gulp-task-build-js-browserify';
import {concatJs} from '@hidoo/gulp-task-concat';
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

// define dependency task
const depsDesktop = concatJs({
  name: 'js:desktop:deps',
  src: [
    `${config.path.srcJsDesktop}/deps/sample-b.js`,
    `${config.path.srcJsDesktop}/deps/sample-a.js`
  ],
  dest: config.path.destJsDesktop,
  filename: 'bundle.js',
  compress: config.compress
});
const depsMobile = concatJs({
  name: 'js:mobile:deps',
  src: [
    `${config.path.srcJsMobile}/deps/sample-b.js`,
    `${config.path.srcJsMobile}/deps/sample-a.js`
  ],
  dest: config.path.destJsMobile,
  filename: 'bundle.js',
  compress: config.compress
});

// define watch task
const watchDesktop = () => {
  gulp.watch(
    [
      `!${config.path.srcJsDesktop}/deps/*.js`,
      `${config.path.srcJsDesktop}/**/*.js`
    ],
    mainDesktop
  );
  gulp.watch(
    [
      `${config.path.srcJsDesktop}/deps/*.js`
    ],
    depsDesktop
  );
};
const watchMobile = () => {
  gulp.watch(
    [
      `!${config.path.srcJsMobile}/deps/*.js`,
      `${config.path.srcJsMobile}/**/*.js`
    ],
    mainMobile
  );
  gulp.watch(
    [
      `${config.path.srcJsMobile}/deps/*.js`
    ],
    depsMobile
  );
};

// export tasks
export const desktop = {
  main: mainDesktop,
  deps: depsDesktop,
  watch: watchDesktop
};
export const mobile = {
  main: mainMobile,
  deps: depsMobile,
  watch: watchMobile
};
