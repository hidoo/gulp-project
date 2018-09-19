/**
 * import modules
 */
import gulp from 'gulp';
import buildCss from '@hidoo/gulp-task-build-css-stylus';

/**
 * import modules - local
 */
import * as config from '../config';

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

// define watch task
const watchDesktop = () => {
  gulp.watch(
    [
      `${config.path.srcCssDesktop}/*.styl`
    ],
    mainDesktop
  );
};
const watchMobile = () => {
  gulp.watch(
    [
      `${config.path.srcCssMobile}/*.styl`
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
