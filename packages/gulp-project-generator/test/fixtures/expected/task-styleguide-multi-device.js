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
const pathToCssDesktop = relative(config.path.destStyleguideDesktop, config.path.destCssDesktop); // eslint-disable-line max-len
const pathToCssMobile = relative(config.path.destStyleguideMobile, config.path.destCssMobile); // eslint-disable-line max-len

/**
 * relative path from styleguide to js
 * @type {String}
 */
const pathToJsDesktop = relative(config.path.destStyleguideDesktop, config.path.destJsDesktop); // eslint-disable-line max-len
const pathToJsMobile = relative(config.path.destStyleguideMobile, config.path.destJsMobile); // eslint-disable-line max-len

// define build task
const buildDesktop = buildStyleguide({
  name: 'styleguide:desktop:build',
  src: `${config.path.srcStyleguideDesktop}`,
  dest: `${config.path.destStyleguideDesktop}`,
  css: [`${pathToCssDesktop}/main.css`],
  js: [`${pathToJsDesktop}/main.js`]
});
const buildMobile = buildStyleguide({
  name: 'styleguide:mobile:build',
  src: `${config.path.srcStyleguideMobile}`,
  dest: `${config.path.destStyleguideMobile}`,
  css: [`${pathToCssMobile}/main.css`],
  js: [`${pathToJsMobile}/main.js`]
});

// define prebuild task
const prebuildDesktop = copy({
  name: 'styleguide:desktop:prebuild',
  src: `${config.path.srcCssDesktop}/*.md`,
  dest: config.path.srcStyleguideDesktop
});
const prebuildMobile = copy({
  name: 'styleguide:mobile:prebuild',
  src: `${config.path.srcCssMobile}/*.md`,
  dest: config.path.srcStyleguideMobile
});

// define main task
const mainDesktop = gulp.series(
  prebuildDesktop,
  buildDesktop
);
const mainMobile = gulp.series(
  prebuildMobile,
  buildMobile
);

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
