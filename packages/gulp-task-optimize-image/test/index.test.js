/* eslint max-len: 0, no-magic-numbers: 0 */

import assert from 'assert';
import fs from 'fs';
import rimraf from 'rimraf';
import sizeOf from 'image-size';
import optimizeImage from '../src';

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
              expected = fs.readFileSync(`${path.expected}/sample.${ext}`, {encode: null});

        assert(actual);
        assert.deepEqual(actual, expected);
      });
      done();
    });
  });

  it('should out evenized files to "options.dest" if argument "options.evenize" is true.', (done) => {
    const cases = [
            ['10x9.jpg', [10, 10]],
            ['9x10.png', [10, 10]],
            ['9x9.gif', [10, 10]]
          ],
          task = optimizeImage({
            src: `${path.src}/{${cases.map(([file]) => file).join(',')}}`,
            dest: path.dest,
            evenize: true
          });

    task().on('finish', () => {
      cases.forEach(([file, [width, height]]) => {
        const actual = sizeOf(`${path.dest}/${file}`);

        assert(actual.width === width);
        assert(actual.height === height);
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

});
