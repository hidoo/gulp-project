import assert from 'node:assert';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Vinyl from 'vinyl';
import sizeOf from 'image-size';
import pixelmatch from 'pixelmatch';
import getPixels from 'get-pixels';
import { fileTypeFromBuffer } from 'file-type';
import imageEvenizer from '../src/index.js';

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

describe('gulp-plugin-image-evenizer', () => {
  let dirname = null;
  let fixturesDir = null;
  let expectedDir = null;

  before(() => {
    dirname = path.dirname(fileURLToPath(import.meta.url));
    fixturesDir = path.resolve(dirname, 'fixtures');
    expectedDir = path.resolve(dirname, 'expected');
  });

  it('should out evenized image with odd width or odd height.', async () => {
    const cases = [
      [
        path.resolve(fixturesDir, 'alpha-channel.gif'),
        [10, 10, path.resolve(expectedDir, '9x9.gif')]
      ],
      [
        path.resolve(fixturesDir, '9x9.gif'),
        [10, 10, path.resolve(expectedDir, '9x9.gif')]
      ],
      [
        path.resolve(fixturesDir, '9x10.png'),
        [10, 10, path.resolve(expectedDir, '9x10.png')]
      ],
      [
        path.resolve(fixturesDir, '10x9.jpg'),
        [10, 10, path.resolve(expectedDir, '10x9.jpg')]
      ],
      [
        path.resolve(fixturesDir, '10x10.gif'),
        [10, 10, path.resolve(expectedDir, '10x10.gif')]
      ],
      [
        path.resolve(fixturesDir, '10x10.png'),
        [10, 10, path.resolve(expectedDir, '10x10.png')]
      ],
      [
        path.resolve(fixturesDir, '10x10.jpg'),
        [10, 10, path.resolve(expectedDir, '10x10.jpg')]
      ],
      [
        path.resolve(fixturesDir, 'sample-a.png'),
        [66, 62, path.resolve(expectedDir, 'sample-a.png')]
      ],
      [
        path.resolve(fixturesDir, 'sample-b.png'),
        [66, 62, path.resolve(expectedDir, 'sample-b.png')]
      ],
      [
        path.resolve(fixturesDir, 'sample-c.png'),
        [80, 64, path.resolve(expectedDir, 'sample-c.png')]
      ],
      [
        path.resolve(fixturesDir, 'sample-d.jpg'),
        [80, 64, path.resolve(expectedDir, 'sample-d.jpg')]
      ]
    ];

    await Promise.all(
      cases.map(async ([src, [width, height, expected]]) => {
        const srcBuffer = await fs.readFile(src);
        const expectedBuffer = await fs.readFile(expected);

        await new Promise((resolve, reject) => {
          const plugin = imageEvenizer({ verbose: false });
          let actualBuffer = null;

          plugin.on('error', reject);
          plugin.once('data', (file) => {
            const dimensions = sizeOf(file.contents);

            assert(file.isBuffer());
            assert.equal(dimensions.width, width);
            assert.equal(dimensions.height, height);
            actualBuffer = file.contents;
          });
          plugin.on('end', async () => {
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

  it('should out original image if image is animation gif.', async () => {
    const cases = [[path.resolve(fixturesDir, 'animation.gif'), [9, 9]]];

    await Promise.all(
      cases.map(async ([src, [width, height]]) => {
        const srcBuffer = await fs.readFile(src);

        await new Promise((resolve, reject) => {
          const plugin = imageEvenizer({ verbose: false });

          plugin.on('error', reject);
          plugin.once('data', (file) => {
            const dimensions = sizeOf(file.contents);

            assert(file.isBuffer());
            assert.equal(dimensions.width, width);
            assert.equal(dimensions.height, height);
            assert.deepEqual(file.contents, srcBuffer);
          });
          plugin.on('end', resolve);
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
