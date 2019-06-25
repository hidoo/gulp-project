/**
 * import modules
 */
import gulp from 'gulp';
import buildJs from '@hidoo/gulp-task-build-js-browserify';
import {concatJs} from '@hidoo/gulp-task-concat';

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

// define dependency task
export const deps = concatJs({
  name: 'js:deps',
  src: [
    `${config.path.srcJs}/deps/sample-b.js`,
    `${config.path.srcJs}/deps/sample-a.js`
  ],
  dest: config.path.destJs,
  filename: 'bundle.js',
  compress: config.compress
});

// define watch task
export const watch = () => {
  gulp.watch(
    [
      `!${config.path.srcJs}/deps/*.js`,
      `${config.path.srcJs}/**/*.js`
    ],
    main
  );
  gulp.watch(
    [
      `${config.path.srcJs}/deps/*.js`
    ],
    deps
  );
};

