/* eslint max-len: 0, no-magic-numbers: 0 */

import assert from 'node:assert';
import fs from 'node:fs';
import {dirname, basename, extname} from 'node:path';
import {fileURLToPath} from 'node:url';
import Vinyl from 'vinyl';
import sizeOf from 'image-size';
import pixelmatch from 'pixelmatch';
import getPixels from 'get-pixels';
import FileType from 'file-type';
import imagePlaceholder from '../src/index.js';

/**
 * get array of uint8array from buffers
 *
 * @param {Buffer} buffers array of buffer of image
 * @return {Promise}
 */
function getUint8ArraysFromBuffers(buffers) {
  return Promise.all(
    buffers.map((buffer) => FileType.fromBuffer(buffer)
      .then(({mime}) => new Promise((resolve, reject) => {
        getPixels(buffer, mime, (error, pixels) => {
          if (error) {
            return reject(error);
          }
          return resolve(pixels.data);
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
    (resolve, reject) => getUint8ArraysFromBuffers([actualBuffer, expectedBuffer])
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
        return resolve();
      })
      .catch((error) => reject(error))
  )));
}

describe('gulp-plugin-image-placeholder', () => {
  const __dirname = dirname(fileURLToPath(import.meta.url));
  const cases = [
    [
      `${__dirname}/fixtures/src/9x9.gif`,
      [9, 9, `${__dirname}/fixtures/expected/9x9.placeholder.png`]
    ],
    [
      `${__dirname}/fixtures/src/9x10.png`,
      [9, 10, `${__dirname}/fixtures/expected/9x10.placeholder.png`]
    ],
    [
      `${__dirname}/fixtures/src/10x9.jpg`,
      [10, 9, `${__dirname}/fixtures/expected/10x9.placeholder.png`]
    ],
    [
      `${__dirname}/fixtures/src/sample.svg`,
      [64, 64, `${__dirname}/fixtures/expected/sample.placeholder.png`]
    ]
  ];

  it('should out original image and placeholder image if options is default.', async () => {
    await Promise.all(cases.map(([path, [width, height, expectedPath]]) => new Promise((resolve, reject) => {
      const plugin = imagePlaceholder({verbose: false}),
            srcBuffer = fs.readFileSync(path, {encode: null}),
            expectedBuffer = fs.readFileSync(expectedPath, {encode: null}),
            fakeFile = new Vinyl({
              path,
              contents: Buffer.from(srcBuffer)
            });

      const params = [];
      let called = 0;

      plugin.on('data', (file) => {
        const dimentions = sizeOf(file.contents);

        called += 1;

        // original image
        if (called === 1) {
          assert(file.isBuffer());
          assert(dimentions.width === width);
          assert(dimentions.height === height);
          assert.deepStrictEqual(file.contents, srcBuffer);
        }
        // placeholder image
        else if (called === 2) {
          assert(file.isBuffer());
          assert(dimentions.width === width);
          assert(dimentions.height === height);
          params.push([file.contents, expectedBuffer, width, height]);
        }
      });
      plugin.on('error', reject);
      plugin.on('end', () => {
        assert(called === 2);
        comparePixels(params)
          .then(resolve)
          .catch(reject);
      });

      plugin.write(fakeFile);

      plugin.end();
    })));
  });

  it('should out placeholder image only if options.append is false.', async () => {
    await Promise.all(cases.map(([path, [width, height, expectedPath]]) => new Promise((resolve, reject) => {
      const plugin = imagePlaceholder({append: false, verbose: false}),
            srcBuffer = fs.readFileSync(path, {encode: null}),
            expectedBuffer = fs.readFileSync(expectedPath, {encode: null}),
            fakeFile = new Vinyl({
              path,
              contents: Buffer.from(srcBuffer)
            });

      const params = [];
      let called = 0;

      plugin.on('data', (file) => {
        const dimentions = sizeOf(file.contents);

        called += 1;

        assert(file.isBuffer());
        assert(dimentions.width === width);
        assert(dimentions.height === height);
        params.push([file.contents, expectedBuffer, width, height]);
      });
      plugin.on('error', reject);
      plugin.on('end', () => {
        assert(called === 1);
        comparePixels(params)
          .then(resolve)
          .catch(reject);
      });

      plugin.write(fakeFile);

      plugin.end();
    })));
  });

  it('should out placeholder image to filepath that applied specified suffix', async () => {
    await Promise.all(cases.map(([path, [width, height, expectedPath]]) => new Promise((resolve, reject) => {
      const plugin = imagePlaceholder({suffix: 'hoge', verbose: false}),
            srcBuffer = fs.readFileSync(path, {encode: null}),
            expectedBuffer = fs.readFileSync(expectedPath, {encode: null}),
            fakeFile = new Vinyl({
              path,
              contents: Buffer.from(srcBuffer)
            });

      const params = [];
      let called = 0;

      plugin.on('data', (file) => {
        const dimentions = sizeOf(file.contents);

        called += 1;

        // original image
        if (called === 1) {
          assert(file.isBuffer());
          assert(dimentions.width === width);
          assert(dimentions.height === height);
          assert.deepStrictEqual(file.contents, srcBuffer);
        }
        // placeholder image
        if (called === 2) {
          assert(file.isBuffer());
          assert(file.basename === `${basename(path, extname(path))}.hoge.png`);
          assert(dimentions.width === width);
          assert(dimentions.height === height);
          params.push([file.contents, expectedBuffer, width, height]);
        }
      });
      plugin.on('error', reject);
      plugin.on('end', () => {
        assert(called === 2);
        comparePixels(params)
          .then(resolve)
          .catch(reject);
      });

      plugin.write(fakeFile);

      plugin.end();
    })));
  });

});
