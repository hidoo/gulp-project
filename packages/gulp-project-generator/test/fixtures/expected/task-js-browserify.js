/**
 * import modules
 */
import gulp from 'gulp';
import buildJs from '@hidoo/gulp-task-build-js-browserify';

/**
 * import modules - local
 */
import * as config from '../config';

// define main task
export const main = buildJs({
  name: 'js:main',
  src: `${config.path.srcJs}/main.js`,
  dest: `${config.path.destJs}`,
  filename: 'main.js',
  compress: config.compress
});

// define watch task
export const watch = () => {
  gulp.watch(
    [
      `${config.path.srcJs}/**/*.js`
    ],
    main
  );
};
