import {relative} from 'node:path';
import gulp from 'gulp';
import buildSprite from '@hidoo/gulp-task-build-sprite-svg';
import * as config from '../config.js';

/**
 * url parameter for browser cache
 *
 * @type {String}
 */
const cacheParameter = process.env.NODE_ENV === 'development' ? // eslint-disable-line node/no-process-env
  '' : `?version=${config.pkg.version}`;

/**
 * relative path from css to sprite
 *
 * @type {String}
 */
const pathToSpriteDesktop = relative(
  config.path.destCssDesktop,
  config.path.destSpriteDesktop
);
const pathToSpriteMobile = relative(
  config.path.destCssMobile,
  config.path.destSpriteMobile
);

/**
 * return merged build options for desktop
 *
 * @param {Object} options build task options
 * @return {Object}
 */
function buildDesktopOptions(options = {}) {
  return {
    ...options,
    destImg: config.path.destSpriteDesktop,
    destCss: config.path.srcCssDesktop,
    imgPath: `${pathToSpriteDesktop}/${options.imgName}${cacheParameter}`,
    cssPreprocessor: 'stylus',
    compress: config.compress
  };
}

/**
 * return merged build options for mobile
 *
 * @param {Object} options build task options
 * @return {Object}
 */
function buildMobileOptions(options = {}) {
  return {
    ...options,
    destImg: config.path.destSpriteMobile,
    destCss: config.path.srcCssMobile,
    imgPath: `${pathToSpriteMobile}/${options.imgName}${cacheParameter}`,
    cssPreprocessor: 'stylus',
    compress: config.compress
  };
}

// define main task
const mainDesktop = buildSprite(buildDesktopOptions({
  name: 'sprite:desktop:main',
  src: `${config.path.srcSpriteDesktop}/**/sample-*.svg`,
  imgName: 'sample.svg',
  cssName: '_sprite_sample.styl'
}));
const mainMobile = buildSprite(buildMobileOptions({
  name: 'sprite:mobile:main',
  src: `${config.path.srcSpriteMobile}/**/sample-*.svg`,
  imgName: 'sample.svg',
  cssName: '_sprite_sample.styl'
}));

// define watch task
const watchDesktop = () => {
  gulp.watch(
    [
      `${config.path.srcSpriteDesktop}/**/sample-*.svg`
    ],
    mainDesktop
  );
};
const watchMobile = () => {
  gulp.watch(
    [
      `${config.path.srcSpriteMobile}/**/sample-*.svg`
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

