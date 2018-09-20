/**
 * import modules
 */
import {relative} from 'path';
import gulp from 'gulp';
import buildSprite from '@hidoo/gulp-task-build-sprite-svg';

/**
 * import modules - local
 */
import * as config from '../config';

/**
 * url parameter for browser cache
 * @type {String}
 */
const cacheParameter = process.env.NODE_ENV === 'development' ? // eslint-disable-line no-process-env
  '' : `?version=${config.pkg.version}`;

/**
 * relative path from css to sprite
 * @type {String}
 */
const pathToSpriteDesktop = relative(config.path.destCssDesktop, config.path.destSpriteDesktop); // eslint-disable-line max-len
const pathToSpriteMobile = relative(config.path.destCssMobile, config.path.destSpriteMobile); // eslint-disable-line max-len

// define main task
const mainDesktop = buildSprite({
  name: 'sprite:desktop:main',
  src: `${config.path.srcSpriteDesktop}/**/sample-*.svg`,
  destImg: `${config.path.destSpriteDesktop}`,
  destCss: `${config.path.srcCssDesktop}`,
  imgName: 'sample.svg',
  cssName: '_sprite_sample.styl',
  imgPath: `${pathToSpriteDesktop}/sample.svg${cacheParameter}`,
  compress: config.compress
});
const mainMobile = buildSprite({
  name: 'sprite:mobile:main',
  src: `${config.path.srcSpriteMobile}/**/sample-*.svg`,
  destImg: `${config.path.destSpriteMobile}`,
  destCss: `${config.path.srcCssMobile}`,
  imgName: 'sample.svg',
  cssName: '_sprite_sample.styl',
  imgPath: `${pathToSpriteMobile}/sample.svg${cacheParameter}`,
  compress: config.compress
});

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

