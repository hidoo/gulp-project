/* eslint max-len: 0, no-magic-numbers: 0 */

import assert from 'node:assert';
import fs from 'node:fs';
import {dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import sizeOf from 'image-size';
import pixelmatch from 'pixelmatch';
import getPixels from 'get-pixels';
import FileType from 'file-type';
import imagemin from 'gulp-imagemin';
import buildSprite, {gifsicle, mozjpeg, optipng, svgo} from '../src/index.js';

/**
 * get array of uint8array from buffers
 *
 * @param {Buffer} buffers array of buffer of image
 * @return {Promise}
 */
function getUint8ArraysFromBuffers(buffers) {
  return Promise.all(
    buffers.map((buffer) => FileType.fromBuffer(buffer)
      .then(({mime}) => new Promise((done, reject) => {
        getPixels(buffer, mime, (error, pixels) => {
          if (error) {
            return reject(error);
          }
          return done(pixels.data);
        });
      })))
  );
}

/**
 * compare pixels
 *
 * @param {Array} params array of parameter
 * @return {Promise}
 */
function comparePixels(params) {
  return Promise.all(params.map(([actualBuffer, expectedBuffer, width, height]) => new Promise(
    (done, reject) => getUint8ArraysFromBuffers([actualBuffer, expectedBuffer])
      .then((pixels) => {
        const [actualPixels, expectedPixels] = pixels,
              countDiffPixels = pixelmatch(
                actualPixels,
                expectedPixels,
                null,
                width,
                height,
                {threshold: 0.1}
              );

        assert(countDiffPixels === 0);
        return done();
      })
      .catch((error) => reject(error))
  )));
}

describe('gulp-task-build-sprite-image', () => {
  const __dirname = dirname(fileURLToPath(import.meta.url));
  const path = {
    src: `${__dirname}/fixtures/src`,
    dest: `${__dirname}/fixtures/dest`,
    expected: `${__dirname}/fixtures/expected`
  };

  afterEach((done) => {
    fs.rm(
      path.dest,
      {recursive: true},
      () => fs.mkdir(path.dest, done)
    );
  });

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

  it('should output file that "scss" format to "options.destCss" if argument "options.cssPreprocessor" is "sass".', (done) => {
    const task = buildSprite({
      src: `${path.src}/**/sample-*.png`,
      destImg: `${path.dest}`,
      destCss: `${path.dest}`,
      imgName: 'image-sprite.png',
      cssName: 'image-sprite.scss',
      imgPath: './image-sprite.png',
      cssPreprocessor: 'sass'
    });

    task().on('finish', () => {
      const actualImage = fs.readFileSync(`${path.dest}/image-sprite.png`),
            actualCss = fs.readFileSync(`${path.dest}/image-sprite.scss`),
            expectedImage = fs.readFileSync(`${path.expected}/image-sprite.png`),
            expectedCss = fs.readFileSync(`${path.expected}/image-sprite.scss`),
            {width, height} = sizeOf(expectedImage);

      assert(actualImage);
      assert(actualCss);
      assert.equal(String(actualCss), String(expectedCss));
      comparePixels([[actualImage, expectedImage, width, height]])
        .then(() => done(null))
        .catch((error) => done(error));
    });
  });

  it('should output file that "scss" format to "options.destCss" if argument "options.cssPreprocessor" is "sass:module".', (done) => {
    const task = buildSprite({
      src: `${path.src}/**/sample-*.png`,
      destImg: `${path.dest}`,
      destCss: `${path.dest}`,
      imgName: 'image-sprite.png',
      cssName: 'image-sprite.scss',
      imgPath: './image-sprite.png',
      cssPreprocessor: 'sass:module'
    });

    task().on('finish', () => {
      const actualImage = fs.readFileSync(`${path.dest}/image-sprite.png`),
            actualCss = fs.readFileSync(`${path.dest}/image-sprite.scss`),
            expectedImage = fs.readFileSync(`${path.expected}/image-sprite.png`),
            expectedCss = fs.readFileSync(`${path.expected}/image-sprite-module.scss`),
            {width, height} = sizeOf(expectedImage);

      assert(actualImage);
      assert(actualCss);
      assert.equal(String(actualCss), String(expectedCss));
      comparePixels([[actualImage, expectedImage, width, height]])
        .then(() => done(null))
        .catch((error) => done(error));
    });
  });

  it('should output file that specified format to "options.destCss" if argument "options.cssTemplate" is set. (ignore "options.cssPreprocessor")', (done) => {
    const task = buildSprite({
      src: `${path.src}/**/sample-*.png`,
      destImg: `${path.dest}`,
      destCss: `${path.dest}`,
      imgName: 'image-sprite.png',
      cssName: 'image-sprite.css',
      imgPath: './image-sprite.png',
      cssPreprocessor: 'stylus',
      cssTemplate: `${path.src}/custom-template.hbs`
    });

    task().on('finish', () => {
      const actualImage = fs.readFileSync(`${path.dest}/image-sprite.png`),
            actualCss = fs.readFileSync(`${path.dest}/image-sprite.css`),
            expectedImage = fs.readFileSync(`${path.expected}/image-sprite.png`),
            expectedCss = fs.readFileSync(`${path.expected}/image-sprite.css`),
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
      assert(imagemin.mozjpeg === mozjpeg);
      assert(imagemin.optipng === optipng);
      assert(imagemin.svgo === svgo);
    });
  });

});
