import gulp from 'gulp';
import buildHtml from '@hidoo/gulp-task-build-html-handlebars';
import * as config from '../config.js';

// define main task
const mainDesktop = buildHtml({
  name: 'html:desktop:main',
  src: `${config.path.srcHtmlDesktop}/**/*.hbs`,
  dest: `${config.path.destHtmlDesktop}`,
  partials: `${config.path.srcHtml}/partials/**/*.hbs`,
  layouts: `${config.path.srcHtml}/layouts/**/*.hbs`,
  data: `${config.path.srcData}/**/*.{yaml,yml,json}`,
  compress: config.compress
});
const mainMobile = buildHtml({
  name: 'html:mobile:main',
  src: `${config.path.srcHtmlMobile}/**/*.hbs`,
  dest: `${config.path.destHtmlMobile}`,
  partials: `${config.path.srcHtml}/partials/**/*.hbs`,
  layouts: `${config.path.srcHtml}/layouts/**/*.hbs`,
  data: `${config.path.srcData}/**/*.{yaml,yml,json}`,
  compress: config.compress
});

// define watch task
const watchDesktop = () => {
  gulp.watch(
    [
      `${config.path.srcHtmlDesktop}/pages/**/*.hbs`,
      `${config.path.srcHtml}/layouts/**/*.hbs`,
      `${config.path.srcHtml}/partials/**/*.hbs`,
      `${config.path.srcData}/**/*.{yaml,yml,json}`
    ],
    mainDesktop
  );
};
const watchMobile = () => {
  gulp.watch(
    [
      `${config.path.srcHtmlMobile}/pages/**/*.hbs`,
      `${config.path.srcHtml}/layouts/**/*.hbs`,
      `${config.path.srcHtml}/partials/**/*.hbs`,
      `${config.path.srcData}/**/*.{yaml,yml,json}`
    ],
    mainMobile
  );
};

// export tasks
export const desktop = {
  main: mainDesktop,
  watch: watchDesktop
};
export const mobile = {
  main: mainMobile,
  watch: watchMobile
};
