import { relative } from 'node:path';
import gulp from 'gulp';
import buildStyleguide from '@hidoo/gulp-task-build-styleguide-kss';
import * as config from '../config.js';

/**
 * relative path from styleguide to css
 *
 * @type {String}
 */
const pathToCss = relative(config.path.destStyleguide, config.path.destCss);

/**
 * relative path from styleguide to js
 *
 * @type {String}
 */
const pathToJs = relative(config.path.destStyleguide, config.path.destJs);

// define main task
export const main = buildStyleguide({
  name: 'styleguide:build',
  src: `${config.path.srcStyleguide}`,
  dest: `${config.path.destStyleguide}`,
  css: [`${pathToCss}/main.css`],
  js: [`${pathToJs}/main.js`],
  homepage: `${config.path.srcCss}/README.md`
});

// define watch task
export const watch = () => {
  gulp.watch(
    [`${config.path.srcCss}/*.md`, `${config.path.srcStyleguide}/*.css`],
    main
  );
};
