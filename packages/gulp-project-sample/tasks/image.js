/**
 * import modules
 */
import gulp from 'gulp';
import optimizeImage from '@hidoo/gulp-task-optimize-image';

/**
 * import modules - local
 */
import {path, compress} from '../config';

/**
 * define tasks
 */
export const main = optimizeImage({
  src: `${path.srcImage}/**/*.{jpg,jpeg,png,gif,svg}`,
  dest: `${path.destImage}`,
  compress
});
export const watch = () => {
  gulp.watch(`${path.srcImage}/**/*.{jpg,jpeg,png,gif,svg}`, main);
};
