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
import optimizeImage, {gifsicle, mozjpeg, optipng, svgo} from '../src/index.js';

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

describe('gulp-task-optimize-image', () => {
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

  it('should out to "options.dest" if argument "options.src" is set.', (done) => {
    const cases = ['jpg', 'png', 'gif', 'svg', 'ico'],
          task = optimizeImage({
            src: `${path.src}/sample.{jpg,jpeg,png,gif,svg,ico}`,
            dest: path.dest
          });

    task().on('finish', () => {
      const promise = Promise.all(cases.map((ext) => new Promise((resolve, reject) => {
        const actual = fs.readFileSync(`${path.dest}/sample.${ext}`, {encode: null}),
              expected = fs.readFileSync(`${path.expected}/sample.${ext}`, {encode: null}),
              {width, height} = sizeOf(actual);

        assert(actual);
        if (ext === 'svg' || ext === 'ico') {
          assert.deepStrictEqual(actual, expected);
          resolve();
        }
        else {
          comparePixels([[actual, expected, width, height]])
            .then(resolve)
            .catch(reject);
        }
      })));

      promise
        .then(() => done(null))
        .catch((error) => done(error));
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
      const promise = Promise.all(cases.map(([basename, ext, [width, height]]) => new Promise((resolve, reject) => {
        const actual = fs.readFileSync(`${path.dest}/${basename}.${ext}`, {encode: null}),
              expected = fs.readFileSync(`${path.expected}/${basename}.evenized.${ext}`, {encode: null}),
              dimentions = sizeOf(expected);

        assert(dimentions.width === width);
        assert(dimentions.height === height);
        comparePixels([[actual, expected, width, height]])
          .then(resolve)
          .catch(reject);
      })));

      promise
        .then(() => done(null))
        .catch((error) => done(error));
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
      const promise = Promise.all(cases.map(([basename, ext]) => new Promise((resolve, reject) => {
        const actual = fs.readFileSync(`${path.dest}/${basename}.${ext}`, {encode: null}),
              placeholder = fs.readFileSync(`${path.dest}/${basename}.placeholder.png`, {encode: null}),
              expected = fs.readFileSync(`${path.expected}/${basename}.original.${ext}`, {encode: null}),
              placeholderExpected = fs.readFileSync(`${path.expected}/${basename}.placeholder.png`, {encode: null}),
              dimentions = sizeOf(expected),
              placeholderDimentions = sizeOf(placeholder);

        assert(placeholderDimentions.width === dimentions.width);
        assert(placeholderDimentions.height === dimentions.height);

        if (ext === 'svg') {
          assert.deepStrictEqual(actual, expected);
          resolve();
        }
        else {
          comparePixels([[actual, expected, dimentions.width, dimentions.height]])
            .then(() => comparePixels([[placeholder, placeholderExpected, placeholderDimentions.width, placeholderDimentions.height]]))
            .then(resolve)
            .catch(reject);
        }
      })));

      promise
        .then(() => done(null))
        .catch((error) => done(error));
    });
  });

  it('should out webp images to "options.dest" if argument "options.webp" is true.', (done) => {
    const cases = [
      ['10x9', 'jpg'],
      ['9x10', 'png'],
      ['9x9', 'gif'],
      ['sample', 'svg']
    ];
    const task = optimizeImage({
      src: `${path.src}/{${cases.map(([basename, ext]) => `${basename}.${ext}`).join(',')}}`,
      dest: path.dest,
      webp: true
    });

    task().on('finish', () => {
      const promise = Promise.all(cases.map(([basename, ext]) => new Promise((resolve) => {
        const actual = fs.readFileSync(`${path.dest}/${basename}.${ext}`, {encode: null});
        const expected = fs.readFileSync(`${path.expected}/${basename}.original.${ext}`, {encode: null});

        if (ext === 'svg') {
          assert.deepStrictEqual(actual, expected);
        }
        else {
          const webp = fs.readFileSync(`${path.dest}/${basename}.${ext}.webp`, {encode: null});
          const webpExpected = fs.readFileSync(`${path.expected}/${basename}.${ext}.webp`, {encode: null});

          assert.deepStrictEqual(actual, expected);
          assert.deepStrictEqual(webp, webpExpected);
        }
        resolve();
      })));

      promise
        .then(() => done(null))
        .catch((error) => done(error));
    });
  });

  it('should out webp images to "options.dest" if argument "options.webp" is object.', (done) => {
    const cases = [
      ['10x9', 'jpg'],
      ['9x10', 'png'],
      ['9x9', 'gif'],
      ['sample', 'svg']
    ];
    const task = optimizeImage({
      src: `${path.src}/{${cases.map(([basename, ext]) => `${basename}.${ext}`).join(',')}}`,
      dest: path.dest,
      webp: {keepExtname: false}
    });

    task().on('finish', () => {
      const promise = Promise.all(cases.map(([basename, ext]) => new Promise((resolve) => {
        const actual = fs.readFileSync(`${path.dest}/${basename}.${ext}`, {encode: null});
        const expected = fs.readFileSync(`${path.expected}/${basename}.original.${ext}`, {encode: null});

        if (ext === 'svg') {
          assert.deepStrictEqual(actual, expected);
        }
        else {
          const webp = fs.readFileSync(`${path.dest}/${basename}.webp`, {encode: null});
          const webpExpected = fs.readFileSync(`${path.expected}/${basename}.${ext}.webp`, {encode: null});

          assert.deepStrictEqual(actual, expected);
          assert.deepStrictEqual(webp, webpExpected);
        }
        resolve();
      })));

      promise
        .then(() => done(null))
        .catch((error) => done(error));
    });
  });

  it('should out compressed files to "options.dest" if argument "options.compress" is true.', (done) => {
    const cases = ['jpg', 'png', 'gif', 'svg', 'ico'],
          task = optimizeImage({
            src: `${path.src}/sample.{jpg,jpeg,png,gif,svg,ico}`,
            dest: path.dest,
            compress: true
          });

    task().on('finish', () => {
      const promise = Promise.all(cases.map((ext) => new Promise((resolve) => {
        const actualPath = `${path.dest}/sample.${ext}`,
              actual = fs.readFileSync(actualPath, {encode: null});

        if (ext === 'ico') {
          const expected = fs.readFileSync(`${path.expected}/sample.${ext}`, {encode: null});

          assert(actual);
          assert.deepStrictEqual(actual, expected);
          resolve();
        }
        else {
          const expectedPath = `${path.expected}/sample.compressed.${ext}`,
                expected = fs.readFileSync(expectedPath, {encode: null});

          assert(actual);
          assert.deepStrictEqual(actual, expected);
          resolve();
        }
      })));

      promise
        .then(() => done(null))
        .catch((error) => done(error));
    });
  });

  it('should throw no error if task run multiple.', async () => {
    const cases = ['jpg', 'png', 'gif', 'svg', 'ico'];

    await Promise.all(cases.map((ext) => {
      const srcPath = `${path.src}/sample.${ext}`,
            actualPath = `${path.dest}/sample.${ext}`,
            task = optimizeImage({
              src: `${path.src}/sample.${ext}`,
              dest: path.dest,
              evenize: true,
              placeholder: true,
              webp: true,
              compress: true
            });

      // 1st build
      const firstBuild = new Promise((resolve) => task().on('finish', () => {
        resolve();
      }));

      return firstBuild
        .then(() => {
          const expectedTime = new Date();

          // modify files
          return new Promise((resolve, reject) => {
            fs.utimes(srcPath, expectedTime, expectedTime, (error) => {
              if (error) {
                reject(error);
              }
              resolve(expectedTime);
            });
          });
        })
        .then((expectedTime) => new Promise((resolve, reject) => {

          // check dest file is modified or not
          task()
            .on('finish', () => {
              fs.stat(actualPath, (error, stats) => {
                if (error) {
                  reject(error);
                }

                assert(expectedTime <= stats.atime);
                assert(expectedTime <= stats.mtime);
                resolve();
              });
            });
        }))
        .finally(() => Promise.resolve());
    }));
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
