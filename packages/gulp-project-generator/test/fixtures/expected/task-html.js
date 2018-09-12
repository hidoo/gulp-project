/**
 * import modules
 */
import gulp from 'gulp';
import buildHtml from '@hidoo/gulp-task-build-html-handlebars';

/**
 * import modules - local
 */
import * as config from '../config';

// define main task
export const main = buildHtml({
  src: `${config.path.srcHtml}/pages/**/*.hbs`,
  dest: `${config.path.destHtml}`,
  partials: `${config.path.srcHtml}/partials/**/*.hbs`,
  layouts: `${config.path.srcHtml}/layouts/**/*.hbs`,
  data: `${config.path.srcData}/**/*.{yaml,yml,json}`,
  compress: config.compress
});

// define watch task
export const watch = () => {
  gulp.watch(
    [
      `${config.path.srcHtml}/pages/**/*.hbs`,
      `${config.path.srcHtml}/layouts/**/*.hbs`,
      `${config.path.srcHtml}/partials/**/*.hbs`,
      `${config.path.srcData}/**/*.{yaml,yml,json}`
    ],
    main
  );
};
