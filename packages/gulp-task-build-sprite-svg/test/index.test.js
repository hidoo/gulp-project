/* eslint max-len: 0, no-magic-numbers: 0 */

import assert from 'assert';
import fs from 'fs';
import rimraf from 'rimraf';
import imagemin from 'gulp-imagemin';
import buildSprite, {svgo} from '../src';

describe('gulp-task-build-sprite-svg', () => {
  const path = {
    src: `${__dirname}/fixtures/src`,
    dest: `${__dirname}/fixtures/dest`,
    expected: `${__dirname}/fixtures/expected`
  };

  afterEach((done) => {
    rimraf(`${path.dest}/*.{svg,css,scss,styl,gz}`, done);
  });

  it('should output files to "options.destXxx" if argument "options" is minimal settings.', (done) => {
    const task = buildSprite({
      src: `${path.src}/**/sample-*.svg`,
      destImg: `${path.dest}`,
      destCss: `${path.dest}`,
      imgName: 'svg-sprite.svg',
      cssName: 'svg-sprite.styl',
      imgPath: './svg-sprite.svg'
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
      compress: true
    });

    task().on('finish', () => {
      const actualSvg = fs.readFileSync(`${path.dest}/svg-sprite.svg`),
            actualSvgGzip = fs.readFileSync(`${path.dest}/svg-sprite.svg.gz`),
            actualCss = fs.readFileSync(`${path.dest}/svg-sprite.styl`),
            expectedSvg = fs.readFileSync(`${path.expected}/svg-sprite.compressed.svg`),
            expectedCss = fs.readFileSync(`${path.expected}/svg-sprite.compressed.styl`);

      assert(actualSvg);
      assert(actualSvgGzip);
      assert(actualCss);
      assert.deepStrictEqual(actualSvg.toString().trim(), expectedSvg.toString().trim());
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
      imgPath: './svg-sprite.svg?version=0.0.0'
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

  it('should output file that "scss" format to "options.destCss" if argument "options.cssPreprocessor" is "sass".', (done) => {
    const task = buildSprite({
      src: `${path.src}/**/sample-*.svg`,
      destImg: `${path.dest}`,
      destCss: `${path.dest}`,
      imgName: 'svg-sprite.svg',
      cssName: 'svg-sprite.scss',
      imgPath: './svg-sprite.svg',
      cssPreprocessor: 'sass'
    });

    task().on('finish', () => {
      const actualSvg = fs.readFileSync(`${path.dest}/svg-sprite.svg`),
            actualCss = fs.readFileSync(`${path.dest}/svg-sprite.scss`),
            expectedSvg = fs.readFileSync(`${path.expected}/svg-sprite.svg`),
            expectedCss = fs.readFileSync(`${path.expected}/svg-sprite.scss`);

      assert(actualSvg);
      assert(actualCss);
      assert.deepStrictEqual(actualSvg.toString().trim(), expectedSvg.toString().trim());
      assert.deepStrictEqual(actualCss.toString().trim(), expectedCss.toString().trim());
      done();
    });
  });

  it('should output file that specified format to "options.destCss" if argument "options.cssTemplate" is set. (ignore "options.cssPreprocessor")', (done) => {
    const task = buildSprite({
      src: `${path.src}/**/sample-*.svg`,
      destImg: `${path.dest}`,
      destCss: `${path.dest}`,
      imgName: 'svg-sprite.svg',
      cssName: 'svg-sprite.css',
      imgPath: './svg-sprite.svg',
      cssPreprocessor: 'stylus',
      cssTemplate: `${path.src}/custom-template.hbs`
    });

    task().on('finish', () => {
      const actualSvg = fs.readFileSync(`${path.dest}/svg-sprite.svg`),
            actualCss = fs.readFileSync(`${path.dest}/svg-sprite.css`),
            expectedSvg = fs.readFileSync(`${path.expected}/svg-sprite.svg`),
            expectedCss = fs.readFileSync(`${path.expected}/svg-sprite.css`);

      assert(actualSvg);
      assert(actualCss);
      assert.deepStrictEqual(actualSvg.toString().trim(), expectedSvg.toString().trim());
      assert.deepStrictEqual(actualCss.toString().trim(), expectedCss.toString().trim());
      done();
    });
  });

  describe('exports imagemin plugins', () => {

    it('should be accessible to imagemin plugins', () => {
      assert(imagemin.svgo === svgo);
    });
  });

});
