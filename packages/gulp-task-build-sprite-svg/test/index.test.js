/* eslint max-len: 0, no-magic-numbers: 0 */

import assert from 'assert';
import fs from 'fs';
import rimraf from 'rimraf';
import buildSprite from '../src';

describe('gulp-task-build-sprite-svg', () => {
  const path = {
    src: `${__dirname}/fixtures/src`,
    dest: `${__dirname}/fixtures/dest`,
    expected: `${__dirname}/fixtures/expected`
  };

  afterEach((done) =>
    rimraf(`${path.dest}/*.{svg,styl,gz}`, done)
  );

  it('should output files to "options.destXxx" if argument "options" is minimal settings.', (done) => {
    const task = buildSprite({
      src: `${path.src}/**/sample-*.svg`,
      destImg: `${path.dest}`,
      destCss: `${path.dest}`,
      imgName: 'svg-sprite.svg',
      cssName: 'svg-sprite.styl',
      imgPath: './svg-sprite.svg',
      verbose: false
    });

    task().on('finish', () => {
      const actualSvg = fs.readFileSync(`${path.dest}/svg-sprite.svg`),
            actualCss = fs.readFileSync(`${path.dest}/svg-sprite.styl`),
            expectedSvg = fs.readFileSync(`${path.expected}/svg-sprite.svg`),
            expectedCss = fs.readFileSync(`${path.expected}/svg-sprite.styl`);

      assert(actualSvg);
      assert(actualCss);
      assert.deepStrictEqual(actualSvg.toString().trim(), expectedSvg.toString().trim());
      assert.deepStrictEqual(actualCss.toString().trim(), expectedCss.toString().trim());
      done();
    });
  });

  it('should output compressed files to "options.destXxx" if argument "options.compress" is true.', (done) => {
    const task = buildSprite({
      src: `${path.src}/**/sample-*.svg`,
      destImg: `${path.dest}`,
      destCss: `${path.dest}`,
      imgName: 'svg-sprite.svg',
      cssName: 'svg-sprite.styl',
      imgPath: './svg-sprite.svg',
      compress: true,
      verbose: false
    });

    task().on('finish', () => {
      const actualSvg = fs.readFileSync(`${path.dest}/svg-sprite.svg`),
            actualSvgGzip = fs.readFileSync(`${path.dest}/svg-sprite.svg.gz`),
            actualCss = fs.readFileSync(`${path.dest}/svg-sprite.styl`),
            expectedSvg = fs.readFileSync(`${path.expected}/svg-sprite.compressed.svg`),
            expectedSvgGzip = fs.readFileSync(`${path.expected}/svg-sprite.compressed.svg.gz`),
            expectedCss = fs.readFileSync(`${path.expected}/svg-sprite.compressed.styl`);

      assert(actualSvg);
      assert(actualSvgGzip);
      assert(actualCss);
      assert.deepStrictEqual(actualSvg.toString().trim(), expectedSvg.toString().trim());
      assert.deepStrictEqual(actualSvgGzip, expectedSvgGzip);
      assert.deepStrictEqual(actualCss.toString().trim(), expectedCss.toString().trim());
      done();
    });
  });

  it('should output files to "options.destXxx" if argument "options.imgPath" is pathname with parameters.', (done) => {
    const task = buildSprite({
      src: `${path.src}/**/sample-*.svg`,
      destImg: `${path.dest}`,
      destCss: `${path.dest}`,
      imgName: 'svg-sprite.svg',
      cssName: 'svg-sprite.styl',
      imgPath: './svg-sprite.svg?version=0.0.0',
      verbose: false
    });

    task().on('finish', () => {
      const actualSvg = fs.readFileSync(`${path.dest}/svg-sprite.svg`),
            actualCss = fs.readFileSync(`${path.dest}/svg-sprite.styl`),
            expectedSvg = fs.readFileSync(`${path.expected}/svg-sprite.with-parameters.svg`),
            expectedCss = fs.readFileSync(`${path.expected}/svg-sprite.with-parameters.styl`);

      assert(actualSvg);
      assert(actualCss);
      assert.deepStrictEqual(actualSvg.toString().trim(), expectedSvg.toString().trim());
      assert.deepStrictEqual(actualCss.toString().trim(), expectedCss.toString().trim());
      done();
    });
  });

});
