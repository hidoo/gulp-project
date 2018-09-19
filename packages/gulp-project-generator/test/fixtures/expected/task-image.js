/**
 * import modules
 */
import gulp from 'gulp';
import optimizeImage from '@hidoo/gulp-task-optimize-image';

/**
 * import modules - local
 */
import * as config from '../config';

// define main task
export const main = optimizeImage({
  name: 'image:main',
  src: `${config.path.srcImage}/**/*.{jpg,jpeg,png,gif,svg}`,
  dest: `${config.path.destImage}`,
  compress: config.compress
});

// define watch task
export const watch = () => {
  gulp.watch(
    [
      `${config.path.srcImage}/**/*.{jpg,jpeg,png,gif,svg}`
    ],
    main
  );
};
