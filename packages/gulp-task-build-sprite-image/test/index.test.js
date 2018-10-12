/* eslint max-len: 0, no-magic-numbers: 0 */

import assert from 'assert';
import fs from 'fs';
import rimraf from 'rimraf';
import sizeOf from 'image-size';
import pixelmatch from 'pixelmatch';
import buildSprite from '../src';

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
            {width, height} = sizeOf(expectedImage),
            countDiffPixels = pixelmatch(actualImage, expectedImage, null, width, height, {threshold: 0.1});

      assert(actualImage);
      assert(actualCss);
      assert(countDiffPixels === 0);
      assert.equal(String(actualCss), String(expectedCss));
      done();
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
            {width, height} = sizeOf(expectedImage),
            countDiffPixels = pixelmatch(actualImage, expectedImage, null, width, height, {threshold: 0.1});

      assert(actualImage);
      assert(actualCss);
      assert(countDiffPixels === 0);
      assert.equal(String(actualCss), String(expectedCss));
      done();
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
            {width, height} = sizeOf(expectedImage),
            countDiffPixels = pixelmatch(actualImage, expectedImage, null, width, height, {threshold: 0.1});

      assert(actualImage);
      assert(actualCss);
      assert(countDiffPixels === 0);
      assert.equal(String(actualCss), String(expectedCss));
      done();
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
            {width, height} = sizeOf(expectedImage),
            countDiffPixels = pixelmatch(actualImage, expectedImage, null, width, height, {threshold: 0.1});

      assert(actualImage);
      assert(actualCss);
      assert(countDiffPixels === 0);
      assert.equal(String(actualCss), String(expectedCss));
      done();
    });
  });

});
