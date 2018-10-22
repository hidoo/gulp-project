/* eslint max-len: 0, no-magic-numbers: 0 */

import assert from 'assert';
import fs from 'fs';
import rimraf from 'rimraf';
import sizeOf from 'image-size';
import pixelmatch from 'pixelmatch';
import imagemin from 'gulp-imagemin';
import optimizeImage, {gifsicle, jpegtran, optipng, svgo} from '../src';

describe('gulp-task-optimize-image', () => {
  const path = {
    src: `${__dirname}/fixtures/src`,
    dest: `${__dirname}/fixtures/dest`,
    expected: `${__dirname}/fixtures/expected`
  };

  afterEach((done) =>
    rimraf(`${path.dest}/*.{jpg,jpeg,png,gif,svg,svg.gz,ico}`, done)
  );

  it('should out to "options.dest" if argument "options.src" is set.', (done) => {
    const task = optimizeImage({
      src: `${path.src}/sample.{jpg,jpeg,png,gif,svg,ico}`,
      dest: path.dest
    });

    task().on('finish', () => {
      ['jpg', 'png', 'gif', 'svg', 'ico'].forEach((ext) => {
        const actual = fs.readFileSync(`${path.dest}/sample.${ext}`, {encode: null}),
              expected = fs.readFileSync(`${path.expected}/sample.${ext}`, {encode: null}),
              {width, height} = sizeOf(actual),
              countDiffPixels = pixelmatch(actual, expected, null, width, height, {threshold: 0.1});

        assert(actual);
        assert(countDiffPixels === 0);
      });
      done();
    });
  });

  it('should out evenized files to "options.dest" if argument "options.evenize" is true.', (done) => {
    const cases = [
            ['10x9', 'jpg', [10, 10]],
            ['9x10', 'png', [10, 10]],
            ['9x9', 'gif', [10, 10]]
          ],
          task = optimizeImage({
            src: `${path.src}/{${cases.map(([basename, ext]) => `${basename}.${ext}`).join(',')}}`,
            dest: path.dest,
            evenize: true
          });

    task().on('finish', () => {
      cases.forEach(([basename, ext, [width, height]]) => {
        const actual = fs.readFileSync(`${path.dest}/${basename}.${ext}`, {encode: null}),
              expected = fs.readFileSync(`${path.expected}/${basename}.evenized.${ext}`, {encode: null}),
              dimentions = sizeOf(expected),
              countDiffPixels = pixelmatch(actual, expected, null, width, height, {threshold: 0.1});

        assert(dimentions.width === width);
        assert(dimentions.height === height);
        assert(countDiffPixels === 0);
      });
      done();
    });
  });

  it('should out placeholder images to "options.dest" if argument "options.placeholder" is true.', (done) => {
    const cases = [
            ['10x9', 'jpg'],
            ['9x10', 'png'],
            ['9x9', 'gif'],
            ['sample', 'svg']
          ],
          task = optimizeImage({
            src: `${path.src}/{${cases.map(([basename, ext]) => `${basename}.${ext}`).join(',')}}`,
            dest: path.dest,
            placeholder: true
          });

    task().on('finish', () => {
      cases.forEach(([basename, ext]) => {
        const actual = fs.readFileSync(`${path.dest}/${basename}.${ext}`, {encode: null}),
              placeholder = fs.readFileSync(`${path.dest}/${basename}.placeholder.png`, {encode: null}),
              expected = fs.readFileSync(`${path.expected}/${basename}.original.${ext}`, {encode: null}),
              placeholderExpected = fs.readFileSync(`${path.expected}/${basename}.placeholder.png`, {encode: null}),
              dimentions = sizeOf(expected),
              placeholderDimentions = sizeOf(placeholder),
              countDiffPixels = pixelmatch(actual, expected, null, dimentions.width, dimentions.height, {threshold: 0.1}),
              placeholderCountDiffPixels = pixelmatch(placeholder, placeholderExpected, null, placeholderDimentions.width, placeholderDimentions.height, {threshold: 0.1});

        assert(placeholderDimentions.width === dimentions.width);
        assert(placeholderDimentions.height === dimentions.height);
        assert(countDiffPixels === 0);
        assert(placeholderCountDiffPixels === 0);
      });
      done();
    });
  });

  it('should out compressed files to "options.dest" if argument "options.compress" is true.', (done) => {
    const task = optimizeImage({
      src: `${path.src}/sample.{jpg,jpeg,png,gif,svg,ico}`,
      dest: path.dest,
      compress: true
    });

    task().on('finish', () => {
      ['jpg', 'png', 'gif', 'svg'].forEach((ext) => {
        const actual = fs.readFileSync(`${path.dest}/sample.${ext}`, {encode: null});

        if (ext === 'ico') {
          const expected = fs.readFileSync(`${path.expected}/sample.${ext}`, {encode: null});

          assert(actual);
          assert.deepEqual(actual, expected);
        }
        else {
          const expected = fs.readFileSync(`${path.expected}/sample.compressed.${ext}`, {encode: null});

          assert(actual);
          assert.deepEqual(actual, expected);
        }
      });
      done();
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
