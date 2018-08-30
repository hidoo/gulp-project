/**
 * import modules
 */
import {relative} from 'path';
import gulp from 'gulp';
import buildImageSprite from '@hidoo/gulp-task-build-sprite-image';
import buildSvgSprite from '@hidoo/gulp-task-build-sprite-svg';

/**
 * import modules - local
 */
import {path, pkg, compress} from '../config';

/**
 * url parameter for browser cache
 * @type {String}
 */
const cacheParameter = process.env.NODE_ENV === 'development' ? // eslint-disable-line no-process-env
  '' : `?version=${pkg.version}`;

/**
 * relative path to sprite from css
 * @type {String}
 */
const pathToSpriteFromCss = relative(path.destCss, path.destSprite);

/**
 * define tasks
 */
export const image = buildImageSprite({
  src: `${path.srcSprite}/**/sample-*.png`,
  destImg: `${path.destSprite}`,
  destCss: `${path.srcCss}`,
  imgName: 'sample.png',
  cssName: '_sprite_sample.styl',
  imgPath: `${pathToSpriteFromCss}/sample.png${cacheParameter}`,
  evenize: false,
  compress
});
export const svg = buildSvgSprite({
  src: `${path.srcSprite}/**/sample-*.svg`,
  destImg: `${path.destSprite}`,
  destCss: `${path.srcCss}`,
  imgName: 'sample.svg',
  cssName: '_sprite_svg_sample.styl',
  imgPath: `${pathToSpriteFromCss}/sample.svg${cacheParameter}`,
  evenize: false,
  compress
});
export const main = gulp.parallel(image, svg);
export const watch = () => {
  gulp.watch(`${path.srcSprite}/**/sample-*.png`, image);
  gulp.watch(`${path.srcSprite}/**/sample-*.png`, svg);
};
