/* eslint max-len: 0, no-magic-numbers: 0 */

import assert from 'assert';
import fs from 'fs';
import rimraf from 'rimraf';
import sizeOf from 'image-size';
import pixelmatch from 'pixelmatch';
import getPixels from 'get-pixels';
import fileType from 'file-type';
import imagemin from 'gulp-imagemin';
import buildSprite, {gifsicle, jpegtran, optipng, svgo} from '../src';

/**
 * get array of uint8array from buffers
 * @param {Array<Buffer>} buffers array of buffer of image
 * @return {Promise}
 */
function getUint8ArraysFromBuffers(buffers) {
  return Promise.all(buffers.map((buffer) => new Promise((resolve, reject) => {
    const {mime} = fileType(buffer);

    getPixels(buffer, mime, (error, pixels) => {
      if (error) {
        return reject(error);
      }
      return resolve(pixels.data);
    });
  })));
}

/**
 * compare pixels
 * @param {Array} params array of parameter
 * @return {Promise}
 */
function comparePixels(params) {
  return Promise.all(params.map(([actualBuffer, expectedBuffer, width, height]) => new Promise((resolve, reject) =>
    getUint8ArraysFromBuffers([actualBuffer, expectedBuffer])
      .then((pixels) => {
        const [actualPixels, expectedPixels] = pixels,
              countDiffPixels = pixelmatch(
                actualPixels,
                expectedPixels,
                null,
                width, height, {threshold: 0.1}
              );

        assert(countDiffPixels === 0);
        return resolve();
      })
      .catch((error) => reject(error))
  )));
}

describe('gulp-task-build-sprite-image', () => {
  const path = {
    src: `${__dirname}/fixtures/src`,
    dest: `${__dirname}/fixtures/dest`,
    expected: `${__dirname}/fixtures/expected`
  };

  afterEach((done) =>
    rimraf(`${path.dest}/*.{png,styl,gz}`, done)
  );

  it('should output files to "options.destXxx" if argument "options" is minimal settings.', (done) => {
    const task = buildSprite({
      src: `${path.src}/**/sample-*.png`,
      destImg: `${path.dest}`,
      destCss: `${path.dest}`,
      imgName: 'image-sprite.png',
      cssName: 'image-sprite.styl',
      imgPath: './image-sprite.png'
    });

    task().on('finish', () => {
      const actualImage = fs.readFileSync(`${path.dest}/image-sprite.png`),
            actualCss = fs.readFileSync(`${path.dest}/image-sprite.styl`),
            expectedImage = fs.readFileSync(`${path.expected}/image-sprite.png`),
            expectedCss = fs.readFileSync(`${path.expected}/image-sprite.styl`),
            {width, height} = sizeOf(expectedImage);

      assert(actualImage);
      assert(actualCss);
      assert.equal(String(actualCss), String(expectedCss));
      comparePixels([[actualImage, expectedImage, width, height]])
        .then(() => done(null))
        .catch((error) => done(error));
    });
  });

  it('should output evenized files to "options.destXxx" if argument "options.evenize" is true.', (done) => {
    const task = buildSprite({
      src: `${path.src}/**/sample-*.png`,
      destImg: `${path.dest}`,
      destCss: `${path.dest}`,
      imgName: 'image-sprite.png',
      cssName: 'image-sprite.styl',
      imgPath: './image-sprite.png',
      evenize: true
    });

    task().on('finish', () => {
      const actualImage = fs.readFileSync(`${path.dest}/image-sprite.png`),
            actualCss = fs.readFileSync(`${path.dest}/image-sprite.styl`),
            expectedImage = fs.readFileSync(`${path.expected}/image-sprite.evenized.png`),
            expectedCss = fs.readFileSync(`${path.expected}/image-sprite.evenized.styl`),
            {width, height} = sizeOf(expectedImage);

      assert(actualImage);
      assert(actualCss);
      assert.equal(String(actualCss), String(expectedCss));
      comparePixels([[actualImage, expectedImage, width, height]])
        .then(() => done(null))
        .catch((error) => done(error));
    });
  });

  it('should output compressed files to "options.destXxx" if argument "options.compress" is true.', (done) => {
    const task = buildSprite({
      src: `${path.src}/**/sample-*.png`,
      destImg: `${path.dest}`,
      destCss: `${path.dest}`,
      imgName: 'image-sprite.png',
      cssName: 'image-sprite.styl',
      imgPath: './image-sprite.png',
      compress: true
    });

    task().on('finish', () => {
      const actualImage = fs.readFileSync(`${path.dest}/image-sprite.png`),
            actualCss = fs.readFileSync(`${path.dest}/image-sprite.styl`),
            expectedImage = fs.readFileSync(`${path.expected}/image-sprite.compressed.png`),
            expectedCss = fs.readFileSync(`${path.expected}/image-sprite.compressed.styl`),
            {width, height} = sizeOf(expectedImage);

      assert(actualImage);
      assert(actualCss);
      assert.equal(String(actualCss), String(expectedCss));
      comparePixels([[actualImage, expectedImage, width, height]])
        .then(() => done(null))
        .catch((error) => done(error));
    });
  });

  it('should output files to "options.destXxx" if argument "options.imgPath" is pathname with parameters.', (done) => {
    const task = buildSprite({
      src: `${path.src}/**/sample-*.png`,
      destImg: `${path.dest}`,
      destCss: `${path.dest}`,
      imgName: 'image-sprite.png',
      cssName: 'image-sprite.styl',
      imgPath: './image-sprite.png?version=0.0.0'
    });

    task().on('finish', () => {
      const actualImage = fs.readFileSync(`${path.dest}/image-sprite.png`),
            actualCss = fs.readFileSync(`${path.dest}/image-sprite.styl`),
            expectedImage = fs.readFileSync(`${path.expected}/image-sprite.with-parameters.png`),
            expectedCss = fs.readFileSync(`${path.expected}/image-sprite.with-parameters.styl`),
            {width, height} = sizeOf(expectedImage);

      assert(actualImage);
      assert(actualCss);
      assert.equal(String(actualCss), String(expectedCss));
      comparePixels([[actualImage, expectedImage, width, height]])
        .then(() => done(null))
        .catch((error) => done(error));
    });
  });

  describe('exports imagemin plugins', () => {

    it('should be accessible to imagemin plugins', () => {
      assert(imagemin.gifsicle === gifsicle);
      assert(imagemin.jpegtran === jpegtran);
      assert(imagemin.optipng === optipng);
      assert(imagemin.svgo === svgo);
    });
  });

});
