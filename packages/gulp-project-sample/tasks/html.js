/**
 * import modules
 */
import gulp from 'gulp';
import buildHtml from '@hidoo/gulp-task-build-html-handlebars';

/**
 * import modules - local
 */
import {path, compress} from '../config';

/**
 * define tasks
 */
export const main = buildHtml({
  src: `${path.srcHtml}/pages/**/*.hbs`,
  dest: `${path.destHtml}`,
  partials: `${path.srcHtml}/partials/**/*.hbs`,
  layouts: `${path.srcHtml}/layouts/**/*.hbs`,
  data: `${path.srcData}/**/*.{yaml,yml,json}`,
  compress
});
export const watch = () => {
  gulp.watch(
    [
      `${path.srcHtml}/pages/**/*.hbs`,
      `${path.srcHtml}/layouts/**/*.hbs`,
      `${path.srcHtml}/partials/**/*.hbs`,
      `${path.srcData}/**/*.{yaml,yml,json}`
    ],
    main
  );
};
