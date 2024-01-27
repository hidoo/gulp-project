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
const pathToSprite = relative(config.path.destCss, config.path.destSprite);

/**
 * return merged build options
 *
 * @param {Object} options build task options
 * @return {Object}
 */
function buildOptions(options = {}) {
  return {
    ...options,
    destImg: config.path.destSprite,
    destCss: config.path.srcCss,
    imgPath: `${pathToSprite}/${options.imgName}${cacheParameter}`,
    cssPreprocessor: 'sass:module',
    compress: config.compress
  };
}

// define main task
export const main = buildSprite(buildOptions({
  name: 'sprite:main',
  src: `${config.path.srcSprite}/**/sample-*.svg`,
  imgName: 'sample.svg',
  cssName: '_sprite_sample.scss'
}));

// define watch task
export const watch = () => {
  gulp.watch(
    [
      `${config.path.srcSprite}/**/sample-*.svg`
    ],
    main
  );
};

