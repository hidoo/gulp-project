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
import {path, compress} from '../config';

/**
 * relative path to css or js from styleguide
 * @type {String}
 */
const pathToCssFromStyleguide = relative(path.destStyleguide, path.destCss),
      pathToJsFromStyleguide = relative(path.destStyleguide, path.destJs);

/**
 * define tasks
 */
export const build = buildStyleguide({
  src: `${path.srcStyleguide}`,
  dest: `${path.destStyleguide}`,
  css: [`${pathToCssFromStyleguide}/main.css`],
  js: [`${pathToJsFromStyleguide}/main.browserify.js`],
  compress
});
export const prebuild = copy({
  src: `${path.srcCss}/*.md`,
  dest: path.srcStyleguide
});
export const main = gulp.series(
  prebuild,
  build
);
export const watch = () => {
  gulp.watch([
    `${path.srcCss}/*.md`,
    `${path.srcStyleguide}/*.css`
  ], main);
};
