import assert from 'node:assert';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Vinyl from 'vinyl';
import sizeOf from 'image-size';
import pixelmatch from 'pixelmatch';
import getPixels from 'get-pixels';
import { fileTypeFromBuffer } from 'file-type';
import imagePlaceholder from '../src/index.js';

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

/**
 * compare pixels
 *
 * @param {Buffer} bufferA buffer A
 * @param {Buffer} bufferB buffer B
 * @param {Array<Number>} size width and height
 * @return {Promise<Number>}
 */
async function comparePixels(bufferA, bufferB, size) {
  const differences = pixelmatch(
    await getPixelsFromBuffer(bufferA),
    await getPixelsFromBuffer(bufferB),
    null,
    ...size,
    {
      threshold: 0.1
    }
  );

  return differences;
}

describe('gulp-plugin-image-placeholder', () => {
  let dirname = null;
  let fixturesDir = null;
  let cases = null;

  before(() => {
    dirname = path.dirname(fileURLToPath(import.meta.url));
    fixturesDir = path.resolve(dirname, 'fixtures');
    cases = [
      [
        path.resolve(fixturesDir, 'src', '9x9.gif'),
        [9, 9, path.resolve(fixturesDir, 'expected', '9x9.placeholder.png')]
      ],
      [
        path.resolve(fixturesDir, 'src', '9x10.png'),
        [9, 10, path.resolve(fixturesDir, 'expected', '9x10.placeholder.png')]
      ],
      [
        path.resolve(fixturesDir, 'src', '10x9.jpg'),
        [10, 9, path.resolve(fixturesDir, 'expected', '10x9.placeholder.png')]
      ],
      [
        path.resolve(fixturesDir, 'src', 'sample.svg'),
        [
          64,
          64,
          path.resolve(fixturesDir, 'expected', 'sample.placeholder.png')
        ]
      ]
    ];
  });

  it('should out original image and placeholder image with default options.', async () => {
    await Promise.all(
      cases.map(async ([src, [width, height, expected]]) => {
        const srcBuffer = await fs.readFile(src);
        const expectedBuffer = await fs.readFile(expected);

        await new Promise((resolve, reject) => {
          const plugin = imagePlaceholder({ verbose: false });
          let actualBuffer = null;
          let called = 0;

          plugin.on('error', reject);
          plugin.on('data', (file) => {
            const dimensions = sizeOf(file.contents);

            called += 1;

            // original image
            if (called === 1) {
              assert(file.isBuffer());
              assert.equal(dimensions.width, width);
              assert.equal(dimensions.height, height);
              assert.deepEqual(file.contents, srcBuffer);
            }
            // placeholder image
            else if (called === 2) {
              assert(file.isBuffer());
              assert.equal(dimensions.width, width);
              assert.equal(dimensions.height, height);
              actualBuffer = file.contents;
            }
          });
          plugin.on('end', async () => {
            assert.equal(called, 2);

            try {
              assert.equal(
                await comparePixels(actualBuffer, expectedBuffer, [
                  width,
                  height
                ]),
                0
              );
              resolve();
            } catch (error) {
              reject(error);
            }
          });

          plugin.write(
            new Vinyl({
              path: src,
              contents: Buffer.from(srcBuffer)
            })
          );
          plugin.end();
        });
      })
    );
  });

  it('should out placeholder image only with options.append = false.', async () => {
    await Promise.all(
      cases.map(async ([src, [width, height, expected]]) => {
        const srcBuffer = await fs.readFile(src);
        const expectedBuffer = await fs.readFile(expected);

        await new Promise((resolve, reject) => {
          const plugin = imagePlaceholder({ append: false, verbose: false });
          let actualBuffer = null;
          let called = 0;

          plugin.on('error', reject);
          plugin.on('data', (file) => {
            const dimensions = sizeOf(file.contents);

            called += 1;

            assert(file.isBuffer());
            assert.equal(dimensions.width, width);
            assert.equal(dimensions.height, height);
            actualBuffer = file.contents;
          });
          plugin.on('end', async () => {
            assert.equal(called, 1);

            try {
              assert.equal(
                await comparePixels(actualBuffer, expectedBuffer, [
                  width,
                  height
                ]),
                0
              );
              resolve();
            } catch (error) {
              reject(error);
            }
          });

          plugin.write(
            new Vinyl({
              path: src,
              contents: Buffer.from(srcBuffer)
            })
          );
          plugin.end();
        });
      })
    );
  });

  it('should out placeholder image with options.suffix.', async () => {
    await Promise.all(
      cases.map(async ([src, [width, height, expected]]) => {
        const srcBuffer = await fs.readFile(src);
        const expectedBuffer = await fs.readFile(expected);

        await new Promise((resolve, reject) => {
          const plugin = imagePlaceholder({ suffix: 'hoge', verbose: false });
          let actualBuffer = null;
          let called = 0;

          plugin.on('error', reject);
          plugin.on('data', (file) => {
            const dimensions = sizeOf(file.contents);

            called += 1;

            // original image
            if (called === 1) {
              assert(file.isBuffer());
              assert.equal(dimensions.width, width);
              assert.equal(dimensions.height, height);
              assert.deepEqual(file.contents, srcBuffer);
            }
            // placeholder image
            else if (called === 2) {
              assert(file.isBuffer());
              assert.equal(dimensions.width, width);
              assert.equal(dimensions.height, height);
              assert.equal(
                file.basename,
                `${path.basename(src, path.extname(src))}.hoge.png`
              );
              actualBuffer = file.contents;
            }
          });
          plugin.on('end', async () => {
            assert.equal(called, 2);

            try {
              assert.equal(
                await comparePixels(actualBuffer, expectedBuffer, [
                  width,
                  height
                ]),
                0
              );
              resolve();
            } catch (error) {
              reject(error);
            }
          });

          plugin.write(
            new Vinyl({
              path: src,
              contents: Buffer.from(srcBuffer)
            })
          );
          plugin.end();
        });
      })
    );
  });
});
