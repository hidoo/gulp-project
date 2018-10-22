/* eslint max-len: 0, no-magic-numbers: 0 */

import assert from 'assert';
import fs from 'fs';
import {basename, extname} from 'path';
import Vinyl from 'vinyl';
import sizeOf from 'image-size';
import pixelmatch from 'pixelmatch';
import imagePlaceholder from '../src';

describe('gulp-plugin-image-placeholder', () => {
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

  it('should out original image and placeholder image if options is default.', async () =>
    await Promise.all(cases.map(([path, expected]) => new Promise((resolve, reject) => {
      const plugin = imagePlaceholder({verbose: false}),
            src = fs.readFileSync(path, {encode: null}),
            fakeFile = new Vinyl({
              path: path,
              contents: Buffer.from(src)
            });
      let called = 0;

      plugin.on('data', (file) => {
        const [width, height, expectedPath] = expected,
              dimentions = sizeOf(file.contents);

        called += 1;

        // original image
        if (called === 1) {
          const countDiffPixels = pixelmatch(
            file.contents,
            src,
            null,
            width, height, {threshold: 0.1}
          );

          assert(file.isBuffer());
          assert(dimentions.width === width);
          assert(dimentions.height === height);
          assert(countDiffPixels === 0);
        }
        // placeholder image
        else if (called === 2) {
          const countDiffPixels = pixelmatch(
            file.contents,
            fs.readFileSync(expectedPath),
            null,
            width, height, {threshold: 0.1}
          );

          assert(file.isBuffer());
          assert(dimentions.width === width);
          assert(dimentions.height === height);
          assert(countDiffPixels === 0);
        }
      });
      plugin.on('error', reject);
      plugin.on('end', () => {
        assert(called === 2);
        resolve();
      });

      plugin.write(fakeFile);

      plugin.end();
    })))
  );

  it('should out placeholder image only if options.append is false.', async () =>
    await Promise.all(cases.map(([path, expected]) => new Promise((resolve, reject) => {
      const plugin = imagePlaceholder({append: false, verbose: false}),
            src = fs.readFileSync(path, {encode: null}),
            fakeFile = new Vinyl({
              path: path,
              contents: Buffer.from(src)
            });
      let called = 0;

      plugin.on('data', (file) => {
        const [width, height, expectedPath] = expected,
              dimentions = sizeOf(file.contents);

        called += 1;

        const countDiffPixels = pixelmatch(
          file.contents,
          fs.readFileSync(expectedPath),
          null,
          width, height, {threshold: 0.1}
        );

        assert(file.isBuffer());
        assert(dimentions.width === width);
        assert(dimentions.height === height);
        assert(countDiffPixels === 0);
      });
      plugin.on('error', reject);
      plugin.on('end', () => {
        assert(called === 1);
        resolve();
      });

      plugin.write(fakeFile);

      plugin.end();
    })))
  );

  it('should out placeholder image to filepath that applied specified suffix', async () =>
    await Promise.all(cases.map(([path, expected]) => new Promise((resolve, reject) => {
      const plugin = imagePlaceholder({suffix: 'hoge', verbose: false}),
            src = fs.readFileSync(path, {encode: null}),
            fakeFile = new Vinyl({
              path: path,
              contents: Buffer.from(src)
            });
      let called = 0;

      plugin.on('data', (file) => {
        const [width, height, expectedPath] = expected,
              dimentions = sizeOf(file.contents);

        called += 1;

        if (called === 2) {
          const countDiffPixels = pixelmatch(
            file.contents,
            fs.readFileSync(expectedPath),
            null,
            width, height, {threshold: 0.1}
          );

          assert(file.isBuffer());
          assert(file.basename === `${basename(path, extname(path))}.hoge.png`);
          assert(dimentions.width === width);
          assert(dimentions.height === height);
          assert(countDiffPixels === 0);
        }
      });
      plugin.on('error', reject);
      plugin.on('end', () => {
        assert(called === 2);
        resolve();
      });

      plugin.write(fakeFile);

      plugin.end();
    })))
  );

});
