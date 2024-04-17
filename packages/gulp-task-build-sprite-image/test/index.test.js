/* eslint max-statements: off */

import assert from 'node:assert';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PNG } from 'pngjs';
import sizeOf from 'image-size';
import pixelmatch from 'pixelmatch';
import getPixels from 'get-pixels';
import { fileTypeFromBuffer } from 'file-type';
import * as imagemin from 'gulp-imagemin';
import buildSprite, { gifsicle, mozjpeg, optipng } from '../src/index.js';

/**
 * get pixels from buffers
 *
 * @param {Buffer} buffer buffer of image
 * @return {Promise<Uint8Array>}
 */
async function getPixelsFromBuffer(buffer) {
  const { mime } = await fileTypeFromBuffer(buffer);
  const pixels = await new Promise((resolve, reject) => {
    getPixels(buffer, mime, (error, pxls) => {
      if (error) {
        reject(error);
      } else {
        resolve(pxls);
      }
    });
  });

  return pixels.data;
}

/* eslint-disable max-params */
/**
 * compare pixels
 *
 * @param {Buffer} bufferA buffer A
 * @param {Buffer} bufferB buffer B
 * @param {Array<Number>} size width and height
 * @param {Object} options options
 * @return {Promise<Number>}
 */
async function comparePixels(bufferA, bufferB, size, options = {}) {
  const [width, height] = size;
  const { diff } = options;
  let png = null;

  if (diff) {
    png = new PNG({ width, height });
  }

  const differences = pixelmatch(
    await getPixelsFromBuffer(bufferA),
    await getPixelsFromBuffer(bufferB),
    png.data,
    ...size,
    {
      threshold: 0.1
    }
  );

  if (png) {
    await fs.writeFile(diff, PNG.sync.write(png));
  }

  return differences;
}
/* eslint-enable max-params */

describe('gulp-task-build-sprite-image', () => {
  let dirname = null;
  let fixturesDir = null;
  let srcDir = null;
  let destDir = null;
  let expectedDir = null;
  let opts = null;

  before(() => {
    dirname = path.dirname(fileURLToPath(import.meta.url));
    fixturesDir = path.resolve(dirname, 'fixtures');
    srcDir = path.resolve(fixturesDir, 'src');
    destDir = path.resolve(fixturesDir, 'dest');
    expectedDir = path.resolve(fixturesDir, 'expected');
    opts = {
      src: `${srcDir}/**/sample-*.png`,
      destImg: `${destDir}`,
      destCss: `${destDir}`,
      imgName: 'image-sprite.png',
      cssName: 'image-sprite.styl',
      imgPath: './image-sprite.png'
    };
  });

  afterEach(async () => {
    await fs.rm(destDir, { recursive: true });
    await fs.mkdir(destDir);
  });

  it('should output sprite sheet image and css files.', async () => {
    const files = [
      ['image-sprite.png', 'image-sprite.png'],
      ['image-sprite.styl', 'image-sprite.styl']
    ];
    const task = buildSprite(opts);

    await new Promise((resolve) => task().on('finish', resolve));

    await Promise.all(
      files.map(async ([act, exp]) => {
        const actual = await fs.readFile(path.join(destDir, act));
        const expected = await fs.readFile(path.join(expectedDir, exp));
        const isNotImage = act.match(/\.png$/) === null;

        assert(actual);

        if (isNotImage) {
          assert.deepEqual(actual, expected);
        } else {
          const dimensions = sizeOf(actual);
          const differences = await comparePixels(
            actual,
            expected,
            [dimensions.width, dimensions.height],
            { diff: path.join(destDir, `${exp}.diff.png`) }
          );

          assert.equal(
            differences,
            0,
            `No differences are found between ${act} files.`
          );
        }
      })
    );
  });

  it('should output sprite sheet image and css files with options.evenize.', async () => {
    const files = [
      ['image-sprite.png', 'image-sprite.evenized.png'],
      ['image-sprite.styl', 'image-sprite.evenized.styl']
    ];
    const task = buildSprite({
      ...opts,
      evenize: true
    });

    await new Promise((resolve) => task().on('finish', resolve));

    await Promise.all(
      files.map(async ([act, exp]) => {
        const actual = await fs.readFile(path.join(destDir, act));
        const expected = await fs.readFile(path.join(expectedDir, exp));
        const isNotImage = act.match(/\.png$/) === null;

        assert(actual);

        if (isNotImage) {
          assert.deepEqual(actual, expected);
        } else {
          const dimensions = sizeOf(actual);
          const differences = await comparePixels(
            actual,
            expected,
            [dimensions.width, dimensions.height],
            { diff: path.join(destDir, `${exp}.diff.png`) }
          );

          assert.equal(
            differences,
            0,
            `No differences are found between ${act} files.`
          );
        }
      })
    );
  });

  it('should output sprite sheet image and css files with options.compress.', async () => {
    const files = [
      ['image-sprite.png', 'image-sprite.compressed.png'],
      ['image-sprite.styl', 'image-sprite.compressed.styl']
    ];
    const task = buildSprite({
      ...opts,
      compress: true
    });

    await new Promise((resolve) => task().on('finish', resolve));

    await Promise.all(
      files.map(async ([act, exp]) => {
        const actual = await fs.readFile(path.join(destDir, act));
        const expected = await fs.readFile(path.join(expectedDir, exp));
        const isNotImage = act.match(/\.png$/) === null;

        assert(actual);

        if (isNotImage) {
          assert.deepEqual(actual, expected);
        } else {
          const dimensions = sizeOf(actual);
          const differences = await comparePixels(
            actual,
            expected,
            [dimensions.width, dimensions.height],
            { diff: path.join(destDir, `${exp}.diff.png`) }
          );

          assert.equal(
            differences,
            0,
            `No differences are found between ${act} files.`
          );
        }
      })
    );
  });

  it('should output sprite sheet image and css files with options.imgPath.', async () => {
    const files = [
      ['image-sprite.png', 'image-sprite.with-parameters.png'],
      ['image-sprite.styl', 'image-sprite.with-parameters.styl']
    ];
    const task = buildSprite({
      ...opts,
      imgPath: './image-sprite.png?version=0.0.0'
    });

    await new Promise((resolve) => task().on('finish', resolve));

    await Promise.all(
      files.map(async ([act, exp]) => {
        const actual = await fs.readFile(path.join(destDir, act));
        const expected = await fs.readFile(path.join(expectedDir, exp));
        const isNotImage = act.match(/\.png$/) === null;

        assert(actual);

        if (isNotImage) {
          assert.deepEqual(actual, expected);
        } else {
          const dimensions = sizeOf(actual);
          const differences = await comparePixels(
            actual,
            expected,
            [dimensions.width, dimensions.height],
            { diff: path.join(destDir, `${exp}.diff.png`) }
          );

          assert.equal(
            differences,
            0,
            `No differences are found between ${act} files.`
          );
        }
      })
    );
  });

  it('should output sprite sheet image and css files with options.cssPreprocessor = "sass".', async () => {
    const files = [
      ['image-sprite.png', 'image-sprite.png'],
      ['image-sprite.scss', 'image-sprite.scss']
    ];
    const task = buildSprite({
      ...opts,
      cssName: 'image-sprite.scss',
      cssPreprocessor: 'sass'
    });

    await new Promise((resolve) => task().on('finish', resolve));

    await Promise.all(
      files.map(async ([act, exp]) => {
        const actual = await fs.readFile(path.join(destDir, act));
        const expected = await fs.readFile(path.join(expectedDir, exp));
        const isNotImage = act.match(/\.png$/) === null;

        assert(actual);

        if (isNotImage) {
          assert.deepEqual(actual, expected);
        } else {
          const dimensions = sizeOf(actual);
          const differences = await comparePixels(
            actual,
            expected,
            [dimensions.width, dimensions.height],
            { diff: path.join(destDir, `${exp}.diff.png`) }
          );

          assert.equal(
            differences,
            0,
            `No differences are found between ${act} files.`
          );
        }
      })
    );
  });

  it('should output sprite sheet image and css files with options.cssPreprocessor = "sass:module".', async () => {
    const files = [
      ['image-sprite.png', 'image-sprite.png'],
      ['image-sprite.scss', 'image-sprite-module.scss']
    ];
    const task = buildSprite({
      ...opts,
      cssName: 'image-sprite.scss',
      cssPreprocessor: 'sass:module'
    });

    await new Promise((resolve) => task().on('finish', resolve));

    await Promise.all(
      files.map(async ([act, exp]) => {
        const actual = await fs.readFile(path.join(destDir, act));
        const expected = await fs.readFile(path.join(expectedDir, exp));
        const isNotImage = act.match(/\.png$/) === null;

        assert(actual);

        if (isNotImage) {
          assert.deepEqual(actual, expected);
        } else {
          const dimensions = sizeOf(actual);
          const differences = await comparePixels(
            actual,
            expected,
            [dimensions.width, dimensions.height],
            { diff: path.join(destDir, `${exp}.diff.png`) }
          );

          assert.equal(
            differences,
            0,
            `No differences are found between ${act} files.`
          );
        }
      })
    );
  });

  it('should output sprite sheet image and css files with options.cssTemplate. (ignore "options.cssPreprocessor")', async () => {
    const files = [
      ['image-sprite.png', 'image-sprite.png'],
      ['image-sprite.css', 'image-sprite.css']
    ];
    const task = buildSprite({
      ...opts,
      cssName: 'image-sprite.css',
      cssPreprocessor: 'stylus',
      cssTemplate: `${srcDir}/custom-template.hbs`
    });

    await new Promise((resolve) => task().on('finish', resolve));

    await Promise.all(
      files.map(async ([act, exp]) => {
        const actual = await fs.readFile(path.join(destDir, act));
        const expected = await fs.readFile(path.join(expectedDir, exp));
        const isNotImage = act.match(/\.png$/) === null;

        assert(actual);

        if (isNotImage) {
          assert.deepEqual(actual, expected);
        } else {
          const dimensions = sizeOf(actual);
          const differences = await comparePixels(
            actual,
            expected,
            [dimensions.width, dimensions.height],
            { diff: path.join(destDir, `${exp}.diff.png`) }
          );

          assert.equal(
            differences,
            0,
            `No differences are found between ${act} files.`
          );
        }
      })
    );
  });

  describe('exports imagemin plugins', () => {
    it('should be accessible to imagemin plugins', () => {
      assert(imagemin.gifsicle === gifsicle);
      assert(imagemin.mozjpeg === mozjpeg);
      assert(imagemin.optipng === optipng);
    });
  });
});
