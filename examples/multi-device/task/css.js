import gulp from 'gulp';
import buildCss from '@hidoo/gulp-task-build-css-stylus';
import {concatCss} from '@hidoo/gulp-task-concat';
import * as config from '../config.js';

// define main task
const mainDesktop = buildCss({
  name: 'css:desktop:main',
  src: `${config.path.srcCssDesktop}/main.styl`,
  dest: `${config.path.destCssDesktop}`,
  filename: 'main.css',
  compress: config.compress
});
const mainMobile = buildCss({
  name: 'css:mobile:main',
  src: `${config.path.srcCssMobile}/main.styl`,
  dest: `${config.path.destCssMobile}`,
  filename: 'main.css',
  compress: config.compress
});

// define dependency task
const depsDesktop = concatCss({
  name: 'css:desktop:deps',
  src: [
    `${config.path.srcCssDesktop}/deps/sample-b.css`,
    `${config.path.srcCssDesktop}/deps/sample-a.css`
  ],
  dest: config.path.destCssDesktop,
  filename: 'bundle.css',
  compress: config.compress
});
const depsMobile = concatCss({
  name: 'css:mobile:deps',
  src: [
    `${config.path.srcCssMobile}/deps/sample-b.css`,
    `${config.path.srcCssMobile}/deps/sample-a.css`
  ],
  dest: config.path.destCssMobile,
  filename: 'bundle.css',
  compress: config.compress
});

// define watch task
const watchDesktop = () => {
  gulp.watch(
    [
      `${config.path.srcCssDesktop}/*.styl`
    ],
    mainDesktop
  );
  gulp.watch(
    [
      `${config.path.srcCssDesktop}/deps/*.css`
    ],
    depsDesktop
  );
};
const watchMobile = () => {
  gulp.watch(
    [
      `${config.path.srcCssMobile}/*.styl`
    ],
    mainMobile
  );
  gulp.watch(
    [
      `${config.path.srcCssMobile}/deps/*.css`
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

