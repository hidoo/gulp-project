/**
 * import modules
 */
import {relative} from 'path';
import gulp from 'gulp';
import buildStyleguide from '@hidoo/gulp-task-build-styleguide-kss';
import copy from '@hidoo/gulp-task-copy';

/**
 * import modules - local
 */
import * as config from '../config';

/**
 * relative path from styleguide to css
 * @type {String}
 */
const fromStyleguideToCss = relative(config.path.destStyleguide, config.path.destCss);

/**
 * relative path from styleguide to js
 * @type {String}
 */
const fromStyleguideToJs = relative(config.path.destStyleguide, config.path.destJs);

// define build task
export const build = buildStyleguide({
  src: `${config.path.srcStyleguide}`,
  dest: `${config.path.destStyleguide}`,
  css: [`${fromStyleguideToCss}/main.css`],
  js: [`${fromStyleguideToJs}/main.js`],
  compress: config.compress
});

// define prebuild task
export const prebuild = copy({
  src: `${config.path.srcCss}/*.md`,
  dest: config.path.srcStyleguide
});

// define main task
export const main = gulp.series(
  prebuild,
  build
);

// define watch task
export const watch = () => {
  gulp.watch(
    [
      `${config.path.srcCss}/*.md`,
      `${config.path.srcStyleguide}/*.css`
    ],
    main
  );
};
