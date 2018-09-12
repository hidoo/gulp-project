/**
 * import modules
 */
import {relative} from 'path';
import gulp from 'gulp';
import buildSprite from '@hidoo/gulp-task-build-sprite-image';

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
const fromCssToSprite = relative(config.path.destCss, config.path.destSprite);

// define main task
export const main = buildSprite({
  src: `${config.path.srcSprite}/**/sample-*.png`,
  destImg: `${config.path.destSprite}`,
  destCss: `${config.path.srcCss}`,
  imgName: 'sample.png',
  cssName: '_sprite_sample.styl',
  imgPath: `${fromCssToSprite}/sample.png${cacheParameter}`,
  evenize: false,
  compress: config.compress
});

// define watch task
export const watch = () => {
  gulp.watch(
    [
      `${config.path.srcSprite}/**/sample-*.png`
    ],
    main
  );
};
