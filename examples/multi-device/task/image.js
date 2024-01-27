import gulp from 'gulp';
import optimizeImage from '@hidoo/gulp-task-optimize-image';
import * as config from '../config.js';

// define main task
const mainDesktop = optimizeImage({
  name: 'image:desktop:main',
  src: `${config.path.srcImageDesktop}/**/*.{jpg,jpeg,png,gif,svg}`,
  dest: `${config.path.destImageDesktop}`,
  compress: config.compress
});
const mainMobile = optimizeImage({
  name: 'image:mobile:main',
  src: `${config.path.srcImageMobile}/**/*.{jpg,jpeg,png,gif,svg}`,
  dest: `${config.path.destImageMobile}`,
  compress: config.compress
});

// define watch task
const watchDesktop = () => {
  gulp.watch(
    [
      `${config.path.srcImageDesktop}/**/*.{jpg,jpeg,png,gif,svg}`
    ],
    mainDesktop
  );
};
const watchMobile = () => {
  gulp.watch(
    [
      `${config.path.srcImageMobile}/**/*.{jpg,jpeg,png,gif,svg}`
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

