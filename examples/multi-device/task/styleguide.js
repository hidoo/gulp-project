import {relative} from 'node:path';
import gulp from 'gulp';
import buildStyleguide from '@hidoo/gulp-task-build-styleguide-kss';
import * as config from '../config.js';

/**
 * relative path from styleguide to css
 *
 * @type {String}
 */
const pathToCssDesktop = relative(
  config.path.destStyleguideDesktop,
  config.path.destCssDesktop
);
const pathToCssMobile = relative(
  config.path.destStyleguideMobile,
  config.path.destCssMobile
);

/**
 * relative path from styleguide to js
 *
 * @type {String}
 */
const pathToJsDesktop = relative(
  config.path.destStyleguideDesktop,
  config.path.destJsDesktop
);
const pathToJsMobile = relative(
  config.path.destStyleguideMobile,
  config.path.destJsMobile
);

// define main task
const mainDesktop = buildStyleguide({
  name: 'styleguide:desktop:build',
  src: `${config.path.srcStyleguideDesktop}`,
  dest: `${config.path.destStyleguideDesktop}`,
  css: [`${pathToCssDesktop}/main.css`],
  js: [`${pathToJsDesktop}/main.js`],
  homepage: `${config.path.srcCssDesktop}/README.md`
});
const mainMobile = buildStyleguide({
  name: 'styleguide:mobile:build',
  src: `${config.path.srcStyleguideMobile}`,
  dest: `${config.path.destStyleguideMobile}`,
  css: [`${pathToCssMobile}/main.css`],
  js: [`${pathToJsMobile}/main.js`],
  homepage: `${config.path.srcCssMobile}/README.md`
});

// define watch task
const watchDesktop = () => {
  gulp.watch(
    [
      `${config.path.srcCssDesktop}/*.md`,
      `${config.path.srcStyleguideDesktop}/*.css`
    ],
    mainDesktop
  );
};
const watchMobile = () => {
  gulp.watch(
    [
      `${config.path.srcCssMobile}/*.md`,
      `${config.path.srcStyleguideMobile}/*.css`
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

