/* eslint max-len: 0, no-magic-numbers: 0 */

import assert from 'assert';
import fs from 'fs';
import Vinyl from 'vinyl';
import sizeOf from 'image-size';
import pixelmatch from 'pixelmatch';
import getPixels from 'get-pixels';
import fileType from 'file-type';
import imageEvenizer from '../src';

/**
 * get array of uint8array from buffers
 * @param {Buffer} buffers array of buffer of image
 * @return {Promise}
 */
function getUint8ArraysFromBuffers(buffers) {
  return Promise.all(buffers.map((buffer) => new Promise((resolve, reject) => {
    const {mime} = fileType(buffer);

    getPixels(buffer, mime, (error, pixels) => {
      if (error) {
        return reject(error);
      }
      return resolve(pixels.data);
    });
  })));
}

describe('gulp-plugin-image-evenizer', () => {

  it('should out evenized image if image width or height is odd number.', async () => {
    const cases = [
      [
        `${__dirname}/fixtures/alpha-channel.gif`,
        [10, 10, `${__dirname}/expected/9x9.gif`]
      ],
      [
        `${__dirname}/fixtures/9x9.gif`,
        [10, 10, `${__dirname}/expected/9x9.gif`]
      ],
      [
        `${__dirname}/fixtures/9x10.png`,
        [10, 10, `${__dirname}/expected/9x10.png`]
      ],
      [
        `${__dirname}/fixtures/10x9.jpg`,
        [10, 10, `${__dirname}/expected/10x9.jpg`]
      ],
      [
        `${__dirname}/fixtures/10x10.gif`,
        [10, 10, `${__dirname}/expected/10x10.gif`]
      ],
      [
        `${__dirname}/fixtures/10x10.png`,
        [10, 10, `${__dirname}/expected/10x10.png`]
      ],
      [
        `${__dirname}/fixtures/10x10.jpg`,
        [10, 10, `${__dirname}/expected/10x10.jpg`]
      ],
      [
        `${__dirname}/fixtures/sample-a.png`,
        [66, 62, `${__dirname}/expected/sample-a.png`]
      ],
      [
        `${__dirname}/fixtures/sample-b.png`,
        [66, 62, `${__dirname}/expected/sample-b.png`]
      ],
      [
        `${__dirname}/fixtures/sample-c.png`,
        [80, 64, `${__dirname}/expected/sample-c.png`]
      ],
      [
        `${__dirname}/fixtures/sample-d.jpg`,
        [80, 64, `${__dirname}/expected/sample-d.jpg`]
      ]
    ];

    return await Promise.all(cases.map(([path, [width, height, expectedPath]]) => new Promise((resolve, reject) => {
      const plugin = imageEvenizer({verbose: false}),
            srcBuffer = fs.readFileSync(path, {encode: null}),
            expectedBuffer = fs.readFileSync(expectedPath),
            fakeFile = new Vinyl({
              path: path,
              contents: Buffer.from(srcBuffer)
            });
      let evenizedBuffer = null;

      plugin.once('data', (file) => {
        const dimentions = sizeOf(file.contents);

        assert(file.isBuffer());
        assert(dimentions.width === width);
        assert(dimentions.height === height);
        evenizedBuffer = file.contents;
      });
      plugin.on('error', reject);
      plugin.on('end', () => {
        getUint8ArraysFromBuffers([evenizedBuffer, expectedBuffer])
          .then((pixels) => {
            const [evenizedPixels, expectedPixels] = pixels,
                  countDiffPixels = pixelmatch(
                    evenizedPixels,
                    expectedPixels,
                    null,
                    width, height, {threshold: 0.1}
                  );

            assert(countDiffPixels === 0);
            return resolve();
          })
          .catch((error) => reject(error));
      });

      plugin.write(fakeFile);

      plugin.end();
    })));
  });

  it('should out original image if image is animation gif.', async () => {
    const cases = [
      [`${__dirname}/fixtures/animation.gif`, [9, 9]]
    ];

    return await Promise.all(cases.map(([path, [width, height]]) => new Promise((resolve, reject) => {
      const plugin = imageEvenizer({verbose: false}),
            src = fs.readFileSync(path, {encode: null}),
            fakeFile = new Vinyl({
              path: path,
              contents: Buffer.from(src)
            });

      plugin.once('data', (file) => {
        const dimentions = sizeOf(file.contents);

        assert(file.isBuffer());
        assert(dimentions.width === width);
        assert(dimentions.height === height);
        assert.deepStrictEqual(file.contents, src);
      });
      plugin.on('error', reject);
      plugin.on('end', resolve);

      plugin.write(fakeFile);

      plugin.end();
    })));
  });
});
