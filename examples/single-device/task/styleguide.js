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
const pathToCss = relative(config.path.destStyleguide, config.path.destCss);

/**
 * relative path from styleguide to js
 * @type {String}
 */
const pathToJs = relative(config.path.destStyleguide, config.path.destJs);

// define build task
export const build = buildStyleguide({
  name: 'styleguide:build',
  src: `${config.path.srcStyleguide}`,
  dest: `${config.path.destStyleguide}`,
  css: [`${pathToCss}/main.css`],
  js: [`${pathToJs}/main.js`]
});

// define prebuild task
export const prebuild = copy({
  name: 'styleguide:prebuild',
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

