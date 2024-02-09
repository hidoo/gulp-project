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
import optimizeImage, {
  gifsicle,
  mozjpeg,
  optipng,
  svgo
} from '../src/index.js';

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

describe('gulp-task-optimize-image', () => {
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
      src: `${srcDir}/sample.{jpg,jpeg,png,gif,svg,ico}`,
      dest: destDir
    };
  });

  afterEach(async () => {
    await fs.rm(destDir, { recursive: true });
    await fs.mkdir(destDir);
  });

  it('should out optimized images.', async () => {
    const cases = ['jpg', 'png', 'gif', 'svg', 'ico'];
    const task = optimizeImage(opts);

    await new Promise((resolve) => task().on('finish', resolve));

    await Promise.all(
      cases.map(async (ext) => {
        const actual = await fs.readFile(`${destDir}/sample.${ext}`);
        const expected = await fs.readFile(`${expectedDir}/sample.${ext}`);
        const dimensions = sizeOf(actual);

        assert(actual);
        if (ext === 'svg' || ext === 'ico') {
          assert.deepEqual(actual, expected);
        } else {
          const differences = await comparePixels(
            actual,
            expected,
            [dimensions.width, dimensions.height],
            { diff: `${destDir}/sample.${ext}.diff.png` }
          );

          assert.equal(
            differences,
            0,
            `No differences are found between sample.${ext} files.`
          );
        }
      })
    );
  });

  it('should out evenized optimized images with options.evenize.', async () => {
    const cases = [
      ['10x9', 'jpg', [10, 10]],
      ['9x10', 'png', [10, 10]],
      ['9x9', 'gif', [10, 10]]
    ];
    const task = optimizeImage({
      ...opts,
      src: cases.map(([basename, ext]) => `${srcDir}/${basename}.${ext}`),
      evenize: true
    });

    await new Promise((resolve) => task().on('finish', resolve));

    await Promise.all(
      cases.map(async ([basename, ext, [width, height]]) => {
        const actual = await fs.readFile(`${destDir}/${basename}.${ext}`);
        const expected = await fs.readFile(
          `${expectedDir}/${basename}.evenized.${ext}`
        );
        const dimensions = sizeOf(actual);
        const differences = await comparePixels(
          actual,
          expected,
          [width, height],
          { diff: `${destDir}/${basename}.${ext}.diff.png` }
        );

        assert.equal(dimensions.width, width);
        assert.equal(dimensions.height, height);
        assert.equal(
          differences,
          0,
          `No differences are found between ${basename}.${ext} files.`
        );
      })
    );
  });

  it('should out placeholder images with options.placeholder.', async () => {
    const cases = [
      ['10x9', 'jpg'],
      ['9x10', 'png'],
      ['9x9', 'gif'],
      ['sample', 'svg']
    ];
    const task = optimizeImage({
      ...opts,
      src: cases.map(([basename, ext]) => `${srcDir}/${basename}.${ext}`),
      placeholder: true
    });

    await new Promise((resolve) => task().on('finish', resolve));

    await Promise.all(
      cases.map(async ([basename, ext]) => {
        const expected = {
          image: await fs.readFile(
            `${expectedDir}/${basename}.original.${ext}`
          ),
          placeholder: await fs.readFile(
            `${expectedDir}/${basename}.placeholder.png`
          )
        };
        const { width, height } = sizeOf(expected.image);

        const actual = await fs.readFile(`${destDir}/${basename}.${ext}`);
        const placeholder = await fs.readFile(
          `${destDir}/${basename}.placeholder.png`
        );
        const dimensions = sizeOf(placeholder);

        assert.equal(dimensions.width, width);
        assert.equal(dimensions.height, height);

        if (ext === 'svg') {
          assert.deepEqual(actual, expected.image);
        } else {
          assert.equal(
            await comparePixels(actual, expected.image, [width, height], {
              diff: `${destDir}/${basename}.${ext}.diff.png`
            }),
            0,
            `No differences are found between ${basename}.${ext} files.`
          );

          assert.equal(
            await comparePixels(
              placeholder,
              expected.placeholder,
              [dimensions.width, dimensions.height],
              { diff: `${destDir}/${basename}.placeholder.png.diff.png` }
            ),
            0,
            `No differences are found between ${basename}.placeholder.png files.`
          );
        }
      })
    );
  });

  it('should out webp images with options.webp.', async () => {
    const cases = [
      ['10x9', 'jpg'],
      ['9x10', 'png'],
      ['9x9', 'gif'],
      ['sample', 'svg']
    ];
    const task = optimizeImage({
      ...opts,
      src: cases.map(([basename, ext]) => `${srcDir}/${basename}.${ext}`),
      webp: true
    });

    await new Promise((resolve) => task().on('finish', resolve));

    await Promise.all(
      cases.map(async ([basename, ext]) => {
        const actual = await fs.readFile(`${destDir}/${basename}.${ext}`);
        const expected = await fs.readFile(
          `${expectedDir}/${basename}.original.${ext}`
        );

        if (ext === 'svg') {
          assert.deepEqual(actual, expected);
        } else {
          const { width, height } = sizeOf(actual);
          const differences = await comparePixels(
            actual,
            expected,
            [width, height],
            { diff: `${destDir}/${basename}.${ext}.diff.png` }
          );

          assert.equal(
            differences,
            0,
            `No differences are found between ${basename}.${ext} files.`
          );

          assert.deepEqual(
            await fs.readFile(`${destDir}/${basename}.${ext}.webp`),
            await fs.readFile(`${expectedDir}/${basename}.${ext}.webp`)
          );
        }
      })
    );
  });

  it('should out webp images with options.webp as object.', async () => {
    const cases = [
      ['10x9', 'jpg'],
      ['9x10', 'png'],
      ['9x9', 'gif'],
      ['sample', 'svg']
    ];
    const task = optimizeImage({
      ...opts,
      src: cases.map(([basename, ext]) => `${srcDir}/${basename}.${ext}`),
      webp: { keepExtname: false }
    });

    await new Promise((resolve) => task().on('finish', resolve));

    await Promise.all(
      cases.map(async ([basename, ext]) => {
        const actual = await fs.readFile(`${destDir}/${basename}.${ext}`);
        const expected = await fs.readFile(
          `${expectedDir}/${basename}.original.${ext}`
        );

        if (ext === 'svg') {
          assert.deepEqual(actual, expected);
        } else {
          const { width, height } = sizeOf(actual);
          const differences = await comparePixels(
            actual,
            expected,
            [width, height],
            { diff: `${destDir}/${basename}.${ext}.diff.png` }
          );

          assert.equal(
            differences,
            0,
            `No differences are found between ${basename}.${ext} files.`
          );

          assert.deepEqual(
            await fs.readFile(`${destDir}/${basename}.webp`),
            await fs.readFile(`${expectedDir}/${basename}.${ext}.webp`)
          );
        }
      })
    );
  });

  it('should out compressed files with options.compress.', async () => {
    const cases = ['jpg', 'png', 'gif', 'svg', 'ico'];
    const task = optimizeImage({
      ...opts,
      compress: true
    });

    await new Promise((resolve) => task().on('finish', resolve));

    await Promise.all(
      cases.map(async (ext) => {
        const actual = await fs.readFile(`${destDir}/sample.${ext}`);

        assert(actual);

        if (ext === 'ico') {
          const expected = await fs.readFile(`${expectedDir}/sample.${ext}`);

          assert.deepEqual(actual, expected);
        } else {
          const expected = await fs.readFile(
            `${expectedDir}/sample.compressed.${ext}`
          );

          assert.deepEqual(actual, expected, `.${ext} file is compressed.`);

          if (ext !== 'svg') {
            const { width, height } = sizeOf(actual);
            const differences = await comparePixels(
              actual,
              expected,
              [width, height],
              { diff: `${destDir}/sample.${ext}.diff.png` }
            );

            assert.equal(
              differences,
              0,
              `No differences are found between sample.${ext} files.`
            );
          }
        }
      })
    );
  });

  it('should throw no error if task run multiple.', async () => {
    const cases = ['jpg', 'png', 'gif', 'svg', 'ico'];

    await Promise.all(
      cases.map(async (ext) => {
        const src = `${srcDir}/sample.${ext}`;
        const dest = `${destDir}/sample.${ext}`;
        const task = optimizeImage({
          ...opts,
          src,
          evenize: true,
          placeholder: true,
          webp: true,
          compress: true
        });

        // 1st build
        await new Promise((resolve) => task().on('finish', resolve));

        const modifiedTime = new Date();

        // update file modified time
        await fs.utimes(src, modifiedTime, modifiedTime);

        // 2nd build
        await new Promise((resolve) => task().on('finish', resolve));

        const stats = await fs.stat(dest);

        assert(modifiedTime <= stats.atime);
        assert(modifiedTime <= stats.mtime);
      })
    );
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
